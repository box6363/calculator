import React, { useState, useMemo } from 'react';
import {
  Divide,
  RotateCcw,
  Plus,
  Minus,
  X
} from 'lucide-react';

export const FractionCalculator: React.FC = () => {
  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(4);
  const [num2, setNum2] = useState<number>(2);
  const [den2, setDen2] = useState<number>(5);
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const calculations = useMemo(() => {
    const d1 = den1 === 0 ? 1 : den1;
    const d2 = den2 === 0 ? 1 : den2;
    const n1 = num1;
    const n2 = num2;

    let resNum = 0;
    let resDen = 1;
    let steps: string[] = [];

    if (operation === '+') {
      resNum = n1 * d2 + n2 * d1;
      resDen = d1 * d2;
      steps = [
        `Quy đồng mẫu số: ${n1}/${d1} = (${n1} × ${d2}) / (${d1} × ${d2}) = ${n1 * d2}/${d1 * d2}`,
        `Quy đồng mẫu số: ${n2}/${d2} = (${n2} × ${d1}) / (${d2} × ${d1}) = ${n2 * d1}/${d1 * d2}`,
        `Cộng tử số: (${n1 * d2} + ${n2 * d1}) / ${d1 * d2} = ${resNum}/${resDen}`
      ];
    } else if (operation === '-') {
      resNum = n1 * d2 - n2 * d1;
      resDen = d1 * d2;
      steps = [
        `Quy đồng mẫu số: ${n1}/${d1} = (${n1} × ${d2}) / (${d1} × ${d2}) = ${n1 * d2}/${d1 * d2}`,
        `Quy đồng mẫu số: ${n2}/${d2} = (${n2} × ${d1}) / (${d2} × ${d1}) = ${n2 * d1}/${d1 * d2}`,
        `Trừ tử số: (${n1 * d2} - ${n2 * d1}) / ${d1 * d2} = ${resNum}/${resDen}`
      ];
    } else if (operation === '*') {
      resNum = n1 * n2;
      resDen = d1 * d2;
      steps = [
        `Nhân tử với tử: ${n1} × ${n2} = ${resNum}`,
        `Nhân mẫu với mẫu: ${d1} × ${d2} = ${resDen}`,
        `Phân số kết quả: ${resNum}/${resDen}`
      ];
    } else if (operation === '/') {
      resNum = n1 * d2;
      resDen = d1 * n2;
      steps = [
        `Đảo ngược phân số thứ hai: ${d2}/${n2}`,
        `Nhân với phân số nghịch đảo: (${n1} × ${d2}) / (${d1} × ${n2}) = ${resNum}/${resDen}`
      ];
    }

    // Simplification
    const common = gcd(resNum, resDen);
    let simpNum = resNum / (common || 1);
    let simpDen = resDen / (common || 1);

    if (simpDen < 0) {
      simpNum = -simpNum;
      simpDen = -simpDen;
    }

    // Mixed number
    const whole = Math.floor(Math.abs(simpNum) / simpDen);
    const remainder = Math.abs(simpNum) % simpDen;
    const isNegative = simpNum < 0;

    return {
      rawNum: resNum,
      rawDen: resDen,
      simpNum,
      simpDen,
      decimal: resDen !== 0 ? resNum / resDen : 0,
      whole,
      remainder,
      isNegative,
      steps
    };
  }, [num1, den1, num2, den2, operation]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Divide className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Fraction Calculator – Máy Tính Phân Số</h1>
            <p className="text-xs sm:text-sm text-slate-400">Cộng, trừ, nhân, chia phân số với các bước rút gọn tối giản và đổi sang hỗn số</p>
          </div>
        </div>
        <button
          id="fraction-reset-btn"
          onClick={() => { setNum1(3); setDen1(4); setNum2(2); setDen2(5); setOperation('+'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Main Interactive Expression Box */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center w-24">
          <input
            id="fraction-num1"
            type="number"
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
            className="w-full text-center py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-lg font-sans outline-none focus:border-blue-500"
          />
          <div className="w-full h-0.5 bg-slate-500 my-1.5 rounded" />
          <input
            id="fraction-den1"
            type="number"
            value={den1}
            onChange={(e) => setDen1(Number(e.target.value))}
            className="w-full text-center py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-lg font-sans outline-none focus:border-blue-500"
          />
        </div>

        {/* Operators */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              id="op-add"
              onClick={() => setOperation('+')}
              className={`p-2 rounded-lg transition-all ${operation === '+' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="op-sub"
              onClick={() => setOperation('-')}
              className={`p-2 rounded-lg transition-all ${operation === '-' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="op-mul"
              onClick={() => setOperation('*')}
              className={`p-2 rounded-lg transition-all ${operation === '*' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="op-div"
              onClick={() => setOperation('/')}
              className={`p-2 rounded-lg transition-all ${operation === '/' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Divide className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center w-24">
          <input
            id="fraction-num2"
            type="number"
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
            className="w-full text-center py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-lg font-sans outline-none focus:border-blue-500"
          />
          <div className="w-full h-0.5 bg-slate-500 my-1.5 rounded" />
          <input
            id="fraction-den2"
            type="number"
            value={den2}
            onChange={(e) => setDen2(Number(e.target.value))}
            className="w-full text-center py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-lg font-sans outline-none focus:border-blue-500"
          />
        </div>

        <span className="text-2xl font-bold text-slate-400">=</span>

        {/* Result Fraction */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-xl border border-blue-500/50">
          <div className="flex flex-col items-center min-w-16">
            <span className="text-2xl font-extrabold text-blue-400 font-sans tabular-nums">{calculations.simpNum}</span>
            {calculations.simpDen !== 1 && (
              <>
                <div className="w-full h-0.5 bg-blue-400 my-1 rounded" />
                <span className="text-2xl font-extrabold text-blue-400 font-sans tabular-nums">{calculations.simpDen}</span>
              </>
            )}
          </div>
          {calculations.whole > 0 && calculations.remainder > 0 && (
            <div className="text-xs text-slate-400 border-l border-slate-700 pl-3">
              <span>Hỗn số: </span>
              <span className="font-bold text-white font-sans">
                {calculations.isNegative ? '-' : ''}{calculations.whole} {calculations.remainder}/{calculations.simpDen}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Steps breakdown */}
      <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Các bước giải thích chi tiết</h2>
        <div className="space-y-2">
          {calculations.steps.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200 font-mono">
              Bước {idx + 1}: {step}
            </div>
          ))}
          <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200">
            Giá trị số thập phân tương đương: <span className="font-bold font-sans">{calculations.decimal.toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
