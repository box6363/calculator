import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Divide,
  RotateCcw,
  Plus,
  Minus,
  X,
  ChevronDown
} from 'lucide-react';

export const FractionCalculator: React.FC = () => {
  const [num1, setNum1] = useState<number>(3);
  const [den1, setDen1] = useState<number>(4);
  const [num2, setNum2] = useState<number>(2);
  const [den2, setDen2] = useState<number>(5);
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [isOpMenuOpen, setIsOpMenuOpen] = useState<boolean>(false);
  const opMenuRef = useRef<HTMLDivElement>(null);

  // Close operator menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (opMenuRef.current && !opMenuRef.current.contains(event.target as Node)) {
        setIsOpMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const opList: { id: '+' | '-' | '*' | '/'; symbol: string; label: string; desc: string }[] = [
    { id: '+', symbol: '+', label: 'Cộng (+)', desc: 'Phép cộng phân số' },
    { id: '-', symbol: '−', label: 'Trừ (−)', desc: 'Phép trừ phân số' },
    { id: '*', symbol: '×', label: 'Nhân (×)', desc: 'Phép nhân phân số' },
    { id: '/', symbol: '÷', label: 'Chia (÷)', desc: 'Phép chia phân số' },
  ];

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

    if (whole > 0 && remainder > 0) {
      steps.push(`Chuyển phân số lớn hơn 1 sang dạng hỗn số: ${simpNum}/${simpDen} = ${isNegative ? '-' : ''}${whole} và ${remainder}/${simpDen}`);
    }

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

  const currentOpSymbol = useMemo(() => {
    switch (operation) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
    }
  }, [operation]);

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
      <div className="p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center w-24">
          <input
            id="fraction-num1"
            type="number"
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value))}
            className="w-full text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-lg font-sans outline-none focus:border-blue-500 shadow-xs"
          />
          <div className="w-full h-0.5 bg-slate-400 dark:bg-slate-500 my-1.5 rounded" />
          <input
            id="fraction-den1"
            type="number"
            value={den1}
            onChange={(e) => setDen1(Number(e.target.value))}
            className="w-full text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-lg font-sans outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        {/* Nút mũi tên lựa chọn gom + - * / */}
        <div className="relative" ref={opMenuRef}>
          <button
            type="button"
            id="fraction-op-dropdown-btn"
            onClick={() => setIsOpMenuOpen(!isOpMenuOpen)}
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow transition-all cursor-pointer group min-w-[76px]"
            title="Nhấp để chọn phép tính (+, −, ×, ÷)"
            aria-label="Chọn phép tính phân số"
            aria-haspopup="true"
            aria-expanded={isOpMenuOpen}
          >
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 select-none leading-none">
              {currentOpSymbol}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-200 ${
                isOpMenuOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
              }`}
            />
          </button>

          {/* Menu lựa chọn phép tính */}
          {isOpMenuOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 min-w-[145px] flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
              {opList.map((op) => {
                const isSelected = operation === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => {
                      setOperation(op.id);
                      setIsOpMenuOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-black w-4 text-center leading-none text-blue-600 dark:text-blue-400">
                        {op.symbol}
                      </span>
                      <span className="text-xs">{op.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center w-24">
          <input
            id="fraction-num2"
            type="number"
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value))}
            className="w-full text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-lg font-sans outline-none focus:border-blue-500 shadow-xs"
          />
          <div className="w-full h-0.5 bg-slate-400 dark:bg-slate-500 my-1.5 rounded" />
          <input
            id="fraction-den2"
            type="number"
            value={den2}
            onChange={(e) => setDen2(Number(e.target.value))}
            className="w-full text-center py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-lg font-sans outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <span className="text-2xl font-bold text-slate-400">=</span>

        {/* Result Fraction */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-blue-500/40 shadow-xs">
          <div className="flex flex-col items-center min-w-16">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-sans tabular-nums">{calculations.simpNum}</span>
            {calculations.simpDen !== 1 && (
              <>
                <div className="w-full h-0.5 bg-blue-500 my-1 rounded" />
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-sans tabular-nums">{calculations.simpDen}</span>
              </>
            )}
          </div>
          {calculations.whole > 0 && calculations.remainder > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 dark:border-slate-700 pl-3">
              <span className="text-xl sm:text-2xl font-bold text-slate-400 select-none">=</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Hỗn số:
                </span>
                {/* Mathematical Mixed Number: Whole + Vertical Fraction */}
                <div 
                  className="inline-flex items-center gap-1 font-sans mt-0.5" 
                  title={`Hỗn số: ${calculations.isNegative ? '-' : ''}${calculations.whole} ${calculations.remainder}/${calculations.simpDen}`}
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums leading-none">
                    {calculations.isNegative ? '−' : ''}{calculations.whole}
                  </span>
                  <div className="inline-flex flex-col items-center justify-center min-w-[16px] px-0.5">
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 leading-none pb-0.5 tabular-nums">
                      {calculations.remainder}
                    </span>
                    <div className="w-full min-w-[14px] h-[1.5px] bg-blue-500 dark:bg-blue-400 rounded-full my-0.5" />
                    <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 leading-none pt-0.5 tabular-nums">
                      {calculations.simpDen}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Steps breakdown */}
      <div className="p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Các bước giải thích chi tiết</h2>
        <div className="space-y-2">
          {calculations.steps.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-mono">
              Bước {idx + 1}: {step}
            </div>
          ))}
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 text-xs text-blue-800 dark:text-blue-200">
            Giá trị số thập phân tương đương: <span className="font-bold font-sans">{calculations.decimal.toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
