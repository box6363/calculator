import { ToolMeta } from '../types';

export const TOOLS_CONFIG: Record<string, ToolMeta> = {
  basic: {
    id: 'basic',
    category: 'math',
    name: 'Máy tính cơ bản & Khoa học',
    shortName: 'Cơ bản',
    tierNumber: 1,
    iconName: 'Calculator',
    seoTitle: 'Máy Tính Online – Máy Tính Bỏ Túi & Khoa Học Miễn Phí',
    seoH1: 'Máy Tính Online – Bàn Phím Số Khoa Học 10 Cột & Lịch Sử Tính Toán',
    tagline: 'Máy tính bỏ túi & khoa học trực tuyến đa năng, chuẩn xác 100%',
    description: 'Máy tính online miễn phí hỗ trợ đầy đủ các phép toán số học cơ bản (+, -, ×, ÷, %), lũy thừa, căn bậc n, hàm lượng giác (sin, cos, tan), logarit, hằng số toán học (π, e) cùng hệ thống thanh ghi bộ nhớ MC, MR, M+, M- và lưu trữ lịch sử tính toán chi tiết.',
    formulaDescription: 'Thực hiện phép tính theo thứ tự ưu tiên đại số chuẩn: Nhân chia trước, cộng trừ sau, ưu tiên trong ngoặc.',
    formulaEquation: 'f(x, y) = x [+, -, ×, ÷] y',
    usageSteps: [
      'Nhập số trực tiếp qua bàn phím hoặc nhấn nút trên màn hình.',
      'Chọn toán tử (+, -, ×, ÷, %, √) để thực hiện phép tính.',
      'Nhấn dấu bằng (=) hoặc Enter để nhận kết quả tức thì.',
      'Sử dụng các phím nhớ MC, MR, M+, M- hoặc xem lại lịch sử tính toán.'
    ],
    faqs: [
      {
        question: 'Máy tính cơ bản này có hỗ trợ phím tắt bàn phím vật lý không?',
        answer: 'Có, bạn có thể gõ trực tiếp các số từ 0-9, các dấu cộng (+), trừ (-), nhân (*), chia (/), phím Enter để xem kết quả và phím Backspace hoặc Escape để xóa số.'
      },
      {
        question: 'Lịch sử tính toán có bị mất khi tắt trình duyệt không?',
        answer: 'Lịch sử được lưu trữ an toàn trong bộ nhớ cục bộ (Local Storage) của trình duyệt và bạn có thể xóa sạch bất cứ khi nào bạn muốn.'
      },
      {
        question: 'Máy tính có giới hạn số lượng chữ số thập phân không?',
        answer: 'Máy tính tự động tối ưu hóa hiển thị đến 10 chữ số thập phân và làm tròn thông minh để tránh sai số số học dấu phẩy động.'
      }
    ],
    relatedToolIds: ['percentage', 'loan', 'unit']
  },
  ai: {
    id: 'ai',
    category: 'utility',
    name: 'Trợ lý AI (Gemini)',
    shortName: 'Trợ lý AI',
    tierNumber: 1,
    iconName: 'Sparkles',
    badge: 'Gemini 3.8',
    seoTitle: 'AI Tool – Trợ lý giải toán & phân tích đa phương thức với Gemini AI',
    seoH1: 'AI Tool – Trợ lý AI giải toán, phân tích hình ảnh và tệp PDF',
    tagline: 'Hỏi đáp bài toán & phân tích tài liệu thông minh',
    description: 'Trợ lý AI thông minh tích hợp mô hình Gemini 3.8 Flash hỗ trợ giải toán chi tiết từng bước, phân tích đề bài từ hình ảnh hoặc tệp PDF nhỏ (miễn phí 3 lượt/ngày).',
    formulaDescription: 'Phân tích đa phương thức (Multimodal AI) kết hợp thị giác máy tính và xử lý ngôn ngữ tự nhiên để giải toán và phân tích bảng số liệu.',
    formulaEquation: 'f(Prompt, Image/PDF) → Step-by-Step Mathematical Explanation',
    usageSteps: [
      'Nhập câu hỏi, phương trình toán học hoặc yêu cầu cần giải đáp vào ô nhập liệu.',
      'Tùy chọn tải lên tệp ảnh (PNG, JPG, WebP) hoặc tệp PDF tài liệu/đề bài nhỏ.',
      'Nhấn nút "Gửi câu hỏi" để AI phân tích và đưa ra lời giải chi tiết.',
      'Mỗi ngày bạn có 3 lượt hỏi miễn phí, hệ thống tự động làm mới vào 00:00 hàng ngày.'
    ],
    faqs: [
      {
        question: 'Tôi có thể tải lên tệp PDF hoặc ảnh có dung lượng tối đa bao nhiêu?',
        answer: 'Hệ thống hỗ trợ tải lên hình ảnh hoặc tệp PDF dung lượng nhỏ (tối đa 10MB) với định dạng rõ nét để AI nhận diện chữ và công thức chính xác nhất.'
      },
      {
        question: 'Giới hạn 3 lượt/ngày hoạt động như thế nào?',
        answer: 'Mỗi ngày bạn được cấp 3 lượt đặt câu hỏi cho AI hoàn toàn miễn phí. Hạn mức này sẽ tự động được làm mới lại vào 00:00 mỗi ngày.'
      },
      {
        question: 'AI có thể giải được những dạng toán nào?',
        answer: 'Mô hình Gemini 3.8 Flash có khả năng giải đại số, giải tích, hình học, xác suất thống kê, phương trình vi phân, toán tài chính và đọc bảng số liệu từ ảnh đề bài.'
      }
    ],
    relatedToolIds: ['basic', 'percentage', 'trigonometry']
  },
  bmi: {
    id: 'bmi',
    category: 'fitness',
    name: 'Chỉ số khối cơ thể (BMI)',
    shortName: 'BMI',
    tierNumber: 1,
    iconName: 'Activity',
    seoTitle: 'BMI Calculator – Kiểm tra chỉ số khối cơ thể chuẩn WHO & Châu Á',
    seoH1: 'BMI Calculator – Đo chỉ số BMI & Đánh giá thể trạng chuẩn WHO',
    description: 'Kiểm tra nhanh chỉ số BMI (Body Mass Index) dành cho người lớn và thanh thiếu niên. Xác định thể trạng gầy, bình thường, thừa cân hay béo phì cùng dải cân nặng lý tưởng theo chuẩn WHO & Châu Á.',
    formulaDescription: 'Chỉ số khối cơ thể (BMI) được tính bằng cân nặng (kg) chia cho bình phương chiều cao (m).',
    formulaEquation: 'BMI = Cân nặng (kg) / [Chiều cao (m)]²',
    usageSteps: [
      'Chọn hệ đơn vị Metric (cm, kg) hoặc Imperial (ft/in, lbs).',
      'Nhập chiều cao và cân nặng hiện tại của bạn.',
      'Xem ngay chỉ số BMI, phân loại thể trạng trên thang đo trực quan.',
      'Tham khảo dải cân nặng lý tưởng và lượng nước khuyến nghị hàng ngày.'
    ],
    faqs: [
      {
        question: 'Chỉ số BMI bao nhiêu là bình thường đối với người Việt Nam?',
        answer: 'Theo tiêu chuẩn WPRO dành cho người châu Á, chỉ số BMI bình thường nằm trong khoảng 18.5 – 22.9. Từ 23 trở lên được xem là thừa cân và từ 25 trở lên là béo phì.'
      },
      {
        question: 'Chỉ số BMI có hoàn toàn chính xác với vận động viên không?',
        answer: 'BMI không phân biệt giữa khối lượng cơ bắp và khối lượng mỡ. Do đó, người tập thể hình hoặc vận động viên có thể có chỉ số BMI cao do khối lượng cơ lớn dù cơ thể rất ít mỡ.'
      },
      {
        question: 'Làm thế nào để tính cân nặng lý tưởng theo chiều cao?',
        answer: 'Dải cân nặng lý tưởng được tính dựa trên ngưỡng BMI từ 18.5 đến 22.9: Cân nặng tối thiểu = 18.5 × (Chiều cao)², Cân nặng tối đa = 22.9 × (Chiều cao)².'
      }
    ],
    relatedToolIds: ['compound', 'age', 'percentage']
  },
  loan: {
    id: 'loan',
    category: 'financial',
    name: 'Lãi suất vay & Trả góp',
    shortName: 'Vay & Trả góp',
    tierNumber: 1,
    iconName: 'Banknote',
    seoTitle: 'Loan / EMI Calculator – Tính lãi vay & số tiền trả góp hàng tháng',
    seoH1: 'Loan / EMI Calculator – Tính lãi suất vay mua nhà, mua xe & trả góp',
    description: 'Công cụ tính khoản trả góp hàng tháng (EMI), tổng tiền lãi và tổng số tiền phải thanh toán. Hỗ trợ cả 2 phương thức: Trả đều cố định (EMI) và Trả theo dư nợ giảm dần, kèm lịch trả nợ chi tiết.',
    formulaDescription: 'Công thức tính trả đều hàng tháng (EMI): EMI = [P × r × (1 + r)^n] / [(1 + r)^n – 1], trong đó P là tiền gốc, r là lãi suất hàng tháng, n là số kỳ trả.',
    formulaEquation: 'EMI = [P × r × (1 + r)ⁿ] / [(1 + r)ⁿ – 1]',
    usageSteps: [
      'Nhập số tiền bạn muốn vay (Vốn gốc).',
      'Nhập mức lãi suất năm (% / năm) theo hợp đồng vay.',
      'Chọn thời hạn vay theo số Năm hoặc số Tháng.',
      'Chọn phương thức thanh toán (Trả đều cố định hoặc Dư nợ giảm dần) để xem ngay biểu đồ phân bổ gốc - lãi và bảng sao kê hàng tháng.'
    ],
    faqs: [
      {
        question: 'Sự khác biệt giữa trả theo dư nợ giảm dần và trả góp đều (EMI) là gì?',
        answer: 'Với phương thức trả góp đều (EMI), số tiền bạn trả mỗi tháng là cố định suốt kỳ hạn. Với dư nợ giảm dần, tiền gốc trả đều mỗi tháng, tiền lãi tính trên số tiền còn nợ thực tế nên tổng số tiền trả mỗi tháng sẽ giảm dần theo thời gian.'
      },
      {
        question: 'Công cụ này có áp dụng cho vay mua nhà và vay mua ô tô không?',
        answer: 'Có, công cụ hoàn toàn tương thích với các khoản vay thế chấp mua nhà, vay mua xe ô tô, vay kinh doanh và vay tiêu dùng cá nhân tại tất cả các ngân hàng.'
      },
      {
        question: 'Tôi có thể tải hoặc in lịch trả nợ không?',
        answer: 'Bạn có thể xem trực tiếp bảng lịch trả nợ từng tháng và sao chép dữ liệu tóm tắt hoặc in nhanh chóng.'
      }
    ],
    relatedToolIds: ['compound', 'percentage', 'basic']
  },
  salary: {
    id: 'salary',
    category: 'financial',
    name: 'Tính tiền lương (Gross - Net)',
    shortName: 'Tiền lương',
    tierNumber: 1,
    iconName: 'Wallet',
    seoTitle: 'International Salary Calculator – Tính lương Gross sang Net & Net sang Gross Chuẩn Quốc Tế',
    seoH1: 'International Salary Calculator – Tính lương Gross/Net, An sinh xã hội & Thuế Thu nhập Đa Quốc Gia',
    description: 'Bảng tính tiền lương chuẩn quốc tế hỗ trợ tính Gross ↔ Net đa quốc gia (Việt Nam, Hoa Kỳ, Vương quốc Anh, Đức/EU, Nhật Bản, Singapore, Úc, Canada & Quốc tế Tự do). Tự động quy đổi Năm ↔ Tháng ↔ 2 Tuần ↔ Hàng Tuần ↔ Theo Giờ, đa tiền tệ và tùy chỉnh chi tiết thuế, bảo hiểm.',
    formulaDescription: 'Lương Net = Lương Gross – Các khoản khấu trừ an sinh / bảo hiểm – Thuế thu nhập cá nhân (theo biểu lũy tiến từng quốc gia sau khi trừ các khoản giảm trừ tiêu chuẩn).',
    formulaEquation: 'Net = Gross – Social Security/Insurance – Income Tax',
    usageSteps: [
      'Chọn quốc gia và hệ thống thuế (Việt Nam, Hoa Kỳ, Anh, Đức, Nhật Bản, Singapore, Úc, Canada hoặc Quốc tế tự do).',
      'Chọn hướng tính toán: Gross sang Net (Thực nhận) hoặc Net sang Gross.',
      'Chọn chu kỳ tính lương: Hàng năm, Hàng tháng, 2 Tuần, Hàng tuần hoặc Theo giờ (40h/tuần).',
      'Nhập mức lương thu nhập và số người phụ thuộc (nếu có).',
      'Xem ngay bảng đối chiếu đa chu kỳ chuẩn quốc tế, phiếu lương chi tiết và tùy chỉnh tham số theo ý muốn.'
    ],
    faqs: [
      {
        question: 'Bảng tính lương này hỗ trợ những quốc gia và hệ thống thuế nào?',
        answer: 'Hệ thống tích hợp sẵn cấu hình biểu thuế chuẩn của 8 quốc gia lớn: Việt Nam (VNĐ - Luật 2024), Hoa Kỳ (USD - IRS Federal & FICA), Vương quốc Anh (GBP - HMRC PAYE & NI), Đức (EUR - Lohnsteuer & Social Security), Nhật Bản (JPY - Shakai Hoken), Singapore (SGD - CPF), Úc (AUD - ATO & Superannuation), Canada (CAD - CRA, CPP & EI) và Chế độ Quốc tế Tự do (Universal Custom) cho phép tùy chỉnh bất kỳ quốc gia nào trên thế giới.'
      },
      {
        question: 'Công cụ có hỗ trợ quy đổi lương theo giờ, tuần, tháng và năm không?',
        answer: 'Có! Hệ thống tự động tính toán và đối chiếu đồng thời cả 5 chu kỳ lương chuẩn quốc tế: Hàng năm (Annual), Hàng tháng (Monthly), 2 tuần (Bi-weekly - 26 kỳ), Hàng tuần (Weekly - 52 kỳ) và Theo giờ (Hourly - 2.080 giờ/năm theo chuẩn 40h/tuần).'
      },
      {
        question: 'Tôi có thể tự điều chỉnh thuế suất và tỷ lệ bảo hiểm cho phù hợp với trường hợp của mình không?',
        answer: 'Hoàn toàn được. Bạn chỉ cần nhấn nút "Tùy chỉnh tham số" để thay đổi tỷ lệ bảo hiểm người lao động và doanh nghiệp, mức giảm trừ gia cảnh, thêm/sửa các bậc thuế suất lũy tiến hoặc đổi đồng tiền hiển thị (USD, EUR, GBP, JPY, VND, SGD, AUD,...). Mọi tùy chỉnh đều được tự động lưu lại trên trình duyệt của bạn.'
      },
      {
        question: 'Lương Gross và Lương Net khác nhau như thế nào?',
        answer: 'Lương Gross (Tổng thu nhập) là mức lương thỏa thuận trước khi trừ các khoản bảo hiểm bắt buộc và thuế thu nhập cá nhân. Lương Net (Thực nhận) là số tiền thực tế người lao động mang về tài khoản sau mọi nghĩa vụ thuế và an sinh.'
      }
    ],
    relatedToolIds: ['loan', 'percentage', 'compound']
  },
  age: {
    id: 'age',
    category: 'utility',
    name: 'Tính tuổi & Can chi',
    shortName: 'Tính tuổi',
    tierNumber: 1,
    iconName: 'Calendar',
    seoTitle: 'Age Calculator – Tính tuổi chính xác theo ngày, tháng, năm',
    seoH1: 'Age Calculator – Tính tuổi chính xác đến từng ngày & Đếm ngược sinh nhật',
    description: 'Xác định chính xác độ tuổi của bạn theo số năm, tháng, ngày. Đồng thời khám phá tổng số ngày, giờ, phút đã trôi qua, đếm ngược tới sinh nhật kế tiếp và xem Cung hoàng đạo cùng Can Chi.',
    formulaDescription: 'Tính toán hiệu số thời gian giữa ngày sinh và ngày mốc (mặc định là hôm nay) có xét đến năm nhuận và số ngày chính xác của từng tháng.',
    formulaEquation: 'Độ tuổi = Ngày mốc – Ngày sinh (Quy đổi Năm, Tháng, Ngày)',
    usageSteps: [
      'Chọn ngày, tháng, năm sinh của bạn.',
      'Chọn ngày mốc cần tính tuổi (mặc định là ngày hôm nay).',
      'Nhận ngay kết quả tuổi chi tiết theo năm, tháng, ngày.',
      'Xem thông tin đếm ngược sinh nhật tiếp theo, cung hoàng đạo và thời gian sống quy đổi.'
    ],
    faqs: [
      {
        question: 'Công cụ có tự động tính năm nhuận (29/02) không?',
        answer: 'Có, thuật toán tự động xử lý năm nhuận chuẩn xác tuyệt đối, bao gồm cả những người sinh vào ngày 29 tháng 2.'
      },
      {
        question: 'Tôi có thể tính khoảng cách tuổi giữa hai thời điểm bất kỳ trong quá khứ không?',
        answer: 'Hoàn toàn được. Bạn có thể thay đổi cả Ngày bắt đầu và Ngày kết thúc để tính khoảng thời gian giữa 2 sự kiện bất kỳ.'
      },
      {
        question: 'Thông tin cung hoàng đạo và con giáp được xác định như thế nào?',
        answer: 'Cung hoàng đạo được tính theo 12 chòm sao phương Tây dựa vào ngày và tháng sinh. Con giáp được tính theo hệ Can Chi âm dương dựa vào năm sinh.'
      }
    ],
    relatedToolIds: ['bmi', 'percentage', 'basic']
  },
  percentage: {
    id: 'percentage',
    category: 'math',
    name: 'Phần trăm & Chiết khấu',
    shortName: 'Phần trăm',
    tierNumber: 1,
    iconName: 'Percent',
    seoTitle: 'Percentage Calculator – Máy tính phần trăm nhanh chóng & chuẩn xác',
    seoH1: 'Percentage Calculator – Tính % chiết khấu, tỉ lệ và tăng giảm',
    description: 'Giải quyết mọi bài toán phần trăm trong công việc và mua sắm: Tính X% của Y, tỷ lệ phần trăm giữa hai số, phần trăm tăng/giảm và tính giá sau khuyến mãi kèm thuế VAT.',
    formulaDescription: 'Phần trăm thể hiện tỷ lệ trên 100 đơn vị: % = (Giá trị / Tổng số) × 100%.',
    formulaEquation: 'P% = (Giá trị / Tổng) × 100',
    usageSteps: [
      'Chọn dạng bài toán phần trăm bạn cần giải quyết từ 4 tab tiện ích.',
      'Nhập các giá trị vào ô tương ứng.',
      'Kết quả được tính toán tự động ngay khi bạn nhập số.',
      'Xem chi tiết công thức từng bước để áp dụng vào học tập hoặc công việc.'
    ],
    faqs: [
      {
        question: 'Làm thế nào để tính % tăng trưởng hoặc giảm giá?',
        answer: 'Công thức: % Thay đổi = [(Giá trị mới – Giá trị cũ) / Giá trị cũ] × 100. Nếu kết quả dương là tăng trưởng, nếu âm là giảm sút.'
      },
      {
        question: 'Làm sao để tính nhanh giá tiền sau khi giảm giá và cộng thuế VAT?',
        answer: 'Sử dụng tab "Giảm giá & Thuế": Nhập giá gốc, % giảm giá và % VAT (ví dụ 8% hoặc 10%), công cụ sẽ tính số tiền bạn tiết kiệm được và số tiền cuối cùng phải trả.'
      },
      {
        question: 'Công cụ có thể tính số âm hoặc số thập phân không?',
        answer: 'Có, máy tính hỗ trợ đầy đủ số thập phân và các giá trị phần trăm lớn hơn 100%.'
      }
    ],
    relatedToolIds: ['loan', 'basic', 'compound']
  },
  unit: {
    id: 'unit',
    category: 'conversion',
    name: 'Đổi đơn vị đo lường',
    shortName: 'Đổi đơn vị',
    tierNumber: 2,
    iconName: 'ArrowLeftRight',
    seoTitle: 'Unit Converter – Chuyển đổi đơn vị đo lường & Tỷ giá ngoại tệ',
    seoH1: 'Unit Converter – Đổi tiền tệ, chiều dài, cân nặng, diện tích & nhiệt độ',
    description: 'Chuyển đổi tức thì giữa các hệ đo lường phổ biến (hệ mét & hệ Anh-Mỹ) cùng công cụ quy đổi tỷ giá ngoại tệ phổ biến (VND, USD, EUR, JPY, GBP, CNY...).',
    formulaDescription: 'Quy đổi qua đơn vị chuẩn cơ sở SI rồi chuyển về đơn vị đích.',
    formulaEquation: 'V_out = (V_in × Factor_in) / Factor_out',
    usageSteps: [
      'Chọn danh mục cần đổi: Tiền tệ, Chiều dài, Cân nặng, Diện tích hoặc Nhiệt độ.',
      'Nhập giá trị cần đổi và chọn đơn vị nguồn.',
      'Chọn đơn vị đích để nhận ngay kết quả chuyển đổi.',
      'Đối với tiền tệ, bạn có thể xem bảng tỷ giá tham khảo và điều chỉnh tỷ giá theo ý muốn.'
    ],
    faqs: [
      {
        question: 'Tỷ giá ngoại tệ có thể tùy chỉnh được không?',
        answer: 'Có, công cụ cung cấp sẵn tỷ giá tham khảo thị trường và cho phép bạn tùy chỉnh tỷ giá theo đúng tỷ giá ngân hàng mà bạn đang giao dịch.'
      },
      {
        question: 'Có hỗ trợ các đơn vị đo truyền thống Việt Nam như sào, mẫu, tạ, tấn không?',
        answer: 'Có, trong mục Diện tích hỗ trợ Sào Bắc Bộ (360m²), Sào Trung Bộ (500m²), Công Nam Bộ (1000m²), Mẫu (10.000m²); mục Cân nặng hỗ trợ Tạ, Yến, Tấn.'
      },
      {
        question: 'Công thức chuyển đổi nhiệt độ giữa °C và °F là gì?',
        answer: 'Từ °C sang °F: °F = (°C × 9/5) + 32. Từ °F sang °C: °C = (°F – 32) × 5/9.'
      }
    ],
    relatedToolIds: ['basic', 'percentage', 'trigonometry']
  },
  trigonometry: {
    id: 'trigonometry',
    category: 'geometry',
    name: 'Lượng giác & Tam giác',
    shortName: 'Lượng giác',
    tierNumber: 2,
    iconName: 'Triangle',
    seoTitle: 'Trigonometry Calculator – Máy tính lượng giác sin cos tan & giải tam giác',
    seoH1: 'Trigonometry Calculator – Tính Sin, Cos, Tan & Giải tam giác vuông trực quan',
    description: 'Tính toán giá trị các hàm lượng giác sin, cos, tan, cot, arcsin, arccos, arctan theo Độ (deg) hoặc Radian (rad). Kèm tính năng giải tam giác vuông với hình vẽ mô phỏng động.',
    formulaDescription: 'Các tỉ số lượng giác trong tam giác vuông: sin = đối/huyền, cos = kề/huyền, tan = đối/kề, cot = kề/đối.',
    formulaEquation: 'sin²(α) + cos²(α) = 1, tan(α) = sin(α) / cos(α)',
    usageSteps: [
      'Chọn chế độ góc: Độ (Degrees °) hoặc Radian (Rad).',
      'Sử dụng bảng tính nhanh các hàm sin, cos, tan hoặc mở tab Giải tam giác vuông.',
      'Nhập 2 yếu tố đã biết (ví dụ 2 cạnh hoặc 1 cạnh + 1 góc nhọn).',
      'Xem hình vẽ tam giác trực quan với đầy đủ kích thước, góc, diện tích và chu vi.'
    ],
    faqs: [
      {
        question: 'Khi nào nên sử dụng chế độ Degree (Độ) và Radian?',
        answer: 'Sử dụng Degree (°) cho các bài toán hình học phổ thông, đo đạc trắc địa và xây dựng. Sử dụng Radian cho các bài toán giải tích, hàm số và vật lý sóng.'
      },
      {
        question: 'Công cụ có tự động vẽ hình tam giác đúng tỷ lệ không?',
        answer: 'Có, thành phần SVG sẽ tự động co giãn theo tỷ lệ thực tế của các cạnh bạn vừa nhập, đồng thời hiển thị góc vuông và cung đo góc nhọn.'
      },
      {
        question: 'Giá trị tan(90°) được hiển thị như thế nào?',
        answer: 'Tại góc 90° (hoặc π/2 rad), hàm tan không xác định (vô cực). Công cụ sẽ hiển thị thông báo "Không xác định (∞)" rõ ràng.'
      }
    ],
    relatedToolIds: ['basic', 'unit', 'percentage']
  },
  compound: {
    id: 'compound',
    category: 'financial',
    name: 'Lãi kép & Tích lũy',
    shortName: 'Lãi kép',
    tierNumber: 3,
    iconName: 'TrendingUp',
    seoTitle: 'Compound Interest Calculator – Tính lãi kép đầu tư & tích lũy tài chính',
    seoH1: 'Compound Interest Calculator – Mô phỏng sức mạnh lãi kép & tăng trưởng tài sản',
    description: 'Công cụ mô phỏng lãi kép đầu tư tích lũy định kỳ theo thời gian, tính toán số dư tương lai, tiền gốc và tiền lãi sinh sôi.',
    formulaDescription: 'Công thức lãi kép: A = P(1 + r/n)^(nt) kết hợp với chuỗi nộp tiền định kỳ (PMT).',
    formulaEquation: 'A = P × (1 + r/n)ⁿᵗ + PMT × {[(1 + r/n)ⁿᵗ – 1] / (r/n)}',
    usageSteps: [
      'Nhập số tiền vốn gốc ban đầu bỏ ra đầu tư.',
      'Nhập số tiền gửi tích lũy định kỳ nộp thêm hàng tháng.',
      'Chọn mức lãi suất sinh lời dự kiến (%/năm) và tần suất gộp lãi (hàng tháng/năm).',
      'Chọn số năm đầu tư để xem biểu đồ tăng trưởng hàm số mũ và bảng sao kê theo từng năm.'
    ],
    faqs: [
      {
        question: 'Tại sao Albert Einstein gọi lãi kép là kỳ quan thứ 8 của thế giới?',
        answer: 'Bởi vì tiền lãi sinh ra từ vốn gốc tiếp tục được cộng dồn vào vốn để sinh ra lãi mới trong các kỳ tiếp theo, tạo nên hiệu ứng tăng trưởng hàm số mũ vượt bậc theo thời gian.'
      },
      {
        question: 'Tần suất gộp lãi ảnh hưởng thế nào đến kết quả đầu tư?',
        answer: 'Gộp lãi càng thường xuyên (theo tháng hoặc theo quý thay vì theo năm) thì lãi sinh ra càng nhanh và số tiền tích lũy cuối cùng càng lớn.'
      },
      {
        question: 'Khoản nộp định kỳ (PMT) có ý nghĩa gì trong tích lũy dài hạn?',
        answer: 'Khoản nộp đều đặn hàng tháng giúp tạo thói quen kỷ luật tài chính và tận dụng chiến lược bình quân giá (DCA), giúp quy mô tài sản bùng nổ sau 5-10 năm.'
      }
    ],
    relatedToolIds: ['loan', 'salary', 'mortgage']
  },
  mortgage: {
    id: 'mortgage',
    category: 'financial',
    name: 'Vay thế chấp mua nhà',
    shortName: 'Vay mua nhà',
    tierNumber: 3,
    iconName: 'Home',
    seoTitle: 'Mortgage Calculator – Tính khoản trả góp mua nhà & thế chấp ngân hàng',
    seoH1: 'Mortgage Calculator – Tính tiền gốc, lãi & thuế phí vay mua bất động sản',
    description: 'Phân tích chi tiết khoản thanh toán mua nhà hàng tháng bao gồm tiền gốc, lãi suất, thuế tài sản, bảo hiểm nhà và phí quản lý chung cư (HOA).',
    formulaDescription: 'Công thức niên kim cố định cho vay thế chấp bất động sản với kỳ hạn dài.',
    formulaEquation: 'M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1] + Thuế + Phí',
    usageSteps: [
      'Nhập giá trị căn nhà và số tiền bạn trả trước (Down payment).',
      'Chọn thời hạn vay (10, 15, 20, 25, 30 năm) và lãi suất năm.',
      'Tùy chỉnh thêm thuế tài sản, bảo hiểm và phí quản lý nếu có.',
      'Xem bảng sao kê phân bổ gốc lãi và lịch trả nợ chi tiết từng năm.'
    ],
    faqs: [
      {
        question: 'Tôi nên trả trước (Down Payment) bao nhiêu % khi mua nhà?',
        answer: 'Mức khuyến nghị an toàn là tối thiểu 20% giá trị căn nhà để tránh phải mua bảo hiểm thế chấp tư nhân (PMI) và giảm áp lực dòng tiền hàng tháng.'
      },
      {
        question: 'Khoản trả góp mua nhà nên chiếm bao nhiêu phần trăm thu nhập?',
        answer: 'Theo quy tắc tài chính cá nhân 28/36, tổng chi phí nhà ở hàng tháng không nên vượt quá 28% tổng thu nhập gộp của gia đình.'
      }
    ],
    relatedToolIds: ['loan', 'salary', 'tax']
  },
  calorie: {
    id: 'calorie',
    category: 'fitness',
    name: 'Tính calo tiêu thụ (TDEE)',
    shortName: 'Calo & TDEE',
    tierNumber: 2,
    iconName: 'Flame',
    seoTitle: 'Calorie Calculator – Ước tính lượng Calo nạp vào hàng ngày & TDEE',
    seoH1: 'Calorie Calculator – Tính nhu cầu Calo để tăng, giảm hoặc giữ cân',
    description: 'Ước tính chính xác lượng Calo cơ thể cần mỗi ngày (TDEE) theo công thức Mifflin-St Jeor chuẩn y khoa, tính thâm hụt calo giảm mỡ và tỷ lệ đạm/carb/béo.',
    formulaDescription: 'BMR theo Mifflin-St Jeor: 10×W + 6.25×H - 5×A + S. TDEE = BMR × PAL.',
    formulaEquation: 'TDEE = BMR × Hệ số vận động (1.2 - 1.9)',
    usageSteps: [
      'Chọn giới tính, nhập tuổi, chiều cao và cân nặng.',
      'Chọn mức độ vận động hàng tuần từ ít vận động đến vận động cường độ cao.',
      'Xem chỉ số BMR và lượng calo tiêu hao duy trì cân nặng (TDEE).',
      'Lựa chọn mức thâm hụt hoặc dư thừa calo tương ứng với mục tiêu của bạn.'
    ],
    faqs: [
      {
        question: 'Giảm 1kg cân nặng tương đương với thâm hụt bao nhiêu Calo?',
        answer: '1kg mỡ cơ thể tương đương khoảng 7.700 kcal. Để giảm 0.5kg/tuần, bạn cần tạo mức thâm hụt khoảng 500 kcal mỗi ngày.'
      }
    ],
    relatedToolIds: ['bmi', 'bodyfat', 'pace']
  },
  bodyfat: {
    id: 'bodyfat',
    category: 'fitness',
    name: 'Tỷ lệ mỡ cơ thể',
    shortName: 'Tỷ lệ mỡ',
    tierNumber: 2,
    iconName: 'Activity',
    seoTitle: 'Body Fat Calculator – Đo tỷ lệ mỡ cơ thể chuẩn Hải quân Hoa Kỳ (US Navy)',
    seoH1: 'Body Fat Calculator – Tính % mỡ, khối lượng cơ nạc và phân loại thể trạng',
    description: 'Đo lường tỷ lệ phần trăm mỡ trong cơ thể dựa trên chu vi vòng cổ, vòng eo và vòng hông theo thuật toán tiêu chuẩn của Hải quân Hoa Kỳ.',
    formulaDescription: 'Thuật toán U.S. Navy dựa trên logarit chu vi các vòng cơ thể trừ vòng cổ.',
    formulaEquation: '%BF = 495 / [1.0324 - 0.19077×log10(eo - cổ) + 0.15456×log10(cao)] - 450',
    usageSteps: [
      'Sử dụng thước dây mềm đo sát da vòng cổ (dưới yết hầu) và vòng eo (ngang rốn).',
      'Đối với nữ giới, đo thêm vòng hông tại điểm rộng nhất.',
      'Nhập các số đo và chiều cao để nhận ngay % mỡ và khối lượng cơ nạc (Lean Mass).'
    ],
    faqs: [
      {
        question: 'Tỷ lệ mỡ bao nhiêu là lý tưởng cho người tập thể hình?',
        answer: 'Đối với nam giới, tỷ lệ mỡ 10 - 14% là mức cơ bắp nét rõ. Đối với nữ giới, mức 18 - 22% là vóc dáng săn chắc cân đối.'
      }
    ],
    relatedToolIds: ['bmi', 'calorie', 'pace']
  },
  time: {
    id: 'time',
    category: 'utility',
    name: 'Máy tính thời gian',
    shortName: 'Thời gian',
    tierNumber: 1,
    iconName: 'Clock',
    seoTitle: 'Time Calculator – Cộng trừ giờ phút & Tính khoảng cách thời gian',
    seoH1: 'Time Calculator – Tính giờ công làm việc, trừ thời gian nghỉ và cộng giờ',
    description: 'Tính toán khoảng cách thời gian giữa 2 mốc giờ, tự động hỗ trợ ca làm việc qua đêm, trừ thời gian nghỉ trưa và quy đổi sang số giờ thập phân tính lương.',
    formulaDescription: 'Quy đổi về tổng số phút: Δt = t_kết_thúc - t_bắt_đầu - t_nghỉ.',
    formulaEquation: 'Δt = (H2 × 60 + M2) - (H1 × 60 + M1) - Break',
    usageSteps: [
      'Chọn mốc giờ bắt đầu và giờ kết thúc ca làm việc.',
      'Nhập thời gian nghỉ trưa cần trừ ra (ví dụ 60 phút).',
      'Xem kết quả số giờ phút thực tế và số giờ thập phân quy đổi tính công.'
    ],
    faqs: [
      {
        question: 'Làm thế nào để đổi 8 giờ 45 phút sang số thập phân?',
        answer: 'Lấy số phút chia cho 60: 45 / 60 = 0.75. Như vậy 8 giờ 45 phút = 8.75 giờ.'
      }
    ],
    relatedToolIds: ['date', 'salary', 'basic']
  },
  date: {
    id: 'date',
    category: 'utility',
    name: 'Máy tính ngày tháng',
    shortName: 'Ngày tháng',
    tierNumber: 1,
    iconName: 'CalendarDays',
    seoTitle: 'Date Calculator – Tính số ngày giữa 2 mốc thời gian & Cộng trừ ngày',
    seoH1: 'Date Calculator – Đếm số ngày, số tuần, ngày làm việc (trừ T7, CN)',
    description: 'Tính chính xác khoảng cách giữa hai mốc ngày bất kỳ, tính số ngày làm việc hành chính (Business days) và cộng trừ ngày tháng năm trong tương lai hoặc quá khứ.',
    formulaDescription: 'Khoảng cách giữa hai ngày được tính theo chuẩn dấu thời gian Unix Epoch.',
    formulaEquation: 'Days = ⌊(Date2 - Date1) / (1000 × 60 × 60 × 24)⌋',
    usageSteps: [
      'Chọn ngày bắt đầu và ngày kết thúc trên lịch.',
      'Tùy chọn bao gồm hoặc không bao gồm ngày kết thúc.',
      'Xem tổng số ngày, số tuần quy đổi và số ngày làm việc loại trừ cuối tuần.'
    ],
    faqs: [
      {
        question: 'Công cụ có loại trừ các ngày lễ tết quốc gia không?',
        answer: 'Công cụ hiện tự động loại trừ các ngày Thứ Bảy và Chủ Nhật cho số ngày làm việc tiêu chuẩn.'
      }
    ],
    relatedToolIds: ['time', 'age', 'ovulation']
  },
  tip: {
    id: 'tip',
    category: 'financial',
    name: 'Tính tiền Tip (Tiền boa)',
    shortName: 'Tiền Tip',
    tierNumber: 1,
    iconName: 'Receipt',
    seoTitle: 'Tip Calculator – Tính tiền boa & Chia hóa đơn nhà hàng cho nhóm',
    seoH1: 'Tip Calculator – Chia bill ăn uống, tính % tip và làm tròn hóa đơn',
    description: 'Tính toán nhanh tiền boa (tip) theo tỷ lệ phần trăm tùy chọn (10%, 15%, 18%, 20%), chia đều tổng thanh toán cho từng người trong nhóm bạn bè.',
    formulaDescription: 'Tiền tip = Hóa đơn × %Tip. Tiền mỗi người = (Hóa đơn + Tip) / Số người.',
    formulaEquation: 'Per_Person = (Bill × (1 + Tip%)) / People',
    usageSteps: [
      'Nhập tổng tiền ghi trên hóa đơn nhà hàng hoặc quán ăn.',
      'Chọn mức phần trăm tiền tip mong muốn.',
      'Nhập số lượng người tham gia chia hóa đơn để xem số tiền mỗi người cần đóng.'
    ],
    faqs: [
      {
        question: 'Mức tiền tip thông thường tại các nhà hàng quốc tế là bao nhiêu?',
        answer: 'Tại Mỹ và Canada, mức tip tiêu chuẩn phổ biến là từ 15% đến 20%. Tại châu Âu và châu Á, tip thường là tùy tâm từ 5% đến 10% nếu dịch vụ tốt.'
      }
    ],
    relatedToolIds: ['percentage', 'discount', 'basic']
  },
  discount: {
    id: 'discount',
    category: 'financial',
    name: 'Tính giảm giá & Khuyến mãi',
    shortName: 'Giảm giá',
    tierNumber: 1,
    iconName: 'Tag',
    seoTitle: 'Discount Calculator – Tính giá sau giảm & Chiết khấu voucher kép',
    seoH1: 'Discount Calculator – Tính tiền sale off, mã giảm giá bổ sung & số tiền tiết kiệm',
    description: 'Tính số tiền phải trả thực tế sau khi áp dụng giảm giá, chiết khấu cộng dồn (voucher kép) và hiển thị chính xác số tiền bạn tiết kiệm được.',
    formulaDescription: 'Giá sau giảm = Giá gốc × (1 - %Giảm 1) × (1 - %Giảm 2).',
    formulaEquation: 'Final = Original × (1 - Discount1) × (1 - Discount2)',
    usageSteps: [
      'Nhập giá niêm yết ban đầu của sản phẩm.',
      'Chọn hoặc kéo thanh % giảm giá chính.',
      'Bật tùy chọn chiết khấu kép nếu có thêm mã voucher bổ sung để xem giá cuối cùng.'
    ],
    faqs: [
      {
        question: 'Giảm giá 30% rồi giảm tiếp 10% có phải là giảm 40% không?',
        answer: 'Không. Giảm giá kép được tính trên số tiền đã giảm đợt 1, tương đương mức giảm thực tế là 37% so với giá gốc.'
      }
    ],
    relatedToolIds: ['percentage', 'tip', 'tax']
  },
  tax: {
    id: 'tax',
    category: 'financial',
    name: 'Thuế thu nhập cá nhân',
    shortName: 'Thuế TNCN',
    tierNumber: 3,
    iconName: 'Building2',
    seoTitle: 'Tax Calculator – Ước tính Thuế Thu Nhập Cá Nhân (PIT) lũy tiến',
    seoH1: 'Tax Calculator – Tính thuế TNCN, giảm trừ bản thân & người phụ thuộc',
    description: 'Ước tính thuế thu nhập cá nhân theo biểu thuế lũy tiến từng phần 7 bậc, tính toán đầy đủ các khoản giảm trừ bản thân, người phụ thuộc và bảo hiểm bắt buộc.',
    formulaDescription: 'Thu nhập tính thuế = Lương Gross - Bảo hiểm (10.5%) - Giảm trừ gia cảnh.',
    formulaEquation: 'Thuế TNCN = ∑ (Thu nhập trong bậc × Thuế suất bậc)',
    usageSteps: [
      'Nhập mức lương tổng hàng tháng (Gross).',
      'Nhập số người phụ thuộc đang đăng ký giảm trừ gia cảnh.',
      'Xem phân tích chi tiết số thuế phải nộp ở từng bậc và số tiền thực nhận (Net).'
    ],
    faqs: [
      {
        question: 'Mức giảm trừ gia cảnh hiện tại là bao nhiêu?',
        answer: 'Mức giảm trừ cho bản thân người nộp thuế là 11 triệu đồng/tháng và cho mỗi người phụ thuộc là 4.4 triệu đồng/tháng.'
      }
    ],
    relatedToolIds: ['salary', 'loan', 'mortgage']
  },
  pace: {
    id: 'pace',
    category: 'fitness',
    name: 'Tốc độ chạy bộ (Pace)',
    shortName: 'Pace chạy bộ',
    tierNumber: 2,
    iconName: 'Footprints',
    seoTitle: 'Pace Calculator – Tính tốc độ Pace chạy bộ, đạp xe min/km & km/h',
    seoH1: 'Pace Calculator – Dự đoán thời gian hoàn thành 5K, 10K, Half, Full Marathon',
    description: 'Tính toán tốc độ chạy bộ Pace (phút/km hoặc phút/dặm), chuyển đổi sang vận tốc km/h và ước tính thời gian hoàn thành các cự ly chạy bộ đường dài.',
    formulaDescription: 'Pace = Tổng thời gian (giây) / Quãng đường (km).',
    formulaEquation: 'Pace (min/km) = Time / Distance',
    usageSteps: [
      'Chọn chế độ tính: Tính Pace từ thời gian & cự ly, hoặc tính thời gian dự kiến từ Pace mục tiêu.',
      'Nhập thời gian và cự ly (ví dụ 10km, 21km hoặc 42km).',
      'Xem bảng tốc độ phân đoạn (splits) và dự đoán thành tích thi đấu.'
    ],
    faqs: [
      {
        question: 'Pace 5:30 nghĩa là gì trong chạy bộ?',
        answer: 'Pace 5:30 nghĩa là bạn mất 5 phút 30 giây để hoàn thành 1 kilômét, tương đương vận tốc khoảng 10.91 km/h.'
      }
    ],
    relatedToolIds: ['calorie', 'bodyfat', 'time']
  },
  ovulation: {
    id: 'ovulation',
    category: 'fitness',
    name: 'Chu kỳ rụng trứng & Thụ thai',
    shortName: 'Rụng trứng',
    tierNumber: 2,
    iconName: 'Heart',
    seoTitle: 'Ovulation Calculator – Dự đoán ngày rụng trứng & Chu kỳ sinh sản',
    seoH1: 'Ovulation Calculator – Tính cửa sổ thụ thai & Ngày dự sinh cho phụ nữ',
    description: 'Theo dõi chu kỳ kinh nguyệt, xác định ngày rụng trứng chính xác nhất và khoảng thời gian dễ thụ thai cao nhất trong tháng kèm dự báo các chu kỳ kế tiếp.',
    formulaDescription: 'Ngày rụng trứng = Ngày bắt đầu kỳ kinh cuối + (Độ dài chu kỳ - Pha hoàng thể 14 ngày).',
    formulaEquation: 'Ovulation = LMP + (Cycle_Length - 14)',
    usageSteps: [
      'Chọn ngày đầu tiên của kỳ kinh nguyệt gần nhất.',
      'Điều chỉnh độ dài chu kỳ trung bình (mặc định 28 ngày).',
      'Xem ngay ngày rụng trứng và cửa sổ thụ thai tối ưu nhất.'
    ],
    faqs: [
      {
        question: 'Cửa sổ thụ thai kéo dài bao nhiêu ngày?',
        answer: 'Tinh trùng có thể sống trong cơ thể người phụ nữ tới 5 ngày và trứng sống khoảng 12-24 giờ sau khi rụng. Do đó, cửa sổ thụ thai kéo dài khoảng 6 ngày (5 ngày trước khi rụng trứng và ngày rụng trứng).'
      }
    ],
    relatedToolIds: ['date', 'age', 'calorie']
  },
  gpa: {
    id: 'gpa',
    category: 'utility',
    name: 'Tính điểm trung bình (GPA)',
    shortName: 'Điểm GPA',
    tierNumber: 3,
    iconName: 'GraduationCap',
    seoTitle: 'GPA Calculator – Tính điểm trung bình tích lũy hệ 4.0 và hệ 10.0',
    seoH1: 'GPA Calculator – Tính điểm học tập, tín chỉ đại học & xếp loại tốt nghiệp',
    description: 'Tính điểm trung bình học tập tích lũy (GPA) theo thang điểm chữ A, B, C, D chuyển đổi sang thang điểm 4.0 và 10.0 chuẩn đại học quốc tế và Việt Nam.',
    formulaDescription: 'GPA = ∑ (Điểm môn i × Số tín chỉ môn i) / Tổng số tín chỉ.',
    formulaEquation: 'GPA = (∑ Grade_Points × Credits) / Total_Credits',
    usageSteps: [
      'Thêm các môn học trong học kỳ hoặc cả khóa học.',
      'Chọn điểm chữ (A+, A, B+, B...) và số tín chỉ tương ứng cho từng môn.',
      'Xem điểm GPA hệ 4.0, hệ 10.0 và xếp loại học lực tự động.'
    ],
    faqs: [
      {
        question: 'Điểm GPA bao nhiêu thì được xếp loại Giỏi và Xuất sắc?',
        answer: 'Theo thang điểm 4.0: Từ 3.20 đến 3.59 là loại Giỏi; Từ 3.60 đến 4.00 là loại Xuất sắc.'
      }
    ],
    relatedToolIds: ['percentage', 'basic', 'salary']
  },
  concrete: {
    id: 'concrete',
    category: 'utility',
    name: 'Tính khối lượng bê tông',
    shortName: 'Bê tông',
    tierNumber: 3,
    iconName: 'Boxes',
    seoTitle: 'Concrete Calculator – Tính khối lượng bê tông m³ & cấp phối vật tư',
    seoH1: 'Concrete Calculator – Dự toán số bao xi măng, cát, đá cho sàn móng cột',
    description: 'Dự toán thể tích bê tông m³ cho sàn phẳng, cột trụ tròn, móng băng; tự động tính phần trăm hao hụt và số lượng bao xi măng, khối cát, đá cần dùng.',
    formulaDescription: 'Thể tích sàn = Dài × Rộng × Dày. Thể tích cột = π × r² × Cao.',
    formulaEquation: 'V = (Length × Width × Thickness) × (1 + Waste%)',
    usageSteps: [
      'Chọn kết cấu cần đổ: Sàn bê tông, Cột tròn hoặc Móng băng.',
      'Nhập các kích thước thực tế tính bằng mét hoặc centimet.',
      'Chọn mác bê tông (M200, M250, M300) để nhận bảng cấp phối vật tư chi tiết.'
    ],
    faqs: [
      {
        question: 'Nên cộng thêm bao nhiêu phần trăm hao hụt bê tông?',
        answer: 'Mức dự phòng tiêu chuẩn là từ 5% đến 10% để bù cho việc lún đất, cong vênh cốp pha và thất thoát trong quá trình thi công.'
      }
    ],
    relatedToolIds: ['unit', 'basic', 'percentage']
  },
  random: {
    id: 'random',
    category: 'utility',
    name: 'Tạo số ngẫu nhiên',
    shortName: 'Quay số',
    tierNumber: 1,
    iconName: 'Dice5',
    seoTitle: 'Random Number Generator – Quay số ngẫu nhiên & Tung xúc xắc trực tuyến',
    seoH1: 'Random Number Generator – Tạo dãy số ngẫu nhiên không trùng lặp & Bốc thăm',
    description: 'Bộ công cụ tạo số ngẫu nhiên bảo mật cao trong khoảng tùy chỉnh (Min - Max), hỗ trợ xúc xắc đa diện RPG (d6, d20, d100) và bốc thăm trúng thưởng.',
    formulaDescription: 'Sinh số ngẫu nhiên đều chuẩn mật mã: R = ⌊Math.random() × (Max - Min + 1)⌋ + Min.',
    formulaEquation: 'R ∈ [Min, Max]',
    usageSteps: [
      'Nhập khoảng số nhỏ nhất và lớn nhất bạn muốn quay.',
      'Chọn số lượng số cần tạo và tùy chọn cho phép hoặc không cho phép trùng lặp.',
      'Nhấn nút để nhận ngay kết quả ngẫu nhiên tức thì.'
    ],
    faqs: [
      {
        question: 'Số ngẫu nhiên tạo ra có thực sự công bằng và khách quan không?',
        answer: 'Có, thuật toán sử dụng hàm sinh số giả ngẫu nhiên tiêu chuẩn của trình duyệt web đảm bảo phân phối đều trên toàn bộ dải giá trị.'
      }
    ],
    relatedToolIds: ['password', 'basic', 'percentage']
  },
  password: {
    id: 'password',
    category: 'utility',
    name: 'Tạo mật khẩu an toàn',
    shortName: 'Mật khẩu',
    tierNumber: 1,
    iconName: 'KeyRound',
    seoTitle: 'Password Generator – Tạo mật khẩu mạnh & Đo lường entropy bảo mật',
    seoH1: 'Password Generator – Tạo mật khẩu ngẫu nhiên an toàn chuẩn quân sự',
    description: 'Tạo mật khẩu mạnh ngẫu nhiên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt, đo lường độ mạnh theo thang đo entropy chống bẻ khóa brute-force.',
    formulaDescription: 'Đo lường entropy thông tin: E = L × log2(R), trong đó L là độ dài, R là kích thước tập ký tự.',
    formulaEquation: 'Entropy = Length × log₂(Pool_Size) bits',
    usageSteps: [
      'Kéo thanh trượt để chọn độ dài mật khẩu (khuyến nghị từ 16 ký tự trở lên).',
      'Bật/tắt các bộ ký tự chữ hoa, chữ thường, số và ký tự đặc biệt.',
      'Nhấn nút sao chép để đưa mật khẩu an toàn vào bộ nhớ tạm.'
    ],
    faqs: [
      {
        question: 'Mật khẩu dài bao nhiêu ký tự thì được coi là an toàn?',
        answer: 'Mật khẩu từ 16 ký tự trở lên kết hợp cả 4 loại ký tự có entropy trên 80 bits, máy tính hiện đại cần hàng triệu năm mới có thể bẻ khóa bằng phương pháp brute-force.'
      }
    ],
    relatedToolIds: ['random', 'basic', 'time']
  },
  autoloan: {
    id: 'autoloan',
    category: 'financial',
    name: 'Lãi vay mua ô tô',
    shortName: 'Vay mua xe',
    tierNumber: 3,
    iconName: 'Car',
    seoTitle: 'Auto Loan Calculator – Tính khoản vay mua ô tô trả góp',
    seoH1: 'Auto Loan Calculator – Dự toán chi phí & Lịch trả góp mua xe',
    description: 'Tính toán chính xác số tiền trả hàng tháng khi mua ô tô trả góp, khấu trừ phí lăn bánh và giá trị đổi xe cũ.',
    formulaDescription: 'Tính lãi vay tiêu dùng trả góp định kỳ theo dư nợ cố định hoặc dư nợ giảm dần.',
    formulaEquation: 'Payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]',
    usageSteps: [
      'Nhập giá xe, số tiền trả trước và giá trị thu cũ đổi mới (Trade-in).',
      'Nhập lãi suất phần trăm mỗi năm và thời hạn vay (tháng).',
      'Nhận bảng chi tiết số tiền trả góp hàng tháng.'
    ],
    faqs: [
      {
        question: 'Nên chọn kỳ hạn vay mua xe bao lâu?',
        answer: 'Kỳ hạn từ 36 đến 60 tháng thường tối ưu giữa mức trả hàng tháng và tổng chi phí lãi suất.'
      }
    ],
    relatedToolIds: ['loan', 'mortgage', 'payment']
  },
  interest: {
    id: 'interest',
    category: 'financial',
    name: 'Tính lãi suất vay & Tiết kiệm',
    shortName: 'Tính lãi suất',
    tierNumber: 3,
    iconName: 'Percent',
    seoTitle: 'Interest Calculator – Tính lãi suất đơn & Lãi suất kép',
    seoH1: 'Interest Calculator – Công cụ tính lãi tiết kiệm & Khoản vay',
    description: 'So sánh và tính toán trực quan giữa lãi đơn (Simple Interest) và lãi kép (Compound Interest) với các tần suất cộng dồn linh hoạt.',
    formulaDescription: 'Lãi đơn: I = P × r × t. Lãi kép: A = P(1 + r/n)^(nt).',
    formulaEquation: 'A = P(1 + r/n)^(nt)',
    usageSteps: [
      'Nhập số vốn gốc ban đầu.',
      'Nhập lãi suất năm và thời gian gửi hoặc vay.',
      'Chọn phương thức lãi đơn hoặc chu kỳ dồn lãi.'
    ],
    faqs: [
      {
        question: 'Lãi kép khác gì so với lãi đơn?',
        answer: 'Lãi kép tái đầu tư số tiền lãi của kỳ trước vào gốc, tạo ra hiệu ứng lãi mẹ đẻ lãi con theo cấp số nhân.'
      }
    ],
    relatedToolIds: ['compound', 'investment', 'finance']
  },
  payment: {
    id: 'payment',
    category: 'financial',
    name: 'Kế hoạch thanh toán định kỳ',
    shortName: 'Thanh toán định kỳ',
    tierNumber: 3,
    iconName: 'DollarSign',
    seoTitle: 'Payment Calculator – Tính toán các khoản thanh toán định kỳ',
    seoH1: 'Payment Calculator – Lập kế hoạch trả nợ định kỳ chuẩn xác',
    description: 'Xác định số tiền thanh toán định kỳ cần thiết để tất toán khoản vay hoặc đạt mục tiêu tài chính.',
    formulaDescription: 'Áp dụng công thức niên kim cố định đều (Ordinary Annuity Payment).',
    formulaEquation: 'PMT = PV × [r / (1 - (1+r)⁻ⁿ)]',
    usageSteps: [
      'Nhập giá trị khoản vay hoặc mục tiêu cần tích lũy.',
      'Nhập lãi suất và số kỳ thanh toán.',
      'Xem số tiền cần chi trả mỗi tháng.'
    ],
    faqs: [
      {
        question: 'Công cụ có hỗ trợ thanh toán vào đầu kỳ không?',
        answer: 'Có, bạn có thể chuyển đổi giữa thanh toán cuối kỳ (Ordinary) và đầu kỳ (Annuity Due).'
      }
    ],
    relatedToolIds: ['loan', 'mortgage', 'autoloan']
  },
  retirement: {
    id: 'retirement',
    category: 'financial',
    name: 'Kế hoạch tiết kiệm hưu trí',
    shortName: 'Kế hoạch hưu trí',
    tierNumber: 3,
    iconName: 'PiggyBank',
    seoTitle: 'Retirement Calculator – Lập kế hoạch tài chính nghỉ hưu',
    seoH1: 'Retirement Calculator – Tính toán quỹ hưu trí & Tuổi nghỉ hưu an nhàn',
    description: 'Dự báo quỹ hưu trí dựa trên độ tuổi hiện tại, tuổi nghỉ hưu mong muốn, mức chi tiêu dự kiến và tỉ lệ lạm phát.',
    formulaDescription: 'Tích lũy tài sản đầu tư trừ đi lạm phát hàng năm đến tuổi nghỉ hưu.',
    formulaEquation: 'FV = PV(1+r)ⁿ + PMT[((1+r)ⁿ - 1)/r]',
    usageSteps: [
      'Nhập độ tuổi hiện tại và độ tuổi bạn muốn nghỉ hưu.',
      'Nhập số tiền tiết kiệm hiện có và khoản đóng góp hàng tháng.',
      'Xem đồ thị tăng trưởng quỹ tài chính đến ngày về hưu.'
    ],
    faqs: [
      {
        question: 'Quy tắc 4% khi nghỉ hưu là gì?',
        answer: 'Quy tắc 4% cho rằng bạn có thể rút 4% tổng danh mục đầu tư trong năm đầu nghỉ hưu (và điều chỉnh theo lạm phát sau đó) mà không sợ cạn kiệt tài sản trong 30 năm.'
      }
    ],
    relatedToolIds: ['investment', 'inflation', 'compound']
  },
  amortization: {
    id: 'amortization',
    category: 'financial',
    name: 'Bảng lịch trả nợ & Khấu hao',
    shortName: 'Lịch trả nợ',
    tierNumber: 3,
    iconName: 'LineChart',
    seoTitle: 'Amortization Calculator – Lịch trình trả nợ chi tiết',
    seoH1: 'Amortization Calculator – Bảng phân bổ nợ gốc & Lãi suất từng kỳ',
    description: 'Tạo bảng chi tiết phân bổ từng kỳ trả nợ (gốc, lãi, dư nợ còn lại), hỗ trợ xuất file và phân tích trả nợ trước hạn.',
    formulaDescription: 'Tách biệt phần lãi tính trên dư nợ còn lại và phần gốc giảm dần theo từng tháng.',
    formulaEquation: 'Interest = Balance × r; Principal = PMT - Interest',
    usageSteps: [
      'Nhập số tiền vay, lãi suất hàng năm và thời hạn vay.',
      'Xem bảng khấu hao chi tiết theo tháng hoặc năm.',
      'Tùy chọn nhập thêm khoản thanh toán trước hạn để xem số tiền lãi tiết kiệm được.'
    ],
    faqs: [
      {
        question: 'Trả thêm gốc hàng tháng có giúp giảm lãi nhiều không?',
        answer: 'Rất nhiều, vì phần trả thêm trực tiếp trừ vào gốc ban đầu, làm giảm lãi suất của tất cả các kỳ tiếp theo.'
      }
    ],
    relatedToolIds: ['mortgage', 'loan', 'payment']
  },
  investment: {
    id: 'investment',
    category: 'financial',
    name: 'Dự phóng lợi nhuận đầu tư',
    shortName: 'Đầu tư sinh lời',
    tierNumber: 3,
    iconName: 'TrendingUp',
    seoTitle: 'Investment Calculator – Tính toán lợi nhuận đầu tư & ROI',
    seoH1: 'Investment Calculator – Dự phóng tăng trưởng danh mục tài chính',
    description: 'Mô phỏng sự gia tăng giá trị của danh mục đầu tư với đóng góp định kỳ hàng tháng, tái đầu tư cổ tức và thuế phí.',
    formulaDescription: 'Dự báo tăng trưởng tích lũy: FV = P(1+r)^t + PMT × [((1+r)^t - 1) / r].',
    formulaEquation: 'ROI = (Ending Value - Starting Value) / Starting Value × 100%',
    usageSteps: [
      'Nhập vốn khởi điểm và số tiền đầu tư thêm hàng tháng/quý.',
      'Nhập tỷ suất sinh lời kỳ vọng trung bình hàng năm.',
      'Quan sát biểu đồ lợi nhuận kép qua thời gian.'
    ],
    faqs: [
      {
        question: 'Tỷ suất sinh lời kỳ vọng trung bình của thị trường chứng khoán là bao nhiêu?',
        answer: 'Trong dài hạn, chỉ số S&P 500 hoặc VN-Index mang lại mức sinh lời trung bình danh nghĩa từ 8% đến 12%/năm.'
      }
    ],
    relatedToolIds: ['compound', 'retirement', 'inflation']
  },
  inflation: {
    id: 'inflation',
    category: 'financial',
    name: 'Tính lạm phát & Sức mua',
    shortName: 'Lạm phát & Sức mua',
    tierNumber: 3,
    iconName: 'TrendingUp',
    seoTitle: 'Inflation Calculator – Tính toán tác động của lạm phát',
    seoH1: 'Inflation Calculator – Đo lường sự mất giá của tiền tệ & Sức mua',
    description: 'Đo lường sự sụt giảm sức mua của đồng tiền theo thời gian và tính toán số tiền tương đương trong tương lai.',
    formulaDescription: 'Giá trị tương đương: FV = PV × (1 + i)^n.',
    formulaEquation: 'Purchasing Power = PV / (1 + i)ⁿ',
    usageSteps: [
      'Nhập số tiền hiện tại và tỷ lệ lạm phát hàng năm dự kiến.',
      'Nhập số năm trong tương lai.',
      'Xem giá trị thực tế sau khi điều chỉnh theo lạm phát.'
    ],
    faqs: [
      {
        question: 'Tỷ lệ lạm phát hàng năm thường rơi vào khoảng nào?',
        answer: 'Các ngân hàng trung ương thường đặt mục tiêu lạm phát ổn định quanh mức 2% đến 4% mỗi năm.'
      }
    ],
    relatedToolIds: ['investment', 'retirement', 'finance']
  },
  finance: {
    id: 'finance',
    category: 'financial',
    name: 'Máy tính tài chính tổng hợp',
    shortName: 'Tài chính tổng hợp',
    tierNumber: 3,
    iconName: 'BarChart3',
    seoTitle: 'Finance Calculator – Máy tính tài chính tổng hợp TVM',
    seoH1: 'Finance Calculator – Giải phương trình giá trị thời gian của tiền (TVM)',
    description: 'Giải các biến số tài chính TVM (PV, FV, PMT, N, I/Y) chuyên nghiệp phục vụ phân tích đầu tư và tín dụng.',
    formulaDescription: 'PV + PMT × [(1 - (1+i)^-n) / i] + FV × (1+i)^-n = 0.',
    formulaEquation: 'Time Value of Money (TVM)',
    usageSteps: [
      'Nhập 4 trong 5 tham số của phương trình TVM.',
      'Nhấn nút tính biến số còn lại để tìm kết quả tức thì.'
    ],
    faqs: [
      {
        question: 'TVM là gì trong tài chính?',
        answer: 'TVM (Time Value of Money) là nguyên lý cốt lõi khẳng định rằng một đồng tiền ở hiện tại có giá trị cao hơn một đồng tiền trong tương lai.'
      }
    ],
    relatedToolIds: ['investment', 'loan', 'compound']
  },
  lottery: {
    id: 'lottery',
    category: 'financial',
    name: 'Xác suất Xổ số & Powerball',
    shortName: 'Xổ số & Jackpot',
    tierNumber: 2,
    iconName: 'Ticket',
    seoTitle: 'US Lottery Calculator – Tính xác suất, kỳ vọng toán học EV & mô phỏng Powerball / Mega Millions',
    seoH1: 'Lottery Odds & Simulation Calculator – Mô phỏng bao số & giá trị kỳ vọng sau thuế',
    description: 'Tính toán xác suất trúng giải độc đắc, giá trị kỳ vọng (Expected Value - EV) sau thuế liên bang, và mô phỏng đánh bao số (Wheeling system) chuyên nghiệp.',
    formulaDescription: 'Xác suất trúng độc đắc: P = 1 / [C(N, k) × C(M, 1)]. Kỳ vọng EV = ∑(Pi × Prize_i) - Ticket_Price.',
    formulaEquation: 'EV = ∑(P_i × NetPrize_i) - Cost',
    usageSteps: [
      'Chọn giải xổ số (Powerball, Mega Millions hoặc tùy chỉnh).',
      'Nhập số vé mua hoặc ngân sách dự chi.',
      'Xem xác suất trúng giải, so sánh với các biến cố thực tế và chạy mô phỏng ngẫu nhiên.'
    ],
    faqs: [
      {
        question: 'Xác suất trúng giải Jackpot của Powerball là bao nhiêu?',
        answer: 'Tỷ lệ trúng giải độc đắc Powerball là 1 trên 292.201.338 vé, tương đương khoảng 0.000000342%.'
      }
    ],
    relatedToolIds: ['probability', 'statistics', 'investment']
  },
  bmr: {
    id: 'bmr',
    category: 'fitness',
    name: 'Tỷ lệ trao đổi chất (BMR)',
    shortName: 'Tỷ lệ BMR',
    tierNumber: 2,
    iconName: 'Flame',
    seoTitle: 'BMR Calculator – Tính tỷ lệ trao đổi chất cơ bản',
    seoH1: 'BMR Calculator – Lượng calo tiêu hao tối thiểu duy trì sự sống',
    description: 'Xác định lượng calo tối thiểu mà cơ thể bạn đốt cháy khi ở trạng thái nghỉ ngơi hoàn toàn theo phương trình Mifflin-St Jeor.',
    formulaDescription: 'Nam: 10W + 6.25H - 5A + 5. Nữ: 10W + 6.25H - 5A - 161.',
    formulaEquation: 'BMR = 10 × W (kg) + 6.25 × H (cm) - 5 × Age ± Constant',
    usageSteps: [
      'Chọn giới tính, độ tuổi, chiều cao và cân nặng của bạn.',
      'Xem chỉ số BMR và gợi ý calo theo các mức độ vận động.'
    ],
    faqs: [
      {
        question: 'Có nên ăn dưới mức BMR khi giảm cân không?',
        answer: 'Không nên ăn dưới mức BMR vì sẽ khiến cơ thể rơi vào trạng thái sinh tồn, làm chậm trao đổi chất và mất cơ bắp.'
      }
    ],
    relatedToolIds: ['calorie', 'bmi', 'bodyfat']
  },
  idealweight: {
    id: 'idealweight',
    category: 'fitness',
    name: 'Tính cân nặng lý tưởng',
    shortName: 'Cân nặng lý tưởng',
    tierNumber: 2,
    iconName: 'Scale',
    seoTitle: 'Ideal Weight Calculator – Tính cân nặng chuẩn theo chiều cao',
    seoH1: 'Ideal Weight Calculator – So sánh các công thức Devine, Robinson, Miller',
    description: 'Tính dải cân nặng lý tưởng cho sức khỏe và vóc dáng theo 4 công thức y khoa phổ biến thế giới.',
    formulaDescription: 'Công thức Devine: Nam = 50kg + 2.3kg mỗi inch trên 5 feet. Nữ = 45.5kg + 2.3kg.',
    formulaEquation: 'Ideal Weight = Standard Weight (Height, Gender, Frame)',
    usageSteps: [
      'Chọn giới tính và nhập chiều cao của bạn.',
      'Xem bảng so sánh cân nặng tối ưu theo các chuẩn y học.'
    ],
    faqs: [
      {
        question: 'Công thức nào được bác sĩ sử dụng phổ biến nhất?',
        answer: 'Công thức Devine là công thức được sử dụng rộng rãi nhất trong y khoa lâm sàng để kê đơn liều lượng thuốc.'
      }
    ],
    relatedToolIds: ['bmi', 'calorie', 'bodyfat']
  },
  healthyweight: {
    id: 'healthyweight',
    category: 'fitness',
    name: 'Tính cân nặng khỏe mạnh',
    shortName: 'Cân nặng khỏe mạnh',
    tierNumber: 2,
    iconName: 'Heart',
    seoTitle: 'Healthy Weight Calculator – Dải cân nặng tối ưu theo tiêu chuẩn WHO',
    seoH1: 'Healthy Weight Calculator – Tính khoảng cân nặng an toàn phòng ngừa tim mạch',
    description: 'Xác định dải cân nặng lành mạnh tối ưu cho chiều cao của bạn theo tiêu chuẩn khuyến nghị của Tổ chức Y tế Thế giới (WHO BMI 18.5 - 24.9).',
    formulaDescription: 'Dải cân nặng khuyến nghị: W_min = 18.5 × Chiều cao (m)², W_max = 24.9 × Chiều cao (m)², W_mid = 21.7 × Chiều cao (m)²',
    formulaEquation: 'Healthy Range = [18.5 × H², 24.9 × H²]',
    usageSteps: [
      'Nhập chiều cao và cân nặng hiện tại của bạn.',
      'Xem dải cân nặng lý tưởng tối ưu và lượng cân cần tăng hoặc giảm để đạt mức chuẩn.'
    ],
    faqs: [
      {
        question: 'Chỉ số BMI chuẩn cho người trưởng thành là bao nhiêu?',
        answer: 'Theo WHO, chỉ số BMI từ 18.5 đến 24.9 được xem là cân nặng bình thường và khỏe mạnh nhất cho tim mạch và tuổi thọ.'
      }
    ],
    relatedToolIds: ['bmi', 'idealweight', 'calorie']
  },
  pregnancy: {
    id: 'pregnancy',
    category: 'fitness',
    name: 'Dự đoán ngày sinh & Thai kỳ',
    shortName: 'Thai kỳ & Dự sinh',
    tierNumber: 2,
    iconName: 'Baby',
    seoTitle: 'Pregnancy Calculator – Tính ngày dự sinh & Tuổi thai nhi',
    seoH1: 'Pregnancy Calculator – Lịch trình phát triển thai kỳ theo tuần',
    description: 'Xác định ngày dự sinh, tuổi thai chính xác theo kỳ kinh cuối hoặc ngày thụ thai theo quy tắc Naegele.',
    formulaDescription: 'Quy tắc Naegele: Ngày dự sinh = Ngày đầu kỳ kinh cuối + 280 ngày (40 tuần).',
    formulaEquation: 'EDD = LMP + 280 days',
    usageSteps: [
      'Chọn ngày đầu tiên của kỳ kinh nguyệt cuối cùng (LMP).',
      'Nhập độ dài chu kỳ kinh trung bình (mặc định 28 ngày).',
      'Xem ngày dự sinh và các mốc tam cá nguyệt quan trọng.'
    ],
    faqs: [
      {
        question: 'Có bao nhiêu phần trăm em bé sinh đúng ngày dự sinh?',
        answer: 'Chỉ khoảng 4% - 5% trẻ sinh đúng ngày dự sinh chính xác, đa số sinh trong khoảng từ 37 đến 42 tuần thai.'
      }
    ],
    relatedToolIds: ['ovulation', 'time', 'date']
  },
  armybodyfat: {
    id: 'armybodyfat',
    category: 'fitness',
    name: 'Tỷ lệ mỡ Quân đội (US Navy)',
    shortName: 'Mỡ cơ thể Quân đội',
    tierNumber: 2,
    iconName: 'ShieldCheck',
    seoTitle: 'Army Body Fat Calculator – Chuẩn đo mỡ cơ thể quân đội Mỹ',
    seoH1: 'Army Body Fat Calculator – Tiêu chuẩn US Army Tape Test',
    description: 'Đánh giá tỷ lệ phần trăm mỡ cơ thể theo phương pháp đo thước dây chuẩn quân đội Hoa Kỳ (Department of Defense).',
    formulaDescription: 'Công thức dựa trên số đo vòng cổ, vòng eo, chiều cao (và vòng mông đối với nữ).',
    formulaEquation: '% Fat = 86.010 × log₁₀(abdomen - neck) - 70.041 × log₁₀(height) + 36.76',
    usageSteps: [
      'Đo vòng cổ, vòng eo (và vòng hông nếu là nữ) tính bằng cm.',
      'Nhập chiều cao và giới tính để kiểm tra xem có vượt chuẩn quân đội không.'
    ],
    faqs: [
      {
        question: 'Đo thước dây quân đội có chính xác không?',
        answer: 'Phương pháp này có độ chính xác sai số chỉ từ 1% đến 3% so với phương pháp đo thủy tĩnh (DEXA scan).'
      }
    ],
    relatedToolIds: ['bodyfat', 'bmi', 'idealweight']
  },
  fraction: {
    id: 'fraction',
    category: 'math',
    name: 'Máy tính phân số',
    shortName: 'Phân số',
    tierNumber: 1,
    iconName: 'Divide',
    seoTitle: 'Fraction Calculator – Cộng, trừ, nhân, chia phân số',
    seoH1: 'Fraction Calculator – Rút gọn phân số & Hỗn số từng bước',
    description: 'Thực hiện các phép tính phân số phức tạp (+, -, ×, ÷), quy đồng mẫu số và rút gọn phân số về dạng tối giản kèm lời giải chi tiết.',
    formulaDescription: 'Cộng: a/b + c/d = (ad + bc)/bd. Nhân: a/b × c/d = ac/bd.',
    formulaEquation: 'a/b ± c/d = (a·d ± b·c) / (b·d)',
    usageSteps: [
      'Nhập tử số và mẫu số của phân số thứ nhất.',
      'Chọn phép toán (+, -, ×, ÷) và nhập phân số thứ hai.',
      'Nhận kết quả phân số tối giản kèm hỗn số và số thập phân.'
    ],
    faqs: [
      {
        question: 'Công cụ có xử lý hỗn số (Mixed Numbers) được không?',
        answer: 'Có, bạn có thể nhập hỗn số và công cụ sẽ tự động chuyển đổi sang phân số tối giản.'
      }
    ],
    relatedToolIds: ['basic', 'percentage', 'average']
  },
  triangle: {
    id: 'triangle',
    category: 'geometry',
    name: 'Giải tam giác tổng quát',
    shortName: 'Tam giác',
    tierNumber: 2,
    iconName: 'Triangle',
    seoTitle: 'Triangle Calculator – Tính chu vi, diện tích và các góc tam giác',
    seoH1: 'Triangle Calculator – Giải tam giác theo định lý Sin, Cosin & Heron',
    description: 'Giải mọi bài toán tam giác khi biết 3 cạnh (SSS), 2 cạnh 1 góc (SAS), hoặc 1 cạnh 2 góc (ASA), tự động tính diện tích, chiều cao, bán kính nội/ngoại tiếp.',
    formulaDescription: 'Công thức Heron: S = √[p(p-a)(p-b)(p-c)] với nửa chu vi p = (a+b+c)/2.',
    formulaEquation: 'Area = ½ × a × b × sin(C)',
    usageSteps: [
      'Nhập 3 thông số bất kỳ (ít nhất 1 cạnh).',
      'Hệ thống tự động dựng hình và tính các cạnh, góc, diện tích còn lại.'
    ],
    faqs: [
      {
        question: 'Điều kiện 3 cạnh tạo thành một tam giác là gì?',
        answer: 'Tổng độ dài 2 cạnh bất kỳ luôn phải lớn hơn độ dài cạnh còn lại (Bất đẳng thức tam giác).'
      }
    ],
    relatedToolIds: ['righttriangle', 'area', 'trigonometry']
  },
  standarddeviation: {
    id: 'standarddeviation',
    category: 'math',
    name: 'Độ lệch chuẩn & Phương sai',
    shortName: 'Độ lệch chuẩn',
    tierNumber: 2,
    iconName: 'BarChart3',
    seoTitle: 'Standard Deviation Calculator – Tính độ lệch chuẩn & Phương sai',
    seoH1: 'Standard Deviation Calculator – Phân tích thống kê mẫu & Tổng thể',
    description: 'Tính toán nhanh độ lệch chuẩn mẫu (s), độ lệch chuẩn tổng thể (σ), phương sai và giá trị trung bình từ tập dữ liệu.',
    formulaDescription: 'σ = √[ Σ(x - μ)² / N ] cho tổng thể; s = √[ Σ(x - x̄)² / (n - 1) ] cho mẫu.',
    formulaEquation: 's = √[ (1/(n-1)) × Σ(xᵢ - x̄)² ]',
    usageSteps: [
      'Nhập danh sách các số, phân tách bằng dấu phẩy hoặc khoảng trắng.',
      'Chọn kiểu mẫu (Sample) hoặc tổng thể (Population).',
      'Xem bảng kết quả độ lệch chuẩn, phương sai, tổng và trung bình.'
    ],
    faqs: [
      {
        question: 'Khi nào nên dùng độ lệch chuẩn mẫu (n - 1)?',
        answer: 'Dùng mẫu khi bạn thu thập số liệu đại diện từ một nhóm nhỏ để suy diễn ra toàn bộ tập hợp lớn hơn (hiệu chỉnh Bessel).'
      }
    ],
    relatedToolIds: ['statistics', 'average', 'meanmedianmode']
  },
  average: {
    id: 'average',
    category: 'math',
    name: 'Tính số trung bình',
    shortName: 'Số trung bình',
    tierNumber: 1,
    iconName: 'Calculator',
    seoTitle: 'Average Calculator – Tính trung bình cộng & Trung bình có trọng số',
    seoH1: 'Average Calculator – Tính điểm trung bình và giá trị trung bình dãy số',
    description: 'Tính trung bình cộng số học (Arithmetic Mean), trung bình hình học (Geometric Mean) và trung bình điều hòa (Harmonic Mean).',
    formulaDescription: 'Trung bình cộng: x̄ = (x₁ + x₂ + ... + xₙ) / n.',
    formulaEquation: 'Average = (Σ xᵢ) / n',
    usageSteps: [
      'Nhập danh sách số cần tính trung bình.',
      'Xem trung bình số học, tổng và số lượng phần tử tức thì.'
    ],
    faqs: [
      {
        question: 'Làm thế nào để tính điểm trung bình môn có hệ số?',
        answer: 'Bạn có thể sử dụng công cụ GPA Calculator hoặc tính tổng (Điểm × Hệ số) chia cho tổng hệ số.'
      }
    ],
    relatedToolIds: ['meanmedianmode', 'statistics', 'gpa']
  },
  meanmedianmode: {
    id: 'meanmedianmode',
    category: 'math',
    name: 'Trung bình, Trung vị, Yếu vị (Mốt)',
    shortName: 'Trung bình & Trung vị',
    tierNumber: 2,
    iconName: 'BarChart3',
    seoTitle: 'Mean Median Mode Calculator – Tìm số trung bình, trung vị và mốt',
    seoH1: 'Mean Median Mode Calculator – Thống kê mô tả tập dữ liệu trực quan',
    description: 'Xác định số trung bình (Mean), số trung vị (Median), số xuất hiện nhiều nhất (Mode) và khoảng biến thiên (Range) của dãy số.',
    formulaDescription: 'Median: giá trị ở giữa của dãy số đã sắp xếp. Mode: giá trị có tần số xuất hiện cao nhất.',
    formulaEquation: 'Mean, Median, Mode, Range',
    usageSteps: [
      'Nhập dãy số phân tách bởi dấu phẩy.',
      'Xem bảng phân tích chi tiết các chỉ số thống kê mô tả.'
    ],
    faqs: [
      {
        question: 'Tập dữ liệu có thể có nhiều hơn 1 mốt (Mode) không?',
        answer: 'Có, một tập dữ liệu có thể có 1 mốt (unimodal), 2 mốt (bimodal) hoặc đa mốt (multimodal).'
      }
    ],
    relatedToolIds: ['average', 'statistics', 'standarddeviation']
  },
  root: {
    id: 'root',
    category: 'math',
    name: 'Tính căn bậc n & Căn thức',
    shortName: 'Căn thức',
    tierNumber: 1,
    iconName: 'Radical',
    seoTitle: 'Root Calculator – Tính căn bậc 2, căn bậc 3, căn bậc n',
    seoH1: 'Root Calculator – Khai căn số học & Rút gọn căn thức chính xác',
    description: 'Khai căn bậc hai (√), căn bậc ba (∛) hoặc căn bậc n bất kỳ của một số thực với độ chính xác cao.',
    formulaDescription: 'ⁿ√x = x^(1/n). Khai căn bậc n của số x.',
    formulaEquation: 'ⁿ√x = r ⟺ rⁿ = x',
    usageSteps: [
      'Nhập bậc căn n (mặc định là 2 cho căn bậc hai).',
      'Nhập số dưới dấu căn và nhận kết quả tức thì.'
    ],
    faqs: [
      {
        question: 'Có thể tính căn bậc hai của số âm không?',
        answer: 'Trong tập số thực ℝ không tồn tại căn bậc chẵn của số âm; trong tập số phức ℂ kết quả sẽ có phần ảo i.'
      }
    ],
    relatedToolIds: ['exponent', 'basic', 'log']
  },
  exponent: {
    id: 'exponent',
    category: 'math',
    name: 'Tính lũy thừa & Số mũ',
    shortName: 'Lũy thừa',
    tierNumber: 1,
    iconName: 'Superscript',
    seoTitle: 'Exponent Calculator – Tính lũy thừa số mũ (xʸ)',
    seoH1: 'Exponent Calculator – Nâng lên số mũ nguyên, phân số và số âm',
    description: 'Tính toán giá trị lũy thừa xⁿ với cơ số và số mũ bất kỳ, hỗ trợ số mũ âm và phân số thập phân.',
    formulaDescription: 'xⁿ = x × x × ... × x (n lần). Số mũ âm: x⁻ⁿ = 1 / xⁿ.',
    formulaEquation: 'xʸ = exp(y × ln(x))',
    usageSteps: [
      'Nhập cơ số x và số mũ y.',
      'Xem kết quả dạng số thập phân hoặc ký hiệu khoa học E.'
    ],
    faqs: [
      {
        question: 'Bất kỳ số nào mũ 0 cũng bằng 1 đúng không?',
        answer: 'Đúng, với mọi x ≠ 0 thì x⁰ = 1. Riêng 0⁰ là dạng vô định trong toán học.'
      }
    ],
    relatedToolIds: ['root', 'log', 'basic']
  },
  log: {
    id: 'log',
    category: 'math',
    name: 'Tính logarit (Log / Ln)',
    shortName: 'Logarit',
    tierNumber: 1,
    iconName: 'Binary',
    seoTitle: 'Log Calculator – Tính logarit cơ số 10, e, 2, và cơ số tùy chọn',
    seoH1: 'Log Calculator – Logarit thập phân (log), tự nhiên (ln), nhị phân (log2)',
    description: 'Tính toán giá trị logarit với cơ số bất kỳ log_b(x), đổi cơ số logarit và giải phương trình logarit.',
    formulaDescription: 'log_b(x) = y ⟺ b^y = x. Đổi cơ số: log_b(x) = ln(x) / ln(b).',
    formulaEquation: 'log_b(x) = ln(x) / ln(b)',
    usageSteps: [
      'Chọn cơ số: e (ln), 10 (log), 2 (log2) hoặc nhập cơ số tùy chọn.',
      'Nhập giá trị x (x > 0) để nhận kết quả.'
    ],
    faqs: [
      {
        question: 'Tại sao x trong log(x) phải lớn hơn 0?',
        answer: 'Vì không có số dương nào khi nâng lên số mũ thực lại cho kết quả bằng 0 hoặc âm.'
      }
    ],
    relatedToolIds: ['exponent', 'root', 'basic']
  },
  quadratic: {
    id: 'quadratic',
    category: 'math',
    name: 'Phương trình bậc 2 & Parabol',
    shortName: 'Phương trình bậc 2',
    tierNumber: 2,
    iconName: 'Variable',
    seoTitle: 'Quadratic Calculator – Giải phương trình bậc 2 (ax² + bx + c = 0)',
    seoH1: 'Quadratic Calculator – Tìm nghiệm, biệt thức Delta & Vẽ đồ thị Parabol',
    description: 'Giải phương trình bậc hai từng bước chi tiết, tính biệt thức Delta (Δ), nghiệm thực hoặc nghiệm phức, tọa độ đỉnh parabol.',
    formulaDescription: 'Δ = b² - 4ac. Nghiệm x = (-b ± √Δ) / 2a.',
    formulaEquation: 'x = (-b ± √(b² - 4ac)) / (2a)',
    usageSteps: [
      'Nhập 3 hệ số a, b, c (a ≠ 0).',
      'Xem giá trị Delta (Δ) và các bước giải chi tiết từng nghiệm.'
    ],
    faqs: [
      {
        question: 'Khi nào phương trình bậc 2 có nghiệm kép?',
        answer: 'Khi biệt thức Delta (Δ) = 0, phương trình có nghiệm kép x₁ = x₂ = -b / (2a).'
      }
    ],
    relatedToolIds: ['slope', 'graphing', 'basic']
  },
  slope: {
    id: 'slope',
    category: 'math',
    name: 'Độ dốc & Hệ số góc đường thẳng',
    shortName: 'Độ dốc & Hệ số góc',
    tierNumber: 2,
    iconName: 'TrendingUp',
    seoTitle: 'Slope Calculator – Tính độ dốc đường thẳng & Góc nghiêng',
    seoH1: 'Slope Calculator – Tính hệ số góc m từ 2 tọa độ (x1, y1) và (x2, y2)',
    description: 'Xác định hệ số góc (m), phương trình đường thẳng y = mx + b, khoảng cách 2 điểm và góc nghiêng của đường thẳng.',
    formulaDescription: 'm = (y₂ - y₁) / (x₂ - x₁). Góc nghiêng θ = arctan(m).',
    formulaEquation: 'm = (Δy) / (Δx) = (y₂ - y₁) / (x₂ - x₁)',
    usageSteps: [
      'Nhập tọa độ điểm thứ nhất (x₁, y₁).',
      'Nhập tọa độ điểm thứ hai (x₂, y₂).',
      'Xem độ dốc, phương trình đường thẳng và khoảng cách Euclid.'
    ],
    faqs: [
      {
        question: 'Độ dốc của đường thẳng thẳng đứng bằng bao nhiêu?',
        answer: 'Đường thẳng thẳng đứng có độ dốc không xác định (Undefined) vì x₂ - x₁ = 0 (phép chia cho 0).'
      }
    ],
    relatedToolIds: ['quadratic', 'triangle', 'righttriangle']
  },
  area: {
    id: 'area',
    category: 'geometry',
    name: 'Tính diện tích hình học',
    shortName: 'Diện tích hình học',
    tierNumber: 1,
    iconName: 'Square',
    seoTitle: 'Area Calculator – Tính diện tích các hình phẳng',
    seoH1: 'Area Calculator – Công thức diện tích hình tròn, chữ nhật, tam giác, thang',
    description: 'Tính toán diện tích cho tất cả các hình học phẳng thông dụng: hình vuông, chữ nhật, tam giác, hình tròn, hình thang, hình bình hành, elip.',
    formulaDescription: 'Chữ nhật: S = a × b. Tròn: S = π × r². Tam giác: S = ½ × a × h.',
    formulaEquation: 'Area Formulas for 2D Geometric Shapes',
    usageSteps: [
      'Chọn hình học cần tính diện tích.',
      'Nhập các kích thước cạnh hoặc bán kính tương ứng.',
      'Xem kết quả diện tích kèm các đơn vị quy đổi (m², cm², ft², ha).'
    ],
    faqs: [
      {
        question: 'Làm thế nào để đổi m² sang hecta (ha)?',
        answer: '1 hecta (ha) bằng đúng 10,000 mét vuông (m²).'
      }
    ],
    relatedToolIds: ['perimeter', 'volume', 'circle']
  },
  volume: {
    id: 'volume',
    category: 'geometry',
    name: 'Tính thể tích hình khối',
    shortName: 'Thể tích hình khối',
    tierNumber: 2,
    iconName: 'Box',
    seoTitle: 'Volume Calculator – Tính thể tích các hình khối không gian',
    seoH1: 'Volume Calculator – Thể tích hình hộp, hình trụ, hình cầu, hình nón',
    description: 'Tính thể tích và diện tích toàn phần cho các khối 3D: hình lập phương, hình hộp chữ nhật, hình trụ tròn, hình cầu, hình nón, hình chóp.',
    formulaDescription: 'Hộp: V = a × b × c. Trụ: V = π × r² × h. Cầu: V = 4/3 × π × r³.',
    formulaEquation: 'Volume Formulas for 3D Polyhedrons & Solids',
    usageSteps: [
      'Chọn khối hình không gian cần tính.',
      'Nhập bán kính, chiều cao hoặc các cạnh tương ứng.',
      'Xem kết quả thể tích (m³, lít, gallon) và diện tích bề mặt.'
    ],
    faqs: [
      {
        question: '1 mét khối (m³) bằng bao nhiêu lít nước?',
        answer: '1 mét khối (m³) bằng đúng 1,000 lít nước.'
      }
    ],
    relatedToolIds: ['area', 'concrete', 'perimeter']
  },
  perimeter: {
    id: 'perimeter',
    category: 'geometry',
    name: 'Tính chu vi hình học',
    shortName: 'Chu vi hình học',
    tierNumber: 1,
    iconName: 'CircleDot',
    seoTitle: 'Perimeter Calculator – Tính chu vi các hình học phẳng',
    seoH1: 'Perimeter Calculator – Công thức chu vi hình tròn, tam giác, tứ giác',
    description: 'Tính chu vi của các hình học 2D bao gồm hình tròn (chu vi đường tròn), hình chữ nhật, hình vuông, tam giác, hình thang, hình thoi.',
    formulaDescription: 'Chữ nhật: C = 2(a + b). Tròn: C = 2πr. Tam giác: C = a + b + c.',
    formulaEquation: 'Perimeter = Sum of all boundary lengths',
    usageSteps: [
      'Chọn loại hình học cần tính chu vi.',
      'Nhập các kích thước cạnh tương ứng.',
      'Nhận kết quả độ dài chu vi đường bao.'
    ],
    faqs: [
      {
        question: 'Chu vi hình tròn còn được gọi là gì?',
        answer: 'Chu vi hình tròn trong tiếng Anh gọi là Circumference, được tính bằng công thức C = 2 × π × r.'
      }
    ],
    relatedToolIds: ['area', 'circle', 'triangle']
  },
  circle: {
    id: 'circle',
    category: 'geometry',
    name: 'Tính toán hình tròn',
    shortName: 'Hình tròn',
    tierNumber: 1,
    iconName: 'Circle',
    seoTitle: 'Circle Calculator – Tính diện tích, chu vi và đường kính hình tròn',
    seoH1: 'Circle Calculator – Giải hình tròn từ bán kính r, đường kính d hoặc diện tích',
    description: 'Chỉ cần nhập một thông số bất kỳ (bán kính r, đường kính d, chu vi C, hoặc diện tích A), hệ thống sẽ tự động tính toán tất cả các thông số còn lại.',
    formulaDescription: 'd = 2r. Chu vi C = 2πr. Diện tích A = πr².',
    formulaEquation: 'A = πr² ; C = 2πr ; d = 2r',
    usageSteps: [
      'Nhập bất kỳ một trong 4 giá trị: Bán kính, Đường kính, Chu vi, hoặc Diện tích.',
      'Nhận toàn bộ kết quả còn lại tức thì.'
    ],
    faqs: [
      {
        question: 'Số Pi (π) được làm tròn là bao nhiêu?',
        answer: 'Hệ thống sử dụng hằng số Math.PI chuẩn xác của JavaScript (xấp xỉ 3.141592653589793).'
      }
    ],
    relatedToolIds: ['area', 'perimeter', 'righttriangle']
  },
  righttriangle: {
    id: 'righttriangle',
    category: 'geometry',
    name: 'Giải tam giác vuông',
    shortName: 'Tam giác vuông',
    tierNumber: 1,
    iconName: 'Triangle',
    seoTitle: 'Right Triangle Calculator – Định lý Pythagoras & Lượng giác',
    seoH1: 'Right Triangle Calculator – Tính cạnh huyền c, cạnh góc vuông và các góc',
    description: 'Tính toán nhanh cạnh huyền, các cạnh góc vuông, góc nhọn, chiều cao và diện tích của tam giác vuông bằng định lý Pythagoras và tỉ số lượng giác.',
    formulaDescription: 'Định lý Pytago: c² = a² + b² ⟺ c = √(a² + b²).',
    formulaEquation: 'a² + b² = c²',
    usageSteps: [
      'Nhập 2 cạnh bất kỳ hoặc 1 cạnh và 1 góc nhọn.',
      'Hệ thống tự động giải cạnh huyền, góc và diện tích.'
    ],
    faqs: [
      {
        question: 'Bộ 3 số Pytago kinh điển nhất là gì?',
        answer: 'Bộ 3 số Pytago nguyên phổ biến nhất là 3-4-5, 5-12-13, 8-15-17 và 7-24-25.'
      }
    ],
    relatedToolIds: ['triangle', 'trigonometry', 'area']
  },
  statistics: {
    id: 'statistics',
    category: 'math',
    name: 'Thống kê tổng quát & Mẫu số liệu',
    shortName: 'Thống kê tổng quát',
    tierNumber: 2,
    iconName: 'BarChart3',
    seoTitle: 'Statistics Calculator – Bộ công cụ thống kê số liệu đầy đủ',
    seoH1: 'Statistics Calculator – Tính tổng, trung bình, phương sai, tứ phân vị',
    description: 'Bộ phân tích thống kê toàn diện bao gồm: Trung bình, Trung vị, Mốt, Phương sai, Độ lệch chuẩn, Tứ phân vị (Q1, Q2, Q3), IQR và khoảng giá trị Min/Max.',
    formulaDescription: 'Phân tích thống kê 5 số (Five-number summary) và các tham số phân phối.',
    formulaEquation: 'Descriptive Statistics Engine',
    usageSteps: [
      'Nhập tập dữ liệu số cần phân tích.',
      'Xem bảng tổng hợp tất cả các chỉ số thống kê mô tả cốt lõi.'
    ],
    faqs: [
      {
        question: 'IQR là gì trong phân tích thống kê?',
        answer: 'IQR (Interquartile Range) là khoảng tứ phân vị (Q3 - Q1), phản ánh mức độ phân tán của 50% dữ liệu ở phần trung tâm.'
      }
    ],
    relatedToolIds: ['standarddeviation', 'meanmedianmode', 'average']
  },
  probability: {
    id: 'probability',
    category: 'math',
    name: 'Xác suất & Xổ số Mỹ',
    shortName: 'Xác suất & Xổ số Mỹ',
    tierNumber: 2,
    iconName: 'Dices',
    seoTitle: 'Probability Calculator – Tính xác suất biến cố, Tổ hợp & Xổ số Mỹ Powerball, Mega Millions',
    seoH1: 'Probability Calculator – Tính nPr, nCr, xác suất trúng xổ số Mỹ và đánh bao số',
    description: 'Tính xác suất các biến cố toán học, giải tích tổ hợp nCr/nPr và chuyên trang tính xác suất trúng xổ số Mỹ (Powerball, Mega Millions), chi phí đánh bao số (System Bet), tính giá trị kỳ vọng (EV) và mô phỏng quay thưởng.',
    formulaDescription: 'Xổ số Powerball: C(69, 5) × 26 = 292,201,338 tổ hợp. Đánh bao số: C(M, 5) bộ 5 số.',
    formulaEquation: 'P(Jackpot) = 1 - (1 - 1/N)^k  |  Bao M: C(M, 5) tổ hợp',
    usageSteps: [
      'Chọn tab: Xác suất xổ số Mỹ (Powerball, Mega Millions) hoặc Tổ hợp nCr / nPr truyền thống.',
      'Ở tab Xổ số Mỹ: Chọn nhập theo Số tiền bỏ ra ($ USD) hoặc Đánh Bao Số (Bao 6 đến Bao 20, bao bóng đỏ).',
      'Xem xác suất trúng độc đắc Jackpot, xác suất trúng ít nhất một giải bất kỳ và giá trị kỳ vọng EV.',
      'Bấm Quay Thử Kết Quả để mô phỏng thực tế xem số vé/bao đã chọn trúng được bao nhiêu tiền.'
    ],
    faqs: [
      {
        question: 'Đánh Bao số (System Bet) trong xổ số Mỹ là gì?',
        answer: 'Đánh bao số là chọn nhiều hơn 5 số trắng (ví dụ Bao 7 chọn 7 số tạo ra 21 bộ 5 số, Bao 8 tạo ra 56 bộ 5 số). Nếu các số bạn chọn trùng với kết quả mở thưởng, bạn sẽ trúng cùng lúc nhiều hạng giải thưởng khác nhau.'
      },
      {
        question: 'Tỷ lệ trúng Jackpot của Powerball và Mega Millions là bao nhiêu?',
        answer: 'Xác suất trúng Jackpot cho 1 vé Powerball là 1 trên 292,201,338 (khoảng 0.000000342%). Đối với Mega Millions là 1 trên 302,575,350.'
      }
    ],
    relatedToolIds: ['random', 'statistics', 'basic']
  },
  graphing: {
    id: 'graphing',
    category: 'math',
    name: 'Vẽ đồ thị F(x) & Parabol',
    shortName: 'Vẽ đồ thị F(x)',
    tierNumber: 1,
    iconName: 'LineChart',
    seoTitle: 'Graphing Calculator – Khảo sát & Vẽ đồ thị hàm số bậc 2, bậc 3, sin, cos, tan',
    seoH1: 'Graphing Calculator – Vẽ đồ thị Parabol, hàm số bậc 3 và sóng lượng giác',
    description: 'Vẽ đồ thị tương tác mọi hàm số toán học: Parabol bậc 2 (ax² + bx + c), hàm bậc 3 (ax³ + bx² + cx + d), hàm lượng giác (sin, cos, tan) và biểu thức tự do f(x) trên hệ trục tọa độ Oxy.',
    formulaDescription: 'Hàm số y = f(x). Khảo sát tập xác định, đạo hàm, cực đại, cực tiểu, nghiệm và điểm uốn.',
    formulaEquation: 'y = f(x) : Parabol ax² + bx + c | Bậc 3 ax³ + bx² + cx + d | sin(x) / cos(x) / tan(x)',
    usageSteps: [
      'Chọn dạng hàm số cần vẽ: Bậc 2, Bậc 3, Lượng giác hoặc nhập hàm số f(x) tự do.',
      'Tùy chỉnh hệ số hoặc gõ trực tiếp biểu thức phương trình.',
      'Tương tác trực tiếp trên đồ thị: rê chuột xem tọa độ (x, y), kéo để di chuyển (Pan) và dùng nút +/- để thu phóng (Zoom).',
      'Mở bảng giá trị để xem bảng tọa độ chi tiết của các điểm.'
    ],
    faqs: [
      {
        question: 'Đồ thị có hiển thị điểm cực đại, cực tiểu và nghiệm không?',
        answer: 'Có! Hệ thống tự động đánh dấu các điểm đặc trưng: Điểm cực đại (màu xanh ngọc), cực tiểu (màu vàng), điểm uốn, nghiệm f(x) = 0 và giao điểm trục tung Oy.'
      },
      {
        question: 'Tôi có thể nhập hàm lượng giác như sin(x) + cos(x) không?',
        answer: 'Có! Bạn có thể chọn tab Nhập Biểu Thức f(x) Tùy Ý và gõ bất kỳ biểu thức nào như sin(x) + cos(x), x^3 - 3*x, 2*sin(2*x),...'
      }
    ],
    relatedToolIds: ['quadratic', 'trigonometry', 'slope', 'basic']
  },
  length: {
    id: 'length',
    category: 'conversion',
    name: 'Chuyển đổi chiều dài',
    shortName: 'Đổi độ dài',
    tierNumber: 1,
    iconName: 'Ruler',
    seoTitle: 'Length Converter – Chuyển đổi mét, km, inch, feet, dặm',
    seoH1: 'Length Converter – Đổi đơn vị độ dài Metric & Imperial tức thì',
    description: 'Chuyển đổi tức thì giữa các đơn vị đo độ dài phổ biến thế giới: mét (m), kilômét (km), xentimét (cm), milimét (mm), inch (in), foot (ft), yard (yd), dặm (mile), hải lý.',
    formulaDescription: '1 inch = 2.54 cm. 1 foot = 0.3048 m. 1 mile = 1.609344 km.',
    formulaEquation: 'Base SI Unit: Meter (m)',
    usageSteps: [
      'Nhập độ dài cần chuyển đổi.',
      'Chọn đơn vị ban đầu và đơn vị đích để nhận kết quả ngay lập tức.'
    ],
    faqs: [
      {
        question: '1 dặm (mile) bằng bao nhiêu kilômét?',
        answer: '1 dặm đường bộ chuẩn quốc tế bằng 1.609344 km.'
      }
    ],
    relatedToolIds: ['unit', 'area', 'volume']
  },
  weight: {
    id: 'weight',
    category: 'conversion',
    name: 'Chuyển đổi cân nặng / Khối lượng',
    shortName: 'Đổi cân nặng',
    tierNumber: 1,
    iconName: 'Weight',
    seoTitle: 'Weight Converter – Quy đổi Kilogram, Gram, Pound (lbs), Ounce',
    seoH1: 'Weight Converter – Chuyển đổi trọng lượng & Khối lượng quốc tế',
    description: 'Quy đổi qua lại chính xác giữa các đơn vị khối lượng: Kilogram (kg), Gram (g), Miligram (mg), Tấn, Pound (lb), Ounce (oz), Carat.',
    formulaDescription: '1 kg = 2.20462 lbs. 1 lb = 16 oz = 453.59237 g.',
    formulaEquation: 'Base SI Unit: Kilogram (kg)',
    usageSteps: [
      'Nhập khối lượng cần quy đổi.',
      'Xem kết quả chuyển đổi trên tất cả các đơn vị cùng một lúc.'
    ],
    faqs: [
      {
        question: '1 pound (lb) bằng bao nhiêu kg?',
        answer: '1 pound (lb) bằng xấp xỉ 0.45359 kg (hoặc 1 kg ≈ 2.20462 lbs).'
      }
    ],
    relatedToolIds: ['unit', 'bmi', 'idealweight']
  },
  temperature: {
    id: 'temperature',
    category: 'conversion',
    name: 'Chuyển đổi nhiệt độ (°C, °F, K)',
    shortName: 'Đổi nhiệt độ',
    tierNumber: 1,
    iconName: 'Thermometer',
    seoTitle: 'Temperature Converter – Chuyển đổi độ C, độ F và độ Kelvin',
    seoH1: 'Temperature Converter – Đổi thang đo nhiệt độ Celsius, Fahrenheit, Kelvin',
    description: 'Chuyển đổi qua lại giữa độ C (Celsius), độ F (Fahrenheit) và độ K (Kelvin) với công thức quy đổi chi tiết.',
    formulaDescription: '°F = (°C × 9/5) + 32. °C = (°F - 32) × 5/9. K = °C + 273.15.',
    formulaEquation: 'T(°F) = T(°C) × 1.8 + 32',
    usageSteps: [
      'Nhập giá trị nhiệt độ vào ô bất kỳ.',
      'Các thang đo còn lại sẽ tự động tính toán tức thì.'
    ],
    faqs: [
      {
        question: 'Ở nhiệt độ nào thì độ C bằng độ F?',
        answer: 'Ở đúng -40 độ thì -40°C = -40°F.'
      }
    ],
    relatedToolIds: ['unit', 'basic', 'time']
  },
  currency: {
    id: 'currency',
    category: 'conversion',
    name: 'Quy đổi tỷ giá ngoại tệ',
    shortName: 'Đổi ngoại tệ',
    tierNumber: 2,
    iconName: 'Coins',
    seoTitle: 'Currency Converter – Chuyển đổi tỷ giá ngoại tệ trực tuyến',
    seoH1: 'Currency Converter – Quy đổi USD, EUR, VND, JPY, GBP mới nhất',
    description: 'Chuyển đổi tiền tệ quốc tế với tỷ giá quy đổi tham khảo cho hơn 30 đồng tiền phổ biến toàn cầu.',
    formulaDescription: 'Target Amount = Source Amount × (Target Rate / Source Rate).',
    formulaEquation: 'Amount_out = Amount_in × Exchange_Rate',
    usageSteps: [
      'Nhập số tiền cần quy đổi.',
      'Chọn đồng tiền nguồn và đồng tiền đích.'
    ],
    faqs: [
      {
        question: 'Tỷ giá ngoại tệ có được cập nhật liên tục không?',
        answer: 'Tỷ giá được cập nhật định kỳ từ các thị trường tài chính quốc tế làm cơ sở tham khảo.'
      }
    ],
    relatedToolIds: ['salary', 'discount', 'tip']
  },
  ipsubnet: {
    id: 'ipsubnet',
    category: 'utility',
    name: 'Phân chia mạng con (IP Subnet)',
    shortName: 'Mạng IP Subnet',
    tierNumber: 2,
    iconName: 'Network',
    seoTitle: 'IP Subnet Calculator – Phân chia dải mạng IPv4 CIDR',
    seoH1: 'IP Subnet Calculator – Tính Subnet Mask, Broadcast IP và Host khả dụng',
    description: 'Công cụ tính toán mạng IPv4, phân tích CIDR (/24, /16...), xác định địa chỉ Network, Broadcast, dải IP Host khả dụng và Subnet Mask.',
    formulaDescription: 'Số lượng host khả dụng: N = 2^(32 - prefix) - 2.',
    formulaEquation: 'Network IP = IP & Subnet_Mask',
    usageSteps: [
      'Nhập địa chỉ IPv4 (ví dụ 192.168.1.1).',
      'Chọn Subnet Mask hoặc ký hiệu CIDR (/24).',
      'Xem thông tin chi tiết về dải mạng và số host.'
    ],
    faqs: [
      {
        question: 'Tại sao phải trừ đi 2 địa chỉ IP trong một dải subnet?',
        answer: 'Vì địa chỉ đầu tiên được dành riêng cho Địa chỉ mạng (Network Address) và địa chỉ cuối cùng dành cho Địa chỉ quảng bá (Broadcast Address).'
      }
    ],
    relatedToolIds: ['password', 'random', 'unit']
  },
};
