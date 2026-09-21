import React, { useState, useMemo, useEffect } from 'react';
import {
  Receipt,
  Users,
  Check,
  Copy
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export const TipCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  // Base bill amount in selected currency ($85 USD base)
  const [billAmount, setBillAmount] = useState<number>(() => {
    return currency === 'VND' ? 500000 : 85;
  });
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [roundUp, setRoundUp] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync default bill amount when switching currency
  useEffect(() => {
    setBillAmount((prev) => {
      if (currency === 'VND' && prev < 1000) return 500000;
      if (currency !== 'VND' && prev >= 10000) return 85;
      return prev;
    });
  }, [currency]);

  const calculations = useMemo(() => {
    const rawTip = (billAmount * tipPercent) / 100;
    let totalBill = billAmount + rawTip;

    if (roundUp) {
      totalBill = Math.ceil(totalBill);
    }

    const finalTip = Math.max(0, totalBill - billAmount);
    const tipPerPerson = peopleCount > 0 ? finalTip / peopleCount : 0;
    const totalPerPerson = peopleCount > 0 ? totalBill / peopleCount : 0;
    const billPerPerson = peopleCount > 0 ? billAmount / peopleCount : 0;

    return {
      finalTip,
      totalBill,
      tipPerPerson,
      totalPerPerson,
      billPerPerson
    };
  }, [billAmount, tipPercent, peopleCount, roundUp]);

  const handleCopy = () => {
    const text = `Chia hóa đơn & Tiền Tip:
- Hóa đơn gốc: ${formatMoney(billAmount)}
- Tiền tip (${tipPercent}%): ${formatMoney(calculations.finalTip)}
- Tổng hóa đơn: ${formatMoney(calculations.totalBill)}
- Chia ${peopleCount} người:
  + Mỗi người trả: ${formatMoney(calculations.totalPerPerson)}
  + (Tiền món: ${formatMoney(calculations.billPerPerson)} + Tip: ${formatMoney(calculations.tipPerPerson)})`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tip-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tip Calculator (Tính Tiền Tip &amp; Chia Bill)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính toán tiền tip theo chuẩn quốc tế và chia đều hóa đơn cho nhóm bạn hoặc gia đình.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Bill Amount */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tổng hóa đơn ({currencyInfo.symbol} {currencyInfo.code})
              </label>
              <span className="text-xs font-bold text-emerald-600 font-mono">
                {formatMoney(billAmount)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-base">{currencyInfo.symbol}</span>
              <input
                type="number"
                min={0}
                step={currency === 'VND' ? 10000 : 1}
                value={billAmount}
                onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-300 rounded-2xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-bold text-xs">{currencyInfo.code}</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pt-1">
              {(currency === 'VND' 
                ? [100000, 200000, 500000, 1000000, 2000000]
                : [25, 50, 85, 120, 200]
              ).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setBillAmount(v)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    billAmount === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {currency === 'VND' ? `${v / 1000}k` : `${currencyInfo.symbol}${v}`}
                </button>
              ))}
            </div>
          </div>

          {/* Tip Percentage Selection */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chọn mức tiền Tip (%)
              </label>
              <span className="text-sm font-bold text-blue-600 font-mono">
                {tipPercent}%
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[10, 15, 18, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tipPercent === pct
                      ? 'bg-blue-600 text-white shadow-xs scale-102 font-black'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-500 whitespace-nowrap">Tùy chỉnh:</span>
              <input
                type="range"
                min={0}
                max={50}
                value={tipPercent}
                onChange={(e) => setTipPercent(Number(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" /> Số người chia tiền
              </label>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {peopleCount} người
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={100}
                value={peopleCount}
                onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
                className="flex-1 p-2 text-center bg-white border border-slate-300 rounded-xl font-black text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setPeopleCount(peopleCount + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Round up checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-semibold">
                <input
                  type="checkbox"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span>Làm tròn tổng hóa đơn lên số nguyên gần nhất</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Receipt */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Per Person Hero */}
          <div className="hero-result-card bg-white dark:bg-gradient-to-br dark:from-emerald-900 dark:via-slate-900 dark:to-teal-950 p-6 rounded-3xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Số tiền mỗi người cần trả ({peopleCount} người)
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formatMoney(calculations.totalPerPerson)}
              </span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">/ người</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50">
                <span className="text-slate-600 dark:text-slate-400 block mb-0.5">Tiền món mỗi người</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {formatMoney(calculations.billPerPerson)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-slate-800/70 border border-emerald-200 dark:border-slate-700/50">
                <span className="text-emerald-800 dark:text-slate-400 block mb-0.5">Tiền tip mỗi người</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                  {formatMoney(calculations.tipPerPerson)}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Totals */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tổng kết toàn bộ bàn ăn
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600">Hóa đơn ban đầu:</span>
                <span className="font-bold text-slate-800 font-mono">{formatMoney(billAmount)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600">Tổng tiền tip ({tipPercent}%):</span>
                <span className="font-bold text-emerald-600 font-mono">{formatMoney(calculations.finalTip)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm">
                <span className="font-bold text-emerald-900">Tổng thanh toán:</span>
                <span className="font-black text-emerald-700 font-mono text-base">{formatMoney(calculations.totalBill)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
