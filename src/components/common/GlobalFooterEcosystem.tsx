import React, { useState } from 'react';
import {
  Activity,
  Binary,
  Compass,
  ShieldCheck,
  ExternalLink,
  Landmark,
  FileCode,
  Check,
  Copy,
  X
} from 'lucide-react';
import { ToolId } from '../../types';

interface GlobalFooterEcosystemProps {
  onSelectTool: (id: ToolId) => void;
  onOpenTerms: () => void;
  onOpenGemini?: () => void;
}

export const GlobalFooterEcosystem: React.FC<GlobalFooterEcosystemProps> = ({
  onSelectTool,
  onOpenTerms,
  onOpenGemini
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleToolClick = (toolId: ToolId) => {
    onSelectTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySourceUrl = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <>
      <section 
        id="global-footer-ecosystem" 
        aria-label="Mạng lưới tiện ích và hệ sinh thái tính toán tiêu chuẩn quốc tế"
        style={{
          backgroundColor: 'var(--app-surface, #0B0F19)',
          borderColor: 'var(--app-border, #1E293B)',
        }}
        className="w-full max-w-6xl mx-auto mt-14 mb-8 rounded-3xl border text-slate-300 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md transition-all"
      >
        {/* Top Header Row with Title and Subtitle */}
        <div className="pb-6">
          <div className="space-y-3 max-w-4xl">
            {/* Main Section H2 Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[28px] font-extrabold text-white tracking-tight leading-tight">
              Hệ Sinh Thái Tính Toán & Quy Đổi Tiêu Chuẩn Quốc Tế
            </h2>

            {/* Subtitle description */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Nền tảng tính toán trực tuyến tốc độ cao, hỗ trợ chuẩn số học IEEE 754 kép 64-bit, thuật toán tài chính TVM ngân hàng, công thức y khoa quốc tế WHO & CDC, xuất báo cáo khấu hao chi tiết và xử lý dữ liệu hàng loạt không giới hạn.
            </p>
          </div>
        </div>

        {/* Separator Divider */}
        <div className="w-full h-px bg-slate-800/80 my-6" />

        {/* 5-Column Navigation Grid matching the screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 sm:gap-8 pt-2 text-xs sm:text-[13px]">
          
          {/* Column 1: Financial & Loans */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-[14.5px] pb-1 border-b border-slate-800/60">
              <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3>Tài Chính & Khoản Vay</h3>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleToolClick('mortgage')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Vay mua nhà (Mortgage)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('autoloan')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Vay mua ô tô trả góp (Auto Loan)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('loan')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Khoản vay tiêu dùng & Trả góp</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('interest')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Lãi suất đơn & Lãi suất kép</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('compound')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tiết kiệm tích lũy lãi kép</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('payment')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Thanh toán định kỳ niên kim (PMT)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('retirement')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Dự toán quỹ tài chính hưu trí</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('amortization')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Lịch trả nợ chi tiết (Amortization)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('investment')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Lợi nhuận đầu tư & Tăng trưởng ROI</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('salary')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tính lương Gross Net & Thuế TNCN</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Health & Fitness */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-[14.5px] pb-1 border-b border-slate-800/60">
              <Activity className="w-4 h-4 text-rose-400 shrink-0" />
              <h3>Sức Khỏe & Y Khoa</h3>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleToolClick('bmi')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Chỉ số khối cơ thể (BMI Calculator)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('calorie')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Nhu cầu calo hàng ngày (TDEE & BMR)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('bodyfat')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tỷ lệ mỡ cơ thể (Body Fat %)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('bmr')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tỷ lệ trao đổi chất cơ bản (BMR)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('idealweight')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Cân nặng lý tưởng theo chiều cao</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('pregnancy')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tính ngày dự sinh & Tuổi thai nhi</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('pace')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tốc độ chạy bộ Pace (min/km)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('armybodyfat')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Mỡ cơ thể chuẩn Quân đội Mỹ (Tape)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('idealweight')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Khoảng cân nặng an toàn WHO</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('ovulation')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Dự đoán ngày rụng trứng & Thụ thai</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Math & Scientific fx */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-[14.5px] pb-1 border-b border-slate-800/60">
              <Binary className="w-4 h-4 text-blue-400 shrink-0" />
              <h3>Toán Học & Giải Tích fx</h3>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleToolClick('basic')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Máy tính cơ bản & Khoa học trực tuyến</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('fraction')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Phép tính phân số & Rút gọn hỗn số</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('root')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Căn thức bậc 2, căn bậc 3, căn n</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('exponent')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Lũy thừa số mũ âm và phân số</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('log')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Logarit tự nhiên (ln) & Thập phân</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('quadratic')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Phương trình bậc 2 (Biệt thức Delta)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('slope')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Hệ số góc m & Phương trình đường thẳng</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('standarddeviation')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Độ lệch chuẩn & Phương sai mẫu</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('meanmedianmode')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Thống kê mô tả (Mean, Median, Mode)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('probability')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Xác suất biến cố & Tổ hợp nCr, nPr</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Geometry & Measurements */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-[14.5px] pb-1 border-b border-slate-800/60">
              <Compass className="w-4 h-4 text-purple-400 shrink-0" />
              <h3>Hình Học & Đo Lường</h3>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => handleToolClick('area')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Diện tích 2D (Hình tròn, đa giác)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('volume')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Thể tích khối 3D (Hộp, trụ, nón, cầu)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('perimeter')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Chu vi hình phẳng & Chu vi đường tròn</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('circle')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Đường tròn (Bán kính, đường kính)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('righttriangle')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tam giác vuông & Định lý Pythagoras</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('triangle')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Giải tam giác (Định lý Sin, Cosin)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('trigonometry')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tỉ số lượng giác (Sin, Cos, Tan)</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('concrete')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Dự toán khối lượng bê tông m³</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleToolClick('unit')}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Đổi đơn vị đo lường Metric & Imperial</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Standards, Source & Legal matching screenshot */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-[14.5px] pb-1 border-b border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3>Tiêu Chuẩn & Pháp Lý</h3>
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Tiêu chuẩn số thực IEEE 754 kép</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Quy chuẩn TVM tài chính quốc tế</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Chính sách bảo mật dữ liệu người dùng</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Điều khoản dịch vụ & Miễn trừ tài chính</span>
                </button>
              </li>

              {/* Exact Highlighted Yellow Item with External Icon from Screenshot */}
              <li className="pt-1.5">
                <button 
                  onClick={() => setShowCodeModal(true)}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer group text-left"
                  title="Toàn bộ mã nguồn và cấu trúc hệ thống"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="hover:underline">
                    Toàn bộ mã nguồn (1 file all-code)
                  </span>
                </button>
              </li>

              <li className="pt-1">
                <button 
                  onClick={() => {
                    if (onOpenGemini) {
                      onOpenGemini();
                    } else {
                      handleToolClick('ai');
                    }
                  }}
                  className="group flex items-start gap-1.5 text-left hover:text-white transition-colors cursor-pointer w-full"
                >
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5 font-mono text-xs">›</span>
                  <span>Cẩm nang kiến thức & Trợ lý Gemini AI</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* Code Modal when clicking "Toàn bộ mã nguồn (1 file all-code)" */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <FileCode className="w-5 h-5 text-amber-400" />
                <span>Toàn Bộ Mã Nguồn & Tài Liệu Kỹ Thuật</span>
              </div>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hệ thống được phát triển với cấu trúc full-stack React 18, TypeScript, Tailwind CSS và Express SSR Engine. Toàn bộ logic tính toán được tối ưu hoá theo kiến trúc client-side zero-latency kết hợp máy chủ prerender SEO đa ngôn ngữ.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
              <span className="truncate pr-2">Engine: React 18 + Vite + TypeScript + Tailwind</span>
              <button
                onClick={handleCopySourceUrl}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã sao chép' : 'Sao chép link'}</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

