import React, { useState, useMemo } from 'react';
import { Superscript, RotateCcw } from 'lucide-react';

export const ExponentCalculator: React.FC = () => {
  const [base, setBase] = useState<number>(2);
  const [exponent, setExponent] = useState<number>(8);

  const calculations = useMemo(() => {
    const b = base;
    const exp = exponent;

    let result = 0;
    let isUndefined = false;

    if (b === 0 && exp <= 0) {
      isUndefined = true;
    } else {
      result = Math.pow(b, exp);
    }

    return {
      isUndefined,
      result,
      scientific: result.toExponential(4)
    };
  }, [base, exponent]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Superscript className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Exponent Calculator – Máy Tính Lũy Thừa</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính giá trị lũy thừa x^y với số mũ nguyên dương, nguyên âm hoặc số thập phân</p>
          </div>
        </div>
        <button
          id="exponent-reset-btn"
          onClick={() => { setBase(2); setExponent(8); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Nhập cơ số & số mũ</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cơ số (Base x)</label>
            <input
              id="exp-base"
              type="number"
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Số mũ (Exponent y)</label>
            <input
              id="exp-exponent"
              type="number"
              value={exponent}
              onChange={(e) => setExponent(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {calculations.isUndefined ? (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
              Không xác định (0^0 hoặc 0 với số mũ âm không có nghĩa trong toán học).
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-3">
              <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                {base} ^ {exponent}
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums break-all">
                {Math.abs(calculations.result) > 1e12 || (Math.abs(calculations.result) < 1e-4 && calculations.result !== 0)
                  ? calculations.scientific
                  : calculations.result.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">
                Ký hiệu khoa học (Scientific): <span className="text-white font-mono">{calculations.scientific}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
