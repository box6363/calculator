import React, { useState, useMemo, useEffect } from 'react';
import { Coins, DollarSign, RotateCcw, FileDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { InvestmentPdfModal } from './InvestmentPdfModal';

export const InvestmentCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [startingAmount, setStartingAmount] = useState<number>(() => {
    return currency === 'VND' ? 100000000 : 5000;
  });
  const [periodicDeposit, setPeriodicDeposit] = useState<number>(() => {
    return currency === 'VND' ? 5000000 : 300;
  });
  const [depositFrequency, setDepositFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [durationYears, setDurationYears] = useState<number>(10);
  const [annualReturn, setAnnualReturn] = useState<number>(8.0);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const compounding: 'monthly' | 'annually' = 'monthly';

  // Synchronize when switching currency
  useEffect(() => {
    if (currency === 'VND') {
      setStartingAmount((prev) => (prev < 100000 ? 100000000 : prev));
      setPeriodicDeposit((prev) => (prev < 5000 ? 5000000 : prev));
    } else {
      setStartingAmount((prev) => (prev >= 1000000 ? 5000 : prev));
      setPeriodicDeposit((prev) => (prev >= 50000 ? 300 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const P = Math.max(0, startingAmount);
    const PMT = Math.max(0, periodicDeposit);
    const r = (annualReturn / 100);
    const t = Math.max(1, durationYears);

    let balance = P;
    let totalDeposits = P;
    const yearlyData = [];

    for (let yr = 1; yr <= t; yr++) {
      let yearlyInterestEarned = 0;
      let yearlyDepositAdded = 0;

      for (let m = 1; m <= 12; m++) {
        if (depositFrequency === 'monthly' || (depositFrequency === 'annually' && m === 1)) {
          balance += PMT;
          yearlyDepositAdded += PMT;
          totalDeposits += PMT;
        }

        const monthlyRate = r / 12;
        const interest = balance * monthlyRate;
        balance += interest;
        yearlyInterestEarned += interest;
      }

      yearlyData.push({
        year: yr,
        depositsAdded: yearlyDepositAdded,
        totalDeposits,
        interest: yearlyInterestEarned,
        balance
      });
    }

    const totalInterest = balance - totalDeposits;
    const roiPercentage = totalDeposits > 0 ? (totalInterest / totalDeposits) * 100 : 0;

    return {
      endBalance: balance,
      totalDeposits,
      totalInterest,
      roiPercentage,
      yearlyData
    };
  }, [startingAmount, periodicDeposit, depositFrequency, durationYears, annualReturn, compounding]);

  const handleReset = () => {
    setStartingAmount(currency === 'VND' ? 100000000 : 5000);
    setPeriodicDeposit(currency === 'VND' ? 5000000 : 300);
    setDurationYears(10);
    setAnnualReturn(8.0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-800 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Investment Calculator – Tính Toán Lợi Nhuận Đầu Tư</h1>
            <p className="text-xs sm:text-sm text-slate-400">Ước tính giá trị tài sản trong tương lai với số vốn ban đầu và tích lũy định kỳ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="invest-export-pdf-header-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 rounded-lg transition-colors cursor-pointer font-medium"
            title="Xuất báo cáo PDF hoặc In ấn"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF / In</span>
          </button>
          <button
            id="invest-reset-btn"
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
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Kế hoạch đầu tư
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Vốn khởi đầu ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="invest-starting-amount"
                type="number"
                step={currency === 'VND' ? 5000000 : 100}
                value={startingAmount}
                onChange={(e) => setStartingAmount(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Đóng góp thêm ({currencyInfo.symbol})
              </label>
              <div className="relative">
                <input
                  id="invest-periodic-deposit"
                  type="number"
                  step={currency === 'VND' ? 500000 : 25}
                  value={periodicDeposit}
                  onChange={(e) => setPeriodicDeposit(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tần suất đóng góp</label>
              <select
                id="invest-frequency"
                value={depositFrequency}
                onChange={(e) => setDepositFrequency(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="monthly">Mỗi tháng</option>
                <option value="annually">Mỗi năm</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lợi nhuận kỳ vọng (%/năm)</label>
              <input
                id="invest-annual-return"
                type="number"
                step="0.1"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thời gian đầu tư (năm)</label>
              <input
                id="invest-duration-years"
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Tổng giá trị tài sản sau {durationYears} năm
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-emerald-300 font-sans tabular-nums">
              {formatMoney(calculations.endBalance)}
            </div>
            <p className="text-xs text-slate-400">
              Tỷ suất hoàn vốn đầu tư tổng thể (ROI): <span className="text-emerald-400 font-bold">+{calculations.roiPercentage.toFixed(1)}%</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Tổng vốn bạn đã bỏ ra</span>
              <div className="text-lg sm:text-2xl font-bold text-white font-sans tabular-nums">
                {formatMoney(calculations.totalDeposits)}
              </div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Tổng tiền lãi sinh lời</span>
              <div className="text-lg sm:text-2xl font-bold text-emerald-400 font-sans tabular-nums">
                {formatMoney(calculations.totalInterest)}
              </div>
            </div>
          </div>

          {/* Yearly Progress Table */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Biểu đồ tăng trưởng theo từng năm
              </h3>
              <button
                type="button"
                id="invest-export-pdf-table-btn"
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/30 rounded-lg transition-colors cursor-pointer"
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
                    <th className="p-2">Tổng vốn nạp</th>
                    <th className="p-2">Tiền lời sinh ra</th>
                    <th className="p-2 text-right">Tổng tài sản</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans tabular-nums">
                  {calculations.yearlyData.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="p-2 font-medium">Năm {row.year}</td>
                      <td className="p-2 text-slate-300">{formatMoney(row.totalDeposits)}</td>
                      <td className="p-2 text-emerald-400">+{formatMoney(row.interest)}</td>
                      <td className="p-2 text-right font-semibold text-white">{formatMoney(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <InvestmentPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        startingAmount={startingAmount}
        periodicDeposit={periodicDeposit}
        depositFrequency={depositFrequency}
        durationYears={durationYears}
        annualReturn={annualReturn}
        calculations={calculations}
      />
    </div>
  );
};
