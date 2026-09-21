import { LanguageCode } from '../i18n/languages';
import { ToolId } from '../types';

export interface LocalizedToolSEO {
  title: string;
  description: string;
  keywords: string[];
  lsiTerms: string[];
}

export const INTERNATIONAL_SEO_MATRIX: Record<LanguageCode, Partial<Record<ToolId, LocalizedToolSEO>>> = {
  vi: {
    basic: {
      title: 'Máy Tính Online – Máy Tính Bỏ Túi & Khoa Học Miễn Phí',
      description: 'Máy tính online đa năng: bàn phím khoa học 10 cột, lũy thừa, căn bậc n, lượng giác. Hỗ trợ tính toán số học chuẩn xác 100%.',
      keywords: ['máy tính online', 'máy tính bỏ túi online', 'máy tính khoa học', 'máy tính học sinh', 'tính toán trực tuyến', 'máy tính đa năng'],
      lsiTerms: ['máy tính web', 'tính toán số học', 'máy tính lượng giác', 'bàn phím số mở rộng']
    },
    salary: {
      title: 'Tính Lương Gross Sang Net 2026 – Thuế TNCN & BHXH Mới Nhất',
      description: 'Công cụ tính lương Gross sang Net và Net sang Gross chuẩn xác 2026: giảm trừ gia cảnh, BHXH, BHYT, BHTN và biểu thuế lũy tiến từng phần.',
      keywords: ['tính lương gross sang net', 'tính lương net sang gross', 'thuế thu nhập cá nhân 2026', 'cách tính lương net', 'bảo hiểm xã hội', 'tính lương thực nhận'],
      lsiTerms: ['lương net thực nhận', 'lương gross', 'giảm trừ gia cảnh', 'thuế thu nhập cá nhân', 'lương tháng 13']
    },
    bmi: {
      title: 'Tính BMI Online – Đo Độ Béo Gầy Chuẩn WHO & IDI Châu Á',
      description: 'Đo chỉ số khối cơ thể BMI, kiểm tra cân nặng lý tưởng theo chuẩn WHO và người Châu Á. Phát hiện nhanh tình trạng thiếu cân, thừa cân hay béo phì.',
      keywords: ['tính bmi online', 'chỉ số khối cơ thể', 'chỉ số bmi chuẩn', 'tính bmi châu á', 'cân nặng lý tưởng', 'đo độ béo gầy'],
      lsiTerms: ['chỉ số thể trọng', 'tính cân nặng lý tưởng', 'thừa cân béo phì', 'bảng bmi nam nữ']
    },
    loan: {
      title: 'Tính Lãi Vay Ngân Hàng – Bảng Trả Góp Dư Nợ Giảm Dần & Cố Định',
      description: 'Tính lãi suất vay mua nhà, vay tiêu dùng, tính lãi suất vay theo dư nợ giảm dần hoặc gốc lãi đều hàng tháng (EMI) với lịch trả nợ chi tiết.',
      keywords: ['tính lãi vay ngân hàng', 'tính lãi suất vay', 'bảng tính trả góp', 'tính dư nợ giảm dần', 'vay mua nhà emi', 'bảng lãi suất'],
      lsiTerms: ['lãi suất vay ngân hàng', 'tính lãi vay trả góp', 'lịch trả nợ emi', 'vay vốn ngân hàng']
    },
    age: {
      title: 'Tính Tuổi Online – Đếm Số Ngày Đã Sống & Can Chi Âm Dương',
      description: 'Tính tuổi chính xác theo năm, tháng, ngày, giờ. Xem Can Chi năm sinh, đếm ngược ngày sinh nhật và tổng số ngày đã sống.',
      keywords: ['tính tuổi online', 'tính tuổi âm lịch', 'đếm ngày đã sống', 'tính tuổi can chi', 'xem cung hoàng đạo', 'đếm ngược sinh nhật'],
      lsiTerms: ['tuổi dương lịch', 'tuổi âm lịch', 'can chi phong thủy', 'tính ngày sinh']
    },
    percentage: {
      title: 'Tính Phần Trăm – Chiết Khấu Giảm Giá, Tỷ Lệ % & Thuế VAT',
      description: 'Máy tính phần trăm đa năng: tính tỷ lệ phần trăm của một số, % tăng giảm giá trị, tính tiền giảm giá khuyến mãi và thuế VAT.',
      keywords: ['tính phần trăm', 'tính phần trăm giảm giá', 'tính phần trăm chiết khấu', 'tính thuế vat', 'tỷ lệ phần trăm', 'tăng giảm phần trăm'],
      lsiTerms: ['công thức tính %', 'phần trăm lợi nhuận', 'giảm giá sale off', 'thuế giá trị gia tăng']
    },
    unit: {
      title: 'Đổi Đơn Vị Đo Lường & Tỷ Giá Tiền Tệ Trực Tuyến Chuẩn Quốc Tế',
      description: 'Chuyển đổi đơn vị đo lường toàn diện: chiều dài, khối lượng, diện tích, nhiệt độ và tỷ giá tiền tệ trực tiếp cập nhật mới nhất.',
      keywords: ['đổi đơn vị đo lường', 'quy đổi đơn vị', 'chuyển đổi tiền tệ', 'đổi usd sang vnd', 'quy đổi mét sang feet', 'đổi pound sang kg'],
      lsiTerms: ['chuyển đổi đơn vị', 'đổi tỷ giá usd vnd', 'hệ đo lường quốc tế', 'metric sang imperial']
    },
    trigonometry: {
      title: 'Máy Tính Lượng Giác – Tính Sin, Cos, Tan & Giải Tam Giác Vuông',
      description: 'Tính toán giá trị lượng giác Sin, Cos, Tan, Cot dạng số thập phân và căn thức chuẩn. Công cụ giải tam giác vuông tự động vẽ hình minh họa trực quan.',
      keywords: ['máy tính lượng giác', 'tính sin cos tan', 'giải tam giác vuông', 'công thức lượng giác', 'định lý pythagoras', 'bảng lượng giác'],
      lsiTerms: ['hàm số lượng giác', 'tam giác vuông', 'căn thức chuẩn', 'radian sang độ']
    },
    compound: {
      title: 'Tính Lãi Kép Đầu Tư & Tính Calo TDEE Giảm Cân Khoa Học',
      description: 'Mô phỏng sức mạnh lãi kép đầu tư tích lũy dài hạn và tính chỉ số trao đổi chất BMR / TDEE giúp quản lý cân nặng và calo dinh dưỡng thể thao.',
      keywords: ['tính lãi kép đầu tư', 'mô phỏng lãi kép', 'tính calo tdee', 'tính calo giảm cân', 'lãi kép tích lũy', 'calo bmr'],
      lsiTerms: ['sức mạnh lãi kép', 'kế hoạch tài chính tự do', 'tdee hàng ngày', 'thâm hụt calo']
    }
  },

  en: {
    basic: {
      title: 'Free Online Calculator – Fast, Accurate Scientific & Math Tools',
      description: 'Free, clean online scientific calculator with powers, roots, algebra, trigonometry, memory registers, and responsive 10-column layout.',
      keywords: ['online calculator', 'scientific calculator', 'free web calculator', 'math calculator online', 'clean calculator', 'instant math tool'],
      lsiTerms: ['math tool online', 'arithmetic calculator', 'scientific notation', 'algebra calculator']
    },
    salary: {
      title: 'Salary Gross to Net Calculator – Take-Home Pay & Tax Deductions',
      description: 'Calculate your true net income from gross pay. Estimate income tax, social security contributions, and payroll deductions accurately.',
      keywords: ['salary calculator', 'gross to net calculator', 'take home pay calculator', 'after tax income calculator', 'payroll tax calculator'],
      lsiTerms: ['net paycheck', 'gross salary', 'income tax estimate', 'after tax pay']
    },
    bmi: {
      title: 'BMI Calculator – Body Mass Index & Ideal Weight for Adults',
      description: 'Calculate your exact Body Mass Index (BMI) using standard WHO criteria. Discover your healthy weight range and body composition metrics.',
      keywords: ['bmi calculator', 'body mass index calculator', 'ideal weight calculator', 'bmi chart who', 'healthy weight range'],
      lsiTerms: ['body mass index', 'underweight overweight', 'bmi category', 'healthy body metric']
    },
    loan: {
      title: 'Loan & Mortgage Payment Calculator – EMI & Amortization Schedule',
      description: 'Plan your borrowing with precision. Calculate monthly payments (EMI), total interest charges, and comprehensive amortization breakdown.',
      keywords: ['loan calculator', 'mortgage payment calculator', 'emi calculator', 'amortization schedule calculator', 'home loan interest'],
      lsiTerms: ['monthly installment', 'principal interest breakdown', 'reducing balance loan', 'mortgage pay off']
    },
    age: {
      title: 'Age Calculator – Exact Age in Years, Months, Days & Birthday Count',
      description: 'Find out exactly how old you are down to the day and hour. Includes total days lived, days until your next birthday, and planetary calendar insights.',
      keywords: ['age calculator', 'how old am i', 'exact age in days', 'birthday countdown', 'chronological age calculator'],
      lsiTerms: ['date of birth', 'days lived counter', 'next birthday tracker', 'age in minutes']
    },
    percentage: {
      title: 'Percentage Calculator – Fast Discounts, VAT, Sales Tax & % Change',
      description: 'Solve any percentage problem: calculate percentage of a number, percentage increase or decrease, discount prices, and sales tax / VAT effortlessly.',
      keywords: ['percentage calculator', 'discount calculator', 'percent off calculator', 'vat calculator', 'sales tax calculation', 'percentage increase'],
      lsiTerms: ['percent change', 'sale price calculator', 'markup margin', 'proportion calculator']
    },
    unit: {
      title: 'Unit Converter – Length, Weight, Temperature & Live Currency Exchange',
      description: 'Convert between metric and imperial units for length, mass, volume, temperature, and exchange rates for major global currencies.',
      keywords: ['unit converter', 'length converter', 'currency converter live', 'metric to imperial', 'weight converter', 'temperature converter'],
      lsiTerms: ['measurement converter', 'currency exchange rates', 'meters to feet', 'celsius to fahrenheit']
    },
    trigonometry: {
      title: 'Trigonometry Calculator – Sin, Cos, Tan & Right Triangle Solver',
      description: 'Evaluate trigonometric expressions in degrees or radians, view exact radical representations, and solve right triangles with interactive geometry.',
      keywords: ['trigonometry calculator', 'sin cos tan calculator', 'right triangle solver', 'pythagorean theorem calculator', 'exact radical trigonometry'],
      lsiTerms: ['sine cosine tangent', 'hypotenuse solver', 'right angle trigonometry', 'geometric triangle']
    },
    compound: {
      title: 'Compound Interest Calculator & TDEE Calorie Fitness Estimator',
      description: 'Simulate the exponential growth of your investments over time with regular contributions, and estimate your daily caloric expenditure (TDEE).',
      keywords: ['compound interest calculator', 'investment growth calculator', 'tdee calculator', 'daily calorie intake calculator', 'wealth compound growth'],
      lsiTerms: ['compound annual growth rate', 'interest compounding', 'bmr calorie target', 'fitness metabolism']
    }
  },

  ja: {
    basic: {
      title: '電卓 オンライン – 関数電卓 Web・無料のスマート計算機',
      description: '無料のオンライン関数電卓。10列拡張キーボード、累乗、ルート、三角関数を完備し、高精度な計算をブラウザ上で瞬時に実行します。',
      keywords: ['電卓 オンライン', '関数電卓 Web', '無料 計算機', 'オンライン 電卓', '高精度 計算機'],
      lsiTerms: ['ブラウザ電卓', '三角関数電卓', '算術計算', '科学計算機']
    },
    salary: {
      title: '手取り 計算 – 額面 手取り 変換 & 所得税・住民税シミュレーション',
      description: '給与の額面金額から手取り額を瞬時に試算。所得税、住民税、健康保険、厚生年金などの社会保険料控除を考慮した正確なシミュレーション。',
      keywords: ['手取り 計算', '額面 手取り 変換', '所得税 シミュレーション', '給与 手取り 計算機', '社会保険料 控除'],
      lsiTerms: ['月給手取り', '年収シミュレーション', '住民税計算', '給与明細']
    },
    bmi: {
      title: 'BMI 計算 – 適正体重 チェック & 肥満度 判定（日本基準対応）',
      description: '身長と体重を入力するだけでBMIと適正体重を即座に判定。日本肥満学会基準およびWHO基準に準拠した体型評価とアドバイス。',
      keywords: ['BMI 計算', '適正体重 チェック', '肥満度 判定', '標準体重 計算', 'BMI 数値 見方'],
      lsiTerms: ['適正体型', '肥満度チェック', '体格指数', 'ダイエット目標体重']
    },
    loan: {
      title: '住宅ローン シミュレーション – ローン 返済額 計算 & 返済計画表',
      description: '住宅ローンや各種ローンの毎月返済額、ボーナス返済、総利息額をシミュレーション。元利均等・元金均等の返済スケジュール表を作成。',
      keywords: ['住宅ローン シミュレーション', 'ローン 返済額 計算', '金利 計算 ローン', '借入 返済 シミュレーター'],
      lsiTerms: ['月々の返済額', '元利均等返済', '住宅ローン金利', '返済スケジュール']
    },
    age: {
      title: '年齢 計算 – 生年月日 年齢 & 和暦 西暦 変換・経過日数カウント',
      description: '生年月日から現在の満年齢、生まれてからの総日数、次の誕生日までの日数を正確に計算。和暦（令和・平成・昭和）西暦変換にも対応。',
      keywords: ['年齢 計算', '生年月日 年齢', '和暦 西暦 変換', '生後日数 計算', '満年齢 早見表'],
      lsiTerms: ['現在の年齢', '次の誕生日カウントダウン', '干支計算', '年齢早見表']
    },
    percentage: {
      title: 'パーセント 計算 – 割引 計算 & 消費税・増減率計算ツール',
      description: '値引きセール時の割引価格、消費税（10%・8%）込みの価格、前年比の増減率を直感的に計算できるオンラインパーセント計算機。',
      keywords: ['パーセント 計算', '割引 計算', '消費税 計算', '割合 計算機', '増減率 計算'],
      lsiTerms: ['値引き額', '税込価格計算', '割引率', 'パーセンテージ']
    },
    unit: {
      title: '単位 換算 – 長さ 重さ 変換 & 為替 レート 計算ツール',
      description: 'メートル法・ヤードポンド法（長さ、重さ、面積、温度）の単位換算と最新の為替レート為替換算ツール。',
      keywords: ['単位 換算', '為替 レート 計算', '長さ 重さ 変換', '坪 平米 換算', 'ポンド キロ 換算'],
      lsiTerms: ['メトリック換算', 'ヤードポンド法', '外貨両替シミュレーション', '単位変換']
    },
    trigonometry: {
      title: '三角関数 計算 – sin cos tan 計算 & 直角三角形 ソルバー',
      description: '度数法およびラジアンでの三角比計算。正確な根号表示に対応し、直角三角形の斜辺や角度を自動作図とともに即時算出。',
      keywords: ['三角関数 計算', 'sin cos tan 計算', '直角三角形 計算', 'ピタゴラスの定理', '三角比 公式'],
      lsiTerms: ['サイン コサイン タンジェント', '直角三角形', '根号表示', '角度計算']
    },
    compound: {
      title: '複利 計算 – 資産運用 シミュレーション & TDEE カロリー計算',
      description: '積立投資の複利効果をグラフでシミュレーション。さらに1日の総消費エネルギー量（TDEE）を試算し、健康維持やボディメイクをサポート。',
      keywords: ['複利 計算', '資産運用 シミュレーション', 'TDEE 計算', '積立投資 利回り', '基礎代謝 計算'],
      lsiTerms: ['長期資産形成', '複利効果', '1日消費カロリー', 'ボディメイク']
    }
  },

  ko: {
    basic: {
      title: '온라인 계산기 – 공학용 계산기 Web & 빠르고 정확한 무료 계산기',
      description: '공학용 함수, 거듭제곱, 제곱근, 삼각함수, 괄호 연산을 완벽 지원하는 네이버 스타일의 심플하고 정확한 온라인 웹 계산기입니다.',
      keywords: ['온라인 계산기', '공학용 계산기 Web', '네이버 계산기', '무료 계산기', '수학 계산기'],
      lsiTerms: ['웹 계산기', '공학 계산기', '사칙연산', '간편 계산기']
    },
    salary: {
      title: '실수령액 계산기 – 2026 연봉 실수령액 및 4대보험 공제 계산',
      description: '2026년 최신 4대보험 요율 및 소득세 간이세액표를 반영한 연봉/월급 실수령액 계산기. 국민연금, 건강보험, 고용보험 공제액 완벽 계산.',
      keywords: ['실수령액 계산기', '연봉 실수령액', '4대보험 공제', '2026 급여 계산기', '월급 실수령액', '소득세 계산'],
      lsiTerms: ['월급 세후', '연봉 세후', '4대보험 요율', '급여 세금 공제']
    },
    bmi: {
      title: 'BMI 계산기 – 비만도 계산 및 한국인 표준체중·이상적인 체중 측정',
      description: '키와 몸무게로 신체질량지수(BMI)를 계산하여 저체중, 정상, 과체중, 비만 단계를 확인하세요. 대한비만학회 기준에 최적화된 결과 제공.',
      keywords: ['BMI 계산기', '비만도 계산', '표준체중', '이상적인 체중', '체질량지수 계산'],
      lsiTerms: ['체질량지수', '비만도 측정', '적정 몸무게', '다이어트 목표']
    },
    loan: {
      title: '대출 이자 계산기 – 원리금 균등상환 & 아파트 대출 상환 스케줄',
      description: '대출 원금과 금리, 거치 기간을 입력하여 원리금균등, 원금균등 상환 방식별 월 납입금과 총 이자 부담액을 정밀하게 시뮬레이션합니다.',
      keywords: ['대출 이자 계산기', '원리금 균등상환', '아파트 대출 계산기', '부동산 대출 이자', '상환 계획표'],
      lsiTerms: ['월 상환액', '대출 금리 시뮬레이션', '원금균등상환', '주택담보대출 이자']
    },
    age: {
      title: '나이 계산기 – 만 나이 계산 및 만나이 계산법·생년월일 날짜 계산',
      description: '개정된 만 나이 통일법 완벽 적용! 생년월일을 통해 만 나이, 연 나이, 살아온 일수, 다음 생일까지 남은 D-day를 정확히 계산합니다.',
      keywords: ['나이 계산기', '만 나이 계산', '만나이 계산법', '생년월일 계산', '살아온 날수'],
      lsiTerms: ['만나이 공식', '생일 디데이', '연나이 계산', '띠 계산']
    },
    percentage: {
      title: '퍼센트 계산기 – 할인율 계산 및 부가세·증감율 계산기',
      description: '전체값의 몇 퍼센트인지, 할인 가격은 얼마인지, 전년 대비 증감율은 몇 %인지 간편하게 계산할 수 있는 스마트 퍼센트 계산기.',
      keywords: ['퍼센트 계산기', '할인율 계산', '부가세 계산기', '증감율 계산', '백분율 계산기'],
      lsiTerms: ['할인가격', '부가세 10%', '백분율 공식', '할인율']
    },
    unit: {
      title: '단위 변환기 – 평수 계산기 & 실시간 환율·길이 무게 변환',
      description: '아파트 평수 및 제곱미터(㎡) 상호 변환, 길이, 무게, 부피, 온도 단위 환산 및 주요국 실시간 환율 계산기를 제공합니다.',
      keywords: ['단위 변환기', '환율 계산기', '평수 계산기', '제곱미터 평 변환', '길이 무게 단위'],
      lsiTerms: ['평형 변환', '원달러 환율', '단위 환산표', '미터법 야드파운드']
    },
    trigonometry: {
      title: '삼각함수 계산기 – sin cos tan 계산 및 피타고라스 직각삼각형 솔버',
      description: '사인(sin), 코사인(cos), 탄젠트(tan) 값과 특수각 삼각비 근호 표시, 직각삼각형의 변과 각도 자동 계산 및 직관적 다이어그램 제공.',
      keywords: ['삼각함수 계산기', 'sin cos tan 계산', '피타고라스 계산', '직각삼각형 계산', '삼각비 특수각'],
      lsiTerms: ['사인 코사인 탄젠트', '직각삼각형 빗변', '특수각 삼각비', '삼각비 표']
    },
    compound: {
      title: '복리 계산기 – 적금 이자 계산 & TDEE 칼로리 계산기',
      description: '장기 적립식 투자의 복리 효과와 이자 소득을 그래프로 시뮬레이션하고, 기초대사량(BMR)과 일일 활동 대사량(TDEE)을 산출합니다.',
      keywords: ['복리 계산기', '적금 이자 계산', 'TDEE 계산기', '칼로리 계산', '복리 수익률'],
      lsiTerms: ['복리의 마법', '적립식 투자', '일일 권장 칼로리', '기초대사량']
    }
  },

  zh: {
    basic: {
      title: '在线计算器 – 科学计算器 & 免费智能便捷网页计算器',
      description: '免费专业在线计算器，支持标准算术、科学计算、乘方、开根号、三角函数计算，界面清晰易用，响应迅速。',
      keywords: ['在线计算器', '科学计算器', '免费在线简易计算器', '数学计算器', '网页计算器'],
      lsiTerms: ['函数计算器', '算术运算', '三角函数', '标准计算器']
    },
    salary: {
      title: '税后工资计算器 – 五险一金计算 & 税前转税后个人所得税明细',
      description: '输入税前税后薪资，快速计算各项五险一金缴纳金额及新个税专项附加扣除后的实际到手工资。',
      keywords: ['税后工资计算器', '五险一金计算', '税前转税后', '个人所得税', '到手工资计算'],
      lsiTerms: ['税后薪资', '五险一金缴纳比例', '个税专项附加扣除', '月薪计算']
    },
    bmi: {
      title: 'BMI计算器 – 身体质量指数标准体重计算 & 肥胖指数判定',
      description: '根据世界卫生组织及中国成年人身体健康标准，输入身高和体重，在线计算BMI数值及标准体型推荐体重。',
      keywords: ['BMI计算器', '标准体重计算', '身体质量指数', '肥胖指数', '健康体重范围'],
      lsiTerms: ['体质指数', '偏瘦超重肥胖', '标准体重范围', '减脂目标体重']
    },
    loan: {
      title: '房贷计算器 – 等额本息月供明细与利率模拟器',
      description: '房贷、车贷及商业贷款计算器，提供等额本息和等额本金还款模式的月供明细、利息总支出及还款计划表。',
      keywords: ['房贷计算器', '等额本息计算', '月供计算器', '贷款利息计算', '还款计划表'],
      lsiTerms: ['房贷月供', '商业贷款利率', '公积金贷款', '提前还款明细']
    },
    age: {
      title: '年龄计算器 – 出生日期算年龄 & 周岁虚岁转换与出生天数统计',
      description: '精确计算当前实岁（周岁）、虚岁、出生总天数及距离下次生日的倒计时，同时提供传统生肖与干支年份。',
      keywords: ['年龄计算器', '虚岁周岁转换', '生辰八字', '出生天数', '生日倒计时'],
      lsiTerms: ['准确周岁', '活了多少天', '下一次生日', '生肖干支']
    },
    percentage: {
      title: '百分比计算器 – 折扣计算 & 增减百分比与增值税率换算',
      description: '计算百分比、商品打折减价价格、增长率与减少率，支持一键算出含税与未税价。',
      keywords: ['百分比计算器', '折扣计算', '增长率计算', '百分比增减', '税率计算'],
      lsiTerms: ['折扣折算', '占比计算', '含税价计算', '增长百分比']
    },
    unit: {
      title: '单位转换器 – 长度重量面积单位换算 & 实时汇率计算',
      description: '公制与英制单位换算器（长度、质量、面积、温度、体积）及主要国际货币对人民币的实时汇率换算。',
      keywords: ['单位转换器', '汇率换算', '长度重量转换', '公制英制换算', '人民币汇率'],
      lsiTerms: ['度量衡换算', '外汇汇率', '米换算尺', '千克换算磅']
    },
    trigonometry: {
      title: '三角函数计算器 – 正弦余弦正切 & 直角三角形勾股定理求解',
      description: '支持角度和弧度制计算正弦(sin)、余弦(cos)、正切(tan)，包含精确根式表达以及直角三角形边角智能求解。',
      keywords: ['三角函数计算器', '正弦余弦计算', '直角三角形', '勾股定理计算', '精确根式三角比'],
      lsiTerms: ['正弦余弦正切', '直角三角形解法', '特殊角三角函数', '三角几何']
    },
    compound: {
      title: '复利计算器 – 投资理财收益复利效应 & TDEE每日卡路里测算',
      description: '测算定投投资复利滚存收益模型，并根据身体活动强度计算BMR基础代谢与TDEE每日总能量消耗。',
      keywords: ['复利计算器', '投资收益计算', 'TDEE计算', '每日卡路里', '定投复利公式'],
      lsiTerms: ['利滚利复利效应', '定期定额投资', '每日热量消耗', '基础代谢率']
    }
  },

  es: {
    basic: {
      title: 'Calculadora Online – Científica Gratis y Herramienta Matemática',
      description: 'Calculadora científica online rápida y precisa. Funciones avanzadas, potencias, raíces cuadradas y trigonometría.',
      keywords: ['calculadora online', 'calculadora cientifica gratis', 'calculadora virtual', 'matematicas online'],
      lsiTerms: ['calculadora rapida', 'aritmetica online', 'operaciones matematicas']
    },
    salary: {
      title: 'Calculadora Sueldo Neto – Pasar de Bruto a Neto con IRPF',
      description: 'Calcula tu sueldo neto a partir del bruto anual o mensual con retenciones IRPF y seguridad social.',
      keywords: ['calculadora sueldo neto', 'pasar de bruto a neto', 'retenciones irpf', 'salario neto mensual'],
      lsiTerms: ['nomina neta', 'salario bruto', 'seguridad social calculo']
    },
    bmi: {
      title: 'Calculadora IMC – Índice de Masa Corporal y Peso Ideal',
      description: 'Calcula tu IMC según los criterios de la OMS. Conoce tu peso ideal y tu rango de peso saludable.',
      keywords: ['calculadora imc', 'indice de masa corporal', 'peso ideal altura', 'tabla imc adultos'],
      lsiTerms: ['peso saludable', 'rango imc', 'sobrepeso obesidad']
    },
    loan: {
      title: 'Calculadora de Préstamos e Hipotecas – Cuota Mensual y Amortización',
      description: 'Simulador de hipotecas y créditos. Calcula la cuota mensual, intereses acumulados y cuadro de amortización.',
      keywords: ['calculadora de prestamos', 'simulador hipoteca', 'cuota mensual préstamo', 'cuadro de amortizacion'],
      lsiTerms: ['intereses prestamo', 'tabla amortizacion', 'credito bancario']
    },
    age: {
      title: 'Calculadora de Edad – Cuántos Días He Vivido y Cumpleaños',
      description: 'Calcula tu edad exacta en años, meses y días. Descubre cuántos días has vivido y cuenta atrás para tu cumpleaños.',
      keywords: ['calculadora de edad', 'cuantos dias he vivido', 'cuenta atras cumpleaños', 'edad cronologica'],
      lsiTerms: ['fecha de nacimiento', 'dias vividos', 'proximo cumpleaños']
    },
    percentage: {
      title: 'Calculadora de Porcentaje – Descuentos, IVA y Variación %',
      description: 'Calcula descuentos en rebajas, porcentaje de un número, aumento porcentual y cálculo de IVA rápidamente.',
      keywords: ['calculadora de porcentaje', 'calcular descuento', 'calcular iva', 'tanto por ciento'],
      lsiTerms: ['porcentaje rebajas', 'subida porcentual', 'precio con descuento']
    },
    unit: {
      title: 'Conversor de Unidades – Métrico a Imperial y Divisas en Vivo',
      description: 'Convierte longitud, peso, temperatura, superficie y divisas internacionales al tipo de cambio actual.',
      keywords: ['conversor de unidades', 'conversor de divisas', 'métrico a imperial', 'convertidor de medidas'],
      lsiTerms: ['cambio de moneda', 'metros a pies', 'kilos a libras']
    },
    trigonometry: {
      title: 'Calculadora de Trigonometría – Seno, Coseno, Tangente y Triángulos',
      description: 'Calcula seno, coseno, tangente y resuelve triángulos rectángulos con raíces exactas y gráficos geométricos.',
      keywords: ['calculadora trigonometria', 'calcular seno coseno tangente', 'teorema de pitagoras', 'triangulo rectangulo'],
      lsiTerms: ['razones trigonometricas', 'hipotenusa catetos', 'grados y radianes']
    },
    compound: {
      title: 'Calculadora de Interés Compuesto y Calorías TDEE',
      description: 'Descubre el poder del interés compuesto para tus ahorros e inversiones, y calcula tu gasto calórico TDEE diario.',
      keywords: ['calculadora interes compuesto', 'simulador ahorro', 'calculadora tdee calorias', 'crecimiento inversion'],
      lsiTerms: ['interes acumulado', 'calorias diarias mantenimiento', 'rendimiento inversion']
    }
  },

  fr: {
    basic: {
      title: 'Calculatrice en Ligne – Scientifique Gratuite et Outil de Calcul',
      description: 'Calculatrice en ligne scientifique gratuite avec fonctions trigonométriques, puissances, racines et mémoire.',
      keywords: ['calculatrice en ligne', 'calculatrice scientifique', 'calculatrice gratuite', 'calcul en ligne'],
      lsiTerms: ['outil calcul', 'arithmetique', 'calculatrice puissances']
    },
    salary: {
      title: 'Calcul Salaire Brut en Net – Simulateur de Fiche de Paie',
      description: 'Convertissez votre salaire brut en net mensuel ou annuel après déduction des cotisations sociales et prélèvement à la source.',
      keywords: ['calcul salaire brut en net', 'simulateur fiche de paie', 'salaire net apres impot', 'brut net cadre non cadre'],
      lsiTerms: ['salaire sur le compte', 'cotisations sociales', 'bulletin de paie']
    },
    bmi: {
      title: 'Calcul IMC – Indice de Masse Corporelle et Poids Idéal',
      description: 'Calculez votre Indice de Masse Corporelle (IMC) selon la norme OMS. Découvrez votre poids de forme et catégorie.',
      keywords: ['calcul imc', 'indice de masse corporelle', 'poids ideal', 'norme imc femme homme'],
      lsiTerms: ['poids sante', 'corpulence', 'surpoids maigreur']
    },
    loan: {
      title: 'Simulateur Prêt Immobilier – Calcul Mensualité Crédit & Amortissement',
      description: 'Estimez vos mensualités d’emprunt immobilier ou consommation et visualisez le tableau d’amortissement complet.',
      keywords: ['simulateur pret immobilier', 'calcul mensualite credit', 'tableau amortissement', 'taux interet emprunt'],
      lsiTerms: ['cout total credit', 'mensualite pret', 'capital restant du']
    },
    age: {
      title: 'Calculateur d’Âge – Date de Naissance & Nombre de Jours Vécus',
      description: 'Calculez votre âge précis en années, mois et jours. Comptez le nombre de jours vécus et compte à rebours anniversaire.',
      keywords: ['calculateur age', 'date de naissance', 'calcul nombre de jours vécus', 'compte a rebours anniversaire'],
      lsiTerms: ['age precis', 'jours ecoules', 'prochain anniversaire']
    },
    percentage: {
      title: 'Calculateur de Pourcentage – Remise, Solde & Calcul TVA',
      description: 'Calculez les pourcentages, promotions des soldes, variations relatives et montants de TVA facilement.',
      keywords: ['calculateur de pourcentage', 'calculer remise solde', 'calcul tva', 'taux de variation'],
      lsiTerms: ['prix solde', 'pourcentage augmentation', 'reduction solde']
    },
    unit: {
      title: 'Convertisseur d’Unités – Longueur, Poids & Taux de Change',
      description: 'Convertissez instantanément les unités métriques et impériales ainsi que les devises mondiales en temps réel.',
      keywords: ['convertisseur d unites', 'convertisseur devises en ligne', 'metrique imperial', 'taux de change'],
      lsiTerms: ['conversion mesures', 'devises convertisseur', 'kilometres miles']
    },
    trigonometry: {
      title: 'Calculateur Trigonométrie – Sin, Cos, Tan & Triangle Rectangle',
      description: 'Calcul trigonométrique en degrés ou radians avec simplification de radicaux et résolution de triangle rectangle.',
      keywords: ['calculateur trigonometrie', 'sinus cosinus tangente', 'theoreme pythagore', 'triangle rectangle'],
      lsiTerms: ['fonctions trigonometriques', 'hypotenuse cote', 'formules trigonometrie']
    },
    compound: {
      title: 'Calcul Intérêts Composés & Calculateur TDEE Calories',
      description: 'Simulez l’enrichissement par les intérêts composés de votre épargne et estimez votre dépense énergétique TDEE.',
      keywords: ['calcul interets composes', 'simulateur epargne', 'calculateur tdee calories', 'croissance capital'],
      lsiTerms: ['effet boule de neige', 'epargne investissement', 'besoin calorique journalier']
    }
  },

  de: {
    basic: {
      title: 'Online Rechner – Wissenschaftlicher Taschenrechner Kostenlos',
      description: 'Kostenloser Online-Rechner mit wissenschaftlicher Tastatur, Potenzen, Wurzeln und Trigonometrie.',
      keywords: ['online rechner', 'wissenschaftlicher taschenrechner', 'rechner kostenlos', 'mathe online rechner'],
      lsiTerms: ['taschenrechner online', 'rechenprogramm', 'mathematik werkzeug']
    },
    salary: {
      title: 'Brutto Netto Rechner – Gehaltsrechner & Nettolohn Berechnen',
      description: 'Ermitteln Sie Ihren Nettolohn aus dem Bruttogehalt nach Abzug von Lohnsteuer, Solidaritätszuschlag und Sozialabgaben.',
      keywords: ['brutto netto rechner', 'gehaltsrechner', 'nettolohn berechnen', 'steuerklasse gehalt'],
      lsiTerms: ['auszahlung gehalt', 'lohnsteuer abzug', 'sozialversicherung']
    },
    bmi: {
      title: 'BMI Rechner – Body Mass Index Berechnen & Idealgewicht',
      description: 'Berechnen Sie Ihren Body-Mass-Index (BMI) nach WHO-Klassifikation und ermitteln Sie Ihr optimales Normalgewicht.',
      keywords: ['bmi rechner', 'body mass index berechnen', 'idealgewicht tabelle', 'bmi rechner mann frau'],
      lsiTerms: ['gesundes gewicht', 'körpergewicht', 'untergewicht übergewicht']
    },
    loan: {
      title: 'Kreditrechner Online – Tilgungsrechner & Baufinanzierung Rechner',
      description: 'Berechnen Sie Ihre monatliche Kreditrate, Zinskosten und erstellen Sie einen vollständigen Tilgungsplan.',
      keywords: ['kreditrechner online', 'tilgungsrechner', 'baufinanzierung rechner', 'monatsrate berechnen'],
      lsiTerms: ['tilgungsplan', 'annuitätendarlehen', 'kreditzinsen']
    },
    age: {
      title: 'Altersrechner Online – Wie Alt Bin Ich & Geburtstag Countdown',
      description: 'Berechnen Sie Ihr genaues Alter in Jahren, Monaten, Tagen und Stunden sowie verbleibende Tage zum Geburtstag.',
      keywords: ['altersrechner online', 'wie alt bin ich in tagen', 'geburtstagsrechner', 'exaktes alter'],
      lsiTerms: ['geburtsdatum rechner', 'gelebte tage', 'nächster geburtstag']
    },
    percentage: {
      title: 'Prozentrechner – Rabatt Berechnen, Mehrwertsteuer & Prozent',
      description: 'Prozentsatz, Rabatte im Schlussverkauf, prozentuale Zunahme oder Abnahme und Mehrwertsteuer einfach berechnen.',
      keywords: ['prozentrechner', 'rabatt berechnen', 'mehrwertsteuer rechner', 'prozentsatz berechnen'],
      lsiTerms: ['prozentrechnung', 'nachlass preis', 'mwst berechnung']
    },
    unit: {
      title: 'Einheitenumrechner – Metrisch zu Imperial & Währungsrechner',
      description: 'Schnelle Umrechnung von Längen, Gewicht, Fläche, Temperatur sowie Live-Wechselkurse weltweiter Währungen.',
      keywords: ['einheitenumrechner', 'währungsrechner live', 'laenge gewicht umrechnen', 'metrisch imperial'],
      lsiTerms: ['masseinheiten umrechnen', 'devisenrechner', 'umrechnungstabelle']
    },
    trigonometry: {
      title: 'Trigonometrie Rechner – Sinus, Cosinus, Tangens & Dreiecksrechner',
      description: 'Trigonometrische Berechnungen mit exakter Wurzeldarstellung und automatischer Dreiecksauflösung.',
      keywords: ['trigonometrie rechner', 'sin cos tan rechner', 'rechtwinkliges dreieck', 'satz des pythagoras'],
      lsiTerms: ['winkelfunktionen', 'hypotenuse kathete', 'trigonometrische formeln']
    },
    compound: {
      title: 'Zinseszinsrechner – Vermögensaufbau Sparplan & TDEE Kalorien',
      description: 'Simulieren Sie den Zinseszinseffekt für Ihre Geldanlage und Sparpläne, inklusive TDEE-Kalorienbedarfsrechner.',
      keywords: ['zinseszinsrechner', 'vermögensaufbau sparplan', 'tdee kalorienbedarfsrechner', 'zinseszins formel'],
      lsiTerms: ['kapitalwachstum', 'tagesbedarf kalorien', 'langfristiges sparen']
    }
  },

  pt: {
    basic: {
      title: 'Calculadora Online – Científica Grátis e Fácil de Usar',
      description: 'Calculadora científica online completa: potências, raízes, trigonometria e cálculo preciso em segundos.',
      keywords: ['calculadora online', 'calculadora cientifica gratis', 'calculadora web', 'calculos rapidos'],
      lsiTerms: ['calculo online', 'ferramenta matematica', 'calculadora de funcoes']
    },
    salary: {
      title: 'Calculadora Salário Líquido – Converter Bruto em Líquido',
      description: 'Descubra quanto cai na sua conta: cálculo de salário bruto para líquido com descontos de INSS e IRRF.',
      keywords: ['calculadora salario liquido', 'converter bruto em liquido', 'desconto inss irrf', 'salario na mao'],
      lsiTerms: ['salario liquido real', 'imposto de renda retido', 'descontos folha']
    },
    bmi: {
      title: 'Calculadora de IMC – Índice de Massa Corporal e Peso Ideal',
      description: 'Calcule seu Índice de Massa Corporal (IMC) com a fórmula oficial da OMS e confira seu peso saudável.',
      keywords: ['calculadora de imc', 'indice de massa corporal', 'peso ideal', 'tabela imc oms'],
      lsiTerms: ['peso saudavel', 'faixa de peso', 'grau de obesidade']
    },
    loan: {
      title: 'Simulador de Empréstimo – Financiamento e Parcela Mensal',
      description: 'Calcule parcelas mensais de empréstimos e financiamento imobiliário com tabela de amortização completa.',
      keywords: ['simulador de emprestimo', 'calculadora financiamento habitacional', 'amortizacao sac', 'parcela mensal'],
      lsiTerms: ['juros do financiamento', 'tabela price sac', 'prestacao do emprestimo']
    },
    age: {
      title: 'Calculadora de Idade Exata – Quantos Dias de Vida Você Tem',
      description: 'Calcule sua idade cronológica precisa em anos, meses e dias, total de dias vividos e contagem regressiva.',
      keywords: ['calculadora de idade exata', 'quantos dias de vida', 'data de nascimento', 'proximo aniversario'],
      lsiTerms: ['idade completa', 'dias vividos', 'contador aniversario']
    },
    percentage: {
      title: 'Calculadora de Porcentagem – Descontos, Aumento e Impostos',
      description: 'Calcule percentuais, descontos em compras e promoções, acréscimos e variação percentual com facilidade.',
      keywords: ['calculadora de porcentagem', 'calcular desconto', 'porcentagem aumento', 'regra de tres porcentagem'],
      lsiTerms: ['preco com desconto', 'calculo percentual', 'porcentagem simples']
    },
    unit: {
      title: 'Conversor de Medidas – Sistema Métrico e Câmbio de Moedas',
      description: 'Conversão de unidades de comprimento, peso, temperatura, área e taxas de câmbio de moedas em tempo real.',
      keywords: ['conversor de medidas', 'conversor de moedas em tempo real', 'quilometros milhas', 'libras quilos'],
      lsiTerms: ['conversao unidades', 'cotacao de moedas', 'sistema metrico']
    },
    trigonometry: {
      title: 'Calculadora de Trigonometria – Seno, Cosseno, Tangente e Triângulos',
      description: 'Cálculo de funções trigonométricas com radicais exatos e resolução geométrica de triângulos retângulos.',
      keywords: ['calculadora de trigonometria', 'seno cosseno tangente', 'teorema de pitagoras', 'triangulo retangulo'],
      lsiTerms: ['razoes trigonometricas', 'catetos e hipotenusa', 'graus radianos']
    },
    compound: {
      title: 'Calculadora de Juros Compostos & Estimativa de Calorias TDEE',
      description: 'Simule o crescimento exponencial do seu patrimônio com juros compostos e descubra seu gasto calórico TDEE.',
      keywords: ['calculadora de juros compostos', 'simulador de rendimento', 'calculo calorias tdee', 'investimento a longo prazo'],
      lsiTerms: ['efeito juros compostos', 'patrimonio futuro', 'calorias diarias']
    }
  },

  ru: {
    basic: {
      title: 'Калькулятор Онлайн – Инженерный & Научный Калькулятор Бесплатно',
      description: 'Бесплатный онлайн калькулятор с инженерными функциями, степенями, корнями и тригонометрией в браузере.',
      keywords: ['калькулятор онлайн', 'научный инженерный калькулятор', 'простой калькулятор', 'калькулятор дробей'],
      lsiTerms: ['онлайн счетчик', 'математический калькулятор', 'вычисления онлайн']
    },
    salary: {
      title: 'Расчет Зарплаты Гросс Нет – Зарплата на Руки и НДФЛ',
      description: 'Калькулятор перевода зарплаты из гросс в нет и наоборот: расчет НДФЛ 13%, страховых взносов и суммы на руки.',
      keywords: ['расчет зарплаты гросс нет', 'зарплата на руки', 'калькулятор ндфл', 'чистая зарплата'],
      lsiTerms: ['вычет ндфл', 'белая зарплата', 'оклад на руки']
    },
    bmi: {
      title: 'Калькулятор ИМТ – Индекс Массы Тела Онлайн и Идеальный Вес',
      description: 'Узнайте свой индекс массы тела (ИМТ) по критериям ВОЗ: проверка нормы веса, дефицита или степени ожирения.',
      keywords: ['калькулятор имт', 'индекс массы тела онлайн', 'нормальный вес', 'таблица имт воз'],
      lsiTerms: ['идеальная масса тела', 'проверка веса', 'лишний вес']
    },
    loan: {
      title: 'Кредитный Калькулятор Онлайн – Расчет Платежа по Ипотеке и График',
      description: 'Рассчитайте ежемесячный аннуитетный платеж, сумму переплаты по кредиту и получите подробный график погашения.',
      keywords: ['кредитный калькулятор онлайн', 'расчет платежа по ипотеке', 'аннуитетный платеж', 'график погашения'],
      lsiTerms: ['переплата по кредиту', 'ежемесячный платеж', 'проценты по ипотеке']
    },
    age: {
      title: 'Калькулятор Возраста – Сколько Дней Я Живу и До Дня Рождения',
      description: 'Точный расчет возраста по дате рождения в годах, месяцах, днях, а также обратный отсчет до следующего праздника.',
      keywords: ['калькулятор возраста по дате рождения', 'сколько дней я живу', 'точный возраст онлайн', 'день рождения таймер'],
      lsiTerms: ['прожитые дни', 'дата рождения', 'следующий юбилей']
    },
    percentage: {
      title: 'Калькулятор Процентов – Как Посчитать Скидку, НДС и % Разницу',
      description: 'Быстрый расчет процентов от числа, процентного изменения, скидок на распродажах и налога на добавленную стоимость.',
      keywords: ['калькулятор процентов', 'как посчитать скидку', 'расчет ндс', 'процентное изменение'],
      lsiTerms: ['процент от суммы', 'цена со скидкой', 'прибавка в процентах']
    },
    unit: {
      title: 'Конвертер Величин – Длина, Вес и Курсы Валют Онлайн',
      description: 'Удобный перевод метрических и английских единиц измерения и конвертация курсов мировых валют в реальном времени.',
      keywords: ['конвертер величин', 'конвертер валют онлайн', 'перевод единиц измерения', 'метры в футы'],
      lsiTerms: ['перевод мер', 'курс валют', 'килограммы в фунты']
    },
    trigonometry: {
      title: 'Тригонометрический Калькулятор – Синус, Косинус, Тангенс',
      description: 'Вычисление тригонометрических функций в градусах и радианах, точный расчет корней и решение прямоугольного треугольника.',
      keywords: ['тригонометрический калькулятор', 'синус косинус тангенс', 'теорема пифагора', 'прямоугольный треугольник'],
      lsiTerms: ['тригонометрия онлайн', 'гипотенуза катет', 'таблица тригонометрии']
    },
    compound: {
      title: 'Калькулятор Сложных Процентов и Суточных Калорий TDEE',
      description: 'Оцените капитализацию вкладов и инвестиций с помощью формулы сложных процентов и рассчитайте суточную норму калорий TDEE.',
      keywords: ['калькулятор сложных процентов с капитализацией', 'расчет калорий tdee', 'инвестиционный калькулятор', 'капитализация вклада'],
      lsiTerms: ['сложный процент', 'рост капитала', 'суточный расход калорий']
    }
  },

  id: {
    basic: {
      title: 'Kalkulator Online – Alat Hitung Ilmiah Saintifik Gratis & Cepat',
      description: 'Kalkulator online serbaguna dan praktis: fungsi saintifik, pangkat, akar kuadrat, dan trigonometri tanpa hambatan.',
      keywords: ['kalkulator online', 'kalkulator saintifik ilmiah gratis', 'hitung cepat online', 'kalkulator web'],
      lsiTerms: ['kalkulator matematika', 'alat hitung', 'fungsi matematika']
    },
    salary: {
      title: 'Kalkulator Gaji Bersih – Hitung PPh 21, BPJS & Gaji Gross ke Net',
      description: 'Hitung gaji bersih bulanan Anda dari gaji kotor setelah dipotong BPJS Kesehatan, BPJS Ketenagakerjaan dan PPh 21.',
      keywords: ['kalkulator gaji bersih', 'hitung pph 21', 'gaji gross ke net', 'bpjs ketenagakerjaan', 'gaji take home pay'],
      lsiTerms: ['gaji pokok bersih', 'potongan gaji', 'pajak penghasilan']
    },
    bmi: {
      title: 'Kalkulator BMI – Hitung Berat Badan Ideal & Indeks Massa Tubuh',
      description: 'Cek status berat badan Anda dengan standar WHO dan Asia: ideal, kurus, gemuk, atau obesitas secara instan.',
      keywords: ['kalkulator bmi', 'hitung berat badan ideal', 'indeks massa tubuh', 'tabel bmi sehat'],
      lsiTerms: ['berat tubuh ideal', 'cek obesitas', 'kategori massa tubuh']
    },
    loan: {
      title: 'Simulasi Pinjaman Bank – Kalkulator KPR & Cicilan Angsuran Per Bulan',
      description: 'Hitung simulasi kredit pemilikan rumah (KPR), pinjaman bank, bunga anuitas atau efektif, dan jadwal cicilan.',
      keywords: ['simulasi pinjaman bank', 'kalkulator kpr', 'cicilan per bulan', 'bunga anuitas', 'tabel angsuran'],
      lsiTerms: ['bunga pinjaman', 'angsuran bulanan', 'jadwal pembayaran kpr']
    },
    age: {
      title: 'Kalkulator Umur – Hitung Usia dari Tanggal Lahir & Berapa Hari Hidup',
      description: 'Ketahui umur Anda secara tepat dalam tahun, bulan, hari, serta hitung mundur hari ulang tahun Anda berikutnya.',
      keywords: ['kalkulator umur', 'hitung usia dari tanggal lahir', 'berapa hari hidup', 'hitung mundur ultah'],
      lsiTerms: ['usia tepat', 'total hari hidup', 'hari lahir']
    },
    percentage: {
      title: 'Kalkulator Persen – Hitung Diskon Belanja, PPN & Kenaikan %',
      description: 'Hitung persentase potongan harga belanja, perhitungan pajak PPN, dan persentase perubahan angka dengan cepat.',
      keywords: ['kalkulator persen', 'hitung diskon belanja', 'hitung ppn', 'persentase kenaikan'],
      lsiTerms: ['harga diskon', 'cara hitung persen', 'persen keuntungan']
    },
    unit: {
      title: 'Konverter Satuan Lengkap & Kurs Mata Uang Rupiah Real-Time',
      description: 'Ubah satuan panjang, berat, suhu, luas dan pantau konversi nilai tukar mata uang dunia ke Rupiah (IDR).',
      keywords: ['konverter satuan lengkap', 'kurs mata uang rupiah', 'meter ke kaki', 'konversi satuan'],
      lsiTerms: ['konversi ukuran', 'kurs rupiah hari ini', 'satuan metrik']
    },
    trigonometry: {
      title: 'Kalkulator Trigonometri – Hitung Sin Cos Tan & Segitiga Siku-Siku',
      description: 'Hitung sinus, cosinus, tangen dalam derajat atau radian dan hitung sisi miring segitiga siku-siku Pythagoras.',
      keywords: ['kalkulator trigonometri', 'hitung sin cos tan', 'pythagoras segitiga', 'segitiga siku siku'],
      lsiTerms: ['rumus trigonometri', 'sisi miring', 'sudut istimewa']
    },
    compound: {
      title: 'Kalkulator Bunga Majemuk & Hitung Kalori TDEE Harian',
      description: 'Simulasikan pertumbuhan investasi Anda dengan keajaiban bunga majemuk dan ketahui kebutuhan kalori harian TDEE.',
      keywords: ['kalkulator bunga majemuk', 'simulasi investasi reksa dana', 'hitung kalori tdee', 'compound interest indonesia'],
      lsiTerms: ['keuntungan majemuk', 'investasi jangka panjang', 'kebutuhan kalori harian']
    }
  },

  th: {
    basic: {
      title: 'เครื่องคิดเลข ออนไลน์ – เครื่องคิดเลขวิทยาศาสตร์ฟรี ใช้งานง่าย',
      description: 'เครื่องคิดเลขวิทยาศาสตร์ออนไลน์ฟรี รองรับฟังก์ชันตรีโกณมิติ ยกกำลัง ถอดรูท และการคำนวณทางคณิตศาสตร์ทุกประเภท',
      keywords: ['เครื่องคิดเลข ออนไลน์', 'เครื่องคิดเลขวิทยาศาสตร์', 'เครื่องคิดเลข ฟรี', 'คำนวณคณิตศาสตร์'],
      lsiTerms: ['คิดเลขเร็ว', 'สูตรคำนวณ', 'เครื่องคิดเลขเว็บ']
    },
    salary: {
      title: 'คำนวณเงินเดือนสุทธิ – หักภาษี ณ ที่จ่ายและประกันสังคม',
      description: 'โปรแกรมคำนวณเงินเดือนสุทธิหลังหักภาษีเงินได้บุคคลธรรมดาและเงินสมทบประกันสังคม ทราบเงินเดือนที่แท้จริงเข้าบัญชี',
      keywords: ['คำนวณเงินเดือนสุทธิ', 'หักภาษี ณ ที่จ่าย', 'คำนวณประกันสังคม', 'เงินเดือนเข้าบัญชี', 'เงินเดือนสุทธิ'],
      lsiTerms: ['เงินเดือนจริง', 'หักภาษี', 'ประกันสังคม']
    },
    bmi: {
      title: 'คำนวณ BMI – ดัชนีมวลกายและน้ำหนักที่เหมาะสมตามเกณฑ์มาตรฐาน',
      description: 'เช็คดัชนีมวลกาย (BMI) ของคุณตามมาตรฐานองค์การอนามัยโลก พร้อมแนะนำน้ำหนักที่เหมาะสมต่อสุขภาพ',
      keywords: ['คำนวณ BMI', 'ดัชนีมวลกาย', 'น้ำหนักที่เหมาะสม', 'เช็คความอ้วน', 'เกณฑ์ bmi'],
      lsiTerms: ['ค่าบีเอ็มไอ', 'น้ำหนักมาตรฐาน', 'ดัชนีร่างกาย']
    },
    loan: {
      title: 'คำนวณค่างวดเงินกู้ – คำนวณดอกเบี้ยบ้านและตารางผ่อนชำระ',
      description: 'คำนวณค่างวดผ่อนบ้าน ผ่อนรถ ดอกเบี้ยลดต้นลดดอก และสร้างตารางการผ่อนชำระหนี้อย่างละเอียด',
      keywords: ['คำนวณค่างวดเงินกู้', 'คำนวณดอกเบี้ยบ้าน', 'ผ่อนบ้านต่อเดือน', 'ตารางผ่อนชำระ', 'กู้ซื้อบ้าน'],
      lsiTerms: ['ดอกเบี้ยเงินกู้', 'ยอดผ่อนรายเดือน', 'สินเชื่อบ้าน']
    },
    age: {
      title: 'คำนวณอายุ – นับอายุจากวันเกิดและจำนวนวันที่ใช้ชีวิต',
      description: 'คำนวณอายุของคุณอย่างละเอียดเป็น ปี เดือน วัน พร้อมนับจำนวนวันที่มีชีวิตอยู่และนับถอยหลังสู่วันเกิดครั้งต่อไป',
      keywords: ['คำนวณอายุ', 'นับอายุจากวันเกิด', 'มีชีวิตมากี่วัน', 'นับวันเกิด', 'อายุจริง'],
      lsiTerms: ['อายุเท่าไหร่', 'วันเกิดถัดไป', 'คำนวณวันเดือนปี']
    },
    percentage: {
      title: 'คำนวณเปอร์เซ็นต์ – คิดส่วนลดสินค้าและคำนวณภาษี VAT 7%',
      description: 'คำนวณร้อยละ คำนวณราคาส่วนลดป้ายเซล และคิดภาษีมูลค่าเพิ่ม VAT 7% ได้อย่างรวดเร็วและแม่นยำ',
      keywords: ['คำนวณเปอร์เซ็นต์', 'คิดส่วนลด', 'คำนวณ vat 7%', 'ร้อยละ', 'คำนวณส่วนลด'],
      lsiTerms: ['ราคาหลังลด', 'ภาษีมูลค่าเพิ่ม', 'เปอร์เซ็นต์ส่วนต่าง']
    },
    unit: {
      title: 'แปลงหน่วยวัด – ความยาว น้ำหนัก และอัตราแลกเปลี่ยนเงินตรา',
      description: 'เครื่องมือแปลงหน่วยวัดสากล ทั้งเมตริกและอิมพีเรียล พร้อมคำนวณอัตราแลกเปลี่ยนเงินตราต่างประเทศแบบเรียลไทม์',
      keywords: ['แปลงหน่วย', 'แปลงอัตราแลกเปลี่ยนเงินตรา', 'แปลงหน่วยวัด', 'เมตรเป็นฟุต', 'กิโลเป็นปอนด์'],
      lsiTerms: ['แปลงค่าเงิน', 'ตารางแปลงหน่วย', 'ระบบเมตริก']
    },
    trigonometry: {
      title: 'เครื่องคิดเลขตรีโกณมิติ – คำนวณ Sin Cos Tan และสามเหลี่ยมมุมฉาก',
      description: 'คำนวณค่าฟังก์ชันตรีโกณมิติ sin cos tan และแก้โจทย์สามเหลี่ยมมุมฉากด้วยทฤษฎีบทพีทาโกรัสอย่างแม่นยำ',
      keywords: ['เครื่องคิดเลขตรีโกณมิติ', 'คำนวณ sin cos tan', 'พีทาโกรัส', 'สามเหลี่ยมมุมฉาก'],
      lsiTerms: ['ฟังก์ชันตรีโกณมิติ', 'ด้านตรงข้ามมุมฉาก', 'ตรีโกณมิติ']
    },
    compound: {
      title: 'คำนวณดอกเบี้ยทบต้นและคำนวณแคลอรี่ TDEE ต่อวัน',
      description: 'วางแผนการเงินด้วยพลังดอกเบี้ยทบต้นจากการลงทุนระยะยาว พร้อมคำนวณพลังงานที่ร่างกายต้องการต่อวัน (TDEE)',
      keywords: ['คำนวณดอกเบี้ยทบต้น', 'วางแผนออมเงิน', 'คำนวณแคลอรี่ TDEE', 'พลังดอกเบี้ยทบต้น'],
      lsiTerms: ['ดอกเบี้ยทบต้น', 'ผลตอบแทนการลงทุน', 'แคลอรี่ต่อวัน']
    }
  },

  hi: {
    basic: {
      title: 'ऑनलाइन कैलकुलेटर – वैज्ञानिक एवं गणितीय कैलकुलेटर फ्री',
      description: 'निःशुल्क ऑनलाइन साइंटिफिक कैलकुलेटर: बीजगणित, त्रिकोणमिति, घात और वर्गमूल की सटीक गणना तुरंत करें।',
      keywords: ['ऑनलाइन कैलकुलेटर', 'वैज्ञानिक कैलकुलेटर', 'गणित कैलकुलेटर', 'साइंटिफिक कैलकुलेटर'],
      lsiTerms: ['कैलकुलेटर ऑनलाइन', 'सटीक गणना', 'गणितीय टूल']
    },
    salary: {
      title: 'वेतन कैलकुलेटर – ग्रॉस से नेट सैलरी और टैक्स कटौती',
      description: 'अपनी टेक होम सैलरी और आयकर कटौती की सटीक गणना करें। सकल वेतन से शुद्ध वेतन का तुरंत अनुमान लगाएं।',
      keywords: ['वेतन कैलकुलेटर', 'ग्रॉस से नेट सैलरी', 'टेक होम सैलरी', 'टैक्स कटौती', 'सैलरी कैलकुलेटर'],
      lsiTerms: ['शुद्ध वेतन', 'इनकम टैक्स कटौती', 'मासिक वेतन']
    },
    bmi: {
      title: 'बीएमआई कैलकुलेटर – बॉडी मास इंडेक्स और सही वजन जांचें',
      description: 'डब्ल्यूएचओ मानकों के अनुसार अपना बीएमआई (BMI) मापें और अपने शरीर के लिए आदर्श वजन का पता लगाएं।',
      keywords: ['बीएमआई कैलकुलेटर', 'बॉडी मास इंडेक्स', 'सही वजन की गणना', 'आदर्श वजन', 'bmi चार्ट'],
      lsiTerms: ['वजन जांच', 'स्वस्थ वजन', 'मोटापा जांच']
    },
    loan: {
      title: 'ईएमआई कैलकुलेटर – होम लोन ब्याज और मासिक किस्त की गणना',
      description: 'बैंक ऋण, होम लोन या कार लोन की मासिक ईएमआई (EMI) और कुल ब्याज का भुगतान विवरण तुरंत देखें।',
      keywords: ['ईएमआई कैलकुलेटर', 'लोन ब्याज कैलकुलेटर', 'गृह ऋण किस्त', 'लोन ईएमआई गणना'],
      lsiTerms: ['मासिक किस्त', 'ब्याज दर', 'ऋण पुनर्भुगतान']
    },
    age: {
      title: 'उम्र कैलकुलेटर – जन्मतिथि से अपनी सही उम्र और दिन जानें',
      description: 'अपनी जन्मतिथि दर्ज करके वर्ष, माह और दिनों में अपनी सटीक आयु निकालें तथा अगले जन्मदिन तक का समय देखें।',
      keywords: ['उम्र कैलकुलेटर', 'जन्मतिथि से उम्र की गणना', 'कितने दिन जिए', 'सटीक उम्र'],
      lsiTerms: ['जन्मदिन उल्टी गिनती', 'आयु गणना', 'कुल दिन']
    },
    percentage: {
      title: 'प्रतिशत कैलकुलेटर – छूट, डिस्काउंट और जीएसटी की गणना',
      description: 'किसी संख्या का प्रतिशत निकालें, शॉपिंग में छूट का हिसाब लगाएं और जीएसटी टैक्स की त्वरित गणना करें।',
      keywords: ['प्रतिशत कैलकुलेटर', 'छूट कैलकुलेटर', 'जीएसटी गणना', 'प्रतिशत कैसे निकालें'],
      lsiTerms: ['डिस्काउंट राशि', 'प्रतिशत अंतर', 'जीएसटी जोड़ें']
    },
    unit: {
      title: 'यूनिट कनवर्टर – लंबाई, वजन और लाइव मुद्रा विनिमय दर',
      description: 'लंबाई, द्रव्यमान, तापमान और दुनिया भर की प्रमुख विदेशी मुद्राओं की भारतीय रुपये में लाइव दरें बदलें।',
      keywords: ['यूनिट कनवर्टर', 'मुद्रा विनिमय दर कैलकुलेटर', 'इकाई परिवर्तक', 'किलो से पाउंड'],
      lsiTerms: ['माप परिवर्तन', 'रुपया विनिमय दर', 'इकाई तालिका']
    },
    trigonometry: {
      title: 'त्रिकोणमिति कैलकुलेटर – Sin, Cos, Tan और समकोण त्रिभुज',
      description: 'त्रिकोणमितीय अनुपात sin, cos, tan और पाइथागोरस प्रमेय द्वारा समकोण त्रिभुज की भुजाओं की गणना करें।',
      keywords: ['त्रिकोणमिति कैलकुलेटर', 'sin cos tan कैलकुलेटर', 'पाइथागोरस प्रमेय', 'समकोण त्रिभुज'],
      lsiTerms: ['त्रिकोणमिति मान', 'कर्ण लम्ब आधार', 'त्रिकोणमिति सूत्र']
    },
    compound: {
      title: 'चक्रवृद्धि ब्याज कैलकुलेटर और टीडीईई दैनिक कैलोरी गणना',
      description: 'निवेश पर चक्रवृद्धि ब्याज (Compound Interest) का लाभ देखें और अपनी दैनिक कैलोरी आवश्यकता (TDEE) जानें।',
      keywords: ['चक्रवृद्धि ब्याज कैलकुलेटर', 'निवेश रिटर्न', 'टीडीईई कैलोरी', 'कंपाउंड इंटरेस्ट'],
      lsiTerms: ['ब्याज पर ब्याज', 'दैनिक कैलोरी', 'दीर्घकालिक निवेश']
    }
  },

  ar: {
    basic: {
      title: 'آلة حاسبة على الإنترنت – حاسبة علمية متطورة وسريعة مجاناً',
      description: 'آلة حاسبة علمية مجانية تدعم العمليات الحسابية المتقدمة، الجذور، الأسس، وحساب المثلثات بدقة عالية.',
      keywords: ['آلة حاسبة على الإنترنت', 'حاسبة علمية متطورة مجانا', 'حاسبة مجانية', 'عمليات حسابية'],
      lsiTerms: ['حساب سريع', 'رياضيات اونلاين', 'حاسبة متقدمة']
    },
    salary: {
      title: 'حاسبة الراتب الصافي – تحويل الراتب من إجمالي إلى صافي',
      description: 'احسب صافي راتبك الشهري بعد استقطاع التأمينات والضرائب واعرف القيمة الفعلية التي ستودع في حسابك.',
      keywords: ['حاسبة الراتب الصافي', 'تحويل الراتب من إجمالي لصافي', 'خصم التأمينات', 'صافي الراتب المستلم'],
      lsiTerms: ['مفردات الراتب', 'استقطاع التأمين', 'الراتب الأساسي']
    },
    bmi: {
      title: 'حاسبة مؤشر كتلة الجسم – حساب الوزن المثالي وفحص السمنة',
      description: 'احسب مؤشر كتلة الجسم (BMI) وفقاً لمعايير منظمة الصحة العالمية وتعرف على نطاق وزنك الصحي المثالي.',
      keywords: ['حاسبة مؤشر كتلة الجسم', 'حساب الوزن المثالي', 'فحص السمنة', 'جدول كتلة الجسم'],
      lsiTerms: ['الوزن الصحي', 'نسبة الدهون', 'مقياس الوزن المثالي']
    },
    loan: {
      title: 'حاسبة القروض البنكية – حساب القسط الشهري وجدول السداد',
      description: 'حساب أقساط القروض العقارية والشخصية مع بيان إجمالي الفوائد المستحقة وجدول استهلاك الدين الشهري.',
      keywords: ['حاسبة القروض البنكية', 'حساب قسط التمويل العقاري', 'فوائد القرض', 'جدول سداد القرض'],
      lsiTerms: ['القسط الشهري', 'فائدة البنك', 'تمويل عقاري']
    },
    age: {
      title: 'حاسبة العمر الدقيق – حساب العمر بالميلادي والهجري والعد التنازلي',
      description: 'احسب عمرك بدقة متناهية بالسنوات والشهور والأيام وعدد الأيام التي عشتها وتوقيت عيد ميلادك القادم.',
      keywords: ['حاسبة العمر الدقيق', 'حساب العمر بالهجري والميلادي', 'كم عشت يوما', 'حساب تاريخ الميلاد'],
      lsiTerms: ['العمر بالتفصيل', 'تاريخ الميلاد', 'العد التنازلي للميلاد']
    },
    percentage: {
      title: 'حاسبة النسبة المئوية – حساب الخصم وضريبة القيمة المضافة',
      description: 'احسب النسبة المئوية من أي رقم ومقدار الخصم في العروض التجارية وضريبة القيمة المضافة بسهولة فائقة.',
      keywords: ['حاسبة النسبة المئوية', 'حساب الخصم والتخفيضات', 'حساب الضريبة', 'طريقة حساب النسبة المئوية'],
      lsiTerms: ['خصم المبيعات', 'الضريبة المضافة', 'زيادة النسبة المئوية']
    },
    unit: {
      title: 'محول الوحدات الشامل وأسعار صرف العملات المباشرة',
      description: 'تحويل وحدات القياس (الطول، الوزن، المساحة، الحرارة) وتحويل العملات بأسعار الصرف المحدثة لحظياً.',
      keywords: ['محول الوحدات الشامل', 'محول العملات وسعر الصرف', 'تحويل المتر للقدم', 'تحويل الكيلو للباوند'],
      lsiTerms: ['جدول التحويلات', 'صرف العملات', 'النظام المتري']
    },
    trigonometry: {
      title: 'حاسبة حساب المثلثات – Sin, Cos, Tan وحل المثلث القائم',
      description: 'حساب قيم الدوال المثلثية بالدرجات والراديان مع الجذور الدقيقة وحل أطراف المثلث القائم الزاوية.',
      keywords: ['حاسبة حساب المثلثات', 'حساب الجا والجتا والظا', 'نظرية فيثاغورس', 'المثلث القائم الزاوية'],
      lsiTerms: ['الدوال المثلثية', 'الوتر والضلع المجاور', 'حساب الزوايا']
    },
    compound: {
      title: 'حاسبة الفائدة المركبة ومعدل السعرات الحرارية TDEE',
      description: 'تعرف على نمو استثماراتك بفعل الفائدة المركبة التراكمية واحسب احتياجك اليومي من السعرات الحرارية TDEE.',
      keywords: ['حاسبة الفائدة المركبة', 'عوائد الاستثمار', 'حساب السعرات الحرارية TDEE', 'الفائدة التراكمية'],
      lsiTerms: ['عائد الاستثمار التراكمي', 'سعرات الثبات', 'بناء الثروة']
    }
  },

  it: {
    basic: {
      title: 'Calcolatrice Online – Scientifica Gratuita e Semplice',
      description: 'Calcolatrice scientifica online completa: funzioni algebriche, potenze, radici e trigonometria veloce.',
      keywords: ['calcolatrice online', 'calcolatrice scientifica online', 'calcolatrice gratis', 'calcolo matematico'],
      lsiTerms: ['calcolatrice web', 'operazioni aritmetiche', 'calcolo veloce']
    },
    salary: {
      title: 'Calcolo Stipendio Netto dal Lordo – Simulatore Busta Paga',
      description: 'Calcola lo stipendio netto mensile partendo dalla RAL lorda annua, considerando IRPEF e contributi INPS.',
      keywords: ['calcolo stipendio netto dal lordo', 'simulatore busta paga', 'calcolo irpef', 'quanto prendo al mese'],
      lsiTerms: ['stipendio netto in busta', 'contributi inps', 'ral netto']
    },
    bmi: {
      title: 'Calcolo BMI Online – Indice di Massa Corporea e Peso Ideale',
      description: 'Calcola il tuo Indice di Massa Corporea (BMI) secondo i canoni OMS e scopri il tuo intervallo di peso forma.',
      keywords: ['calcolo bmi online', 'indice di massa corporea', 'peso forma ideale', 'tabella bmi'],
      lsiTerms: ['peso ideale altezza', 'stato ponderale', 'sottopeso sovrappeso']
    },
    loan: {
      title: 'Simulazione Prestito e Calcolo Rata Mutuo – Piano di Ammortamento',
      description: 'Calcola la rata mensile di prestiti e mutui immobiliari con ammortamento alla francese e quota interessi.',
      keywords: ['simulazione prestito', 'calcolo rata mutuo', 'piano ammortamento alla francese', 'interessi mutuo'],
      lsiTerms: ['rata mensile prestito', 'piano ammortamento', 'capitale residuo']
    },
    age: {
      title: 'Calcolo Età Esatta – Quanti Giorni Ho Vissuto e Compleanno',
      description: 'Calcola con precisione la tua età in anni, mesi, giorni e scopri quanti giorni hai vissuto dall’anno di nascita.',
      keywords: ['calcolo eta esatta', 'quanti giorni ho vissuto', 'data di nascita', 'conto alla rovescia compleanno'],
      lsiTerms: ['anni esatti', 'giorni di vita', 'prossimo compleanno']
    },
    percentage: {
      title: 'Calcolo Percentuale – Sconti Saldi, Scorporo IVA e Variazione %',
      description: 'Calcola la percentuale di un valore, gli sconti durante i saldi stagionali, il calcolo e scorporo dell’IVA.',
      keywords: ['calcolo percentuale', 'calcolo sconto saldi', 'calcolo iva', 'variazione percentuale'],
      lsiTerms: ['prezzo scontato', 'formula percentuale', 'scorporo iva 22']
    },
    unit: {
      title: 'Convertitore di Unità di Misura & Convertitore Valuta Tempo Reale',
      description: 'Conversione tra sistema metrico e imperiale per lunghezza, peso, temperatura e tassi di cambio delle valute.',
      keywords: ['convertitore di unita di misura', 'convertitore valuta tempo reale', 'metrico imperiale', 'da km a miglia'],
      lsiTerms: ['tabelle di conversione', 'cambio euro dollaro', 'unita di misura']
    },
    trigonometry: {
      title: 'Calcolatrice Trigonometria – Seno Coseno Tangente e Triangoli',
      description: 'Calcola le funzioni trigonometriche in gradi o radianti con radici esatte e risoluzione del triangolo rettangolo.',
      keywords: ['calcolatrice trigonometria', 'calcolo seno coseno tangente', 'teorema di pitagora', 'triangolo rettangolo'],
      lsiTerms: ['funzioni trigonometriche', 'ipotenusa e cateti', 'gradi radianti']
    },
    compound: {
      title: 'Calcolo Interesse Composto & Calcolatore Calorie TDEE',
      description: 'Simula la crescita del tuo patrimonio grazie all’interesse composto e stima il tuo fabbisogno calorico TDEE.',
      keywords: ['calcolo interesse composto', 'simulatore investimento piano accumulo', 'calcolo tdee calorie', 'rendimento composto'],
      lsiTerms: ['crescita capitale', 'piano di accumulo capitale', 'calorie giornaliere']
    }
  },

  nl: {
    basic: {
      title: 'Online Rekenmachine – Wetenschappelijke Rekenmachine Gratis',
      description: 'Gratis online wetenschappelijke rekenmachine: machten, wortels, goniometrie en alledaagse wiskunde.',
      keywords: ['online rekenmachine', 'wetenschappelijke rekenmachine', 'gratis rekenmachine', 'rekenen online'],
      lsiTerms: ['wiskunde rekenmachine', 'online calculator', 'rekenmachine functies']
    },
    salary: {
      title: 'Bruto Netto Salaris Berekenen – Check Jouw Nettoloon',
      description: 'Bereken eenvoudig wat je netto overhoudt van je bruto maandsalaris met aftrek van loonheffing en premies.',
      keywords: ['bruto netto salaris berekenen', 'nettoloon checken', 'loonheffing', 'salaris berekenen netto'],
      lsiTerms: ['netto maandsalaris', 'loonstrookje', 'bruto naar netto']
    },
    bmi: {
      title: 'BMI Berekenen – Body Mass Index & Gezond Gewicht Tabel',
      description: 'Bereken je BMI op basis van lengte en gewicht volgens WHO-normen en ontdek je ideale gezonde gewicht.',
      keywords: ['bmi berekenen', 'gezond gewicht tabel', 'body mass index', 'bmi calculator nederland'],
      lsiTerms: ['ideaal gewicht', 'gezonde bmi', 'ondergewicht overgewicht']
    },
    loan: {
      title: 'Lening Berekenen – Hypotheek Maandlasten & Aflossingsschema',
      description: 'Bereken je maandelijkse lasten voor leningen of hypotheek met rente en aflossing overzichtelijk op een rij.',
      keywords: ['lening berekenen', 'hypotheek maandlasten', 'rente en aflossing', 'annuiteit berekenen'],
      lsiTerms: ['maandelijkse aflossing', 'leenrente', 'aflossingsschema']
    },
    age: {
      title: 'Leeftijd Berekenen – Hoe Oud Ben Ik in Dagen & Verjaardag',
      description: 'Bereken je exacte leeftijd in jaren, maanden en dagen, bekijk hoeveel dagen je al leeft en tel af naar je verjaardag.',
      keywords: ['leeftijd berekenen', 'hoe oud ben ik in dagen', 'verjaardag aftellen', 'exacte leeftijd'],
      lsiTerms: ['geboortedatum teller', 'aantal dagen geleefd', 'volgende verjaardag']
    },
    percentage: {
      title: 'Procenten Berekenen – Korting Berekenen & BTW Rekenmachine',
      description: 'Bereken percentages, korting tijdens de uitverkoop, procentuele toename of afname en inclusief/exclusief BTW.',
      keywords: ['procenten berekenen', 'korting berekenen', 'btw rekenmachine', 'procentuele stijging'],
      lsiTerms: ['kortingsprijs', 'btw berekenen 21', 'procent formule']
    },
    unit: {
      title: 'Eenheden Omrekenen – Lengte, Gewicht & Live Wisselkoersen',
      description: 'Zet lengtematen, gewicht, temperatuur en oppervlakte om tussen metrisch en imperiaal en bekijk actuele wisselkoersen.',
      keywords: ['eenheden omrekenen', 'valuta wisselkoers omrekenen', 'metrisch imperiaal', 'omrekenen gewicht'],
      lsiTerms: ['omrekentabel', 'wisselkoers valuta', 'meters naar voeten']
    },
    trigonometry: {
      title: 'Goniometrie Rekenmachine – Sin Cos Tan & Rechthoekige Driehoek',
      description: 'Bereken goniometrische functies sinus, cosinus, tangens en bereken zijden van een rechthoekige driehoek met Pythagoras.',
      keywords: ['goniometrie rekenmachine', 'sin cos tan berekenen', 'stelling van pythagoras', 'rechthoekige driehoek'],
      lsiTerms: ['sinus cosinus tangens', 'schuine zijde berekenen', 'goniometrische verhoudingen']
    },
    compound: {
      title: 'Samengestelde Rente Berekenen & TDEE Caloriebehoefte',
      description: 'Bereken het rente-op-rente effect van je beleggingen en spaargeld, en bereken je dagelijkse TDEE energiebehoefte.',
      keywords: ['samengestelde rente berekenen', 'rendement beleggen', 'tdee caloriebehoefte', 'rente op rente'],
      lsiTerms: ['rente op rente effect', 'vermogensopbouw', 'dagelijks calorieverbruik']
    }
  },

  tr: {
    basic: {
      title: 'Online Hesap Makinesi – Bilimsel ve Hızlı Hesap Makinesi',
      description: 'Ücretsiz ve gelişmiş online bilimsel hesap makinesi: üs alma, karekök, trigonometri ve pratik matematiksel işlemler.',
      keywords: ['online hesap makinesi', 'bilimsel hesap makinesi', 'ücretsiz hesap makinesi', 'matematik hesaplama'],
      lsiTerms: ['hızlı hesaplama', 'fonksiyonel hesap makinesi', 'web hesap makinesi']
    },
    salary: {
      title: 'Brütten Nete Maaş Hesaplama – Gelir Vergisi & SGK Kesintisi',
      description: 'Brüt maaşınızdan elinize geçecek net maaşı SGK primi ve gelir vergisi dilimlerini dikkate alarak hesaplayın.',
      keywords: ['brütten nete maaş hesaplama', 'net maaş hesaplama', 'gelir vergisi ve sgk kesintisi', 'ele geçen net maaş'],
      lsiTerms: ['net asgari ücret', 'maaş bordrosu hesapla', 'vergi dilimleri']
    },
    bmi: {
      title: 'Vücut Kitle İndeksi Hesaplama – BKİ ve İdeal Kilo Hesapla',
      description: 'Boy ve kilo bilginizi girerek Vücut Kitle İndeksinizi (VKİ/BKİ) ve DSÖ normlarına göre ideal kilonuzu öğrenin.',
      keywords: ['vücut kitle indeksi hesaplama', 'bki ideal kilo hesapla', 'vki hesaplama', 'kilo boy endeksi'],
      lsiTerms: ['sağlıklı kilo', 'ideal vücut ağırlığı', 'kilo durumu kontrolü']
    },
    loan: {
      title: 'Kredi Taksit Hesaplama – Konut Kredisi Faiz & Aylık Ödeme Planı',
      description: 'İhtiyaç, taşıt ve konut kredisi aylık taksit tutarını, toplam faiz ödemesini ve amortisman tablosunu görüntüleyin.',
      keywords: ['kredi taksit hesaplama', 'konut kredisi faiz hesaplama', 'aylık ödeme planı', 'kredi hesaplama'],
      lsiTerms: ['aylık taksit tutarı', 'kredi faiz oranı', 'geri ödeme tablosu']
    },
    age: {
      title: 'Yaş Hesaplama – Doğum Tarihinden Yaş Bulma & Kaç Gündür Yaşıyorum',
      description: 'Doğum tarihinizi girerek tam yaşınızı yıl, ay, gün olarak hesaplayın ve bir sonraki yaş gününüze kalan süreyi görün.',
      keywords: ['yaş hesaplama', 'doğum tarihinden yaş bulma', 'kaç gündür yaşıyorum', 'yaş hesaplayıcı'],
      lsiTerms: ['tam yaş', 'yaş gününe kalan gün', 'yaşanan gün sayısı']
    },
    percentage: {
      title: 'Yüzde Hesaplama – İndirim Hesaplama, KDV & Yüzdelik Değişim',
      description: 'Alışveriş indirimlerini, KDV tutarlarını, bir sayının yüzdesini ve artış/azalış oranlarını zahmetsizce hesaplayın.',
      keywords: ['yüzde hesaplama', 'indirim hesaplama', 'kdv hesaplama', 'yüzde artış azalış'],
      lsiTerms: ['indirimli fiyat', 'kdv dahil hariç', 'yüzde formülü']
    },
    unit: {
      title: 'Birim Çevirici & Canlı Döviz Kurları Çevirici Hesaplayıcı',
      description: 'Uzunluk, ağırlık, sıcaklık birimlerini dönüştürün ve anlık canlı döviz kurları ile para birimi çevirisi yapın.',
      keywords: ['birim çevirici', 'canlı döviz kurları çevirici', 'metrik dönüşüm', 'ölçü birimleri çevirici'],
      lsiTerms: ['birim dönüştürücü', 'dolar tl hesaplama', 'ölçü tablosu']
    },
    trigonometry: {
      title: 'Trigonometri Hesap Makinesi – Sin Cos Tan ve Dik Üçgen Çözücü',
      description: 'Derece veya radyan cinsinden trigonometrik fonksiyonları kesin kök değerleriyle ve dik üçgen geometrisiyle çözün.',
      keywords: ['trigonometri hesap makinesi', 'sin cos tan hesaplama', 'dik üçgen', 'pisagor teoremi'],
      lsiTerms: ['trigonometrik oranlar', 'hipotenüs hesaplama', 'açı değerleri']
    },
    compound: {
      title: 'Bileşik Faiz Hesaplama & TDEE Günlük Kalori İhtiyacı',
      description: 'Yatırımlarınızın bileşik faiz getirisini simüle edin ve günlük harcadığınız kalori miktarını (TDEE) hesaplayın.',
      keywords: ['bileşik faiz hesaplama', 'yatırım getirisi', 'tdee günlük kalori ihtiyacı', 'faizin faizi'],
      lsiTerms: ['bileşik getiri', 'uzun vadeli birikim', 'günlük kalori yakımı']
    }
  },

  pl: {
    basic: {
      title: 'Kalkulator Online – Naukowy i Prosty Darmowy Kalkulator Web',
      description: 'Darmowy zaawansowany kalkulator naukowy: potęgi, pierwiastki, funkcje trygonometryczne i ułamki.',
      keywords: ['kalkulator online', 'kalkulator naukowy darmowy', 'prosty kalkulator', 'obliczenia matematyczne'],
      lsiTerms: ['kalkulator w przeglądarce', 'narzędzie matematyczne', 'działania arytmetyczne']
    },
    salary: {
      title: 'Kalkulator Wynagrodzeń Brutto Netto – Ile na Rękę ze Składkami ZUS',
      description: 'Przelicz pensję brutto na netto: dowiedz się, ile otrzymasz na rękę po odliczeniu składek ZUS i zaliczki na PIT.',
      keywords: ['kalkulator wynagrodzeń brutto netto', 'ile na rękę', 'składki zus i pit', 'przelicznik pensji'],
      lsiTerms: ['wypłata na rękę', 'wynagrodzenie netto', 'umowa o pracę netto']
    },
    bmi: {
      title: 'Kalkulator BMI – Wskaźnik Masy Ciała & Waga Idealna Norma',
      description: 'Oblicz swój wskaźnik BMI według norm WHO i sprawdź, czy Twoja waga mieści się w zdrowym przedziale.',
      keywords: ['kalkulator bmi', 'wskaźnik masy ciała', 'waga idealna norma', 'tabela bmi'],
      lsiTerms: ['prawidłowa waga', 'norma wagi', 'nadwaga niedowaga']
    },
    loan: {
      title: 'Kalkulator Kredytowy – Rata Kredytu Hipotecznego & Harmonogram',
      description: 'Oblicz miesięczną ratę kredytu gotówkowego lub hipotecznego oraz sprawdź szczegółowy harmonogram spłat.',
      keywords: ['kalkulator kredytowy', 'oblicz ratę kredytu hipotecznego', 'harmonogram spłat', 'koszt kredytu'],
      lsiTerms: ['rata kredytu', 'odsetki bankowe', 'plan spłaty']
    },
    age: {
      title: 'Kalkulator Wieku – Ile Mam Dni & Dokładny Wiek z Daty Urodzenia',
      description: 'Sprawdź swój wiek w latach, miesiącach i dniach. Dowiedz się, ile dni minęło od Twoich urodzin i odliczaj czas do kolejnych.',
      keywords: ['kalkulator wieku', 'ile mam dni', 'dokładny wiek z daty urodzenia', 'odliczanie do urodzin'],
      lsiTerms: ['przeżyte dni', 'data urodzin', 'następne urodziny']
    },
    percentage: {
      title: 'Obliczanie Procentów – Kalkulator Rabatu, Podatku VAT i Zmiany %',
      description: 'Szybkie obliczanie procentu z liczby, zniżek na wyprzedażach, podatku VAT oraz procentowej zmiany wartości.',
      keywords: ['obliczanie procentów', 'kalkulator rabatu', 'kalkulator vat', 'procent ze zmiany'],
      lsiTerms: ['cena po rabacie', 'wzór na procenty', 'oblicz vat 23']
    },
    unit: {
      title: 'Przelicznik Jednostek – Miary Metryczne i Kursy Walut Online',
      description: 'Konwertuj jednostki długości, masy, temperatury i powierzchni oraz sprawdzaj aktualne kursy walut na żywo.',
      keywords: ['przelicznik jednostek', 'przelicznik walut online', 'metry na stopy', 'jednostki miar'],
      lsiTerms: ['tabela jednostek', 'kursy walut na żywo', 'zamiana jednostek']
    },
    trigonometry: {
      title: 'Kalkulator Trygonometryczny – Sin Cos Tan i Trójkąt Prostokątny',
      description: 'Obliczaj funkcje trygonometryczne sinus, cosinus, tangens z dokładnymi pierwiastkami i twierdzeniem Pitagorasa.',
      keywords: ['kalkulator trygonometryczny', 'funkcje sin cos tg', 'twierdzenie pitagorasa', 'trójkąt prostokątny'],
      lsiTerms: ['przeciwprostokątna', 'funkcje trygonometryczne', 'kąty trójkąta']
    },
    compound: {
      title: 'Kalkulator Procentu Składanego & Zapotrzebowanie Kalorii TDEE',
      description: 'Sprawdź zyski z lokat i inwestycji dzięki procentowi składanemu oraz oblicz swoje dzienne zapotrzebowanie kaloryczne TDEE.',
      keywords: ['kalkulator procentu składanego', 'zysk z lokaty', 'kalkulator kalorii tdee', 'procent składany'],
      lsiTerms: ['magia procentu składanego', 'dzienne kalorie', 'długoterminowe oszczędzanie']
    }
  },

  ms: {
    basic: {
      title: 'Kalkulator Dalam Talian – Kalkulator Saintifik Mudah & Pantas',
      description: 'Kalkulator saintifik dalam talian percuma: fungsi kuasa, punca kuasa, trigonometri dan operasi matematik pantas.',
      keywords: ['kalkulator dalam talian', 'kalkulator saintifik online', 'alat kira matematik', 'kalkulator percuma'],
      lsiTerms: ['pengiraan pantas', 'kalkulator web', 'fungsi matematik']
    },
    salary: {
      title: 'Kira Gaji Bersih – Potongan KWSP, SOCSO, PCB & Gaji Kasar ke Bersih',
      description: 'Kira gaji bersih bulanan anda selepas ditolak KWSP (EPF), SOCSO, EIS dan cukai pendapatan bulanan (PCB).',
      keywords: ['kira gaji bersih', 'potongan kwsp pcb perkeso', 'kalkulator gaji kasar ke bersih', 'gaji take home pay'],
      lsiTerms: ['gaji bersih bulanan', 'caruman kwsp', 'potongan gaji bulanan']
    },
    bmi: {
      title: 'Kalkulator BMI – Kira Berat Badan Ideal & Indeks Jisim Badan',
      description: 'Ketahui tahap berat badan anda mengikut piawaian WHO dan Asia: adakah berat badan anda unggul atau berlebihan.',
      keywords: ['kalkulator bmi', 'kira berat badan ideal', 'indeks jisim badan', 'carta bmi sihat'],
      lsiTerms: ['berat unggul', 'kategori bmi', 'kawal berat badan']
    },
    loan: {
      title: 'Kalkulator Pinjaman Rumah – Bayaran Bulanan & Jadual Anuiti Bank',
      description: 'Kira bayaran bulanan ansuran pinjaman perumahan atau kereta dan periksa jadual pelunasan hutang dengan teliti.',
      keywords: ['kalkulator pinjaman rumah', 'bayaran bulanan pinjaman kereta', 'faedah bank', 'jadual ansuran pinjaman'],
      lsiTerms: ['bayaran ansuran bulanan', 'kadar faedah pinjaman', 'pinjaman perumahan']
    },
    age: {
      title: 'Kalkulator Umur – Kira Umur dari Tarikh Lahir & Jumlah Hari Hidup',
      description: 'Kira umur anda dengan tepat dalam tahun, bulan, hari dan ketahui baki hari sebelum ulang tahun kelahiran anda seterusnya.',
      keywords: ['kalkulator umur', 'kira umur dari tarikh lahir', 'berapa hari hidup', 'tarikh lahir'],
      lsiTerms: ['umur sebenar', 'hari dilahirkan', 'kira hari hidup']
    },
    percentage: {
      title: 'Kira Peratus – Kalkulator Diskaun Jualan Murah & Cukai SST',
      description: 'Kira peratusan nombor, potongan diskaun harga jualan jimat dan jumlah cukai perkhidmatan SST dengan mudah.',
      keywords: ['kira peratus', 'kalkulator diskaun jualan', 'kira cukai sst', 'peratusan diskaun'],
      lsiTerms: ['harga diskaun', 'kenaikan peratusan', 'formula peratus']
    },
    unit: {
      title: 'Penukar Unit Ukuran & Pertukaran Mata Wang Ringgit Langsung',
      description: 'Tukar unit metrik dan imperial bagi panjang, berat, suhu dan semak kadar tukaran mata wang antarabangsa ke Ringgit (MYR).',
      keywords: ['penukar unit ukuran', 'pertukaran mata wang ringgit', 'meter ke kaki', 'tukar unit'],
      lsiTerms: ['kadar pertukaran mata wang', 'tukar kilogram ke paun', 'jadual unit']
    },
    trigonometry: {
      title: 'Kalkulator Trigonometri – Kira Sin Kos Tan & Segitiga Bersudut Tepat',
      description: 'Pengiraan nisbah trigonometri sin, kos, tan dengan nilai punca kuasa tepat dan penyelesaian segitiga bersudut tepat.',
      keywords: ['kalkulator trigonometri', 'kira sin kos tan', 'segitiga tepat', 'teorem pythagoras'],
      lsiTerms: ['nisbah trigonometri', 'sisi hipotenus', 'sudut tepat']
    },
    compound: {
      title: 'Kalkulator Faedah Kompaun & Kira Kalori Harian TDEE',
      description: 'Simulasikan pulangan faedah kompaun pelaburan anda (seperti ASB) dan kira jumlah pembakaran kalori harian TDEE anda.',
      keywords: ['kalkulator faedah kompaun', 'pelaburan asb simpanan', 'kira kalori tdee', 'faedah berganda'],
      lsiTerms: ['keajaiban faedah kompaun', 'keperluan kalori harian', 'pelaburan jangka panjang']
    }
  },

  sv: {
    basic: {
      title: 'Online Kalkylator – Vetenskaplig Miniräknare Online Gratis',
      description: 'Gratis online miniräknare med vetenskapliga funktioner: potenser, rötter, trigonometri och snabba matematiska beräkningar.',
      keywords: ['online kalkylator', 'vetenskaplig miniräknare online gratis', 'enkel miniräknare', 'matematisk kalkylator'],
      lsiTerms: ['webb miniräknare', 'matematikverktyg', 'räkna online']
    },
    salary: {
      title: 'Räkna Ut Lön Efter Skatt – Nettolön Beräkning & Skattetabell',
      description: 'Beräkna din nettolön från bruttolönen efter avdrag för kommunalskatt och arbetsgivaravgifter enkelt och snabbt.',
      keywords: ['räkna ut lön efter skatt', 'nettolön beräkning', 'skattetabell kommunalskatt', 'lön efter skatt'],
      lsiTerms: ['utbetald lön', 'brutto till nettolön', 'skatteavdrag']
    },
    bmi: {
      title: 'Räkna Ut BMI – Kroppsmasseindex & Idealvikt Kalkylator',
      description: 'Beräkna ditt BMI (Body Mass Index) enligt WHO-standard och ta reda på din ideala och hälsosamma målvikt.',
      keywords: ['räkna ut bmi', 'kroppsmasseindex', 'idealvikt kalkylator', 'bmi tabell kvinna man'],
      lsiTerms: ['hälsosam vikt', 'viktklass', 'övervikt undervikt']
    },
    loan: {
      title: 'Lånekalkylator – Bolån Månadskostnad, Ränta & Amortering',
      description: 'Räkna ut månadskostnad för privatlån och bolån med full amorteringsplan och beräkning av räntekostnader.',
      keywords: ['lånekalkylator', 'bolån månadskostnad', 'räntekostnad och amortering', 'kalkylera lån'],
      lsiTerms: ['månadsbelopp lån', 'amorteringsplan', 'effektiv ränta']
    },
    age: {
      title: 'Åldersräknare – Hur Gammal Är Jag i Dagar & Födelsedag Nedräkning',
      description: 'Räkna ut din exakta ålder i år, månader och dagar. Se hur många dagar du har levt och nedräkning till nästa födelsedag.',
      keywords: ['åldersräknare', 'hur gammal är jag i dagar', 'födelsedag nedräkning', 'exakt ålder'],
      lsiTerms: ['levda dagar', 'födelsedatum beräkning', 'nästa födelsedag']
    },
    percentage: {
      title: 'Procent Räknare – Räkna Ut Rabatt, Moms och Procentuell Förändring',
      description: 'Räkna ut rabattpriser vid rea, moms (25%, 12%, 6%), procentuell ökning eller minskning och andelar.',
      keywords: ['procent räknare', 'räkna ut rabatt', 'moms räknare', 'procentuell ökning'],
      lsiTerms: ['reapris kalkylator', 'lägga till moms', 'procent formel']
    },
    unit: {
      title: 'Enhetsomvandlare – Metriskt till Imperialt & Valuta i Realtid',
      description: 'Omvandla enheter för längd, vikt, temperatur och area samt live växelkurser för internationella valutor mot kronor.',
      keywords: ['enhetsomvandlare', 'valutakonverterare realtid', 'metriskt imperialt', 'tum till cm'],
      lsiTerms: ['omvandla mått', 'valutakurser', 'måttenheter']
    },
    trigonometry: {
      title: 'Trigonometri Kalkylator – Beräkna Sinus Cosinus Tangens & Triangel',
      description: 'Beräkna trigonometriska funktioner i grader eller radianer med exakta rötter och lös rätvinkliga trianglar.',
      keywords: ['trigonometri kalkylator', 'beräkna sinus cosinus tangens', 'pythagoras sats', 'rätvinklig triangel'],
      lsiTerms: ['hypotenusa katet', 'trigonometriska funktioner', 'vinkelberäkning']
    },
    compound: {
      title: 'Ränta på Ränta Kalkylator & TDEE Kaloribehov Per Dag',
      description: 'Simulera effekten av ränta på ränta vid långsiktigt sparande och beräkna ditt dagliga energibehov (TDEE).',
      keywords: ['ränta på ränta kalkylator', 'spara och investera', 'tdee kaloribehov räknare', 'ränta på ränta effekten'],
      lsiTerms: ['sparkalkylator', 'dagligt kaloribehov', 'kapitaltillväxt']
    }
  }
};

export function getToolSEO(toolId: ToolId, lang: LanguageCode): LocalizedToolSEO {
  const langMatrix = INTERNATIONAL_SEO_MATRIX[lang] || INTERNATIONAL_SEO_MATRIX.en;
  return langMatrix[toolId] || INTERNATIONAL_SEO_MATRIX.en[toolId] || {
    title: `${toolId} Calculator | Web Calculator`,
    description: `Free online calculator for ${toolId}. Fast, client-side, mobile-first utility.`,
    keywords: [`${toolId} calculator`, 'online calculator', 'free tool'],
    lsiTerms: ['calculation tool', 'online math']
  };
}
