import React from 'react';
import { ToolId } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { useLanguage } from '../../context/LanguageContext';

interface SitemapPageProps {
  onSelectTool?: (toolId: ToolId) => void;
}

interface SitemapColumn {
  id: string;
  titleVi: string;
  titleEn: string;
  links: {
    id: ToolId;
    labelVi: string;
    labelEn: string;
  }[];
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onSelectTool }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const handleToolClick = (toolId: ToolId) => {
    onSelectTool?.(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns: SitemapColumn[] = [
    {
      id: 'financial',
      titleVi: 'Tài chính & Khoản vay',
      titleEn: 'Financial & Loan Tools',
      links: [
        { id: 'mortgage', labelVi: 'Vay mua nhà – Mortgage Calculator', labelEn: 'Mortgage Calculator' },
        { id: 'loan', labelVi: 'Khoản vay & Trả góp – Loan Calculator', labelEn: 'Loan & EMI Calculator' },
        { id: 'autoloan', labelVi: 'Vay mua ô tô trả góp – Auto Loan', labelEn: 'Auto Loan Calculator' },
        { id: 'salary', labelVi: 'Tiền lương Gross sang Net – Payroll', labelEn: 'Salary Gross to Net Calculator' },
        { id: 'tax', labelVi: 'Thuế thu nhập cá nhân – Income Tax', labelEn: 'Income Tax Calculator' },
        { id: 'interest', labelVi: 'Lãi suất đơn & Tiết kiệm', labelEn: 'Simple Interest Calculator' },
        { id: 'compound', labelVi: 'Lãi suất kép & Tích lũy – Compound', labelEn: 'Compound Interest Calculator' },
        { id: 'amortization', labelVi: 'Bảng khấu hao nợ – Amortization', labelEn: 'Loan Amortization Schedule' },
        { id: 'payment', labelVi: 'Kế hoạch trả nợ định kỳ – Payment', labelEn: 'Payment Plan Calculator' },
        { id: 'retirement', labelVi: 'Dự phòng hưu trí – Retirement', labelEn: 'Retirement Savings Calculator' },
        { id: 'investment', labelVi: 'Lợi nhuận đầu tư – Investment', labelEn: 'Investment Return Calculator' },
        { id: 'inflation', labelVi: 'Tính lạm phát & Sức mua – Inflation', labelEn: 'Inflation & Purchasing Power' },
        { id: 'finance', labelVi: 'Máy tính tài chính tổng hợp – TVM', labelEn: 'Comprehensive Finance Calculator' },
        { id: 'lottery', labelVi: 'Xác suất xổ số – Lottery Odds', labelEn: 'Lottery Probability Calculator' }
      ]
    },
    {
      id: 'fitness',
      titleVi: 'Sức khỏe & Thể chất',
      titleEn: 'Health & Fitness Instruments',
      links: [
        { id: 'bmi', labelVi: 'Chỉ số khối cơ thể – BMI Calculator', labelEn: 'BMI Body Mass Index Calculator' },
        { id: 'calorie', labelVi: 'Nhu cầu calo tiêu thụ – TDEE Calorie', labelEn: 'Daily Calorie & TDEE Calculator' },
        { id: 'bmr', labelVi: 'Tỷ lệ trao đổi chất cơ bản – BMR', labelEn: 'Basal Metabolic Rate (BMR)' },
        { id: 'bodyfat', labelVi: 'Tỷ lệ mỡ cơ thể – Body Fat', labelEn: 'Body Fat Percentage Calculator' },
        { id: 'idealweight', labelVi: 'Cân nặng lý tưởng – Ideal Weight', labelEn: 'Ideal Weight Calculator' },
        { id: 'healthyweight', labelVi: 'Dải cân nặng khỏe mạnh', labelEn: 'Healthy Weight Range Guide' },
        { id: 'armybodyfat', labelVi: 'Tỷ lệ mỡ Quân đội – US Navy Standard', labelEn: 'Army Body Fat Calculator' },
        { id: 'pregnancy', labelVi: 'Dự đoán ngày sinh & Thai kỳ', labelEn: 'Pregnancy Due Date Calculator' },
        { id: 'ovulation', labelVi: 'Chu kỳ rụng trứng & Thụ thai', labelEn: 'Ovulation & Fertility Calendar' },
        { id: 'pace', labelVi: 'Tốc độ chạy bộ – Running Pace', labelEn: 'Running Pace & Speed Calculator' }
      ]
    },
    {
      id: 'legal',
      titleVi: 'Hệ thống & Chính sách pháp lý',
      titleEn: 'System & Legal Policies',
      links: [
        { id: 'about', labelVi: 'About', labelEn: 'About' },
        { id: 'blog', labelVi: 'Blog', labelEn: 'Blog' },
        { id: 'terms', labelVi: 'Terms of Service', labelEn: 'Terms of Service' },
        { id: 'privacy', labelVi: 'Privacy Policy', labelEn: 'Privacy Policy' },
        { id: 'disclaimer', labelVi: 'Disclaimer', labelEn: 'Disclaimer' }
      ]
    },
    {
      id: 'math',
      titleVi: 'Toán học & Khoa học',
      titleEn: 'Mathematical & Science Tools',
      links: [
        { id: 'basic', labelVi: 'Máy tính cơ bản & Khoa học 10 cột', labelEn: 'Basic & Scientific Calculator' },
        { id: 'percentage', labelVi: 'Máy tính phần trăm & Tăng giảm %', labelEn: 'Percentage & Percent Change' },
        { id: 'fraction', labelVi: 'Máy tính phân số & Tối giản phân số', labelEn: 'Fraction Calculator & Simplifier' },
        { id: 'root', labelVi: 'Căn bậc 2, căn bậc 3 & Căn bậc n', labelEn: 'Square Root & Nth Root Calculator' },
        { id: 'exponent', labelVi: 'Lũy thừa & Số mũ – Exponent', labelEn: 'Exponent & Power Calculator' },
        { id: 'log', labelVi: 'Logarit tự nhiên (ln) & Cơ số 10', labelEn: 'Logarithm Calculator (log & ln)' },
        { id: 'quadratic', labelVi: 'Giải phương trình bậc hai ax² + bx + c', labelEn: 'Quadratic Equation Solver' },
        { id: 'slope', labelVi: 'Hệ số góc đường thẳng – Slope', labelEn: 'Slope of a Line Calculator' },
        { id: 'average', labelVi: 'Tính trung bình cộng – Average', labelEn: 'Average & Arithmetic Mean' },
        { id: 'meanmedianmode', labelVi: 'Mean, Median, Mode & Trung vị', labelEn: 'Mean, Median, Mode Calculator' },
        { id: 'standarddeviation', labelVi: 'Độ lệch chuẩn & Phương sai', labelEn: 'Standard Deviation & Variance' },
        { id: 'statistics', labelVi: 'Phân tích thống kê mẫu số liệu', labelEn: 'Sample Statistics Calculator' },
        { id: 'probability', labelVi: 'Tính xác suất biến cố ngẫu nhiên', labelEn: 'Probability & Odds Calculator' },
        { id: 'random', labelVi: 'Tạo số ngẫu nhiên & Quay số trúng thưởng', labelEn: 'Random Number Generator' },
        { id: 'graphing', labelVi: 'Vẽ đồ thị hàm số F(x) & Parabol Oxy', labelEn: '2D Graphing Calculator' }
      ]
    },
    {
      id: 'geometry',
      titleVi: 'Hình học & Đo lường không gian',
      titleEn: 'Geometry & Spatial Measurement',
      links: [
        { id: 'trigonometry', labelVi: 'Lượng giác Sin, Cos, Tan & Radian', labelEn: 'Trigonometry (Sin, Cos, Tan)' },
        { id: 'righttriangle', labelVi: 'Giải tam giác vuông – Định lý Pythagoras', labelEn: 'Right Triangle & Pythagorean Solver' },
        { id: 'triangle', labelVi: 'Chu vi & Diện tích tam giác thường', labelEn: 'Triangle Area & Perimeter' },
        { id: 'circle', labelVi: 'Bán kính, chu vi & Diện tích hình tròn', labelEn: 'Circle Radius, Area & Circumference' },
        { id: 'area', labelVi: 'Diện tích các hình học phẳng 2D', labelEn: '2D Surface Area Calculator' },
        { id: 'volume', labelVi: 'Thể tích hình khối 3D (Hộp, Trụ, Cầu)', labelEn: '3D Volume & Capacity Calculator' },
        { id: 'perimeter', labelVi: 'Chu vi đa giác & Hình học phẳng', labelEn: 'Perimeter of Shapes Calculator' }
      ]
    },
    {
      id: 'conversion',
      titleVi: 'Chuyển đổi đơn vị & Tiện ích đời sống',
      titleEn: 'Conversions & Everyday Utilities',
      links: [
        { id: 'unit', labelVi: 'Quy đổi đơn vị đo lường toàn diện', labelEn: 'Comprehensive Unit Converter' },
        { id: 'currency', labelVi: 'Tỷ giá ngoại tệ trực tiếp (USD/VND/EUR)', labelEn: 'Live Currency Exchange Converter' },
        { id: 'length', labelVi: 'Chuyển đổi chiều dài (m, ft, inch, cm)', labelEn: 'Length & Distance Converter' },
        { id: 'weight', labelVi: 'Chuyển đổi khối lượng (kg, lbs, oz, g)', labelEn: 'Weight & Mass Converter' },
        { id: 'temperature', labelVi: 'Chuyển đổi nhiệt độ (°C, °F, Kelvin)', labelEn: 'Temperature Converter (°C, °F, K)' },
        { id: 'time', labelVi: 'Cộng trừ thời gian & Đổi giờ phút giây', labelEn: 'Time Duration Calculator' },
        { id: 'date', labelVi: 'Khoảng cách giữa hai ngày tháng', labelEn: 'Date Difference & Days Between' },
        { id: 'age', labelVi: 'Tính tuổi chính xác & Can chi âm dương', labelEn: 'Chronological Age Calculator' },
        { id: 'gpa', labelVi: 'Tính điểm trung bình học tập GPA', labelEn: 'GPA Grade Point Average Calculator' },
        { id: 'discount', labelVi: 'Tính giảm giá khuyến mãi & Chiết khấu', labelEn: 'Shopping Discount Calculator' },
        { id: 'tip', labelVi: 'Tính tiền Tip nhà hàng & Chia hóa đơn', labelEn: 'Restaurant Tip & Bill Splitter' },
        { id: 'utilitybill', labelVi: 'Tính hóa đơn tiền điện, nước & internet', labelEn: 'Utility Bill & Living Expenses' },
        { id: 'concrete', labelVi: 'Tính khối lượng bê tông & Xi măng đổ sàn', labelEn: 'Concrete Volume Estimator' },
        { id: 'password', labelVi: 'Tạo mật khẩu mạnh ngẫu nhiên bảo mật', labelEn: 'Secure Password Generator' },
        { id: 'ipsubnet', labelVi: 'Chia mạng con IP CIDR IPv4', labelEn: 'IPv4 Subnet & CIDR Calculator' },
        { id: 'love', labelVi: 'Máy tính tình yêu & Bói FLAMES đối xứng', labelEn: 'Love Compatibility Calculator' },
        { id: 'ai', labelVi: 'Trợ lý AI giải toán & Đọc đề bài Gemini', labelEn: 'AI Multimodal Math Assistant' }
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 py-2">
      
      {/* Breadcrumb matching screenshot: Compass / Sitemap */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <button 
          onClick={() => handleToolClick('basic')} 
          className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
        >
          Web Calculator
        </button>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">Sitemap</span>
      </nav>

      {/* Title Banner matching screenshot: Compass & Navigation Tools */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
        <h1 className="font-extrabold text-base sm:text-xl text-slate-900 dark:text-white tracking-tight">
          Web Calculator &amp; Online Tools
        </h1>
      </div>

      {/* Directory Grid matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-2 pb-8">
        {columns.map(column => (
          <div key={column.id} className="space-y-3.5">
            
            {/* Category Title matching screenshot format */}
            <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-[17px] leading-snug">
              {isVi ? column.titleVi : column.titleEn}
            </h2>

            {/* List of clean text links matching screenshot */}
            <ul className="space-y-2 text-sm">
              {column.links.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => handleToolClick(link.id)}
                    className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-left cursor-pointer leading-relaxed inline-block"
                  >
                    {isVi ? link.labelVi : link.labelEn}
                  </button>
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

    </div>
  );
};
