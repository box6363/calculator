import React, { useState, useMemo } from 'react';
import {
  Building2,
  DollarSign,
  Users,
  ShieldCheck,
  Check,
  Copy,
  Globe,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Info,
  Layers,
  Printer,
  Download,
  FileDown,
  FileText,
  Eye,
  X,
  Loader2,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { exportElementPagesToPdf, PdfExportResult } from '../../utils/pdfExportHelper';
import { useCurrency, CurrencyCode } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export interface TaxBracket {
  id: string;
  max: number; // Maximum income for this bracket (use Infinity for top bracket)
  rate: number; // Percentage, e.g. 5 for 5%
  label: string;
}

export interface InsuranceItem {
  id: string;
  name: string;
  rate: number; // Percentage, e.g. 8 for 8%
  salaryCap: number; // Max salary base, 0 for uncapped
  enabled: boolean;
  note?: string;
}

export interface AdditionalIncomeItem {
  id: string;
  name: string;
  amount: number;
  isTaxable: boolean;
}

export interface DeductionItem {
  id: string;
  name: string;
  amount: number;
}

interface RegionConfig {
  id: string;
  name: string;
  flag: string;
  currencyCode: CurrencyCode;
  defaultGross: number;
  selfDeduction: number;
  dependentDeduction: number;
  insurances: InsuranceItem[];
  brackets: TaxBracket[];
  quickAmounts: number[];
  regionNotes?: string;
}

const REGION_CONFIGS: Record<string, RegionConfig> = {
  vn: {
    id: 'vn',
    name: 'Việt Nam',
    flag: '🇻🇳',
    currencyCode: 'VND',
    defaultGross: 35000000,
    selfDeduction: 11000000,
    dependentDeduction: 4400000,
    quickAmounts: [15000000, 25000000, 35000000, 50000000, 80000000],
    regionNotes: 'Việt Nam: Giảm trừ bản thân 11tr, người phụ thuộc 4.4tr/tháng. BHXH 8% (trần 46.8tr), BHYT 1.5% (trần 46.8tr), BHTN 1% (trần 99.2tr Vùng I). Biểu thuế lũy tiến từng phần 7 bậc từ 5% đến 35%.',
    insurances: [
      { id: 'bhxh', name: 'BHXH (Bảo hiểm xã hội 8%)', rate: 8.0, salaryCap: 46800000, enabled: true, note: 'Trần 46.8 triệu (20 lần lương cơ sở)' },
      { id: 'bhyt', name: 'BHYT (Bảo hiểm y tế 1.5%)', rate: 1.5, salaryCap: 46800000, enabled: true, note: 'Trần 46.8 triệu' },
      { id: 'bhtn', name: 'BHTN (Bảo hiểm thất nghiệp 1%)', rate: 1.0, salaryCap: 99200000, enabled: true, note: 'Trần 99.2 triệu (Vùng I)' },
    ],
    brackets: [
      { id: 'vn_b1', max: 5000000, rate: 5, label: 'Bậc 1: Đến 5 triệu (5%)' },
      { id: 'vn_b2', max: 10000000, rate: 10, label: 'Bậc 2: 5 đến 10 triệu (10%)' },
      { id: 'vn_b3', max: 18000000, rate: 15, label: 'Bậc 3: 10 đến 18 triệu (15%)' },
      { id: 'vn_b4', max: 32000000, rate: 20, label: 'Bậc 4: 18 đến 32 triệu (20%)' },
      { id: 'vn_b5', max: 52000000, rate: 25, label: 'Bậc 5: 32 đến 52 triệu (25%)' },
      { id: 'vn_b6', max: 80000000, rate: 30, label: 'Bậc 6: 52 đến 80 triệu (30%)' },
      { id: 'vn_b7', max: Infinity, rate: 35, label: 'Bậc 7: Trên 80 triệu (35%)' },
    ]
  },
  us: {
    id: 'us',
    name: 'Hoa Kỳ (United States)',
    flag: '🇺🇸',
    currencyCode: 'USD',
    defaultGross: 6500,
    selfDeduction: 1216.67, // $14,600 / 12
    dependentDeduction: 166.67, // Child tax credit monthly equivalent
    quickAmounts: [3000, 5000, 7500, 12000, 20000],
    regionNotes: 'Hoa Kỳ (US Federal 2024): Giảm trừ tiêu chuẩn cá nhân $14,600/năm. Đóng góp FICA: An sinh xã hội Social Security 6.2% (trần $14,050/tháng) và Medicare 1.45% (không trần). Biểu thuế 7 bậc từ 10% đến 37%.',
    insurances: [
      { id: 'us_ss', name: 'Social Security (FICA An sinh xã hội 6.2%)', rate: 6.2, salaryCap: 14050, enabled: true, note: 'Trần $14,050/tháng' },
      { id: 'us_med', name: 'Medicare (FICA Y tế 1.45%)', rate: 1.45, salaryCap: 0, enabled: true, note: 'Không giới hạn trần' },
    ],
    brackets: [
      { id: 'us_b1', max: 966.67, rate: 10, label: 'Tier 1: Đến $967/tháng (10%)' },
      { id: 'us_b2', max: 3929.17, rate: 12, label: 'Tier 2: $967 - $3,929 (12%)' },
      { id: 'us_b3', max: 8377.08, rate: 22, label: 'Tier 3: $3,929 - $8,377 (22%)' },
      { id: 'us_b4', max: 15995.83, rate: 24, label: 'Tier 4: $8,377 - $15,996 (24%)' },
      { id: 'us_b5', max: 20310.42, rate: 32, label: 'Tier 5: $15,996 - $20,310 (32%)' },
      { id: 'us_b6', max: 50779.17, rate: 35, label: 'Tier 6: $20,310 - $50,779 (35%)' },
      { id: 'us_b7', max: Infinity, rate: 37, label: 'Tier 7: Trên $50,779 (37%)' },
    ]
  },
  uk: {
    id: 'uk',
    name: 'Vương quốc Anh (UK)',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    defaultGross: 3500,
    selfDeduction: 1047.5, // £12,570 / 12 Personal Allowance
    dependentDeduction: 0,
    quickAmounts: [2000, 3500, 5000, 8000, 15000],
    regionNotes: 'Vương quốc Anh: Giảm trừ cá nhân £12,570/năm (£1,047.50/tháng). Bảo hiểm quốc gia National Insurance 8% (trần £4,189/tháng). Biểu thuế PAYE từ 20% đến 45%.',
    insurances: [
      { id: 'uk_ni', name: 'National Insurance (Bảo hiểm quốc gia 8%)', rate: 8.0, salaryCap: 4189, enabled: true, note: 'Trần £4,189/tháng' },
    ],
    brackets: [
      { id: 'uk_b1', max: 3141.67, rate: 20, label: 'Basic Rate (Đến £3,142/tháng): 20%' },
      { id: 'uk_b2', max: 10429.17, rate: 40, label: 'Higher Rate (£3,142 - £10,429): 40%' },
      { id: 'uk_b3', max: Infinity, rate: 45, label: 'Additional Rate (Trên £10,429): 45%' },
    ]
  },
  jp: {
    id: 'jp',
    name: 'Nhật Bản (Japan)',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    defaultGross: 450000,
    selfDeduction: 40000, // Kiso Kojo ~ 480k JPY/year / 12
    dependentDeduction: 31667, // Fuyo Kojo ~ 380k JPY/year / 12
    quickAmounts: [250000, 350000, 450000, 700000, 1200000],
    regionNotes: 'Nhật Bản: Bảo hiểm xã hội Shakai Hoken gồm Kosei Nenkin (Hưu trí 9.15%, trần 65 vạn JPY), Kenko Hoken (Y tế 5.0%, trần 139 vạn JPY), Koyo Hoken (Việc làm 0.6%). Thuế Shotokuzei 7 bậc từ 5% đến 45%.',
    insurances: [
      { id: 'jp_nenkin', name: 'Kosei Nenkin (Hưu trí厚生年金 9.15%)', rate: 9.15, salaryCap: 650000, enabled: true, note: 'Trần 650,000 JPY' },
      { id: 'jp_kenko', name: 'Kenko Hoken (Y tế健康保険 5%)', rate: 5.0, salaryCap: 1390000, enabled: true, note: 'Trần 1,390,000 JPY' },
      { id: 'jp_koyo', name: 'Koyo Hoken (Việc làm雇用保険 0.6%)', rate: 0.6, salaryCap: 0, enabled: true, note: 'Không trần' },
    ],
    brackets: [
      { id: 'jp_b1', max: 162500, rate: 5, label: 'Bậc 1: Đến 16.25 vạn JPY (5%)' },
      { id: 'jp_b2', max: 275000, rate: 10, label: 'Bậc 2: 16.25 - 27.5 vạn (10%)' },
      { id: 'jp_b3', max: 580000, rate: 20, label: 'Bậc 3: 27.5 - 58 vạn (20%)' },
      { id: 'jp_b4', max: 750000, rate: 23, label: 'Bậc 4: 58 - 75 vạn (23%)' },
      { id: 'jp_b5', max: 1500000, rate: 33, label: 'Bậc 5: 75 - 150 vạn (33%)' },
      { id: 'jp_b6', max: 3330000, rate: 40, label: 'Bậc 6: 150 - 333 vạn (40%)' },
      { id: 'jp_b7', max: Infinity, rate: 45, label: 'Bậc 7: Trên 333 vạn JPY (45%)' },
    ]
  },
  de: {
    id: 'de',
    name: 'Đức (Germany)',
    flag: '🇩🇪',
    currencyCode: 'EUR',
    defaultGross: 4200,
    selfDeduction: 967, // Grundfreibetrag €11,604 / 12
    dependentDeduction: 250, // Kindergeld / Kinderfreibetrag
    quickAmounts: [2500, 3500, 4500, 7000, 12000],
    regionNotes: 'Đức: An sinh xã hội gồm Hưu trí (9.3%, trần €7,550), Y tế (7.3%, trần €5,175), Chăm sóc (2.2%), Thất nghiệp (1.3%). Thuế thu nhập Einkommensteuer lũy tiến 14% đến 45%.',
    insurances: [
      { id: 'de_renten', name: 'Rentenversicherung (Hưu trí 9.3%)', rate: 9.3, salaryCap: 7550, enabled: true, note: 'Trần €7,550/tháng' },
      { id: 'de_kranken', name: 'Krankenversicherung (Y tế 7.3%)', rate: 7.3, salaryCap: 5175, enabled: true, note: 'Trần €5,175/tháng' },
      { id: 'de_pflege', name: 'Pflegeversicherung (Chăm sóc 2.2%)', rate: 2.2, salaryCap: 5175, enabled: true, note: 'Trần €5,175/tháng' },
      { id: 'de_arbeits', name: 'Arbeitslosenversicherung (Thất nghiệp 1.3%)', rate: 1.3, salaryCap: 7550, enabled: true, note: 'Trần €7,550/tháng' },
    ],
    brackets: [
      { id: 'de_b1', max: 1400, rate: 14, label: 'Bậc 1: Đến €1,400 (14%)' },
      { id: 'de_b2', max: 5500, rate: 24, label: 'Bậc 2: €1,400 - €5,500 (24%)' },
      { id: 'de_b3', max: 23000, rate: 42, label: 'Bậc 3: €5,500 - €23,000 (42%)' },
      { id: 'de_b4', max: Infinity, rate: 45, label: 'Bậc 4: Trên €23,000 (45%)' },
    ]
  },
  sg: {
    id: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    currencyCode: 'SGD',
    defaultGross: 6000,
    selfDeduction: 833, // Earned income relief ~$1,000 - $8,000 / 12
    dependentDeduction: 333,
    quickAmounts: [3000, 5000, 8000, 14000, 25000],
    regionNotes: 'Singapore: Quỹ phòng xa CPF người lao động đóng 20% (trần tiền lương tính CPF là $6,800/tháng). Biểu thuế thu nhập cá nhân IRAS lũy tiến từ 0% đến 24%.',
    insurances: [
      { id: 'sg_cpf', name: 'CPF Employee Contribution (Quỹ phòng xa 20%)', rate: 20.0, salaryCap: 6800, enabled: true, note: 'Trần $6,800/tháng' },
    ],
    brackets: [
      { id: 'sg_b1', max: 1667, rate: 0, label: 'Bậc 1: Đến $1,667 (0% Miễn thuế)' },
      { id: 'sg_b2', max: 2500, rate: 2, label: 'Bậc 2: $1,667 - $2,500 (2%)' },
      { id: 'sg_b3', max: 3333, rate: 3.5, label: 'Bậc 3: $2,500 - $3,333 (3.5%)' },
      { id: 'sg_b4', max: 6667, rate: 7, label: 'Bậc 4: $3,333 - $6,667 (7%)' },
      { id: 'sg_b5', max: 10000, rate: 11.5, label: 'Bậc 5: $6,667 - $10,000 (11.5%)' },
      { id: 'sg_b6', max: 16667, rate: 18, label: 'Bậc 6: $10,000 - $16,667 (18%)' },
      { id: 'sg_b7', max: Infinity, rate: 24, label: 'Bậc 7: Trên $16,667 (24%)' },
    ]
  },
  au: {
    id: 'au',
    name: 'Úc (Australia)',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    defaultGross: 7500,
    selfDeduction: 1517, // $18,200 / 12 Tax-free threshold
    dependentDeduction: 0,
    quickAmounts: [4000, 6000, 8000, 12000, 20000],
    regionNotes: 'Úc (ATO 2024-25): Miễn thuế cơ bản $18,200/năm. Bảo hiểm y tế Medicare Levy 2.0%. Thuế suất lũy tiến từ 16% đến 45%.',
    insurances: [
      { id: 'au_medicare', name: 'Medicare Levy (Y tế Úc 2.0%)', rate: 2.0, salaryCap: 0, enabled: true, note: 'Không giới hạn trần' },
    ],
    brackets: [
      { id: 'au_b1', max: 3750, rate: 16, label: 'Bậc 1: Đến $3,750 (16%)' },
      { id: 'au_b2', max: 11250, rate: 30, label: 'Bậc 2: $3,750 - $11,250 (30%)' },
      { id: 'au_b3', max: 15833, rate: 37, label: 'Bậc 3: $11,250 - $15,833 (37%)' },
      { id: 'au_b4', max: Infinity, rate: 45, label: 'Bậc 4: Trên $15,833 (45%)' },
    ]
  },
  ca: {
    id: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    defaultGross: 6000,
    selfDeduction: 1309, // $15,705 / 12
    dependentDeduction: 150,
    quickAmounts: [3500, 5000, 7500, 11000, 18000],
    regionNotes: 'Canada (CRA 2024): Kế hoạch hưu trí CPP 5.95% (trần $5,708/tháng), Bảo hiểm việc làm EI 1.66% (trần $5,266/tháng). Thuế liên bang 5 bậc từ 15% đến 33%.',
    insurances: [
      { id: 'ca_cpp', name: 'CPP (Hưu trí Canada 5.95%)', rate: 5.95, salaryCap: 5708, enabled: true, note: 'Trần $5,708/tháng' },
      { id: 'ca_ei', name: 'EI (Bảo hiểm việc làm 1.66%)', rate: 1.66, salaryCap: 5266, enabled: true, note: 'Trần $5,266/tháng' },
    ],
    brackets: [
      { id: 'ca_b1', max: 4655, rate: 15, label: 'Bậc 1: Đến $4,655 (15%)' },
      { id: 'ca_b2', max: 9311, rate: 20.5, label: 'Bậc 2: $4,655 - $9,311 (20.5%)' },
      { id: 'ca_b3', max: 14434, rate: 26, label: 'Bậc 3: $9,311 - $14,434 (26%)' },
      { id: 'ca_b4', max: 20562, rate: 29, label: 'Bậc 4: $14,434 - $20,562 (29%)' },
      { id: 'ca_b5', max: Infinity, rate: 33, label: 'Bậc 5: Trên $20,562 (33%)' },
    ]
  },
  custom: {
    id: 'custom',
    name: 'Khu vực tùy chỉnh',
    flag: '🌐',
    currencyCode: 'USD',
    defaultGross: 5000,
    selfDeduction: 1000,
    dependentDeduction: 200,
    quickAmounts: [2000, 5000, 8000, 15000, 30000],
    regionNotes: 'Chế độ hoàn toàn tự do: Tùy biến mọi mức thuế suất, ngưỡng lũy tiến, các loại BHXH, BHYT và các khoản cộng trừ theo nhu cầu.',
    insurances: [
      { id: 'custom_ins1', name: 'Bảo hiểm Xã hội (Social Insurance)', rate: 8.0, salaryCap: 0, enabled: true, note: 'Tùy chỉnh' },
      { id: 'custom_ins2', name: 'Bảo hiểm Y tế (Health Insurance)', rate: 2.0, salaryCap: 0, enabled: true, note: 'Tùy chỉnh' },
    ],
    brackets: [
      { id: 'c_b1', max: 1000, rate: 5, label: 'Bậc 1: Đến 1,000 (5%)' },
      { id: 'c_b2', max: 3000, rate: 10, label: 'Bậc 2: 1,000 - 3,000 (10%)' },
      { id: 'c_b3', max: 6000, rate: 20, label: 'Bậc 3: 3,000 - 6,000 (20%)' },
      { id: 'c_b4', max: Infinity, rate: 30, label: 'Bậc 4: Trên 6,000 (30%)' },
    ]
  }
};


export const TaxCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney, setCurrency } = useCurrency();

  // 1. Selected Region & Vietnam Minimum Wage Tiers (Nghị định 74/2024/NĐ-CP)
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => {
    return currency === 'VND' ? 'vn' : 'us';
  });

  const VN_REGION_WAGES: Record<string, { minWage: number; cap: number; name: string }> = {
    '1': { minWage: 4960000, cap: 99200000, name: 'Vùng I (Hà Nội, TP.HCM, Hải Phòng...)' },
    '2': { minWage: 4410000, cap: 88200000, name: 'Vùng II (Đà Nẵng, Cần Thơ, Nha Trang...)' },
    '3': { minWage: 3860000, cap: 77200000, name: 'Vùng III (Các TP trực thuộc tỉnh còn lại)' },
    '4': { minWage: 3450000, cap: 69000000, name: 'Vùng IV (Các địa bàn còn lại)' },
  };
  const [vnRegionTier, setVnRegionTier] = useState<'1' | '2' | '3' | '4'>('1');

  const activePreset = REGION_CONFIGS[selectedRegionId] || REGION_CONFIGS.vn;

  // 2. Core Inputs
  const [grossMonthly, setGrossMonthly] = useState<number>(activePreset.defaultGross);
  const [dependents, setDependents] = useState<number>(1);
  const [selfDeduction, setSelfDeduction] = useState<number>(activePreset.selfDeduction);
  const [dependentDeduction, setDependentDeduction] = useState<number>(activePreset.dependentDeduction);

  // 3. Customizable Insurance Items (BHXH, BHYT, BHTN...)
  const [insurances, setInsurances] = useState<InsuranceItem[]>(() => {
    const list = activePreset.insurances.map(item => ({ ...item }));
    if (selectedRegionId === 'vn') {
      const wageInfo = VN_REGION_WAGES['1'];
      return list.map(item => {
        if (item.id === 'bhtn') {
          return {
            ...item,
            salaryCap: wageInfo.cap,
            note: `Trần ${(wageInfo.cap / 1000000).toFixed(1)} triệu (20× LTT Vùng 1 theo NĐ 74/2024)`
          };
        }
        return item;
      });
    }
    return list;
  });

  // 4. Customizable Tax Brackets
  const [brackets, setBrackets] = useState<TaxBracket[]>(() => [
    ...activePreset.brackets.map(b => ({ ...b }))
  ]);

  // 5. Dynamic "+" Items: Additional Incomes & Deductions
  const [customIncomes, setCustomIncomes] = useState<AdditionalIncomeItem[]>([]);
  const [customDeductions, setCustomDeductions] = useState<DeductionItem[]>([]);

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'main' | 'insurances' | 'brackets'>('main');

  // New item draft inputs for modal/in-line add
  const [newIncomeName, setNewIncomeName] = useState<string>('');
  const [newIncomeAmount, setNewIncomeAmount] = useState<string>('');
  const [newIncomeTaxable, setNewIncomeTaxable] = useState<boolean>(true);
  const [showAddIncome, setShowAddIncome] = useState<boolean>(false);

  const [newDeductionName, setNewDeductionName] = useState<string>('');
  const [newDeductionAmount, setNewDeductionAmount] = useState<string>('');
  const [showAddDeduction, setShowAddDeduction] = useState<boolean>(false);

  const [newInsName, setNewInsName] = useState<string>('');
  const [newInsRate, setNewInsRate] = useState<string>('');
  const [newInsCap, setNewInsCap] = useState<string>('');
  const [showAddIns, setShowAddIns] = useState<boolean>(false);

  const handleVnRegionChange = (tier: '1' | '2' | '3' | '4') => {
    setVnRegionTier(tier);
    const wageInfo = VN_REGION_WAGES[tier];
    setInsurances(prev => prev.map(ins => {
      if (ins.id === 'bhtn') {
        return {
          ...ins,
          salaryCap: wageInfo.cap,
          note: `Trần ${(wageInfo.cap / 1000000).toFixed(1)} triệu (20× LTT ${wageInfo.minWage.toLocaleString('vi-VN')}đ - Vùng ${tier} theo NĐ 74/2024)`
        };
      }
      return ins;
    }));
  };

  // When user switches Region
  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    const config = REGION_CONFIGS[regionId];
    if (config) {
      setGrossMonthly(config.defaultGross);
      setSelfDeduction(config.selfDeduction);
      setDependentDeduction(config.dependentDeduction);
      if (regionId === 'vn') {
        const wageInfo = VN_REGION_WAGES[vnRegionTier];
        setInsurances(config.insurances.map(i => {
          if (i.id === 'bhtn') {
            return {
              ...i,
              salaryCap: wageInfo.cap,
              note: `Trần ${(wageInfo.cap / 1000000).toFixed(1)} triệu (20× LTT Vùng ${vnRegionTier} theo NĐ 74/2024)`
            };
          }
          return { ...i };
        }));
      } else {
        setInsurances(config.insurances.map(i => ({ ...i })));
      }
      setBrackets(config.brackets.map(b => ({ ...b })));
      setCustomIncomes([]);
      setCustomDeductions([]);
      if (config.currencyCode && config.currencyCode !== currency) {
        setCurrency(config.currencyCode);
      }
    }
  };

  // Reset to current region default
  const handleResetToPreset = () => {
    const config = activePreset;
    setGrossMonthly(config.defaultGross);
    setDependents(1);
    setSelfDeduction(config.selfDeduction);
    setDependentDeduction(config.dependentDeduction);
    setInsurances(config.insurances.map(i => ({ ...i })));
    setBrackets(config.brackets.map(b => ({ ...b })));
    setCustomIncomes([]);
    setCustomDeductions([]);
  };

  // --- Dynamic Item Handlers ---
  const handleAddCustomIncome = () => {
    const amt = parseFloat(newIncomeAmount);
    if (!newIncomeName.trim() || isNaN(amt) || amt <= 0) return;
    setCustomIncomes(prev => [
      ...prev,
      {
        id: 'inc_' + Date.now(),
        name: newIncomeName.trim(),
        amount: amt,
        isTaxable: newIncomeTaxable
      }
    ]);
    setNewIncomeName('');
    setNewIncomeAmount('');
    setShowAddIncome(false);
  };

  const handleRemoveCustomIncome = (id: string) => {
    setCustomIncomes(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomDeduction = () => {
    const amt = parseFloat(newDeductionAmount);
    if (!newDeductionName.trim() || isNaN(amt) || amt <= 0) return;
    setCustomDeductions(prev => [
      ...prev,
      {
        id: 'ded_' + Date.now(),
        name: newDeductionName.trim(),
        amount: amt
      }
    ]);
    setNewDeductionName('');
    setNewDeductionAmount('');
    setShowAddDeduction(false);
  };

  const handleRemoveCustomDeduction = (id: string) => {
    setCustomDeductions(prev => prev.filter(item => item.id !== id));
  };

  const handleAddInsuranceItem = () => {
    const rateVal = parseFloat(newInsRate);
    const capVal = parseFloat(newInsCap) || 0;
    if (!newInsName.trim() || isNaN(rateVal) || rateVal < 0) return;
    setInsurances(prev => [
      ...prev,
      {
        id: 'ins_' + Date.now(),
        name: newInsName.trim(),
        rate: rateVal,
        salaryCap: capVal,
        enabled: true,
        note: capVal > 0 ? `Trần ${capVal.toLocaleString()}` : 'Không trần'
      }
    ]);
    setNewInsName('');
    setNewInsRate('');
    setNewInsCap('');
    setShowAddIns(false);
  };

  const handleRemoveInsurance = (id: string) => {
    setInsurances(prev => prev.filter(i => i.id !== id));
  };

  const handleToggleInsurance = (id: string) => {
    setInsurances(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  const handleUpdateInsuranceRate = (id: string, newRate: number) => {
    setInsurances(prev => prev.map(i => i.id === id ? { ...i, rate: Math.max(0, newRate) } : i));
  };

  // --- Bracket Editing Handlers ---
  const handleUpdateBracket = (index: number, field: 'max' | 'rate' | 'label', value: any) => {
    setBrackets(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddBracket = () => {
    setBrackets(prev => {
      const last = prev[prev.length - 1];
      const prevMax = last && last.max !== Infinity ? last.max : 50000000;
      // Make new finite tier and keep the infinity at the end
      const newTier: TaxBracket = {
        id: 'tier_' + Date.now(),
        max: prevMax * 1.5,
        rate: Math.min(50, (last ? last.rate : 30) + 5),
        label: `Bậc mới (${Math.min(50, (last ? last.rate : 30) + 5)}%)`
      };
      return [...prev, newTier];
    });
  };

  const handleRemoveBracket = (index: number) => {
    if (brackets.length <= 1) return;
    setBrackets(prev => prev.filter((_, i) => i !== index));
  };

  // --- Core Tax & Net Calculation Engine ---
  const calculations = useMemo(() => {
    // 1. Total Gross & Taxable Gross
    const additionalTaxableGross = customIncomes
      .filter(item => item.isTaxable)
      .reduce((sum, item) => sum + item.amount, 0);
    const additionalNonTaxableGross = customIncomes
      .filter(item => !item.isTaxable)
      .reduce((sum, item) => sum + item.amount, 0);
    const totalGross = grossMonthly + additionalTaxableGross + additionalNonTaxableGross;

    // 2. Calculate Insurances (BHXH, BHYT, BHTN...)
    let totalInsurance = 0;
    const insuranceDetails: { name: string; rate: number; amount: number; cap: number }[] = [];

    for (const ins of insurances) {
      if (!ins.enabled) continue;
      const baseForIns = ins.salaryCap > 0 ? Math.min(grossMonthly, ins.salaryCap) : grossMonthly;
      const amt = baseForIns * (ins.rate / 100);
      totalInsurance += amt;
      insuranceDetails.push({
        name: ins.name,
        rate: ins.rate,
        amount: Math.round(amt),
        cap: ins.salaryCap
      });
    }

    // 3. Deductions (Personal, Dependents, Custom)
    const totalDependentDeduction = dependents * dependentDeduction;
    const totalCustomDeductions = customDeductions.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = selfDeduction + totalDependentDeduction + totalCustomDeductions;

    // 4. Taxable Income
    // Taxable Income = Taxable Gross - Total Insurance - Total Deductions
    const taxableIncome = Math.max(0, (grossMonthly + additionalTaxableGross) - totalInsurance - totalDeductions);

    // 5. Progressive Bracket Tax Calculation
    let remainingTaxable = taxableIncome;
    let prevMax = 0;
    let totalTax = 0;
    const bracketDetails: { label: string; rate: number; taxableInBracket: number; taxAmount: number }[] = [];

    // Ensure brackets are processed in order
    const sortedBrackets = [...brackets].sort((a, b) => a.max - b.max);

    for (let i = 0; i < sortedBrackets.length; i++) {
      const b = sortedBrackets[i];
      const bracketRange = b.max === Infinity ? Infinity : Math.max(0, b.max - prevMax);

      if (remainingTaxable > 0) {
        const taxableInBracket = Math.min(remainingTaxable, bracketRange);
        const taxAmount = taxableInBracket * (b.rate / 100);
        totalTax += taxAmount;
        remainingTaxable -= taxableInBracket;

        bracketDetails.push({
          label: b.label || `Bậc ${i + 1} (${b.rate}%)`,
          rate: b.rate,
          taxableInBracket: Math.round(taxableInBracket),
          taxAmount: Math.round(taxAmount)
        });
      } else {
        bracketDetails.push({
          label: b.label || `Bậc ${i + 1} (${b.rate}%)`,
          rate: b.rate,
          taxableInBracket: 0,
          taxAmount: 0
        });
      }

      prevMax = b.max;
    }

    // 6. Net Take-Home Salary
    const netMonthly = totalGross - totalInsurance - totalTax;
    const effectiveRate = totalGross > 0 ? Number(((totalTax / totalGross) * 100).toFixed(1)) : 0;
    const totalDeductionsAll = totalInsurance + totalDeductions;

    return {
      totalGross: Math.round(totalGross),
      additionalTaxableGross: Math.round(additionalTaxableGross),
      additionalNonTaxableGross: Math.round(additionalNonTaxableGross),
      totalInsurance: Math.round(totalInsurance),
      insuranceDetails,
      selfDeduction: Math.round(selfDeduction),
      totalDependentDeduction: Math.round(totalDependentDeduction),
      totalCustomDeductions: Math.round(totalCustomDeductions),
      totalDeductions: Math.round(totalDeductions),
      totalDeductionsAll: Math.round(totalDeductionsAll),
      taxableIncome: Math.round(taxableIncome),
      totalTax: Math.round(totalTax),
      netMonthly: Math.round(netMonthly),
      effectiveRate,
      bracketDetails
    };
  }, [grossMonthly, dependents, selfDeduction, dependentDeduction, insurances, brackets, customIncomes, customDeductions]);

  // Copy result summary
  const handleCopy = () => {
    const text = `Ước tính Thuế Thu Nhập Cá Nhân (${activePreset.name}):
- Tổng thu nhập Gross: ${formatMoney(calculations.totalGross)}/tháng
- Tổng tiền bảo hiểm (BHXH, BHYT, BHTN...): ${formatMoney(calculations.totalInsurance)}
- Giảm trừ bản thân & gia cảnh: ${formatMoney(calculations.selfDeduction + calculations.totalDependentDeduction)}
- Các khoản giảm trừ bổ sung: ${formatMoney(calculations.totalCustomDeductions)}
- Thu nhập tính thuế: ${formatMoney(calculations.taxableIncome)}
- Thuế TNCN phải nộp: ${formatMoney(calculations.totalTax)}/tháng (Thuế suất thực tế: ${calculations.effectiveRate}%)
- Lương thực nhận (Net): ${formatMoney(calculations.netMonthly)}/tháng`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print Statement (Browser Print Dialog)
  const handlePrint = () => {
    window.print();
  };

  // Direct PDF Generation & Download
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<PdfExportResult | null>(null);

  const handleDownloadPDF = async () => {
    if (isExportingPdf) return;

    try {
      setIsExportingPdf(true);
      setExportError(null);
      setExportSuccess(false);

      const targetElement = document.getElementById('tax-statement-modal-sheet') || document.getElementById('tax-statement-printable');
      if (!targetElement) {
        window.print();
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const safeRegion = selectedRegionId.replace(/[^a-z0-9_-]/gi, '_');
      const fileName = `Bang_Du_Toan_Thue_${safeRegion}_${dateStr}.pdf`;

      const result = await exportElementPagesToPdf(targetElement, {
        fileName,
        pageSelector: '.pdf-report-page',
        isVi: true,
      });

      setExportResult(result);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    } catch (err: any) {
      console.error('Lỗi khi xuất PDF:', err);
      setExportError(err?.message || 'Có lỗi khi tạo file PDF. Bạn có thể mở "Xem mẫu A4" để xem hoặc in trực tiếp.');
      try {
        window.print();
      } catch {
        // ignore
      }
      setTimeout(() => {
        setExportError(null);
      }, 6000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div id="tax-calculator" className="w-full max-w-6xl mx-auto space-y-6">
      {/* Interactive Form Controls (Hidden during Window Print) */}
      <div className="no-print space-y-6">
        {/* Header Banner */}
        <div className="tool-header-banner p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="banner-icon-box p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Income Tax Calculator – Tính Thuế Thu Nhập Cá Nhân &amp; Lương Net
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Tùy chỉnh chọn khu vực, mức trần BHXH/BHYT, biểu thuế lũy tiến và các khoản thêm `+`
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CurrencySelector variant="compact" />
          
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPdf}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
              exportSuccess
                ? 'text-emerald-200 bg-emerald-950/80 border border-emerald-500/80 ring-1 ring-emerald-500/40'
                : 'text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/70 border border-rose-600/50'
            }`}
            title="Tải bảng dự toán thuế và lương dạng file PDF về máy"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
            ) : exportSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{isExportingPdf ? 'Đang tạo PDF...' : exportSuccess ? 'Đã tải xong PDF!' : 'Tải PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:text-white bg-sky-950/50 hover:bg-sky-900/60 border border-sky-600/40 rounded-lg transition-colors cursor-pointer"
            title="In phiếu lương / Thuế hoặc Lưu thành file PDF (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In phiếu</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-300 hover:text-white bg-violet-950/50 hover:bg-violet-900/60 border border-violet-600/40 rounded-lg transition-colors cursor-pointer"
            title="Xem trước mẫu phiếu lương & thuế A4"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem mẫu A4</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Sao chép tóm tắt kết quả"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>

          <button
            onClick={handleResetToPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Đặt lại thông số mặc định của khu vực"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* Thông báo và nút thao tác trực tiếp khi file PDF đã tạo xong (tối ưu cho iPhone & Android) */}
      {exportResult && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2 text-emerald-300 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold shrink-0">Đã tạo file PDF thành công:</span>
            <span className="font-mono text-[11px] truncate max-w-[200px] text-slate-300">{exportResult.fileName}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={exportResult.blobUrl}
              download={exportResult.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Mở / Tải file PDF</span>
            </a>
            {typeof navigator !== 'undefined' && !!navigator.share && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const file = new File([exportResult.blob], exportResult.fileName, { type: 'application/pdf' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                      await navigator.share({ files: [file], title: exportResult.fileName });
                    } else {
                      window.open(exportResult.blobUrl, '_blank');
                    }
                  } catch (err: any) {
                    if (err.name !== 'AbortError') {
                      window.open(exportResult.blobUrl, '_blank');
                    }
                  }
                }}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Lưu vào Tệp</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setExportResult(null)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer ml-1"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {exportError && (
        <div className="p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-rose-200 text-xs flex items-center justify-between gap-2 shadow-lg">
          <span>{exportError}</span>
          <button onClick={() => setExportError(null)} className="p-1 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. KHU VỰC TÍNH THUẾ (REGION / JURISDICTION SELECTOR) */}
      <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Chọn Khu Vực / Quốc Gia (Mỗi khu vực áp dụng quy định riêng về Thuế &amp; BHXH/BHYT)
          </label>
          <span className="text-xs text-slate-400">Đơn vị tiền tệ hiển thị: <strong className="text-white font-sans">{currencyInfo.symbol} {currencyInfo.code}</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {Object.values(REGION_CONFIGS).map((region) => {
            const isSelected = selectedRegionId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleSelectRegion(region.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 ring-1 ring-blue-400 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-2xl leading-none mt-0.5">{region.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{region.name}</div>
                  <div className={`text-[11px] truncate mt-0.5 font-sans ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {region.currencyCode}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedRegionId === 'vn' && (
          <div className="p-3 bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <span>📍</span>
                <span>Vùng áp dụng lương tối thiểu (Nghị định 74/2024/NĐ-CP):</span>
              </span>
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                Trần BHTN: {(VN_REGION_WAGES[vnRegionTier].cap / 1000000).toFixed(1)} triệu/tháng
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['1', '2', '3', '4'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleVnRegionChange(tier)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left border cursor-pointer ${
                    vnRegionTier === tier
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <div className="font-bold">Vùng {tier}</div>
                  <div className="text-[10px] opacity-80 truncate">
                    {(VN_REGION_WAGES[tier].minWage / 1000000).toFixed(2)}tr → Trần {(VN_REGION_WAGES[tier].cap / 1000000).toFixed(1)}tr
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activePreset.regionNotes && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700/60 flex items-start gap-2 text-xs text-blue-900 dark:text-slate-300">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>{activePreset.regionNotes}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Config & Adjustments (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Tabs for Navigating Configuration Sections */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('main')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'main'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Thu nhập &amp; Giảm trừ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('insurances')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'insurances'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo hiểm (BHXH, BHYT) ({insurances.filter(i => i.enabled).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('brackets')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'brackets'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Bậc thuế ({brackets.length})</span>
            </button>
          </div>

          {/* TAB 1: THU NHẬP & GIẢM TRỪ */}
          {activeTab === 'main' && (
            <div className="space-y-4">
              {/* Gross Income Input */}
              <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Lương cơ bản hàng tháng (Gross) ({currencyInfo.symbol})
                  </label>
                  <span className="text-sm font-black text-cyan-700 dark:text-cyan-400 font-sans">
                    {formatMoney(grossMonthly)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-cyan-600 dark:text-cyan-400 font-black text-lg">{currencyInfo.symbol}</span>
                  <input
                    id="tax-gross-input"
                    type="number"
                    min={0}
                    step={currency === 'VND' ? 1000000 : 200}
                    value={grossMonthly}
                    onChange={(e) => setGrossMonthly(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-10 pr-16 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-500 hover:border-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl text-xl font-black text-slate-900 dark:text-white font-sans outline-none shadow-xs transition-all"
                  />
                  <span className="absolute right-3.5 top-3 text-slate-700 dark:text-slate-200 font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-600">
                    {currencyInfo.code}
                  </span>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                  {activePreset.quickAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGrossMonthly(val)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                        grossMonthly === val
                          ? 'bg-violet-600 text-white border-violet-500 font-black ring-2 ring-violet-400/40'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {currency === 'VND' ? `${val / 1000000}tr` : `${currencyInfo.symbol}${val.toLocaleString()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Incomes with "+" Button */}
              <div className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Các khoản thu nhập thêm (Thưởng, phụ cấp, làm thêm...)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddIncome(true)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm thu nhập (+)</span>
                  </button>
                </div>

                {showAddIncome && (
                  <div className="p-3.5 bg-slate-900 rounded-xl border-2 border-slate-600 space-y-2.5 shadow-lg">
                    <div className="text-xs font-bold text-slate-200">Nhập khoản thu nhập bổ sung mới:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tên khoản thu (vd: Thưởng KPI, Làm thêm...)"
                        value={newIncomeName}
                        onChange={(e) => setNewIncomeName(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded-lg text-xs font-semibold text-white placeholder:text-slate-400 outline-none"
                      />
                      <input
                        type="number"
                        placeholder={`Số tiền (${currencyInfo.symbol})`}
                        value={newIncomeAmount}
                        onChange={(e) => setNewIncomeAmount(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded-lg text-xs font-bold text-white placeholder:text-slate-400 outline-none font-sans"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newIncomeTaxable}
                          onChange={(e) => setNewIncomeTaxable(e.target.checked)}
                          className="rounded text-violet-600 accent-violet-600"
                        />
                        <span>Khoản này chịu thuế TNCN</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddIncome(false)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCustomIncome}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Xác nhận thêm
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {customIncomes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Chưa có khoản thu nhập thêm nào. Bấm "+ Thêm thu nhập" để cộng vào tính.</p>
                ) : (
                  <div className="space-y-1.5">
                    {customIncomes.map((item) => (
                      <div key={item.id} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-200">{item.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.isTaxable ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                            {item.isTaxable ? 'Chịu thuế' : 'Miễn thuế'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-400 font-sans">+{formatMoney(item.amount)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomIncome(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Giảm trừ gia cảnh & người phụ thuộc */}
              <div className="p-5 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Giảm trừ gia cảnh &amp; Người phụ thuộc
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Mức giảm trừ bản thân ({currencyInfo.symbol})</label>
                    <input
                      type="number"
                      value={selfDeduction}
                      onChange={(e) => setSelfDeduction(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-500 hover:border-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-slate-900 dark:text-white font-bold font-sans text-sm outline-none transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Giảm trừ mỗi người phụ thuộc ({currencyInfo.symbol})</label>
                    <input
                      type="number"
                      value={dependentDeduction}
                      onChange={(e) => setDependentDeduction(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-500 hover:border-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-slate-900 dark:text-white font-bold font-sans text-sm outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Số người phụ thuộc</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
                      Tổng giảm trừ: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">-{formatMoney(calculations.totalDependentDeduction)}/tháng</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDependents(Math.max(0, dependents - 1))}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      -
                    </button>
                    <span className="w-12 py-1 text-center font-black text-slate-900 dark:text-white text-base bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-lg font-sans">
                      {dependents}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDependents(dependents + 1)}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-white font-black text-base flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Deductions with "+" Button */}
              <div className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Các khoản giảm trừ &amp; miễn thuế khác (Từ thiện, ăn trưa, công đoàn...)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddDeduction(true)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/70 border border-cyan-200 dark:border-cyan-500/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm giảm trừ (+)</span>
                  </button>
                </div>

                {showAddDeduction && (
                  <div className="p-3.5 bg-slate-900 rounded-xl border-2 border-slate-600 space-y-2.5 shadow-lg">
                    <div className="text-xs font-bold text-slate-200">Nhập khoản giảm trừ hợp lệ mới:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tên khoản giảm trừ (vd: Đóng góp từ thiện, Tiền ăn...)"
                        value={newDeductionName}
                        onChange={(e) => setNewDeductionName(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-cyan-400 rounded-lg text-xs font-semibold text-white placeholder:text-slate-400 outline-none"
                      />
                      <input
                        type="number"
                        placeholder={`Mức giảm trừ (${currencyInfo.symbol})`}
                        value={newDeductionAmount}
                        onChange={(e) => setNewDeductionAmount(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-cyan-400 rounded-lg text-xs font-bold text-white placeholder:text-slate-400 outline-none font-sans"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddDeduction(false)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomDeduction}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Xác nhận thêm
                      </button>
                    </div>
                  </div>
                )}

                {customDeductions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Chưa có khoản giảm trừ bổ sung nào. Bấm "+ Thêm giảm trừ" để nhập vào tính.</p>
                ) : (
                  <div className="space-y-1.5">
                    {customDeductions.map((item) => (
                      <div key={item.id} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-cyan-400 font-sans">-{formatMoney(item.amount)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomDeduction(item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BẢO HIỂM (BHXH, BHYT, BHTN...) */}
          {activeTab === 'insurances' && (
            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Cấu hình Bảo hiểm Bắt buộc theo Khu Vực ({activePreset.name.split('–')[0].trim()})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tổng tiền bảo hiểm miễn trừ trước thuế: <strong className="text-emerald-400 font-sans">{formatMoney(calculations.totalInsurance)}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddIns(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Thêm bảo hiểm (+)</span>
                </button>
              </div>

              {showAddIns && (
                <div className="p-3.5 bg-slate-900 rounded-xl border-2 border-slate-600 space-y-2.5 shadow-lg">
                  <div className="text-xs font-bold text-slate-200">Thêm khoản bảo hiểm mới:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Tên loại bảo hiểm..."
                      value={newInsName}
                      onChange={(e) => setNewInsName(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded-lg text-xs font-semibold text-white placeholder:text-slate-400 outline-none"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Tỷ lệ đóng (%)"
                      value={newInsRate}
                      onChange={(e) => setNewInsRate(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded-lg text-xs font-bold text-white placeholder:text-slate-400 outline-none font-sans"
                    />
                    <input
                      type="number"
                      placeholder={`Mức trần (${currencyInfo.symbol}, 0 nếu ko trần)`}
                      value={newInsCap}
                      onChange={(e) => setNewInsCap(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded-lg text-xs font-bold text-white placeholder:text-slate-400 outline-none font-sans"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddIns(false)}
                      className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleAddInsuranceItem}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Xác nhận thêm
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {insurances.map((ins) => {
                  const detail = calculations.insuranceDetails.find(d => d.name === ins.name);
                  return (
                    <div
                      key={ins.id}
                      className={`p-3.5 rounded-xl border-2 transition-all ${
                        ins.enabled
                          ? 'bg-slate-900 border-slate-700 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-white">
                          <input
                            type="checkbox"
                            checked={ins.enabled}
                            onChange={() => handleToggleInsurance(ins.id)}
                            className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                          />
                          <span>{ins.name}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-400 font-sans">
                            {detail ? formatMoney(detail.amount) : formatMoney(0)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInsurance(ins.id)}
                            className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            title="Xóa loại bảo hiểm này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300 pl-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-300">Tỷ lệ NLĐ đóng:</span>
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            max={100}
                            value={ins.rate}
                            onChange={(e) => handleUpdateInsuranceRate(ins.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-emerald-400 rounded text-center text-white font-sans text-xs font-black outline-none"
                          />
                          <span className="font-bold text-emerald-400">%</span>
                        </div>
                        <div className="text-right truncate">
                          {ins.salaryCap > 0 ? (
                            <span>Trần lương tính BH: <strong className="text-white font-bold font-sans">{formatMoney(ins.salaryCap)}</strong></span>
                          ) : (
                            <span className="text-slate-400 italic">Không áp dụng trần</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BẬC THUẾ LŨY TIẾN TỪNG PHẦN (TAX BRACKETS EDITOR) */}
          {activeTab === 'brackets' && (
            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-violet-400" />
                    Biểu thuế lũy tiến từng phần ({brackets.length} bậc)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tùy chỉnh ngưỡng thu nhập tối đa và mức thuế suất (%) của từng bậc
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddBracket}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-300 bg-violet-950/50 hover:bg-violet-900/50 border border-violet-600/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm bậc (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrackets(activePreset.brackets.map(b => ({ ...b })))}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg"
                    title="Khôi phục bậc chuẩn theo khu vực"
                  >
                    Mặc định
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-2.5">Bậc</th>
                      <th className="p-2.5">Tên bậc / Ghi chú</th>
                      <th className="p-2.5">Ngưỡng tối đa ({currencyInfo.symbol})</th>
                      <th className="p-2.5">Thuế suất (%)</th>
                      <th className="p-2.5 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-sans">
                    {brackets.map((bracket, idx) => {
                      const isInfinity = bracket.max === Infinity;
                      return (
                        <tr key={bracket.id || idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-black text-violet-400 text-sm">#{idx + 1}</td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={bracket.label}
                              onChange={(e) => handleUpdateBracket(idx, 'label', e.target.value)}
                              className="w-full min-w-[130px] px-2.5 py-1.5 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-violet-400 rounded-lg text-xs font-semibold text-white outline-none"
                            />
                          </td>
                          <td className="p-2.5">
                            {isInfinity ? (
                              <span className="text-slate-300 italic font-semibold">Không giới hạn (Bậc tối đa)</span>
                            ) : (
                              <input
                                type="number"
                                step={currency === 'VND' ? 1000000 : 500}
                                value={bracket.max}
                                onChange={(e) => handleUpdateBracket(idx, 'max', parseFloat(e.target.value) || 0)}
                                className="w-36 px-2.5 py-1.5 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-violet-400 rounded-lg text-xs text-white font-black font-sans outline-none"
                              />
                            )}
                          </td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                step="0.5"
                                min={0}
                                max={100}
                                value={bracket.rate}
                                onChange={(e) => handleUpdateBracket(idx, 'rate', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1.5 bg-slate-950 border-2 border-slate-500 hover:border-slate-400 focus:border-violet-400 rounded-lg text-xs text-white font-black text-center font-sans outline-none"
                              />
                              <span className="text-violet-400 font-black">%</span>
                            </div>
                          </td>
                          <td className="p-2.5 text-right">
                            {brackets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBracket(idx)}
                                className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Xóa bậc này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Output Results & Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Hero Card: Tax Due & Effective Rate */}
          <div className="hero-result-card p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-violet-950/70 dark:via-slate-900 dark:to-indigo-950 border border-slate-200 dark:border-violet-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                Thuế TNCN Phải Nộp Hàng Tháng
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                Thuế suất thực: {calculations.effectiveRate}%
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-violet-700 dark:text-violet-400 tabular-nums">
                {formatMoney(calculations.totalTax)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ tháng</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 block mb-0.5 text-[11px]">Thu nhập tính thuế</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-sans tabular-nums">
                  {formatMoney(calculations.taxableIncome)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30">
                <span className="text-emerald-800 dark:text-emerald-300 block mb-0.5 text-[11px]">Lương thực nhận (Net)</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-sans tabular-nums">
                  {formatMoney(calculations.netMonthly)}
                </span>
              </div>
            </div>

            {/* Quick Action Export Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExportingPdf}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/70 hover:bg-rose-100 dark:hover:bg-rose-900/90 border border-rose-200 dark:border-rose-600/50 text-rose-700 dark:text-rose-200 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Tải bảng tính thuế thành file PDF"
              >
                {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-rose-400" /> : <FileDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                <span>{isExportingPdf ? 'Đang tạo...' : 'Tải PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 border border-sky-200 dark:border-sky-600/40 text-sky-700 dark:text-sky-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="In phiếu lương (Ctrl+P)"
              >
                <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>In phiếu</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/80 border border-violet-200 dark:border-violet-600/40 text-violet-700 dark:text-violet-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="Xem trước mẫu phiếu lương & thuế A4"
              >
                <Eye className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Xem mẫu A4</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Tổng thu nhập Gross</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-sans tabular-nums">{formatMoney(calculations.totalGross)}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Tổng bảo hiểm NLĐ đóng</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-sans tabular-nums">{formatMoney(calculations.totalInsurance)}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Giảm trừ gia cảnh</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-sans tabular-nums">
                {formatMoney(calculations.selfDeduction + calculations.totalDependentDeduction)}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Giảm trừ khác (+)</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-sans tabular-nums">
                {formatMoney(calculations.totalCustomDeductions)}
              </span>
            </div>
          </div>

          {/* Progressive Tier Tax Breakdown Table */}
          <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                Chi tiết thuế nộp theo từng bậc lũy tiến
              </h3>
              <span className="text-[11px] text-slate-500">Lũy tiến từng phần</span>
            </div>

            <div className="space-y-1.5">
              {calculations.bracketDetails.map((b, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-300 font-medium">{b.label}</span>
                  </div>
                  <span className={`font-sans font-bold tabular-nums ${b.taxAmount > 0 ? 'text-violet-700 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {formatMoney(b.taxAmount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Income Distribution Bar Visualizer */}
          <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
              <span>Phân bổ cơ cấu thu nhập Gross</span>
              <span className="text-slate-900 dark:text-white font-bold">{formatMoney(calculations.totalGross)}</span>
            </div>
            
            {/* Visual ratio bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${Math.max(2, (calculations.netMonthly / Math.max(1, calculations.totalGross)) * 100)}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Lương Net: ${formatMoney(calculations.netMonthly)}`}
              />
              <div 
                style={{ width: `${Math.max(1, (calculations.totalTax / Math.max(1, calculations.totalGross)) * 100)}%` }}
                className="bg-violet-500 h-full transition-all"
                title={`Thuế TNCN: ${formatMoney(calculations.totalTax)}`}
              />
              <div 
                style={{ width: `${Math.max(1, (calculations.totalInsurance / Math.max(1, calculations.totalGross)) * 100)}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Bảo hiểm: ${formatMoney(calculations.totalInsurance)}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Net ({calculations.totalGross > 0 ? Math.round((calculations.netMonthly / calculations.totalGross) * 100) : 0}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Thuế ({calculations.effectiveRate}%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Bảo hiểm ({calculations.totalGross > 0 ? ((calculations.totalInsurance / calculations.totalGross) * 100).toFixed(1) : 0}%)</span>
              </span>
            </div>
          </div>

        </div>

      </div>
      </div>

      {/* --- PREVIEW MODAL & PRINTABLE A4 STATEMENT --- */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
            {/* Modal Header Toolbar */}
            <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Mẫu Phiếu Lương &amp; Bảng Kê Thuế TNCN</h3>
                  <p className="text-xs text-slate-400">Xem trước chuẩn trang A4 để in hoặc xuất tải file PDF</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isExportingPdf}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                    exportSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                  title="Tải bảng tính thuế thành file PDF"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : exportSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isExportingPdf ? 'Đang tạo PDF...' : exportSuccess ? 'Đã tải xong PDF!' : 'Tải PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In / Lưu PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Paper Preview */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/80 flex justify-center">
              <div 
                id="tax-statement-modal-sheet"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                className="w-full max-w-[210mm] pdf-report-page bg-white text-slate-900 rounded-lg p-6 sm:p-10 shadow-2xl space-y-6 text-sm border border-slate-300"
              >
                
                {/* Document Header */}
                <div className="border-b pb-4 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
                      BẢNG DỰ TOÁN THUẾ THU NHẬP CÁ NHÂN &amp; LƯƠNG NET
                    </div>
                    <h2 className="text-2xl font-black text-black tracking-tight mt-1">
                      PHIẾU TÍNH THUẾ &amp; LƯƠNG THỰC NHẬN
                    </h2>
                    <div className="text-xs text-slate-700 mt-1">
                      Khu vực áp dụng: <strong>{activePreset.flag} {activePreset.name}</strong> • Tiền tệ: <strong>{currencyInfo.code} ({currencyInfo.symbol})</strong>
                    </div>
                  </div>

                  <div className="text-xs text-right text-slate-600">
                    <div>Ngày lập: <strong className="text-black">{new Date().toLocaleDateString('vi-VN')}</strong></div>
                    <div>Giờ lập: {new Date().toLocaleTimeString('vi-VN')}</div>
                  </div>
                </div>

                {/* 1. Thu nhập Gross */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-black bg-slate-100 p-2 rounded border border-slate-300">
                    1. Chi tiết Tổng Thu nhập Hàng tháng (Gross)
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-2 text-slate-800">Lương cơ bản Gross</td>
                        <td className="py-2 text-right font-bold text-black font-sans">{formatMoney(grossMonthly)}</td>
                      </tr>
                      {customIncomes.map((item) => (
                        <tr key={item.id} className="border-b border-slate-200">
                          <td className="py-1.5 text-slate-700 pl-4">
                            + {item.name} <span className="text-[10px] text-slate-500">({item.isTaxable ? 'Chịu thuế' : 'Miễn thuế'})</span>
                          </td>
                          <td className="py-1.5 text-right font-sans text-black">{formatMoney(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                        <td className="py-2 text-black">TỔNG THU NHẬP GROSS HÀNG THÁNG</td>
                        <td className="py-2 text-right text-black text-sm font-sans">{formatMoney(calculations.totalGross)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. Bảo hiểm bắt buộc */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-black bg-slate-100 p-2 rounded border border-slate-300">
                    2. Các Khoản Bảo Hiểm Bắt Buộc Người Lao Động Đóng
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-700 text-left">
                        <th className="py-1.5 font-semibold">Tên bảo hiểm</th>
                        <th className="py-1.5 text-center font-semibold">Tỷ lệ</th>
                        <th className="py-1.5 text-right font-semibold">Mức trần lương</th>
                        <th className="py-1.5 text-right font-semibold">Số tiền đóng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.insuranceDetails.map((ins, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-1.5 text-slate-800">{ins.name}</td>
                          <td className="py-1.5 text-center text-slate-700 font-sans">{ins.rate}%</td>
                          <td className="py-1.5 text-right text-slate-700 font-sans">
                            {ins.cap > 0 ? formatMoney(ins.cap) : 'Không trần'}
                          </td>
                          <td className="py-1.5 text-right font-bold text-black font-sans">{formatMoney(ins.amount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                        <td colSpan={3} className="py-2 text-black">TỔNG TIỀN BẢO HIỂM ĐÓNG GÓP</td>
                        <td className="py-2 text-right text-black font-sans text-sm">{formatMoney(calculations.totalInsurance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 3. Giảm trừ & Thu nhập tính thuế */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-black bg-slate-100 p-2 rounded border border-slate-300">
                    3. Các Khoản Giảm Trừ &amp; Thu Nhập Tính Thuế
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 text-slate-800">Giảm trừ bản thân người nộp thuế</td>
                        <td className="py-1.5 text-right font-sans text-black">{formatMoney(calculations.selfDeduction)}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-1.5 text-slate-800">
                          Giảm trừ người phụ thuộc ({dependents} người x {formatMoney(dependentDeduction)})
                        </td>
                        <td className="py-1.5 text-right font-sans text-black">{formatMoney(calculations.totalDependentDeduction)}</td>
                      </tr>
                      {customDeductions.map((item) => (
                        <tr key={item.id} className="border-b border-slate-200">
                          <td className="py-1.5 text-slate-700 pl-4">+ Giảm trừ: {item.name}</td>
                          <td className="py-1.5 text-right font-sans text-black">{formatMoney(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                        <td className="py-2 text-black">TỔNG CÁC KHOẢN GIẢM TRỪ</td>
                        <td className="py-2 text-right text-black font-sans">{formatMoney(calculations.totalDeductions)}</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold text-black border-t-2 border-slate-400">
                        <td className="py-2.5">THU NHẬP TÍNH THUẾ (Taxable Income)</td>
                        <td className="py-2.5 text-right font-sans text-sm text-black">{formatMoney(calculations.taxableIncome)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. Biểu thuế lũy tiến từng phần */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-black bg-slate-100 p-2 rounded border border-slate-300">
                    4. Chi Tiết Tính Thuế TNCN Theo Từng Bậc Lũy Tiến
                  </div>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-700 text-left">
                        <th className="py-1.5 font-semibold">Bậc lũy tiến</th>
                        <th className="py-1.5 text-center font-semibold">Thuế suất</th>
                        <th className="py-1.5 text-right font-semibold">Thu nhập trong bậc</th>
                        <th className="py-1.5 text-right font-semibold">Thuế nộp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.bracketDetails.map((b, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-1.5 text-slate-800">{b.label}</td>
                          <td className="py-1.5 text-center font-sans text-slate-700">{b.rate}%</td>
                          <td className="py-1.5 text-right font-sans text-slate-700">{formatMoney(b.taxableInBracket)}</td>
                          <td className="py-1.5 text-right font-sans font-bold text-black">{formatMoney(b.taxAmount)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-black border-t-2 border-slate-400 text-black">
                        <td colSpan={3} className="py-2">TỔNG THUẾ TNCN PHẢI NỘP HÀNG THÁNG</td>
                        <td className="py-2 text-right text-black font-sans text-base">{formatMoney(calculations.totalTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. TỔNG KẾT LƯƠNG NET */}
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-black text-black flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-black">
                      LƯƠNG THỰC NHẬN HÀNG THÁNG (NET TAKE-HOME)
                    </div>
                    <div className="text-xs text-slate-700 mt-0.5">
                      Đã trừ toàn bộ bảo hiểm ({formatMoney(calculations.totalInsurance)}) và thuế TNCN ({formatMoney(calculations.totalTax)})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-black font-sans">
                      {formatMoney(calculations.netMonthly)}
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Thuế suất thực: {calculations.effectiveRate}% • Net/Gross: {calculations.totalGross > 0 ? ((calculations.netMonthly / calculations.totalGross) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-700">
                  <div>
                    <div className="font-bold text-black">NGƯỜI NỘP THUẾ / LAO ĐỘNG</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</div>
                    <div className="h-16" />
                  </div>
                  <div>
                    <div className="font-bold text-black">BỘ PHẬN KẾ TOÁN / TIỀN LƯƠNG</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">(Xác nhận dự toán)</div>
                    <div className="h-16" />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExportingPdf ? 'Đang tạo...' : 'Tải file PDF'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In trang này</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Container — dùng position offscreen thay vì display:none */}
      <div 
        id="tax-statement-printable"
        aria-hidden="true"
        className="printable-tax-statement bg-white text-slate-900 p-8 space-y-6 text-sm"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '800px',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
          backgroundColor: '#ffffff',
          color: '#0f172a',
        }}
      >
        <div
          className="pdf-report-page bg-white text-slate-900 p-8 space-y-4 text-xs"
          style={{
            width: '794px',
            minHeight: '1123px',
            height: 'auto',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            display: 'block',
          }}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="border-b pb-3 border-slate-300 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  BẢNG DỰ TOÁN THUẾ THU NHẬP CÁ NHÂN &amp; LƯƠNG NET
                </div>
                <h2 className="text-xl font-black text-black tracking-tight mt-0.5">
                  PHIẾU TÍNH THUẾ &amp; LƯƠNG THỰC NHẬN
                </h2>
                <div className="text-[11px] text-slate-700 mt-0.5">
                  Khu vực: <strong>{activePreset.flag} {activePreset.name}</strong> • Tiền tệ: <strong>{currencyInfo.code} ({currencyInfo.symbol})</strong>
                </div>
              </div>
              <div className="text-[11px] text-right text-slate-600">
                <div>Ngày lập: <strong className="text-black">{new Date().toLocaleDateString('vi-VN')}</strong></div>
                <div>Giờ: {new Date().toLocaleTimeString('vi-VN')}</div>
              </div>
            </div>

            {/* 1. Thu nhập Gross */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black bg-slate-100 p-1.5 rounded border border-slate-300">
                1. Chi tiết Tổng Thu nhập Hàng tháng (Gross)
              </div>
              <table className="w-full text-[11px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1 text-slate-800">Lương cơ bản Gross</td>
                    <td className="py-1 text-right font-bold text-black font-sans">{formatMoney(grossMonthly)}</td>
                  </tr>
                  {customIncomes.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="py-1 text-slate-700 pl-3">
                        + {item.name} <span className="text-[10px] text-slate-500">({item.isTaxable ? 'Chịu thuế' : 'Miễn thuế'})</span>
                      </td>
                      <td className="py-1 text-right font-sans text-black">{formatMoney(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                    <td className="py-1.5 text-black">TỔNG THU NHẬP GROSS HÀNG THÁNG</td>
                    <td className="py-1.5 text-right text-black font-sans">{formatMoney(calculations.totalGross)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Bảo hiểm bắt buộc */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black bg-slate-100 p-1.5 rounded border border-slate-300">
                2. Các Khoản Bảo Hiểm Bắt Buộc Người Lao Động Đóng
              </div>
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-700 text-left">
                    <th className="py-1 font-semibold">Tên bảo hiểm</th>
                    <th className="py-1 text-center font-semibold">Tỷ lệ</th>
                    <th className="py-1 text-right font-semibold">Mức trần lương</th>
                    <th className="py-1 text-right font-semibold">Số tiền đóng</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.insuranceDetails.map((ins, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-1 text-slate-800">{ins.name}</td>
                      <td className="py-1 text-center text-slate-700 font-sans">{ins.rate}%</td>
                      <td className="py-1 text-right text-slate-700 font-sans">
                        {ins.cap > 0 ? formatMoney(ins.cap) : 'Không trần'}
                      </td>
                      <td className="py-1 text-right font-bold text-black font-sans">{formatMoney(ins.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                    <td colSpan={3} className="py-1.5 text-black">TỔNG TIỀN BẢO HIỂM ĐÓNG GÓP</td>
                    <td className="py-1.5 text-right text-black font-sans">{formatMoney(calculations.totalInsurance)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Giảm trừ & Thu nhập tính thuế */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black bg-slate-100 p-1.5 rounded border border-slate-300">
                3. Các Khoản Giảm Trừ &amp; Thu Nhập Tính Thuế
              </div>
              <table className="w-full text-[11px] border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1 text-slate-800">Giảm trừ bản thân người nộp thuế</td>
                    <td className="py-1 text-right font-sans text-black">{formatMoney(calculations.selfDeduction)}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1 text-slate-800">
                      Giảm trừ người phụ thuộc ({dependents} người x {formatMoney(dependentDeduction)})
                    </td>
                    <td className="py-1 text-right font-sans text-black">{formatMoney(calculations.totalDependentDeduction)}</td>
                  </tr>
                  {customDeductions.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="py-1 text-slate-700 pl-3">+ Giảm trừ: {item.name}</td>
                      <td className="py-1 text-right font-sans text-black">{formatMoney(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-400">
                    <td className="py-1.5 text-black">TỔNG CÁC KHOẢN GIẢM TRỪ</td>
                    <td className="py-1.5 text-right text-black font-sans">{formatMoney(calculations.totalDeductions)}</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-black border-t-2 border-slate-400">
                    <td className="py-1.5">THU NHẬP TÍNH THUẾ (Taxable Income)</td>
                    <td className="py-1.5 text-right font-sans text-black">{formatMoney(calculations.taxableIncome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Biểu thuế lũy tiến từng phần */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black bg-slate-100 p-1.5 rounded border border-slate-300">
                4. Chi Tiết Tính Thuế TNCN Theo Từng Bậc Lũy Tiến
              </div>
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-700 text-left">
                    <th className="py-1 font-semibold">Bậc lũy tiến</th>
                    <th className="py-1 text-center font-semibold">Thuế suất</th>
                    <th className="py-1 text-right font-semibold">Thu nhập trong bậc</th>
                    <th className="py-1 text-right font-semibold">Thuế nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.bracketDetails.map((b, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-1 text-slate-800">{b.label}</td>
                      <td className="py-1 text-center font-sans text-slate-700">{b.rate}%</td>
                      <td className="py-1 text-right font-sans text-slate-700">{formatMoney(b.taxableInBracket)}</td>
                      <td className="py-1 text-right font-sans font-bold text-black">{formatMoney(b.taxAmount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-black border-t-2 border-slate-400 text-black">
                    <td colSpan={3} className="py-1.5">TỔNG THUẾ TNCN PHẢI NỘP HÀNG THÁNG</td>
                    <td className="py-1.5 text-right text-black font-sans">{formatMoney(calculations.totalTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. TỔNG KẾT LƯƠNG NET */}
            <div className="p-3 rounded-lg bg-slate-50 border-2 border-black text-black flex justify-between items-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-black">
                  LƯƠNG THỰC NHẬN HÀNG THÁNG (NET TAKE-HOME)
                </div>
                <div className="text-[10px] text-slate-700">
                  Bảo hiểm ({formatMoney(calculations.totalInsurance)}) • Thuế TNCN ({formatMoney(calculations.totalTax)})
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-black font-sans">
                  {formatMoney(calculations.netMonthly)}
                </div>
                <div className="text-[10px] font-semibold text-slate-800">
                  Thuế suất thực: {calculations.effectiveRate}% • Net/Gross: {calculations.totalGross > 0 ? ((calculations.netMonthly / calculations.totalGross) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Signatures & Footer */}
          <div className="pt-4 border-t border-slate-300">
            <div className="grid grid-cols-2 text-center text-xs text-slate-700">
              <div>
                <div className="font-bold text-black">NGƯỜI LAO ĐỘNG / NỘP THUẾ</div>
                <div className="text-[10px] text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</div>
                <div className="h-12" />
              </div>
              <div>
                <div className="font-bold text-black">KẾ TOÁN TRƯỞNG / ĐẠI DIỆN DOANH NGHIỆP</div>
                <div className="text-[10px] text-slate-500 mt-0.5">(Xác nhận dự toán)</div>
                <div className="h-12" />
              </div>
            </div>
            <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
              Bảng dự toán thuế và lương được tính toán dựa trên quy định pháp luật hiện hành và các tham số do người dùng thiết lập.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
