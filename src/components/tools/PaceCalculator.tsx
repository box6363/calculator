import React, { useState, useMemo } from 'react';
import {
  Footprints,
  Trophy,
  Check,
  Copy
} from 'lucide-react';

export const PaceCalculator: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'pace' | 'time' | 'distance'>('pace');

  // Time: Hours, Minutes, Seconds
  const [timeH, setTimeH] = useState<number>(0);
  const [timeM, setTimeM] = useState<number>(45);
  const [timeS, setTimeS] = useState<number>(0);

  // Distance
  const [distance, setDistance] = useState<number>(10); // 10 km
  const [distUnit, setDistUnit] = useState<'km' | 'mile'>('km');

  // Target Pace: Minutes & Seconds per unit
  const [paceM, setPaceM] = useState<number>(5);
  const [paceS, setPaceS] = useState<number>(30);

  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const result = useMemo(() => {
    const totalTimeSeconds = timeH * 3600 + timeM * 60 + timeS;
    const targetPaceSeconds = paceM * 60 + paceS;

    let computedDistanceKm = 0;
    let computedTimeSeconds = 0;
    let computedPaceSecPerKm = 0;

    if (calcMode === 'pace') {
      computedDistanceKm = distUnit === 'km' ? distance : distance * 1.609344;
      computedTimeSeconds = totalTimeSeconds;
      if (computedDistanceKm > 0) {
        computedPaceSecPerKm = totalTimeSeconds / computedDistanceKm;
      }
    } else if (calcMode === 'time') {
      computedDistanceKm = distUnit === 'km' ? distance : distance * 1.609344;
      const pacePerKm = distUnit === 'km' ? targetPaceSeconds : targetPaceSeconds / 1.609344;
      computedPaceSecPerKm = pacePerKm;
      computedTimeSeconds = computedDistanceKm * pacePerKm;
    } else {
      // mode: distance
      computedTimeSeconds = totalTimeSeconds;
      const pacePerKm = distUnit === 'km' ? targetPaceSeconds : targetPaceSeconds / 1.609344;
      computedPaceSecPerKm = pacePerKm;
      if (pacePerKm > 0) {
        computedDistanceKm = totalTimeSeconds / pacePerKm;
      }
    }

    // Format pace min:sec per km
    const paceKmMin = Math.floor(computedPaceSecPerKm / 60);
    const paceKmSec = Math.round(computedPaceSecPerKm % 60);
    const paceKmStr = `${paceKmMin}:${String(paceKmSec).padStart(2, '0')} /km`;

    // Format pace per mile
    const paceSecPerMile = computedPaceSecPerKm * 1.609344;
    const paceMileMin = Math.floor(paceSecPerMile / 60);
    const paceMileSec = Math.round(paceSecPerMile % 60);
    const paceMileStr = `${paceMileMin}:${String(paceMileSec).padStart(2, '0')} /mi`;

    // Speed km/h
    const speedKmh = computedPaceSecPerKm > 0 ? Number((3600 / computedPaceSecPerKm).toFixed(2)) : 0;
    const speedMph = Number((speedKmh / 1.609344).toFixed(2));

    // Formatted time
    const resH = Math.floor(computedTimeSeconds / 3600);
    const resM = Math.floor((computedTimeSeconds % 3600) / 60);
    const resS = Math.round(computedTimeSeconds % 60);
    const formattedTime = `${String(resH).padStart(2, '0')}:${String(resM).padStart(2, '0')}:${String(resS).padStart(2, '0')}`;

    // Race finish times at this pace
    const racePredictions = [
      { name: '5K', km: 5 },
      { name: '10K', km: 10 },
      { name: 'Half Marathon', km: 21.0975 },
      { name: 'Marathon', km: 42.195 },
    ].map(race => {
      const sec = race.km * computedPaceSecPerKm;
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.round(sec % 60);
      return {
        name: race.name,
        timeStr: `${h > 0 ? `${h}h ` : ''}${m}m ${String(s).padStart(2, '0')}s`
      };
    });

    return {
      paceKmStr,
      paceMileStr,
      speedKmh,
      speedMph,
      formattedTime,
      computedDistanceKm: Number(computedDistanceKm.toFixed(2)),
      racePredictions
    };
  }, [calcMode, timeH, timeM, timeS, distance, distUnit, paceM, paceS]);

  const handleCopy = () => {
    const text = `Kết quả tính tốc độ Pace chạy bộ:
- Cự ly: ${distance} ${distUnit}
- Tốc độ Pace: ${result.paceKmStr} (${result.paceMileStr})
- Vận tốc: ${result.speedKmh} km/h (${result.speedMph} mph)
- Dự đoán thành tích các cự ly:
  + 5K: ${result.racePredictions[0].timeStr}
  + 10K: ${result.racePredictions[1].timeStr}
  + Half Marathon (21km): ${result.racePredictions[2].timeStr}
  + Full Marathon (42km): ${result.racePredictions[3].timeStr}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="pace-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Footprints className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pace Calculator (Tốc Độ Chạy Bộ)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính tốc độ Pace (phút/km), vận tốc km/h và ước tính thời gian hoàn thành cự ly 5K, 10K, 21K, 42K.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setCalcMode('pace')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'pace' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Tính Tốc độ (Pace)
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('time')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'time' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Tính Thời gian (Time)
        </button>
        <button
          type="button"
          onClick={() => setCalcMode('distance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'distance' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Tính Quãng đường (Distance)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Time Inputs (if mode is pace or distance) */}
          {calcMode !== 'time' && (
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Tổng thời gian (Time)
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Giờ:</span>
                  <input
                    type="number"
                    min={0}
                    value={timeH}
                    onChange={(e) => setTimeH(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Phút:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={timeM}
                    onChange={(e) => setTimeM(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Giây:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={timeS}
                    onChange={(e) => setTimeS(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Distance Input (if mode is pace or time) */}
          {calcMode !== 'distance' && (
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cự ly quãng đường
                </label>
                <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDistUnit('km')}
                    className={`px-2 py-0.5 rounded font-bold ${distUnit === 'km' ? 'bg-cyan-600 text-white' : 'text-slate-600'}`}
                  >
                    Kilometers
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistUnit('mile')}
                    className={`px-2 py-0.5 rounded font-bold ${distUnit === 'mile' ? 'bg-cyan-600 text-white' : 'text-slate-600'}`}
                  >
                    Miles
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0.1, Number(e.target.value)))}
                  className="w-full pl-4 pr-14 py-2.5 bg-white border border-slate-300 rounded-2xl text-lg font-black text-slate-900"
                />
                <span className="absolute right-4 top-3 text-slate-400 font-bold text-xs uppercase">{distUnit}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '5K', val: 5 },
                  { label: '10K', val: 10 },
                  { label: '21.1K (Half)', val: 21.0975 },
                  { label: '42.2K (Full)', val: 42.195 },
                ].map(r => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => {
                      setDistance(r.val);
                      setDistUnit('km');
                    }}
                    className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Pace Input (if mode is time or distance) */}
          {calcMode !== 'pace' && (
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Tốc độ mục tiêu (Pace / {distUnit})
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Số phút:</span>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={paceM}
                    onChange={(e) => setPaceM(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Số giây:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={paceS}
                    onChange={(e) => setPaceS(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Pace */}
          <div className="bg-gradient-to-br from-cyan-900 via-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {calcMode === 'pace' ? 'Tốc độ Pace trung bình' : 'Thời gian hoàn thành dự kiến'}
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
                {calcMode === 'pace' ? result.paceKmStr : result.formattedTime}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                <span className="text-slate-400 block mb-0.5">Tốc độ theo dặm (Miles)</span>
                <span className="text-base font-bold text-cyan-300 font-mono">
                  {result.paceMileStr}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                <span className="text-slate-400 block mb-0.5">Vận tốc di chuyển</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {result.speedKmh} km/h
                </span>
              </div>
            </div>
          </div>

          {/* Race Predictions */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Dự đoán thành tích các giải chạy phổ biến
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {result.racePredictions.map(r => (
                <div key={r.name} className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{r.name}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{r.timeStr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
