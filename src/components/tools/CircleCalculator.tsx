import React, { useState, useMemo } from 'react';
import { Circle, RotateCcw } from 'lucide-react';
import { AreaVisualizer } from './geometry/AreaVisualizer';

export const CircleCalculator: React.FC = () => {
  const [radius, setRadius] = useState<number>(5);

  const calculations = useMemo(() => {
    const r = Math.max(0, radius);
    const diameter = 2 * r;
    const circumference = 2 * Math.PI * r;
    const area = Math.PI * r * r;

    return {
      radius: r,
      diameter: diameter.toFixed(4),
      circumference: circumference.toFixed(4),
      area: area.toFixed(4)
    };
  }, [radius]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Circle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Circle Calculator – Tính Toán Hình Tròn</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính đường kính d, chu vi C và diện tích A từ bán kính r</p>
          </div>
        </div>
        <button
          id="circle-reset-btn"
          onClick={() => setRadius(5)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Bán kính hình tròn</h2>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bán kính (r)</label>
            <input
              id="circle-radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-blue-400">Công thức cơ bản:</div>
            <div>• Đường kính: <span className="font-mono text-white">d = 2r</span></div>
            <div>• Chu vi: <span className="font-mono text-white">C = 2πr</span></div>
            <div>• Diện tích: <span className="font-mono text-white">A = πr²</span></div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Đường kính (d)</span>
              <span className="text-xl font-bold text-white font-sans">{calculations.diameter}</span>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Chu vi (C)</span>
              <span className="text-xl font-bold text-emerald-400 font-sans">{calculations.circumference}</span>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Diện tích (A)</span>
              <span className="text-xl font-bold text-blue-400 font-sans">{calculations.area}</span>
            </div>
          </div>

          <AreaVisualizer
            shape="circle"
            dim1={radius}
            dim2={0}
            dim3={0}
            area={Number(calculations.area)}
            formula={`A = π × r² = 3.14159 × ${radius}²`}
          />
        </div>
      </div>
    </div>
  );
};
