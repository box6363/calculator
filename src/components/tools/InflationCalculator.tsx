import React, { useState, useMemo, useEffect } from 'react';
import { TrendingDown, DollarSign, RotateCcw, FileDown, Printer } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { InflationPdfModal } from './InflationPdfModal';

export const InflationCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [currentAmount, setCurrentAmount] = useState<number>(() => {
    return currency === 'VND' ? 50000000 : 1000;
  });
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(10);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Synchronize defaults on currency switch
  useEffect(() => {
    if (currency === 'VND') {
      setCurrentAmount((prev) => (prev < 100000 ? 50000000 : prev));
    } else {
      setCurrentAmount((prev) => (prev >= 1000000 ? 1000 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const P = Math.max(0, currentAmount);
    const r = inflationRate / 100;
    const t = Math.max(1, years);

    // Future equivalent cost (how much you need in future to buy what P buys today)
    const futureEquivalentCost = P * Math.pow(1 + r, t);

    // Future purchasing power (how much today's P will be worth in real terms)
    const futurePurchasingPower = P / Math.pow(1 + r, t);

    const purchasingPowerLossPercent = P > 0 ? ((P - futurePurchasingPower) / P) * 100 : 0;

    const timeline = [];
    for (let yr = 1; yr <= t; yr++) {
      const equiv = P * Math.pow(1 + r, yr);
      const power = P / Math.pow(1 + r, yr);
      timeline.push({
        year: yr,
        equivalent: equiv,
        purchasingPower: power
      });
    }

    return {
      futureEquivalentCost,
      futurePurchasingPower,
      purchasingPowerLossPercent,
      timeline
    };
  }, [currentAmount, inflationRate, years]);

  const handleReset = () => {
    setCurrentAmount(currency === 'VND' ? 50000000 : 1000);
    setInflationRate(3.5);
    setYears(10);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-900/40 via-slate-800 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Inflation Calculator – Tính Toán Lạm Phát</h1>
            <p className="text-xs sm:text-sm text-slate-400">Đo lường sức mua bị bào mòn của đồng tiền và số tiền cần có trong tương lai</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="inflation-export-pdf-header-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 rounded-lg transition-colors cursor-pointer font-medium"
            title="Xuất báo cáo PDF hoặc In ấn"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF / In</span>
          </button>
          <button
            id="inflation-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-rose-400" />
            Thông số tính lạm phát
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Số tiền hiện tại ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="inflation-amount"
                type="number"
                step={currency === 'VND' ? 5000000 : 50}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tỷ lệ lạm phát (%/năm)</label>
              <input
                id="inflation-rate"
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Số năm tương lai</label>
              <input
                id="inflation-years"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-rose-400">Quy luật số 72:</span>
            <p>
              Với mức lạm phát {inflationRate}%/năm, giá cả hàng hóa sẽ tăng gấp đôi sau khoảng <span className="font-bold text-white font-sans">{(72 / Math.max(0.1, inflationRate)).toFixed(1)} năm</span>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/40 to-slate-900 border border-rose-500/40 space-y-2">
              <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold">Sức mua còn lại của {formatMoney(currentAmount)}</span>
              <div className="text-xl sm:text-3xl font-extrabold text-rose-400 font-sans tabular-nums">
                {formatMoney(calculations.futurePurchasingPower)}
              </div>
              <p className="text-xs text-slate-400">
                Mất đi <span className="text-rose-400 font-bold font-sans">-{calculations.purchasingPowerLossPercent.toFixed(1)}%</span> giá trị thực tế do lạm phát sau {years} năm.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Cần có trong tương lai để mua hàng tương đương</span>
              <div className="text-xl sm:text-3xl font-extrabold text-amber-300 font-sans tabular-nums">
                {formatMoney(calculations.futureEquivalentCost)}
              </div>
              <p className="text-xs text-slate-400">
                Cần thêm <span className="text-amber-400 font-bold font-sans">+{formatMoney(calculations.futureEquivalentCost - currentAmount)}</span> để mua cùng giỏ hàng hóa.
              </p>
            </div>
          </div>

          {/* Timeline Table */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Sức mua theo thời gian ({years} năm tới)
              </h3>
              <button
                type="button"
                id="inflation-export-pdf-table-btn"
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/30 rounded-lg transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất PDF / In</span>
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-800 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Năm</th>
                    <th className="p-2">Sức mua của {formatMoney(currentAmount)}</th>
                    <th className="p-2 text-right">Số tiền tương đương cần có</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans tabular-nums">
                  {calculations.timeline.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="p-2 font-medium">Năm {row.year}</td>
                      <td className="p-2 text-rose-400">{formatMoney(row.purchasingPower)}</td>
                      <td className="p-2 text-right text-amber-300">{formatMoney(row.equivalent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <InflationPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        currentAmount={currentAmount}
        inflationRate={inflationRate}
        years={years}
        calculations={calculations}
      />
    </div>
  );
};
