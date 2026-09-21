import React, { useState, useMemo } from 'react';
import { Dices, RotateCcw, Ticket } from 'lucide-react';
import { USLotteryCalculator } from './lottery/USLotteryCalculator';

export const ProbabilityCalculator: React.FC = () => {
  // Tab switcher: 'lottery' (US Lottery & System Bet) vs 'combinatorics' (Classical nPr, nCr, Independence)
  const [activeTab, setActiveTab] = useState<'lottery' | 'combinatorics'>('lottery');

  const [n, setN] = useState<number>(10);
  const [r, setR] = useState<number>(3);
  const [probA, setProbA] = useState<number>(0.5);
  const [probB, setProbB] = useState<number>(0.3);

  const calculations = useMemo(() => {
    const validN = Math.max(0, Math.floor(n));
    const validR = Math.max(0, Math.min(validN, Math.floor(r)));

    // Permutations nPr = n! / (n - r)!
    let nPr = 1;
    for (let i = 0; i < validR; i++) {
      nPr *= (validN - i);
    }

    // Combinations nCr = nPr / r!
    let rFact = 1;
    for (let i = 1; i <= validR; i++) {
      rFact *= i;
    }
    const nCr = nPr / rFact;

    // Two independent events A & B
    const pA = Math.max(0, Math.min(1, probA));
    const pB = Math.max(0, Math.min(1, probB));

    // P(A and B) = P(A) * P(B)
    const pAnd = pA * pB;
    // P(A or B) = P(A) + P(B) - P(A and B)
    const pOr = pA + pB - pAnd;
    // P(not A)
    const pNotA = 1 - pA;

    return {
      nPr: Math.round(nPr),
      nCr: Math.round(nCr),
      pAnd: Number(pAnd.toFixed(4)),
      pOr: Number(pOr.toFixed(4)),
      pNotA: Number(pNotA.toFixed(4))
    };
  }, [n, r, probA, probB]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Primary Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            id="tab-lottery-btn"
            onClick={() => setActiveTab('lottery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              activeTab === 'lottery'
                ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 text-white border-amber-400/50 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>Xác Suất Xổ Số Mỹ & Đánh Bao Số</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 font-sans uppercase tracking-wider font-extrabold">
              Mới
            </span>
          </button>

          <button
            id="tab-combinatorics-btn"
            onClick={() => setActiveTab('combinatorics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'combinatorics'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
            }`}
          >
            <Dices className="w-4 h-4 text-blue-400" />
            <span>Tổ Hợp (nCr, nPr) & Biến Cố</span>
          </button>
        </div>

        {activeTab === 'combinatorics' && (
          <button
            id="prob-reset-btn"
            onClick={() => { setN(10); setR(3); setProbA(0.5); setProbB(0.3); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* TAB 1: US Lottery & System Bet Calculator */}
      {activeTab === 'lottery' && (
        <USLotteryCalculator />
      )}

      {/* TAB 2: Classical Combinatorics & Independence */}
      {activeTab === 'combinatorics' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Dices className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Probability Calculator – Máy Tính Xác Suất & Tổ Hợp</h1>
                <p className="text-xs sm:text-sm text-slate-400">Tính chỉnh hợp nPr, tổ hợp nCr, xác suất biến cố giao và biến cố hợp độc lập</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module 1: Combinatorics */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-base font-semibold text-white">Chỉnh hợp (nPr) & Tổ hợp (nCr)</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tổng số phần tử (n)</label>
                  <input
                    id="prob-n"
                    type="number"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Số phần tử chọn (r)</label>
                  <input
                    id="prob-r"
                    type="number"
                    value={r}
                    onChange={(e) => setR(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Chỉnh hợp nPr (có thứ tự)</span>
                  <span className="text-2xl font-bold text-blue-400 font-sans tabular-nums">{calculations.nPr.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Tổ hợp nCr (không thứ tự)</span>
                  <span className="text-2xl font-bold text-emerald-400 font-sans tabular-nums">{calculations.nCr.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Module 2: Probability of Events */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-base font-semibold text-white">Xác suất 2 biến cố độc lập</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Xác suất P(A) (0 đến 1)</label>
                  <input
                    id="prob-pa"
                    type="number"
                    step="0.05"
                    value={probA}
                    onChange={(e) => setProbA(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Xác suất P(B) (0 đến 1)</label>
                  <input
                    id="prob-pb"
                    type="number"
                    step="0.05"
                    value={probB}
                    onChange={(e) => setProbB(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 block">P(A ∩ B) Cả 2 cùng xảy ra</span>
                  <span className="text-lg font-bold text-white font-sans">{calculations.pAnd}</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 block">P(A ∪ B) Ít nhất 1 biến cố</span>
                  <span className="text-lg font-bold text-white font-sans">{calculations.pOr}</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 block">P(A') Biến cố đối</span>
                  <span className="text-lg font-bold text-white font-sans">{calculations.pNotA}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

