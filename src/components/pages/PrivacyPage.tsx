import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Database, 
  Cookie, 
  Mail, 
  Trash2,
  KeyRound
} from 'lucide-react';
import { ToolId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PrivacyPageProps {
  onSelectTool?: (toolId: ToolId) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>{isVi ? 'Cam kết bảo mật dữ liệu' : 'Data Privacy Standard'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isVi ? 'Chính Sách Bảo Mật (Privacy Policy)' : 'Privacy Policy'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isVi 
            ? 'Cập nhật lần cuối: Tháng 11/2026 • AC Studio tôn trọng và cam kết bảo vệ tối đa quyền riêng tư của mọi cá nhân.'
            : 'Last updated: November 2026 • AC Studio is committed to safeguarding your personal data and calculation privacy.'}
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1: Client-side First Philosophy */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2>{isVi ? '1. Nguyên tắc cốt lõi: Tính toán Client-Side' : '1. Core Philosophy: Client-Side Computation'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Khác với nhiều dịch vụ trực tuyến khác gửi dữ liệu nhập của người dùng về máy chủ để xử lý, 100% các thuật toán tính toán của Web Calculator (như tính thuế TNCN, lương thực nhận, khoản vay mua nhà, chỉ số BMI...) được thực thi trực tiếp trên trình duyệt thiết bị của bạn (Client-Side JavaScript).'
              : 'Unlike typical web apps that transmit user inputs to remote databases, 100% of mathematical formulas on Web Calculator (including loans, gross-to-net salary, BMI, and calorie math) execute exclusively inside your local browser runtime.'}
          </p>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isVi ? 'Không có bất kỳ dữ liệu số học nào bị ghi nhận hay lưu trữ trên máy chủ của chúng tôi.' : 'Zero arithmetic inputs or financial numbers are tracked on our servers.'}</span>
          </div>
        </section>

        {/* Section 2: LocalStorage & Data Retention */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <Database className="w-5 h-5 text-blue-400" />
            <h2>{isVi ? '2. Bộ nhớ cục bộ (Local Storage) & Quyền kiểm soát' : '2. Local Storage & User Control'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Để nâng cao trải nghiệm, chúng tôi sử dụng tính năng Local Storage của trình duyệt cho các mục đích:'
              : 'We utilize standard browser Local Storage strictly for enhancing your user experience:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>{isVi ? 'Lưu trữ lịch sử các phép tính gần nhất (để bạn xem lại khi cần).' : 'Storing recent calculation history for your reference.'}</li>
            <li>{isVi ? 'Ghi nhớ tùy chọn ngôn ngữ hiển thị (trong 16 ngôn ngữ).' : 'Preserving your preferred interface language.'}</li>
            <li>{isVi ? 'Ghi nhớ chế độ hiển thị Giao diện Sáng (Light) hoặc Tối (Dark).' : 'Remembering your Theme choice (Dark or Light mode).'}</li>
          </ul>
          <p className="text-xs text-slate-400">
            {isVi 
              ? 'Bạn có toàn quyền xóa sạch toàn bộ lịch sử và tùy chọn này bất cứ lúc nào bằng nút "Đặt lại" trên mỗi công cụ hoặc xóa dữ liệu duyệt web trong trình duyệt.'
              : 'You retain full control to wipe this data at any moment using the "Reset" button or by clearing your browser cache.'}
          </p>
        </section>

        {/* Section 3: Authentication & Account Security */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <KeyRound className="w-5 h-5 text-purple-400" />
            <h2>{isVi ? '3. Bảo mật tài khoản Google & Gói VIP' : '3. Google Sign-In & VIP Security'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Khi bạn đăng nhập hoặc đăng ký tài khoản bằng Google, chúng tôi chỉ tiếp nhận thông tin cơ bản được Google cung cấp công khai gồm: Tên, Địa chỉ Email và Ảnh đại diện (Avatar). Chúng tôi không bao giờ yêu cầu hay lưu trữ mật khẩu của tài khoản Google của bạn.'
              : 'When signing in via Google, we only receive your public profile credentials (Name, Email, and Avatar). We never ask for or store your Google account password.'}
          </p>
          <p className="text-xs text-slate-400">
            {isVi 
              ? 'Phiên đăng nhập được quản lý bằng Token bảo mật tiêu chuẩn, mã hóa kết nối HTTPS/SSL 256-bit và không chia sẻ cho bên thứ ba vì bất kỳ lý do gì.'
              : 'Sessions are managed via secure token authentication with 256-bit SSL encryption, ensuring your account credentials remain shielded.'}
          </p>
        </section>

        {/* Section 4: Cookies & Third-Party Services */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <Cookie className="w-5 h-5 text-amber-400" />
            <h2>{isVi ? '4. Chính sách Cookie & Dịch vụ bên thứ ba' : '4. Cookie Policy & Third-Party Integrations'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Chúng tôi có thể sử dụng các cookie kỹ thuật cần thiết để duy trì trạng thái đăng nhập và phân tích hiệu năng hệ thống (Google Core Web Vitals). Chúng tôi cam kết không bán, không thương mại hóa dữ liệu cá nhân của người dùng cho bất kỳ tổ chức quảng cáo hay môi giới dữ liệu nào.'
              : 'We employ strictly necessary cookies for session persistence and performance diagnostics. We do not sell or monetize personal information under any circumstances.'}
          </p>
        </section>

      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTool?.('terms')}
            className="text-blue-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {isVi ? '→ Xem Điều Khoản Dịch Vụ (Terms of Service)' : '→ Read Terms of Service'}
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
