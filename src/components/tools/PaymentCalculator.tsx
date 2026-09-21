import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, DollarSign, RotateCcw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export const PaymentCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [loanAmount, setLoanAmount] = useState<number>(() => {
    return currency === 'VND' ? 500000000 : 20000;
  });
  const [interestRate, setInterestRate] = useState<number>(6.0);
  const [termYears, setTermYears] = useState<number>(4);
  const [frequency, setFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');

  useEffect(() => {
    setLoanAmount((prev) => {
      if (currency === 'VND' && prev < 100000) return 500000000;
      if (currency !== 'VND' && prev >= 1000000) return 20000;
      return prev;
    });
  }, [currency]);

  const calculations = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const annualRate = interestRate / 100;
    
    let periodsPerYear = 12;
    if (frequency === 'biweekly') periodsPerYear = 26;
    if (frequency === 'weekly') periodsPerYear = 52;

    const totalPeriods = termYears * periodsPerYear;
    const ratePerPeriod = annualRate / periodsPerYear;

    let payment = 0;
    let totalPaid = 0;
    let totalInterest = 0;

    if (ratePerPeriod > 0 && totalPeriods > 0) {
      payment = (P * (ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods))) /
                (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);
      totalPaid = payment * totalPeriods;
      totalInterest = totalPaid - P;
    } else if (totalPeriods > 0) {
      payment = P / totalPeriods;
      totalPaid = P;
      totalInterest = 0;
    }

    return {
      payment,
      totalPaid,
      totalInterest,
      totalPeriods,
      periodsPerYear
    };
  }, [loanAmount, interestRate, termYears, frequency]);

  const handleReset = () => {
    setLoanAmount(currency === 'VND' ? 500000000 : 20000);
    setInterestRate(6.0);
    setTermYears(4);
    setFrequency('monthly');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-800 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Payment Calculator – Tính Khoản Thanh Toán Định Kỳ</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính số tiền cần trả theo tháng, 2 tuần một lần hoặc hàng tuần cho mọi khoản vay</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="payment-reset-btn"
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
            <DollarSign className="w-4 h-4 text-indigo-400" />
            Chi tiết khoản vay
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Số tiền vay ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="payment-loan-amount"
                type="number"
                step={currency === 'VND' ? 10000000 : 500}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lãi suất (%/năm)</label>
              <input
                id="payment-interest-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thời hạn (năm)</label>
              <input
                id="payment-term-years"
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tần suất thanh toán</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="freq-monthly"
                onClick={() => setFrequency('monthly')}
                className={`py-2 px-2 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Hàng tháng (12)
              </button>
              <button
                type="button"
                id="freq-biweekly"
                onClick={() => setFrequency('biweekly')}
                className={`py-2 px-2 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                  frequency === 'biweekly'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                2 tuần/lần (26)
              </button>
              <button
                type="button"
                id="freq-weekly"
                onClick={() => setFrequency('weekly')}
                className={`py-2 px-2 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                  frequency === 'weekly'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Hàng tuần (52)
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Khoản thanh toán mỗi kỳ ({frequency === 'monthly' ? 'Mỗi tháng' : frequency === 'biweekly' ? 'Mỗi 2 tuần' : 'Mỗi tuần'})
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-indigo-300 font-sans tabular-nums">
              {formatMoney(calculations.payment)}
            </div>
            <p className="text-xs text-slate-400">
              Tổng cộng {calculations.totalPeriods} kỳ thanh toán trong {termYears} năm
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Tổng tiền trả gốc & lãi</span>
              <div className="text-lg sm:text-2xl font-bold text-white font-sans tabular-nums">
                {formatMoney(calculations.totalPaid)}
              </div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Tổng tiền lãi phải trả</span>
              <div className="text-lg sm:text-2xl font-bold text-rose-400 font-sans tabular-nums">
                {formatMoney(calculations.totalInterest)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-200">Mẹo tài chính thông minh:</div>
            <p>
              Chọn thanh toán 2 tuần một lần (Bi-weekly) giúp bạn trả thêm tương đương 1 tháng tiền gốc mỗi năm, rút ngắn thời gian vay và tiết kiệm đáng kể chi phí lãi suất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
