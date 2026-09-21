import React, { useState, useMemo } from 'react';
import { Square, RotateCcw } from 'lucide-react';
import { AreaVisualizer } from './geometry/AreaVisualizer';

type Shape = 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'ellipse';

export const AreaCalculator: React.FC = () => {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [dim1, setDim1] = useState<number>(10);
  const [dim2, setDim2] = useState<number>(5);
  const [dim3, setDim3] = useState<number>(8); // for trapezoid height or base2

  const calculations = useMemo(() => {
    let area = 0;
    let formula = '';

    if (shape === 'rectangle') {
      area = dim1 * dim2;
      formula = `Dài × Rộng = ${dim1} × ${dim2}`;
    } else if (shape === 'circle') {
      area = Math.PI * dim1 * dim1;
      formula = `π × r² = 3.14159 × ${dim1}²`;
    } else if (shape === 'triangle') {
      area = 0.5 * dim1 * dim2;
      formula = `(Đáy × Chiều cao) / 2 = (${dim1} × ${dim2}) / 2`;
    } else if (shape === 'trapezoid') {
      area = 0.5 * (dim1 + dim2) * dim3;
      formula = `((Đáy lớn + Đáy bé) × Chiều cao) / 2 = ((${dim1} + ${dim2}) × ${dim3}) / 2`;
    } else if (shape === 'ellipse') {
      area = Math.PI * dim1 * dim2;
      formula = `π × a × b = 3.14159 × ${dim1} × ${dim2}`;
    }

    return {
      area: Number(area.toFixed(4)),
      formula
    };
  }, [shape, dim1, dim2, dim3]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Square className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Area Calculator – Tính Diện Tích Hình Học</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính diện tích hình chữ nhật, hình tròn, tam giác, hình thang và elip</p>
          </div>
        </div>
        <button
          id="area-reset-btn"
          onClick={() => { setShape('rectangle'); setDim1(10); setDim2(5); setDim3(8); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'rectangle', label: 'Hình chữ nhật' },
          { id: 'circle', label: 'Hình tròn' },
          { id: 'triangle', label: 'Tam giác' },
          { id: 'trapezoid', label: 'Hình thang' },
          { id: 'ellipse', label: 'Hình Elip' },
        ].map((s) => (
          <button
            key={s.id}
            id={`area-shape-${s.id}`}
            onClick={() => setShape(s.id as Shape)}
            className={`px-3.5 py-2 text-xs rounded-xl border font-medium transition-all ${
              shape === s.id
                ? 'bg-blue-600 text-white border-blue-500 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Kích thước hình</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {shape === 'rectangle' ? 'Chiều dài' : shape === 'circle' ? 'Bán kính r' : shape === 'triangle' ? 'Độ dài đáy' : shape === 'trapezoid' ? 'Đáy lớn a' : 'Bán trục lớn a'}
            </label>
            <input
              id="area-dim1"
              type="number"
              value={dim1}
              onChange={(e) => setDim1(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {shape !== 'circle' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {shape === 'rectangle' ? 'Chiều rộng' : shape === 'triangle' ? 'Chiều cao h' : shape === 'trapezoid' ? 'Đáy bé b' : 'Bán trục bé b'}
              </label>
              <input
                id="area-dim2"
                type="number"
                value={dim2}
                onChange={(e) => setDim2(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {shape === 'trapezoid' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao h</label>
              <input
                id="area-dim3"
                type="number"
                value={dim3}
                onChange={(e) => setDim3(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">DIỆN TÍCH TÍNH ĐƯỢC</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
              {calculations.area.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-2">
              Công thức: {calculations.formula}
            </p>
          </div>

          <AreaVisualizer
            shape={shape}
            dim1={dim1}
            dim2={dim2}
            dim3={dim3}
            area={calculations.area}
            formula={calculations.formula}
          />
        </div>
      </div>
    </div>
  );
};
