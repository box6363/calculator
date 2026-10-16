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

  // Calculate VIP status
  const isVip = Boolean(
    user && 
    (user.plan === 'monthly' || user.plan === 'yearly') && 
    (user.daysRemaining === undefined || user.daysRemaining > 0)
  );

  const vipPlan: UserPlan = user?.plan || 'free';
  const daysRemaining = user?.daysRemaining;

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

  // Sync / Verify with server on load if user is logged in
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

  const signupWithGoogle = async (
    customEmail?: string,
    customName?: string,
    customAvatar?: string
  ): Promise<any> => {
    const email = (customEmail || '').trim().toLowerCase();
    if (!email) {
      return { success: false, error: 'Thiếu địa chỉ email đăng ký' };
    }
    const name = customName?.trim() || email.split('@')[0];
    const avatar =
      customAvatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });
      const data = await res.json();
      if (res.status === 409 || data.alreadyExists) {
        return {
          success: false,
          alreadyExists: true,
          error: data.error || 'Tài khoản với email này đã tồn tại. Vui lòng chuyển sang tab Đăng nhập.',
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
    customEmail?: string,
    customName?: string,
    customAvatar?: string
  ): Promise<any> => {
    const email = (customEmail || '').trim().toLowerCase();
    if (!email) {
      return { success: false, error: 'Thiếu địa chỉ email đăng nhập' };
    }
    const name = customName?.trim() || email.split('@')[0];
    const avatar =
      customAvatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });
      const data = await res.json();
      if (res.status === 404 || data.notRegistered) {
        return {
          success: false,
          notRegistered: true,
          error: data.error || 'Tài khoản chưa tồn tại. Vui lòng chuyển sang tab Đăng ký.',
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

  const upgradePlan = async (
    plan: 'monthly' | 'yearly',
    paymentMethod: string = 'vietqr',
    orderId?: string
  ): Promise<any> => {
    if (!user?.email) {
      setIsLoginModalOpen(true);
      return { success: false, error: 'Vui lòng đăng nhập trước khi kích hoạt' };
    }

    try {
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
        return { success: true, customer: data.customer };
      }
      return { success: false, error: data.error || 'Nâng cấp không thành công' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
    }
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
        isLoginModalOpen,
        setIsLoginModalOpen,
        isPricingModalOpen,
        setIsPricingModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithGoogle,
        signupWithGoogle,
        upgradePlan,
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
