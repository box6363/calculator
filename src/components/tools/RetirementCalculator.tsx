import React, { useState, useMemo, useEffect } from 'react';
import { PiggyBank, RotateCcw, Calendar } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export const RetirementCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(60);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);

  const [currentSavings, setCurrentSavings] = useState<number>(() => {
    return currency === 'VND' ? 500000000 : 20000;
  });
  const [monthlyContribution, setMonthlyContribution] = useState<number>(() => {
    return currency === 'VND' ? 10000000 : 500;
  });
  const [preRetireReturn, setPreRetireReturn] = useState<number>(7.0);
  const [postRetireReturn, setPostRetireReturn] = useState<number>(5.0);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState<number>(() => {
    return currency === 'VND' ? 25000000 : 2500;
  });

  // Synchronize when currency changes
  useEffect(() => {
    if (currency === 'VND') {
      setCurrentSavings((prev) => (prev < 100000 ? 500000000 : prev));
      setMonthlyContribution((prev) => (prev < 5000 ? 10000000 : prev));
      setDesiredMonthlyIncome((prev) => (prev < 10000 ? 25000000 : prev));
    } else {
      setCurrentSavings((prev) => (prev >= 1000000 ? 20000 : prev));
      setMonthlyContribution((prev) => (prev >= 100000 ? 500 : prev));
      setDesiredMonthlyIncome((prev) => (prev >= 100000 ? 2500 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const yearsToSave = Math.max(1, retireAge - currentAge);
    const monthsToSave = yearsToSave * 12;
    const monthlyRate = (preRetireReturn / 100) / 12;

    // Future Value of current savings: PV * (1 + r)^n
    const fvCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, monthsToSave);

    // Future Value of monthly contributions: PMT * [((1 + r)^n - 1) / r]
    let fvContributions = 0;
    if (monthlyRate > 0) {
      fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, monthsToSave) - 1) / monthlyRate);
    } else {
      fvContributions = monthlyContribution * monthsToSave;
    }

    const totalNestEggAtRetire = fvCurrentSavings + fvContributions;

    // 4% Safe Withdrawal Rule per year / month
    const safeMonthlyWithdrawal = (totalNestEggAtRetire * 0.04) / 12;

    // Years in retirement
    const yearsInRetirement = Math.max(1, lifeExpectancy - retireAge);
    const postMonthlyRate = (postRetireReturn / 100) / 12;
    const postMonths = yearsInRetirement * 12;

    // Present value of desired monthly income during retirement
    let requiredNestEgg = 0;
    if (postMonthlyRate > 0) {
      requiredNestEgg = desiredMonthlyIncome * ((1 - Math.pow(1 + postMonthlyRate, -postMonths)) / postMonthlyRate);
    } else {
      requiredNestEgg = desiredMonthlyIncome * postMonths;
    }

    const surplusOrShortfall = totalNestEggAtRetire - requiredNestEgg;

    return {
      yearsToSave,
      yearsInRetirement,
      totalNestEggAtRetire,
      safeMonthlyWithdrawal,
      requiredNestEgg,
      surplusOrShortfall
    };
  }, [currentAge, retireAge, lifeExpectancy, currentSavings, monthlyContribution, preRetireReturn, postRetireReturn, desiredMonthlyIncome]);

  const handleReset = () => {
    setCurrentAge(30);
    setRetireAge(60);
    setLifeExpectancy(85);
    setCurrentSavings(currency === 'VND' ? 500000000 : 20000);
    setMonthlyContribution(currency === 'VND' ? 10000000 : 500);
    setPreRetireReturn(7.0);
    setPostRetireReturn(5.0);
    setDesiredMonthlyIncome(currency === 'VND' ? 25000000 : 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-900/40 via-slate-800 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Retirement Calculator – Lập Kế Hoạch Nghỉ Hưu</h1>
            <p className="text-xs sm:text-sm text-slate-400">Dự phóng quỹ hưu trí, số tiền rút an toàn theo quy tắc 4% và mục tiêu tiết kiệm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="retirement-reset-btn"
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
            <Calendar className="w-4 h-4 text-amber-400" />
            Độ tuổi & Tiết kiệm
          </h2>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tuổi hiện tại</label>
              <input
                id="retire-current-age"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tuổi nghỉ hưu</label>
              <input
                id="retire-target-age"
                type="number"
                value={retireAge}
                onChange={(e) => setRetireAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kỳ vọng sống</label>
              <input
                id="retire-life-expectancy"
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Đã tích lũy ({currencyInfo.symbol})
              </label>
              <div className="relative">
                <input
                  id="retire-current-savings"
                  type="number"
                  step={currency === 'VND' ? 10000000 : 500}
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Góp mỗi tháng ({currencyInfo.symbol})
              </label>
              <div className="relative">
                <input
                  id="retire-monthly-contrib"
                  type="number"
                  step={currency === 'VND' ? 500000 : 50}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lợi nhuận trước hưu (%)</label>
              <input
                id="retire-pre-return"
                type="number"
                step="0.1"
                value={preRetireReturn}
                onChange={(e) => setPreRetireReturn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lợi nhuận sau hưu (%)</label>
              <input
                id="retire-post-return"
                type="number"
                step="0.1"
                value={postRetireReturn}
                onChange={(e) => setPostRetireReturn(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Mức chi tiêu mong muốn khi nghỉ hưu ({currencyInfo.symbol}/tháng)
            </label>
            <div className="relative">
              <input
                id="retire-desired-income"
                type="number"
                step={currency === 'VND' ? 1000000 : 100}
                value={desiredMonthlyIncome}
                onChange={(e) => setDesiredMonthlyIncome(Number(e.target.value))}
                className="w-full pl-3 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
              Tổng quỹ hưu trí dự kiến tích lũy tại tuổi {retireAge}
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-amber-300 font-sans tabular-nums">
              {formatMoney(calculations.totalNestEggAtRetire)}
            </div>
            <p className="text-xs text-slate-400">
              Bạn có {calculations.yearsToSave} năm tích lũy trước khi tận hưởng {calculations.yearsInRetirement} năm tuổi vàng
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Rút an toàn (Quy tắc 4%)</span>
              <div className="text-lg sm:text-2xl font-bold text-emerald-400 font-sans tabular-nums">
                {formatMoney(calculations.safeMonthlyWithdrawal)}/th
              </div>
              <span className="text-[11px] text-slate-500 block">Bảo toàn vốn không sợ cạn kiệt</span>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Quỹ cần để chi {formatMoney(desiredMonthlyIncome)}/th</span>
              <div className="text-lg sm:text-2xl font-bold text-white font-sans tabular-nums">
                {formatMoney(calculations.requiredNestEgg)}
              </div>
              <span className="text-[11px] text-slate-500 block">Số vốn mục tiêu cần chuẩn bị</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${
            calculations.surplusOrShortfall >= 0
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <span>{calculations.surplusOrShortfall >= 0 ? 'Dự phòng hưu trí: Vượt mục tiêu' : 'Dự phòng hưu trí: Thiếu hụt'}</span>
            <span className="font-bold text-base font-sans tabular-nums">
              {calculations.surplusOrShortfall >= 0 ? '+' : ''}{formatMoney(calculations.surplusOrShortfall)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
