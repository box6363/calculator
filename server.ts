import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { 
  renderServerHtml, 
  generateDynamicSitemap, 
  generateRobotsTxt 
} from "./src/server/seoPrerender";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable trust proxy for Cloudflare (CF-Connecting-IP, CF-IPCountry, X-Forwarded-Proto)
  app.set("trust proxy", true);

  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Global HTTP Security Headers (Cloudflare & Core Web Vitals best practices)
  app.use((_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Helper to determine active base URL from environment or request headers
  const getBaseUrl = (req: express.Request): string => {
    if (process.env.APP_URL) {
      return process.env.APP_URL.replace(/\/+$/, '');
    }
    const forwardedProto = req.headers['x-forwarded-proto'] as string;
    const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol;
    const host = req.get('host') || 'web-calculator.com';
    return `${protocol}://${host}`;
  };

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Dynamic International Sitemap for 20 markets & 9 tools (Cloudflare & Google Search Console ready)
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const xml = generateDynamicSitemap(baseUrl);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(xml);
  });

  // Dynamic robots.txt pointing to dynamic sitemap
  app.get("/robots.txt", (req, res) => {
    const baseUrl = getBaseUrl(req);
    const txt = generateRobotsTxt(baseUrl);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(txt);
  });

  // Gemini AI endpoint for answering & explaining math / calculations / multimodal files
  app.post("/api/gemini/answer", async (req, res) => {
    try {
      const { prompt, context, toolName, file } = req.body;

      if ((!prompt || typeof prompt !== "string" || !prompt.trim()) && !file) {
        return res.status(400).json({ error: "Vui lòng cung cấp câu hỏi, biểu thức hoặc tệp đính kèm cần giải đáp." });
      }

      const effectivePrompt = (prompt && typeof prompt === "string" && prompt.trim()) 
        ? prompt.trim() 
        : "Hãy đọc, giải chi tiết bài toán hoặc phân tích nội dung trong tệp đính kèm này.";

      const ai = getGenAI();

      const systemInstruction = `Bạn là Trợ lý AI Chuyên gia Giải Toán, Tính toán & Phân tích Đa phương thức cao cấp của ứng dụng Web Calculator.

QUY TẮC NHẬN DIỆN VÀ GIẢI BÀI TẬP TỪ HÌNH ẢNH / TỆP ĐA PHƯƠNG THỨC (CỰC KỲ QUAN TRỌNG):
1. Tính nhất quán và Trích xuất đề bài (Chain-of-Thought OCR Grounding):
   - Khi nhận được ảnh bài tập, ĐẦU TIÊN bạn BẮT BUỘC phải hiển thị mục "**1. Đề bài nhận diện từ hình ảnh:**" và chép lại trung thực, chính xác tuyệt đối từng con số, dấu phép tính (+, -, ×, ÷), biến số và phương trình có trong ảnh dưới dạng KaTeX ($...$).
   - Tuyệt đối không tự ý suy diễn hoặc thay đổi số liệu so với hình ảnh. Nếu ảnh có chữ viết tay mờ hoặc có nhiều câu, hãy liệt kê rõ từng câu (ví dụ: Câu 1, Câu 2...).
2. Phương pháp sư phạm chuẩn mực SGK:
   - Mục "**2. Hướng dẫn & Các bước giải chi tiết:**": Luôn trình bày cách giải chuẩn mực theo sách giáo khoa trước. Giải thích rõ ràng từng bước biến đổi, công thức áp dụng (ví dụ: $\\Delta = b^2 - 4ac$, Vi-ét, lượng giác...).
   - Nếu có thể, hãy chỉ ra thêm cách giải nhanh hoặc mẹo kiểm tra lại kết quả.
3. Quy chuẩn công thức toán học KaTeX:
   - Đặt tất cả biểu thức toán, biến số ($x, y, a, b...$) và phương trình trong cặp dấu $...$ (trong dòng) hoặc $$...$$ (căn giữa khối).
   - Dùng cú pháp LaTeX chuẩn KaTeX: phân số $\\frac{a}{b}$, căn bậc hai $\\sqrt{x}$, dấu nhân $\\cdot$, ký hiệu $\\Delta$.
4. Kết luận rõ ràng:
   - Luôn kết thúc bằng mục "**3. Kết luận:**" nêu rõ đáp số cuối cùng hoặc tập nghiệm $S$ in đậm.
${toolName ? `Công cụ người dùng đang tương tác: ${toolName}.` : ""}
${context ? `Dữ liệu và kết quả tính hiện tại: ${context}` : ""}`;

      let contents: any;
      if (file && file.extractedText && typeof file.extractedText === "string") {
        // Handle extracted content from Excel (.xlsx, .xls), Word (.docx, .doc), CSV, TXT
        const docName = file.name || "tài liệu";
        const docCategory = file.category || "văn bản/bảng tính";
        const textContent = file.extractedText.slice(0, 120000); // limit to reasonable length
        const composedPrompt = `[Tài liệu đính kèm: "${docName}" - Phân loại: ${docCategory}]\n\`\`\`\n${textContent}\n\`\`\`\n\n[Yêu cầu/Câu hỏi của người dùng]:\n${effectivePrompt}`;
        contents = composedPrompt;
      } else if (file && file.data && file.mimeType) {
        let base64Data = file.data;
        if (base64Data.includes(";base64,")) {
          base64Data = base64Data.split(";base64,")[1];
        }
        // Sanitize base64 payload to prevent binary corruption from newlines or spaces
        base64Data = base64Data.replace(/[\r\n\s]+/g, "");

        let lowerMime = file.mimeType.toLowerCase();
        if (lowerMime === "image/jpg") {
          lowerMime = "image/jpeg";
        }

        const allowedMimes = [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
          "application/pdf",
          "text/plain",
          "text/csv",
          "text/markdown"
        ];

        if (!allowedMimes.includes(lowerMime)) {
          return res.status(400).json({ 
            error: "Định dạng tệp không được hỗ trợ. Vui lòng tải ảnh (PNG, JPG, WebP), file PDF, Excel (XLSX, XLS) hoặc Word (DOCX, DOC)." 
          });
        }

        const filePart = {
          inlineData: {
            data: base64Data,
            mimeType: lowerMime,
          },
        };

        const isImage = lowerMime.startsWith("image/") || file.category === "image";
        const imagePrompt = isImage
          ? `[YÊU CẦU BẮT BUỘC CHO HÌNH ẢNH BÀI TẬP]:
Bước 1: Trích xuất và chép lại chính xác 100% đề bài, biểu thức toán học hoặc câu hỏi nhìn thấy từ hình ảnh (dùng KaTeX $...$).
Bước 2: Giải chi tiết từng bước theo phương pháp sư phạm chuẩn SGK.
Bước 3: Kết luận rõ ràng đáp số.

[Câu hỏi/Yêu cầu từ người dùng]: ${effectivePrompt}`
          : effectivePrompt;

        const textPart = {
          text: imagePrompt,
        };

        contents = { parts: [filePart, textPart] };
      } else {
        contents = effectivePrompt;
      }

      // Candidate models in order of preference: Primary -> Alias -> Lightweight high-throughput
      const candidateModels = [
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite",
      ];

      let lastError: any = null;
      let response: any = null;

      for (const model of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
                temperature: 0.1, // Deterministic temperature for math precision and consistent OCR
              },
            });
            if (response?.text) {
              break;
            }
          } catch (err: any) {
            lastError = err;
            const errStr = String(err?.message || err || "");
            const isTransient = 
              errStr.includes("503") || 
              errStr.includes("UNAVAILABLE") || 
              errStr.includes("high demand") || 
              errStr.includes("429") || 
              errStr.includes("RESOURCE_EXHAUSTED") ||
              errStr.includes("ECONNRESET") ||
              errStr.includes("fetch failed");

            console.warn(`[Gemini API] Attempt ${attempt + 1} with ${model} failed: ${errStr.slice(0, 100)}`);

            if (isTransient && attempt === 0) {
              // Quick backoff before 1 retry on the same model
              await new Promise((resolve) => setTimeout(resolve, 800));
              continue;
            }
            // Move to next candidate model
            break;
          }
        }

        if (response?.text) {
          break;
        }
      }

      if (!response?.text) {
        throw lastError || new Error("Không thể nhận phản hồi từ các mô hình AI.");
      }

      const answerText = response.text || "Xin lỗi, hiện tại không nhận được câu trả lời từ AI.";
      return res.json({ answer: answerText });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      const isMissingKey = !process.env.GEMINI_API_KEY;
      if (isMissingKey) {
        return res.status(503).json({
          error: "Khóa API GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập trong Settings > Secrets.",
        });
      }

      const rawMsg = String(error?.message || error || "");
      let friendlyMsg = "Đã xảy ra lỗi khi kết nối với Gemini AI. Vui lòng thử lại.";

      if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
        friendlyMsg = "Mô hình AI hiện đang có lượng truy vấn rất cao từ Google (503 Service Unavailable). Hệ thống đã tự động thử các mô hình dự phòng. Vui lòng bấm 'Thử lại' sau 10-15 giây.";
      } else if (rawMsg.includes("429") || rawMsg.includes("RESOURCE_EXHAUSTED")) {
        friendlyMsg = "Hệ thống AI đạt giới hạn tần suất yêu cầu tạm thời (429 Rate Limit). Vui lòng đợi vài giây và bấm 'Thử lại'.";
      } else if (rawMsg.includes("API key not valid") || rawMsg.includes("API_KEY_INVALID")) {
        friendlyMsg = "Khóa API GEMINI_API_KEY không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại cấu hình.";
      }

      return res.status(503).json({ error: friendlyMsg });
    }
  });

  // =========================================================================
  // CUSTOMER DATABASE & GOOGLE OAUTH 2.0 / SUBSCRIPTION APIS
  // =========================================================================
  const CUSTOMERS_FILE = path.join(process.cwd(), "data", "customers.json");

  function getCustomersFromFile(): any[] {
    try {
      if (fs.existsSync(CUSTOMERS_FILE)) {
        const raw = fs.readFileSync(CUSTOMERS_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading customers.json:", e);
    }
    return [];
  }

  function saveCustomersToFile(customers: any[]): void {
    try {
      const dir = path.dirname(CUSTOMERS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing customers.json:", e);
    }
  }

  // Google OAuth 2.0 Callback Handler (handles token or code redirect from Google OAuth Popup)
  app.get(["/google-callback", "/auth/callback"], (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Đang xác thực Google... | Web Calculator</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0f1020;
      color: #f8fafc;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: rgba(27, 29, 51, 0.85);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 24px;
      padding: 36px 30px;
      max-width: 420px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      backdrop-filter: blur(10px);
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255,255,255,0.15);
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h3 { margin: 0 0 10px; font-size: 18px; color: #fff; }
    p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h3>Đang xác thực Google OAuth</h3>
    <p id="status-text">Đang đồng bộ tài khoản Google vào hệ thống Web Calculator...</p>
  </div>

  <script>
    (async function() {
      try {
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const hashParams = new URLSearchParams(hash);
        const searchParams = new URLSearchParams(search);

        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const idToken = hashParams.get('id_token') || searchParams.get('id_token');

        let userInfo = null;

        if (accessToken) {
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: 'Bearer ' + accessToken }
            });
            if (res.ok) {
              userInfo = await res.json();
            }
          } catch (e) {
            console.warn('Lỗi fetch Google userinfo:', e);
          }
        }

        if (!userInfo && idToken) {
          try {
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            userInfo = JSON.parse(jsonPayload);
          } catch (e) {
            console.warn('Lỗi giải mã Google id_token:', e);
          }
        }

        if (userInfo && userInfo.email) {
          const email = userInfo.email.trim().toLowerCase();
          const name = userInfo.name || email.split('@')[0];
          const avatar = userInfo.picture || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(email));

          const syncRes = await fetch('/api/customers/login-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, avatar, plan: 'free' })
          });
          const syncData = await syncRes.json();
          const customer = (syncData.success && syncData.customer) ? syncData.customer : { email, name, avatar, plan: 'free' };

          try {
            localStorage.setItem('webcalculator_user', JSON.stringify(customer));
          } catch (e) {}

          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', customer: customer }, '*');
            document.getElementById('status-text').innerText = 'Đăng nhập thành công! Đang đóng cửa sổ...';
            setTimeout(function() { window.close(); }, 300);
          } else {
            document.getElementById('status-text').innerText = 'Đăng nhập thành công! Đang chuyển hướng...';
            setTimeout(function() { window.location.href = '/?auth=success'; }, 500);
          }
        } else {
          document.getElementById('status-text').innerText = 'Không nhận diện được thông tin Google. Đang quay lại...';
          setTimeout(function() {
            if (window.opener && !window.opener.closed) window.close();
            else window.location.href = '/';
          }, 1800);
        }
      } catch (err) {
        console.error('Lỗi callback:', err);
        document.getElementById('status-text').innerText = 'Lỗi xác thực: ' + (err.message || 'Không xác định');
        setTimeout(function() {
          if (window.opener && !window.opener.closed) window.close();
          else window.location.href = '/';
        }, 2200);
      }
    })();
  </script>
</body>
</html>`);
  });

  // POST /api/auth/signup - Đăng ký tài khoản mới qua Google
  app.post("/api/auth/signup", (req, res) => {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Thiếu email đăng ký" });
    }

    const customers = getCustomersFromFile();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = customers.find(
      (c: any) => c.email && c.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        alreadyExists: true,
        error: "Tài khoản với email này đã tồn tại trên hệ thống. Vui lòng chuyển sang tab Đăng nhập.",
      });
    }

    const newStt = customers.length + 1;
    const now = new Date();
    const part = (normalizedEmail.split("@")[0] || "User").trim();
    const formattedName =
      name?.trim() ||
      part
        .split(/[\._\- ]+/)
        .filter(Boolean)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const newCustomer = {
      id: `cust_${Date.now()}`,
      stt: newStt,
      email: normalizedEmail,
      name: formattedName,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      plan: "free",
      price: 0,
      currency: "USD",
      paymentMethod: "google_signup",
      subscribedAt: now.toISOString(),
      expiresAt: null,
      status: "active",
      lastLoginAt: now.toISOString()
    };

    customers.push(newCustomer);
    saveCustomersToFile(customers);

    return res.json({
      success: true,
      isNew: true,
      customer: newCustomer,
      message: `Đăng ký thành công tài khoản Free cho ${normalizedEmail}!`,
    });
  });

  // POST /api/auth/login - Đăng nhập tài khoản
  app.post("/api/auth/login", (req, res) => {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Thiếu email đăng nhập" });
    }

    const customers = getCustomersFromFile();
    const normalizedEmail = email.trim().toLowerCase();
    const existingIdx = customers.findIndex(
      (c: any) => c.email && c.email.toLowerCase() === normalizedEmail
    );

    if (existingIdx < 0) {
      return res.status(404).json({
        success: false,
        notRegistered: true,
        error: "Tài khoản chưa tồn tại. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới.",
      });
    }

    const current = customers[existingIdx];
    if (name) current.name = name.trim();
    if (avatar) current.avatar = avatar;
    current.lastLoginAt = new Date().toISOString();
    saveCustomersToFile(customers);

    const now = Date.now();
    const isFree = current.plan === "free";
    const expiresTime = current.expiresAt ? new Date(current.expiresAt).getTime() : 0;
    const diffMs = expiresTime - now;
    const daysRemaining = isFree ? undefined : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isVipExpired = !isFree && expiresTime > 0 && diffMs <= 0;
    const effectivePlan = isVipExpired ? "free" : current.plan;

    return res.json({
      success: true,
      customer: {
        ...current,
        plan: effectivePlan,
        rawPlan: current.plan,
        isExpired: isVipExpired,
        daysRemaining,
        status: isVipExpired ? "expired" : "active",
      },
      message: isVipExpired
        ? "Đăng nhập thành công! Gói VIP đã hết hạn và chuyển về gói Free."
        : `Đăng nhập thành công! Chào mừng ${current.name}.`,
    });
  });

  // POST /api/customers/login-sync - Đồng bộ người dùng đăng nhập Google
  app.post("/api/customers/login-sync", (req, res) => {
    const { email, name, avatar, plan = "free" } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Thiếu địa chỉ email Google" });
    }

    const customers = getCustomersFromFile();
    const normalizedEmail = email.trim().toLowerCase();
    const existingIdx = customers.findIndex(
      (c: any) => c.email && c.email.toLowerCase() === normalizedEmail
    );

    const now = new Date();

    if (existingIdx >= 0) {
      const current = customers[existingIdx];
      current.name = name || current.name;
      current.avatar = avatar || current.avatar;
      current.lastLoginAt = now.toISOString();
      if (!current.stt) {
        current.stt = existingIdx + 1;
      }
      saveCustomersToFile(customers);

      let daysRemaining = undefined;
      if (current.expiresAt && current.plan !== "free") {
        const diffMs = new Date(current.expiresAt).getTime() - Date.now();
        daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }

      return res.json({
        success: true,
        isNew: false,
        customer: {
          ...current,
          daysRemaining,
        },
      });
    }

    const newStt = customers.length + 1;
    const newCustomer = {
      id: `cust_${Date.now()}`,
      stt: newStt,
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split("@")[0],
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      plan: plan || "free",
      price: plan === "yearly" ? 49.99 : plan === "monthly" ? 4.99 : 0,
      currency: "USD",
      paymentMethod: "google_login",
      subscribedAt: now.toISOString(),
      expiresAt:
        plan === "yearly"
          ? new Date(now.getTime() + 365 * 86400000).toISOString()
          : plan === "monthly"
          ? new Date(now.getTime() + 30 * 86400000).toISOString()
          : null,
      status: "active",
      lastLoginAt: now.toISOString(),
    };

    customers.push(newCustomer);
    saveCustomersToFile(customers);

    return res.json({
      success: true,
      isNew: true,
      customer: newCustomer,
      message: `Đã tự động lưu khách hàng Google ${normalizedEmail} vào Database với STT ${newStt}`,
    });
  });

  // POST /api/customers/subscribe - Nâng cấp gói cước VIP (Gói 1 tháng: 4.99$, Gói 1 năm: 49.99$)
  app.post("/api/customers/subscribe", (req, res) => {
    const { email, name, avatar, plan, paymentMethod, paypalOrderId } = req.body;
    if (!email || !plan) {
      return res.status(400).json({ success: false, error: "Thiếu email hoặc gói đăng ký" });
    }

    const customers = getCustomersFromFile();
    const now = new Date();
    const durationDays = plan === "yearly" ? 365 : plan === "monthly" ? 30 : 0;
    const expiresDate = durationDays > 0 ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000) : null;
    const price = plan === "yearly" ? 49.99 : plan === "monthly" ? 4.99 : 0;
    const planLabel = plan === "yearly" ? "Gói VIP 1 Năm ($49.99/năm)" : plan === "monthly" ? "Gói VIP 1 Tháng ($4.99/tháng)" : "Gói Free";

    const normalizedEmail = email.trim().toLowerCase();
    const existingIdx = customers.findIndex(
      (c: any) => c.email && c.email.toLowerCase() === normalizedEmail
    );

    let updatedCustomer: any;

    if (existingIdx >= 0) {
      const current = customers[existingIdx];
      let newExpiresDate: string | null = null;
      if (plan === "free") {
        newExpiresDate = null;
      } else {
        const currentExpiry = current.expiresAt ? new Date(current.expiresAt).getTime() : 0;
        const baseTime = currentExpiry > now.getTime() ? currentExpiry : now.getTime();
        newExpiresDate = new Date(baseTime + durationDays * 24 * 60 * 60 * 1000).toISOString();
      }

      updatedCustomer = {
        ...current,
        name: name || current.name,
        avatar: avatar || current.avatar,
        plan,
        price,
        paymentMethod: paymentMethod || "vietqr",
        paypalOrderId: paypalOrderId || current.paypalOrderId || `ORD-${Date.now()}`,
        subscribedAt: now.toISOString(),
        expiresAt: newExpiresDate,
        status: "active",
        stt: current.stt || (existingIdx + 1),
      };
      customers[existingIdx] = updatedCustomer;
    } else {
      updatedCustomer = {
        id: `cust_${Date.now()}`,
        stt: customers.length + 1,
        email: normalizedEmail,
        name: name || normalizedEmail.split("@")[0],
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        plan,
        price,
        currency: "USD",
        paymentMethod: paymentMethod || "vietqr",
        paypalOrderId: paypalOrderId || (plan === "free" ? "FREE-TIER" : `ORD-${Date.now()}`),
        subscribedAt: now.toISOString(),
        expiresAt: expiresDate ? expiresDate.toISOString() : null,
        status: "active",
      };
      customers.push(updatedCustomer);
    }

    saveCustomersToFile(customers);

    const daysRemaining = updatedCustomer.expiresAt && updatedCustomer.plan !== "free"
      ? Math.max(0, Math.ceil((new Date(updatedCustomer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : undefined;

    return res.json({
      success: true,
      customer: { ...updatedCustomer, daysRemaining },
      message: `Kích hoạt thành công ${planLabel} cho ${normalizedEmail}`,
    });
  });

  // GET /api/customers/check/:email - Kiểm tra trạng thái gói cước khách hàng
  app.get("/api/customers/check/:email", (req, res) => {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ success: false, error: "Thiếu email" });
    }

    const customers = getCustomersFromFile();
    const customer = customers.find(
      (c: any) => c.email && c.email.toLowerCase() === email.toLowerCase()
    );

    if (!customer) {
      return res.json({ success: true, hasPlan: false });
    }

    if (customer.plan === "free" || !customer.expiresAt) {
      return res.json({
        success: true,
        hasPlan: false,
        isFree: true,
        customer: {
          ...customer,
          status: "active",
        },
      });
    }

    const now = Date.now();
    const expiresTime = new Date(customer.expiresAt).getTime();
    const diffMs = expiresTime - now;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const isActive = diffMs > 0;

    return res.json({
      success: true,
      hasPlan: isActive,
      customer: {
        ...customer,
        daysRemaining,
        status: isActive ? "active" : "expired",
      },
    });
  });

  // PATCH /api/customers/:id/plan - Đổi gói trực tiếp
  app.patch("/api/customers/:id/plan", (req, res) => {
    const { id } = req.params;
    const { plan } = req.body;
    if (!plan || !["free", "monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ success: false, error: "Gói dịch vụ không hợp lệ (free, monthly, yearly)" });
    }

    const customers = getCustomersFromFile();
    const customer = customers.find((c: any) => c.id === id);
    if (!customer) {
      return res.status(404).json({ success: false, error: "Không tìm thấy khách hàng" });
    }

    const now = new Date();
    customer.plan = plan;
    customer.subscribedAt = now.toISOString();

    if (plan === "free") {
      customer.price = 0;
      customer.expiresAt = null;
      customer.status = "active";
    } else if (plan === "monthly") {
      customer.price = 4.99;
      customer.expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString();
      customer.status = "active";
    } else if (plan === "yearly") {
      customer.price = 49.99;
      customer.expiresAt = new Date(now.getTime() + 365 * 86400000).toISOString();
      customer.status = "active";
    }

    saveCustomersToFile(customers);

    let daysRemaining = undefined;
    if (customer.expiresAt && customer.plan !== "free") {
      const diffMs = new Date(customer.expiresAt).getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return res.json({
      success: true,
      customer: { ...customer, daysRemaining },
      message: `Đã cập nhật gói thành công cho ${customer.email} sang gói ${plan}`,
    });
  });

  const SUPPORTED_LANGS = [
    'en', 'vi', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'pt', 'ru',
    'id', 'th', 'hi', 'ar', 'it', 'nl', 'tr', 'pl', 'ms', 'sv'
  ];

  const COUNTRY_TO_LANG: Record<string, string> = {
    VN: 'vi',
    JP: 'ja',
    KR: 'ko',
    CN: 'zh',
    TW: 'zh',
    HK: 'zh',
    ES: 'es',
    MX: 'es',
    AR: 'es',
    CO: 'es',
    CL: 'es',
    PE: 'es',
    FR: 'fr',
    DE: 'de',
    AT: 'de',
    CH: 'de',
    BR: 'pt',
    PT: 'pt',
    RU: 'ru',
    BY: 'ru',
    KZ: 'ru',
    ID: 'id',
    TH: 'th',
    IN: 'hi',
    SA: 'ar',
    AE: 'ar',
    EG: 'ar',
    IQ: 'ar',
    MA: 'ar',
    IT: 'it',
    NL: 'nl',
    TR: 'tr',
    PL: 'pl',
    MY: 'ms',
    SE: 'sv',
    US: 'en',
    GB: 'en',
    CA: 'en',
    AU: 'en',
    NZ: 'en',
  };

  // International SEO Routing & Geo-Targeting for root /
  app.get('/', (req, res, next) => {
    // In development mode, pass directly to Vite middleware so / serves 200 OK HTML immediately
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    // Skip if user explicitly requests no redirect
    if (req.query.noredirect === '1') {
      return next();
    }

    const toolParam = typeof req.query.tool === 'string' && req.query.tool ? `/${req.query.tool}` : '';

    // 1. Explicit query parameter ?lang=...
    if (typeof req.query.lang === 'string') {
      const qLang = req.query.lang.toLowerCase();
      if (SUPPORTED_LANGS.includes(qLang)) {
        return res.redirect(302, `/${qLang}${toolParam}`);
      }
    }

    // 2. Check Geo-IP Country header (Cloudflare, GCP, or CDN)
    const countryHeader = (req.headers['cf-ipcountry'] || req.headers['x-country-code'] || req.headers['geoip-country-code'] || '') as string;
    const countryCode = countryHeader.toUpperCase();
    if (countryCode && COUNTRY_TO_LANG[countryCode]) {
      const matchedLang = COUNTRY_TO_LANG[countryCode];
      return res.redirect(302, `/${matchedLang}${toolParam}`);
    }

    // 3. Check Accept-Language header from client browser
    const acceptLang = (req.headers['accept-language'] as string) || '';
    if (acceptLang) {
      const languages = acceptLang.split(',').map(item => {
        const [code, qVal] = item.trim().split(';q=');
        return {
          code: code.trim().toLowerCase().slice(0, 2),
          weight: qVal ? parseFloat(qVal) : 1.0
        };
      });

      // Find highest weighted supported language
      languages.sort((a, b) => b.weight - a.weight);
      for (const item of languages) {
        if (SUPPORTED_LANGS.includes(item.code)) {
          return res.redirect(302, `/${item.code}${toolParam}`);
        }
      }
    }

    // 4. Default fallback: x-default (/en/) for all global visitors outside target countries
    return res.redirect(302, `/en${toolParam}`);
  });

  // 301 Permanent Canonical Redirect for /:lang/basic -> /:lang/ (Eliminates duplicate content and consolidates PageRank)
  app.get("/:lang([a-z]{2})/basic", (req, res) => {
    const lang = req.params.lang.toLowerCase();
    return res.redirect(301, `/${lang}/`);
  });

  // Helper to handle SSR prerendering for any /:lang or /:lang/:toolId route
  const handleSSRRoute = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    viteServer?: any
  ) => {
    try {
      const { lang, toolId } = req.params;
      const lowerLang = (lang || 'en').toLowerCase() as any;
      
      // If it is a static asset request with an extension, let next middleware handle it
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return next();
      }

      let templateHtml = '';
      if (process.env.NODE_ENV !== "production" && viteServer) {
        const rawTemplate = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        templateHtml = await viteServer.transformIndexHtml(req.originalUrl || req.url, rawTemplate);
      } else {
        const distIndexPath = path.join(process.cwd(), "dist", "index.html");
        if (fs.existsSync(distIndexPath)) {
          templateHtml = fs.readFileSync(distIndexPath, "utf-8");
        } else {
          templateHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        }
      }

      const domain = getBaseUrl(req);
      const finalHtml = renderServerHtml(templateHtml, lowerLang, toolId as any, domain);
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      // HTML must never be cached by CDNs or browsers so asset hashes are always up-to-date
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return res.status(200).send(finalHtml);
    } catch (err) {
      console.error("SSR Prerender Error:", err);
      return next();
    }
  };

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Handle SSR for localized tool routes in development
    app.get(["/:lang([a-z]{2})/:toolId([a-z]+)", "/:lang([a-z]{2})", "/:lang([a-z]{2})/"], (req, res, next) => {
      return handleSSRRoute(req, res, next, vite);
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // Serve immutable hashed assets
    app.use("/assets", express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      fallthrough: false
    }));

    // Serve raw static assets in src/assets
    app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets"), {
      maxAge: "1d",
      fallthrough: true
    }));

    // Serve other public static files from dist
    app.use(express.static(distPath, { index: false }));

    // Never return index.html for missing static assets or files with extensions
    app.use((req, res, next) => {
      if (req.path.startsWith('/assets/') || (req.path.includes('.') && !req.path.endsWith('.html'))) {
        return res.status(404).type('text/plain').send('File not found');
      }
      next();
    });

    // Handle SSR for localized tool routes in production
    app.get(["/:lang([a-z]{2})/:toolId([a-z]+)", "/:lang([a-z]{2})", "/:lang([a-z]{2})/"], (req, res, next) => {
      return handleSSRRoute(req, res, next);
    });

    app.get("*", (req, res, next) => {
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).type('text/plain').send('File not found');
      }

      const segments = req.path.split('/').filter(Boolean);
      const possibleLang = segments[0]?.toLowerCase();
      const possibleTool = segments[1]?.toLowerCase();
      
      if (possibleLang && SUPPORTED_LANGS.includes(possibleLang as any)) {
        return handleSSRRoute({
          ...req,
          params: { lang: possibleLang, toolId: possibleTool }
        } as any, res, next);
      }

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
