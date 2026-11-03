import React from 'react';
import { 
  ShieldAlert, 
  Landmark, 
  HeartPulse, 
  Scale, 
  HelpCircle, 
  Mail, 
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { ToolId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface DisclaimerPageProps {
  onSelectTool?: (toolId: ToolId) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-400">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isVi ? 'Tuyên bố miễn trừ trách nhiệm' : 'Legal Disclaimer'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {isVi ? 'Tuyên Bố Miễn Trừ Trách Nhiệm (Disclaimer)' : 'Disclaimer & Liability Limitations'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isVi 
            ? 'Cập nhật lần cuối: Tháng 11/2026 • Vui lòng đọc kỹ thông tin miễn trừ trước khi sử dụng số liệu cho các quyết định thực tế.'
            : 'Last updated: November 2026 • Please review these disclaimers carefully prior to making financial or healthcare decisions.'}
        </p>
      </div>

      {/* Disclaimers breakdown */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        
        {/* 1. Financial & Investment */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <h2>{isVi ? '1. Miễn trừ trách nhiệm Tài chính & Đầu tư' : '1. Financial & Investment Disclaimer'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Tất cả các công cụ tính toán tài chính bao gồm: Tính lãi vay mua nhà (Mortgage), Vay tiêu dùng (Loan), Vay ô tô (Auto Loan), Lãi suất kép (Compound Interest), Khấu hao nợ (Amortization) và Đầu tư mô phỏng trên Web Calculator được thiết kế dựa trên thuật toán Time Value of Money (TVM) chuẩn quốc tế. Tuy nhiên:'
              : 'All financial calculators (mortgages, personal loans, compound savings, amortization schedules) operate on standard mathematical TVM formulas. However:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>{isVi ? 'Các kết quả chỉ mang tính chất tham khảo, ước tính và mô phỏng lý thuyết.' : 'All results serve purely illustrative, educational, and simulation purposes.'}</li>
            <li>{isVi ? 'Không cấu thành bất kỳ lời khuyên đầu tư, lời đề nghị vay vốn hay cam kết tài chính nào từ AC Studio.' : 'Outputs do not constitute financial advice, lending proposals, or fiduciary obligations.'}</li>
            <li>{isVi ? 'Mỗi ngân hàng và tổ chức tài chính thực tế có thể áp dụng biểu phí trả nợ trước hạn, phí bảo hiểm khoản vay hoặc phương pháp làm tròn ngày khác nhau. Quý khách vui lòng đối chiếu trực tiếp với hợp đồng tín dụng của tổ chức cấp vốn.' : 'Actual terms vary per banking institution. Please consult your lending officer or contractual agreement for official figures.'}</li>
          </ul>
        </section>

        {/* 2. Medical & Health */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h2>{isVi ? '2. Miễn trừ trách nhiệm Y tế & Thể chất' : '2. Medical & Health Disclaimer'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Các máy tính sức khỏe như Chỉ số BMI, Nhu cầu Calorie (TDEE/BMR), Tỷ lệ mỡ cơ thể (Body Fat), Cân nặng lý tưởng và Dự đoán ngày rụng trứng dựa trên các công thức nhân trắc học tiêu chuẩn của Tổ chức Y tế Thế giới (WHO) và Trung tâm Kiểm soát Bệnh tật (CDC):'
              : 'Our health utilities (BMI, BMR/TDEE, Body Fat percentage, Ideal Weight, Ovulation date) rely on standard WHO and CDC statistical models:'}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
            <li>{isVi ? 'Không thay thế cho chẩn đoán y khoa, phác đồ điều trị hoặc tư vấn chuyên môn từ bác sĩ hay chuyên gia dinh dưỡng.' : 'Calculators are not substitutes for professional medical diagnosis or clinical treatment.'}</li>
            <li>{isVi ? 'Các thông số có thể khác biệt đối với vận động viên thể hình chuyên nghiệp, phụ nữ mang thai hoặc bệnh nhân có tiền sử bệnh lý chuyển hóa.' : 'Variations naturally exist for athletes, pregnant women, or individuals with metabolic conditions.'}</li>
          </ul>
        </section>

        {/* 3. Tax & Salary */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <Scale className="w-5 h-5 text-blue-400" />
            <h2>{isVi ? '3. Miễn trừ trách nhiệm Thuế & Tiền lương Gross - Net' : '3. Tax & Salary Computation Disclaimer'}</h2>
          </div>
          <p>
            {isVi 
              ? 'Công cụ tính lương Gross sang Net và Thuế thu nhập cá nhân được cập nhật dựa trên Luật Thuế TNCN và mức giảm trừ gia cảnh hiện hành. Khi tiến hành quyết toán thuế cuối năm hoặc thanh toán tiền lương thực tế, quý khách nên đối chiếu bảng kê lương chính thức từ phòng nhân sự và hướng dẫn của cơ quan thuế trực thuộc.'
              : 'Salary Net-Gross and Personal Income Tax models are updated according to standard statutory brackets. Always reconcile official payroll runs with your corporate human resources department or relevant tax authorities.'}
          </p>
        </section>

        {/* 4. General Software Availability */}
        <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2>{isVi ? '4. Trách nhiệm về phần mềm & Tính liên tục của dịch vụ' : '4. General Software Availability'}</h2>
          </div>
          <p>
            {isVi 
              ? 'AC Studio không bảo đảm rằng trang web sẽ luôn hoạt động liên tục 100% không có sự gián đoạn mạng hoặc không có lỗi kỹ thuật phát sinh từ trình duyệt của người dùng. Chúng tôi từ chối mọi trách nhiệm bồi thường đối với các thiệt hại trực tiếp hoặc gián tiếp phát sinh từ việc sử dụng các công cụ này.'
              : 'AC Studio does not guarantee uninterrupted website availability or immunity from client-side runtime anomalies. We disclaim all liability for indirect or consequential damages resulting from tool usage.'}
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
            onClick={() => onSelectTool?.('privacy')}
            className="text-emerald-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {isVi ? '→ Xem Chính Sách Bảo Mật (Privacy Policy)' : '→ Read Privacy Policy'}
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
