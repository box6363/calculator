import React, { useState, useMemo } from 'react';
import { Triangle, RotateCcw } from 'lucide-react';
import { RightTriangleVisualizer } from './geometry/RightTriangleVisualizer';

export const RightTriangleCalculator: React.FC = () => {
  const [legA, setLegA] = useState<number>(3);
  const [legB, setLegB] = useState<number>(4);

  const calculations = useMemo(() => {
    const a = Math.max(0.0001, legA);
    const b = Math.max(0.0001, legB);

    // Hypotenuse c = sqrt(a^2 + b^2)
    const c = Math.sqrt(a * a + b * b);

    // Angles
    const angleARad = Math.atan(a / b);
    const angleBRad = Math.atan(b / a);

    const angleADeg = (angleARad * 180) / Math.PI;
    const angleBDeg = (angleBRad * 180) / Math.PI;

    // Area and Perimeter
    const area = 0.5 * a * b;
    const perimeter = a + b + c;

    // Altitude to hypotenuse
    const altitudeC = (a * b) / c;

    return {
      c: c.toFixed(4),
      angleA: angleADeg.toFixed(2),
      angleB: angleBDeg.toFixed(2),
      area: area.toFixed(4),
      perimeter: perimeter.toFixed(4),
      altitudeC: altitudeC.toFixed(4)
    };
  }, [legA, legB]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Right Triangle Calculator – Tính Tam Giác Vuông</h1>
            <p className="text-xs sm:text-sm text-slate-400">Định lý Pytago, cạnh huyền c, 2 góc nhọn, diện tích và đường cao hạ từ đỉnh góc vuông</p>
          </div>
        </div>
        <button
          id="rt-reset-btn"
          onClick={() => { setLegA(3); setLegB(4); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Độ dài hai cạnh góc vuông</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh góc vuông a</label>
            <input
              id="rt-leg-a"
              type="number"
              value={legA}
              onChange={(e) => setLegA(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh góc vuông b</label>
            <input
              id="rt-leg-b"
              type="number"
              value={legB}
              onChange={(e) => setLegB(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-blue-400">Định lý Pytago:</div>
            <div className="font-mono text-white">c = √(a² + b²) = √({legA}² + {legB}²)</div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">CẠNH HUYỀN (HYPOTENUSE c)</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
              {calculations.c}
            </div>
            <p className="text-xs text-slate-400">
              Góc α đối diện cạnh a: <span className="text-white font-bold">{calculations.angleA}°</span> | Góc β đối diện cạnh b: <span className="text-white font-bold">{calculations.angleB}°</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Diện tích</span>
              <span className="text-base font-bold text-white font-sans">{calculations.area}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Chu vi</span>
              <span className="text-base font-bold text-white font-sans">{calculations.perimeter}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Đường cao hc</span>
              <span className="text-base font-bold text-white font-sans">{calculations.altitudeC}</span>
            </div>
          </div>

          <RightTriangleVisualizer
            legA={legA}
            legB={legB}
            hypotenuse={calculations.c}
            angleA={calculations.angleA}
            angleB={calculations.angleB}
            altitudeC={calculations.altitudeC}
            area={calculations.area}
          />
        </div>
      </div>
    </div>
  );
};
