import React, { useState, useMemo, useEffect } from 'react';
import { Table, DollarSign, RotateCcw, ArrowDownCircle, FileDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { AmortizationPdfModal } from './AmortizationPdfModal';

export const AmortizationCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [loanAmount, setLoanAmount] = useState<number>(() => {
    return currency === 'VND' ? 2000000000 : 150000;
  });
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(15);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(() => {
    return currency === 'VND' ? 2000000 : 100;
  });
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Synchronize when switching currency
  useEffect(() => {
    if (currency === 'VND') {
      setLoanAmount((prev) => (prev < 1000000 ? 2000000000 : prev));
      setExtraMonthlyPayment((prev) => (prev < 10000 ? 2000000 : prev));
    } else {
      setLoanAmount((prev) => (prev >= 10000000 ? 150000 : prev));
      setExtraMonthlyPayment((prev) => (prev >= 100000 ? 100 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = loanTermYears * 12;

    let baseMonthlyPayment = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      baseMonthlyPayment = (P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
                           (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (totalMonths > 0) {
      baseMonthlyPayment = P / totalMonths;
    }

    const actualMonthlyPayment = baseMonthlyPayment + Math.max(0, extraMonthlyPayment);

    const monthlySchedule = [];
    const yearlySchedule: Record<number, { year: number; principal: number; interest: number; balance: number; extra: number }> = {};

    let currentBalance = P;
    let totalInterestPaid = 0;
    let actualMonthsTaken = 0;

    for (let m = 1; m <= totalMonths && currentBalance > 0.01; m++) {
      actualMonthsTaken++;
      const interestPayment = currentBalance * monthlyRate;
      let principalPayment = actualMonthlyPayment - interestPayment;
      
      if (principalPayment > currentBalance) {
        principalPayment = currentBalance;
      }

      currentBalance = Math.max(0, currentBalance - principalPayment);
      totalInterestPaid += interestPayment;

      const yearNumber = Math.ceil(m / 12);
      monthlySchedule.push({
        month: m,
        year: yearNumber,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: currentBalance
      });

      if (!yearlySchedule[yearNumber]) {
        yearlySchedule[yearNumber] = {
          year: yearNumber,
          principal: 0,
          interest: 0,
          balance: currentBalance,
          extra: 0
        };
      }
      yearlySchedule[yearNumber].principal += principalPayment;
      yearlySchedule[yearNumber].interest += interestPayment;
      yearlySchedule[yearNumber].balance = currentBalance;
    }

    // Standard interest without extra payment
    let standardTotalInterest = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      standardTotalInterest = (baseMonthlyPayment * totalMonths) - P;
    }

    const interestSaved = Math.max(0, standardTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, totalMonths - actualMonthsTaken);

    return {
      baseMonthlyPayment,
      actualMonthlyPayment,
      totalInterestPaid,
      totalPaid: P + totalInterestPaid,
      actualMonthsTaken,
      interestSaved,
      monthsSaved,
      monthlySchedule,
      yearlySchedule: Object.values(yearlySchedule)
    };
  }, [loanAmount, interestRate, loanTermYears, extraMonthlyPayment]);

  const handleReset = () => {
    setLoanAmount(currency === 'VND' ? 2000000000 : 150000);
    setInterestRate(6.5);
    setLoanTermYears(15);
    setExtraMonthlyPayment(currency === 'VND' ? 2000000 : 100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-900/40 via-slate-800 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Amortization Calculator – Lịch Trình Trả Nợ Chi Tiết</h1>
            <p className="text-xs sm:text-sm text-slate-400">Bảng phân bổ tiền gốc &amp; lãi từng tháng, từng năm kết hợp mô phỏng trả thêm tiền gốc</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="amort-export-pdf-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 border border-cyan-500/50 rounded-lg shadow-sm transition-all cursor-pointer"
            title="Xuất bảng tính và lịch trình trả nợ ra file PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất file PDF</span>
          </button>
          <button
            id="amort-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            Thông số khoản vay
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Số tiền vay ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="amort-loan-amount"
                type="number"
                step={currency === 'VND' ? 50000000 : 5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-cyan-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lãi suất (%/năm)</label>
              <input
                id="amort-interest-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thời hạn (năm)</label>
              <input
                id="amort-term-years"
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
              <ArrowDownCircle className="w-3.5 h-3.5" />
              Trả thêm tiền gốc mỗi tháng ({currencyInfo.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="amort-extra-payment"
                type="number"
                step={currency === 'VND' ? 500000 : 25}
                value={extraMonthlyPayment}
                onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-emerald-500/50 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Giúp giảm tổng lãi và tất toán trước hạn</span>
          </div>

          {extraMonthlyPayment > 0 && calculations.interestSaved > 0 && (
            <div className="benefit-callout-box p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
              <div className="font-semibold">Lợi ích từ việc trả thêm:</div>
              <div>• Tiết kiệm tiền lãi: <span className="font-bold">{formatMoney(calculations.interestSaved)}</span></div>
              <div>• Trả hết sớm hơn: <span className="font-bold">{calculations.monthsSaved} tháng</span> ({Math.floor(calculations.monthsSaved / 12)} năm {calculations.monthsSaved % 12} tháng)</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Trả hàng tháng</span>
              <span className="text-sm sm:text-base font-bold text-cyan-400 font-sans tabular-nums">{formatMoney(calculations.actualMonthlyPayment)}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Tiền gốc vay</span>
              <span className="text-sm sm:text-base font-bold text-white font-sans tabular-nums">{formatMoney(loanAmount)}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Tổng tiền lãi</span>
              <span className="text-sm sm:text-base font-bold text-rose-400 font-sans tabular-nums">{formatMoney(calculations.totalInterestPaid)}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Tổng gốc &amp; lãi</span>
              <span className="text-sm sm:text-base font-bold text-white font-sans tabular-nums">{formatMoney(calculations.totalPaid)}</span>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Lịch trình phân bổ trả nợ (Amortization Schedule)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="amort-table-export-pdf-btn"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 rounded-lg transition-colors cursor-pointer"
                  title="Xuất bảng tính và lịch trình trả nợ ra file PDF"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Xuất PDF</span>
                </button>
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    id="view-mode-yearly"
                    onClick={() => setViewMode('yearly')}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      viewMode === 'yearly' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Theo năm
                  </button>
                  <button
                    type="button"
                    id="view-mode-monthly"
                    onClick={() => setViewMode('monthly')}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      viewMode === 'monthly' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Theo tháng
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-800 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">{viewMode === 'yearly' ? 'Năm' : 'Tháng'}</th>
                    <th className="p-2">Tiền gốc đã trả</th>
                    <th className="p-2">Tiền lãi đã trả</th>
                    <th className="p-2 text-right">Dư nợ còn lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans tabular-nums">
                  {viewMode === 'yearly' ? (
                    calculations.yearlySchedule.map((row) => (
                      <tr key={row.year} className="hover:bg-slate-800/40">
                        <td className="p-2 font-semibold text-white">Năm {row.year}</td>
                        <td className="p-2 text-emerald-400">{formatMoney(row.principal)}</td>
                        <td className="p-2 text-rose-400">{formatMoney(row.interest)}</td>
                        <td className="p-2 text-right text-slate-200">{formatMoney(row.balance)}</td>
                      </tr>
                    ))
                  ) : (
                    calculations.monthlySchedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-800/40">
                        <td className="p-2 font-medium">Tháng {row.month}</td>
                        <td className="p-2 text-emerald-400">{formatMoney(row.principal)}</td>
                        <td className="p-2 text-rose-400">{formatMoney(row.interest)}</td>
                        <td className="p-2 text-right text-slate-200">{formatMoney(row.balance)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <AmortizationPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        loanAmount={loanAmount}
        interestRate={interestRate}
        loanTermYears={loanTermYears}
        extraMonthlyPayment={extraMonthlyPayment}
        calculations={calculations}
      />
    </div>
  );
};
