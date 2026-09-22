import React, { useState, useMemo } from 'react';
import { Variable, RotateCcw } from 'lucide-react';
import { InteractiveGraphPlotter, KeyPoint } from './geometry/InteractiveGraphPlotter';
import { formatExactMath } from '../../utils/mathParser';

export const QuadraticCalculator: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  const calculations = useMemo(() => {
    if (a === 0) {
      // Linear equation bx + c = 0
      if (b === 0) {
        return {
          type: 'invalid',
          message: c === 0 ? 'Phương trình vô số nghiệm (0 = 0).' : 'Phương trình vô nghiệm.'
        };
      }
      const x = -c / b;
      const xExact = formatExactMath(x);
      return {
        type: 'linear',
        x1: xExact.exact || xExact.formatted,
        rawX1: x,
        message: `Đây là phương trình bậc nhất bx + c = 0 có nghiệm duy nhất x = ${xExact.exact || xExact.formatted}.`
      };
    }

    // Discriminant Delta = b^2 - 4ac
    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    const vxExact = formatExactMath(vertexX);
    const vyExact = formatExactMath(vertexY);

    if (delta > 0) {
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-b + sqrtDelta) / (2 * a);
      const x2 = (-b - sqrtDelta) / (2 * a);
      const x1Exact = formatExactMath(x1);
      const x2Exact = formatExactMath(x2);
      return {
        type: 'two_real',
        delta,
        x1: x1Exact.exact || x1Exact.formatted,
        x2: x2Exact.exact || x2Exact.formatted,
        rawX1: x1,
        rawX2: x2,
        vertexX: vxExact.exact || vxExact.formatted,
        vertexY: vyExact.exact || vyExact.formatted,
        rawVx: vertexX,
        rawVy: vertexY,
        message: `Biệt thức Δ = ${delta.toFixed(2)} > 0: Phương trình có 2 nghiệm thực phân biệt.`
      };
    } else if (delta === 0) {
      const x = -b / (2 * a);
      const xExact = formatExactMath(x);
      return {
        type: 'double_real',
        delta: 0,
        x1: xExact.exact || xExact.formatted,
        x2: xExact.exact || xExact.formatted,
        rawX1: x,
        rawX2: x,
        vertexX: vxExact.exact || vxExact.formatted,
        vertexY: vyExact.exact || vyExact.formatted,
        rawVx: vertexX,
        rawVy: vertexY,
        message: 'Biệt thức Δ = 0: Phương trình có nghiệm kép.'
      };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-delta) / (2 * a);
      const rpExact = formatExactMath(realPart);
      const ipExact = formatExactMath(Math.abs(imagPart));
      const rpStr = rpExact.exact || rpExact.formatted;
      const ipStr = ipExact.exact || ipExact.formatted;
      return {
        type: 'complex',
        delta,
        x1: `${rpStr} + ${ipStr}i`,
        x2: `${rpStr} - ${ipStr}i`,
        vertexX: vxExact.exact || vxExact.formatted,
        vertexY: vyExact.exact || vyExact.formatted,
        rawVx: vertexX,
        rawVy: vertexY,
        message: `Biệt thức Δ = ${delta.toFixed(2)} < 0: Phương trình không có nghiệm thực (2 nghiệm phức liên hợp).`
      };
    }
  }, [a, b, c]);

  const keyPoints = useMemo<KeyPoint[]>(() => {
    const pts: KeyPoint[] = [];
    if (calculations.rawVx !== undefined && calculations.rawVy !== undefined) {
      pts.push({
        x: calculations.rawVx,
        y: calculations.rawVy,
        label: `Đỉnh I(${calculations.vertexX}; ${calculations.vertexY})`,
        type: 'vertex',
        color: a > 0 ? '#fbbf24' : '#34d399'
      });
    }
    if (calculations.type === 'two_real' && calculations.rawX1 !== undefined && calculations.rawX2 !== undefined) {
      pts.push({
        x: calculations.rawX1,
        y: 0,
        label: `x₁ = ${calculations.x1}`,
        type: 'root',
        color: '#38bdf8'
      });
      pts.push({
        x: calculations.rawX2,
        y: 0,
        label: `x₂ = ${calculations.x2}`,
        type: 'root',
        color: '#38bdf8'
      });
    } else if (calculations.type === 'double_real' && calculations.rawX1 !== undefined) {
      pts.push({
        x: calculations.rawX1,
        y: 0,
        label: `Nghiệm kép x = ${calculations.x1}`,
        type: 'root',
        color: '#38bdf8'
      });
    }
    // y-intercept (0, c): only if non-zero
    if (Math.abs(c) > 1e-4) {
      const cExact = formatExactMath(c);
      pts.push({
        x: 0,
        y: c,
        label: `Oy (0; ${cExact.exact || cExact.formatted})`,
        type: 'y-intercept',
        color: '#c084fc'
      });
    }
    return pts;
  }, [calculations, a, c]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Variable className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Quadratic Formula Calculator – Giải Phương Trình Bậc Hai</h1>
            <p className="text-xs sm:text-sm text-slate-400">Giải ax² + bx + c = 0, tính biệt thức Delta (Δ), nghiệm thực/phức và tọa độ đỉnh parabol</p>
          </div>
        </div>
        <button
          id="quad-reset-btn"
          onClick={() => { setA(1); setB(-5); setC(6); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Hệ số ax² + bx + c = 0</h2>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số a</label>
              <input
                id="quad-a"
                type="number"
                value={a}
                onChange={(e) => setA(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số b</label>
              <input
                id="quad-b"
                type="number"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số c</label>
              <input
                id="quad-c"
                type="number"
                value={c}
                onChange={(e) => setC(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-blue-400">Phương trình đang xét:</div>
            <div className="font-mono text-white text-sm">
              {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 space-y-3">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold block text-center">
              Nghiệm của phương trình
            </span>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Nghiệm x₁</span>
                <span className="text-2xl font-extrabold text-blue-400 font-sans tabular-nums">{calculations.x1}</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Nghiệm x₂</span>
                <span className="text-2xl font-extrabold text-blue-400 font-sans tabular-nums">{calculations.x2 || calculations.x1}</span>
              </div>
            </div>
            <p className="text-xs text-center text-slate-300">{calculations.message}</p>
          </div>

          {calculations.vertexX !== undefined && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Tọa độ Đỉnh Parabol:</span>
              <span className="font-mono font-bold text-white text-sm">
                I({calculations.vertexX}; {calculations.vertexY})
              </span>
            </div>
          )}

          <InteractiveGraphPlotter
            expression={`${a}*x^2 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}*x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`}
            title={`Đồ thị Parabol y = ${a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`}
            keyPoints={keyPoints}
          />
        </div>
      </div>
    </div>
  );
};
