import React, { useState, useMemo } from 'react';
import { Triangle, RotateCcw } from 'lucide-react';
import { TriangleVisualizer } from './geometry/TriangleVisualizer';

export const TriangleCalculator: React.FC = () => {
  const [sideA, setSideA] = useState<number>(5);
  const [sideB, setSideB] = useState<number>(6);
  const [sideC, setSideC] = useState<number>(7);

  const calculations = useMemo(() => {
    const a = Math.max(0.001, sideA);
    const b = Math.max(0.001, sideB);
    const c = Math.max(0.001, sideC);

    // Triangle inequality theorem check
    const isValid = (a + b > c) && (a + c > b) && (b + c > a);

    if (!isValid) {
      return {
        isValid: false,
        message: 'Ba cạnh không thỏa mãn bất đẳng thức tam giác (tổng độ dài 2 cạnh bất kỳ phải lớn hơn cạnh còn lại).'
      };
    }

    // Law of Cosines: cos(A) = (b^2 + c^2 - a^2) / (2bc)
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);
    const cosC = (a * a + b * b - c * c) / (2 * a * b);

    const angleARad = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const angleBRad = Math.acos(Math.max(-1, Math.min(1, cosB)));
    const angleCRad = Math.acos(Math.max(-1, Math.min(1, cosC)));

    const angleADeg = (angleARad * 180) / Math.PI;
    const angleBDeg = (angleBRad * 180) / Math.PI;
    const angleCDeg = (angleCRad * 180) / Math.PI;

    // Perimeter & Semi-perimeter
    const perimeter = a + b + c;
    const s = perimeter / 2;

    // Heron's Formula for Area: sqrt(s * (s - a) * (s - b) * (s - c))
    const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

    // Altitudes
    const heightA = (2 * area) / a;
    const heightB = (2 * area) / b;
    const heightC = (2 * area) / c;

    // Type of triangle
    let type = 'Tam giác thường (Scalene)';
    if (Math.abs(a - b) < 1e-4 && Math.abs(b - c) < 1e-4) {
      type = 'Tam giác đều (Equilateral)';
    } else if (Math.abs(a - b) < 1e-4 || Math.abs(b - c) < 1e-4 || Math.abs(a - c) < 1e-4) {
      type = 'Tam giác cân (Isosceles)';
    }

    if (Math.abs(angleADeg - 90) < 0.05 || Math.abs(angleBDeg - 90) < 0.05 || Math.abs(angleCDeg - 90) < 0.05) {
      type += ' & Vuông (Right-angled)';
    } else if (angleADeg > 90 || angleBDeg > 90 || angleCDeg > 90) {
      type += ' & Tù (Obtuse)';
    } else {
      type += ' & Nhọn (Acute)';
    }

    return {
      isValid: true,
      angleA: angleADeg.toFixed(2),
      angleB: angleBDeg.toFixed(2),
      angleC: angleCDeg.toFixed(2),
      perimeter: perimeter.toFixed(2),
      semiPerimeter: s.toFixed(2),
      area: area.toFixed(2),
      heightA: heightA.toFixed(2),
      heightB: heightB.toFixed(2),
      heightC: heightC.toFixed(2),
      type
    };
  }, [sideA, sideB, sideC]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Triangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Triangle Calculator – Tính Toán Hình Tam Giác</h1>
            <p className="text-xs sm:text-sm text-slate-400">Giải tam giác theo 3 cạnh (SSS): tính diện tích Heron, 3 góc, chu vi và đường cao</p>
          </div>
        </div>
        <button
          id="triangle-reset-btn"
          onClick={() => { setSideA(5); setSideB(6); setSideC(7); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Độ dài 3 cạnh tam giác</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh a</label>
            <input
              id="triangle-side-a"
              type="number"
              value={sideA}
              onChange={(e) => setSideA(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh b</label>
            <input
              id="triangle-side-b"
              type="number"
              value={sideB}
              onChange={(e) => setSideB(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cạnh c</label>
            <input
              id="triangle-side-c"
              type="number"
              value={sideC}
              onChange={(e) => setSideC(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {!calculations.isValid ? (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200">
              {calculations.message}
            </div>
          ) : (
            <>
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
                <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Diện tích tam giác (Công thức Heron)</span>
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
                  {calculations.area}
                </div>
                <p className="text-xs text-slate-400">
                  Phân loại hình học: <span className="text-white font-semibold">{calculations.type}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Góc A</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.angleA}°</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Góc B</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.angleB}°</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block">Góc C</span>
                  <span className="text-base font-bold text-white font-sans">{calculations.angleC}°</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Chu vi tam giác</span>
                  <span className="text-lg font-bold text-white font-sans">{calculations.perimeter}</span>
                </div>
                <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Nửa chu vi (p)</span>
                  <span className="text-lg font-bold text-white font-sans">{calculations.semiPerimeter}</span>
                </div>
              </div>

              <TriangleVisualizer
                sideA={sideA}
                sideB={sideB}
                sideC={sideC}
                isValid={calculations.isValid}
                angleA={calculations.angleA}
                angleB={calculations.angleB}
                angleC={calculations.angleC}
                area={calculations.area}
                type={calculations.type}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
