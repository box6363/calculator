import React, { useState, useMemo } from 'react';
import { Weight, RotateCcw, ArrowRightLeft } from 'lucide-react';

const WEIGHT_UNITS: Record<string, { name: string; factor: number }> = {
  kg: { name: 'Kilôgam (kg)', factor: 1 },
  g: { name: 'Gam (g)', factor: 0.001 },
  mg: { name: 'Miligam (mg)', factor: 0.000001 },
  t: { name: 'Tấn (Metric Ton)', factor: 1000 },
  lb: { name: 'Pound (lb)', factor: 0.45359237 },
  oz: { name: 'Ounce (oz)', factor: 0.028349523125 },
  st: { name: 'Stone (st)', factor: 6.35029 },
  ct: { name: 'Carat (ct)', factor: 0.0002 }
};

export const WeightConverter: React.FC = () => {
  const [value, setValue] = useState<number>(75);
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');

  const result = useMemo(() => {
    const fromFactor = WEIGHT_UNITS[fromUnit]?.factor || 1;
    const toFactor = WEIGHT_UNITS[toUnit]?.factor || 1;
    const inKg = value * fromFactor;
    return inKg / toFactor;
  }, [value, fromUnit, toUnit]);

  const allConversions = useMemo(() => {
    const fromFactor = WEIGHT_UNITS[fromUnit]?.factor || 1;
    const inKg = value * fromFactor;
    return Object.entries(WEIGHT_UNITS).map(([key, item]) => ({
      key,
      name: item.name,
      val: inKg / item.factor
    }));
  }, [value, fromUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Weight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Weight Converter – Chuyển Đổi Đơn Vị Khối Lượng</h1>
            <p className="text-xs sm:text-sm text-slate-400">Chuyển đổi tức thì giữa kg, gram, pound (lb), ounce (oz), tấn và carat</p>
          </div>
        </div>
        <button
          id="weight-reset-btn"
          onClick={() => { setValue(75); setFromUnit('kg'); setToUnit('lb'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Giá trị ban đầu</label>
            <input
              id="weight-val-input"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              id="weight-from-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(WEIGHT_UNITS).map(([k, u]) => (
                <option key={k} value={k}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center">
            <button
              id="weight-swap-btn"
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 transition-colors cursor-pointer"
              title="Đảo chiều"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Đơn vị đích</label>
            <div className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-blue-400 font-bold font-sans tabular-nums truncate">
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              id="weight-to-select"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(WEIGHT_UNITS).map(([k, u]) => (
                <option key={k} value={k}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* All units grid */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Quy đổi đồng thời sang các đơn vị khác
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allConversions.map((conv) => (
              <div key={conv.key} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between text-xs">
                <span className="text-slate-400">{conv.name}</span>
                <span className="font-semibold text-white font-sans tabular-nums">
                  {conv.val.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
