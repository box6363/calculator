// International Salary & Tax Configurations for Multi-Country Support
// Compliant with major international payroll systems (US, UK, Germany/EU, Japan, Singapore, Australia, Canada, Vietnam & Custom)

export type PayPeriod = 'annual' | 'monthly' | 'biweekly' | 'weekly' | 'hourly';

export interface TaxBracket {
  bracket: number;
  min: number;
  max: number; // Infinity for top bracket
  rate: number; // % e.g. 10 for 10%
}

export interface InsuranceItem {
  id: string;
  name: string;
  nameVi?: string;
  rate: number; // % e.g. 6.2 for 6.2%
  capAnnual?: number; // annual cap ceiling if any
  capMonthly?: number; // monthly cap ceiling if any
  minAnnual?: number; // threshold under which 0%
  minMonthly?: number; // monthly threshold under which 0%
  aboveCapRate?: number; // rate for amount above ceiling (e.g. UK NI 2% above UEL)
  description?: string;
}

export interface CountrySubRegion {
  id: string;
  name: string;
  nameVi: string;
  description?: string;
  descriptionVi?: string;
  rate?: number; // Optional flat or average rate
  minMonthly?: number; // For VN minimum wage
}

export interface CountrySalaryProfile {
  id: string;
  name: string;
  nameVi: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  decimals: number;
  defaultPeriod: PayPeriod;
  defaultSalary: number;
  personalAllowanceAnnual: number;
  dependentAllowanceAnnual: number;
  personalAllowanceLabel: string;
  dependentAllowanceLabel: string;
  subRegionLabel?: string;
  subRegionLabelVi?: string;
  subRegions?: CountrySubRegion[];
  defaultSubRegionId?: string;
  employeeInsurances: InsuranceItem[];
  employerContributions: InsuranceItem[];
  taxBracketsAnnual: TaxBracket[];
  presets: number[];
  notes: string;
  notesVi: string;
  // Legacy regions compatibility
  regions?: {
    id: number;
    name: string;
    minMonthly: number;
  }[];
}

export const INTERNATIONAL_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', decimals: 0 },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong (VND)', decimals: 0 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', decimals: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', decimals: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)', decimals: 2 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (CNY)', decimals: 2 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won (KRW)', decimals: 0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', decimals: 2 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht (THB)', decimals: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real (BRL)', decimals: 2 },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso (MXN)', decimals: 2 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', decimals: 2 }
];

export const COUNTRY_PROFILES: Record<string, CountrySalaryProfile> = {
  // 1. VIETNAM (Việt Nam)
  VN: {
    id: 'VN',
    name: 'Vietnam',
    nameVi: 'Việt Nam',
    flag: '🇻🇳',
    currencyCode: 'VND',
    currencySymbol: '₫',
    decimals: 0,
    defaultPeriod: 'monthly',
    defaultSalary: 20000000,
    personalAllowanceAnnual: 11000000 * 12, // 132.000.000 đ/năm
    dependentAllowanceAnnual: 4400000 * 12, // 52.800.000 đ/người/năm
    personalAllowanceLabel: 'Giảm trừ bản thân (11 tr/tháng)',
    dependentAllowanceLabel: 'Giảm trừ người phụ thuộc (4.4 tr/tháng)',
    subRegionLabel: 'Minimum Wage Region (Decree 74/2024)',
    subRegionLabelVi: 'Vùng Lương Tối Thiểu (Nghị định 74/2024/NĐ-CP)',
    defaultSubRegionId: '1',
    subRegions: [
      { id: '1', name: 'Region I: 4,960,000 VND (Hanoi, HCMC, Hai Phong, Binh Duong...)', nameVi: 'Vùng I: 4.960.000 đ/tháng (Hà Nội, TP.HCM, Hải Phòng, Bình Dương, Đồng Nai...)', minMonthly: 4960000 },
      { id: '2', name: 'Region II: 4,410,000 VND (Da Nang, Can Tho, Nha Trang, Hai Duong...)', nameVi: 'Vùng II: 4.410.000 đ/tháng (Đà Nẵng, Cần Thơ, Nha Trang, Hải Dương, Hưng Yên...)', minMonthly: 4410000 },
      { id: '3', name: 'Region III: 3,860,000 VND (Provincial cities & suburban towns)', nameVi: 'Vùng III: 3.860.000 đ/tháng (Các thành phố thuộc tỉnh, thị xã còn lại)', minMonthly: 3860000 },
      { id: '4', name: 'Region IV: 3,450,000 VND (Rural districts & remote areas)', nameVi: 'Vùng IV: 3.450.000 đ/tháng (Các huyện nông thôn còn lại)', minMonthly: 3450000 }
    ],
    regions: [
      { id: 1, name: 'Vùng I (Hà Nội, TP.HCM,...)', minMonthly: 4960000 },
      { id: 2, name: 'Vùng II (Đà Nẵng, Cần Thơ,...)', minMonthly: 4410000 },
      { id: 3, name: 'Vùng III (Thành phố thuộc tỉnh)', minMonthly: 3860000 },
      { id: 4, name: 'Vùng IV (Huyện xã nông thôn)', minMonthly: 3450000 }
    ],
    employeeInsurances: [
      { id: 'bhxh', name: 'Social Security (BHXH)', nameVi: 'Bảo hiểm Xã hội (BHXH)', rate: 8.0, capMonthly: 2340000 * 20, description: 'Trần 20 lần mức lương cơ sở (46.8 tr/tháng)' },
      { id: 'bhyt', name: 'Health Insurance (BHYT)', nameVi: 'Bảo hiểm Y tế (BHYT)', rate: 1.5, capMonthly: 2340000 * 20, description: 'Trần 20 lần mức lương cơ sở (46.8 tr/tháng)' },
      { id: 'bhtn', name: 'Unemployment (BHTN)', nameVi: 'Bảo hiểm Thất nghiệp (BHTN)', rate: 1.0, capMonthly: 4960000 * 20, description: 'Trần 20 lần lương tối thiểu vùng' }
    ],
    employerContributions: [
      { id: 'comp_bhxh', name: 'Employer Social (BHXH DN)', nameVi: 'BHXH Doanh nghiệp', rate: 17.5, capMonthly: 2340000 * 20 },
      { id: 'comp_bhyt', name: 'Employer Health (BHYT DN)', nameVi: 'BHYT Doanh nghiệp', rate: 3.0, capMonthly: 2340000 * 20 },
      { id: 'comp_bhtn', name: 'Employer Unemp (BHTN DN)', nameVi: 'BHTN Doanh nghiệp', rate: 1.0, capMonthly: 4960000 * 20 },
      { id: 'comp_union', name: 'Trade Union (Công đoàn)', nameVi: 'Kinh phí Công đoàn', rate: 2.0, capMonthly: 2340000 * 20, description: 'Trần 20 lần mức lương cơ sở theo NĐ 191/2013' }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 5000000 * 12, rate: 5 },
      { bracket: 2, min: 5000000 * 12, max: 10000000 * 12, rate: 10 },
      { bracket: 3, min: 10000000 * 12, max: 18000000 * 12, rate: 15 },
      { bracket: 4, min: 18000000 * 12, max: 32000000 * 12, rate: 20 },
      { bracket: 5, min: 32000000 * 12, max: 52000000 * 12, rate: 25 },
      { bracket: 6, min: 52000000 * 12, max: 80000000 * 12, rate: 30 },
      { bracket: 7, min: 80000000 * 12, max: Infinity, rate: 35 }
    ],
    presets: [10000000, 15000000, 20000000, 30000000, 50000000, 80000000],
    notes: 'Based on Decree 73/2024/ND-CP (Base salary 2,340,000 VND) and Decree 74/2024/ND-CP (Regional minimum wage).',
    notesVi: 'Căn cứ theo Nghị định 73/2024/NĐ-CP (Lương cơ sở 2.340.000đ) & Nghị định 74/2024/NĐ-CP (Lương tối thiểu vùng).'
  },

  // 2. UNITED STATES (Hoa Kỳ)
  US: {
    id: 'US',
    name: 'United States',
    nameVi: 'Hoa Kỳ',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    decimals: 2,
    defaultPeriod: 'annual',
    defaultSalary: 75000,
    personalAllowanceAnnual: 14600, // IRS Standard Deduction Single filer (2024/2025)
    dependentAllowanceAnnual: 2000, // Child Tax Credit
    personalAllowanceLabel: 'Standard Deduction (Single: $14,600)',
    dependentAllowanceLabel: 'Child Tax Credit / Dependent ($2,000)',
    subRegionLabel: 'State Income Tax',
    subRegionLabelVi: 'Thuế Thu Nhập Tiểu Bang (State Tax)',
    defaultSubRegionId: 'none',
    subRegions: [
      { id: 'none', name: 'No State Income Tax (TX, FL, WA, NV, TN, AK, WY, SD - 0%)', nameVi: 'Miễn thuế tiểu bang (Texas, Florida, Washington, Nevada... - 0%)', rate: 0 },
      { id: 'CA', name: 'California (CA - Progressive avg ~6.5%)', nameVi: 'California (Thuế lũy tiến bang CA ~6.5%)', rate: 6.5 },
      { id: 'NY', name: 'New York (NY - Progressive avg ~5.85%)', nameVi: 'New York (Thuế lũy tiến bang NY ~5.85%)', rate: 5.85 },
      { id: 'IL', name: 'Illinois (IL - Flat 4.95%)', nameVi: 'Illinois (Thuế suất cố định 4.95%)', rate: 4.95 },
      { id: 'MA', name: 'Massachusetts (MA - Flat 5.0%)', nameVi: 'Massachusetts (Thuế suất cố định 5.0%)', rate: 5.0 },
      { id: 'PA', name: 'Pennsylvania (PA - Flat 3.07%)', nameVi: 'Pennsylvania (Thuế suất cố định 3.07%)', rate: 3.07 },
      { id: 'custom', name: 'Custom State Tax Rate (%)', nameVi: 'Tùy chỉnh tỷ lệ thuế tiểu bang (%)', rate: 5.0 }
    ],
    employeeInsurances: [
      { id: 'ss', name: 'Social Security (OASDI 6.2%)', nameVi: 'An sinh Xã hội (Social Security 6.2%)', rate: 6.2, capAnnual: 168600, description: '6.2% on first $168,600 wage base limit' },
      { id: 'medicare', name: 'Medicare (1.45% + 0.9% >$200k)', nameVi: 'Bảo hiểm Y tế Medicare (1.45%)', rate: 1.45, description: '1.45% on all earnings (+0.9% Additional Medicare above $200k)' }
    ],
    employerContributions: [
      { id: 'comp_ss', name: 'Employer Social Security Match', nameVi: 'An sinh Xã hội NSDLĐ đóng (6.2%)', rate: 6.2, capAnnual: 168600 },
      { id: 'comp_medicare', name: 'Employer Medicare Match', nameVi: 'Medicare NSDLĐ đóng (1.45%)', rate: 1.45 },
      { id: 'comp_futa', name: 'Federal Unemployment (FUTA)', nameVi: 'Bảo hiểm thất nghiệp Liên bang (FUTA)', rate: 0.6, capAnnual: 7000 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 11600, rate: 10 },
      { bracket: 2, min: 11600, max: 47150, rate: 12 },
      { bracket: 3, min: 47150, max: 100525, rate: 22 },
      { bracket: 4, min: 100525, max: 191950, rate: 24 },
      { bracket: 5, min: 191950, max: 243725, rate: 32 },
      { bracket: 6, min: 243725, max: 609350, rate: 35 },
      { bracket: 7, min: 609350, max: Infinity, rate: 37 }
    ],
    presets: [45000, 60000, 75000, 100000, 150000, 220000],
    notes: 'IRS Federal Tax (Single Filer), FICA Social Security ($168,600 cap), Medicare & State Tax options.',
    notesVi: 'Thuế Liên bang IRS (Độc thân), FICA Social Security ($168.600 trần), Medicare & tùy chọn Thuế tiểu bang.'
  },

  // 3. UNITED KINGDOM (Vương Quốc Anh)
  GB: {
    id: 'GB',
    name: 'United Kingdom',
    nameVi: 'Vương Quốc Anh',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    decimals: 2,
    defaultPeriod: 'annual',
    defaultSalary: 38000,
    personalAllowanceAnnual: 12570, // Tax-free Personal Allowance (£12,570)
    dependentAllowanceAnnual: 0,
    personalAllowanceLabel: 'Personal Allowance (£12,570, tapered above £100k)',
    dependentAllowanceLabel: 'Dependent Allowance',
    subRegionLabel: 'Tax Jurisdiction',
    subRegionLabelVi: 'Khu Vực Áp Dụng Thuế HMRC',
    defaultSubRegionId: 'EWNI',
    subRegions: [
      { id: 'EWNI', name: 'England, Wales & Northern Ireland (Standard)', nameVi: 'Anh (England), Xứ Wales & Bắc Ireland (Chuẩn PAYE)' },
      { id: 'SCOT', name: 'Scotland (Scottish Tax Bands: 19% to 48%)', nameVi: 'Scotland (Biểu thuế riêng: Starter 19% đến Top 48%)' }
    ],
    employeeInsurances: [
      { id: 'ni', name: 'National Insurance (Class 1)', nameVi: 'Bảo hiểm Quốc gia (NI Class 1)', rate: 8.0, minAnnual: 12570, capAnnual: 50270, aboveCapRate: 2.0, description: '8% between £12,570 and £50,270, 2% above £50,270' }
    ],
    employerContributions: [
      { id: 'comp_ni', name: 'Employer National Insurance', nameVi: 'Bảo hiểm NI NSDLĐ đóng (Class 1)', rate: 13.8, minAnnual: 9100, description: '13.8% above Secondary Threshold (£9,100)' },
      { id: 'comp_pension', name: 'Workplace Pension (Auto-enrolment)', nameVi: 'Hưu trí Doanh nghiệp tối thiểu', rate: 3.0, minAnnual: 6240 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 12570, rate: 0 },
      { bracket: 2, min: 12570, max: 50270, rate: 20 },
      { bracket: 3, min: 50270, max: 125140, rate: 40 },
      { bracket: 4, min: 125140, max: Infinity, rate: 45 }
    ],
    presets: [28000, 38000, 50000, 75000, 100000, 150000],
    notes: 'HMRC PAYE Income Tax, £100k Allowance Tapering & Class 1 National Insurance (8% & 2%).',
    notesVi: 'Biểu thuế HMRC PAYE, quy tắc giảm trừ £100k taper và Bảo hiểm Quốc gia NI (8% & 2% trên trần).'
  },

  // 4. GERMANY / EUROPEAN UNION (Đức / Liên minh Châu Âu)
  DE: {
    id: 'DE',
    name: 'Germany (EU)',
    nameVi: 'Đức (Châu Âu)',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    currencySymbol: '€',
    decimals: 2,
    defaultPeriod: 'annual',
    defaultSalary: 52000,
    personalAllowanceAnnual: 11784, // Grundfreibetrag 2024
    dependentAllowanceAnnual: 3192, // Kinderfreibetrag
    personalAllowanceLabel: 'Basic Tax Allowance (Grundfreibetrag €11,784)',
    dependentAllowanceLabel: 'Child Allowance (Kinderfreibetrag)',
    subRegionLabel: 'Church Tax (Kirchensteuer)',
    subRegionLabelVi: 'Thuế Giáo Hội (Kirchensteuer)',
    defaultSubRegionId: 'none',
    subRegions: [
      { id: 'none', name: 'No Church Tax (0%)', nameVi: 'Không tham gia giáo hội (0%)', rate: 0 },
      { id: 'bayern', name: 'Bavaria / Baden-Württemberg (8%)', nameVi: 'Bang Bayern / Baden-Württemberg (8% trên thuế TNCN)', rate: 8 },
      { id: 'other', name: 'Other German States (9%)', nameVi: 'Các bang khác của Đức (9% trên thuế TNCN)', rate: 9 }
    ],
    employeeInsurances: [
      { id: 'pension', name: 'Pension Insurance (RV 9.3%)', nameVi: 'Bảo hiểm Hưu trí (RV 9.3%)', rate: 9.3, capAnnual: 90600, description: 'Rentenversicherung (Trần €90,600/năm)' },
      { id: 'health', name: 'Health Insurance (KV 8.15%)', nameVi: 'Bảo hiểm Y tế (KV 8.15%)', rate: 8.15, capAnnual: 62100, description: 'Krankenversicherung 7.3% + 0.85% Zusatzbeitrag' },
      { id: 'unemp', name: 'Unemployment Insurance (AV 1.3%)', nameVi: 'Bảo hiểm Thất nghiệp (AV 1.3%)', rate: 1.3, capAnnual: 90600, description: 'Arbeitslosenversicherung (Trần €90,600/năm)' },
      { id: 'care', name: 'Long-term Care (PV 2.2%)', nameVi: 'Bảo hiểm Chăm sóc (PV 2.2%)', rate: 2.2, capAnnual: 62100, description: 'Pflegeversicherung (Trần €62,100/năm)' }
    ],
    employerContributions: [
      { id: 'comp_pension', name: 'Employer Pension Match (RV)', nameVi: 'Hưu trí DN (RV)', rate: 9.3, capAnnual: 90600 },
      { id: 'comp_health', name: 'Employer Health Match (KV)', nameVi: 'Y tế DN (KV)', rate: 7.3, capAnnual: 62100 },
      { id: 'comp_unemp', name: 'Employer Unemployment (AV)', nameVi: 'Thất nghiệp DN (AV)', rate: 1.3, capAnnual: 90600 },
      { id: 'comp_care', name: 'Employer Care Match (PV)', nameVi: 'Chăm sóc DN (PV)', rate: 1.7, capAnnual: 62100 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 11784, rate: 0 },
      { bracket: 2, min: 11784, max: 17005, rate: 14 },
      { bracket: 3, min: 17005, max: 66760, rate: 24 },
      { bracket: 4, min: 66760, max: 277825, rate: 42 },
      { bracket: 5, min: 277825, max: Infinity, rate: 45 }
    ],
    presets: [35000, 48000, 58000, 72000, 95000, 130000],
    notes: 'German Lohnsteuer (Tax Class 1), Statutory Social Security caps, Solidarität & Church Tax.',
    notesVi: 'Thuế thu nhập Đức Lohnsteuer (Bậc 1), 4 khoản an sinh bắt buộc có trần, thuế Solidarität & thuế giáo hội.'
  },

  // 5. JAPAN (Nhật Bản)
  JP: {
    id: 'JP',
    name: 'Japan',
    nameVi: 'Nhật Bản',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    decimals: 0,
    defaultPeriod: 'annual',
    defaultSalary: 5500000,
    personalAllowanceAnnual: 480000, // Basic deduction (Employment Income Deduction calculated dynamically)
    dependentAllowanceAnnual: 380000,
    personalAllowanceLabel: 'Basic Deduction (Kiso Kojo: ¥480,000 + Employment Deduction)',
    dependentAllowanceLabel: 'Dependent Exemption (¥380,000/person)',
    subRegionLabel: 'Resident Tax (Juminzei)',
    subRegionLabelVi: 'Thuế Cư Trú Địa Phương (住民税 - Juminzei)',
    defaultSubRegionId: 'with_resident',
    subRegions: [
      { id: 'with_resident', name: 'Include Standard Resident Tax (10%)', nameVi: 'Đã gồm Thuế Cư Trú Địa Phương (10% Juminzei)', rate: 10 },
      { id: 'national_only', name: 'National Income Tax Only (No Resident Tax)', nameVi: 'Chỉ tính Thuế Thu nhập Quốc gia (0% Cư trú)', rate: 0 }
    ],
    employeeInsurances: [
      { id: 'pension', name: 'Welfare Pension (Kosei Nenkin 9.15%)', nameVi: 'Hưu trí Phúc lợi (Nenkin 9.15%)', rate: 9.15, capMonthly: 650000, description: '厚生年金保険 (Trần lương tháng ¥650,000)' },
      { id: 'health', name: 'Health Insurance (Kenko Hoken 4.99%)', nameVi: 'Bảo hiểm Y tế (Kenko 4.99%)', rate: 4.985, capMonthly: 1390000, description: '健康保険 (Trần lương tháng ¥1,390,000)' },
      { id: 'unemp', name: 'Employment Insurance (Koyo Hoken 0.6%)', nameVi: 'Bảo hiểm Việc làm (0.6%)', rate: 0.6, description: '雇用保険' }
    ],
    employerContributions: [
      { id: 'comp_pension', name: 'Employer Welfare Pension Match', nameVi: 'Hưu trí Nenkin NSDLĐ đóng (9.15%)', rate: 9.15, capMonthly: 650000 },
      { id: 'comp_health', name: 'Employer Health Insurance Match', nameVi: 'BHYT Kenko NSDLĐ đóng (4.99%)', rate: 4.985, capMonthly: 1390000 },
      { id: 'comp_unemp', name: 'Employer Employment Insurance', nameVi: 'Bảo hiểm việc làm NSDLĐ (0.95%)', rate: 0.95 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 1950000, rate: 5 },
      { bracket: 2, min: 1950000, max: 3300000, rate: 10 },
      { bracket: 3, min: 3300000, max: 6950000, rate: 20 },
      { bracket: 4, min: 6950000, max: 9000000, rate: 23 },
      { bracket: 5, min: 9000000, max: 18000000, rate: 33 },
      { bracket: 6, min: 18000000, max: 40000000, rate: 40 },
      { bracket: 7, min: 40000000, max: Infinity, rate: 45 }
    ],
    presets: [3200000, 4500000, 6000000, 8500000, 12000000, 20000000],
    notes: 'National Tax (with 2.1% Surtax), Resident Tax (10% Juminzei), Employment Deduction & Shakai Hoken.',
    notesVi: 'Thuế quốc gia (gồm 2.1% Surtax), Thuế cư trú Juminzei (10%), Giảm trừ thu nhập tiền lương & Shakai Hoken.'
  },

  // 6. SINGAPORE (Singapore)
  SG: {
    id: 'SG',
    name: 'Singapore',
    nameVi: 'Singapore',
    flag: '🇸🇬',
    currencyCode: 'SGD',
    currencySymbol: 'S$',
    decimals: 2,
    defaultPeriod: 'monthly',
    defaultSalary: 6500,
    personalAllowanceAnnual: 20000, // Zero tax bracket
    dependentAllowanceAnnual: 4000, // Qualifying Child Relief
    personalAllowanceLabel: 'Zero Tax Bracket & Earned Income Relief (S$20,000)',
    dependentAllowanceLabel: 'Child Relief / Dependent (S$4,000)',
    subRegionLabel: 'Residency & CPF Status',
    subRegionLabelVi: 'Tư Cách Cư Trú & Chế Độ Quỹ CPF',
    defaultSubRegionId: 'citizen',
    subRegions: [
      { id: 'citizen', name: 'Singapore Citizen / PR (Standard CPF: 20% Employee / 17% Employer)', nameVi: 'Công dân / Thường trú nhân (Đóng quỹ CPF: 20% NLĐ / 17% DN)' },
      { id: 'foreigner', name: 'Foreigner / Employment Pass / S-Pass (0% CPF)', nameVi: 'Người nước ngoài / Thẻ EP, S-Pass (0% CPF - Chỉ đóng thuế IRAS)' }
    ],
    employeeInsurances: [
      { id: 'cpf', name: 'Central Provident Fund (CPF 20%)', nameVi: 'Quỹ Tiết kiệm Trung ương (CPF NLĐ 20%)', rate: 20.0, capMonthly: 6800, capAnnual: 102000 * 0.20, description: '20% up to Ordinary Wage ceiling S$6,800/mo (age <= 55)' }
    ],
    employerContributions: [
      { id: 'comp_cpf', name: 'Employer CPF Contribution (17%)', nameVi: 'Đóng góp Quỹ CPF từ NSDLĐ (17%)', rate: 17.0, capMonthly: 6800, capAnnual: 102000 * 0.17 },
      { id: 'comp_sdl', name: 'Skills Development Levy (SDL)', nameVi: 'Quỹ phát triển kỹ năng (SDL)', rate: 0.25, capMonthly: 11.25 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 20000, rate: 0 },
      { bracket: 2, min: 20000, max: 30000, rate: 2 },
      { bracket: 3, min: 30000, max: 40000, rate: 3.5 },
      { bracket: 4, min: 40000, max: 80000, rate: 7 },
      { bracket: 5, min: 80000, max: 120000, rate: 11.5 },
      { bracket: 6, min: 120000, max: 160000, rate: 15 },
      { bracket: 7, min: 160000, max: 200000, rate: 18 },
      { bracket: 8, min: 200000, max: 240000, rate: 19 },
      { bracket: 9, min: 240000, max: 280000, rate: 19.5 },
      { bracket: 10, min: 280000, max: 320000, rate: 20 },
      { bracket: 11, min: 320000, max: 500000, rate: 22 },
      { bracket: 12, min: 500000, max: 1000000, rate: 23 },
      { bracket: 13, min: 1000000, max: Infinity, rate: 24 }
    ],
    presets: [3500, 5000, 7500, 11000, 16000, 25000],
    notes: 'IRAS Resident Tax Rates & CPF Board Ordinary Wage Ceilings (Citizen/PR vs EP Foreigner).',
    notesVi: 'Biểu thuế thu nhập cư trú IRAS, trần quỹ hưu trí CPF Singapore và chế độ riêng cho người nước ngoài.'
  },

  // 7. AUSTRALIA (Úc)
  AU: {
    id: 'AU',
    name: 'Australia',
    nameVi: 'Úc (Australia)',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    decimals: 2,
    defaultPeriod: 'annual',
    defaultSalary: 88000,
    personalAllowanceAnnual: 18200, // Tax-free threshold ($18,200)
    dependentAllowanceAnnual: 0,
    personalAllowanceLabel: 'Tax-Free Threshold (A$18,200)',
    dependentAllowanceLabel: 'Dependent Offset / Rebates',
    subRegionLabel: 'Superannuation Structure',
    subRegionLabelVi: 'Cơ Cấu Quỹ Hưu Trí Super (11.5%)',
    defaultSubRegionId: 'exclusive',
    subRegions: [
      { id: 'exclusive', name: 'Base Salary + Superannuation on top (11.5%)', nameVi: 'Lương thỏa thuận + Super 11.5% DN đóng thêm (Chuẩn phổ biến)' },
      { id: 'inclusive', name: 'Total Remuneration Package (Super 11.5% included)', nameVi: 'Gói tổng đãi ngộ TRP (Đã gồm 11.5% Super trong Lương Gross)' }
    ],
    employeeInsurances: [
      { id: 'medicare', name: 'Medicare Levy (2.0%)', nameVi: 'Thuế Medicare Levy (2.0%)', rate: 2.0, minAnnual: 26000, description: '2% of taxable income to fund national healthcare (Exempt under $26k)' }
    ],
    employerContributions: [
      { id: 'comp_super', name: 'Superannuation Guarantee (Super 11.5%)', nameVi: 'Quỹ hưu trí Superannuation NSDLĐ (11.5%)', rate: 11.5, description: '11.5% compulsory employer contribution' }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 18200, rate: 0 },
      { bracket: 2, min: 18200, max: 45000, rate: 16 }, // Stage 3 tax cuts 2024-2025
      { bracket: 3, min: 45000, max: 135000, rate: 30 },
      { bracket: 4, min: 135000, max: 190000, rate: 37 },
      { bracket: 5, min: 190000, max: Infinity, rate: 45 }
    ],
    presets: [55000, 75000, 95000, 125000, 165000, 230000],
    notes: 'ATO Individual income tax (Stage 3 Tax Cuts 2024-2025), Medicare Levy 2% & Super 11.5%.',
    notesVi: 'Biểu thuế ATO cải cách Stage 3 (16%, 30%, 37%, 45%), Medicare Levy 2% và Quỹ hưu trí Super 11.5%.'
  },

  // 8. CANADA (Canada)
  CA: {
    id: 'CA',
    name: 'Canada',
    nameVi: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    decimals: 2,
    defaultPeriod: 'annual',
    defaultSalary: 72000,
    personalAllowanceAnnual: 15705, // Basic Personal Amount (Federal 2024)
    dependentAllowanceAnnual: 2500, // Child Credit
    personalAllowanceLabel: 'Basic Personal Amount (Federal BPA: C$15,705)',
    dependentAllowanceLabel: 'Child & Dependent Credit',
    subRegionLabel: 'Province / Territorial Tax',
    subRegionLabelVi: 'Thuế Tỉnh Bang Canada (Provincial Tax)',
    defaultSubRegionId: 'ON',
    subRegions: [
      { id: 'ON', name: 'Ontario (ON - Progressive avg ~8.5%)', nameVi: 'Ontario (Thuế tỉnh bang ON bình quân ~8.5%)', rate: 8.5 },
      { id: 'BC', name: 'British Columbia (BC - Progressive avg ~7.7%)', nameVi: 'British Columbia (Thuế tỉnh bang BC bình quân ~7.7%)', rate: 7.7 },
      { id: 'AB', name: 'Alberta (AB - Progressive avg ~10.0%)', nameVi: 'Alberta (Thuế tỉnh bang AB bình quân ~10.0%)', rate: 10.0 },
      { id: 'QC', name: 'Quebec (QC - Progressive avg ~15.0%)', nameVi: 'Quebec (Thuế tỉnh bang QC bình quân ~15.0%)', rate: 15.0 },
      { id: 'average', name: 'Average Canadian Provincial Tax (9.0%)', nameVi: 'Mức bình quân các tỉnh bang Canada (9.0%)', rate: 9.0 },
      { id: 'none', name: 'Federal Tax Only (0% Provincial)', nameVi: 'Chỉ tính Thuế Liên bang (0% Tỉnh bang)', rate: 0 }
    ],
    employeeInsurances: [
      { id: 'cpp', name: 'Canada Pension Plan (CPP 5.95%)', nameVi: 'Quỹ Hưu trí Canada (CPP 5.95%)', rate: 5.95, minAnnual: 3500, capAnnual: 3867.50, description: '5.95% between $3,500 and $68,500 (Max C$3,867.50)' },
      { id: 'ei', name: 'Employment Insurance (EI 1.66%)', nameVi: 'Bảo hiểm Việc làm (EI 1.66%)', rate: 1.66, capAnnual: 1049.12, description: '1.66% up to $63,200 (Max C$1,049.12)' }
    ],
    employerContributions: [
      { id: 'comp_cpp', name: 'Employer CPP Match', nameVi: 'Đóng góp Hưu trí CPP từ NSDLĐ', rate: 5.95, minAnnual: 3500, capAnnual: 3867.50 },
      { id: 'comp_ei', name: 'Employer EI Match (1.4x)', nameVi: 'Đóng góp EI NSDLĐ (1.4 lần NLĐ)', rate: 2.32, capAnnual: 1468.77 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 55867, rate: 15 },
      { bracket: 2, min: 55867, max: 111733, rate: 20.5 },
      { bracket: 3, min: 111733, max: 173205, rate: 26 },
      { bracket: 4, min: 173205, max: 246752, rate: 29 },
      { bracket: 5, min: 246752, max: Infinity, rate: 33 }
    ],
    presets: [45000, 60000, 80000, 105000, 145000, 190000],
    notes: 'CRA Federal Income Tax, Basic Personal Amount $15,705, CPP, EI & Provincial tax options.',
    notesVi: 'Biểu thuế Liên bang CRA, Giảm trừ cá nhân $15.705, Quỹ hưu trí CPP, Việc làm EI & Thuế tỉnh bang.'
  },

  // 9. UNIVERSAL CUSTOM (Quốc tế tự do / Tùy chỉnh bất kỳ quốc gia nào)
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Universal / Custom Country',
    nameVi: 'Quốc tế Tự do / Tùy chỉnh',
    flag: '🌐',
    currencyCode: 'USD',
    currencySymbol: '$',
    decimals: 2,
    defaultPeriod: 'monthly',
    defaultSalary: 5000,
    personalAllowanceAnnual: 10000,
    dependentAllowanceAnnual: 2000,
    personalAllowanceLabel: 'Personal Tax-free Allowance',
    dependentAllowanceLabel: 'Dependent Allowance per person',
    subRegionLabel: 'Regional / Local Surcharge',
    subRegionLabelVi: 'Phụ Phí / Thuế Địa Phương Bổ Sung',
    defaultSubRegionId: 'none',
    subRegions: [
      { id: 'none', name: 'No Additional Local Tax (0%)', nameVi: 'Không áp dụng thuế địa phương (0%)', rate: 0 },
      { id: 'local_5', name: 'Standard Local Surcharge (5%)', nameVi: 'Thuế địa phương tiêu chuẩn (5%)', rate: 5 },
      { id: 'custom', name: 'Custom Local Tax Rate (%)', nameVi: 'Tùy chỉnh tỷ lệ thuế địa phương (%)', rate: 5 }
    ],
    employeeInsurances: [
      { id: 'soc_sec', name: 'Social Security / Pension', nameVi: 'Bảo hiểm Xã hội / Hưu trí', rate: 5.0, description: 'Customizable pension contribution' },
      { id: 'health', name: 'Health & Medical Insurance', nameVi: 'Bảo hiểm Y tế / Sức khỏe', rate: 2.0, description: 'Customizable medical insurance' },
      { id: 'unemp', name: 'Unemployment Insurance', nameVi: 'Bảo hiểm Thất nghiệp', rate: 1.0, description: 'Customizable unemployment protection' }
    ],
    employerContributions: [
      { id: 'comp_soc', name: 'Employer Social Contribution', nameVi: 'Khoản đóng góp NSDLĐ', rate: 8.0 },
      { id: 'comp_health', name: 'Employer Health Insurance', nameVi: 'Y tế NSDLĐ đóng', rate: 3.0 }
    ],
    taxBracketsAnnual: [
      { bracket: 1, min: 0, max: 10000, rate: 0 },
      { bracket: 2, min: 10000, max: 30000, rate: 10 },
      { bracket: 3, min: 30000, max: 70000, rate: 20 },
      { bracket: 4, min: 70000, max: 120000, rate: 28 },
      { bracket: 5, min: 120000, max: Infinity, rate: 35 }
    ],
    presets: [2000, 3500, 5000, 8000, 12000, 20000],
    notes: 'Universal mode: Customize your own tax brackets, insurance deductions, allowances & currency.',
    notesVi: 'Chế độ Quốc tế Tổng quát: Tự do điều chỉnh các bậc thuế, tỷ lệ bảo hiểm và tiền tệ của bất kỳ quốc gia nào.'
  }
};

// Period conversion factors relative to Annual (1 year)
export const PERIOD_FACTORS: Record<PayPeriod, number> = {
  annual: 1,
  monthly: 12,
  biweekly: 26, // 26 bi-weekly periods per year
  weekly: 52, // 52 weeks per year
  hourly: 2080 // 40 hours/week * 52 weeks = 2,080 hours per year
};

export const PERIOD_LABELS: Record<PayPeriod, { en: string; vi: string; shortEn: string; shortVi: string }> = {
  annual: { en: 'Annual (Yearly)', vi: 'Hàng năm', shortEn: '/yr', shortVi: '/năm' },
  monthly: { en: 'Monthly', vi: 'Hàng tháng', shortEn: '/mo', shortVi: '/tháng' },
  biweekly: { en: 'Bi-weekly (2 weeks)', vi: '2 Tuần (Bi-weekly)', shortEn: '/2w', shortVi: '/2t' },
  weekly: { en: 'Weekly', vi: 'Hàng tuần', shortEn: '/wk', shortVi: '/tuần' },
  hourly: { en: 'Hourly (40h/wk)', vi: 'Theo giờ', shortEn: '/hr', shortVi: '/giờ' }
};
