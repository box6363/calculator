import React, { useState, useMemo } from 'react';
import { BarChart3, RotateCcw } from 'lucide-react';

export const MeanMedianModeCalculator: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29');

  const calculations = useMemo(() => {
    const numbers = dataInput
      .split(/[\s,;]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    const count = numbers.length;
    if (count === 0) return null;

    // Mean
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    // Median
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    numbers.forEach((num) => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) {
        maxFreq = freq[num];
      }
    });

    let modes: number[] = [];
    if (maxFreq > 1) {
      modes = Object.keys(freq)
        .filter((k) => freq[Number(k)] === maxFreq)
        .map(Number);
    }

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    return {
      count,
      sum,
      mean: mean.toFixed(3),
      median,
      modes: modes.length > 0 ? modes.join(', ') : 'Không có (Mỗi số xuất hiện 1 lần)',
      maxFreq: maxFreq > 1 ? maxFreq : 1,
      min,
      max,
      range,
      sorted: sorted.join(', ')
    };
  }, [dataInput]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-slate-800 to-slate-900 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Mean, Median, Mode Calculator – Trung Bình, Trung Vị, Yếu Vị</h1>
            <p className="text-xs sm:text-sm text-slate-400">Phân tích đầy đủ xu hướng tập trung của tập dữ liệu mẫu</p>
          </div>
        </div>
        <button
          id="mmm-reset-btn"
          onClick={() => setDataInput('3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Nhập chuỗi số</h2>
          <div>
            <textarea
              id="mmm-input"
              rows={5}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {calculations && (
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/40 rounded-2xl text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">Trung bình (Mean)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-sans tabular-nums">
                  {calculations.mean}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 rounded-2xl text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Trung vị (Median)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-sans tabular-nums">
                  {calculations.median}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl text-center space-y-1">
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Yếu vị (Mode)</span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-sans tabular-nums">
                  {calculations.modes}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Số lượng (n)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.count}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Tổng (Sum)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.sum}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block">Khoảng (Range)</span>
                <span className="text-base font-bold text-white font-sans">{calculations.range}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block mb-1">Dãy số đã sắp xếp tăng dần:</span>
              <span className="font-mono text-slate-200">{calculations.sorted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
