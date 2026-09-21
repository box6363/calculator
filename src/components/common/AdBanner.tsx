import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  ShieldCheck,
  Monitor,
  Tablet,
  Smartphone,
  Star,
  ArrowRight
} from 'lucide-react';

export interface AdBannerProps {
  slot?: 'top' | 'middle' | 'bottom' | 'sidebar';
  format?: 'horizontal' | 'rectangle' | 'compact';
  className?: string;
}

export const AD_CLIENT_ID = 'ca-pub-7502241826408007';

export const AdBanner: React.FC<AdBannerProps> = ({
  slot = 'middle',
  format = 'horizontal',
  className = '',
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleAdClick = () => {
    window.open('https://cloud.google.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`ad-container-${slot}`}
      data-ad-client={AD_CLIENT_ID}
      data-ad-slot={`slot-${slot}`}
      data-ad-format={format}
      className={`w-full overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0C1427]/90 shadow-md transition-all ${className}`}
      role="complementary"
      aria-label="Khu vực quảng cáo tài trợ"
    >
      {/* ========================================================================= */}
      {/* 1. MÁY TÍNH (DESKTOP - >= 1024px): Chuẩn Leaderboard 728x90 / Billboard  */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex items-center justify-between p-3.5 px-5 gap-4 min-h-[86px]">
        {/* Left branding & Partner details */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Monitor className="w-6 h-6" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Quảng cáo đối tác
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Google Cloud Partner
              </span>
              <div className="flex items-center text-amber-400 text-xs">
                <Star className="w-3 h-3 fill-amber-400" />
                <span className="text-[11px] text-slate-300 ml-1 font-mono font-bold">4.9 / 5.0</span>
              </div>
            </div>

            <p className="text-sm font-bold text-white tracking-tight truncate">
              Hạ tầng Điện toán Đám mây & Nền tảng AI Thế hệ mới cho Doanh nghiệp
            </p>
            <p className="text-xs text-slate-400 truncate">
              Miễn phí $300 tín dụng trải nghiệm tính toán hiệu năng cao, bảo mật cấp độ trung tâm dữ liệu toàn cầu.
            </p>
          </div>
        </div>

        {/* Right CTA & Ad Info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowInfo(prev => !prev)}
              aria-label="Thông tin quảng cáo"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors"
              title="AdChoices • Lựa chọn quảng cáo"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showInfo && (
              <div className="absolute right-0 top-full mt-1.5 w-60 p-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-[11px] text-slate-300 z-50 animate-in fade-in">
                <p className="font-semibold text-white mb-1">Về quảng cáo này</p>
                <p>Hiển thị phù hợp theo phiên bản trình duyệt máy tính, đã qua kiểm duyệt an toàn.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdClick}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Khám phá ngay</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MÁY TÍNH BẢNG (TABLET - 640px đến 1023px): Chuẩn 468x60 / 728x90 Res  */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex lg:hidden items-center justify-between p-3 px-4 gap-3 min-h-[76px]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Tablet className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tài trợ
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                Dịch vụ Điện toán & AI Thông minh
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">
              Nhận ngay $300 Credits trải nghiệm máy chủ đám mây tốc độ cao
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleAdClick}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ĐIỆN THOẠI (MOBILE - < 640px, ví dụ Samsung S22+): Chuẩn Mobile 320x50 */}
      {/* ========================================================================= */}
      <div className="flex sm:hidden items-center justify-between p-2.5 px-3 gap-2.5 min-h-[58px]">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                QC
              </span>
              <span className="text-[10px] text-slate-400 truncate">Google Cloud</span>
            </div>
            <p className="text-[11px] font-bold text-white truncate leading-tight">
              Tặng $300 dùng thử Cloud & AI
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleAdClick}
            className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md transition-all touch-manipulation cursor-pointer"
          >
            Xem
          </button>
        </div>
      </div>
    </div>
  );
};
