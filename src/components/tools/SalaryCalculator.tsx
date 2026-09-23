import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Settings2,
  Copy,
  Check,
  Printer,
  FileDown,
  Users,
  MapPin,
  Building2,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Sparkles,
  Globe2,
  ArrowRightLeft
} from 'lucide-react';
import {
  COUNTRY_PROFILES,
  CountrySalaryProfile,
  PayPeriod,
  PERIOD_LABELS
} from '../../data/salaryInternationalData';
import { 
  calculateFromAnnualGross, 
  solveGrossFromNet, 
  toAnnualAmount, 
  fromAnnualAmount, 
  formatCurrency,
  DetailedCalculationResult 
} from '../../utils/salaryEngine';
import { SalaryCustomSettingsModal } from './SalaryCustomSettingsModal';
import { SalaryMultiPeriodTable } from './SalaryMultiPeriodTable';
import { SalaryPdfModal } from './SalaryPdfModal';
import { useLanguage } from '../../context/LanguageContext';

const STORAGE_PREFIX = 'ac_salary_profile_v2_';

// Standard Country Display Order: Universal / Custom country FIRST, followed by US, UK, Japan, Germany, Vietnam, Singapore, Australia, Canada
const COUNTRY_DISPLAY_ORDER = ['CUSTOM', 'US', 'UK', 'JP', 'DE', 'VN', 'SG', 'AU', 'CA'];

export const SalaryCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // 1. Country Selection (Defaults to CUSTOM or URL param or loaded from preferences)
  const [selectedCountryId, setSelectedCountryId] = useState<string>(() => {
    try {
      const paramCountry = new URLSearchParams(window.location.search).get('country');
      if (paramCountry && COUNTRY_PROFILES[paramCountry.toUpperCase()]) {
        return paramCountry.toUpperCase();
      }
      const savedCountry = localStorage.getItem('ac_salary_calc_last_country');
      if (savedCountry && COUNTRY_PROFILES[savedCountry]) {
        return savedCountry;
      }
    } catch {
      // ignore
    }
    return 'CUSTOM';
  });

  // Country profiles with user custom overrides
  const [profilesState, setProfilesState] = useState<Record<string, CountrySalaryProfile>>(() => {
    const initial: Record<string, CountrySalaryProfile> = { ...COUNTRY_PROFILES };
    try {
      Object.keys(COUNTRY_PROFILES).forEach(id => {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          initial[id] = { ...COUNTRY_PROFILES[id], ...parsed };
        }
      });
    } catch {
      // ignore
    }
    return initial;
  });

  const activeProfile = profilesState[selectedCountryId] || COUNTRY_PROFILES['VN'];

  // Check if active profile differs from country default
  const isProfileCustomized = useMemo(() => {
    const original = COUNTRY_PROFILES[selectedCountryId];
    if (!original) return false;
    return JSON.stringify(original) !== JSON.stringify(activeProfile);
  }, [activeProfile, selectedCountryId]);

  // 2. Calculation Mode: Gross -> Net vs Net -> Gross
  const [mode, setMode] = useState<'gross_to_net' | 'net_to_gross'>('gross_to_net');

  // 3. Pay Period (Annual, Monthly, Bi-weekly, Weekly, Hourly)
  const [payPeriod, setPayPeriod] = useState<PayPeriod>(activeProfile.defaultPeriod);

  // 4. Salary Input
  const [salaryInput, setSalaryInput] = useState<number>(() => {
    try {
      const paramSalary = new URLSearchParams(window.location.search).get('salary') || new URLSearchParams(window.location.search).get('gross');
      if (paramSalary && !isNaN(Number(paramSalary))) {
        return Number(paramSalary);
      }
    } catch {
      // ignore
    }
    const annualDefault = activeProfile.defaultSalary * (activeProfile.defaultPeriod === 'monthly' ? 12 : 1);
    return fromAnnualAmount(annualDefault, activeProfile.defaultPeriod);
  });

  // 5. Dependents & Regional / Local options
  const [dependents, setDependents] = useState<number>(0);
  const [subRegionId, setSubRegionId] = useState<string>(() => {
    return activeProfile.defaultSubRegionId || activeProfile.subRegions?.[0]?.id || '1';
  });
  const [customRate, setCustomRate] = useState<number>(5.0);
  const [useInsuranceOnGross, setUseInsuranceOnGross] = useState<boolean>(true);
  const [customInsuranceSalary, setCustomInsuranceSalary] = useState<number>(4680000);

  // 6. UI Toggles & Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState<boolean>(false);

  // When switching country, adapt defaults smoothly
  const handleCountryChange = (newCountryId: string) => {
    setSelectedCountryId(newCountryId);
    try {
      localStorage.setItem('ac_salary_calc_last_country', newCountryId);
    } catch {
      // ignore
    }

    const newProfile = profilesState[newCountryId] || COUNTRY_PROFILES[newCountryId] || COUNTRY_PROFILES['VN'];
    setPayPeriod(newProfile.defaultPeriod);
    setSalaryInput(newProfile.defaultSalary);
    setDependents(0);
    setSubRegionId(newProfile.defaultSubRegionId || newProfile.subRegions?.[0]?.id || '1');
    setCustomRate(5.0);
  };

  // Convert salary input amount when user switches pay period (e.g. annual $75,000 to monthly $6,250)
  const handlePayPeriodChange = (newPeriod: PayPeriod) => {
    if (newPeriod === payPeriod) return;
    if (salaryInput > 0) {
      const annualEquivalent = toAnnualAmount(salaryInput, payPeriod);
      const converted = fromAnnualAmount(annualEquivalent, newPeriod);
      const rounded = activeProfile.decimals === 0 
        ? Math.round(converted) 
        : Number(converted.toFixed(activeProfile.decimals));
      setSalaryInput(rounded);
    }
    setPayPeriod(newPeriod);
  };

  // Save customized profile
  const handleSaveProfile = (updatedProfile: CountrySalaryProfile) => {
    setProfilesState(prev => ({
      ...prev,
      [updatedProfile.id]: updatedProfile
    }));
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${updatedProfile.id}`, JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }
  };

  // Reset customized profile to country standard
  const handleResetCountryProfile = () => {
    const original = COUNTRY_PROFILES[selectedCountryId];
    if (original) {
      setProfilesState(prev => ({
        ...prev,
        [selectedCountryId]: original
      }));
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${selectedCountryId}`);
      } catch {
        // ignore
      }
    }
  };

  // 7. Core Calculation Memo
  const calculationResult: DetailedCalculationResult = useMemo(() => {
    const annualInput = toAnnualAmount(salaryInput, payPeriod);

    const calcOptions = {
      subRegionId,
      customRate,
      regionId: parseInt(subRegionId, 10) || 1,
      customInsuranceSalaryMonthly: customInsuranceSalary,
      useInsuranceOnGross,
      baseSalaryVn: 2340000
    };

    if (mode === 'gross_to_net') {
      const result = calculateFromAnnualGross(annualInput, activeProfile, dependents, calcOptions);
      result.inputPeriod = payPeriod;
      result.inputSalary = salaryInput;
      return result;
    } else {
      // Net to Gross solver
      const result = solveGrossFromNet(annualInput, activeProfile, dependents, calcOptions);
      result.inputPeriod = payPeriod;
      result.inputSalary = salaryInput;
      return result;
    }
  }, [salaryInput, payPeriod, mode, activeProfile, dependents, subRegionId, customRate, useInsuranceOnGross, customInsuranceSalary]);

  // Visual percentages
  const currentPeriodData = calculationResult.periods[payPeriod];
  const grossCurrent = currentPeriodData.gross;
  const netCurrent = currentPeriodData.net;
  const insCurrent = currentPeriodData.employeeInsurance;
  const taxCurrent = currentPeriodData.tax;

  const netPercent = grossCurrent > 0 ? (netCurrent / grossCurrent) * 100 : 0;
  const insPercent = grossCurrent > 0 ? (insCurrent / grossCurrent) * 100 : 0;
  const taxPercent = grossCurrent > 0 ? (taxCurrent / grossCurrent) * 100 : 0;

  // Selected subregion name helper
  const selectedSubRegionObj = useMemo(() => {
    return activeProfile.subRegions?.find(r => r.id === subRegionId);
  }, [activeProfile, subRegionId]);

  // Copy Payslip text
  const handleCopySlip = () => {
    const symbol = activeProfile.currencySymbol;
    const dec = activeProfile.decimals;
    const periodLabel = isVi ? PERIOD_LABELS[payPeriod].vi : PERIOD_LABELS[payPeriod].en;
    const subRegionName = selectedSubRegionObj 
      ? (isVi ? selectedSubRegionObj.nameVi : selectedSubRegionObj.name)
      : '';

    const text = `==============================
${isVi ? 'PHIẾU LƯƠNG' : 'SALARY SLIP'} (${activeProfile.flag} ${activeProfile.name})
${isVi ? 'Chu kỳ' : 'Period'}: ${periodLabel}${subRegionName ? `\n${isVi ? 'Khu vực / Tùy chọn' : 'Region / Mode'}: ${subRegionName}` : ''}
------------------------------
${isVi ? 'Lương Gross' : 'Gross Salary'}: ${formatCurrency(grossCurrent, symbol, dec)}
${isVi ? 'Khấu trừ Bảo hiểm' : 'Social Security'}: -${formatCurrency(insCurrent, symbol, dec)}
${isVi ? 'Thuế TNCN' : 'Income Tax'}: -${formatCurrency(taxCurrent, symbol, dec)}${calculationResult.annualRegionalTax > 0 ? `\n  • ${isVi ? calculationResult.regionalTaxNameVi : calculationResult.regionalTaxName}: -${formatCurrency(fromAnnualAmount(calculationResult.annualRegionalTax, payPeriod), symbol, dec)}` : ''}${calculationResult.annualSurtax > 0 ? `\n  • ${calculationResult.surtaxName}: -${formatCurrency(fromAnnualAmount(calculationResult.annualSurtax, payPeriod), symbol, dec)}` : ''}
------------------------------
${isVi ? 'THỰC NHẬN (NET)' : 'TAKE-HOME (NET)'}: ${formatCurrency(netCurrent, symbol, dec)}
==============================
${isVi ? 'Chi phí Doanh nghiệp' : 'Employer Cost'}: ${formatCurrency(currentPeriodData.totalEmployerCost, symbol, dec)}
${isVi ? 'Quy đổi Năm' : 'Annual Net'}: ${formatCurrency(calculationResult.annualNet, symbol, dec)}/year
${isVi ? 'Quy đổi Tháng' : 'Monthly Net'}: ${formatCurrency(calculationResult.monthlyNet, symbol, dec)}/month
==============================`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSlip(true);
      setTimeout(() => setCopiedSlip(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP BAR: COUNTRY SELECTOR & INTERNATIONAL PRESETS */}
      <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isVi ? 'Hệ thống Tính Lương Chuẩn Quốc Tế' : 'Global Payroll & Tax System'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{isVi ? 'Chọn Quốc Gia & Hệ Thống Thuế' : 'Select Country & Tax System'}</span>
            </h2>
          </div>

          {/* Quick Country Switcher Pill Buttons (Multi-Country System with Universal Custom on Top) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 sm:pb-1 max-w-full scroll-smooth scrollbar-thin">
            {COUNTRY_DISPLAY_ORDER.map((countryId) => {
              const country = profilesState[countryId] || COUNTRY_PROFILES[countryId];
              if (!country) return null;
              const isSelected = selectedCountryId === country.id;
              const isCustom = country.id === 'CUSTOM';

              return (
                <button
                  key={country.id}
                  onClick={() => handleCountryChange(country.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isCustom
                      ? isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/30'
                        : 'bg-white dark:bg-blue-950/50 hover:bg-slate-100 dark:hover:bg-blue-900/60 text-slate-800 dark:text-blue-300 border border-slate-200 dark:border-blue-800/70'
                      : isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                        : 'bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className={isCustom ? 'font-black' : 'font-semibold'}>
                    {isVi ? country.nameVi : country.name}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isSelected
                        ? 'bg-blue-700 text-white font-bold'
                        : isCustom
                          ? 'bg-slate-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 font-bold'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold'
                    }`}
                  >
                    {country.currencyCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Country Context Badge */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeProfile.flag} {isVi ? activeProfile.nameVi : activeProfile.name}
            </span>
            <span>•</span>
            <span className="text-slate-600 dark:text-slate-400">{isVi ? activeProfile.notesVi : activeProfile.notes}</span>
          </div>

          <div className="flex items-center gap-2">
            {isProfileCustomized ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>{isVi ? 'Đã tùy chỉnh tham số' : 'Custom parameters active'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                <Check className="w-3 h-3" />
                <span>{isVi ? 'Chuẩn quy định hiện hành' : 'Standard statutory rates'}</span>
              </span>
            )}

            <button
              id="salary-export-pdf-top-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isVi ? 'Xuất phiếu lương ra file PDF chuẩn A4' : 'Export payslip to A4 PDF'}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isVi ? 'Xuất PDF / In' : 'Export PDF'}</span>
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{isVi ? 'Tùy chỉnh tham số' : 'Customize parameters'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE GRID: INPUTS (LEFT) & RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INPUT CONTROLS (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Calculation Mode & Salary Input */}
          <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-5">
            {/* Mode Switcher: Gross -> Net vs Net -> Gross */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {isVi ? 'Hướng Tính Lương' : 'Calculation Direction'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 dark:bg-slate-950/80 rounded-xl border border-slate-300/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('gross_to_net')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'gross_to_net'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Gross ➔ Net</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('net_to_gross')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'net_to_gross'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Net ➔ Gross</span>
                </button>
              </div>
            </div>

            {/* Pay Period Selector (Chu kỳ trả lương chuẩn quốc tế) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {isVi ? 'Chu Kỳ Trả Lương' : 'Pay Frequency'}
                </label>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  {isVi ? PERIOD_LABELS[payPeriod].vi : PERIOD_LABELS[payPeriod].en}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['monthly', 'annual', 'biweekly', 'weekly', 'hourly'] as PayPeriod[]).map(p => {
                  const isCur = payPeriod === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePayPeriodChange(p)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        isCur
                          ? 'bg-blue-600 text-white border border-blue-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700/70'
                      }`}
                    >
                      <div className="text-[11px] leading-tight font-bold">
                        {isVi ? PERIOD_LABELS[p].shortVi : PERIOD_LABELS[p].shortEn}
                      </div>
                      <div className={`text-[10px] font-medium capitalize ${isCur ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {p}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Salary Input Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {mode === 'gross_to_net' 
                    ? (isVi ? `Thu Nhập Lương Gross (${PERIOD_LABELS[payPeriod].vi})` : `Gross Salary (${PERIOD_LABELS[payPeriod].en})`)
                    : (isVi ? `Thu Nhập Lương Net Mong Muốn (${PERIOD_LABELS[payPeriod].vi})` : `Target Net Take-Home (${PERIOD_LABELS[payPeriod].en})`)}
                </label>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {activeProfile.currencyCode} ({activeProfile.currencySymbol})
                </span>
              </div>

              <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-white dark:bg-slate-950 overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {activeProfile.currencySymbol}
                </div>
                <input
                  type="number"
                  min="0"
                  step={activeProfile.decimals === 0 ? '1000' : '0.01'}
                  value={salaryInput || ''}
                  onChange={(e) => setSalaryInput(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-14 py-3 text-slate-900 dark:text-white font-black text-lg focus:outline-hidden tabular-nums bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {isVi ? PERIOD_LABELS[payPeriod].shortVi : PERIOD_LABELS[payPeriod].shortEn}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {activeProfile.presets.map((amount) => {
                  const periodAmount = fromAnnualAmount(
                    amount * (activeProfile.defaultPeriod === 'monthly' ? 12 : 1), 
                    payPeriod
                  );
                  return (
                    <button
                      key={amount}
                      onClick={() => setSalaryInput(Math.round(periodAmount))}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700/80 cursor-pointer"
                    >
                      {formatCurrency(periodAmount, activeProfile.currencySymbol, activeProfile.decimals)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dependents Counter */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{isVi ? 'Số Người Phụ Thuộc' : 'Number of Dependents'}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isVi ? activeProfile.dependentAllowanceLabel : 'Child / dependent tax relief credits'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDependents(Math.max(0, dependents - 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center transition-colors text-base border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 dark:text-white text-base">
                    {dependents}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDependents(dependents + 1)}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center transition-colors text-base border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Regional / Jurisdictional options (US State, UK Scotland, DE Church Tax, JP Juminzei, SG CPF, AU Super, CA Province, VN Region, etc.) */}
            {activeProfile.subRegions && activeProfile.subRegions.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>
                        {isVi 
                          ? (activeProfile.subRegionLabelVi || 'Khu vực / Tùy chọn đặc thù') 
                          : (activeProfile.subRegionLabel || 'Region / Jurisdiction')}
                      </span>
                    </span>
                    {selectedSubRegionObj?.rate !== undefined && (
                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded-full">
                        {selectedSubRegionObj.rate > 0 ? `+${selectedSubRegionObj.rate}%` : (isVi ? '0% Thuế bang' : '0% State tax')}
                      </span>
                    )}
                  </label>

                  <select
                    value={subRegionId}
                    onChange={(e) => setSubRegionId(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-hidden"
                  >
                    {activeProfile.subRegions.map((sr) => (
                      <option key={sr.id} value={sr.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                        {isVi ? sr.nameVi : sr.name}
                        {sr.rate !== undefined && sr.rate > 0 ? ` (+${sr.rate}%)` : ''}
                        {sr.description ? ` — ${sr.description}` : ''}
                      </option>
                    ))}
                  </select>

                  {/* If custom subRegion is chosen, allow entering custom percentage */}
                  {subRegionId === 'custom' && (
                    <div className="mt-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60">
                      <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-200 mb-1">
                        {isVi ? 'Nhập tỷ lệ thuế địa phương / tiểu bang tự chọn (%)' : 'Custom Local / State Tax Rate (%)'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="30"
                          value={customRate}
                          onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                          className="w-28 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-blue-400 dark:border-blue-700/60 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden"
                        />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">%</span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {isVi ? 'Áp dụng vào thu nhập chịu thuế' : 'Applied to taxable income'}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedSubRegionObj?.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-1">
                      {selectedSubRegionObj.description}
                    </p>
                  )}
                </div>

                {/* Vietnam specific Insurance base options */}
                {activeProfile.id === 'VN' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{isVi ? 'Mức Lương Đóng Bảo Hiểm' : 'Insurance Salary Base'}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUseInsuranceOnGross(true)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          useInsuranceOnGross
                            ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isVi ? 'Trên Lương Chính Thức' : 'On Official Gross'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseInsuranceOnGross(false)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          !useInsuranceOnGross
                            ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isVi ? 'Mức Khác (Tùy Nhập)' : 'Custom Base'}
                      </button>
                    </div>

                    {!useInsuranceOnGross && (
                      <div className="mt-2">
                        <div className="relative rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950">
                          <input
                            type="number"
                            value={customInsuranceSalary}
                            onChange={(e) => setCustomInsuranceSalary(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden bg-transparent"
                            placeholder={isVi ? 'Mức đóng bảo hiểm (VND)' : 'Insurance base amount'}
                          />
                          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                            ₫/{isVi ? 'tháng' : 'mo'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Parameters Overview Card */}
          <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isVi ? 'Tham số đang áp dụng' : 'Active Payroll Rules'}</span>
              </span>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                {isVi ? 'Chỉnh sửa' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-300">
              <div className="p-2.5 bg-white dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isVi ? 'Giảm trừ cá nhân' : 'Personal Allowance'}</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {formatCurrency(activeProfile.personalAllowanceAnnual, activeProfile.currencySymbol, activeProfile.decimals)}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/yr</span>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isVi ? 'BH & An sinh NLĐ' : 'Employee Deductions'}</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {activeProfile.employeeInsurances.reduce((a, b) => a + b.rate, 0).toFixed(2)}%
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isVi ? 'Đóng góp DN' : 'Employer Cost Match'}</div>
                <div className="font-bold text-indigo-600 dark:text-indigo-300 text-sm">
                  {activeProfile.employerContributions.reduce((a, b) => a + b.rate, 0).toFixed(2)}%
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isVi ? 'Bậc thuế lũy tiến' : 'Tax Brackets'}</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeProfile.taxBracketsAnnual.length} {isVi ? 'bậc thuế' : 'brackets'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE RESULTS & DETAILED PAYSLIP (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Highlights (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. NET TAKE-HOME PAY (HERO CARD - DUAL ZONE COMMERCIAL GRADE) */}
            <div id="salary-net-hero-card" className="salary-hero-card sm:col-span-2 rounded-2xl shadow-xs overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="p-5 sm:p-6 hero-card-body">
                <div className="flex items-center justify-between mb-2">
                  <div className="hero-eyebrow-left flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isVi ? 'Lương Net Thực Nhận' : 'Net Take-Home Pay'}</span>
                  </div>
                  <span className="hero-badge text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300">
                    {netPercent.toFixed(1)}% {isVi ? 'Lương Gross' : 'of Gross'}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight tabular-nums hero-main-number text-slate-900 dark:text-white">
                    {formatCurrency(netCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                  <span className="hero-unit text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 ml-2">
                    /{isVi ? PERIOD_LABELS[payPeriod].shortVi : PERIOD_LABELS[payPeriod].shortEn}
                  </span>
                </div>
              </div>

              {/* High-density commercial equivalents footer (matches user demo section 8) */}
              <div className="hero-footer bg-slate-100 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-3.5 flex flex-wrap items-center gap-6 sm:gap-8">
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isVi ? 'Hàng năm' : 'Annual'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200 tabular-nums">
                    {formatCurrency(calculationResult.annualNet, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isVi ? 'Hàng tuần' : 'Weekly'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200 tabular-nums">
                    {formatCurrency(calculationResult.annualNet / 52, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isVi ? 'Giờ làm (2080h)' : 'Hourly (2080h)'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200 tabular-nums">
                    {formatCurrency(calculationResult.annualNet / 2080, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. GROSS SALARY */}
            <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                {isVi ? 'Lương Gross (Tổng)' : 'Gross Salary'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                100% {isVi ? 'Tổng thu nhập trước thuế' : 'Pre-tax earnings'}
              </div>
            </div>

            {/* 3. SOCIAL CONTRIBUTIONS / INSURANCE */}
            <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                  {isVi ? 'Bảo hiểm & An sinh' : 'Social Contributions'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300">
                  {insPercent.toFixed(1)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                -{formatCurrency(insCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {activeProfile.employeeInsurances.length} {isVi ? 'khoản khấu trừ bắt buộc' : 'statutory deductions'}
              </div>
            </div>

            {/* 4. INCOME TAX */}
            <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 block">
                  {isVi ? 'Thuế TNCN (PIT)' : 'Income Tax'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300">
                  {taxPercent.toFixed(1)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
                -{formatCurrency(taxCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {calculationResult.taxBracketBreakdown.length} {isVi ? 'bậc thuế lũy tiến' : 'tax brackets'} · {isVi ? 'Thực tế' : 'Effective'}: {calculationResult.effectiveTaxRate.toFixed(1)}%
              </div>
            </div>

            {/* 5. TOTAL EMPLOYER COST */}
            <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                  {isVi ? 'Chi Phí Doanh Nghiệp' : 'Total Employer Cost'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-300 dark:border-indigo-500/40 text-indigo-800 dark:text-indigo-300">
                  +{((currentPeriodData.employerContribution / (grossCurrent || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-300 tabular-nums">
                {formatCurrency(currentPeriodData.totalEmployerCost, activeProfile.currencySymbol, activeProfile.decimals)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {isVi ? 'Bao gồm bảo hiểm & trợ cấp DN đóng' : 'Gross + Employer match'}
              </div>
            </div>
          </div>

          {/* Interactive Visual Distribution Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isVi ? 'Cơ cấu Phân bổ Thu nhập Gross' : 'Income Distribution Breakdown'}</span>
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-normal">
                {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
              </span>
            </div>

            {/* Multi-segment progress bar */}
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-300 dark:border-slate-800">
              <div
                style={{ width: `${Math.max(1, netPercent)}%` }}
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
                title={`Net: ${netPercent.toFixed(1)}%`}
              />
              <div
                style={{ width: `${insPercent}%` }}
                className="h-full bg-amber-500 transition-all duration-300"
                title={`Insurance: ${insPercent.toFixed(1)}%`}
              />
              <div
                style={{ width: `${taxPercent}%` }}
                className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
                title={`Tax: ${taxPercent.toFixed(1)}%`}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{isVi ? 'Net thực nhận' : 'Net'}: <strong className="text-slate-900 dark:text-white">{netPercent.toFixed(1)}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{isVi ? 'Bảo hiểm' : 'Insurance'}: <strong className="text-slate-900 dark:text-white">{insPercent.toFixed(1)}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{isVi ? 'Thuế TNCN' : 'Tax'}: <strong className="text-slate-900 dark:text-white">{taxPercent.toFixed(1)}%</strong></span>
              </div>
            </div>
          </div>

          {/* 3. MULTI-PERIOD MATRIX CONVERSION TABLE */}
          <SalaryMultiPeriodTable
            result={calculationResult}
            profile={activeProfile}
            currentPeriod={payPeriod}
            onSelectPeriod={setPayPeriod}
            lang={language}
          />

          {/* 4. ITEMIZED PAYSLIP BREAKDOWN (PHIẾU LƯƠNG CHI TIẾT) */}
          <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-5 py-4 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm sm:text-base">
                  {isVi ? 'Chi Tiết Bảng Lương & Khấu Trừ' : 'Detailed Payslip & Tax Computation'}
                </h3>
              </div>
              
              {/* Copy, Export PDF & Print Actions */}
              <div className="flex items-center gap-2">
                <button
                  id="salary-export-pdf-slip-btn"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title={isVi ? 'Xuất phiếu lương ra file PDF chuẩn A4' : 'Export payslip to A4 PDF'}
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Xuất PDF' : 'Export PDF'}</span>
                </button>
                <button
                  onClick={handleCopySlip}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedSlip ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlip ? (isVi ? 'Đã sao chép!' : 'Copied!') : (isVi ? 'Sao chép' : 'Copy')}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="p-1.5 bg-white dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  title={isVi ? 'In phiếu lương' : 'Print payslip'}
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm divide-y divide-slate-200 dark:divide-slate-800/80">
              {/* Step 1: Gross */}
              <div className="flex items-center justify-between pb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center">1</span>
                  <span>{isVi ? 'Lương Gross (Thu nhập danh nghĩa)' : 'Gross Pay'}</span>
                </span>
                <span className="font-black text-slate-900 dark:text-white tabular-nums text-sm sm:text-base">
                  {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                </span>
              </div>

              {/* Step 2: Employee Deductions */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 text-xs font-bold flex items-center justify-center">2</span>
                    <span>{isVi ? 'Bảo hiểm & An sinh người lao động đóng' : 'Employee Social Deductions'}</span>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                    -{formatCurrency(insCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>

                <div className="pl-7 space-y-1.5 text-slate-500 dark:text-slate-400">
                  {calculationResult.employeeInsuranceItems.map(item => {
                    const periodAmount = fromAnnualAmount(item.annualAmount, payPeriod);
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span>{item.name} ({item.rate}%)</span>
                        <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                          -{formatCurrency(periodAmount, activeProfile.currencySymbol, activeProfile.decimals)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Tax Deductions & Allowances */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 text-xs font-bold flex items-center justify-center">3</span>
                    <span>{isVi ? 'Mức giảm trừ & Miễn thuế' : 'Allowances & Tax Deductions'}</span>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                    {formatCurrency(fromAnnualAmount(calculationResult.totalAllowancesAnnual, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>

                <div className="pl-7 space-y-1 text-slate-500 dark:text-slate-400 text-xs">
                  <div className="flex justify-between">
                    <span>{isVi ? 'Giảm trừ cá nhân / bản thân' : 'Personal Standard Allowance'}</span>
                    <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(fromAnnualAmount(calculationResult.personalAllowanceAnnual, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                    </span>
                  </div>
                  {dependents > 0 && (
                    <div className="flex justify-between">
                      <span>{isVi ? `Giảm trừ người phụ thuộc (${dependents} người)` : `Dependent Allowance (${dependents} persons)`}</span>
                      <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                        {formatCurrency(fromAnnualAmount(calculationResult.dependentAllowanceAnnual, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 font-semibold text-slate-800 dark:text-slate-300">
                    <span>{isVi ? 'Thu nhập tính thuế (Taxable Income)' : 'Taxable Income'}</span>
                    <span className="tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(fromAnnualAmount(calculationResult.annualTaxableIncome, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Income Tax */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 text-xs font-bold flex items-center justify-center">4</span>
                    <span>{isVi ? 'Tổng Thuế Thu nhập Cá nhân (PIT)' : 'Total Income Tax (PIT)'}</span>
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                    -{formatCurrency(taxCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>

                {/* Detailed Tax Breakdown (National vs Regional/State vs Surtax) */}
                <div className="pl-7 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {/* National / Federal Tax */}
                  {(calculationResult.annualRegionalTax > 0 || calculationResult.annualSurtax > 0) && (
                    <div className="flex justify-between">
                      <span>{isVi ? 'Thuế TNCN Quốc gia / Liên bang' : 'Federal / National Income Tax'}</span>
                      <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                        -{formatCurrency(fromAnnualAmount(calculationResult.annualNationalTax, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                      </span>
                    </div>
                  )}

                  {/* Regional / State / Local / Church Tax */}
                  {calculationResult.annualRegionalTax > 0 && (
                    <div className="flex justify-between text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 px-2 py-1 rounded-md">
                      <span className="font-medium">
                        {isVi ? calculationResult.regionalTaxNameVi : calculationResult.regionalTaxName}
                        {calculationResult.regionalTaxRate ? ` (${calculationResult.regionalTaxRate}%)` : ''}
                      </span>
                      <span className="tabular-nums font-bold">
                        -{formatCurrency(fromAnnualAmount(calculationResult.annualRegionalTax, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                      </span>
                    </div>
                  )}

                  {/* Surtaxes (e.g. Medicare 0.9%, Reconstruction 2.1%, Solidarität 5.5%) */}
                  {calculationResult.annualSurtax > 0 && (
                    <div className="flex justify-between text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 px-2 py-1 rounded-md">
                      <span className="font-medium">
                        {calculationResult.surtaxName}
                      </span>
                      <span className="tabular-nums font-bold">
                        -{formatCurrency(fromAnnualAmount(calculationResult.annualSurtax, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Toggle progressive tax bracket table */}
                <div className="pl-7 pt-1">
                  <button
                    onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showTaxBreakdown ? (isVi ? 'Thu gọn chi tiết biểu thuế' : 'Hide tax brackets') : (isVi ? 'Xem chi tiết cách tính theo từng bậc thuế' : 'View breakdown by tax bracket')}</span>
                    {showTaxBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showTaxBreakdown && (
                    <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300">
                          <tr>
                            <th className="py-2 px-2.5">{isVi ? 'Bậc' : '#'}</th>
                            <th className="py-2 px-2.5">{isVi ? 'Thu nhập chịu thuế' : 'Bracket Range'}</th>
                            <th className="py-2 px-2.5 text-right">{isVi ? 'Thuế suất' : 'Rate'}</th>
                            <th className="py-2 px-2.5 text-right">{isVi ? 'Tiền thuế' : 'Tax'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                          {calculationResult.taxBracketBreakdown.map((b) => {
                            const taxForPeriod = fromAnnualAmount(b.taxAmount, payPeriod);
                            return (
                              <tr key={b.bracket} className={b.taxAmount > 0 ? 'bg-rose-50 dark:bg-rose-950/30' : ''}>
                                <td className="py-1.5 px-2.5 font-semibold text-slate-800 dark:text-slate-300">{b.bracket}</td>
                                <td className="py-1.5 px-2.5 text-slate-600 dark:text-slate-400">
                                  {formatCurrency(fromAnnualAmount(b.min, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                                  {' ➔ '}
                                  {b.max === Infinity 
                                    ? (isVi ? 'Trở lên' : 'Above') 
                                    : formatCurrency(fromAnnualAmount(b.max, payPeriod), activeProfile.currencySymbol, activeProfile.decimals)}
                                </td>
                                <td className="py-1.5 px-2.5 text-right font-bold text-slate-800 dark:text-slate-300">{b.rate}%</td>
                                <td className="py-1.5 px-2.5 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                                  {formatCurrency(taxForPeriod, activeProfile.currencySymbol, activeProfile.decimals)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 5: NET PAY (HERO ROW) */}
              <div className="pt-3 pb-1 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/40">
                <span className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">5</span>
                  <span>{isVi ? 'LƯƠNG THỰC NHẬN (NET TAKE-HOME)' : 'NET TAKE-HOME PAY'}</span>
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 text-base sm:text-lg tabular-nums">
                  {formatCurrency(netCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                </span>
              </div>

              {/* Step 6: Employer Cost */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{isVi ? 'Người Sử Dụng Lao Động (Doanh nghiệp đóng thêm)' : 'Employer Statutory Contributions'}</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold tabular-nums">
                    +{formatCurrency(currentPeriodData.employerContribution, activeProfile.currencySymbol, activeProfile.decimals)}
                  </span>
                </div>

                <div className="pl-6 space-y-1 text-slate-500 dark:text-slate-400 text-xs">
                  {calculationResult.employerContributionItems.map(item => {
                    const pAmount = fromAnnualAmount(item.annualAmount, payPeriod);
                    return (
                      <div key={item.id} className="flex items-center justify-between">
                        <span>{item.name} ({item.rate}%)</span>
                        <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                          +{formatCurrency(pAmount, activeProfile.currencySymbol, activeProfile.decimals)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between pt-1.5 font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800">
                    <span>{isVi ? 'TỔNG CHI PHÍ NSDLĐ TRẢ' : 'TOTAL EMPLOYER COST'}</span>
                    <span className="text-indigo-600 dark:text-indigo-300 tabular-nums">
                      {formatCurrency(currentPeriodData.totalEmployerCost, activeProfile.currencySymbol, activeProfile.decimals)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CUSTOM PARAMETERS MODAL */}
      <SalaryCustomSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={activeProfile}
        onSaveProfile={handleSaveProfile}
        onResetToCountryDefault={handleResetCountryProfile}
        lang={language}
      />

      {/* 6. SALARY PAYSLIP PDF EXPORT MODAL */}
      {isPdfModalOpen && (
        <SalaryPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          activeProfile={activeProfile}
          payPeriod={payPeriod}
          salaryInput={salaryInput}
          dependents={dependents}
          subRegionName={selectedSubRegionObj?.nameVi || selectedSubRegionObj?.name}
          mode={mode}
          calculationResult={calculationResult}
        />
      )}
    </div>
  );
};
