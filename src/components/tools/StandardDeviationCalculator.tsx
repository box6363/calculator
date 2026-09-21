import React, { useState, useMemo } from 'react';
import { Sigma, RotateCcw } from 'lucide-react';

export const StandardDeviationCalculator: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('10, 12, 23, 23, 16, 23, 21, 16');

  const calculations = useMemo(() => {
    const numbers = dataInput
      .split(/[\s,;]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    const count = numbers.length;
    if (count === 0) {
      return null;
    }

    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // Sum of squared differences
    const sumSqDiff = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);

    // Population Standard Deviation (sigma) = sqrt(sumSqDiff / N)
    const popVariance = sumSqDiff / count;
    const popStdDev = Math.sqrt(popVariance);

    // Sample Standard Deviation (s) = sqrt(sumSqDiff / (n - 1))
    const sampleVariance = count > 1 ? sumSqDiff / (count - 1) : 0;
    const sampleStdDev = count > 1 ? Math.sqrt(sampleVariance) : 0;

    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;

    return {
      count,
      sum,
      mean: mean.toFixed(4),
      sumSqDiff: sumSqDiff.toFixed(4),
      popVariance: popVariance.toFixed(4),
      popStdDev: popStdDev.toFixed(4),
      sampleVariance: sampleVariance.toFixed(4),
      sampleStdDev: sampleStdDev.toFixed(4),
      min,
      max,
      range
    };
  }, [dataInput]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-800 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Sigma className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Standard Deviation Calculator – Tính Độ Lệch Chuẩn</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính phương sai và độ lệch chuẩn mẫu (s) & tổng thể (σ) với dữ liệu bất kỳ</p>
          </div>
        </div>
        <button
          id="sd-reset-btn"
          onClick={() => setDataInput('10, 12, 23, 23, 16, 23, 21, 16')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Nhập chuỗi số liệu</h2>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Các số phân tách bằng dấu phẩy, khoảng trắng hoặc dấu chấm phẩy
            </label>
            <textarea
              id="sd-data-input"
              rows={5}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="VD: 10, 12, 23, 23, 16, 23, 21, 16"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-indigo-400">Công thức thống kê:</div>
            <div>• Độ lệch chuẩn mẫu: <span className="font-bold text-white font-sans">s = √[Σ(x - x̄)² / (n - 1)]</span></div>
            <div>• Độ lệch chuẩn tổng thể: <span className="font-bold text-white font-sans">σ = √[Σ(x - μ)² / N]</span></div>
          </div>
        </div>

        {calculations && (
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-1 text-center">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Độ lệch chuẩn mẫu (Sample s)</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-sans tabular-nums">
                  {calculations.sampleStdDev}
                </div>
                <span className="text-xs text-slate-400">Phương sai mẫu s² = {calculations.sampleVariance}</span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900 border border-slate-800 space-y-1 text-center">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Độ lệch chuẩn tổng thể (Pop σ)</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-sans tabular-nums">
                  {calculations.popStdDev}
                </div>
                <span className="text-xs text-slate-400">Phương sai tổng thể σ² = {calculations.popVariance}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Số lượng (n)</span>
                <span className="text-lg font-bold text-white font-sans">{calculations.count}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung bình (Mean)</span>
                <span className="text-lg font-bold text-white font-sans">{calculations.mean}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Tổng (Sum)</span>
                <span className="text-lg font-bold text-white font-sans">{calculations.sum}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Khoảng biến thiên (Range)</span>
                <span className="text-lg font-bold text-white font-sans">{calculations.range}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
