import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  Calendar,
  Clock,
  Copy,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VIETQR_BANKS, VietQRBank, formatVND, getVietQRImageUrl } from '../../utils/vietqrBanks';

export const PricingModal: React.FC = () => {
  const {
    user,
    isVip,
    isPricingModalOpen,
    setIsPricingModalOpen,
    setIsLoginModalOpen,
    upgradePlan
  } = useAuth();

  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Selected plan: 'monthly' ($4.99) or 'yearly' ($49.99)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentChannel, setPaymentChannel] = useState<'vietqr' | 'momo' | 'paypal'>('vietqr');
  const [selectedBank, setSelectedBank] = useState<VietQRBank>(VIETQR_BANKS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const [successData, setSuccessData] = useState<{
    plan: 'monthly' | 'yearly';
    email: string;
    subscribedAt: string;
    expiresAt: string;
    daysRemaining: number;
    price: number;
  } | null>(null);

  if (!isPricingModalOpen) return null;

  const currentPriceUSD = selectedPlan === 'yearly' ? 49.99 : 4.99;
  const currentPriceVND = selectedPlan === 'yearly' ? 1250000 : 125000;
  const durationDays = selectedPlan === 'yearly' ? 365 : 30;
  const planLabel = selectedPlan === 'yearly' 
    ? (isVi ? 'Gói VIP 1 Năm ($49.99)' : 'VIP 1 Year ($49.99)')
    : (isVi ? 'Gói VIP 1 Tháng ($4.99)' : 'VIP 1 Month ($4.99)');

  const userEmail = user?.email || 'guest@example.com';
  const cleanEmailTag = userEmail.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toUpperCase();
  const transferMemo = `VIP${selectedPlan === 'yearly' ? '4999' : '499'} ${cleanEmailTag}`;
  const defaultAccountNumber = '1023456789';
  const beneficiaryName = 'CONG TY WEB CALCULATOR PRO';

  // VietQR Image URL
  const vietQrUrl = getVietQRImageUrl(
    selectedBank.bin,
    defaultAccountNumber,
    currentPriceVND,
    transferMemo,
    beneficiaryName
  );

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(defaultAccountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(transferMemo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(currentPriceVND.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Kích hoạt thanh toán & Lưu vào CSDL
  const handleConfirmPayment = async (method: string = paymentChannel) => {
    if (!user?.email) {
      setIsPricingModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = `PAY-${Date.now().toString(36).toUpperCase()}`;
      const res = await upgradePlan(selectedPlan, method, orderId);

      if (res.success && res.customer) {
        const now = new Date();
        const expires = res.customer.expiresAt ? new Date(res.customer.expiresAt) : new Date(now.getTime() + durationDays * 86400000);

        setSuccessData({
          plan: selectedPlan,
          email: user.email,
          subscribedAt: now.toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          expiresAt: expires.toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          daysRemaining: res.customer.daysRemaining || durationDays,
          price: currentPriceUSD,
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-[#141526] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Crown className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isVi ? 'Nâng Cấp Gói VIP Pro' : 'Upgrade to VIP Pro'}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {selectedPlan === 'yearly' ? '49.99$/năm' : '4.99$/tháng'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVi 
                  ? 'Mở khóa không giới hạn AI Solver • Xuất báo cáo PDF/Excel 4K • Tốc độ tối đa'
                  : 'Unlimited AI Solver • 4K PDF/Excel Exports • Priority Speed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSuccessData(null);
              setIsPricingModalOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Màn hình thành công */}
          {successData ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-6 text-center space-y-3 bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-sm">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-lg text-emerald-900 dark:text-emerald-100">
                  {isVi ? 'Kích Hoạt VIP Pro Thành Công!' : 'VIP Pro Activated Successfully!'}
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  {isVi
                    ? 'Dữ liệu bản quyền VIP đã được đồng bộ vào CSDL hệ thống. Bạn đã mở khóa không giới hạn lượt dùng Gemini AI và các tính năng cao cấp!'
                    : 'Your VIP license has been recorded in the database. Unlimited Gemini AI and premium features are now unlocked!'}
                </p>

                {/* Bảng chi tiết */}
                <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Tài khoản Google:' : 'Account:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{successData.email}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Gói dịch vụ:' : 'Plan:'}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {successData.plan === 'yearly' ? 'Gói 1 Năm ($49.99)' : 'Gói 1 Tháng ($4.99)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {isVi ? 'Ngày kích hoạt:' : 'Activated At:'}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{successData.subscribedAt}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {isVi ? 'Ngày hết hạn:' : 'Expires At:'}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{successData.expiresAt}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Thời hạn hiệu lực:' : 'Days Remaining:'}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                      {successData.daysRemaining} {isVi ? 'ngày' : 'days'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessData(null);
                      setIsPricingModalOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isVi ? 'Bắt đầu trải nghiệm VIP Pro ngay' : 'Start Using VIP Pro Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : !user ? (
            /* 2. CHƯA ĐĂNG NHẬP GOOGLE: BẮT BUỘC ĐĂNG NHẬP TRƯỚC */
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 mx-auto flex items-center justify-center shadow-xs">
                <Crown className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isVi ? 'Vui lòng đăng nhập Google trước khi thanh toán' : 'Please Sign In with Google Before Subscribing'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? 'Để đảm bảo quyền lợi gói VIP ($4.99/tháng hoặc $49.99/năm) được kích hoạt chính xác cho bạn và lưu trữ lâu dài vào CSDL, vui lòng đăng nhập tài khoản Google.'
                    : 'To ensure your VIP license ($4.99/mo or $49.99/yr) is attached to your account and saved permanently in the database, please sign in with Google.'}
                </p>
              </div>

              <div className="max-w-sm mx-auto pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPricingModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-3 text-slate-900 dark:text-white font-bold text-sm"
                >
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
                  <span>{isVi ? 'Đăng nhập bằng tài khoản Google' : 'Sign in with Google'}</span>
                </button>
              </div>

              {/* Thông tin 2 gói */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  {isVi ? 'Các gói cước VIP có sẵn:' : 'Available VIP Plans:'}
                </div>
                <div className="flex items-center justify-between">
                  <span>• {isVi ? 'Gói VIP 1 Tháng (30 ngày):' : 'VIP 1 Month (30 days):'}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">$4.99 / tháng (~125.000đ)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• {isVi ? 'Gói VIP 1 Năm (12 tháng - Tiết kiệm):' : 'VIP 1 Year (12 months - Best Value):'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">$49.99 / năm (~1.250.000đ)</span>
                </div>
              </div>
            </div>
          ) : (
            /* 3. ĐÃ ĐĂNG NHẬP: CHỌN GÓI VÀ THANH TOÁN (VIETQR / MOMO / PAYPAL) */
            <>
              {/* Badge User Google */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Google
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-mono truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{isVi ? 'Gói hiện tại:' : 'Current Plan:'}</span>
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-400">
                    {user.plan === 'yearly' ? 'VIP Năm' : user.plan === 'monthly' ? 'VIP Tháng' : 'Free (Miễn phí)'}
                  </span>
                </div>
              </div>

              {/* Lựa chọn 2 gói: $4.99/tháng & $49.99/năm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Gói 1 Tháng: 4.99$ */}
                <div
                  id="btn-select-plan-monthly"
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'monthly'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-md shadow-blue-500/15 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {isVi ? 'Gói VIP 1 Tháng' : 'VIP 1 Month'}
                    </span>
                    {selectedPlan === 'monthly' && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      $4.99
                    </span>
                    <span className="text-xs text-slate-500">/ {isVi ? 'tháng' : 'month'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {isVi ? 'Tương đương ~125.000 VNĐ. Thời hạn 30 ngày, mở khóa toàn bộ tính năng và AI.' : 'Equivalent to ~125,000 VND. 30-day access to all premium features and AI.'}
                  </p>
                </div>

                {/* Gói 1 Năm: 49.99$ */}
                <div
                  id="btn-select-plan-yearly"
                  onClick={() => setSelectedPlan('yearly')}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'yearly'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-md shadow-amber-500/15 ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-extrabold uppercase shadow-xs">
                    {isVi ? 'Tiết Kiệm ~17%' : 'Best Value ~17% Off'}
                  </span>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{isVi ? 'Gói VIP 1 Năm' : 'VIP 1 Year'}</span>
                      <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </span>
                    {selectedPlan === 'yearly' && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      $49.99
                    </span>
                    <span className="text-xs text-slate-500">/ {isVi ? 'năm (12 tháng)' : 'year (12 mo)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {isVi ? 'Tương đương ~1.250.000 VNĐ (~4.16$/tháng). Tiết kiệm tối đa, thanh toán 1 lần dùng cả năm.' : 'Equivalent to ~1,250,000 VND (~$4.16/mo). Best price for 365 days of unlimited access.'}
                  </p>
                </div>
              </div>

              {/* Lựa chọn Kênh Thanh Toán (VietQR, MoMo, PayPal) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {isVi ? 'Chọn phương thức thanh toán:' : 'Select Payment Method:'}
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isVi ? 'Kích hoạt tự động' : 'Automatic Activation'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('vietqr')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentChannel === 'vietqr'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>VietQR Napas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('momo')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentChannel === 'momo'
                        ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 shadow-xs ring-2 ring-pink-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm">👛</span>
                    <span>Ví MoMo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('paypal')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentChannel === 'paypal'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-black italic text-blue-600 dark:text-blue-400">PP</span>
                    <span>PayPal / Thẻ</span>
                  </button>
                </div>
              </div>

              {/* Chi tiết kênh thanh toán VietQR */}
              {paymentChannel === 'vietqr' && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Mã VietQR động */}
                    <div className="bg-white p-2.5 rounded-2xl border border-emerald-300 dark:border-emerald-700 shadow-sm shrink-0">
                      <img
                        src={vietQrUrl}
                        alt="VietQR Transfer"
                        className="w-40 h-40 object-contain rounded-lg"
                      />
                      <p className="text-[10px] text-center text-slate-500 font-semibold mt-1">
                        Quét bằng App Ngân Hàng
                      </p>
                    </div>

                    {/* Thông tin chuyển khoản */}
                    <div className="space-y-2 flex-1 w-full text-xs">
                      {/* Chọn ngân hàng */}
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block mb-1">Ngân hàng thụ hưởng:</span>
                        <select
                          value={selectedBank.bin}
                          onChange={(e) => {
                            const found = VIETQR_BANKS.find(b => b.bin === e.target.value);
                            if (found) setSelectedBank(found);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          {VIETQR_BANKS.map(b => (
                            <option key={b.bin} value={b.bin}>
                              {b.shortName} ({b.code}) - {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Số tài khoản */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Số tài khoản:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{defaultAccountNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedAccount ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      {/* Số tiền VNĐ */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Số tiền thanh toán:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{formatVND(currentPriceVND)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyAmount}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedAmount ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      {/* Nội dung chuyển khoản */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Nội dung chuyển khoản (bắt buộc):</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{transferMemo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyMemo}
                          className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedMemo ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chi tiết MoMo */}
              {paymentChannel === 'momo' && (
                <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-pink-700 dark:text-pink-300">Chuyển qua Ví MoMo:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatVND(currentPriceVND)}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-1.5 border border-pink-100 dark:border-pink-900/40">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại MoMo:</span>
                      <span className="font-mono font-bold">0988123456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Người nhận:</span>
                      <span className="font-semibold uppercase">CONG TY WEB CALCULATOR</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Lời nhắn:</span>
                      <span className="font-mono font-bold text-pink-600 dark:text-pink-400">{transferMemo}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chi tiết PayPal */}
              {paymentChannel === 'paypal' && (
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700 dark:text-blue-300">PayPal International Checkout:</span>
                    <span className="font-bold text-slate-900 dark:text-white">${currentPriceUSD} USD</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Hỗ trợ thanh toán toàn cầu với thẻ tín dụng Visa, MasterCard, American Express hoặc tài khoản PayPal an toàn tuyệt đối.
                  </p>
                </div>
              )}

              {/* Quyền lợi VIP */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Quyền lợi tài khoản VIP Pro ({selectedPlan === 'yearly' ? '$49.99/năm' : '$4.99/tháng'}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Không giới hạn câu hỏi giải toán AI Gemini</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Tốc độ xử lý ưu tiên băng thông cao nhất</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Xuất báo cáo PDF, Excel & Biểu đồ 4K</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sạch 100% không quảng cáo gây gián đoạn</span>
                  </div>
                </div>
              </div>

              {/* Nút hành động thanh toán & Nút kích hoạt thử nghiệm */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  id="btn-confirm-payment"
                  disabled={isProcessing}
                  onClick={() => handleConfirmPayment(paymentChannel)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isVi ? 'Đang xử lý kích hoạt CSDL...' : 'Activating in database...'}</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-white" />
                      <span>
                        {isVi 
                          ? `Xác nhận đã chuyển khoản • Kích hoạt ${planLabel}`
                          : `Confirm Payment • Activate ${planLabel}`}
                      </span>
                    </>
                  )}
                </button>

                {/* Nút kích hoạt thử nghiệm cho Dev/Preview (Đúng chuẩn tài liệu tham khảo) */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1 pt-1">
                  <span>{isVi ? 'Đang đăng nhập bằng:' : 'Logged in as:'} <strong className="text-slate-700 dark:text-slate-300">{user.email}</strong></span>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleConfirmPayment('test_simulation')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                    title="Kiểm tra lưu CSDL và tính thời hạn ngay trong bản xem trước"
                  >
                    {isProcessing ? 'Đang kích hoạt...' : (isVi ? 'Kích hoạt thử nghiệm (Test Lưu CSDL)' : 'Test Activate (Save DB)')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
