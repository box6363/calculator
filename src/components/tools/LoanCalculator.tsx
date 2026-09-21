import React, { useState, useMemo, useEffect } from 'react';
import {
  Check,
  Copy,
  Table,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  FileDown
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { AmortizationPdfModal } from './AmortizationPdfModal';

type LoanMethod = 'emi' | 'reducing';
type TenureUnit = 'years' | 'months';

export const LoanCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const [principal, setPrincipal] = useState<number>(() => {
    if (typeof window === 'undefined') return 25000;
    const p = new URLSearchParams(window.location.search).get('amount') || new URLSearchParams(window.location.search).get('principal');
    return p && !isNaN(Number(p)) ? Number(p) : 25000; // Base $25,000
  });

  // When currency changes, automatically adjust principal if it was at a default scale
  useEffect(() => {
    setPrincipal((prev) => {
      if (currency === 'VND' && prev < 1000000) {
        return 500000000;
      } else if (currency !== 'VND' && prev >= 10000000 && (currency === 'USD' || currency === 'EUR' || currency === 'GBP')) {
        return 25000;
      }
      return prev;
    });
  }, [currency]);
  const [interestRate, setInterestRate] = useState<number>(() => {
    if (typeof window === 'undefined') return 8.5;
    const r = new URLSearchParams(window.location.search).get('rate');
    return r && !isNaN(Number(r)) ? Number(r) : 8.5; // 8.5% / năm
  });
  const [tenureValue, setTenureValue] = useState<number>(() => {
    if (typeof window === 'undefined') return 5;
    const y = new URLSearchParams(window.location.search).get('years') || new URLSearchParams(window.location.search).get('tenure');
    return y && !isNaN(Number(y)) ? Number(y) : 5; // 5 năm
  });
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [method, setMethod] = useState<LoanMethod>('emi');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Total months
  const totalMonths = useMemo(() => {
    return tenureUnit === 'years' ? tenureValue * 12 : tenureValue;
  }, [tenureValue, tenureUnit]);

  // Calculations
  const loanSummary = useMemo(() => {
    const P = principal;
    const r = interestRate / 100 / 12; // monthly rate
    const n = totalMonths;

    if (P <= 0 || n <= 0) {
      return {
        monthlyPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
      };
    }

    if (method === 'emi') {
      // Fixed monthly EMI formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
      let emi = 0;
      if (r === 0) {
        emi = P / n;
      } else {
        emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;

      // Generate schedule
      const schedule = [];
      let balance = P;
      for (let i = 1; i <= n; i++) {
        const interestM = balance * r;
        const principalM = emi - interestM;
        balance = Math.max(0, balance - principalM);
        schedule.push({
          month: i,
          payment: emi,
          principalPaid: principalM,
          interestPaid: interestM,
          balance: balance,
        });
      }

      return {
        monthlyPayment: emi,
        firstMonthPayment: emi,
        lastMonthPayment: emi,
        totalInterest,
        totalPayment,
        schedule,
      };
    } else {
      // Reducing balance: Fixed principal per month + interest on remaining balance
      const fixedPrincipalMonthly = P / n;
      let totalInterest = 0;
      const schedule = [];
      let balance = P;

      for (let i = 1; i <= n; i++) {
        const interestM = balance * r;
        const totalMonthM = fixedPrincipalMonthly + interestM;
        totalInterest += interestM;
        balance = Math.max(0, balance - fixedPrincipalMonthly);

        schedule.push({
          month: i,
          payment: totalMonthM,
          principalPaid: fixedPrincipalMonthly,
          interestPaid: interestM,
          balance: balance,
        });
      }

      const totalPayment = P + totalInterest;
      const firstMonthPayment = schedule[0]?.payment || 0;
      const lastMonthPayment = schedule[schedule.length - 1]?.payment || 0;

      return {
        monthlyPayment: firstMonthPayment,
        firstMonthPayment,
        lastMonthPayment,
        totalInterest,
        totalPayment,
        schedule,
      };
    }
  }, [principal, interestRate, totalMonths, method]);

  const principalPercent = useMemo(() => {
    if (loanSummary.totalPayment <= 0) return 100;
    return Math.round((principal / loanSummary.totalPayment) * 100);
  }, [principal, loanSummary.totalPayment]);

  const interestPercent = 100 - principalPercent;

  const copyResult = () => {
    const text = `Ước tính vay: Gốc ${formatMoney(principal)}, Lãi suất ${interestRate}%/năm, Thời hạn ${tenureValue} ${tenureUnit === 'years' ? 'năm' : 'tháng'}. Trả hàng tháng: ${formatMoney(loanSummary.monthlyPayment)}, Tổng lãi: ${formatMoney(loanSummary.totalInterest)}. Tính tại Web Calculator`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick preset chips based on active currency
  const presetChips = useMemo(() => {
    if (currency === 'VND') {
      return [
        { label: '100 Tr', value: 100000000 },
        { label: '300 Tr', value: 300000000 },
        { label: '500 Tr', value: 500000000 },
        { label: '1 Tỷ', value: 1000000000 },
        { label: '2 Tỷ', value: 2000000000 },
      ];
    }
    if (currency === 'JPY' || currency === 'KRW') {
      return [
        { label: '1M', value: 1000000 },
        { label: '3M', value: 3000000 },
        { label: '5M', value: 5000000 },
        { label: '10M', value: 10000000 },
        { label: '20M', value: 20000000 },
      ];
    }
    // Base USD and others (EUR, GBP, CAD, AUD, etc.)
    return [
      { label: `${currencyInfo.symbol}10k`, value: 10000 },
      { label: `${currencyInfo.symbol}25k`, value: 25000 },
      { label: `${currencyInfo.symbol}50k`, value: 50000 },
      { label: `${currencyInfo.symbol}100k`, value: 100000 },
      { label: `${currencyInfo.symbol}250k`, value: 250000 },
    ];
  }, [currency, currencyInfo.symbol]);

  const pdfCalculations = useMemo(() => {
    const monthlySchedule = loanSummary.schedule.map((row) => ({
      month: row.month,
      year: Math.ceil(row.month / 12),
      payment: row.payment,
      principal: row.principalPaid,
      interest: row.interestPaid,
      balance: row.balance,
    }));

    const yearlyScheduleMap: Record<number, { year: number; principal: number; interest: number; balance: number; extra: number }> = {};
    monthlySchedule.forEach((m) => {
      if (!yearlyScheduleMap[m.year]) {
        yearlyScheduleMap[m.year] = {
          year: m.year,
          principal: 0,
          interest: 0,
          balance: m.balance,
          extra: 0
        };
      }
      yearlyScheduleMap[m.year].principal += m.principal;
      yearlyScheduleMap[m.year].interest += m.interest;
      yearlyScheduleMap[m.year].balance = m.balance;
    });

    return {
      baseMonthlyPayment: loanSummary.monthlyPayment,
      actualMonthlyPayment: loanSummary.monthlyPayment,
      totalInterestPaid: loanSummary.totalInterest,
      totalPaid: loanSummary.totalPayment,
      actualMonthsTaken: totalMonths,
      interestSaved: 0,
      monthsSaved: 0,
      monthlySchedule,
      yearlySchedule: Object.values(yearlyScheduleMap)
    };
  }, [loanSummary, totalMonths]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Method Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMethod('emi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              method === 'emi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trả đều cố định (EMI)
          </button>
          <button
            onClick={() => setMethod('reducing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              method === 'reducing' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dư nợ giảm dần
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {method === 'emi' ? 'Số tiền trả mỗi tháng cố định' : 'Gốc trả đều, tiền lãi giảm dần từng tháng'}
          </span>
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            title="Xuất bảng tính khoản vay thành file PDF / Bản in A4"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF</span>
          </button>
          <CurrencySelector variant="compact" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Inputs (Col 1-5) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Principal */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Số tiền muốn vay ({currencyInfo.symbol} {currencyInfo.code})
              </label>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {formatMoney(principal)}
              </span>
            </div>
            <input
              type="number"
              step={currency === 'VND' ? 10000000 : (currency === 'JPY' ? 100000 : 500)}
              min={100}
              max={currency === 'VND' ? 100000000000 : 10000000}
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presetChips.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setPrincipal(chip.value)}
                  className={`px-2 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                    principal === chip.value ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Lãi suất vay (% / năm)</label>
              <span className="text-xs font-bold text-blue-600 font-mono">{interestRate}% / năm</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="1"
                max="35"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-24 h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              <input
                type="range"
                step="0.1"
                min="4"
                max="20"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>4% / năm</span>
              <span>12% / năm</span>
              <span>20% / năm</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Thời hạn vay</label>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {tenureValue} {tenureUnit === 'years' ? 'Năm' : 'Tháng'} ({totalMonths} tháng)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="1"
                max={tenureUnit === 'years' ? 35 : 420}
                value={tenureValue}
                onChange={(e) => setTenureValue(Math.max(1, parseInt(e.target.value) || 1))}
                className="col-span-2 h-12 px-4 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTenureUnit('years')}
                  className={`text-xs font-semibold rounded-lg ${
                    tenureUnit === 'years' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Năm
                </button>
                <button
                  type="button"
                  onClick={() => setTenureUnit('months')}
                  className={`text-xs font-semibold rounded-lg ${
                    tenureUnit === 'months' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tháng
                </button>
              </div>
            </div>
            {/* Quick tenure chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1, 3, 5, 10, 15, 20].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setTenureUnit('years');
                    setTenureValue(yr);
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
                    tenureUnit === 'years' && tenureValue === yr ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {yr} năm
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Results & Visuals (Col 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
          
          {/* Main EMI Highlight - Accent & Result colors: #3B82F6 & #10B981 */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {method === 'emi' ? 'Số tiền trả hàng tháng (EMI)' : 'Số tiền trả tháng đầu tiên'}
              </span>
              <button
                onClick={copyResult}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép tóm tắt' : 'Sao chép'}</span>
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono tracking-tight">
                {formatMoney(loanSummary.monthlyPayment)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ tháng</span>
            </div>

            {method === 'reducing' && (
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
                <span>Giảm dần đến tháng cuối: <strong>{formatMoney(loanSummary.lastMonthPayment)}</strong></span>
              </p>
            )}
          </div>

          {/* Breakdown Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 block">Tổng tiền lãi phải trả</span>
              <span className="text-base sm:text-lg font-bold text-rose-600 font-mono">
                {formatMoney(loanSummary.totalInterest)}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 block">Tổng gốc + lãi</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                {formatMoney(loanSummary.totalPayment)}
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar (Gốc vs Lãi) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-blue-600 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Tiền gốc: {principalPercent}%
              </span>
              <span className="text-rose-500 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Tiền lãi: {interestPercent}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${principalPercent}%` }}
              />
              <div 
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
          </div>

          {/* Schedule Toggle Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-800 text-xs font-bold transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span>Xem lịch trả nợ chi tiết ({totalMonths} kỳ)</span>
              </div>
              {showSchedule ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

        </div>

      </div>

      {/* Expandable Amortization Schedule Table */}
      {showSchedule && (
        <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Bảng Kế Hoạch Trả Nợ Từng Tháng ({totalMonths} tháng)
              </h4>
              <span className="text-xs text-slate-500 font-mono">Đơn vị: {currencyInfo.code}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Xuất PDF Lịch Trả Nợ</span>
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Kỳ</th>
                  <th className="p-2.5">Số tiền trả</th>
                  <th className="p-2.5">Tiền gốc</th>
                  <th className="p-2.5">Tiền lãi</th>
                  <th className="p-2.5 text-right">Dư nợ còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {loanSummary.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="p-2.5 font-sans font-medium text-slate-600">Tháng {row.month}</td>
                    <td className="p-2.5 font-bold text-slate-900">{formatMoney(row.payment)}</td>
                    <td className="p-2.5 text-blue-600">{formatMoney(row.principalPaid)}</td>
                    <td className="p-2.5 text-rose-500">{formatMoney(row.interestPaid)}</td>
                    <td className="p-2.5 text-right font-medium text-slate-700">{formatMoney(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Xuất Báo Cáo & Lịch Trả Nợ PDF */}
      <AmortizationPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        loanAmount={principal}
        interestRate={interestRate}
        loanTermYears={tenureUnit === 'years' ? tenureValue : tenureValue / 12}
        extraMonthlyPayment={0}
        calculations={pdfCalculations}
      />

    </div>
  );
};
