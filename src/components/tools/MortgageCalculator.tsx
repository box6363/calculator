import React, { useState, useMemo } from 'react';
import {
  Home,
  Check,
  Copy,
  TrendingUp,
  Info
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export const MortgageCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  // Inputs (Base = USD)
  const [homePrice, setHomePrice] = useState<number>(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2); // % per year
  const [homeInsuranceYearly, setHomeInsuranceYearly] = useState<number>(1200); // per year
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);
  const [pmiRate, setPmiRate] = useState<number>(0.75); // % per year if down payment < 20%
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Derived loan values
  const downPaymentAmount = useMemo(() => {
    return Math.round((homePrice * downPaymentPercent) / 100);
  }, [homePrice, downPaymentPercent]);

  const loanAmount = useMemo(() => {
    return Math.max(0, homePrice - downPaymentAmount);
  }, [homePrice, downPaymentAmount]);

  const calculations = useMemo(() => {
    const totalMonths = loanTermYears * 12;
    const monthlyRate = (interestRate / 100) / 12;

    // Monthly Principal & Interest (P&I)
    let monthlyPI = 0;
    if (monthlyRate > 0 && loanAmount > 0) {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (totalMonths > 0) {
      monthlyPI = loanAmount / totalMonths;
    }

    // Monthly taxes & insurance
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const monthlyInsurance = homeInsuranceYearly / 12;
    
    // PMI applies only if down payment < 20%
    const isPmiApplicable = downPaymentPercent < 20;
    const monthlyPmi = isPmiApplicable ? (loanAmount * (pmiRate / 100)) / 12 : 0;

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPmi + hoaMonthly;

    // Total cost over life of loan
    const totalPIPaid = monthlyPI * totalMonths;
    const totalInterest = Math.max(0, totalPIPaid - loanAmount);
    const totalLoanCost = totalMonthlyPayment * totalMonths;

    // Amortization Schedule (Yearly sample)
    const yearlySchedule: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      remainingBalance: number;
    }[] = [];

    let currentBalance = loanAmount;
    for (let year = 1; year <= loanTermYears; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let m = 1; m <= 12; m++) {
        if (currentBalance <= 0) break;
        const interestForMonth = currentBalance * monthlyRate;
        const principalForMonth = Math.min(currentBalance, monthlyPI - interestForMonth);
        yearInterest += interestForMonth;
        yearPrincipal += principalForMonth;
        currentBalance -= principalForMonth;
      }

      yearlySchedule.push({
        year,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        remainingBalance: Math.max(0, Math.round(currentBalance))
      });
    }

    return {
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyPmi: Math.round(monthlyPmi),
      hoaMonthly: Math.round(hoaMonthly),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalLoanCost: Math.round(totalLoanCost),
      isPmiApplicable,
      yearlySchedule
    };
  }, [homePrice, downPaymentPercent, loanAmount, loanTermYears, interestRate, propertyTaxRate, homeInsuranceYearly, hoaMonthly, pmiRate]);

  const handleCopy = () => {
    const summary = `Ước tính vay mua nhà:
- Giá nhà: ${formatMoney(homePrice)}
- Trả trước: ${formatMoney(downPaymentAmount)} (${downPaymentPercent}%)
- Vay: ${formatMoney(loanAmount)} trong ${loanTermYears} năm, lãi ${interestRate}%
- Thanh toán hàng tháng: ${formatMoney(calculations.totalMonthlyPayment)}/tháng
  + Gốc & Lãi (P&I): ${formatMoney(calculations.monthlyPI)}
  + Thuế nhà đất: ${formatMoney(calculations.monthlyTax)}
  + Bảo hiểm: ${formatMoney(calculations.monthlyInsurance)}
  ${calculations.monthlyPmi > 0 ? `+ PMI: ${formatMoney(calculations.monthlyPmi)}\n` : ''}
- Tổng lãi suất cả kỳ: ${formatMoney(calculations.totalInterest)}`;
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const piRatio = calculations.totalMonthlyPayment > 0 ? (calculations.monthlyPI / calculations.totalMonthlyPayment) * 100 : 0;
  const taxRatio = calculations.totalMonthlyPayment > 0 ? (calculations.monthlyTax / calculations.totalMonthlyPayment) * 100 : 0;
  const insRatio = calculations.totalMonthlyPayment > 0 ? (calculations.monthlyInsurance / calculations.totalMonthlyPayment) * 100 : 0;
  const pmiRatio = calculations.totalMonthlyPayment > 0 ? (calculations.monthlyPmi / calculations.totalMonthlyPayment) * 100 : 0;
  const hoaRatio = calculations.totalMonthlyPayment > 0 ? (calculations.hoaMonthly / calculations.totalMonthlyPayment) * 100 : 0;

  const homePricePresets = useMemo(() => {
    if (currency === 'VND') {
      return [
        { label: '2 Tỷ', val: 2000000000 },
        { label: '3.5 Tỷ', val: 3500000000 },
        { label: '5 Tỷ', val: 5000000000 },
        { label: '7.5 Tỷ', val: 7500000000 },
        { label: '10 Tỷ', val: 10000000000 },
      ];
    }
    if (currency === 'JPY' || currency === 'KRW') {
      return [
        { label: '25M', val: 25000000 },
        { label: '35M', val: 35000000 },
        { label: '50M', val: 50000000 },
        { label: '75M', val: 75000000 },
        { label: '100M', val: 100000000 },
      ];
    }
    return [
      { label: `${currencyInfo.symbol}200k`, val: 200000 },
      { label: `${currencyInfo.symbol}350k`, val: 350000 },
      { label: `${currencyInfo.symbol}500k`, val: 500000 },
      { label: `${currencyInfo.symbol}750k`, val: 750000 },
      { label: `${currencyInfo.symbol}1M`, val: 1000000 },
    ];
  }, [currency, currencyInfo.symbol]);

  return (
    <div id="mortgage-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Home className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mortgage Calculator (Vay Mua Nhà)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính toán khoản trả góp hàng tháng, phân bổ gốc/lãi, thuế tài sản, bảo hiểm và PMI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Output & Visuals on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Home Price */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Giá trị bất động sản / Giá nhà ({currencyInfo.symbol} {currencyInfo.code})
              </label>
              <span className="text-xs font-semibold text-blue-600 font-mono">
                {formatMoney(homePrice)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">{currencyInfo.symbol}</span>
              <input
                type="number"
                min={1000}
                max={50000000000}
                step={currency === 'VND' ? 50000000 : 5000}
                value={homePrice}
                onChange={(e) => setHomePrice(Math.max(1000, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5 pt-1 overflow-x-auto">
              {homePricePresets.map(preset => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setHomePrice(preset.val)}
                  className={`text-[11px] px-2 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                    homePrice === preset.val ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Down payment */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Khoản trả trước (Down payment)
              </label>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {formatMoney(downPaymentAmount)} ({downPaymentPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="w-12 text-center text-xs font-bold bg-white py-1.5 border border-slate-300 rounded-lg">
                {downPaymentPercent}%
              </span>
            </div>
            <div className="flex gap-1.5">
              {[5, 10, 15, 20, 25].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDownPaymentPercent(p)}
                  className={`flex-1 text-[11px] py-1 rounded-lg border font-semibold ${
                    downPaymentPercent === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            {downPaymentPercent < 20 && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1 pt-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                Trả trước dưới 20% sẽ chịu thêm phí bảo hiểm khoản vay (PMI).
              </p>
            )}
          </div>

          {/* 3. Loan Term & Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Kỳ hạn vay
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 năm (120 tháng)</option>
                <option value={15}>15 năm (180 tháng)</option>
                <option value={20}>20 năm (240 tháng)</option>
                <option value={25}>25 năm (300 tháng)</option>
                <option value={30}>30 năm (360 tháng)</option>
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Lãi suất năm (%)
              </label>
              <input
                type="number"
                min={0.1}
                max={25}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 4. Taxes & Insurances (Collapsible / Compact) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Chi phí kèm theo (Thuế & Bảo hiểm)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 mb-1 block">Thuế nhà đất (%/năm):</span>
                <input
                  type="number"
                  step={0.1}
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-500 mb-1 block">Bảo hiểm cháy nổ ($/năm):</span>
                <input
                  type="number"
                  step={50}
                  value={homeInsuranceYearly}
                  onChange={(e) => setHomeInsuranceYearly(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-500 mb-1 block">Phí quản lý HOA ($/tháng):</span>
                <input
                  type="number"
                  step={10}
                  value={hoaMonthly}
                  onChange={(e) => setHoaMonthly(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>
              <div>
                <span className="text-slate-500 mb-1 block">Tỷ lệ PMI (%/năm):</span>
                <input
                  type="number"
                  step={0.05}
                  value={pmiRate}
                  onChange={(e) => setPmiRate(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Results & Visual Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Monthly Payment Box */}
          <div className="hero-result-card bg-white dark:bg-gradient-to-br dark:from-blue-900 dark:via-slate-900 dark:to-indigo-950 p-6 rounded-3xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                Ước tính trả hàng tháng
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Cố định trong {loanTermYears} năm
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formatMoney(calculations.totalMonthlyPayment)}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/tháng</span>
            </div>

            {/* Visual Color-Coded Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${piRatio}%` }} className="bg-blue-500 transition-all" title="Gốc & Lãi" />
                <div style={{ width: `${taxRatio}%` }} className="bg-amber-500 transition-all" title="Thuế tài sản" />
                <div style={{ width: `${insRatio}%` }} className="bg-emerald-500 transition-all" title="Bảo hiểm" />
                <div style={{ width: `${pmiRatio}%` }} className="bg-rose-500 transition-all" title="PMI" />
                <div style={{ width: `${hoaRatio}%` }} className="bg-purple-500 transition-all" title="HOA" />
              </div>
            </div>

            {/* Breakdown List */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-transparent">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Gốc &amp; Lãi:
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatMoney(calculations.monthlyPI)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-transparent">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Thuế đất:
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatMoney(calculations.monthlyTax)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-transparent">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Bảo hiểm:
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatMoney(calculations.monthlyInsurance)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-transparent">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Phí PMI:
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatMoney(calculations.monthlyPmi)}
                </span>
              </div>
            </div>
          </div>

          {/* Loan Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Số tiền vay gốc</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                {formatMoney(loanAmount)}
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Tổng lãi cả kỳ</span>
              <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">
                {formatMoney(calculations.totalInterest)}
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 block">Tổng tiền trả góp</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                {formatMoney(calculations.totalLoanCost)}
              </span>
            </div>
          </div>

          {/* Toggle Amortization Schedule */}
          <button
            type="button"
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>{showAmortization ? 'Thu gọn bảng khấu hao dư nợ' : 'Xem lịch trình khấu hao dư nợ qua từng năm'}</span>
          </button>
        </div>
      </div>

      {/* Amortization Table */}
      {showAmortization && (
        <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden animate-in fade-in">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Lịch trình trả nợ gốc và lãi theo từng năm
            </h3>
          </div>
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-3">Năm</th>
                  <th className="p-3">Gốc đã trả</th>
                  <th className="p-3">Lãi đã trả</th>
                  <th className="p-3">Dư nợ còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculations.yearlySchedule.map((item) => (
                  <tr key={item.year} className="hover:bg-slate-50 font-mono">
                    <td className="p-3 font-sans font-semibold text-slate-700">Năm {item.year}</td>
                    <td className="p-3 text-blue-600 font-medium">{formatMoney(item.principalPaid)}</td>
                    <td className="p-3 text-rose-500 font-medium">{formatMoney(item.interestPaid)}</td>
                    <td className="p-3 text-slate-900 font-bold">{formatMoney(item.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
