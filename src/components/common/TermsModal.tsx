import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Lock, Copyright, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col text-slate-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-base sm:text-lg font-bold text-white leading-tight">
                {t.termsModalHeading}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chính sách bảo mật, quyền riêng tư &amp; Sở hữu trí tuệ bản quyền AC Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng điều khoản"
            className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Rich Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed font-sans scrollbar-thin">
          
          {/* 1. Copyright & Intellectual Property */}
          <section className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
              <Copyright className="w-5 h-5" />
              <h3>1. Bản quyền &amp; Quyền sở hữu trí tuệ (Bản quyền AC Studio)</h3>
            </div>
            <p>
              Toàn bộ ứng dụng <strong>Web Calculator</strong> bao gồm nhưng không giới hạn ở: mã nguồn phần mềm, thiết kế giao diện đồ họa (UI/UX), thuật toán toán học, tài liệu giải thích chuyên sâu, logo và nhận diện thương hiệu đều thuộc quyền sở hữu trí tuệ độc quyền của <strong>AC Studio</strong> (Copyright © 2026 AC Studio. All rights reserved).
            </p>
            <p className="text-xs text-slate-400">
              Nghiêm cấm mọi hành vi sao chép toàn bộ hoặc một phần, phân phối lại, đảo ngược mã nguồn (reverse engineering) hoặc khai thác thương mại khi chưa có sự đồng ý bằng văn bản từ AC Studio.
            </p>
          </section>

          {/* 2. Terms of Use */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3>2. Điều khoản sử dụng dịch vụ</h3>
            </div>
            <p>
              Web Calculator được cung cấp hoàn toàn miễn phí cho mọi đối tượng người dùng nhằm phục vụ mục đích học tập, giảng dạy, nghiên cứu, quản lý tài chính cá nhân và các tính toán đời sống hằng ngày.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Người dùng có quyền sử dụng các công cụ tính toán không giới hạn số lượt.</li>
              <li>Các kết quả tính toán tài chính (lãi suất vay EMI, lãi kép) mang tính chất tham khảo, mô phỏng chuẩn xác dựa trên các thuật toán tài chính chuẩn quốc tế. Đối với các hợp đồng vay vốn thực tế, quý khách vui lòng tham chiếu biểu phí và điều khoản của ngân hàng cấp vốn.</li>
              <li>Công cụ đo chỉ số BMI dựa trên thang đo của Tổ chức Y tế Thế giới (WHO) và tiêu chuẩn IDI &amp; WPRO cho người châu Á, không thay thế hoàn toàn cho chẩn đoán y khoa chuyên sâu từ bác sĩ.</li>
            </ul>
          </section>

          {/* 3. Privacy Policy & Client-side Safety */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3>3. Chính sách bảo mật &amp; Quyền riêng tư (Client-Side Privacy)</h3>
            </div>
            <p>
              AC Studio cam kết bảo vệ tuyệt đối quyền riêng tư của người dùng:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Không thu thập dữ liệu
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  100% các phép tính và giá trị nhập liệu được xử lý trực tiếp trên trình duyệt máy khách (Client-Side). Không có bất kỳ dữ liệu số học nào gửi về máy chủ.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Bộ nhớ đệm Local Storage
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Lịch sử tính toán và tùy chọn ngôn ngữ chỉ lưu trữ cục bộ tại trình duyệt của bạn và có thể xóa sạch bất kỳ lúc nào bằng nút "Đặt lại".
                </p>
              </div>
            </div>
          </section>

          {/* 4. Contact & AC Studio Support */}
          <section className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Mail className="w-4 h-4 text-amber-400" />
              <h4>4. Thông tin liên hệ &amp; Hỗ trợ bản quyền AC Studio</h4>
            </div>
            <p className="text-xs text-slate-300">
              Mọi ý kiến đóng góp, đề xuất tính năng mới hoặc yêu cầu về vấn đề bản quyền, hợp tác kinh doanh xin vui lòng gửi thư điện tử về:
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-blue-400 pt-1">
              <span>Email: acstudio.contact@gmail.com</span>
              <span>Website: https://web-calculator.com</span>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {t.copyrightNotice}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            {t.termsModalClose}
          </button>
        </div>
      </div>
    </div>
  );
};
