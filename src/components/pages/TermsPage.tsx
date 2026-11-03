import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Copyright, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Crown
} from 'lucide-react';
import { ToolId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface TermsPageProps {
  onSelectTool?: (toolId: ToolId) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-blue-400">
          <FileText className="w-3.5 h-3.5" />
          <span>{isVi ? 'Văn bản pháp lý' : 'Legal Documentation'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isVi ? 'Điều Khoản Dịch Vụ (Terms of Service)' : 'Terms of Service'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isVi 
            ? 'Cập nhật lần cuối: Tháng 11/2026 • Áp dụng cho toàn bộ người dùng của Web Calculator & AC Studio.'
            : 'Last updated: November 2026 • Applicable to all visitors and registered users of Web Calculator.'}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1: Acceptance */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">1</span>
            <span>{isVi ? 'Chấp thuận điều khoản' : 'Acceptance of Terms'}</span>
          </h2>
          <p>
            {isVi 
              ? 'Bằng việc truy cập, duyệt hoặc sử dụng bất kỳ công cụ tính toán nào trên Web Calculator, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngưng sử dụng trang web.'
              : 'By accessing or using Web Calculator, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any portion, you must discontinue using our services.'}
          </p>
        </section>

        {/* Section 2: Intellectual Property */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">2</span>
            <span>{isVi ? 'Quyền sở hữu trí tuệ & Bản quyền AC Studio' : 'Intellectual Property Rights'}</span>
          </h2>
          <p>
            {isVi 
              ? 'Toàn bộ mã nguồn, cấu trúc thuật toán số học, giao diện đồ họa người dùng (UI/UX), biểu đồ tương tác, nhãn hiệu Web Calculator và bài viết cẩm nang đều thuộc quyền sở hữu trí tuệ độc quyền của AC Studio (Copyright © 2026 AC Studio. All rights reserved).'
              : 'All software code, algorithmic implementations, visual user interfaces, interactive charts, brand assets, and educational publications are the exclusive intellectual property of AC Studio (Copyright © 2026 AC Studio).'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>{isVi ? 'Nghiêm cấm sao chép, dịch ngược mã nguồn (reverse engineering) hoặc nhân bản hệ thống.' : 'Decompilation, reverse engineering, or automated scraping is strictly prohibited.'}</li>
            <li>{isVi ? 'Người dùng được phép sử dụng kết quả tính toán tự do cho công việc cá nhân, giáo dục và nghiên cứu.' : 'You are free to use calculation outputs for private, academic, and business purposes.'}</li>
          </ul>
        </section>

        {/* Section 3: VIP Membership & Purchases */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">3</span>
            <span>{isVi ? 'Gói dịch vụ VIP Pro & Thanh toán' : 'VIP Pro Subscriptions & Payments'}</span>
          </h2>
          <p>
            {isVi 
              ? 'Web Calculator cung cấp tài khoản miễn phí và tùy chọn nâng cấp lên VIP Pro (Gói 1 Tháng $9.99 và Gói 1 Năm $109.99). Gói VIP mở khóa không giới hạn lượt hỏi AI, loại bỏ 100% quảng cáo và cấp quyền xuất báo cáo 4K.'
              : 'Web Calculator offers free usage and optional VIP Pro tiers ($9.99/month and $109.99/year), which grant expanded AI solver quotas, ad-free interface, and 4K report export capabilities.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Gói 1 Tháng ($9.99)
              </span>
              <p className="text-slate-400 mt-1">
                {isVi ? 'Hiệu lực 30 ngày, 1.500 lượt hỏi AI và tắt toàn bộ quảng cáo.' : '30-day validity, 1,500 AI queries, complete ad-free experience.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> Gói 1 Năm ($109.99)
              </span>
              <p className="text-slate-400 mt-1">
                {isVi ? 'Hiệu lực 365 ngày, 7.200 lượt hỏi AI và cộng dồn khi mua gia hạn.' : '365-day validity, 7,200 AI queries, stacking extension support.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">4</span>
            <span>{isVi ? 'Giới hạn trách nhiệm pháp lý' : 'Limitation of Liability'}</span>
          </h2>
          <p>
            {isVi 
              ? 'Các công cụ tính toán được cung cấp "nguyên trạng" (as is). Mặc dù AC Studio nỗ lực cao nhất để đảm bảo tính chuẩn xác toán học, chúng tôi không chịu trách nhiệm đối với bất kỳ quyết định tài chính, đầu tư, mua sắm hoặc y tế nào dựa trên kết quả mô phỏng.'
              : 'Our tools are provided on an "as is" and "as available" basis. While we strive for extreme mathematical precision, AC Studio shall not be liable for any financial or medical decisions made based upon simulated results.'}
          </p>
        </section>

        {/* Section 5: Modifications & Termination */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono">5</span>
            <span>{isVi ? 'Thay đổi điều khoản & Chấm dứt quyền sử dụng' : 'Modifications & Termination'}</span>
          </h2>
          <p>
            {isVi 
              ? 'AC Studio có quyền sửa đổi hoặc cập nhật các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web. Chúng tôi cũng có quyền tạm ngừng tài khoản của người dùng nếu phát hiện hành vi cố tình tấn công hoặc khai thác lỗ hổng hệ thống.'
              : 'AC Studio reserves the right to revise these Terms of Service at any time. Continued use of the website following changes indicates your binding acceptance.'}
          </p>
        </section>

      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTool?.('privacy')}
            className="text-blue-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {isVi ? '→ Xem Chính Sách Bảo Mật (Privacy Policy)' : '→ Read Privacy Policy'}
          </button>
          <span>•</span>
          <button 
            onClick={() => onSelectTool?.('disclaimer')}
            className="text-amber-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {isVi ? '→ Xem Tuyên Bố Miễn Trừ (Disclaimer)' : '→ Read Disclaimer'}
          </button>
        </div>
        <div className="text-slate-400 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-blue-400" />
          <span>acstudio.contact@gmail.com</span>
        </div>
      </div>

    </div>
  );
};
