import React, { useState, useMemo } from 'react';
import { BarChart, RotateCcw } from 'lucide-react';

export const StatisticsCalculator: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('12, 15, 18, 20, 22, 25, 28, 30, 32, 40');

  const calculations = useMemo(() => {
    const nums = dataInput
      .split(/[\s,;]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    const n = nums.length;
    if (n === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Quartiles Q1, Q3, IQR
    const lowerHalf = sorted.slice(0, mid);
    const upperHalf = n % 2 !== 0 ? sorted.slice(mid + 1) : sorted.slice(mid);

    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const m = Math.floor(arr.length / 2);
      return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
    };

    const q1 = getMedian(lowerHalf);
    const q3 = getMedian(upperHalf);
    const iqr = q3 - q1;

    // Variance & StdDev
    const sumSq = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const sampleVar = n > 1 ? sumSq / (n - 1) : 0;
    const sampleStd = Math.sqrt(sampleVar);
    const popVar = sumSq / n;
    const popStd = Math.sqrt(popVar);

    return {
      n,
      sum,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      q1: q1.toFixed(4),
      q3: q3.toFixed(4),
      iqr: iqr.toFixed(4),
      sampleVar: sampleVar.toFixed(4),
      sampleStd: sampleStd.toFixed(4),
      popVar: popVar.toFixed(4),
      popStd: popStd.toFixed(4),
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0]
    };
  }, [dataInput]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Statistics Calculator – Máy Tính Thống Kê Toàn Diện</h1>
            <p className="text-xs sm:text-sm text-slate-400">Thống kê mô tả: Tứ phân vị (Q1, Q3), IQR, phương sai, độ lệch chuẩn, khoảng biến thiên</p>
          </div>
        </div>
        <button
          id="stats-reset-btn"
          onClick={() => setDataInput('12, 15, 18, 20, 22, 25, 28, 30, 32, 40')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Bộ dữ liệu thống kê</h2>
          <div>
            <textarea
              id="stats-input"
              rows={6}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {calculations && (
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Kích thước mẫu (n)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.n}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung bình (Mean)</span>
                <span className="text-base font-bold text-blue-400 font-sans">{calculations.mean}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Trung vị (Median)</span>
                <span className="text-base font-bold text-emerald-400 font-sans">{calculations.median}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Tứ phân vị Q1</span>
                <span className="text-base font-bold text-white font-sans">{calculations.q1}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Tứ phân vị Q3</span>
                <span className="text-base font-bold text-white font-sans">{calculations.q3}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Khoảng tứ phân vị (IQR)</span>
                <span className="text-base font-bold text-purple-400 font-sans">{calculations.iqr}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Độ lệch chuẩn mẫu (s)</span>
                <span className="text-base font-bold text-amber-400 font-sans">{calculations.sampleStd}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Phương sai mẫu (s²)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.sampleVar}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Min / Max</span>
                <span className="text-base font-bold text-white font-sans">{calculations.min} / {calculations.max}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
