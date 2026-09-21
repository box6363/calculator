import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export const AverageCalculator: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('8, 9, 7.5, 10, 8.5');

  const calculations = useMemo(() => {
    const numbers = dataInput
      .split(/[\s,;]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    const count = numbers.length;
    if (count === 0) return null;

    const sum = numbers.reduce((a, b) => a + b, 0);
    const arithmeticMean = sum / count;

    // Geometric mean (only for positive numbers)
    let geometricMean: number | null = null;
    const allPositive = numbers.every((n) => n > 0);
    if (allPositive) {
      const product = numbers.reduce((a, b) => a * b, 1);
      geometricMean = Math.pow(product, 1 / count);
    }

    // Harmonic mean (only for positive numbers)
    let harmonicMean: number | null = null;
    if (allPositive) {
      const sumInv = numbers.reduce((a, b) => a + (1 / b), 0);
      harmonicMean = count / sumInv;
    }

    // Median
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return {
      count,
      sum,
      arithmeticMean: arithmeticMean.toFixed(4),
      geometricMean: geometricMean !== null ? geometricMean.toFixed(4) : 'N/A (Cần số > 0)',
      harmonicMean: harmonicMean !== null ? harmonicMean.toFixed(4) : 'N/A (Cần số > 0)',
      median,
      min: Math.min(...numbers),
      max: Math.max(...numbers)
    };
  }, [dataInput]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Average Calculator – Tính Trung Bình Cộng</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính trung bình số học (Arithmetic), trung bình nhân (Geometric) và trung bình điều hòa</p>
          </div>
        </div>
        <button
          id="avg-reset-btn"
          onClick={() => setDataInput('8, 9, 7.5, 10, 8.5')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Dữ liệu số</h2>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nhập các giá trị (ngăn cách bởi dấu phẩy, khoảng trắng):
            </label>
            <textarea
              id="avg-data-input"
              rows={5}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {calculations && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Trung bình cộng (Arithmetic Mean)</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
                {calculations.arithmeticMean}
              </div>
              <p className="text-xs text-slate-400">
                Tổng cộng: <span className="text-white font-bold font-sans">{calculations.sum}</span> chia cho <span className="text-white font-bold font-sans">{calculations.count} phần tử</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung bình nhân (Geometric)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.geometricMean}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung bình điều hòa (Harmonic)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.harmonicMean}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung vị (Median)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.median}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Nhỏ nhất / Lớn nhất</span>
                <span className="text-base font-bold text-white font-sans">{calculations.min} / {calculations.max}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
