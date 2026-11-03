import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Globe2, 
  Award, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  BookOpen,
  Compass
} from 'lucide-react';
import { ToolId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AboutPageProps {
  onSelectTool?: (toolId: ToolId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border overflow-hidden backdrop-blur-md shadow-2xl bg-gradient-to-br from-blue-600/10 via-slate-900/60 to-indigo-600/10 border-blue-500/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AC Studio • Web Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {isVi 
              ? 'Nền tảng tính toán số học & tài chính trực tuyến chuẩn xác cao'
              : 'High-Precision Online Mathematical & Financial Calculator Ecosystem'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {isVi 
              ? 'Web Calculator được phát triển bởi AC Studio với sứ mệnh mang đến cho hàng triệu học sinh, sinh viên, kỹ sư, nhà đầu tư và người dùng cá nhân các công cụ tính toán số học chuẩn IEEE 754, thuật toán tài chính ngân hàng TVM và chỉ số y tế quốc tế hoàn toàn miễn phí, nhanh chóng và bảo mật tuyệt đối.'
              : 'Web Calculator is developed by AC Studio with the mission of providing students, engineers, financial investors, and everyday users with IEEE 754 precision math, bank-grade TVM financial algorithms, and international WHO health indicators—free, ultra-fast, and completely private.'}
          </p>
        </div>
      </div>

      {/* Core Values / Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">
            {isVi ? 'Độ chính xác chuẩn IEEE 754' : 'IEEE 754 Dual 64-bit Precision'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isVi 
              ? 'Mọi phép toán đại số, lượng giác, logarit và tài chính đều xử lý theo chuẩn số học dấu phẩy động 64-bit, triệt tiêu sai số làm tròn số học.'
              : 'All algebraic, trigonometric, logarithmic, and financial operations adhere to IEEE 754 floating-point standards, eliminating precision drift.'}
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">
            {isVi ? 'Bảo mật Client-Side 100%' : '100% Client-Side Privacy'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isVi 
              ? 'Các số liệu về tiền lương, thuế TNCN, khoản vay ngân hàng và lịch sử tính toán được xử lý trực tiếp tại trình duyệt. Máy chủ không lưu trữ số liệu cá nhân của bạn.'
              : 'Your salary numbers, tax records, loans, and calculation history remain strictly on your local browser machine. Zero sensitive telemetry sent to servers.'}
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">
            {isVi ? 'Tốc độ phản hồi tức thì (< 50ms)' : 'Ultra-Fast Response (< 50ms)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isVi 
              ? 'Hệ thống thiết kế tối ưu hóa bộ nhớ, không phụ thuộc kết nối mạng khi tính toán, hỗ trợ chuyển đổi mượt mà giữa hơn 50 tiện ích chuyên biệt.'
              : 'Zero network round-trips for calculation formulas, rendering instant interactive charts, amortization tables, and graphs with zero latency.'}
          </p>
        </div>
      </div>

      {/* About the Studio & Standards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{isVi ? 'Đội ngũ phát triển & Tiêu chuẩn kỹ thuật' : 'Engineering Team & Standards'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isVi 
              ? 'AC Studio là tập thể kỹ sư phần mềm và chuyên gia toán ứng dụng, cam kết duy trì mã nguồn sạch, trải nghiệm người dùng không quảng cáo gây khó chịu và cập nhật thường xuyên các quy định thuế, tiền lương và lãi suất ngân hàng mới nhất.'
              : 'AC Studio is a collective of software engineers and applied mathematics enthusiasts, dedicated to delivering clean, reliable, and continuously updated calculation tools.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isVi ? 'Tiêu chuẩn Time Value of Money (TVM) ngân hàng' : 'Standard TVM bank-grade amortization'}</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isVi ? 'Thang đo sức khỏe WHO & chuẩn WPRO Châu Á' : 'WHO & WPRO Asian health guidelines'}</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isVi ? 'Biểu thuế TNCN 7 bậc & BHXH hiện hành' : 'Official progressive tax & social insurance'}</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isVi ? 'Hỗ trợ đa ngôn ngữ (16 thứ tiếng)' : '16 Major international languages supported'}</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onSelectTool?.('blog')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="font-bold text-white text-sm">
            {isVi ? 'Cẩm nang & Blog' : 'Guides & Blog'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isVi ? 'Đọc bài viết phân tích công thức thực tiễn' : 'Deep-dive calculation articles & guides'}
          </p>
        </button>

        <button
          onClick={() => onSelectTool?.('sitemap')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <Compass className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="font-bold text-white text-sm">
            {isVi ? 'Sơ đồ trang web (Sitemap)' : 'HTML Sitemap'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isVi ? 'Danh mục đầy đủ hơn 50 công cụ' : 'Browse all 50+ specialized tools'}
          </p>
        </button>

        <button
          onClick={() => onSelectTool?.('terms')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="font-bold text-white text-sm">
            {isVi ? 'Điều khoản & Bảo mật' : 'Terms & Privacy'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isVi ? 'Chính sách bảo vệ quyền lợi người dùng' : 'User protection & compliance policies'}
          </p>
        </button>
      </div>

      {/* Contact & Support Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{isVi ? 'Thông tin liên hệ & Hợp tác' : 'Contact & Inquiries'}</span>
          </div>
          <p className="text-xs text-slate-400">
            {isVi 
              ? 'Chúng tôi luôn lắng nghe phản hồi của bạn để ngày càng hoàn thiện chất lượng công cụ.'
              : 'We welcome your feedback, partnership inquiries, and feature suggestions.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-blue-400">
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            contact@acstudio.dev
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            https://testsp123.top
          </span>
        </div>
      </div>

    </div>
  );
};
