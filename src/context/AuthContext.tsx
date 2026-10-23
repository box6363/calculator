import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, UserPlan } from '../types/auth';

interface AuthContextType {
  user: UserAccount | null;
  isVip: boolean;
  vipPlan: UserPlan;
  daysRemaining: number | undefined;
  aiQuotaRemaining: number;
  aiCountToday: number;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  loginWithGoogle: (emailOrToken: string, name?: string, avatar?: string) => Promise<any>;
  signupWithGoogle: (emailOrToken: string, name?: string, avatar?: string) => Promise<any>;
  confirmPaypalPayment: (plan: 'monthly' | 'yearly', orderId: string) => Promise<any>;
  submitTransferRecord: (plan: 'monthly' | 'yearly', paymentMethod: 'vietqr' | 'momo', memo: string, amount?: number) => Promise<any>;
  adminGrantPlan: (email: string, plan: 'monthly' | 'yearly', adminKey: string, days?: number, quota?: number) => Promise<any>;
  upgradePlan: (plan: 'monthly' | 'yearly', paymentMethod?: string, orderId?: string) => Promise<any>;
  refreshUser: () => Promise<void>;
  updateUserUsage: (usage: { plan?: UserPlan; aiCountToday?: number; aiQuotaRemaining?: number }) => void;
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

  // Calculate VIP status
  const isVip = Boolean(
    user && 
    (user.plan === 'monthly' || user.plan === 'yearly') && 
    (user.daysRemaining === undefined || user.daysRemaining > 0)
  );

  const vipPlan: UserPlan = user?.plan || 'free';
  const daysRemaining = user?.daysRemaining;
  const aiCountToday = user?.aiCountToday ?? 0;
  const aiQuotaRemaining = user?.aiQuotaRemaining ?? (isVip ? (user?.plan === 'yearly' ? 7200 : 1500) : Math.max(0, 3 - aiCountToday));

  // Sync with server on load if user is logged in
  const refreshUser = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/auth/me?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (data.success && data.customer) {
        setUser(prev => {
          const updated = { ...prev, ...data.customer };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch {}
  };

  useEffect(() => {
    refreshUser();
  }, [user?.email]);

  const updateUserUsage = (usage: { plan?: UserPlan; aiCountToday?: number; aiQuotaRemaining?: number }) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        plan: usage.plan || prev.plan,
        aiCountToday: usage.aiCountToday !== undefined ? usage.aiCountToday : prev.aiCountToday,
        aiQuotaRemaining: usage.aiQuotaRemaining !== undefined ? usage.aiQuotaRemaining : prev.aiQuotaRemaining,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Listen for Google Auth Popup postMessage callback
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

  // Helper an toàn đọc phản hồi JSON tránh lỗi Unexpected end of JSON input
  const safeFetchJson = async (url: string, options: RequestInit): Promise<{ res: Response; data: any }> => {
    const res = await fetch(url, options);
    let data: any = {};
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text.slice(0, 250) };
      }
    }
    if (!res.ok && !data.error) {
      if (res.status === 405) {
        data.error = 'Lỗi 405 (Method Not Allowed): Cloudflare Pages chưa nhận diện được route Functions /api/auth. Vui lòng kiểm tra lại D1 binding trong Cloudflare Pages Settings.';
      } else if (res.status === 503) {
        data.error = 'Lỗi 503: Chưa cấu hình binding D1 Database trong Cloudflare Pages > Settings > Functions.';
      } else {
        data.error = `Lỗi kết nối máy chủ (${res.status})`;
      }
    }
    return { res, data };
  };

  const signupWithGoogle = async (
    emailOrToken: string,
    customName?: string,
    customAvatar?: string
  ): Promise<any> => {
    const isToken = !emailOrToken.includes('@');
    const bodyPayload = isToken
      ? { accessToken: emailOrToken }
      : {
          email: emailOrToken.trim().toLowerCase(),
          name: customName?.trim() || emailOrToken.split('@')[0],
          avatar: customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailOrToken)}`
        };

    try {
      const { res, data } = await safeFetchJson('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (res.status === 409 || data.alreadyExists) {
        return {
          success: false,
          alreadyExists: true,
          error: data.error || 'Tài khoản với email này đã tồn tại trên hệ thống. Vui lòng chuyển sang tab Đăng nhập.',
        };
      }
      if (data.success && data.customer) {
        const newUser: UserAccount = data.customer;
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setIsLoginModalOpen(false);
        return { success: true, user: newUser };
      }
      return { success: false, error: data.error || 'Đăng ký không thành công' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  };

  const loginWithGoogle = async (
    emailOrToken: string,
    customName?: string,
    customAvatar?: string
  ): Promise<any> => {
    const isToken = !emailOrToken.includes('@');
    const bodyPayload = isToken
      ? { accessToken: emailOrToken }
      : {
          email: emailOrToken.trim().toLowerCase(),
          name: customName?.trim() || emailOrToken.split('@')[0],
          avatar: customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailOrToken)}`
        };

    try {
      const { res, data } = await safeFetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (res.status === 404 || data.notRegistered) {
        return {
          success: false,
          notRegistered: true,
          error: data.error || 'Chưa có tài khoản. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới.',
        };
      }
      if (data.success && data.customer) {
        const loggedInUser: UserAccount = data.customer;
        setUser(loggedInUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
        setIsLoginModalOpen(false);
        return { success: true, user: loggedInUser };
      }
      return { success: false, error: data.error || 'Đăng nhập không thành công' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  };

  // Xác nhận đơn thanh toán PayPal
  const confirmPaypalPayment = async (plan: 'monthly' | 'yearly', orderId: string): Promise<any> => {
    if (!user?.email) {
      setIsLoginModalOpen(true);
      return { success: false, error: 'Vui lòng đăng nhập trước khi thanh toán' };
    }

    try {
      const { res, data } = await safeFetchJson('/api/payments/paypal-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          plan,
          email: user.email,
        })
      });

      if (data.success && data.customer) {
        setUser(data.customer);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
        return { success: true, customer: data.customer, message: data.message };
      }
      return { success: false, error: data.error || 'Xác nhận PayPal thất bại' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  };

  // Khách hàng bấm "Đã chuyển khoản, chờ xác nhận" cho VietQR / MoMo
  const submitTransferRecord = async (
    plan: 'monthly' | 'yearly',
    paymentMethod: 'vietqr' | 'momo',
    memo: string,
    amount?: number
  ): Promise<any> => {
    if (!user?.email) {
      setIsLoginModalOpen(true);
      return { success: false, error: 'Vui lòng đăng nhập trước khi xác nhận chuyển khoản' };
    }

    try {
      const { data } = await safeFetchJson('/api/payments/transfer-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          paymentMethod,
          memo,
          amount,
          email: user.email,
        })
      });
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi gửi yêu cầu chuyển khoản' };
    }
  };

  // Xác nhận thủ công bằng ADMIN_KEY
  const adminGrantPlan = async (
    email: string,
    plan: 'monthly' | 'yearly',
    adminKey: string,
    days?: number,
    quota?: number
  ): Promise<any> => {
    try {
      const { data } = await safeFetchJson('/api/admin/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey,
          email,
          plan,
          days,
          quota,
        })
      });

      if (data.success && data.customer) {
        if (user?.email && user.email.toLowerCase() === email.toLowerCase()) {
          setUser(data.customer);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.customer));
        }
        return { success: true, customer: data.customer, message: data.message };
      }
      return { success: false, error: data.error || 'Cấp quyền Admin thất bại' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
  };

  const upgradePlan = async (
    plan: 'monthly' | 'yearly',
    paymentMethod: string = 'vietqr',
    orderId?: string
  ): Promise<any> => {
    if (paymentMethod === 'paypal') {
      return confirmPaypalPayment(plan, orderId || `PP-${Date.now()}`);
    }
    return submitTransferRecord(
      plan,
      paymentMethod === 'momo' ? 'momo' : 'vietqr',
      `VIP-${plan.toUpperCase()}-${user?.email?.split('@')[0]}`
    );
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isVip,
        vipPlan,
        daysRemaining,
        aiQuotaRemaining,
        aiCountToday,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isPricingModalOpen,
        setIsPricingModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithGoogle,
        signupWithGoogle,
        confirmPaypalPayment,
        submitTransferRecord,
        adminGrantPlan,
        upgradePlan,
        refreshUser,
        updateUserUsage,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
