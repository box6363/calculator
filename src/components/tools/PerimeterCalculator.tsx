import React, { useState, useMemo } from 'react';
import { CircleDot, RotateCcw } from 'lucide-react';
import { PerimeterVisualizer } from './geometry/PerimeterVisualizer';

type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'polygon';

export const PerimeterCalculator: React.FC = () => {
  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [v1, setV1] = useState<number>(10);
  const [v2, setV2] = useState<number>(6);
  const [v3, setV3] = useState<number>(8);
  const [polygonSides, setPolygonSides] = useState<number>(5);
  const [polygonSideLength, setPolygonSideLength] = useState<number>(4);

  const calculations = useMemo(() => {
    let perimeter = 0;
    let formula = '';

    if (shape === 'rectangle') {
      perimeter = 2 * (v1 + v2);
      formula = `2 × (Dài + Rộng) = 2 × (${v1} + ${v2})`;
    } else if (shape === 'triangle') {
      perimeter = v1 + v2 + v3;
      formula = `a + b + c = ${v1} + ${v2} + ${v3}`;
    } else if (shape === 'circle') {
      perimeter = 2 * Math.PI * v1;
      formula = `2 × π × r = 2 × 3.14159 × ${v1}`;
    } else if (shape === 'polygon') {
      perimeter = polygonSides * polygonSideLength;
      formula = `Số cạnh × Độ dài cạnh = ${polygonSides} × ${polygonSideLength}`;
    }

    return {
      perimeter: Number(perimeter.toFixed(4)),
      formula
    };
  }, [shape, v1, v2, v3, polygonSides, polygonSideLength]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <CircleDot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Perimeter Calculator – Tính Chu Vi Các Hình</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tính chu vi hình chữ nhật, tam giác, đường tròn và đa giác đều</p>
          </div>
        </div>
        <button
          id="peri-reset-btn"
          onClick={() => { setShape('rectangle'); setV1(10); setV2(6); setV3(8); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'rectangle', label: 'Hình chữ nhật' },
          { id: 'triangle', label: 'Hình tam giác' },
          { id: 'circle', label: 'Hình tròn' },
          { id: 'polygon', label: 'Đa giác đều' },
        ].map((s) => (
          <button
            key={s.id}
            id={`peri-shape-${s.id}`}
            onClick={() => setShape(s.id as ShapeType)}
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
          <h2 className="text-base font-semibold text-white">Kích thước cạnh</h2>

          {shape === 'rectangle' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chiều dài</label>
                <input
                  id="peri-rect-l"
                  type="number"
                  value={v1}
                  onChange={(e) => setV1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chiều rộng</label>
                <input
                  id="peri-rect-w"
                  type="number"
                  value={v2}
                  onChange={(e) => setV2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {shape === 'triangle' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh a</label>
                <input
                  id="peri-tri-a"
                  type="number"
                  value={v1}
                  onChange={(e) => setV1(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh b</label>
                <input
                  id="peri-tri-b"
                  type="number"
                  value={v2}
                  onChange={(e) => setV2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh c</label>
                <input
                  id="peri-tri-c"
                  type="number"
                  value={v3}
                  onChange={(e) => setV3(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}

          {shape === 'circle' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bán kính r</label>
              <input
                id="peri-cir-r"
                type="number"
                value={v1}
                onChange={(e) => setV1(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {shape === 'polygon' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Số cạnh của đa giác đều (n)</label>
                <input
                  id="peri-poly-n"
                  type="number"
                  value={polygonSides}
                  onChange={(e) => setPolygonSides(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Độ dài mỗi cạnh (s)</label>
                <input
                  id="peri-poly-s"
                  type="number"
                  value={polygonSideLength}
                  onChange={(e) => setPolygonSideLength(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">CHU VI TÍNH ĐƯỢC</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
              {calculations.perimeter.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-2">
              Công thức: {calculations.formula}
            </p>
          </div>

          <PerimeterVisualizer
            shape={shape}
            v1={v1}
            v2={v2}
            v3={v3}
            polygonSides={polygonSides}
            polygonSideLength={polygonSideLength}
            perimeter={calculations.perimeter}
            formula={calculations.formula}
          />
        </div>
      </div>
    </div>
  );
};
