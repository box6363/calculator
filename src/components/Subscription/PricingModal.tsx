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
    confirmPaypalPayment,
    submitTransferRecord,
    adminGrantPlan,
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

  const [transferPendingInfo, setTransferPendingInfo] = useState<{
    memo: string;
    amount: number;
    channelName: string;
    planLabel: string;
  } | null>(null);

  const [showAdminGrant, setShowAdminGrant] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);

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

  // Xác nhận đã thanh toán hoặc chuyển khoản
  const handleConfirmPayment = async () => {
    if (!user?.email) {
      setIsPricingModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentChannel === 'paypal') {
        const orderId = `PP-${Date.now().toString(36).toUpperCase()}`;
        const res = await confirmPaypalPayment(selectedPlan, orderId);

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
      } else {
        // VietQR / MoMo: Ghi nhận yêu cầu chuyển khoản chờ xác nhận
        await submitTransferRecord(selectedPlan, paymentChannel as any, transferMemo, currentPriceVND);
        setTransferPendingInfo({
          memo: transferMemo,
          amount: currentPriceVND,
          channelName: paymentChannel === 'momo' ? 'Ví MoMo' : 'VietQR Napas',
          planLabel
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminGrant = async () => {
    if (!user?.email) return;
    if (!adminKey) {
      setAdminError(isVi ? 'Vui lòng nhập ADMIN_KEY' : 'Please enter ADMIN_KEY');
      return;
    }
    setIsProcessing(true);
    setAdminError(null);
    try {
      const res = await adminGrantPlan(user.email, selectedPlan, adminKey);
      if (res.success && res.customer) {
        const now = new Date();
        const expires = res.customer.expiresAt ? new Date(res.customer.expiresAt) : new Date(now.getTime() + durationDays * 86400000);
        setSuccessData({
          plan: selectedPlan,
          email: user.email,
          subscribedAt: now.toLocaleDateString(isVi ? 'vi-VN' : 'en-US'),
          expiresAt: expires.toLocaleDateString(isVi ? 'vi-VN' : 'en-US'),
          daysRemaining: res.customer.daysRemaining || durationDays,
          price: currentPriceUSD,
        });
      } else {
        setAdminError(res.error || (isVi ? 'Sai ADMIN_KEY hoặc không thể cấp quyền' : 'Invalid ADMIN_KEY'));
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
                  {selectedPlan === 'yearly' ? 'GIẢM $89.99 ➔ $49.99/NĂM' : 'GIẢM $6.99 ➔ $4.99/THÁNG'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVi 
                  ? 'Sử dụng AI tool 1.500 lượt hỏi/tháng • Tắt 100% quảng cáo • Xuất file 4K'
                  : '1,500 AI queries/month • 100% Ad-Free • 4K Exports'}
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
                    ? 'Dữ liệu bản quyền VIP đã được đồng bộ vào CSDL hệ thống. Bạn đã có 1.500 lượt hỏi AI Tool/tháng và tắt hoàn toàn quảng cáo!'
                    : 'Your VIP license has been recorded in the database. 1,500 AI queries/month and 100% ad-free experience are now active!'}
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
                      {successData.plan === 'yearly' ? 'Gói 1 Năm (Giảm còn $49.99)' : 'Gói 1 Tháng (Giảm còn $4.99)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Hạn mức AI:' : 'AI Quota:'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">1.500 lượt hỏi / tháng</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">{isVi ? 'Quảng cáo:' : 'Ads:'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Tắt 100%</span>
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
          ) : transferPendingInfo ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-6 text-center space-y-3 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-3xl shadow-sm">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Clock className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-lg text-blue-900 dark:text-blue-100">
                  {isVi ? 'Đã Ghi Nhận Chuyển Khoản • Chờ Xác Nhận' : 'Transfer Logged • Pending Confirmation'}
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 max-w-md mx-auto">
                  {isVi
                    ? 'Hệ thống đã lưu thông tin chuyển khoản của bạn. Ban quản trị sẽ đối soát và kích hoạt gói VIP cho bạn trong thời gian sớm nhất (thường từ 1-5 phút).'
                    : 'Your transfer notification has been submitted. The admin will verify and activate your VIP subscription shortly (typically within 1-5 minutes).'}
                </p>

                {/* Bảng chi tiết đối soát */}
                <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{isVi ? 'Tài khoản:' : 'Account:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{isVi ? 'Gói đăng ký:' : 'Plan:'}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{transferPendingInfo.planLabel}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{isVi ? 'Cú pháp chuyển khoản:' : 'Transfer Memo:'}</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{transferPendingInfo.memo}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{isVi ? 'Số tiền:' : 'Amount:'}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatVND(transferPendingInfo.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{isVi ? 'Trạng thái:' : 'Status:'}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span>{isVi ? 'Đã chuyển khoản, chờ xác nhận' : 'Transferred, pending confirmation'}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferPendingInfo(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {isVi ? 'Quay lại phương thức' : 'Back to payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferPendingInfo(null);
                      setIsPricingModalOpen(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    {isVi ? 'Hoàn tất & Đóng' : 'Done & Close'}
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
                    ? 'Để đảm bảo quyền lợi gói VIP (giảm còn $4.99/tháng hoặc $49.99/năm) được kích hoạt chính xác cho bạn và lưu trữ lâu dài vào CSDL, vui lòng đăng nhập tài khoản Google.'
                    : 'To ensure your VIP license (discounted to $4.99/mo or $49.99/yr) is attached to your account, please sign in with Google.'}
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
                  {isVi ? 'Các gói cước VIP ưu đãi sẵn sàng:' : 'Available Discounted VIP Plans:'}
                </div>
                <div className="flex items-center justify-between">
                  <span>• {isVi ? 'Gói VIP 1 Tháng (30 ngày):' : 'VIP 1 Month (30 days):'}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    <span className="line-through text-slate-400 font-normal mr-1.5">$6.99</span>$4.99 / tháng (~125.000đ)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• {isVi ? 'Gói VIP 1 Năm (12 tháng - Siêu rẻ):' : 'VIP 1 Year (12 months):'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    <span className="line-through text-slate-400 font-normal mr-1.5">$89.99</span>$49.99 / năm (~1.250.000đ)
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isVi ? 'Sử dụng AI tool 1.500 lượt hỏi / tháng' : '1,500 AI queries / month'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isVi ? 'Tắt 100% quảng cáo gây gián đoạn' : '100% Ad-Free Experience'}</span>
                  </div>
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

              {/* Lựa chọn 2 gói: $6.99 giảm về $4.99/tháng & $89.99 giảm về $49.99/năm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Gói 1 Tháng: Giảm từ 6.99$ xuống 4.99$ */}
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
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      GIẢM ~29%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                      $6.99
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                      $4.99
                    </span>
                    <span className="text-xs text-slate-500">/ {isVi ? 'tháng' : 'month'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {isVi ? 'Gói 6.99$ giảm về 4.99$ (~125.000 VNĐ). Sử dụng AI tool 1.500 lượt hỏi/tháng, tắt 100% quảng cáo.' : 'Discounted from $6.99 to $4.99 (~125,000 VND). 1,500 AI queries/mo, 100% ad-free.'}
                  </p>
                </div>

                {/* Gói 1 Năm: Giảm từ 89.99$ xuống 49.99$ */}
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
                    {isVi ? 'GIẢM SỐC: $89.99 ➔ $49.99' : 'DEAL: $89.99 ➔ $49.99'}
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
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                      $89.99
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
                      $49.99
                    </span>
                    <span className="text-xs text-slate-500">/ {isVi ? 'năm (12 tháng)' : 'year (12 mo)'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {isVi ? 'Gói 89.99$ giảm về 49.99$ (~1.250.000 VNĐ, chỉ ~4.16$/tháng). Tiết kiệm tối đa cả năm.' : 'Discounted from $89.99 to $49.99 (~1,250,000 VND, ~$4.16/mo). Maximum annual savings.'}
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
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Quyền lợi gói VIP Pro ({selectedPlan === 'yearly' ? '89.99$ ➔ 49.99$/năm' : '6.99$ ➔ 4.99$/tháng'}):</span>
                  </span>
                  <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    ƯU ĐÃI GIỚI HẠN
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      Sử dụng AI tool 1.500 lượt hỏi / tháng
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      Tắt 100% quảng cáo gây gián đoạn
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Tốc độ xử lý ưu tiên băng thông máy chủ cao nhất</span>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Xuất báo cáo PDF, Excel & Biểu đồ 4K không giới hạn</span>
                  </div>
                </div>
              </div>

              {/* Nút hành động thanh toán & Admin Key Activation */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  id="btn-confirm-payment"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 hover:brightness-105 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isVi ? 'Đang gửi thông tin...' : 'Submitting...'}</span>
                    </>
                  ) : paymentChannel === 'paypal' ? (
                    <>
                      <span className="font-black italic">PP</span>
                      <span>
                        {isVi 
                          ? `Thanh toán qua PayPal ($${currentPriceUSD} USD) • ${planLabel}`
                          : `Pay with PayPal ($${currentPriceUSD} USD) • ${planLabel}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>
                        {isVi 
                          ? `Đã chuyển khoản, chờ xác nhận • ${planLabel}`
                          : `I have transferred, pending confirmation • ${planLabel}`}
                      </span>
                    </>
                  )}
                </button>

                {/* Quản trị viên kích hoạt bằng ADMIN_KEY */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
                    <span>{isVi ? 'Đang đăng nhập bằng:' : 'Logged in as:'} <strong className="text-slate-700 dark:text-slate-300">{user.email}</strong></span>
                    <button
                      type="button"
                      onClick={() => setShowAdminGrant(!showAdminGrant)}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      {showAdminGrant ? (isVi ? 'Đóng Admin Tool' : 'Close Admin Tool') : (isVi ? 'Kích hoạt bằng Admin Key' : 'Grant with Admin Key')}
                    </button>
                  </div>

                  {showAdminGrant && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-800 dark:text-amber-300">
                          {isVi ? 'Xác nhận thủ công bằng ADMIN_KEY:' : 'Manual Grant with ADMIN_KEY:'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">(Mặc định: admin_secret_key_123)</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                          placeholder="Nhập ADMIN_KEY..."
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={handleAdminGrant}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isProcessing ? 'Đang cấp...' : (isVi ? 'Kích hoạt' : 'Grant')}
                        </button>
                      </div>
                      {adminError && (
                        <p className="text-[11px] text-rose-600 font-semibold">{adminError}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
