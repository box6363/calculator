# HƯỚNG DẪN TRIỂN KHAI VÀ TOÀN BỘ MÃ NGUỒN (CLOUDFLARE D1 + PAGES FUNCTIONS)

Tài liệu này tổng hợp toàn bộ giải pháp kỹ thuật, cơ sở dữ liệu Cloudflare D1, Cloudflare Pages Functions, cơ chế xác thực Google và hệ thống mua gói VIP an toàn cho **Web Calculator Pro**.

---

## 1. TỔNG QUAN KIẾN TRÚC & NGUYÊN TẮC HOẠT ĐỘNG

| Thành phần | Cơ chế triển khai |
| :--- | :--- |
| **Cơ sở dữ liệu** | **Cloudflare D1 (SQLite phân tán)**, schema lưu tại `schema.sql`. Ở môi trường xem trước (AI Studio) đồng bộ song song với `data/customers.json`. |
| **Server Backend** | **Cloudflare Pages Functions** (`functions/api/*` và `functions/_middleware.ts`). Chạy trên Edge toàn cầu, không lo lỗi 405 Method Not Allowed. |
| **Đăng nhập Google** | Server tự xác thực Token trực tiếp với Google API (`https://www.googleapis.com/oauth2/v3/userinfo`). Client **chỉ gửi accessToken**, không gửi email hay plan tự chế. |
| **Phân luồng Login/Signup** | Nếu tài khoản chưa có trong DB: Server trả mã 404 (`notRegistered: true`) ➔ Client thông báo rõ ràng và tự động chuyển sang tab **Đăng ký**, không tự tiện tạo tài khoản ngầm. |
| **Gói Free** | Có quảng cáo, được **3 lượt AI mỗi ngày** (Hạn mức tính và tự động làm mới lúc 00:00 theo **giờ Việt Nam UTC+7**). |
| **Gói VIP Tháng / Năm** | Gói tháng có **1.500 câu hỏi AI**, gói năm có **7.200 câu hỏi AI**. Tắt 100% quảng cáo. Mua gia hạn khi còn hạn thì **cộng dồn cả ngày lẫn số câu hỏi**. Hết hạn tự về Free. |
| **Khách chưa đăng nhập** | Bị chặn không cho gọi công cụ AI, hệ thống tự hiển thị hộp thoại yêu cầu đăng nhập Google. |
| **Bảo mật thanh toán** | **Xóa bỏ route `/api/customers/subscribe`** không an toàn. Thay thế bằng 2 cổng: PayPal tự động kiểm tra đơn hàng, VietQR/MoMo xác nhận thủ công bằng `ADMIN_KEY`. |

---

## 2. GIẢI QUYẾT CÁC LƯU Ý QUAN TRỌNG

### 2.1. Lỗi 405 Method Not Allowed trên Cloudflare Pages
* **Nguyên nhân:** Cloudflare Pages trước đây chỉ có file tĩnh trong `dist/` và chưa có các file function nhận phương thức `POST /api/auth/signup` hay `POST /api/auth/login`.
* **Cách khắc phục:** 
  1. File `public/_routes.json` đã có `"include": ["/*"]`.
  2. Toàn bộ các API đã được viết vào thư mục `functions/api/`:
     - `functions/api/auth/login.ts`
     - `functions/api/auth/signup.ts`
     - `functions/api/auth/me.ts`
     - `functions/api/payments/paypal-confirm.ts`
     - `functions/api/payments/transfer-submit.ts`
     - `functions/api/admin/grant.ts`
  3. Bổ sung bộ xử lý dự phòng trong `functions/_middleware.ts` để chắc chắn 100% không bao giờ gặp lỗi 405.

### 2.2. Khắc phục lỗi `origin_mismatch` Google OAuth
* **Hiện tượng:** Google báo lỗi `origin_mismatch` khi đăng nhập từ `https://testsp123.top`.
* **Nguyên nhân:** Client ID trong mã nguồn và Client ID bạn tạo trên Google Cloud Console có sự sai lệch:
  - Client ID đang dùng: `356123633584-d6h6kqtf9lkmeis2hked6kqsvr8vh3h1.apps.googleusercontent.com`
  - Hoặc Client ID mới của bạn: `724645847537-...`
* **Cách khắc phục triệt để:**
  1. Truy cập [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
  2. Mở Client ID bạn muốn dùng (khuyến nghị chọn 1 ID duy nhất).
  3. Thêm vào mục **Authorized JavaScript origins (Nguồn gốc JavaScript được phép)**:
     - `https://testsp123.top`
     - `http://localhost:3000` (để test máy local)
  4. Thêm vào mục **Authorized redirect URIs (URI chuyển hướng được phép)**:
     - `https://testsp123.top/google-callback`
     - `http://localhost:3000/google-callback`
  5. Cập nhật biến môi trường trên Cloudflare Pages:
     - `GOOGLE_CLIENT_ID = <CLIENT_ID_CỦA_BẠN>`
     - `VITE_GOOGLE_CLIENT_ID = <CLIENT_ID_CỦA_BẠN>`

---

## 3. CẤU TRÚC BẢNG DỮ LIỆU CLOUDFLARE D1 (`schema.sql`)

Tạo database D1 trên Cloudflare qua terminal:
```bash
npx wrangler d1 create webcalc-db
npx wrangler d1 execute webcalc-db --file=./schema.sql
```

Nội dung file `schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  stt INTEGER,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'monthly' | 'yearly'
  price REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  paypal_order_id TEXT,
  subscribed_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'active', -- 'active' | 'expired'
  ai_count_today INTEGER DEFAULT 0,
  ai_reset_date TEXT,
  ai_quota_remaining INTEGER DEFAULT 3,
  total_ai_queries INTEGER DEFAULT 0,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL, -- 'paypal' | 'vietqr' | 'momo' | 'admin_grant'
  order_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'rejected'
  memo TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  confirmed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payment_records(user_email);
```

---

## 4. CẤU HÌNH `wrangler.toml` (CLOUDFLARE BINDINGS)

```toml
name = "web-calculator"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "webcalc-db"
database_id = "<D1_DATABASE_UUID_CỦA_BẠN>"

[vars]
GOOGLE_CLIENT_ID = "356123633584-d6h6kqtf9lkmeis2hked6kqsvr8vh3h1.apps.googleusercontent.com"
ADMIN_KEY = "admin_secret_key_123"
```

---

## 5. DANH SÁCH API ENDPOINTS

### 5.1. `POST /api/auth/login`
- **Body:** `{ accessToken: string }`
- **Xử lý:** 
  - Gọi Google API `https://www.googleapis.com/oauth2/v3/userinfo` để lấy email thật.
  - Tra D1: nếu chưa có, trả về HTTP 404 `{ notRegistered: true }`.
  - Nếu có: tính toán hạn VIP, kiểm tra ngày Việt Nam (UTC+7) để reset hạn mức 3 lượt hỏi/ngày nếu qua ngày mới, trả về user session.

### 5.2. `POST /api/auth/signup`
- **Body:** `{ accessToken: string }`
- **Xử lý:**
  - Xác thực token với Google.
  - Tra D1: nếu đã có email, trả về HTTP 409 `{ alreadyExists: true }`.
  - Nếu chưa: tạo user mới với `plan: 'free'`, `ai_quota_remaining: 3`, `ai_count_today: 0`, `ai_reset_date: today_VN`.

### 5.3. `GET /api/auth/me`
- **Query hoặc Header:** `?email=...` hoặc `Authorization: Bearer <token>`
- **Xử lý:** Lấy trạng thái hiện tại của người dùng, số ngày VIP còn lại, số câu hỏi AI còn lại.

### 5.4. `POST /api/payments/transfer-submit` (VietQR / MoMo)
- **Body:** `{ plan: 'monthly' | 'yearly', paymentMethod: 'vietqr' | 'momo', memo: string, amount: number, email: string }`
- **Xử lý:** Lưu bản ghi vào bảng `payment_records` với trạng thái `pending`.
- **Giao diện:** Nút bấm trong `PricingModal` đổi thành **"Đã chuyển khoản, chờ xác nhận"**. Khi người dùng bấm, hệ thống hiển thị bảng thông tin đã tiếp nhận kèm mã đối soát memo.

### 5.5. `POST /api/admin/grant` (Admin duyệt thủ công)
- **Header:** `x-admin-key: <ADMIN_KEY>` hoặc **Body:** `{ adminKey, email, plan, days, quota }`
- **Xử lý:**
  - Kiểm tra `adminKey === ADMIN_KEY`.
  - Nếu đúng: cộng dồn hạn VIP (tháng: +30 ngày, năm: +365 ngày), cộng dồn số câu hỏi AI (tháng: +1.500 câu, năm: +7.200 câu).
  - Đổi trạng thái trong `payment_records` sang `completed`.
  - Có thể kích hoạt trực tiếp từ giao diện modal bằng nút **"Kích hoạt bằng Admin Key"**.

### 5.6. `POST /api/payments/paypal-confirm` (PayPal tự động)
- **Body:** `{ orderId, plan, email }`
- **Xử lý:**
  - Gọi PayPal API kiểm tra đơn hàng xem đã trả tiền thành công chưa (nếu có `PAYPAL_CLIENT_ID` & `PAYPAL_SECRET`).
  - Cộng dồn ngày sử dụng và số câu hỏi vào tài khoản D1.

### 5.7. `POST /api/gemini/answer` (Bảo vệ AI Solver)
- **Kiểm tra đăng nhập:** Khách chưa đăng nhập ➔ HTTP 401: *"Vui lòng đăng nhập bằng tài khoản Google để sử dụng công cụ AI."*
- **Kiểm tra gói Free:** Hạn mức 3 câu/ngày tính theo giờ Việt Nam. Vượt quá ➔ HTTP 429: *"Bạn đã sử dụng hết 3 lượt AI miễn phí hôm nay."*
- **Kiểm tra gói VIP:** Trừ 1 câu trong `ai_quota_remaining`. Hết câu ➔ HTTP 429 yêu cầu gia hạn.

---

## 6. CÁC BƯỚC KIỂM TRA SAU KHI DEPLOY (CHECKLIST)

1. **Kiểm tra đăng nhập khi chưa đăng ký:**
   - Mở cửa sổ ẩn danh, bấm Đăng nhập bằng tài khoản Google chưa từng tạo trên web.
   - Kết quả mong đợi: Hệ thống báo *"Chưa có tài khoản. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới"* và tự động chuyển sang tab Đăng ký.
2. **Kiểm tra đăng ký mới:**
   - Bấm Đăng ký tài khoản Google.
   - Kết quả mong đợi: Tạo thành công tài khoản Free, có 3 lượt AI, có quảng cáo.
3. **Kiểm tra AI với tài khoản Free:**
   - Hỏi câu 1, 2, 3: Trả lời thành công.
   - Hỏi câu thứ 4: Báo hết 3 lượt hôm nay theo giờ Việt Nam.
4. **Kiểm tra VietQR / MoMo:**
   - Mở modal Bảng giá ➔ Chọn VietQR hoặc MoMo ➔ Bấm **"Đã chuyển khoản, chờ xác nhận"**.
   - Kết quả mong đợi: Hệ thống ghi nhận trạng thái pending và hiện thông tin đối soát.
5. **Kiểm tra Admin kích hoạt VIP:**
   - Mở modal Bảng giá ➔ Bấm **"Kích hoạt bằng Admin Key"** ➔ Nhập `admin_secret_key_123` ➔ Bấm Kích hoạt.
   - Kết quả mong đợi: Tài khoản lập tức nhận gói VIP, số câu hỏi lên 1.500 (gói tháng) hoặc 7.200 (gói năm), tắt quảng cáo.
6. **Kiểm tra mua gia hạn (Cộng dồn):**
   - Đang còn 25 ngày VIP và 1.200 câu hỏi ➔ Gia hạn thêm 1 tháng.
   - Kết quả mong đợi: Thời hạn tăng lên 55 ngày, số câu hỏi tăng lên 2.700 câu.
