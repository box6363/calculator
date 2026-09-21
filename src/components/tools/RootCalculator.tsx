import React, { useState, useMemo } from 'react';
import { Radical, RotateCcw } from 'lucide-react';

export const RootCalculator: React.FC = () => {
  const [radicand, setRadicand] = useState<number>(64);
  const [degree, setDegree] = useState<number>(2);

  const calculations = useMemo(() => {
    const x = radicand;
    const n = degree === 0 ? 1 : degree;

    if (x < 0 && n % 2 === 0) {
      return {
        isValid: false,
        message: 'Căn bậc chẵn của một số âm không phải là số thực (kết quả thuộc tập số phức).'
      };
    }

    let result = 0;
    if (x < 0) {
      result = -Math.pow(Math.abs(x), 1 / n);
    } else {
      result = Math.pow(x, 1 / n);
    }

    return {
      isValid: true,
      result: Number(result.toFixed(8)),
      exponentialForm: `${x}^(1/${n})`
    };
  }, [radicand, degree]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Radical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Root Calculator – Máy Tính Căn Bậc Hai & Bậc N</h1>
            <p className="text-xs sm:text-sm text-slate-400">Khai căn chính xác cho mọi bậc n (căn bậc 2, căn bậc 3, căn bậc n)</p>
          </div>
        </div>
        <button
          id="root-reset-btn"
          onClick={() => { setRadicand(64); setDegree(2); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Thông số căn thức</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bậc của căn (n)</label>
            <input
              id="root-degree"
              type="number"
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Số dưới dấu căn (x)</label>
            <input
              id="root-radicand"
              type="number"
              value={radicand}
              onChange={(e) => setRadicand(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {[2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                id={`preset-root-${d}`}
                onClick={() => setDegree(d)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  degree === d ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Bậc {d}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {!calculations.isValid ? (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-sm">
              {calculations.message}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-3">
              <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                ^{degree}√({radicand})
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
                {calculations.result}
              </div>
              <p className="text-xs text-slate-400">
                Dưới dạng lũy thừa số mũ hữu tỉ: <span className="text-white font-mono">{calculations.exponentialForm}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
