import { ToolId } from '../types';
import { LanguageCode } from '../i18n/languages';

export interface KeywordLinkItem {
  tag: string;
  toolId: ToolId;
  label: string;
}

// Map keywords to specific tools across all 20 international markets
export const MULTILINGUAL_KEYWORD_DIRECTORY: Record<LanguageCode, KeywordLinkItem[]> = {
  vi: [
    { tag: 'Máy Tính Online', toolId: 'basic', label: 'Máy tính trực tuyến đa năng' },
    { tag: 'Tính Lương Gross Net', toolId: 'salary', label: 'Tính lương Gross sang Net' },
    { tag: 'Đo Chỉ Số BMI', toolId: 'bmi', label: 'Tính chỉ số khối cơ thể BMI' },
    { tag: 'Tính Lãi Vay Ngân Hàng', toolId: 'loan', label: 'Bảng tính lãi vay & trả góp' },
    { tag: 'Tính Tuổi Chính Xác', toolId: 'age', label: 'Tính tuổi & Can Chi năm sinh' },
    { tag: 'Tính Phần Trăm Chiết Khấu', toolId: 'percentage', label: 'Tính % giảm giá & chiết khấu' },
    { tag: 'Đổi Đơn Vị Đo Lường', toolId: 'unit', label: 'Quy đổi đơn vị đo lường quốc tế' },
    { tag: 'Máy Tính Lượng Giác', toolId: 'trigonometry', label: 'Tính Sin, Cos, Tan & góc tam giác' },
    { tag: 'Tính Lãi Kép Đầu Tư', toolId: 'compound', label: 'Mô phỏng lãi kép tích lũy' },
    { tag: 'Tính Calo TDEE', toolId: 'calorie', label: 'Tính calo TDEE & BMR giảm cân' },
    { tag: 'Tính Vay Mua Nhà', toolId: 'mortgage', label: 'Khoản trả góp vay mua nhà' },
    { tag: 'Tính Thuế TNCN', toolId: 'tax', label: 'Ước tính thuế thu nhập cá nhân' }
  ],
  en: [
    { tag: 'Online Calculator', toolId: 'basic', label: 'Online Scientific Calculator' },
    { tag: 'Salary Paycheck Calculator', toolId: 'salary', label: 'Gross to Net Paycheck' },
    { tag: 'BMI Calculator', toolId: 'bmi', label: 'Body Mass Index Assessment' },
    { tag: 'Loan EMI Calculator', toolId: 'loan', label: 'Mortgage & Loan Amortization' },
    { tag: 'Exact Age Calculator', toolId: 'age', label: 'Chronological Exact Age' },
    { tag: 'Percentage Calculator', toolId: 'percentage', label: 'Percentage & Sale Discount' },
    { tag: 'Unit Converter', toolId: 'unit', label: 'Metric & Imperial Converter' },
    { tag: 'Trigonometry Calculator', toolId: 'trigonometry', label: 'Sin Cos Tan & Right Triangle' },
    { tag: 'Compound Interest Calculator', toolId: 'compound', label: 'Investment Wealth Growth' },
    { tag: 'Calorie TDEE Calculator', toolId: 'calorie', label: 'Daily Calorie & TDEE Target' },
    { tag: 'Mortgage Payment Calculator', toolId: 'mortgage', label: 'Home Loan Mortgage Planner' },
    { tag: 'Income Tax Calculator', toolId: 'tax', label: 'Federal & State Tax Calculator' }
  ],
  ja: [
    { tag: '計算機 オンライン', toolId: 'basic', label: 'オンライン関数電卓' },
    { tag: '手取り 計算', toolId: 'salary', label: '月収・年収の手取り試算' },
    { tag: 'BMI 計算', toolId: 'bmi', label: '肥満度・適正体重チェック' },
    { tag: '住宅ローン 計算', toolId: 'loan', label: 'ローン返済額シミュレーション' },
    { tag: '年齢 計算', toolId: 'age', label: '満年齢・和暦西暦変換' },
    { tag: 'パーセント 計算', toolId: 'percentage', label: '割引計算・消費税率' },
    { tag: '単位 換算', toolId: 'unit', label: 'メートル法・ポンド換算' },
    { tag: '三角関数 計算', toolId: 'trigonometry', label: '直角三角形・三角比ソルバー' },
    { tag: '複利 計算 投資', toolId: 'compound', label: '積立NISA・複利運用試算' },
    { tag: 'カロリー TDEE 計算', toolId: 'calorie', label: '基礎代謝と消費カロリー' }
  ],
  ko: [
    { tag: '온라인 계산기', toolId: 'basic', label: '공학용 웹 계산기' },
    { tag: '연봉 실수령액 계산기', toolId: 'salary', label: '2026 연봉 세후 실수령액' },
    { tag: 'BMI 계산기', toolId: 'bmi', label: '비만도 및 표준 체중 계산' },
    { tag: '대출 이자 계산기', toolId: 'loan', label: '원리금 균등상환 스케줄' },
    { tag: '만 나이 계산기', toolId: 'age', label: '만나이 통일법 생년월일 계산' },
    { tag: '퍼센트 할인율 계산기', toolId: 'percentage', label: '할인가 및 부가세 계산' },
    { tag: '단위 변환기', toolId: 'unit', label: '평수 제곱미터 환산 & 환율' },
    { tag: '삼각함수 계산기', toolId: 'trigonometry', label: 'sin cos tan 직각삼각형' },
    { tag: '복리 이자 계산기', toolId: 'compound', label: '적금 복리수익 시뮬레이션' },
    { tag: 'TDEE 칼로리 계산기', toolId: 'calorie', label: '기초대사량 및 다이어트 칼로리' }
  ],
  zh: [
    { tag: '在线计算器', toolId: 'basic', label: '多功能科学计算器' },
    { tag: '税后工资计算器', toolId: 'salary', label: '五险一金及个税到手薪资' },
    { tag: 'BMI 计算器', toolId: 'bmi', label: '身体质量指数及标准体重' },
    { tag: '房贷月供计算器', toolId: 'loan', label: '等额本息还款明细' },
    { tag: '周岁年龄计算器', toolId: 'age', label: '农历公历生日天数计算' },
    { tag: '百分比折扣计算器', toolId: 'percentage', label: '商场打折与税费换算' },
    { tag: '单位换算器', toolId: 'unit', label: '公制英制及实时外汇汇率' },
    { tag: '三角函数计算器', toolId: 'trigonometry', label: '正弦余弦直角三角形' },
    { tag: '复利投资计算器', toolId: 'compound', label: '理财复利收益增长' },
    { tag: 'TDEE 热量计算器', toolId: 'calorie', label: '每日热量消耗与基础代谢' }
  ],
  es: [
    { tag: 'Calculadora Online', toolId: 'basic', label: 'Calculadora Científica Online' },
    { tag: 'Calculadora de Sueldo Neto', toolId: 'salary', label: 'Sueldo Bruto a Neto e IRPF' },
    { tag: 'Calculadora IMC', toolId: 'bmi', label: 'Índice de Masa Corporal y Peso Ideal' },
    { tag: 'Calculadora de Préstamos', toolId: 'loan', label: 'Simulador Cuota Hipoteca' },
    { tag: 'Calculadora de Edad', toolId: 'age', label: 'Edad Exacta y Días Vividos' },
    { tag: 'Calculadora Porcentaje', toolId: 'percentage', label: 'Porcentajes y Descuentos' },
    { tag: 'Conversor de Unidades', toolId: 'unit', label: 'Conversión Métrica y Divisas' },
    { tag: 'Calculadora Trigonometría', toolId: 'trigonometry', label: 'Seno Coseno y Triángulo' },
    { tag: 'Calculadora Interés Compuesto', toolId: 'compound', label: 'Simulador de Inversión y Ahorro' },
    { tag: 'Calculadora Calorías TDEE', toolId: 'calorie', label: 'Gasto Calórico Diario và TDEE' }
  ],
  fr: [
    { tag: 'Calculatrice en Ligne', toolId: 'basic', label: 'Calculatrice Scientifique Web' },
    { tag: 'Salaire Brut en Net', toolId: 'salary', label: 'Conversion Brut en Net & Cotisations' },
    { tag: 'Calcul IMC Gratuit', toolId: 'bmi', label: 'Indice de Masse Corporelle & Poids Idéal' },
    { tag: 'Simulateur Prêt Immobilier', toolId: 'loan', label: 'Tableau d’Amortissement Emprunt' },
    { tag: 'Calculer son Âge', toolId: 'age', label: 'Âge Réel et Compte à Rebours' },
    { tag: 'Calcul de Pourcentage', toolId: 'percentage', label: 'Pourcentage Remise et Soldes' },
    { tag: 'Convertisseur Unités', toolId: 'unit', label: 'Unités Métriques et Taux de Change' },
    { tag: 'Calcul Trigonométrie', toolId: 'trigonometry', label: 'Sin Cos Tan & Triangle Rectangle' },
    { tag: 'Intérêts Composés', toolId: 'compound', label: 'Épargne Composée et Rendements' },
    { tag: 'Calculateur Calories TDEE', toolId: 'calorie', label: 'Besoin Calorique Journalier TDEE' }
  ],
  de: [
    { tag: 'Online Rechner', toolId: 'basic', label: 'Wissenschaftlicher Online Rechner' },
    { tag: 'Brutto Netto Rechner', toolId: 'salary', label: 'Gehalt Netto Ausrechnen' },
    { tag: 'BMI Rechner Online', toolId: 'bmi', label: 'Body-Mass-Index & Idealgewicht' },
    { tag: 'Kreditrechner Zinsen', toolId: 'loan', label: 'Tilgungsplan & Monatsrate' },
    { tag: 'Altersrechner', toolId: 'age', label: 'Exaktes Alter in Tagen' },
    { tag: 'Prozentrechner Rabatt', toolId: 'percentage', label: 'Prozente & Mehrwertsteuer' },
    { tag: 'Einheitenumrechner', toolId: 'unit', label: 'Maßeinheiten & Währungen' },
    { tag: 'Trigonometrie Rechner', toolId: 'trigonometry', label: 'Sinus Kosinus Tangens' },
    { tag: 'Zinseszins Rechner', toolId: 'compound', label: 'Vermögensaufbau Zinseszins' },
    { tag: 'Kalorien TDEE Rechner', toolId: 'calorie', label: 'Täglicher Kalorienbedarf TDEE' }
  ],
  pt: [
    { tag: 'Calculadora Online', toolId: 'basic', label: 'Calculadora Científica Online' },
    { tag: 'Salário Líquido CLT', toolId: 'salary', label: 'Cálculo de Salário Bruto para Líquido' },
    { tag: 'Calculadora IMC', toolId: 'bmi', label: 'Índice de Massa Corporal' },
    { tag: 'Simulador de Empréstimo', toolId: 'loan', label: 'Financiamento e Parcelas' },
    { tag: 'Calculadora de Idade', toolId: 'age', label: 'Idade Exata e Dias de Vida' },
    { tag: 'Calculadora de Porcentagem', toolId: 'percentage', label: 'Descontos e Juros' },
    { tag: 'Conversor de Unidades', toolId: 'unit', label: 'Medidas e Câmbio de Moedas' },
    { tag: 'Calculadora Trigonometria', toolId: 'trigonometry', label: 'Seno Cosseno e Triângulo' },
    { tag: 'Juros Compostos', toolId: 'compound', label: 'Simulação de Investimentos e Rendimentos' },
    { tag: 'Calculadora Calorias TDEE', toolId: 'calorie', label: 'Gasto Calórico e TDEE' }
  ],
  ru: [
    { tag: 'Онлайн Калькулятор', toolId: 'basic', label: 'Инженерный научный калькулятор' },
    { tag: 'Калькулятор Зарплаты', toolId: 'salary', label: 'Расчет зарплаты на руки и НДФЛ' },
    { tag: 'Калькулятор ИМТ', toolId: 'bmi', label: 'Индекс массы тела и идеальный вес' },
    { tag: 'Кредитный Калькулятор', toolId: 'loan', label: 'График платежей по кредиту' },
    { tag: 'Калькулятор Возраста', toolId: 'age', label: 'Точный возраст в днях и годах' },
    { tag: 'Калькулятор Процентов', toolId: 'percentage', label: 'Скидки, налоги и проценты' },
    { tag: 'Конвертер Величин', toolId: 'unit', label: 'Метрические единицы и курс валют' },
    { tag: 'Тригонометрический Калькулятор', toolId: 'trigonometry', label: 'Синус Косинус и Треугольник' },
    { tag: 'Сложные Проценты', toolId: 'compound', label: 'Инвестиции и капитализация' },
    { tag: 'Калькулятор Калорий TDEE', toolId: 'calorie', label: 'Суточная норма калорий и TDEE' }
  ],
  id: [
    { tag: 'Kalkulator Online', toolId: 'basic', label: 'Kalkulator Ilmiah Online' },
    { tag: 'Kalkulator Gaji Bersih', toolId: 'salary', label: 'Hitung Gaji Bersih PPh 21' },
    { tag: 'Kalkulator BMI', toolId: 'bmi', label: 'Indeks Massa Tubuh & Berat Ideal' },
    { tag: 'Kalkulator Pinjaman Bank', toolId: 'loan', label: 'Cicilan Angsuran Kredit' },
    { tag: 'Kalkulator Usia', toolId: 'age', label: 'Hitung Usia dan Hari Lahir' },
    { tag: 'Kalkulator Persen', toolId: 'percentage', label: 'Diskon Belanja & Persentase' },
    { tag: 'Konversi Satuan', toolId: 'unit', label: 'Konversi Ukuran & Kurs Mata Uang' },
    { tag: 'Kalkulator Trigonometri', toolId: 'trigonometry', label: 'Sin Cos Tan Segitiga Siku' },
    { tag: 'Bunga Majemuk Investasi', toolId: 'compound', label: 'Simulasi Bunga Berbunga' },
    { tag: 'Kalkulator Kalori TDEE', toolId: 'calorie', label: 'Kebutuhan Kalori Harian TDEE' }
  ],
  hi: [
    { tag: 'ऑनलाइन कैलकुलेटर', toolId: 'basic', label: 'वैज्ञानिक ऑनलाइन कैलकुलेटर' },
    { tag: 'सैलरी कैलकुलेटर', toolId: 'salary', label: 'नेट सैलरी और इनकम टैक्स' },
    { tag: 'बीएमआई कैलकुलेटर', toolId: 'bmi', label: 'बॉडी मास इंडेक्स और सही वजन' },
    { tag: 'लोन ईएमआई कैलकुलेटर', toolId: 'loan', label: 'मासिक किस्त और ब्याज गणना' },
    { tag: 'उम्र कैलकुलेटर', toolId: 'age', label: 'सटीक आयु और जन्म दिवस' },
    { tag: 'प्रतिशत कैलकुलेटर', toolId: 'percentage', label: 'छूट और प्रतिशत गणना' },
    { tag: 'इकाई परिवर्तक', toolId: 'unit', label: 'माप इकाइयाँ और मुद्रा दर' },
    { tag: 'त्रिकोणमिति कैलकुलेटर', toolId: 'trigonometry', label: 'साइन कॉस टैन और त्रिभुज' },
    { tag: 'चक्रवृद्धि ब्याज कैलकुलेटर', toolId: 'compound', label: 'निवेश वृद्धि और चक्रवृद्धि' },
    { tag: 'कैलोरी TDEE कैलकुलेटर', toolId: 'calorie', label: 'दैनिक कैलोरी और TDEE' }
  ],
  ar: [
    { tag: 'آلة حاسبة علمية', toolId: 'basic', label: 'حاسبة علمية أونلاين' },
    { tag: 'حساب الراتب الصافي', toolId: 'salary', label: 'حساب الراتب بعد الاستقطاعات' },
    { tag: 'حاسبة مؤشر كتلة الجسم', toolId: 'bmi', label: 'حساب BMI والوزن المثالي' },
    { tag: 'حاسبة قروض وبنوك', toolId: 'loan', label: 'جدول الأقساط الشهرية' },
    { tag: 'حساب العمر باليوم', toolId: 'age', label: 'حساب العمر بدقة هجري وميلادي' },
    { tag: 'حساب النسبة المئوية', toolId: 'percentage', label: 'حساب الخصم والنسب المئوية' },
    { tag: 'محول الوحدات والعملات', toolId: 'unit', label: 'تحويل المقاييس وأسعار الصرف' },
    { tag: 'حساب حساب المثلثات', toolId: 'trigonometry', label: 'حساب الجيب والظل والمثلثات' },
    { tag: 'حاسبة الفائدة المركبة', toolId: 'compound', label: 'عوائد الاستثمار التراكمي' },
    { tag: 'حاسبة السعرات الحرارية tdee', toolId: 'calorie', label: 'حساب السعرات واحتياج TDEE' }
  ],
  it: [
    { tag: 'Calcolatrice Scientifica Online', toolId: 'basic', label: 'Calcolatrice Scientifica' },
    { tag: 'Calcolo Stipendio Netto', toolId: 'salary', label: 'Da Lordo a Netto e IRPEF' },
    { tag: 'Calcolo BMI Online', toolId: 'bmi', label: 'Indice di Massa Corporea e Peso Forma' },
    { tag: 'Calcolo Rata Mutuo', toolId: 'loan', label: 'Piano di Ammortamento Finanziamento' },
    { tag: 'Calcola la tua Età', toolId: 'age', label: 'Età Esatta e Giorni di Vita' },
    { tag: 'Calcolo Percentuale Sconto', toolId: 'percentage', label: 'Sconti, Saldi e Percentuali' },
    { tag: 'Convertitore di Unità', toolId: 'unit', label: 'Unità di Misura e Tassi di Cambio' },
    { tag: 'Calcolatore Trigonometria', toolId: 'trigonometry', label: 'Seno Coseno e Triangolo Rettangolo' },
    { tag: 'Interesse Composto', toolId: 'compound', label: 'Simulatore Rendimento da Investimento' },
    { tag: 'Calcolo Calorie TDEE', toolId: 'calorie', label: 'Fabbisogno Calorico Giornaliero TDEE' }
  ],
  th: [
    { tag: 'เครื่องคิดเลขออนไลน์', toolId: 'basic', label: 'เครื่องคิดเลขวิทยาศาสตร์' },
    { tag: 'คำนวณเงินเดือนสุทธิ', toolId: 'salary', label: 'คำนวณภาษีและเงินได้สุทธิ' },
    { tag: 'คำนวณค่า BMI', toolId: 'bmi', label: 'ดัชนีมวลกายและน้ำหนักมาตรฐาน' },
    { tag: 'คำนวณค่างวดเงินกู้', toolId: 'loan', label: 'ตารางผ่อนบ้านและดอกเบี้ย' },
    { tag: 'คำนวณอายุจริง', toolId: 'age', label: 'นับจำนวนวันและอายุตามวันเกิด' },
    { tag: 'คำนวณเปอร์เซ็นต์ส่วนลด', toolId: 'percentage', label: 'คิดส่วนลดสินค้าและภาษี VAT' },
    { tag: 'แปลงหน่วยวัดสากล', toolId: 'unit', label: 'แปลงหน่วยวัดและอัตราแลกเปลี่ยน' },
    { tag: 'คำนวณตรีโกณมิติ', toolId: 'trigonometry', label: 'Sin Cos Tan และสามเหลี่ยมมุมฉาก' },
    { tag: 'ดอกเบี้ยทบต้น', toolId: 'compound', label: 'จำลองผลตอบแทนการลงทุนทบต้น' },
    { tag: 'คำนวณแคลอรี่ TDEE', toolId: 'calorie', label: 'พลังงานที่ต้องการต่อวัน TDEE' }
  ],
  tr: [
    { tag: 'Online Hesap Makinesi', toolId: 'basic', label: 'Bilimsel Hesap Makinesi' },
    { tag: 'Net Maaş Hesaplama', toolId: 'salary', label: 'Brütten Nete Maaş ve Vergi' },
    { tag: 'VKİ Hesaplama', toolId: 'bmi', label: 'Vücut Kitle İndeksi ve İdeal Kilo' },
    { tag: 'Kredi Hesaplama', toolId: 'loan', label: 'Taksit ve Faiz Ödeme Planı' },
    { tag: 'Yaş Hesaplama', toolId: 'age', label: 'Doğum Günü ve Yaş Hesaplama' },
    { tag: 'Yüzde ve İndirim Hesaplama', toolId: 'percentage', label: 'Yüzde Oranı ve KDV' },
    { tag: 'Birim Dönüştürücü', toolId: 'unit', label: 'Ölçü Birimleri ve Döviz Kurları' },
    { tag: 'Trigonometri Hesaplama', toolId: 'trigonometry', label: 'Sinüs Kosinüs ve Dik Üçgen' },
    { tag: 'Bileşik Faiz Hesaplama', toolId: 'compound', label: 'Yatırım Getirisi ve Birikim' },
    { tag: 'TDEE Kalori Hesaplama', toolId: 'calorie', label: 'Günlük Kalori İhtiyacı TDEE' }
  ],
  nl: [
    { tag: 'Online Rekenmachine', toolId: 'basic', label: 'Wetenschappelijke Rekenmachine' },
    { tag: 'Bruto Netto Salaris', toolId: 'salary', label: 'Salaris Netto Berekenen' },
    { tag: 'BMI Berekenen', toolId: 'bmi', label: 'Body Mass Index en Gezond Gewicht' },
    { tag: 'Lening en Hypotheek Berekenen', toolId: 'loan', label: 'Maandlasten Aflossing' },
    { tag: 'Leeftijd Berekenen', toolId: 'age', label: 'Exacte Leeftijd in Dagen' },
    { tag: 'Percentage Berekenen Korting', toolId: 'percentage', label: 'Korting en Btw Berekenen' },
    { tag: 'Eenheden Omrekenen', toolId: 'unit', label: 'Maateenheden en Wisselkoersen' },
    { tag: 'Trigonometrie Berekenen', toolId: 'trigonometry', label: 'Sinus Cosinus en Driehoeken' },
    { tag: 'Samengestelde Rente', toolId: 'compound', label: 'Rente op Rente Vermogensopbouw' },
    { tag: 'Calorieën TDEE Berekenen', toolId: 'calorie', label: 'Dagelijkse Caloriebehoefte TDEE' }
  ],
  pl: [
    { tag: 'Kalkulator Online', toolId: 'basic', label: 'Kalkulator Naukowy Online' },
    { tag: 'Kalkulator Wynagrodzeń Netto', toolId: 'salary', label: 'Brutto na Netto i Podatki' },
    { tag: 'Kalkulator BMI', toolId: 'bmi', label: 'Wskaźnik Masy Ciała i Waga' },
    { tag: 'Kalkulator Kredytowy', toolId: 'loan', label: 'Harmonogram Spłat i Raty' },
    { tag: 'Kalkulator Wieku', toolId: 'age', label: 'Dokładny Wiek i Liczba Dni' },
    { tag: 'Kalkulator Procentowy', toolId: 'percentage', label: 'Obliczanie Procentów i Rabatów' },
    { tag: 'Przelicznik Jednostek', toolId: 'unit', label: 'Jednostki Miar i Kursy Walut' },
    { tag: 'Kalkulator Trygonometryczny', toolId: 'trigonometry', label: 'Sinus Cosinus Trójkąt Prostokątny' },
    { tag: 'Procent Składany', toolId: 'compound', label: 'Oszczędności i Procent Składany' },
    { tag: 'Kalkulator Kalorii TDEE', toolId: 'calorie', label: 'Zapotrzebowanie Kaloryczne TDEE' }
  ],
  ms: [
    { tag: 'Kalkulator Saintifik Dalam Talian', toolId: 'basic', label: 'Kalkulator Saintifik Web' },
    { tag: 'Kira Gaji Bersih', toolId: 'salary', label: 'Kira Gaji Bersih KWSP & PCB' },
    { tag: 'Kalkulator BMI Malaysia', toolId: 'bmi', label: 'Indeks Jisim Badan & Berat Unggul' },
    { tag: 'Kalkulator Pinjaman Bank', toolId: 'loan', label: 'Jadual Ansuran Pinjaman' },
    { tag: 'Kalkulator Umur', toolId: 'age', label: 'Kira Umur Tepat dan Hari Hidup' },
    { tag: 'Kalkulator Peratus Diskaun', toolId: 'percentage', label: 'Diskaun Jualan dan Cukai' },
    { tag: 'Penukar Unit Ukuran', toolId: 'unit', label: 'Ukuran Metrik dan Kadar Mata Wang' },
    { tag: 'Kalkulator Trigonometri', toolId: 'trigonometry', label: 'Sin Kos Tan Segi Tiga' },
    { tag: 'Faedah Kompaun Pelaburan', toolId: 'compound', label: 'Kiraan Faedah Kompaun Pelaburan' },
    { tag: 'Kalkulator Kalori TDEE', toolId: 'calorie', label: 'Keperluan Kalori Harian TDEE' }
  ],
  sv: [
    { tag: 'Online Kalkylator', toolId: 'basic', label: 'Vetenskaplig Kalkylator' },
    { tag: 'Räkna ut Lön efter Skatt', toolId: 'salary', label: 'Brutto till Netto Lönekalkylator' },
    { tag: 'Räkna ut BMI', toolId: 'bmi', label: 'Body Mass Index & Idealvikt' },
    { tag: 'Lånekalkylator Ränta', toolId: 'loan', label: 'Månadskostnad och Amortering' },
    { tag: 'Räkna ut Ålder', toolId: 'age', label: 'Exakt Ålder i Dagar' },
    { tag: 'Räkna ut Procent Rabatt', toolId: 'percentage', label: 'Procent och Momsuträkning' },
    { tag: 'Enhetsomvandlare', toolId: 'unit', label: 'Metriskt Imperialt & Valuta' },
    { tag: 'Trigonometri Kalkylator', toolId: 'trigonometry', label: 'Sinus Cosinus och Rätvinklig Triangel' },
    { tag: 'Ränta på Ränta Kalkylator', toolId: 'compound', label: 'Investeringstillväxt Ränta på Ränta' },
    { tag: 'Räkna ut Kalorier TDEE', toolId: 'calorie', label: 'Dagligt Kaloribehov och TDEE' }
  ]
};

// Fallback generator for any tool in a specific language
export function getKeywordDirectory(lang: LanguageCode): KeywordLinkItem[] {
  return MULTILINGUAL_KEYWORD_DIRECTORY[lang] || MULTILINGUAL_KEYWORD_DIRECTORY.en;
}
