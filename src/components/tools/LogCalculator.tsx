import React, { useState, useMemo } from 'react';
import { Binary, RotateCcw } from 'lucide-react';

export const LogCalculator: React.FC = () => {
  const [value, setValue] = useState<number>(100);
  const [base, setBase] = useState<number>(10);

  const calculations = useMemo(() => {
    const x = value;
    const b = base;

    if (x <= 0) {
      return {
        isValid: false,
        message: 'Logarit chỉ xác định với giá trị x > 0.'
      };
    }
    if (b <= 0 || b === 1) {
      return {
        isValid: false,
        message: 'Cơ số logarit b phải lớn hơn 0 và khác 1 (b > 0, b ≠ 1).'
      };
    }

    const logBase = Math.log(x) / Math.log(b);
    const ln = Math.log(x);
    const log10 = Math.log10(x);
    const log2 = Math.log2(x);

    return {
      isValid: true,
      logBase: Number(logBase.toFixed(6)),
      ln: Number(ln.toFixed(6)),
      log10: Number(log10.toFixed(6)),
      log2: Number(log2.toFixed(6))
    };
  }, [value, base]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Log Calculator – Máy Tính Logarit</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính logarit cơ số bất kỳ log_b(x), logarit tự nhiên ln(x) và logarit thập phân log10(x)</p>
          </div>
        </div>
        <button
          id="log-reset-btn"
          onClick={() => { setValue(100); setBase(10); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Tham số logarit</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cơ số (Base b)</label>
            <input
              id="log-base"
              type="number"
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Giá trị cần tính (x)</label>
            <input
              id="log-value"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {!calculations.isValid ? (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
              {calculations.message}
            </div>
          ) : (
            <>
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
                <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                  log_{base}({value})
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
                  {calculations.logBase}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">ln({value})</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.ln}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">log10({value})</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.log10}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">log2({value})</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.log2}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
