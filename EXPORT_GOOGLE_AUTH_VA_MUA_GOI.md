# TÀI LIỆU VÀ TOÀN BỘ MÃ NGUỒN: ĐĂNG NHẬP GOOGLE & CƠ CHẾ MUA GÓI VIP

Dự án: **Web Calculator Pro**  
Ngày xuất: 18/10/2026  
Google OAuth Client ID hiện tại: `356123633584-d6h6kqtf9lkmeis2hked6kqsvr8vh3h1.apps.googleusercontent.com`

---

## MỤC LỤC
1. [Tổng quan Kiến trúc Hệ thống](#1-tong-quan-kien-truc-he-thong)
2. [Cơ chế & Code Đăng nhập Google (Google OAuth 2.0)](#2-co-che--code-dang-nhap-google)
   - 2.1. Định nghĩa Kiểu dữ liệu (`src/types/auth.ts`)
   - 2.2. Modal Giao diện & Xử lý OAuth (`src/components/Auth/GoogleLoginModal.tsx`)
   - 2.3. Quản lý Trạng thái Toàn cục (`src/context/AuthContext.tsx`)
   - 2.4. Server Backend: Callback Popup & APIs Đăng nhập (`server.ts`)
3. [Cơ chế & Code Mua gói VIP (Subscription & Payment)](#3-co-che--code-mua-goi-vip)
   - 3.1. Các Gói dịch vụ & Quy tắc tính hạn sử dụng
   - 3.2. Modal Giao diện Thanh toán & VietQR (`src/components/Subscription/PricingModal.tsx`)
   - 3.3. Helper Sinh mã VietQR (`src/utils/vietqrBanks.ts`)
   - 3.4. Server Backend: Xử lý Kích hoạt Gói & Cộng dồn Hạn dùng (`server.ts`)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

### Luồng Đăng nhập Google:
1. **Google Identity Services (GIS) initTokenClient**: Client khởi tạo Google Token Client với Client ID đã cấp. Người dùng bấm Đăng nhập/Đăng ký -> Cửa sổ chọn tài khoản Google (Account Chooser) hiển thị.
2. **Lấy Access Token & Thông tin User**: Client gửi token đến `https://www.googleapis.com/oauth2/v3/userinfo` để lấy `email`, `name`, `picture` chính chủ từ Google.
3. **Dự phòng (Fallback OAuth Popup)**: Nếu script GIS bị chặn (bởi Adblock/trình duyệt bảo mật), hệ thống tự động mở cửa sổ OAuth Popup dẫn đến `https://accounts.google.com/o/oauth2/v2/auth` với `redirect_uri = /google-callback`.
4. **Backend Sync & Lưu trữ**: Thông tin được gửi về API backend (`/api/auth/login`, `/api/auth/signup`, hoặc `/api/customers/login-sync`) để lưu trữ vào file dữ liệu JSON (hoặc CSDL), kiểm tra hạn VIP còn lại (`daysRemaining`) và trả về cho Client.
5. **Lưu trữ phiên**: Được đồng bộ trong `localStorage` (`webcalculator_user`) và tự động kiểm tra định kỳ với backend (`/api/customers/check/:email`).

### Luồng Mua gói VIP:
1. **Lựa chọn gói**:
   - Gói 1 Tháng: **$4.99 USD** (~125.000 VNĐ) - Hạn 30 ngày.
   - Gói 1 Năm: **$49.99 USD** (~1.250.000 VNĐ) - Hạn 365 ngày (Tiết kiệm 17%).
2. **Phương thức thanh toán**:
   - **VietQR Napas 247**: Tự động sinh mã QR ngân hàng chuẩn VietQR chứa chính xác số tiền và cú pháp chuyển khoản `VIP499 [MÃ_USER]`.
   - **Ví MoMo**: Hướng dẫn chuyển tiền qua số MoMo kèm mã nội dung.
   - **PayPal**: Tích hợp thanh toán quốc tế qua PayPal Checkout Button.
3. **Xử lý gia hạn & Cộng dồn ngày VIP**:
   - Backend tính toán: Nếu người dùng còn hạn VIP cũ mà mua thêm gói, thời hạn mới sẽ được **cộng dồn tiếp tục** từ mốc ngày hết hạn cũ chứ không bị mất ngày (`baseTime = currentExpiry > now ? currentExpiry : now`).
   - Tự động hạ cấp về Free khi hết hạn (`isExpired = diffMs <= 0`).

---

## 2. CƠ CHẾ & CODE ĐĂNG NHẬP GOOGLE

### 2.1. File `src/types/auth.ts`
```typescript
export type UserPlan = 'free' | 'monthly' | 'yearly';

export interface UserAccount {
  id: string;
  stt?: number;
  email: string;
  name: string;
  avatar?: string;
  plan: UserPlan;
  price?: number;
  currency?: string;
  paymentMethod?: string;
  paypalOrderId?: string;
  subscribedAt?: string;
  expiresAt?: string | null;
  daysRemaining?: number;
  status?: 'active' | 'expired';
}

export interface PricingPlan {
  id: 'monthly' | 'yearly';
  nameVi: string;
  nameEn: string;
  priceUSD: number;
  priceVND: number;
  periodVi: string;
  periodEn: string;
  durationDays: number;
  savingsVi?: string;
  savingsEn?: string;
  popular?: boolean;
  featuresVi: string[];
  featuresEn: string[];
}
```

---

### 2.2. File `src/components/Auth/GoogleLoginModal.tsx` (Trích đoạn cốt lõi xử lý OAuth)
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Client ID chính thức từ Google Cloud Console
const OFFICIAL_GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  '356123633584-d6h6kqtf9lkmeis2hked6kqsvr8vh3h1.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
    paypal?: any;
  }
}

export const GoogleLoginModal: React.FC = () => {
  const {
    user,
    isLoginModalOpen,
    setIsLoginModalOpen,
    authModalMode,
    loginWithGoogle,
    signupWithGoogle,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const callbackUrl = `${currentOrigin}/google-callback`;

  // Xử lý xác thực Google qua GIS Token Client hoặc Fallback Popup
  const handleGoogleAuth = async (mode: 'login' | 'signup') => {
    setLoading(true);
    setErrorMessage(null);

    // Cách 1: Google Identity Services initTokenClient (Native SDK)
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2?.initTokenClient) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: OFFICIAL_GOOGLE_CLIENT_ID,
          scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (res.ok) {
                  const userInfo = await res.json();
                  const email = userInfo.email.trim().toLowerCase();
                  const name = userInfo.name || email.split('@')[0];
                  const avatar = userInfo.picture;

                  if (mode === 'signup') {
                    const result = await signupWithGoogle(email, name, avatar);
                    if (result?.alreadyExists) {
                      await loginWithGoogle(email, name, avatar);
                    }
                  } else {
                    const result = await loginWithGoogle(email, name, avatar);
                    if (result?.notRegistered) {
                      await signupWithGoogle(email, name, avatar);
                    }
                  }
                  setLoading(false);
                  return;
                }
              } catch (e: any) {
                setErrorMessage(`Lỗi kết nối Google: ${e?.message || 'Không xác định'}`);
              }
            }
            setLoading(false);
          },
        });

        client.requestAccessToken({ prompt: 'select_account' });
        setTimeout(() => setLoading(false), 2500);
        return;
      } catch (err) {
        console.warn('Fallback sang OAuth redirect URL:', err);
      }
    }

    // Cách 2: Fallback Popup OAuth 2.0
    const statePayload = encodeURIComponent(JSON.stringify({ mode }));
    const params = new URLSearchParams({
      client_id: OFFICIAL_GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl,
      response_type: 'token id_token',
      scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      prompt: 'select_account',
      include_granted_scopes: 'true',
      state: statePayload,
      nonce: Date.now().toString(),
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const width = 500, height = 650;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);

    const popup = window.open(
      googleAuthUrl,
      'google_oauth_account_chooser',
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.location.href = googleAuthUrl;
    } else {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  // Render UI buttons ...
};
```

---

### 2.3. File `src/context/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, UserPlan } from '../types/auth';

interface AuthContextType {
  user: UserAccount | null;
  isVip: boolean;
  vipPlan: UserPlan;
  daysRemaining: number | undefined;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  loginWithGoogle: (email: string, name?: string, avatar?: string) => Promise<any>;
  signupWithGoogle: (email: string, name?: string, avatar?: string) => Promise<any>;
  upgradePlan: (plan: 'monthly' | 'yearly', paymentMethod?: string, orderId?: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'webcalculator_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Tính toán trạng thái VIP
  const isVip = Boolean(
    user && 
    (user.plan === 'monthly' || user.plan === 'yearly') && 
    (user.daysRemaining === undefined || user.daysRemaining > 0)
  );

  const vipPlan: UserPlan = user?.plan || 'free';
  const daysRemaining = user?.daysRemaining;

  // Lắng nghe Message Event từ OAuth Popup Callback
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.customer) {
        const customer = event.data.customer;
        setUser(customer);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
        } catch {}
        setIsLoginModalOpen(false);
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Kiểm tra trạng thái VIP với Backend khi ứng dụng khởi chạy
  useEffect(() => {
    if (user?.email) {
      fetch(`/api/customers/check/${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.customer) {
            setUser(prev => {
              const updated = { ...prev, ...data.customer };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              } catch {}
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  const signupWithGoogle = async (customEmail?: string, customName?: string, customAvatar?: string) => {
    const email = (customEmail || '').trim().toLowerCase();
    const name = customName?.trim() || email.split('@')[0];
    const avatar = customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, avatar }),
    });
    const data = await res.json();
    if (data.success && data.customer) {
      setUser(data.customer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
      setIsLoginModalOpen(false);
    }
    return data;
  };

  const loginWithGoogle = async (customEmail?: string, customName?: string, customAvatar?: string) => {
    const email = (customEmail || '').trim().toLowerCase();
    const name = customName?.trim() || email.split('@')[0];
    const avatar = customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, avatar }),
    });
    const data = await res.json();
    if (data.success && data.customer) {
      setUser(data.customer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
      setIsLoginModalOpen(false);
    }
    return data;
  };

  const upgradePlan = async (plan: 'monthly' | 'yearly', paymentMethod: string = 'vietqr', orderId?: string) => {
    if (!user?.email) {
      setIsLoginModalOpen(true);
      return { success: false, error: 'Vui lòng đăng nhập trước khi kích hoạt' };
    }

    const res = await fetch('/api/customers/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan,
        paymentMethod,
        paypalOrderId: orderId || `ORD-${Date.now().toString(36).toUpperCase()}`
      })
    });
    const data = await res.json();
    if (data.success && data.customer) {
      setUser(data.customer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user, isVip, vipPlan, daysRemaining, isLoginModalOpen, setIsLoginModalOpen,
      isPricingModalOpen, setIsPricingModalOpen, authModalMode, setAuthModalMode,
      loginWithGoogle, signupWithGoogle, upgradePlan, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
```

---

### 2.4. Server Backend: Callback Popup & APIs Đăng nhập (`server.ts`)
```typescript
// GET /google-callback - Nhận redirect từ Google Popup, giải mã token và postMessage về trang chính
app.get(["/google-callback", "/auth/callback"], (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Đang xác thực Google...</title>
</head>
<body style="font-family:system-ui;text-align:center;padding:50px 20px;">
  <h2>Đang kết nối tài khoản Google...</h2>
  <script>
    (async function() {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');

        if (accessToken) {
          const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + accessToken }
          });
          if (userRes.ok) {
            const profile = await userRes.json();
            const syncRes = await fetch('/api/customers/login-sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                avatar: profile.picture
              })
            });
            const syncData = await syncRes.json();
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                customer: syncData.customer
              }, '*');
              window.close();
              return;
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
      window.location.href = '/';
    })();
  </script>
</body>
</html>`);
});

// POST /api/auth/login - Đăng nhập tài khoản
app.post("/api/auth/login", (req, res) => {
  const { email, name, avatar } = req.body;
  const customers = getCustomersFromFile();
  const normalizedEmail = email.trim().toLowerCase();
  const existing = customers.find((c: any) => c.email && c.email.toLowerCase() === normalizedEmail);

  if (!existing) {
    return res.status(404).json({ success: false, notRegistered: true, error: "Tài khoản chưa tồn tại." });
  }

  const now = Date.now();
  const isFree = existing.plan === "free";
  const expiresTime = existing.expiresAt ? new Date(existing.expiresAt).getTime() : 0;
  const diffMs = expiresTime - now;
  const daysRemaining = isFree ? undefined : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isVipExpired = !isFree && expiresTime > 0 && diffMs <= 0;
  const effectivePlan = isVipExpired ? "free" : existing.plan;

  return res.json({
    success: true,
    customer: {
      ...existing,
      plan: effectivePlan,
      daysRemaining,
      status: isVipExpired ? "expired" : "active"
    }
  });
});
```

---

## 3. CƠ CHẾ & CODE MUA GÓI VIP

### 3.1. Các Gói Dịch Vụ
- **Gói 1 Tháng**: $4.99 (125.000 VNĐ) - 30 ngày sử dụng VIP.
- **Gói 1 Năm**: $49.99 (1.250.000 VNĐ) - 365 ngày sử dụng VIP.
- **Đặc quyền VIP**:
  - Không giới hạn truy cập toàn bộ 40+ công cụ tính toán nâng cao.
  - Xóa 100% quảng cáo và biểu ngữ.
  - Xuất báo cáo PDF chi tiết tài chính, tiền lương, biểu đồ không giới hạn.
  - Hỗ trợ ưu tiên và tính năng AI chuyên sâu.

---

### 3.2. Modal Giao diện Mua gói (`src/components/Subscription/PricingModal.tsx` - Trích đoạn)
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VIETQR_BANKS, getVietQRImageUrl } from '../../utils/vietqrBanks';

export const PricingModal: React.FC = () => {
  const { user, isPricingModalOpen, setIsPricingModalOpen, upgradePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentChannel, setPaymentChannel] = useState<'vietqr' | 'momo' | 'paypal'>('vietqr');
  const [selectedBank, setSelectedBank] = useState(VIETQR_BANKS[0]);

  const currentPriceVND = selectedPlan === 'yearly' ? 1250000 : 125000;
  const currentPriceUSD = selectedPlan === 'yearly' ? 49.99 : 4.99;
  const userEmail = user?.email || 'guest@example.com';
  const cleanEmailTag = userEmail.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();
  const transferMemo = `VIP${selectedPlan === 'yearly' ? '4999' : '499'} ${cleanEmailTag}`;
  const defaultAccountNumber = '1023456789';
  const beneficiaryName = 'CONG TY WEB CALCULATOR PRO';

  // Sinh link ảnh VietQR động
  const vietQrUrl = getVietQRImageUrl(
    selectedBank.bin,
    defaultAccountNumber,
    currentPriceVND,
    transferMemo,
    beneficiaryName
  );

  const handleConfirmPayment = async () => {
    const orderId = `PAY-${Date.now().toString(36).toUpperCase()}`;
    const res = await upgradePlan(selectedPlan, paymentChannel, orderId);
    if (res.success) {
      // Hiển thị màn hình kích hoạt VIP thành công
    }
  };

  // Render bảng giá, tabs chọn cổng thanh toán, mã QR và nút xác nhận...
};
```

---

### 3.3. Helper Sinh mã QR VietQR (`src/utils/vietqrBanks.ts`)
```typescript
export interface VietQRBank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
}

export const VIETQR_BANKS: VietQRBank[] = [
  { id: 'vcb', name: 'Ngân hàng Ngoại thương Việt Nam', code: 'VCB', bin: '970436', shortName: 'Vietcombank' },
  { id: 'tcb', name: 'Ngân hàng Kỹ thương Việt Nam', code: 'TCB', bin: '970407', shortName: 'Techcombank' },
  { id: 'mbb', name: 'Ngân hàng Quân đội', code: 'MB', bin: '970422', shortName: 'MBBank' },
  { id: 'vpb', name: 'Ngân hàng Việt Nam Thịnh Vượng', code: 'VPB', bin: '970432', shortName: 'VPBank' },
  { id: 'icb', name: 'Ngân hàng Công thương Việt Nam', code: 'CTG', bin: '970415', shortName: 'VietinBank' },
  { id: 'bidv', name: 'Ngân hàng Đầu tư và Phát triển VN', code: 'BIDV', bin: '970418', shortName: 'BIDV' },
  { id: 'acb', name: 'Ngân hàng Á Châu', code: 'ACB', bin: '970416', shortName: 'ACB' },
  { id: 'tpbg', name: 'Ngân hàng Tiên Phong', code: 'TPB', bin: '970423', shortName: 'TPBank' },
];

export function getVietQRImageUrl(
  bankBin: string,
  accountNumber: string,
  amount: number,
  memo: string,
  accountName: string
): string {
  const encodedAccountName = encodeURIComponent(accountName);
  const encodedMemo = encodeURIComponent(memo);
  return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedMemo}&accountName=${encodedAccountName}`;
}
```

---

### 3.4. Server Backend: Nâng cấp gói & Cộng dồn hạn dùng (`server.ts`)
```typescript
// POST /api/customers/subscribe - Nâng cấp gói cước VIP (Gói 1 tháng: 4.99$, Gói 1 năm: 49.99$)
app.post("/api/customers/subscribe", (req, res) => {
  const { email, name, avatar, plan, paymentMethod, paypalOrderId } = req.body;
  if (!email || !plan) {
    return res.status(400).json({ success: false, error: "Thiếu email hoặc gói đăng ký" });
  }

  const customers = getCustomersFromFile();
  const now = new Date();
  const durationDays = plan === "yearly" ? 365 : plan === "monthly" ? 30 : 0;
  const price = plan === "yearly" ? 49.99 : plan === "monthly" ? 4.99 : 0;
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
      // Cơ chế cộng dồn: Nếu còn hạn VIP cũ, cộng tiếp vào mốc hết hạn cũ
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
    // Tạo khách hàng mới nếu chưa có
    const expiresDate = durationDays > 0 ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000) : null;
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
      paypalOrderId: paypalOrderId || `ORD-${Date.now()}`,
      subscribedAt: now.toISOString(),
      expiresAt: expiresDate ? expiresDate.toISOString() : null,
      status: "active",
    };
    customers.push(updatedCustomer);
  }

  saveCustomersToFile(customers);

  // Tính số ngày còn lại
  const daysRemaining = updatedCustomer.expiresAt && updatedCustomer.plan !== "free"
    ? Math.max(0, Math.ceil((new Date(updatedCustomer.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : undefined;

  return res.json({
    success: true,
    customer: { ...updatedCustomer, daysRemaining },
    message: `Kích hoạt thành công gói cước cho ${normalizedEmail}`,
  });
});
```
