import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Copy,
  Check,
  FileDown,
  Printer
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { CompoundInterestPdfModal } from './CompoundInterestPdfModal';

export const CompoundInterestCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();
  const [copied, setCopied] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // --- Compound Interest States (Base = USD) ---
  const [initialDeposit, setInitialDeposit] = useState<number>(() => {
    if (typeof window === 'undefined') return 5000;
    const p = new URLSearchParams(window.location.search).get('principal') || new URLSearchParams(window.location.search).get('initial');
    return p && !isNaN(Number(p)) ? Number(p) : 5000; // Base $5,000 USD
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    if (typeof window === 'undefined') return 300;
    const m = new URLSearchParams(window.location.search).get('monthly') || new URLSearchParams(window.location.search).get('pmt');
    return m && !isNaN(Number(m)) ? Number(m) : 300; // Base $300 USD / month
  });

  // Adjust default numbers when user toggles between VND and international currency
  useEffect(() => {
    setInitialDeposit((prev) => {
      if (currency === 'VND' && prev < 100000) return 50000000;
      if (currency !== 'VND' && prev >= 10000000) return 5000;
      return prev;
    });
    setMonthlyContribution((prev) => {
      if (currency === 'VND' && prev < 10000) return 3000000;
      if (currency !== 'VND' && prev >= 500000) return 300;
      return prev;
    });
  }, [currency]);
  const [annualRate, setAnnualRate] = useState<number>(() => {
    if (typeof window === 'undefined') return 10;
    const r = new URLSearchParams(window.location.search).get('rate');
    return r && !isNaN(Number(r)) ? Number(r) : 10; // 10% / năm
  });
  const [years, setYears] = useState<number>(() => {
    if (typeof window === 'undefined') return 10;
    const y = new URLSearchParams(window.location.search).get('years') || new URLSearchParams(window.location.search).get('t');
    return y && !isNaN(Number(y)) ? Number(y) : 10; // 10 năm
  });
  const compoundFreq = 12; // 12 times a year (monthly)

  // Compound Interest Calculation
  const compoundResult = useMemo(() => {
    const P = initialDeposit;
    const PMT = monthlyContribution;
    const r = annualRate / 100;
    const n = compoundFreq;
    const t = years;

    const yearlyData: { year: number; totalDeposited: number; totalValue: number; interest: number }[] = [];

    let currentBalance = P;
    let totalDeposited = P;

    for (let yr = 1; yr <= t; yr++) {
      for (let m = 1; m <= n; m++) {
        // Add interest for 1 period
        currentBalance = currentBalance * (1 + r / n) + PMT * (12 / n);
        totalDeposited += PMT * (12 / n);
      }
      yearlyData.push({
        year: yr,
        totalDeposited: Math.round(totalDeposited),
        totalValue: Math.round(currentBalance),
        interest: Math.round(currentBalance - totalDeposited),
      });
    }

    const finalValue = yearlyData[yearlyData.length - 1]?.totalValue || P;
    const finalDeposited = yearlyData[yearlyData.length - 1]?.totalDeposited || P;
    const totalInterest = finalValue - finalDeposited;

    return {
      finalValue,
      finalDeposited,
      totalInterest,
      yearlyData,
    };
  }, [initialDeposit, monthlyContribution, annualRate, years, compoundFreq]);

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lãi Kép & Tích Lũy Tài Chính</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dự phóng tăng trưởng tài sản với mô hình lãi kép định kỳ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="compound-export-pdf-header-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-600/40 rounded-lg transition-colors cursor-pointer font-medium"
            title="Xuất kế hoạch tích lũy PDF hoặc In ấn"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF / In</span>
          </button>
          <CurrencySelector variant="compact" />
        </div>
      </div>

      {/* Main Compound Interest Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Inputs (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Vốn gốc ban đầu ({currencyInfo.symbol} {currencyInfo.code})
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {formatMoney(initialDeposit)}
                </span>
              </div>
              <input
                type="number"
                step={currency === 'VND' ? 5000000 : 200}
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gửi thêm mỗi tháng ({currencyInfo.symbol} {currencyInfo.code})
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {formatMoney(monthlyContribution)}
                </span>
              </div>
              <input
                type="number"
                step={currency === 'VND' ? 500000 : 50}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Lãi suất (% / năm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="40"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Số năm đầu tư</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Quick tenure chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5, 10, 15, 20, 25, 30].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    years === y ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {y} năm
                </button>
              ))}
            </div>
          </div>

          {/* Results Card (Col 6-12) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Giá Trị Tương Lai Sau {years} Năm (FV)
                </span>
                <button
                  onClick={() => copyText(`Đầu tư sau ${years} năm: Tổng tiền ${formatMoney(compoundResult.finalValue)} (Gốc nộp ${formatMoney(compoundResult.finalDeposited)}, Tiền lãi ${formatMoney(compoundResult.totalInterest)}). Tính tại Web Calculator`)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="mt-2">
                <span className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono tracking-tight">
                  {formatMoney(compoundResult.finalValue)}
                </span>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Tổng vốn đã nộp</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5 block">
                  {formatMoney(compoundResult.finalDeposited)}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">Tiền lãi kép thu về</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
                  +{formatMoney(compoundResult.totalInterest)}
                </span>
              </div>
            </div>

            {/* Visual Milestones Preview */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                  Cột mốc tăng trưởng theo thời gian:
                </span>
                <button
                  type="button"
                  id="compound-export-pdf-table-btn"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Xuất PDF / In</span>
                </button>
              </div>
              <div className="space-y-1 text-xs font-mono">
                {compoundResult.yearlyData
                  .filter((_, idx) => (idx + 1) % Math.max(1, Math.floor(years / 4)) === 0 || idx === years - 1)
                  .slice(-4)
                  .map((item) => (
                    <div key={item.year} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="text-slate-600 dark:text-slate-400 font-sans">Năm {item.year}:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{formatMoney(item.totalValue)}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>

        </div>

      {/* PDF Export Modal */}
      <CompoundInterestPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialDeposit={initialDeposit}
        monthlyContribution={monthlyContribution}
        annualRate={annualRate}
        years={years}
        compoundResult={compoundResult}
      />
    </div>
  );
};
