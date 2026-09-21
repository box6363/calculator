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
      res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
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
    app.use(express.static(distPath, { index: false }));

    // Handle SSR for localized tool routes in production
    app.get(["/:lang([a-z]{2})/:toolId([a-z]+)", "/:lang([a-z]{2})", "/:lang([a-z]{2})/"], (req, res, next) => {
      return handleSSRRoute(req, res, next);
    });

    app.get("*", (req, res, next) => {
      const segments = req.path.split('/').filter(Boolean);
      const possibleLang = segments[0]?.toLowerCase();
      const possibleTool = segments[1]?.toLowerCase();
      
      if (possibleLang && SUPPORTED_LANGS.includes(possibleLang as any)) {
        return handleSSRRoute({
          ...req,
          params: { lang: possibleLang, toolId: possibleTool }
        } as any, res, next);
      }

      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
