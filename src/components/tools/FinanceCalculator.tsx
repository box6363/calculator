import React, { useState, useEffect } from 'react';
import { Sliders, DollarSign, RotateCcw } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

type SolveTarget = 'fv' | 'pv' | 'pmt' | 'n' | 'rate';

export const FinanceCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [solveFor, setSolveFor] = useState<SolveTarget>('fv');
  const [periods, setPeriods] = useState<number>(60); // N
  const [interestRate, setInterestRate] = useState<number>(6.0); // I/Y (%)
  const [presentValue, setPresentValue] = useState<number>(() => {
    return currency === 'VND' ? -250000000 : -10000;
  }); // PV
  const [payment, setPayment] = useState<number>(() => {
    return currency === 'VND' ? -5000000 : -200;
  }); // PMT
  const [futureValue, setFutureValue] = useState<number>(0); // FV
  const [timing, setTiming] = useState<'end' | 'beginning'>('end');

  // Synchronize defaults on currency switch
  useEffect(() => {
    if (currency === 'VND') {
      setPresentValue((prev) => (Math.abs(prev) < 100000 ? -250000000 : prev));
      setPayment((prev) => (Math.abs(prev) < 5000 ? -5000000 : prev));
    } else {
      setPresentValue((prev) => (Math.abs(prev) >= 1000000 ? -10000 : prev));
      setPayment((prev) => (Math.abs(prev) >= 50000 ? -200 : prev));
    }
  }, [currency]);

  // Compute solved value
  const solvedResult = React.useMemo(() => {
    const r = (interestRate / 100) / 12; // monthly rate
    const n = periods;
    const pv = presentValue;
    const pmt = payment;
    const type = timing === 'beginning' ? 1 : 0;

    try {
      if (solveFor === 'fv') {
        if (r === 0) {
          return -(pv + pmt * n);
        }
        const fv = - (pv * Math.pow(1 + r, n) + pmt * (1 + r * type) * ((Math.pow(1 + r, n) - 1) / r));
        return fv;
      } else if (solveFor === 'pv') {
        if (r === 0) {
          return -(futureValue + pmt * n);
        }
        const pvCalc = - (futureValue + pmt * (1 + r * type) * ((Math.pow(1 + r, n) - 1) / r)) / Math.pow(1 + r, n);
        return pvCalc;
      } else if (solveFor === 'pmt') {
        if (r === 0) {
          return -(futureValue + pv) / n;
        }
        const pmtCalc = - (futureValue + pv * Math.pow(1 + r, n)) / ((1 + r * type) * ((Math.pow(1 + r, n) - 1) / r));
        return pmtCalc;
      } else if (solveFor === 'n') {
        if (r === 0) {
          return -(futureValue + pv) / pmt;
        }
        const num = (futureValue * r - pmt * (1 + r * type)) / (-pv * r - pmt * (1 + r * type));
        if (num <= 0) return 0;
        return Math.log(num) / Math.log(1 + r);
      } else if (solveFor === 'rate') {
        // Newton-Raphson approximation for rate
        let guess = 0.05 / 12;
        for (let i = 0; i < 20; i++) {
          const f = pv * Math.pow(1 + guess, n) + pmt * (1 + guess * type) * ((Math.pow(1 + guess, n) - 1) / guess) + futureValue;
          const df = n * pv * Math.pow(1 + guess, n - 1) + pmt * ((Math.pow(1 + guess, n) - 1) / guess);
          const nextGuess = guess - f / (df || 1);
          if (Math.abs(nextGuess - guess) < 1e-6) {
            guess = nextGuess;
            break;
          }
          guess = nextGuess;
        }
        return guess * 12 * 100;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  }, [solveFor, periods, interestRate, presentValue, payment, futureValue, timing]);

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(num);
  };

  const handleReset = () => {
    setPeriods(60);
    setInterestRate(6.0);
    setPresentValue(currency === 'VND' ? -250000000 : -10000);
    setPayment(currency === 'VND' ? -5000000 : -200);
    setFutureValue(0);
    setTiming('end');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="tool-header-banner p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="banner-icon-box p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Finance Calculator – Máy Tính Tài Chính Tổng Hợp (TVM)</h1>
            <p className="text-xs sm:text-sm text-slate-400">Giải phương trình Giá trị thời gian của tiền tệ (Time Value of Money: PV, FV, PMT, N, Rate)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="finance-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* Target selector buttons */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Chọn đại lượng bạn cần tìm:</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'fv', label: 'Tương lai (FV)', desc: 'Future Value' },
            { id: 'pv', label: 'Hiện tại (PV)', desc: 'Present Value' },
            { id: 'pmt', label: 'Kỳ trả (PMT)', desc: 'Payment' },
            { id: 'n', label: 'Số kỳ (N)', desc: 'Number of periods' },
            { id: 'rate', label: 'Lãi suất (I/Y)', desc: 'Interest rate' },
          ].map((item) => (
            <button
              key={item.id}
              id={`solve-for-${item.id}`}
              onClick={() => setSolveFor(item.id as SolveTarget)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                solveFor === item.id
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="block font-bold text-xs sm:text-sm">{item.label}</span>
              <span className="text-[10px] opacity-75">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-6 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Nhập các thông số đã biết ({currencyInfo.symbol} {currencyInfo.code})
          </h2>

          {solveFor !== 'n' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Số kỳ hạn (N - Tháng/Kỳ)</label>
              <input
                id="tvm-n"
                type="number"
                value={periods}
                onChange={(e) => setPeriods(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {solveFor !== 'rate' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lãi suất hàng năm (I/Y - %/năm)</label>
              <input
                id="tvm-rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {solveFor !== 'pv' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Giá trị hiện tại (PV - âm nếu là tiền đầu tư/gửi ra) ({currencyInfo.symbol})
              </label>
              <input
                id="tvm-pv"
                type="number"
                step={currency === 'VND' ? 5000000 : 100}
                value={presentValue}
                onChange={(e) => setPresentValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {solveFor !== 'pmt' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Thanh toán định kỳ mỗi tháng (PMT) ({currencyInfo.symbol})
              </label>
              <input
                id="tvm-pmt"
                type="number"
                step={currency === 'VND' ? 500000 : 25}
                value={payment}
                onChange={(e) => setPayment(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {solveFor !== 'fv' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Giá trị tương lai (FV) ({currencyInfo.symbol})
              </label>
              <input
                id="tvm-fv"
                type="number"
                step={currency === 'VND' ? 5000000 : 100}
                value={futureValue}
                onChange={(e) => setFutureValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Thời điểm trả lãi/gửi tiền</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="timing-end"
                onClick={() => setTiming('end')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                  timing === 'end' ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Cuối kỳ (End / Ordinary)
              </button>
              <button
                type="button"
                id="timing-beginning"
                onClick={() => setTiming('beginning')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all cursor-pointer ${
                  timing === 'beginning' ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Đầu kỳ (Beginning / Due)
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="lg:col-span-6 space-y-4">
          <div className="tool-hero-banner p-6 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900 border border-emerald-500/40 text-center space-y-3">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              KẾT QUẢ ĐẠI LƯỢNG {solveFor.toUpperCase()}
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400 font-sans tabular-nums">
              {solveFor === 'rate' 
                ? `${formatNumber(solvedResult, 2)}% /năm`
                : solveFor === 'n'
                ? `${formatNumber(solvedResult, 1)} kỳ`
                : formatMoney(Math.abs(solvedResult))}
            </div>
            <p className="text-xs text-slate-400">
              {solveFor === 'fv' && 'Giá trị tài sản tích lũy được trong tương lai sau thời hạn N.'}
              {solveFor === 'pv' && 'Giá trị quy đổi về thời điểm hiện tại của dòng tiền tương lai.'}
              {solveFor === 'pmt' && 'Khoản thanh toán cố định cần trả hoặc gửi định kỳ mỗi tháng.'}
              {solveFor === 'n' && 'Thời gian (số tháng) cần thiết để đạt mục tiêu tài chính.'}
              {solveFor === 'rate' && 'Tỷ suất lợi nhuận nội bộ hàng năm tương ứng.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-200">Quy ước dấu dòng tiền (+ / -):</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Dấu âm (-): Tiền bạn bỏ ra (chi tiền, nạp tiền gửi tiết kiệm, đầu tư).</li>
              <li>Dấu dương (+): Tiền bạn thu về (nhận lại tiền, vay được tiền).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
