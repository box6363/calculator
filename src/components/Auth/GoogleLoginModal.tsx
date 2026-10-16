import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  Crown,
  Check,
  Copy,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppLogo } from '../common/AppLogo';
import { useLanguage } from '../../context/LanguageContext';

// Client ID chính thức từ Google Cloud Console
const OFFICIAL_GOOGLE_CLIENT_ID =
  '724645847537-juildda4mhl5k5e3gquo1htpf6f33u0r.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
    paypal?: any;
  }
}

export const GoogleLoginModal: React.FC = () => {
  const {
    user,
    isVip,
    daysRemaining,
    isLoginModalOpen,
    setIsLoginModalOpen,
    setIsPricingModalOpen,
    authModalMode,
    loginWithGoogle,
    signupWithGoogle,
    logout
  } = useAuth();

  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUri, setCopiedUri] = useState(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  useEffect(() => {
    if (isLoginModalOpen) {
      setActiveTab(authModalMode || 'login');
      setErrorMessage(null);
      setLoading(false);
    }
  }, [isLoginModalOpen, authModalMode]);

  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://web-calculator.com';
  const callbackUrl = `${currentOrigin}/google-callback`;

  // Xử lý xác thực Google qua GIS Token Client hoặc Fallback Popup
  const handleGoogleAuth = async (mode: 'login' | 'signup') => {
    setLoading(true);
    setErrorMessage(null);

    // 1. Google Identity Services initTokenClient
    if (
      typeof window !== 'undefined' &&
      window.google?.accounts?.oauth2?.initTokenClient
    ) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: OFFICIAL_GOOGLE_CLIENT_ID,
          scope:
            'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch(
                  'https://www.googleapis.com/oauth2/v3/userinfo',
                  {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  }
                );
                if (res.ok) {
                  const userInfo = await res.json();
                  const email = userInfo.email.trim().toLowerCase();
                  const name = userInfo.name || email.split('@')[0];
                  const avatar = userInfo.picture;

                  if (mode === 'signup') {
                    const result = await signupWithGoogle(email, name, avatar);
                    if (result?.alreadyExists) {
                      await loginWithGoogle(email, name, avatar);
                    } else if (!result?.success) {
                      setErrorMessage(result?.error || (isVi ? 'Không thể tạo tài khoản.' : 'Failed to create account.'));
                    }
                  } else {
                    const result = await loginWithGoogle(email, name, avatar);
                    if (result?.notRegistered) {
                      await signupWithGoogle(email, name, avatar);
                    } else if (!result?.success) {
                      setErrorMessage(result?.error || (isVi ? 'Đăng nhập không thành công.' : 'Login failed.'));
                    }
                  }
                  setLoading(false);
                  return;
                }
              } catch (e: any) {
                setErrorMessage(isVi ? `Lỗi kết nối Google: ${e?.message || 'Không xác định'}` : `Google connection error: ${e?.message || 'Unknown'}`);
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

    // 2. Fallback sang Google OAuth 2.0 Account Chooser Popup
    const statePayload = encodeURIComponent(JSON.stringify({ mode }));
    const params = new URLSearchParams({
      client_id: OFFICIAL_GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl,
      response_type: 'token id_token',
      scope:
        'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      prompt: 'select_account',
      include_granted_scopes: 'true',
      state: statePayload,
      nonce: Date.now().toString(),
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const width = 500;
    const height = 650;
    const left =
      typeof window !== 'undefined'
        ? Math.max(0, (window.screen.width - width) / 2)
        : 100;
    const top =
      typeof window !== 'undefined'
        ? Math.max(0, (window.screen.height - height) / 2)
        : 100;

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

  const copyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopiedOrigin(true);
    setTimeout(() => setCopiedOrigin(false), 2000);
  };

  const copyCallbackUrl = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] bg-white dark:bg-[#141526] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          /* ========================================================
             GIAO DIỆN HỒ SƠ TÀI KHOẢN (KHI ĐÃ ĐĂNG NHẬP)
             ======================================================== */
          <div className="space-y-5">
            {/* Header hồ sơ */}
            <div className="text-center">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`
                  }
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md mx-auto"
                />
                {isVip && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Crown className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Thông tin gói tài khoản */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Gói tài khoản' : 'Plan'}</span>
                <span className={`font-bold flex items-center gap-1.5 ${isVip ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  {isVip && <Crown className="w-3.5 h-3.5 fill-amber-500" />}
                  <span>
                    {user.plan === 'yearly'
                      ? (isVi ? 'Gói VIP 1 Năm ($49.99)' : 'VIP 1 Year ($49.99)')
                      : user.plan === 'monthly'
                      ? (isVi ? 'Gói VIP 1 Tháng ($4.99)' : 'VIP 1 Month ($4.99)')
                      : (isVi ? 'Gói Miễn Phí (Free)' : 'Free Tier')}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Hạn mức AI Solver' : 'AI Solver Limit'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {isVip ? (isVi ? 'Không giới hạn ⚡' : 'Unlimited ⚡') : (isVi ? '3 lượt / ngày' : '3 uses / day')}
                </span>
              </div>

              {daysRemaining !== undefined && isVip && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Thời hạn bản quyền' : 'Time remaining'}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{isVi ? `Còn ${daysRemaining} ngày` : `${daysRemaining} days left`}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Các hành động */}
            <div className="space-y-2 pt-1">
              {!isVip ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsPricingModalOpen(true);
                  }}
                  className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Crown className="w-4 h-4 fill-white" />
                  <span>{isVi ? 'Nâng cấp Gói VIP (Chỉ từ 4.99$)' : 'Upgrade to VIP (From $4.99)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsPricingModalOpen(true);
                  }}
                  className="w-full h-10 px-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Gia hạn thêm gói VIP' : 'Extend VIP Subscription'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                className="w-full h-10 px-4 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isVi ? 'Đăng xuất tài khoản' : 'Sign out'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             GIAO DIỆN ĐĂNG NHẬP / ĐĂNG KÝ
             ======================================================== */
          <div className="space-y-4">
            {/* Logo thương hiệu */}
            <div className="text-center">
              <div className="flex justify-center mb-2.5">
                <AppLogo className="w-12 h-12 drop-shadow-md" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'login' 
                  ? (isVi ? 'Đăng nhập tài khoản' : 'Sign In to Account') 
                  : (isVi ? 'Đăng ký tài khoản mới' : 'Create Free Account')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {activeTab === 'login'
                  ? (isVi ? 'Tiếp tục với tài khoản Google để lưu lịch sử và đồng bộ gói VIP' : 'Continue with Google to sync history and VIP benefits')
                  : (isVi ? 'Tạo tài khoản miễn phí chỉ với 1 chạm qua Google' : 'Create your free account instantly with Google')}
              </p>
            </div>

            {/* Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                id="btn-auth-tab-login"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isVi ? 'Đăng nhập' : 'Sign In'}
              </button>
              <button
                type="button"
                id="btn-auth-tab-signup"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isVi ? 'Đăng ký' : 'Sign Up'}
              </button>
            </div>

            {/* Thông báo lỗi */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="flex-1 font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Nút bấm Google Sign-in */}
            <button
              type="button"
              id="btn-google-auth-submit"
              onClick={() => handleGoogleAuth(activeTab)}
              disabled={loading}
              className="w-full h-12 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>{isVi ? 'Đang kết nối Google...' : 'Connecting Google...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>
                    {activeTab === 'login'
                      ? (isVi ? 'Đăng nhập bằng Google' : 'Sign In with Google')
                      : (isVi ? 'Đăng ký bằng Google' : 'Sign Up with Google')}
                  </span>
                </>
              )}
            </button>

            {/* Quyền lợi tài khoản */}
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Lưu lịch sử tính toán và dữ liệu tài chính an toàn' : 'Save calculation history & financial results'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Trợ lý AI giải toán thông minh (3 lượt miễn phí/ngày)' : 'Smart AI calculation solver (3 free uses daily)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Dễ dàng nâng cấp VIP để mở khóa không giới hạn tính năng' : 'Easily upgrade to VIP for unlimited perks'}</span>
              </div>
            </div>

            {/* Điều khoản */}
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1 leading-relaxed">
              {isVi ? (
                <>Bằng cách tiếp tục, bạn đồng ý với <span className="underline cursor-pointer">Điều khoản dịch vụ</span> và <span className="underline cursor-pointer">Chính sách bảo mật</span>.</>
              ) : (
                <>By continuing, you agree to the <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</>
              )}
            </p>

            {/* Tùy chọn cấu hình OAuth Google dành cho Admin */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setShowConfigGuide(!showConfigGuide)}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 block mx-auto underline cursor-pointer"
              >
                {showConfigGuide 
                  ? (isVi ? 'Đóng cấu hình Google Console' : 'Close Google Console Guide') 
                  : (isVi ? 'Cấu hình OAuth (Dành cho Admin)' : 'OAuth Setup (For Admin)')}
              </button>

              {showConfigGuide && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-[10px] text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Thêm vào Google Cloud Console ➔ Credentials:
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span>Origin:</span>
                      <button
                        type="button"
                        onClick={copyOrigin}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        {copiedOrigin ? 'Đã copy!' : 'Sao chép'}
                      </button>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[9px] break-all select-all">
                      {currentOrigin}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span>Redirect URI:</span>
                      <button
                        type="button"
                        onClick={copyCallbackUrl}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        {copiedUri ? 'Đã copy!' : 'Sao chép'}
                      </button>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[9px] break-all select-all font-bold text-emerald-600 dark:text-emerald-400">
                      {callbackUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
