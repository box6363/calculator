import { 
  PayPeriod, 
  CountrySalaryProfile, 
  PERIOD_FACTORS 
} from '../data/salaryInternationalData';

export interface CalculationBreakdownItem {
  period: PayPeriod;
  gross: number;
  employeeInsurance: number;
  taxableIncome: number;
  tax: number;
  net: number;
  employerContribution: number;
  totalEmployerCost: number;
}

export interface DetailedCalculationResult {
  // Base period input
  inputPeriod: PayPeriod;
  inputSalary: number;
  annualGross: number;
  monthlyGross: number;
  
  // Insurance / Social security details
  employeeInsuranceItems: {
    id: string;
    name: string;
    rate: number;
    annualAmount: number;
    monthlyAmount: number;
    description?: string;
  }[];
  totalEmployeeInsuranceAnnual: number;
  totalEmployeeInsuranceMonthly: number;
  
  // Tax deductions & allowances
  personalAllowanceAnnual: number;
  dependentAllowanceAnnual: number;
  totalAllowancesAnnual: number;
  annualTaxableIncome: number;
  monthlyTaxableIncome: number;
  
  // Tax details
  taxBracketBreakdown: {
    bracket: number;
    min: number;
    max: number;
    rate: number;
    taxableInBracket: number;
    taxAmount: number;
  }[];
  annualNationalTax: number;
  monthlyNationalTax: number;
  
  // Sub-regional / State / Local tax
  regionalTaxName?: string;
  regionalTaxNameVi?: string;
  annualRegionalTax: number;
  monthlyRegionalTax: number;
  regionalTaxRate?: number;

  // Surcharges (e.g. Soli in DE, Additional Medicare in US, Reconstruction in JP)
  surtaxName?: string;
  annualSurtax: number;
  monthlySurtax: number;

  // Total Tax (National + Regional + Surcharges)
  annualTax: number;
  monthlyTax: number;
  effectiveTaxRate: number; // in %
  
  // Net
  annualNet: number;
  monthlyNet: number;
  
  // Employer contributions
  employerContributionItems: {
    id: string;
    name: string;
    rate: number;
    annualAmount: number;
    monthlyAmount: number;
  }[];
  totalEmployerContributionAnnual: number;
  totalEmployerContributionMonthly: number;
  totalEmployerCostAnnual: number;
  totalEmployerCostMonthly: number;
  
  // Multi-period matrix
  periods: Record<PayPeriod, CalculationBreakdownItem>;
  
  // Country specific notes & indicators
  appliedRuleNotes?: string;
  appliedRuleNotesVi?: string;
}

export interface SalaryCalculationOptions {
  subRegionId?: string;
  customRate?: number; // e.g. for custom state tax rate
  regionId?: number; // legacy VN compatibility
  customInsuranceSalaryMonthly?: number;
  useInsuranceOnGross?: boolean;
  baseSalaryVn?: number;
}

// Convert any salary from a given pay period to an annual amount
export function toAnnualAmount(amount: number, period: PayPeriod): number {
  if (amount <= 0 || isNaN(amount)) return 0;
  switch (period) {
    case 'annual':
      return amount;
    case 'monthly':
      return amount * 12;
    case 'biweekly':
      return amount * 26;
    case 'weekly':
      return amount * 52;
    case 'hourly':
      return amount * 2080; // 40 hours/week * 52 weeks
    default:
      return amount * 12;
  }
}

// Convert an annual amount to a given pay period
export function fromAnnualAmount(annualAmount: number, period: PayPeriod): number {
  if (annualAmount <= 0 || isNaN(annualAmount)) return 0;
  const factor = PERIOD_FACTORS[period];
  return annualAmount / factor;
}

// Core forward calculation: Gross -> Net and all deductions
export function calculateFromAnnualGross(
  rawAnnualGross: number,
  profile: CountrySalaryProfile,
  dependents: number = 0,
  options?: SalaryCalculationOptions
): DetailedCalculationResult {
  let annualGross = Math.max(0, rawAnnualGross);
  const subRegionId = options?.subRegionId || (options?.regionId ? String(options.regionId) : profile.defaultSubRegionId) || '1';

  // Australia Superannuation Inclusive Mode adjustment
  // If user selected 'inclusive', the entered gross is the Total Remuneration Package (TRP)
  // Base salary = TRP / 1.115, and Super (11.5%) is included in the package
  let auSuperIncludedAmount = 0;
  if (profile.id === 'AU' && subRegionId === 'inclusive') {
    const baseAnnual = annualGross / 1.115;
    auSuperIncludedAmount = annualGross - baseAnnual;
    annualGross = baseAnnual; // Calculate taxes and Medicare on base salary
  }

  const monthlyGross = annualGross / 12;
  const useGross = options?.useInsuranceOnGross ?? true;
  const insBaseMonthly = (useGross || !options?.customInsuranceSalaryMonthly) 
    ? monthlyGross 
    : options.customInsuranceSalaryMonthly;

  // 1. Calculate Employee Insurances & Social Security
  let employeeInsuranceItems: DetailedCalculationResult['employeeInsuranceItems'] = [];
  let additionalMedicareAnnual = 0;

  if (profile.id === 'VN') {
    // VIETNAM: Decree 73/2024 (Base salary 2.34M) & Decree 74/2024 (Regional minimum)
    const baseSalary = options?.baseSalaryVn || 2340000;
    const maxBhxhMonthly = baseSalary * 20; // 46,800,000 VND
    
    // Regional minimum wage for BHTN cap
    const regionMap: Record<string, number> = {
      '1': 4960000,
      '2': 4410000,
      '3': 3860000,
      '4': 3450000
    };
    const minMonthlyWage = regionMap[subRegionId] || 4960000;
    const maxBhtnMonthly = minMonthlyWage * 20;

    employeeInsuranceItems = profile.employeeInsurances.map(item => {
      let monthlyAmount = 0;
      if (item.id === 'bhxh' || item.id === 'bhyt') {
        const salaryForIns = Math.min(insBaseMonthly, maxBhxhMonthly);
        monthlyAmount = salaryForIns * (item.rate / 100);
      } else if (item.id === 'bhtn') {
        const salaryForIns = Math.min(insBaseMonthly, maxBhtnMonthly);
        monthlyAmount = salaryForIns * (item.rate / 100);
      } else {
        monthlyAmount = insBaseMonthly * (item.rate / 100);
      }
      return {
        id: item.id,
        name: item.name,
        rate: item.rate,
        annualAmount: monthlyAmount * 12,
        monthlyAmount,
        description: item.description
      };
    });
  } else if (profile.id === 'US') {
    // UNITED STATES: FICA (OASDI 6.2% cap $168,600) + Medicare (1.45% base + 0.9% Additional Medicare above $200k)
    employeeInsuranceItems = profile.employeeInsurances.map(item => {
      let annualAmount = 0;
      if (item.id === 'ss') {
        const subjectSalary = Math.min(annualGross, item.capAnnual || 168600);
        annualAmount = subjectSalary * (item.rate / 100);
      } else if (item.id === 'medicare') {
        annualAmount = annualGross * (item.rate / 100);
      } else {
        annualAmount = annualGross * (item.rate / 100);
      }
      return {
        id: item.id,
        name: item.name,
        rate: item.rate,
        annualAmount,
        monthlyAmount: annualAmount / 12,
        description: item.description
      };
    });

    // 0.9% Additional Medicare Tax on wages over $200,000 for single filers
    if (annualGross > 200000) {
      additionalMedicareAnnual = (annualGross - 200000) * 0.009;
      employeeInsuranceItems.push({
        id: 'add_medicare',
        name: 'Additional Medicare Tax (0.9% >$200k)',
        rate: 0.9,
        annualAmount: additionalMedicareAnnual,
        monthlyAmount: additionalMedicareAnnual / 12,
        description: 'IRS surtax for high earners over $200,000'
      });
    }
  } else if (profile.id === 'GB') {
    // UNITED KINGDOM: Class 1 National Insurance
    // 0% on first £12,570; 8% from £12,570 to £50,270; 2% above £50,270
    let niAnnual = 0;
    if (annualGross > 12570) {
      const basicBand = Math.min(annualGross, 50270) - 12570;
      niAnnual += basicBand * 0.08;
      if (annualGross > 50270) {
        niAnnual += (annualGross - 50270) * 0.02;
      }
    }
    employeeInsuranceItems = [{
      id: 'ni',
      name: 'National Insurance (Class 1)',
      rate: annualGross > 0 ? (niAnnual / annualGross) * 100 : 8.0,
      annualAmount: niAnnual,
      monthlyAmount: niAnnual / 12,
      description: '8% between £12,570 & £50,270, 2% above £50,270'
    }];
  } else if (profile.id === 'SG') {
    // SINGAPORE: Citizen/PR has CPF (20% employee cap S$6,800/mo), Foreigner/EP has 0% CPF!
    if (subRegionId === 'foreigner') {
      employeeInsuranceItems = [{
        id: 'cpf',
        name: 'Central Provident Fund (CPF - Foreigner Exempt)',
        rate: 0,
        annualAmount: 0,
        monthlyAmount: 0,
        description: 'Employment Pass / Work Pass holders are exempt from CPF'
      }];
    } else {
      // Citizen / PR standard CPF
      const monthlyCap = 6800; // Ordinary wage ceiling
      const subjectMonthly = Math.min(insBaseMonthly, monthlyCap);
      const monthlyCpf = subjectMonthly * 0.20;
      const annualCpf = Math.min(monthlyCpf * 12, 102000 * 0.20);
      employeeInsuranceItems = [{
        id: 'cpf',
        name: 'Central Provident Fund (CPF 20%)',
        rate: 20.0,
        annualAmount: annualCpf,
        monthlyAmount: annualCpf / 12,
        description: '20% up to Ordinary Wage ceiling S$6,800/mo'
      }];
    }
  } else if (profile.id === 'AU') {
    // AUSTRALIA: Medicare Levy 2% with low-income shade-in
    let medicareLevyAnnual = 0;
    if (annualGross > 26000) {
      if (annualGross <= 32500) {
        // Phase-in rate of 10% on excess over $26,000
        medicareLevyAnnual = (annualGross - 26000) * 0.10;
      } else {
        medicareLevyAnnual = annualGross * 0.02;
      }
    }
    employeeInsuranceItems = [{
      id: 'medicare',
      name: 'Medicare Levy (2.0%)',
      rate: annualGross > 0 ? (medicareLevyAnnual / annualGross) * 100 : 2.0,
      annualAmount: medicareLevyAnnual,
      monthlyAmount: medicareLevyAnnual / 12,
      description: '2% with exemption below A$26,000'
    }];
  } else if (profile.id === 'CA') {
    // CANADA: CPP (5.95% on $3,500 to $68,500, max $3,867.50) + EI (1.66% up to $63,200, max $1,049.12)
    const cppEarnings = Math.max(0, Math.min(annualGross, 68500) - 3500);
    const cppAnnual = Math.min(3867.50, cppEarnings * 0.0595);

    const eiEarnings = Math.min(annualGross, 63200);
    const eiAnnual = Math.min(1049.12, eiEarnings * 0.0166);

    employeeInsuranceItems = [
      {
        id: 'cpp',
        name: 'Canada Pension Plan (CPP)',
        rate: 5.95,
        annualAmount: cppAnnual,
        monthlyAmount: cppAnnual / 12,
        description: '5.95% between $3,500 and $68,500 (Max $3,867.50)'
      },
      {
        id: 'ei',
        name: 'Employment Insurance (EI)',
        rate: 1.66,
        annualAmount: eiAnnual,
        monthlyAmount: eiAnnual / 12,
        description: '1.66% up to $63,200 (Max $1,049.12)'
      }
    ];
  } else {
    // DE, JP, CUSTOM & General handling
    employeeInsuranceItems = profile.employeeInsurances.map(item => {
      let monthlyAmount = 0;
      let annualAmount = 0;

      if (item.capAnnual) {
        const subjectSalaryAnnual = Math.min(annualGross, item.capAnnual);
        annualAmount = subjectSalaryAnnual * (item.rate / 100);
        monthlyAmount = annualAmount / 12;
      } else if (item.capMonthly) {
        const subjectSalaryMonthly = Math.min(insBaseMonthly, item.capMonthly);
        monthlyAmount = subjectSalaryMonthly * (item.rate / 100);
        annualAmount = monthlyAmount * 12;
      } else {
        annualAmount = annualGross * (item.rate / 100);
        monthlyAmount = annualAmount / 12;
      }

      return {
        id: item.id,
        name: item.name,
        rate: item.rate,
        annualAmount,
        monthlyAmount,
        description: item.description
      };
    });
  }

  const totalEmployeeInsuranceAnnual = employeeInsuranceItems.reduce((acc, i) => acc + i.annualAmount, 0);
  const totalEmployeeInsuranceMonthly = totalEmployeeInsuranceAnnual / 12;

  // 2. Allowances & Deductions
  let personalAllowanceAnnual = profile.personalAllowanceAnnual;
  const dependentAllowanceAnnual = Math.max(0, dependents) * profile.dependentAllowanceAnnual;

  // UK: HMRC £100,000 Personal Allowance Tapering Rule
  // Personal allowance reduces by £1 for every £2 of income above £100,000
  if (profile.id === 'GB' && annualGross > 100000) {
    const excess = annualGross - 100000;
    const reduction = excess / 2;
    personalAllowanceAnnual = Math.max(0, 12570 - reduction);
  }

  // JAPAN: Employment Income Deduction (Kyuyo Shotoku Kojo - 給与所得控除)
  let jpEmploymentDeductionAnnual = 0;
  if (profile.id === 'JP') {
    if (annualGross <= 1625000) {
      jpEmploymentDeductionAnnual = 550000;
    } else if (annualGross <= 1800000) {
      jpEmploymentDeductionAnnual = annualGross * 0.40 - 100000;
    } else if (annualGross <= 3600000) {
      jpEmploymentDeductionAnnual = annualGross * 0.30 + 80000;
    } else if (annualGross <= 6600000) {
      jpEmploymentDeductionAnnual = annualGross * 0.20 + 440000;
    } else if (annualGross <= 8500000) {
      jpEmploymentDeductionAnnual = annualGross * 0.10 + 1100000;
    } else {
      jpEmploymentDeductionAnnual = 1950000;
    }
  }

  const totalAllowancesAnnual = personalAllowanceAnnual + dependentAllowanceAnnual + jpEmploymentDeductionAnnual;

  // 3. Taxable Income
  // In modern payroll, employee social security is deducted before income tax
  const incomeAfterInsuranceAnnual = Math.max(0, annualGross - totalEmployeeInsuranceAnnual);
  const annualTaxableIncome = Math.max(0, incomeAfterInsuranceAnnual - totalAllowancesAnnual);
  const monthlyTaxableIncome = annualTaxableIncome / 12;

  // 4. National / Federal Income Tax Brackets
  let activeTaxBrackets = profile.taxBracketsAnnual;

  // UK: Scotland tax brackets override if SCOT selected
  if (profile.id === 'GB' && subRegionId === 'SCOT') {
    activeTaxBrackets = [
      { bracket: 1, min: 0, max: personalAllowanceAnnual, rate: 0 },
      { bracket: 2, min: 12570, max: 14876, rate: 19 }, // Starter
      { bracket: 3, min: 14876, max: 26561, rate: 20 }, // Basic
      { bracket: 4, min: 26561, max: 43662, rate: 21 }, // Intermediate
      { bracket: 5, min: 43662, max: 75000, rate: 42 }, // Higher
      { bracket: 6, min: 75000, max: 125140, rate: 45 }, // Advanced
      { bracket: 7, min: 125140, max: Infinity, rate: 48 } // Top
    ];
  }

  let accumulatedTaxAnnual = 0;
  const taxBracketBreakdown = activeTaxBrackets.map(bracket => {
    let taxableInBracket = 0;
    let taxAmount = 0;

    if (annualTaxableIncome > bracket.min) {
      const upperLimit = bracket.max === Infinity ? annualTaxableIncome : Math.min(annualTaxableIncome, bracket.max);
      taxableInBracket = Math.max(0, upperLimit - bracket.min);
      taxAmount = taxableInBracket * (bracket.rate / 100);
      accumulatedTaxAnnual += taxAmount;
    }

    return {
      bracket: bracket.bracket,
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      taxableInBracket,
      taxAmount
    };
  });

  let annualNationalTax = accumulatedTaxAnnual;

  // 5. Regional / State / Local Tax calculation
  let regionalTaxName: string | undefined;
  let regionalTaxNameVi: string | undefined;
  let annualRegionalTax = 0;
  let regionalTaxRate: number | undefined;

  // Surtaxes
  let surtaxName: string | undefined;
  let annualSurtax = 0;

  if (profile.id === 'US') {
    // US State Income Tax
    const regionObj = profile.subRegions?.find(r => r.id === subRegionId);
    if (regionObj && regionObj.id !== 'none') {
      regionalTaxName = `${regionObj.name} Income Tax`;
      regionalTaxNameVi = `Thuế thu nhập bang ${regionObj.nameVi}`;
      const stateRate = subRegionId === 'custom' 
        ? (options?.customRate ?? 5.0) 
        : (regionObj.rate ?? 5.0);
      regionalTaxRate = stateRate;
      annualRegionalTax = annualTaxableIncome * (stateRate / 100);
    }
  } else if (profile.id === 'CA') {
    // Canada Provincial Tax
    const regionObj = profile.subRegions?.find(r => r.id === subRegionId);
    if (regionObj && regionObj.id !== 'none') {
      regionalTaxName = `Provincial Tax (${regionObj.name})`;
      regionalTaxNameVi = `Thuế tỉnh bang (${regionObj.nameVi})`;
      const provRate = regionObj.rate ?? 9.0;
      regionalTaxRate = provRate;
      annualRegionalTax = annualTaxableIncome * (provRate / 100);
    }
  } else if (profile.id === 'JP') {
    // Japan: 2.1% Reconstruction Surtax on National Tax
    annualSurtax = annualNationalTax * 0.021;
    surtaxName = 'Reconstruction Surtax (2.1%)';

    // Resident Tax (Juminzei 10%)
    if (subRegionId === 'with_resident') {
      regionalTaxName = 'Resident Tax (10% Juminzei)';
      regionalTaxNameVi = 'Thuế Cư Trú Địa Phương (住民税 10%)';
      regionalTaxRate = 10.0;
      // Resident tax has basic deduction ¥430,000 (¥50,000 lower than national ¥480k)
      const residentTaxable = Math.max(0, annualTaxableIncome + 50000);
      annualRegionalTax = residentTaxable * 0.10;
    }
  } else if (profile.id === 'DE') {
    // Germany: Solidarity Surcharge (5.5% if taxable income > €68,400)
    if (annualTaxableIncome > 68400 && annualNationalTax > 18130) {
      annualSurtax = annualNationalTax * 0.055;
      surtaxName = 'Solidarity Surcharge (5.5% Soli)';
    }

    // Church Tax (Kirchensteuer: 8% in Bayern, 9% in other states)
    if (subRegionId === 'bayern' || subRegionId === 'other') {
      const churchRate = subRegionId === 'bayern' ? 8.0 : 9.0;
      regionalTaxName = `Church Tax (${churchRate}% Kirchensteuer)`;
      regionalTaxNameVi = `Thuế Giáo Hội (${churchRate}% Kirchensteuer)`;
      regionalTaxRate = churchRate;
      annualRegionalTax = annualNationalTax * (churchRate / 100);
    }
  } else if (profile.id === 'CUSTOM') {
    // Universal Custom: Local surcharge if selected
    const regionObj = profile.subRegions?.find(r => r.id === subRegionId);
    if (regionObj && regionObj.id !== 'none') {
      regionalTaxName = 'Local / Municipal Surcharge';
      regionalTaxNameVi = 'Thuế Địa Phương Bổ Sung';
      const localRate = subRegionId === 'custom' 
        ? (options?.customRate ?? 5.0) 
        : (regionObj.rate ?? 5.0);
      regionalTaxRate = localRate;
      annualRegionalTax = annualTaxableIncome * (localRate / 100);
    }
  }

  // Total annual tax = National + Regional/State + Surcharges
  const annualTax = annualNationalTax + annualRegionalTax + annualSurtax;
  const monthlyTax = annualTax / 12;
  const monthlyNationalTax = annualNationalTax / 12;
  const monthlyRegionalTax = annualRegionalTax / 12;
  const monthlySurtax = annualSurtax / 12;
  const effectiveTaxRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;

  // 6. Net Take-Home Salary
  const annualNet = Math.max(0, annualGross - totalEmployeeInsuranceAnnual - annualTax);
  const monthlyNet = annualNet / 12;

  // 7. Employer Contributions
  let employerContributionItems: DetailedCalculationResult['employerContributionItems'] = [];

  if (profile.id === 'VN') {
    const baseSalary = options?.baseSalaryVn || 2340000;
    const maxBhxhMonthly = baseSalary * 20;
    const regionMap: Record<string, number> = { '1': 4960000, '2': 4410000, '3': 3860000, '4': 3450000 };
    const minMonthlyWage = regionMap[subRegionId] || 4960000;
    const maxBhtnMonthly = minMonthlyWage * 20;

    employerContributionItems = profile.employerContributions.map(item => {
      let monthlyAmount = 0;
      if (item.id === 'comp_bhxh' || item.id === 'comp_bhyt') {
        const salaryForIns = Math.min(insBaseMonthly, maxBhxhMonthly);
        monthlyAmount = salaryForIns * (item.rate / 100);
      } else if (item.id === 'comp_bhtn') {
        const salaryForIns = Math.min(insBaseMonthly, maxBhtnMonthly);
        monthlyAmount = salaryForIns * (item.rate / 100);
      } else {
        monthlyAmount = insBaseMonthly * (item.rate / 100);
      }
      return {
        id: item.id,
        name: item.name,
        rate: item.rate,
        annualAmount: monthlyAmount * 12,
        monthlyAmount
      };
    });
  } else if (profile.id === 'SG' && subRegionId === 'foreigner') {
    employerContributionItems = [{
      id: 'comp_cpf',
      name: 'Employer CPF (Foreigner Exempt: 0%)',
      rate: 0,
      annualAmount: 0,
      monthlyAmount: 0
    }];
  } else if (profile.id === 'AU' && subRegionId === 'inclusive') {
    // If inclusive, the super contribution was already set aside from TRP
    employerContributionItems = [{
      id: 'comp_super',
      name: 'Superannuation Guarantee (11.5% from Package)',
      rate: 11.5,
      annualAmount: auSuperIncludedAmount,
      monthlyAmount: auSuperIncludedAmount / 12
    }];
  } else {
    employerContributionItems = profile.employerContributions.map(item => {
      let monthlyAmount = 0;
      let annualAmount = 0;

      if (item.capAnnual) {
        const subjectSalary = Math.min(annualGross, item.capAnnual);
        annualAmount = subjectSalary * (item.rate / 100);
        monthlyAmount = annualAmount / 12;
      } else if (item.capMonthly) {
        const subjectSalary = Math.min(insBaseMonthly, item.capMonthly);
        monthlyAmount = subjectSalary * (item.rate / 100);
        annualAmount = monthlyAmount * 12;
      } else {
        annualAmount = annualGross * (item.rate / 100);
        monthlyAmount = annualAmount / 12;
      }

      return {
        id: item.id,
        name: item.name,
        rate: item.rate,
        annualAmount,
        monthlyAmount
      };
    });
  }

  const totalEmployerContributionAnnual = employerContributionItems.reduce((acc, i) => acc + i.annualAmount, 0);
  const totalEmployerContributionMonthly = totalEmployerContributionAnnual / 12;
  const totalEmployerCostAnnual = annualGross + totalEmployerContributionAnnual;
  const totalEmployerCostMonthly = totalEmployerCostAnnual / 12;

  // 8. Multi-Period Conversion Matrix
  const periods: Record<PayPeriod, CalculationBreakdownItem> = {
    annual: {
      period: 'annual',
      gross: annualGross,
      employeeInsurance: totalEmployeeInsuranceAnnual,
      taxableIncome: annualTaxableIncome,
      tax: annualTax,
      net: annualNet,
      employerContribution: totalEmployerContributionAnnual,
      totalEmployerCost: totalEmployerCostAnnual
    },
    monthly: {
      period: 'monthly',
      gross: monthlyGross,
      employeeInsurance: totalEmployeeInsuranceMonthly,
      taxableIncome: monthlyTaxableIncome,
      tax: monthlyTax,
      net: monthlyNet,
      employerContribution: totalEmployerContributionMonthly,
      totalEmployerCost: totalEmployerCostMonthly
    },
    biweekly: {
      period: 'biweekly',
      gross: annualGross / 26,
      employeeInsurance: totalEmployeeInsuranceAnnual / 26,
      taxableIncome: annualTaxableIncome / 26,
      tax: annualTax / 26,
      net: annualNet / 26,
      employerContribution: totalEmployerContributionAnnual / 26,
      totalEmployerCost: totalEmployerCostAnnual / 26
    },
    weekly: {
      period: 'weekly',
      gross: annualGross / 52,
      employeeInsurance: totalEmployeeInsuranceAnnual / 52,
      taxableIncome: annualTaxableIncome / 52,
      tax: annualTax / 52,
      net: annualNet / 52,
      employerContribution: totalEmployerContributionAnnual / 52,
      totalEmployerCost: totalEmployerCostAnnual / 52
    },
    hourly: {
      period: 'hourly',
      gross: annualGross / 2080,
      employeeInsurance: totalEmployeeInsuranceAnnual / 2080,
      taxableIncome: annualTaxableIncome / 2080,
      tax: annualTax / 2080,
      net: annualNet / 2080,
      employerContribution: totalEmployerContributionAnnual / 2080,
      totalEmployerCost: totalEmployerCostAnnual / 2080
    }
  };

  return {
    inputPeriod: 'annual',
    inputSalary: annualGross,
    annualGross,
    monthlyGross,
    employeeInsuranceItems,
    totalEmployeeInsuranceAnnual,
    totalEmployeeInsuranceMonthly,
    personalAllowanceAnnual,
    dependentAllowanceAnnual,
    totalAllowancesAnnual,
    annualTaxableIncome,
    monthlyTaxableIncome,
    taxBracketBreakdown,
    annualNationalTax,
    monthlyNationalTax,
    regionalTaxName,
    regionalTaxNameVi,
    annualRegionalTax,
    monthlyRegionalTax,
    regionalTaxRate,
    surtaxName,
    annualSurtax,
    monthlySurtax,
    annualTax,
    monthlyTax,
    effectiveTaxRate,
    annualNet,
    monthlyNet,
    employerContributionItems,
    totalEmployerContributionAnnual,
    totalEmployerContributionMonthly,
    totalEmployerCostAnnual,
    totalEmployerCostMonthly,
    periods
  };
}

// Reverse Calculation: Given desired Net, solve for required Gross (Net -> Gross)
// Uses high-precision binary search / bisection
export function solveGrossFromNet(
  targetAnnualNet: number,
  profile: CountrySalaryProfile,
  dependents: number = 0,
  options?: SalaryCalculationOptions
): DetailedCalculationResult {
  if (targetAnnualNet <= 0) {
    return calculateFromAnnualGross(0, profile, dependents, options);
  }

  let low = targetAnnualNet;
  let high = targetAnnualNet * 3.5 + 500000; // safe upper bound
  let bestGross = low;

  // 45 iterations provides precision down to < 0.0001 cents/VND
  for (let i = 0; i < 45; i++) {
    const mid = (low + high) / 2;
    const res = calculateFromAnnualGross(mid, profile, dependents, options);
    const currentNet = res.annualNet;

    if (Math.abs(currentNet - targetAnnualNet) < 0.01) {
      bestGross = mid;
      break;
    }

    if (currentNet < targetAnnualNet) {
      low = mid;
    } else {
      high = mid;
      bestGross = mid;
    }
  }

  const finalResult = calculateFromAnnualGross(bestGross, profile, dependents, options);
  return finalResult;
}

// Number formatter that respects country decimals & currency symbol
export function formatCurrency(
  value: number, 
  currencySymbol: string, 
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  if (isNaN(value)) return `${currencySymbol}0`;
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);

  // Position symbol (e.g. 20.000.000 ₫ vs $75,000.00)
  if (currencySymbol === '₫') {
    return `${formatted} ₫`;
  }
  return `${currencySymbol}${formatted}`;
}
