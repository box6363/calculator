import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Share2, 
  X, 
  RefreshCw, 
  Send, 
  ExternalLink, 
  Bot, 
  Check, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ToolId } from '../../types';
import { TOOLS_CONFIG } from '../../data/toolsData';
import { AD_CLIENT_ID } from './AdBanner';

interface GeminiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentToolId: ToolId;
  onSelectTool: (id: ToolId) => void;
  initialToolKey?: ToolId;
}

interface CalculatorInsightItem {
  id: ToolId;
  name: string;
  category: string;
  title: string;
  content: string;
}

// Full domain insights covering all 8 calculator tools of this web application
const CALCULATOR_INSIGHTS: Partial<Record<ToolId, CalculatorInsightItem>> = {
  basic: {
    id: 'basic',
    name: 'Máy tính khoa học',
    category: 'MÁY TÍNH KHOA HỌC & ĐẠI SỐ',
    title: 'Máy Tính Khoa Học 10 Cột: Nguyên Lý Số Học & Giải Thuật Chuẩn Xác',
    content: `Giới thiệu chuyên sâu về Máy tính Khoa học & Hàm số đa năng

**Nguyên lý hoạt động:** Thiết bị sử dụng bộ giải thuật toán chuyển đổi biểu thức trung tố sang hậu tố (Shunting-yard Algorithm) kết hợp bộ xử lý số học dấu phẩy động độ chính xác cao IEEE 754. Hệ thống tính toán tức thời thứ tự ưu tiên các phép toán đại số (nhân chia trước, cộng trừ sau, trong ngoặc trước), các hàm lượng giác (Deg/Rad), hàm mũ, căn bậc n và lưu trữ giá trị bộ nhớ đệm (MC, MR, M+, M-).

**Ứng dụng thực tế:**
- **Toán học & Học thuật:** Hỗ trợ học sinh, sinh viên giải nhanh các phương trình toán học, lượng giác, lũy thừa, căn số và số học thực nghiệm.
- **Kỹ thuật & Nghiên cứu:** Phân tích dao động, tính toán điện áp xoay chiều, cơ học kết cấu tải trọng và vật lý ứng dụng.
- **Tài chính & Kinh doanh:** Tính toán nhanh các phép nhân chia tỷ lệ, biên lợi nhuận và phép tính cộng dồn bộ nhớ.

**Mẹo sử dụng chuẩn xác:**
- Sử dụng nút **Ans** để tái sử dụng ngay kết quả phép tính trước đó mà không phải nhập lại.
- Dùng các phím bộ nhớ **M+** và **M-** để cộng dồn hoặc trừ dần các khoản tiền, sau đó nhấn **MR** để gọi ra tổng số.`
  },
  ai: {
    id: 'ai',
    name: 'AI Tool Giải Toán',
    category: 'TRÍ TUỆ NHÂN TẠO & ĐA PHƯƠNG THỨC',
    title: 'Trợ Lý AI Giải Toán Đa Phương Thức: Gemini 3.8 Flash & Xử Lý Tài Liệu',
    content: `Giới thiệu chuyên sâu về AI Tool Giải Toán & Phân tích Đa phương thức:

**Nguyên lý hoạt động:** Ứng dụng mô hình ngôn ngữ lớn đa phương thức Gemini 3.8 Flash tiên tiến từ Google DeepMind. Hệ thống có khả năng tiếp nhận câu hỏi bằng ngôn ngữ tự nhiên, phương trình toán học LaTeX, hình ảnh bài tập chụp từ camera và các tệp tài liệu PDF nhỏ chứa bảng số liệu. Mô hình kết hợp khả năng phân tích thị giác máy tính và suy luận logic để trình bày lời giải chi tiết từng bước (Step-by-Step).

**Ứng dụng thực tế:**
- **Giải bài tập & Đề thi:** Chụp ảnh đề kiểm tra, bài toán hình học, đại số hoặc đề thi thử để nhận hướng dẫn giải chi tiết.
- **Phân tích tài liệu PDF:** Đọc và tóm tắt bảng số liệu, biểu đồ tài chính, báo cáo thống kê từ các tệp PDF nhỏ.
- **Giải thích phương pháp sư phạm:** Không chỉ cho ra đáp số cuối cùng mà còn giải thích bản chất công thức, các định lý liên quan và cách kiểm tra lại kết quả.

**Chính sách hạn mức:**
- Mỗi ngày bạn được cấp **3 lượt hỏi miễn phí**.
- Hạn mức tự động làm mới vào 00:00 hàng ngày.`
  },
  bmi: {
    id: 'bmi',
    name: 'Đo chỉ số BMI',
    category: 'SỨC KHỎE & CHỈ SỐ KHỐI CƠ THỂ',
    title: 'Phân Tích Chỉ Số Khối Cơ Thể BMI: Tiêu Chuẩn WHO & Thể Trạng Châu Á',
    content: `Giới thiệu chuyên sâu về Chỉ số Khối Cơ thể (Body Mass Index - BMI)

**Nguyên lý hoạt động:** Chỉ số BMI được nhà khoa học Adolphe Quetelet đề xuất, tính bằng công thức: BMI = Cân nặng (kg) / [Chiều cao (m)]². Đối với người trưởng thành châu Á (tiêu chuẩn IDI & WPRO), ngưỡng bình thường là 18.5 – 22.9. Từ 23 trở lên là tiền béo phì và trên 25 là béo phì bệnh lý.

**Ứng dụng thực tế:**
- **Đánh giá thể trạng sức khỏe:** Giúp phát hiện sớm tình trạng thiếu dinh dưỡng hoặc nguy cơ tích tụ mỡ thừa nội tạng.
- **Lập kế hoạch ăn uống & Luyện tập:** Dự báo dải cân nặng lý tưởng cho từng chiều cao cụ thể, từ đó thiết lập lượng Calo thâm hụt (Deficit) hoặc thặng dư (Surplus).
- **Phòng chống bệnh chuyển hóa:** Kiểm soát chỉ số BMI ở mức chuẩn giúp giảm 40-60% nguy cơ mắc bệnh tiểu đường type 2, cao huyết áp và xơ vữa động mạch.

**Mẹo sử dụng chuẩn xác:**
- Nên đo cân nặng vào buổi sáng sớm khi thức dậy và sau khi đi vệ sinh để có số liệu chuẩn xác nhất.
- Với vận động viên cử tạ có lượng cơ bắp lớn, nên kết hợp thêm số đo vòng eo để có cái nhìn toàn diện.`
  },
  loan: {
    id: 'loan',
    name: 'Lãi suất vay ngân hàng',
    category: 'TÀI CHÍNH CÁ NHÂN & TÍN DỤNG',
    title: 'Phân Tích Khoản Vay & Lãi Suất: So Sánh Dư Nợ Giảm Dần & Trả Góp Đều (EMI)',
    content: `Giới thiệu chuyên sâu về Cơ chế Tính Lãi Vay & Bảng Sao Kê Trả Nợ

**Nguyên lý hoạt động:** 
- Phương pháp Trả góp đều (EMI): Áp dụng công thức chiết khấu dòng tiền niên kim cố định: EMI = [P × r × (1 + r)ⁿ] / [(1 + r)ⁿ – 1], trong đó P là số tiền gốc, r là lãi suất tháng, n là số tháng vay.
- Phương pháp Dư nợ thực tế giảm dần: Tiền gốc phân bổ đều mỗi tháng, tiền lãi tính trên số nợ còn lại thực tế nên tổng số tiền phải trả giảm dần theo thời gian.

**Ứng dụng thực tế:**
- **Vay mua nhà thế chấp (Mortgage):** Lập kế hoạch dòng tiền tài chính 10 - 25 năm, đảm bảo tỷ lệ nợ trên thu nhập (DTI) an toàn dưới 35%.
- **Vay mua ô tô & Tiêu dùng:** So sánh tổng tiền lãi phải trả giữa gói cố định ban đầu và gói thả nổi theo biên độ ngân hàng.
- **Lập phương án tất toán trước hạn:** Đánh giá số tiền lãi tiết kiệm được khi trả gốc sớm so với mức phí phạt tất toán (thường 1-2%).

**Mẹo sử dụng chuẩn xác:**
- Luôn kiểm tra kỹ lãi suất ưu đãi áp dụng trong bao nhiêu tháng đầu (thường 6-12 tháng) và biên độ thả nổi sau thời gian ưu đãi.`
  },
  salary: {
    id: 'salary',
    name: 'Tính toán tiền lương (Gross - Net)',
    category: 'TIỀN LƯƠNG, BẢO HIỂM & THUẾ THU NHẬP',
    title: 'Phân Tích Lương Gross - Net: Quy Định Đóng Bảo Hiểm & Biểu Thuế TNCN 7 Bậc',
    content: `Giới thiệu chuyên sâu về Cơ Chế Tính Lương Gross sang Net & Net sang Gross

**Nguyên lý hoạt động:**
- **Lương Net thực nhận** = Lương Gross – (BHXH 8% + BHYT 1.5% + BHTN 1%) – Thuế TNCN phải nộp.
- **Biểu thuế suất lũy tiến từng phần:** Thuế TNCN được tính dựa trên Thu nhập tính thuế (TNTT = Thu nhập trước thuế – Giảm trừ gia cảnh bản thân 11 triệu – Giảm trừ người phụ thuộc 4.4 triệu/người).
- **Mức lương cơ sở 2.340.000đ** (Áp dụng từ 01/07/2024 theo NĐ 73/2024/NĐ-CP): Đặt trần tối đa đóng BHXH và BHYT là 20 lần mức lương cơ sở (46.800.000đ/tháng).
- **Trần BHTN:** Bằng 20 lần mức lương tối thiểu vùng theo NĐ 74/2024/NĐ-CP (Vùng 1 là 99.200.000đ).

**Ứng dụng thực tế:**
- **Đàm phán phỏng vấn & Thỏa thuận hợp đồng:** Giúp người lao động quy đổi chính xác mức lương Gross mong muốn sang tiền mặt thực nhận về tài khoản để tránh hiểu lầm khi ký kết hợp đồng.
- **Doanh nghiệp & Phòng Nhân sự (HR):** Hoạch định chuẩn xác Tổng chi phí người sử dụng lao động (bao gồm 21.5% BHXH, BHYT, BHTN công ty đóng và 2% kinh phí công đoàn).
- **Đăng ký người phụ thuộc:** Tối ưu hóa số thuế TNCN phải nộp hợp pháp bằng việc kê khai đầy đủ người phụ thuộc nuôi dưỡng hợp lệ.

**Mẹo sử dụng chuẩn xác:**
- Khi công ty đề xuất mức lương Gross, hãy luôn hỏi rõ mức đóng bảo hiểm là trên toàn bộ lương Gross hay trên mức lương căn bản để tính ra thu nhập Net thực tế chuẩn nhất.`
  },
  age: {
    id: 'age',
    name: 'Tính tuổi & Can Chi',
    category: 'LỊCH PHÁP, THỜI GIAN & CAN CHI',
    title: 'Tính Tuổi Chính Xác Đến Từng Ngày & Phân Tích Bản Mệnh Thiên Can Địa Chi',
    content: `Giới thiệu chuyên sâu về Thuật toán Tính Tuổi & Chu kỳ Lục Thập Hoa Giáp

**Nguyên lý hoạt động:** Thuật toán tính toán hiệu số thời gian giữa ngày sinh và ngày mốc hiện tại, tự động bù trừ các năm nhuận (29/02) và số ngày thực tế của từng tháng dương lịch. Đồng thời, hệ thống đối chiếu chu kỳ 60 năm Lục Thập Hoa Giáp (10 Thiên Can: Giáp, Ất, Bính, Đinh... và 12 Địa Chi: Tý, Sửu, Dần, Mão...) để xác định tuổi Can Chi và cung Hoàng đạo phương Tây.

**Ứng dụng thực tế:**
- **Hồ sơ pháp lý & Thủ tục hành chính:** Xác định chính xác độ tuổi theo ngày tháng năm phục vụ làm thẻ căn cước, nhập học, bảo hiểm xã hội và tuổi hưu trí.
- **Phong thủy & Tử vi bản mệnh:** Tra cứu Thiên Can, Địa Chi, Ngũ hành nạp âm để xem tuổi hợp làm ăn, kết hôn và ngày lành tháng tốt.
- **Kỷ niệm & Cột mốc cuộc đời:** Đếm ngược chính xác số ngày đến sinh nhật tiếp theo và tổng số giờ, phút đã trải qua trong đời.

**Mẹo sử dụng chuẩn xác:**
- Khi tính tuổi Can Chi theo phong thủy cổ truyền, mốc chuyển năm thường bắt đầu từ tiết Lập Xuân (ngày 4 hoặc 5 tháng 2 Dương lịch).`
  },
  percentage: {
    id: 'percentage',
    name: 'Máy tính phần trăm',
    category: 'THƯƠNG MẠI, CHIẾT KHẤU & TỶ LỆ %',
    title: 'Máy Tính Phần Trăm Đa Năng: Tính Chiết Khấu, Tăng Trưởng & Thuế VAT',
    content: `Giới thiệu chuyên sâu về Các Dạng Bài Toán Tỷ Lệ Phần Trăm

**Nguyên lý hoạt động:** Phần trăm (%) biểu thị tỷ lệ tương quan trên cơ sở 100 đơn vị: % = (Giá trị con / Tổng số) × 100. Công cụ xử lý tức thời 4 bài toán thông dụng:
1. Tính X% của một số Y: Kết quả = (X × Y) / 100.
2. Tỷ lệ % của số A so với số B: Kết quả = (A / B) × 100.
3. Phần trăm tăng/giảm: % Thay đổi = [(Mới – Cũ) / Cũ] × 100.
4. Giá sau chiết khấu & Thuế: Giá cuối = Giá gốc × (1 – % Giảm) × (1 + % VAT).

**Ứng dụng thực tế:**
- **Mua sắm & Săn sale:** Tính ngay số tiền thực tế được giảm khi cửa hàng áp dụng chương trình Sale 20%, 30%, 50% và cộng thuế VAT.
- **Báo cáo kinh doanh:** Đo lường tỷ lệ tăng trưởng doanh thu quý, tỷ lệ hoàn thành KPI và tỷ lệ chuyển đổi khách hàng.
- **Đầu tư & Lợi nhuận:** Tính biên lợi nhuận gộp (Gross Margin) và tỷ suất sinh lời trên vốn đầu tư (ROI).

**Mẹo sử dụng chuẩn xác:**
- Khi tăng giá 20% rồi giảm giá 20%, giá tiền cuối cùng sẽ THẤP HƠN giá ban đầu do cơ số tính phần trăm đã thay đổi.`
  },
  unit: {
    id: 'unit',
    name: 'Đổi đơn vị đo lường',
    category: 'QUY ĐỔI ĐƠN VỊ & TỶ GIÁ NGOẠI TỆ',
    title: 'Chuyển Đổi Đơn Vị Đo Lường: Hệ Chuẩn SI, Hệ Anh-Mỹ & Ngoại Tệ Toàn Cầu',
    content: `Giới thiệu chuyên sâu về Hệ Thống Đổi Đơn Vị Đo Lường Đa Dạng

**Nguyên lý hoạt động:** Thuật toán sử dụng cơ chế ma trận quy đổi thông qua Đơn vị cơ sở chuẩn quốc tế (SI Base Unit). Khi chuyển đổi từ đơn vị A sang đơn vị B: Giá trị đích = (Giá trị nguồn × Hệ số A) / Hệ số B. Riêng chuyển đổi nhiệt độ áp dụng công thức bù gốc: °F = (°C × 9/5) + 32, K = °C + 273.15.

**Ứng dụng thực tế:**
- **Kỹ thuật & Xây dựng:** Quy đổi chiều dài (m, cm, inch, feet), diện tích (m², ft², hecta, sào, mẫu) và khối lượng (kg, pound, tấn, tạ).
- **Xuất nhập khẩu & Thương mại:** Tra cứu và quy đổi nhanh các đồng tiền chủ chốt (USD, EUR, JPY, GBP, CNY, VND) theo tỷ giá thời gian thực.
- **Nấu ăn & Đời sống:** Chuyển đổi công thức làm bánh quốc tế từ Fahrenheit (°F) sang Celsius (°C), từ Ounce/Pound sang Gram.

**Mẹo sử dụng chuẩn xác:**
- Có thể tùy chỉnh tỷ giá ngoại tệ trực tiếp trên giao diện để khớp chuẩn xác 100% với tỷ giá niêm yết tại ngân hàng bạn giao dịch.`
  },
  trigonometry: {
    id: 'trigonometry',
    name: 'Máy tính lượng giác',
    category: 'HÌNH HỌC, LƯỢNG GIÁC & GIẢI TAM GIÁC',
    title: 'Máy Tính Lượng Giác & Giải Tam Giác Vuông: Hàm Sin, Cos, Tan & Mô Phỏng',
    content: `Giới thiệu chuyên sâu về Hàm Số Lượng Giác & Hình Học Tam Giác Vuông

**Nguyên lý hoạt động:** Áp dụng các định lý hình học Euclid và định lý Pytago (a² + b² = c²):
- Sin(α) = Cạnh đối / Cạnh huyền
- Cos(α) = Cạnh kề / Cạnh huyền
- Tan(α) = Cạnh đối / Cạnh kề
- Cot(α) = Cạnh kề / Cạnh đối
Công cụ tự động vẽ biểu đồ vector SVG chuẩn tỷ lệ các cạnh và số đo góc theo thời gian thực khi bạn nhập 2 thông số bất kỳ.

**Ứng dụng thực tế:**
- **Trắc địa & Đo đạc công trình:** Ứng dụng đo khoảng cách gián tiếp, tính chiều cao tòa nhà, cây cối và độ dốc mái công trình.
- **Cơ học, Vật lý & Đồ họa:** Phân tích lực thành các thành phần vector Fx, Fy, lập trình chuyển động góc quay 2D/3D.
- **Thiết kế kiến trúc:** Thiết kế bậc cầu thang, độ nghiêng ram dốc tầng hầm và giàn không gian.

**Mẹo sử dụng chuẩn xác:**
- Luôn kiểm tra chế độ góc: Dùng **Degree (°)** cho đo đạc xây dựng thực tế và dùng **Radian (rad)** cho giải tích toán học hàm số.`
  },
  compound: {
    id: 'compound',
    name: 'Tính lãi kép & Tích lũy',
    category: 'ĐẦU TƯ TÀI CHÍNH & NĂNG LƯỢNG CALO',
    title: 'Sức Mạnh Lãi Kép Đầu Tư & Bảng Cân Đối Năng Lượng Calorie TDEE',
    content: `Giới thiệu chuyên sâu về Lãi Kép Tích Lũy Kỳ Quan & Nhu Cầu Năng Lượng TDEE

**Nguyên lý hoạt động:**
- Công thức Lãi kép tích lũy định kỳ: A = P × (1 + r/n)ⁿᵗ + PMT × {[(1 + r/n)ⁿᵗ – 1] / (r/n)}, trong đó P là vốn gốc ban đầu, PMT là số tiền nộp đều mỗi kỳ, r là lãi suất năm, n là số lần ghép lãi/năm, t là số năm đầu tư.
- Công thức Nhu cầu Calo TDEE: Dựa trên công thức Mifflin-St Jeor tính chỉ số BMR (năng lượng tiêu hao cơ bản) nhân với hệ số hoạt động thể chất PAL (1.2 đến 1.9).

**Ứng dụng thực tế:**
- **Tự do tài chính & Hưu trí:** Lập kế hoạch tiết kiệm tích sản định kỳ mỗi tháng vào các quỹ chỉ số (ETF), tận dụng sức mạnh tăng trưởng hàm số mũ của lãi kép sau 10, 20 năm.
- **Kiểm soát cân nặng & Thể hình:** Xác định chính xác lượng calo cần nạp mỗi ngày để giảm mỡ an toàn (thâm hụt 300-500 kcal) hoặc tăng cơ không tăng mỡ thừa.

**Mẹo sử dụng chuẩn xác:**
- Yếu tố quan trọng nhất của lãi kép là **Thời gian (t)**: Bắt đầu đầu tư tích lũy càng sớm thì giá trị tài sản sinh sôi càng khủng khiếp ở giai đoạn nửa sau chu kỳ.`
  },
  mortgage: {
    id: 'mortgage',
    name: 'Vay mua nhà',
    category: 'BẤT ĐỘNG SẢN & THẾ CHẤP',
    title: 'Phân Tích Chi Phí Sở Hữu Nhà & Kế Hoạch Vay Thế Chấp Bất Động Sản',
    content: `Chi tiết về cấu trúc chi phí vay mua nhà trả góp dài hạn:

**Nguyên lý hoạt động:** Khoản thanh toán mua nhà hàng tháng không chỉ bao gồm gốc và lãi (P&I) mà còn có thuế tài sản hàng năm, bảo hiểm cháy nổ/nhà ở và phí dịch vụ quản lý tòa nhà (HOA).

**Mẹo tối ưu:** Áp dụng nguyên tắc tài chính 28/36: Chi phí nhà ở không vượt quá 28% và tổng các khoản nợ không vượt quá 36% tổng thu nhập hàng tháng.`
  },
  calorie: {
    id: 'calorie',
    name: 'Calo & TDEE',
    category: 'DINH DƯỠNG & NĂNG LƯỢNG',
    title: 'Khoa Học Về Nhu Cầu Năng Lượng Hàng Ngày & Phân Bổ Macro',
    content: `Công cụ tính toán năng lượng tiêu thụ TDEE và xây dựng kế hoạch dinh dưỡng:

**Nguyên lý hoạt động:** Dựa trên phương trình Mifflin-St Jeor chuẩn xác nhất hiện nay, tính toán mức chuyển hóa cơ bản (BMR) kết hợp hệ số hoạt động thể lực để tìm ra mức năng lượng cân bằng.

**Mẹo tối ưu:** Giữ mức thâm hụt calo ở mức vừa phải (300 - 500 kcal/ngày) kết hợp nạp đủ 1.6 - 2.2g protein trên mỗi kg cân nặng để bảo toàn tối đa khối lượng cơ bắp.`
  },
  bodyfat: {
    id: 'bodyfat',
    name: 'Tỷ lệ mỡ',
    category: 'THỂ HÌNH & THÀNH PHẦN CƠ THỂ',
    title: 'Đo Lường Tỷ Lệ Mỡ Cơ Thể Chuẩn Hải Quân Hoa Kỳ (US Navy)',
    content: `Phương pháp định lượng phần trăm mỡ cơ thể không xâm lấn:

**Nguyên lý hoạt động:** Sử dụng số đo chu vi vòng cổ, vòng eo và vòng hông theo công thức logarit của Viện nghiên cứu sức khỏe Hải quân Mỹ để ước lượng mật độ cơ thể.

**Mẹo tối ưu:** Luôn đo vào cùng một thời điểm buổi sáng, dùng thước dây mềm kéo vừa khít da không siết chặt để đảm bảo tính nhất quán qua các lần kiểm tra.`
  },
  time: {
    id: 'time',
    name: 'Thời gian',
    category: 'QUẢN LÝ THỜI GIAN & CHẤM CÔNG',
    title: 'Tính Khoảng Cách Thời Gian & Chuyển Đổi Giờ Công Thập Phân',
    content: `Công cụ hỗ trợ quản lý giờ làm việc và cộng trừ thời gian chính xác:

**Nguyên lý hoạt động:** Tính toán độ chênh lệch phút giữa hai mốc giờ, tự động xử lý ca làm việc kéo dài qua nửa đêm (24 giờ) và trừ thời gian nghỉ giữa ca.

**Mẹo tối ưu:** Sử dụng số giờ thập phân tính toán được để nhân trực tiếp với mức lương theo giờ mà không bị sai số phút.`
  },
  date: {
    id: 'date',
    name: 'Ngày tháng',
    category: 'LỊCH & THỜI HẠN DỰ ÁN',
    title: 'Đếm Số Ngày Giữa Hai Mốc Thời Gian & Ngày Làm Việc Thực Tế',
    content: `Công cụ tính toán chu kỳ thời gian và thời hạn hợp đồng:

**Nguyên lý hoạt động:** Chuyển đổi hai mốc ngày thành dấu thời gian chuẩn UTC và tính toán số ngày tuyệt đối, đồng thời duyệt lọc bỏ các ngày Thứ Bảy và Chủ Nhật để ra số ngày làm việc hành chính.

**Mẹo tối ưu:** Giúp các nhà quản lý dự án (PM) và kế toán tính chính xác tiến độ hoàn thành công việc và thời gian trả thưởng.`
  },
  tip: {
    id: 'tip',
    name: 'Tiền Tip',
    category: 'ẨM THỰC & CHI TIÊU XÃ HỘI',
    title: 'Quy Tắc Tiền Boa Quốc Tế & Nghệ Thuật Chia Hóa Đơn Nhóm',
    content: `Tính toán nhanh tiền boa dịch vụ và chia tiền văn minh:

**Nguyên lý hoạt động:** Tính % tiền tip dựa trên tổng tiền trước hoặc sau thuế, sau đó chia đều cho số lượng người tham gia kèm tính năng làm tròn chẵn số tiền.

**Mẹo tối ưu:** Khi đi ăn nhóm, làm tròn số tiền của mỗi người lên con số nguyên gần nhất để dễ dàng thu tiền mặt hoặc chuyển khoản.`
  },
  discount: {
    id: 'discount',
    name: 'Giảm giá',
    category: 'MUA SẮM & KHUYẾN MÃI',
    title: 'Phân Tích Chiết Khấu Kép & Số Tiền Tiết Kiệm Thực Tế',
    content: `Định giá chính xác món hàng trong các đợt siêu sale:

**Nguyên lý hoạt động:** Tính toán giá sau đợt giảm giá đầu tiên, sau đó tiếp tục áp dụng mã voucher giảm giá bổ sung (chiết khấu cộng dồn).

**Mẹo tối ưu:** Luôn so sánh giá cuối cùng phải thanh toán thay vì chỉ nhìn vào con số % giảm giá ấn tượng trên banner quảng cáo.`
  },
  tax: {
    id: 'tax',
    name: 'Thuế TNCN',
    category: 'THUẾ & QUẢN LÝ TÀI CHÍNH',
    title: 'Biểu Thuế Thu Nhập Cá Nhân Lũy Tiến Từng Phần 7 Bậc',
    content: `Ước tính số thuế TNCN phải nộp hàng tháng:

**Nguyên lý hoạt động:** Lấy tổng thu nhập trừ đi các khoản bảo hiểm bắt buộc (10.5%) và giảm trừ gia cảnh (11 triệu cho bản thân, 4.4 triệu cho mỗi người phụ thuộc) để ra thu nhập tính thuế, sau đó áp dụng thuế suất lũy tiến từ 5% đến 35%.

**Mẹo tối ưu:** Đăng ký người phụ thuộc đầy đủ với cơ quan thuế để được áp dụng giảm trừ gia cảnh hợp pháp ngay trong kỳ tính thuế.`
  },
  pace: {
    id: 'pace',
    name: 'Pace chạy bộ',
    category: 'THỂ THAO & ĐIỀU KINH',
    title: 'Tối Ưu Tốc Độ Pace & Chiến Thuật Phân Phối Sức Bền Chạy Bộ',
    content: `Chuyển đổi tốc độ chạy bộ và dự báo thành tích marathon:

**Nguyên lý hoạt động:** Pace là thời gian hoàn thành 1 kilômét (hoặc 1 dặm). Vận tốc km/h = 60 / Pace (phút/km).

**Mẹo tối ưu:** Áp dụng chiến thuật chạy Negative Split (chạy nửa sau nhanh hơn nửa đầu) để duy trì năng lượng và đạt thành tích cá nhân tốt nhất (PB).`
  },
  ovulation: {
    id: 'ovulation',
    name: 'Rụng trứng',
    category: 'SỨC KHỎE SINH SẢN',
    title: 'Xác Định Cửa Sổ Thụ Thai & Chu Kỳ Rụng Trứng Tự Nhiên',
    content: `Theo dõi chu kỳ sinh sản và tối ưu kế hoạch thụ thai:

**Nguyên lý hoạt động:** Rụng trứng thường diễn ra vào khoảng 14 ngày trước kỳ kinh tiếp theo. Tinh trùng có thể tồn tại tới 5 ngày trong tử cung, tạo nên cửa sổ thụ thai 6 ngày vàng.

**Mẹo tối ưu:** Kết hợp đo thân nhiệt cơ bản (BBT) và quan sát chất nhầy cổ tử cung để xác định ngày rụng trứng với độ tin cậy cao nhất.`
  },
  gpa: {
    id: 'gpa',
    name: 'Điểm GPA',
    category: 'HỌC TẬP & ĐẠI HỌC',
    title: 'Hệ Thống Tính Điểm Trung Bình Tích Lũy Thang Điểm 4.0 & 10.0',
    content: `Chuyển đổi điểm chữ thành điểm số tích lũy đại học:

**Nguyên lý hoạt động:** GPA được tính bằng tổng tích số giữa điểm quy đổi của môn học nhân với số tín chỉ của môn đó, chia cho tổng số tín chỉ đăng ký.

**Mẹo tối ưu:** Ưu tiên dồn sức đạt điểm cao ở những môn học có số tín chỉ lớn (3-4 tín chỉ) vì chúng có trọng số ảnh hưởng mạnh nhất đến GPA tổng kết.`
  },
  concrete: {
    id: 'concrete',
    name: 'Bê tông',
    category: 'XÂY DỰNG & VẬT TƯ',
    title: 'Định Mức Cấp Phối Bê Tông & Dự Toán Khối Lượng Thi Công',
    content: `Tính toán thể tích bê tông m³ và số lượng bao xi măng, cát, đá:

**Nguyên lý hoạt động:** Thể tích hình học nhân với hệ số hao hụt vật tư thực tế (5% - 10%) và áp dụng tỷ lệ cấp phối chuẩn mác bê tông M200, M250 hoặc M300.

**Mẹo tối ưu:** Luôn kiểm tra độ sụt của bê tông tươi trước khi đổ và giữ ẩm bảo dưỡng ít nhất 7 ngày sau khi thi công để đạt cường độ chịu lực tối đa.`
  },
  random: {
    id: 'random',
    name: 'Quay số',
    category: 'XÁC SUẤT & THUẬT TOÁN',
    title: 'Tạo Số Ngẫu Nhiên Chuẩn Xác & Thuật Toán Xáo Trộn',
    content: `Công cụ sinh số ngẫu nhiên đồng đều cho quay thưởng và trò chơi:

**Nguyên lý hoạt động:** Sử dụng giải thuật sinh số đồng dư tuyến tính đảm bảo phân phối đều tuyệt đối trên mọi khoảng số [Min, Max] và thuật toán Fisher-Yates để chọn ngẫu nhiên không trùng lặp.

**Mẹo tối ưu:** Thích hợp cho các buổi quay số trúng thưởng minh bạch, chia đội ngẫu nhiên và chơi boardgame.`
  },
  password: {
    id: 'password',
    name: 'Mật khẩu',
    category: 'AN NINH MẠNG & BẢO MẬT',
    title: 'Đo Lường Entropy Bảo Mật & Tạo Mật Khẩu Chống Brute-Force',
    content: `Thiết lập mật khẩu an toàn chuẩn bảo mật quân sự:

**Nguyên lý hoạt động:** Entropy tính bằng số bit ngẫu nhiên dựa trên tập ký tự và độ dài mật khẩu. Mật khẩu trên 80 bit entropy cần hàng triệu năm siêu máy tính mới có thể bẻ khóa.

**Mẹo tối ưu:** Nên sử dụng mật khẩu dài từ 16 ký tự trở lên kết hợp cả 4 nhóm ký tự và không bao giờ dùng chung một mật khẩu cho nhiều tài khoản trực tuyến quan trọng.`
  }
};

export const GeminiDrawer: React.FC<GeminiDrawerProps> = ({
  isOpen,
  onClose,
  currentToolId,
  onSelectTool,
  initialToolKey
}) => {
  const [selectedKey, setSelectedKey] = useState<ToolId>(initialToolKey || currentToolId || 'basic');
  const [customQuestion, setCustomQuestion] = useState('');
  const [dynamicAiContent, setDynamicAiContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync initialToolKey when updated from outside
  useEffect(() => {
    if (initialToolKey) {
      setSelectedKey(initialToolKey);
      setDynamicAiContent(null);
    }
  }, [initialToolKey]);

  // If tool changed from primary app
  useEffect(() => {
    if (!initialToolKey && CALCULATOR_INSIGHTS[currentToolId]) {
      setSelectedKey(currentToolId);
    }
  }, [currentToolId, initialToolKey]);

  const currentInsight = CALCULATOR_INSIGHTS[selectedKey] || CALCULATOR_INSIGHTS.basic;

  // Ask Gemini AI dynamic questions
  const handleFetchAiAnalysis = async (customPrompt?: string) => {
    setIsLoading(true);
    const promptToSend = customPrompt || `Hãy phân tích chuyên sâu, nguyên lý hoạt động và ứng dụng thực tế chuẩn xác nhất của công cụ ${currentInsight.name}. Trình bày bố cục chuyên nghiệp theo cấu trúc: Giới thiệu chuyên sâu, Nguyên lý hoạt động, Ứng dụng thực tế, Mẹo sử dụng chuẩn xác.`;

    try {
      const response = await fetch('/api/gemini/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          toolName: currentInsight.name,
          context: `Người dùng đang xem công cụ tính toán: ${currentInsight.name} (${currentInsight.title})`
        })
      });

      const data = await response.json();
      if (response.ok && data.answer) {
        setDynamicAiContent(data.answer);
      }
    } catch (err) {
      console.error('Lỗi tải phân tích Gemini:', err);
    } finally {
      setIsLoading(false);
      setCustomQuestion('');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Phân tích Gemini AI - ${currentInsight.name}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* BACKDROP SHADOW WHEN DRAWER IS OPEN */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 
        RIGHT SLIDE-OVER DRAWER (Matches user's Image 2):
        Clean Light theme: bg-white, border-slate-200, crisp slate-900 typography
      */}
      <aside
        id="gemini-right-drawer"
        aria-label="Khối phân tích Gemini AI và Quảng cáo"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[500px] md:w-[540px] lg:w-[580px] bg-white border-l border-slate-200 text-slate-800 flex flex-col transition-all duration-300 ease-out transform ${
          isOpen 
            ? 'translate-x-0 shadow-2xl visible pointer-events-auto opacity-100' 
            : 'translate-x-full shadow-none invisible pointer-events-none opacity-0'
        }`}
      >
        {/* 1. Header (Icon hoa mai vàng + Tên công cụ + "✨ Do Gemini tạo" + Nút Share & Close) */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 bg-white border-b border-slate-200/90 shrink-0">
          <div className="flex items-center gap-3">
            {/* Sparkles Yellow Badge Icon matching Image 2 */}
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950/20" />
            </div>
            <div className="leading-tight">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                {currentInsight.name}
              </h2>
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                <span>✨ Do Gemini tạo</span>
              </p>
            </div>
          </div>

          {/* Action buttons (Share & Close) matching Image 2 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title="Chia sẻ phân tích"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Đóng bảng phân tích"
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Horizontal Scrollable Tool/Pills Tags Bar matching Image 2 */}
        <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0 flex items-center gap-2">
          {Object.values(CALCULATOR_INSIGHTS).map((item) => {
            const isActive = item.id === selectedKey;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedKey(item.id);
                  setDynamicAiContent(null);
                  if (TOOLS_CONFIG[item.id]) {
                    onSelectTool(item.id);
                  }
                }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* 3. Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin">

          {/* 
            TOP ADVERTISEMENT BLOCK - GOOGLE ADSENSE READY (Matches Image 2 exactly) 
            "QUẢNG CÁO BÊN TRÊN"
          */}
          <div 
            id="drawer-top-adsense-card" 
            className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs relative overflow-hidden"
          >
            {/* Ad Header */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-3">
              <span className="text-slate-400">QUẢNG CÁO • GOOGLE ADSENSE</span>
              <span className="text-emerald-600">ĐƯỢC TÀI TRỢ</span>
            </div>

            {/* Ad Body: Glowing Blue Circle Icon + Title + Description + Button */}
            <div className="flex flex-col items-center text-center space-y-2.5 pt-1 pb-1">
              {/* Blue Orb / Tech Icon */}
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                <Globe className="w-6 h-6 text-white" />
              </div>

              <div className="space-y-1">
                <h3 className="text-slate-900 font-bold text-sm sm:text-base">
                  Tối Ưu Hiển Thị Quảng Cáo Google (AdSense Ready)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  Hệ sinh thái máy tính và công cụ số học thế hệ mới, tối ưu hóa 100% trên Điện thoại, Tablet và Máy tính.
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                  ID: {AD_CLIENT_ID}
                </div>
              </div>

              {/* Blue CTA Button */}
              <button
                type="button"
                onClick={() => window.open('https://adsense.google.com/start/', '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer mt-1"
              >
                <span>Khám phá ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ORANGE CATEGORY TAG & H2 TITLE matching Image 2 */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              {currentInsight.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentInsight.title}
            </h2>
          </div>

          {/* AI ANALYSIS CONTENT CONTAINER matching Image 2 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            
            {/* Sub-Header: ✨ Nội dung phân tích từ Gemini AI + 🔄 Làm mới button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Nội dung phân tích từ Gemini AI</span>
              </div>
              <button
                onClick={() => handleFetchAiAnalysis()}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>

            {/* Analysis Text Body with High-Contrast Typography */}
            <div className="p-4 sm:p-5 text-sm text-slate-700 leading-relaxed font-sans space-y-3">
              {isLoading ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Gemini AI đang tổng hợp và phân tích dữ liệu chuyên sâu...</p>
                </div>
              ) : (
                <div className="prose max-w-none text-sm text-slate-700 prose-p:my-2 prose-strong:text-slate-900 prose-strong:font-bold prose-ul:my-2 prose-li:my-1">
                  <Markdown>
                    {dynamicAiContent || currentInsight.content}
                  </Markdown>
                </div>
              )}
            </div>

          </div>

          {/* 
            BOTTOM ADVERTISEMENT BLOCK - AS REQUESTED BY USER
            "QUẢNG CÁO BÊN DƯỚI"
          */}
          <div 
            id="drawer-bottom-adsense-card" 
            className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 shadow-xs relative overflow-hidden"
          >
            {/* Ad Header */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-2.5">
              <span className="text-slate-400">QUẢNG CÁO TÀI TRỢ • GOOGLE ADS</span>
              <span className="text-blue-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>XÁC MINH CHUẨN SEO</span>
              </span>
            </div>

            {/* Ad Content */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Nền Tảng Tiện Ích & Toán Học Trực Tuyến
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Khám phá thêm hàng chục công cụ chuẩn xác và giải pháp thông minh
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Pub ID: {AD_CLIENT_ID}
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.open('https://google.com', '_blank', 'noopener,noreferrer')}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Xem thêm</span>
              </button>
            </div>
          </div>

          {/* INTERACTIVE QUESTION FORM: User can ask Gemini anything */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>Hỏi Gemini thêm về công cụ này:</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customQuestion.trim()) {
                  handleFetchAiAnalysis(customQuestion);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Nhập câu hỏi bạn muốn giải đáp..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!customQuestion.trim() || isLoading}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>
          </div>

        </div>

        {/* 4. Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Công nghệ Gemini 3.8 Flash • Google Cloud</span>
          <span className="text-slate-400">Hỗ trợ 24/7</span>
        </div>
      </aside>
    </>
  );
};
