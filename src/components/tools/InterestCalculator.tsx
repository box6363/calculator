import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, RotateCcw, TrendingUp, Award, FileDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { InterestPdfModal } from './InterestPdfModal';

export const InterestCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [principal, setPrincipal] = useState<number>(() => {
    return currency === 'VND' ? 200000000 : 10000;
  });
  const [rate, setRate] = useState<number>(7.0);
  const [years, setYears] = useState<number>(5);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // 12 = monthly, 1 = yearly, 4 = quarterly, 365 = daily
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Synchronize when currency changes
  useEffect(() => {
    if (currency === 'VND') {
      setPrincipal((prev) => (prev < 100000 ? 200000000 : prev));
    } else {
      setPrincipal((prev) => (prev >= 1000000 ? 10000 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const p = Math.max(0, principal);
    const r = rate / 100;
    const t = Math.max(0, years);
    const n = compoundFreq;

    // Simple Interest: I = P * r * t
    const simpleInterest = p * r * t;
    const simpleTotal = p + simpleInterest;

    // Compound Interest: A = P * (1 + r/n)^(n*t)
    const compoundTotal = n > 0 ? p * Math.pow(1 + r / n, n * t) : simpleTotal;
    const compoundInterest = compoundTotal - p;
    const difference = compoundInterest - simpleInterest;

    // Year-by-year comparison
    const yearlyBreakdown = [];
    for (let yr = 1; yr <= Math.min(20, t); yr++) {
      const sTotal = p + (p * r * yr);
      const cTotal = p * Math.pow(1 + r / n, n * yr);
      yearlyBreakdown.push({
        year: yr,
        simple: sTotal,
        compound: cTotal,
        gain: cTotal - sTotal
      });
    }

    return {
      simpleInterest,
      simpleTotal,
      compoundTotal,
      compoundInterest,
      difference,
      yearlyBreakdown
    };
  }, [principal, rate, years, compoundFreq]);

  const handleReset = () => {
    setPrincipal(currency === 'VND' ? 200000000 : 10000);
    setRate(7.0);
    setYears(5);
    setCompoundFreq(12);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-800 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Interest Calculator – Tính Lãi Suất Đơn &amp; Lãi Kép</h1>
            <p className="text-xs sm:text-sm text-slate-400">So sánh trực quan sức mạnh kỳ diệu của lãi kép so với lãi đơn theo thời gian</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="interest-export-pdf-top-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all cursor-pointer"
            title="Xuất file PDF so sánh lãi suất"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất PDF</span>
          </button>
          <button
            id="interest-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input parameters */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Thông số tiền gửi / đầu tư
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Số tiền gốc ban đầu ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="interest-principal"
                type="number"
                step={currency === 'VND' ? 5000000 : 100}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lãi suất hàng năm (%/năm)</label>
              <input
                id="interest-rate"
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thời gian (năm)</label>
              <input
                id="interest-years"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Kỳ hạn ghép lãi (Lãi kép)</label>
            <select
              id="interest-compound-freq"
              value={compoundFreq}
              onChange={(e) => setCompoundFreq(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value={1}>Hàng năm (1 lần/năm)</option>
              <option value={2}>Nửa năm (2 lần/năm)</option>
              <option value={4}>Hàng quý (4 lần/năm)</option>
              <option value={12}>Hàng tháng (12 lần/năm)</option>
              <option value={365}>Hàng ngày (365 lần/năm)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-xs text-slate-300">
            <div className="font-semibold text-emerald-400">Công thức toán học áp dụng:</div>
            <div>• Lãi đơn: <span className="font-sans font-semibold text-white">I = P × r × t</span></div>
            <div>• Lãi kép: <span className="font-sans font-semibold text-white">A = P × (1 + r/n)^(n×t)</span></div>
          </div>
        </div>

        {/* Results comparison */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Simple Interest Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">LÃI ĐƠN (SIMPLE)</span>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-sans tabular-nums">
                {formatMoney(calculations.simpleTotal)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Tiền lãi sinh ra:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatMoney(calculations.simpleInterest)}</span>
              </div>
            </div>

            {/* Compound Interest Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/50 space-y-2 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                LÃI KÉP (COMPOUND)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 font-sans tabular-nums">
                {formatMoney(calculations.compoundTotal)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Tiền lãi sinh ra:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatMoney(calculations.compoundInterest)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-center justify-between">
            <span>Chênh lệch lợi nhuận do lãi kép mang lại:</span>
            <span className="font-bold text-base text-emerald-700 dark:text-emerald-400 font-sans tabular-nums">+{formatMoney(calculations.difference)}</span>
          </div>

          {/* Yearly schedule table */}
          <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tiến trình tăng trưởng từng năm
              </h3>
              <button
                id="interest-export-pdf-table-btn"
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 border border-emerald-200 dark:border-emerald-500/40 rounded-lg transition-colors cursor-pointer"
                title="Xuất bảng tiến trình sang PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất PDF</span>
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Năm</th>
                    <th className="p-2">Lãi đơn</th>
                    <th className="p-2">Lãi kép</th>
                    <th className="p-2 text-right">Lãi kép vượt trội</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans tabular-nums">
                  {calculations.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 font-medium">Năm {row.year}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-300">{formatMoney(row.simple)}</td>
                      <td className="p-2 text-emerald-700 dark:text-emerald-400 font-semibold">{formatMoney(row.compound)}</td>
                      <td className="p-2 text-right text-blue-600 dark:text-blue-400">+{formatMoney(row.gain)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export & Print Modal */}
      <InterestPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        principal={principal}
        rate={rate}
        years={years}
        compoundFreq={compoundFreq}
        calculations={calculations}
      />
    </div>
  );
};
