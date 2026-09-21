import React, { useState, useMemo } from 'react';
import { Thermometer, RotateCcw, ArrowRightLeft } from 'lucide-react';

type TempUnit = 'c' | 'f' | 'k';

export const TemperatureConverter: React.FC = () => {
  const [val, setVal] = useState<number>(25);
  const [fromUnit, setFromUnit] = useState<TempUnit>('c');
  const [toUnit, setToUnit] = useState<TempUnit>('f');

  const conversions = useMemo(() => {
    // First convert to Celsius
    let celsius = 0;
    if (fromUnit === 'c') celsius = val;
    else if (fromUnit === 'f') celsius = (val - 32) * (5 / 9);
    else if (fromUnit === 'k') celsius = val - 273.15;

    // Convert from Celsius to all
    const fahrenheit = celsius * (9 / 5) + 32;
    const kelvin = celsius + 273.15;

    let target = 0;
    if (toUnit === 'c') target = celsius;
    else if (toUnit === 'f') target = fahrenheit;
    else if (toUnit === 'k') target = kelvin;

    return {
      target: Number(target.toFixed(2)),
      c: Number(celsius.toFixed(2)),
      f: Number(fahrenheit.toFixed(2)),
      k: Number(kelvin.toFixed(2))
    };
  }, [val, fromUnit, toUnit]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Temperature Converter – Chuyển Đổi Nhiệt Độ</h1>
            <p className="text-xs sm:text-sm text-slate-400">Chuyển đổi tức thời giữa Độ C (°Celsius), Độ F (°Fahrenheit) và Kelvin (K)</p>
          </div>
        </div>
        <button
          id="temp-reset-btn"
          onClick={() => { setVal(25); setFromUnit('c'); setToUnit('f'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Nhiệt độ nguồn</label>
            <input
              id="temp-val-input"
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex gap-2">
              {[
                { id: 'c', label: '°C (Celsius)' },
                { id: 'f', label: '°F (Fahrenheit)' },
                { id: 'k', label: 'K (Kelvin)' },
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => setFromUnit(u.id as TempUnit)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-medium ${
                    fromUnit === u.id ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-1 flex justify-center">
            <button
              id="temp-swap-btn"
              onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 transition-colors cursor-pointer"
              title="Đảo chiều"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Kết quả quy đổi</label>
            <div className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-blue-400 font-bold font-sans text-xl tabular-nums">
              {conversions.target} {toUnit === 'c' ? '°C' : toUnit === 'f' ? '°F' : 'K'}
            </div>
            <div className="flex gap-2">
              {[
                { id: 'c', label: '°C (Celsius)' },
                { id: 'f', label: '°F (Fahrenheit)' },
                { id: 'k', label: 'K (Kelvin)' },
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => setToUnit(u.id as TempUnit)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-medium ${
                    toUnit === u.id ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Celsius</span>
            <span className="text-base font-bold text-white font-sans">{conversions.c} °C</span>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Fahrenheit</span>
            <span className="text-base font-bold text-white font-sans">{conversions.f} °F</span>
          </div>
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Kelvin</span>
            <span className="text-base font-bold text-white font-sans">{conversions.k} K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
