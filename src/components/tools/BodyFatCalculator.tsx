import React, { useState, useMemo } from 'react';
import {
  Activity,
  Check,
  Copy
} from 'lucide-react';

export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const age = 28;
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric inputs (cm & kg)
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [hipCm, setHipCm] = useState<number>(96); // only for female

  // Imperial inputs
  const [heightIn, setHeightIn] = useState<number>(69);
  const [weightLbs, setWeightLbs] = useState<number>(158);
  const [neckIn, setNeckIn] = useState<number>(15);
  const [waistIn, setWaistIn] = useState<number>(33);
  const [hipIn, setHipIn] = useState<number>(38);

  const [copied, setCopied] = useState<boolean>(false);

  // Normalization to cm and kg for calculation
  const { hCm, wKg, nCm, wsCm, hpCm } = useMemo(() => {
    if (unitSystem === 'metric') {
      return {
        hCm: heightCm,
        wKg: weightKg,
        nCm: neckCm,
        wsCm: waistCm,
        hpCm: hipCm
      };
    } else {
      return {
        hCm: heightIn * 2.54,
        wKg: weightLbs * 0.45359237,
        nCm: neckIn * 2.54,
        wsCm: waistIn * 2.54,
        hpCm: hipIn * 2.54
      };
    }
  }, [unitSystem, heightCm, weightKg, neckCm, waistCm, hipCm, heightIn, weightLbs, neckIn, waistIn, hipIn]);

  // US Navy Formula Calculation
  const result = useMemo(() => {
    let bodyFatPercent = 0;

    if (gender === 'male') {
      const diff = wsCm - nCm;
      if (diff > 0 && hCm > 0) {
        bodyFatPercent = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(hCm)) - 450;
      }
    } else {
      const sum = wsCm + hpCm - nCm;
      if (sum > 0 && hCm > 0) {
        bodyFatPercent = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(hCm)) - 450;
      }
    }

    bodyFatPercent = Math.max(3, Math.min(60, Number(bodyFatPercent.toFixed(1))));

    const fatMassKg = Number(((wKg * bodyFatPercent) / 100).toFixed(1));
    const leanMassKg = Number((wKg - fatMassKg).toFixed(1));

    // Category according to ACE (American Council on Exercise)
    let category = '';
    let categoryColor = '';
    if (gender === 'male') {
      if (bodyFatPercent < 6) {
        category = 'Mỡ thiết yếu (Cực thấp)';
        categoryColor = 'text-amber-600 bg-amber-50 border-amber-200';
      } else if (bodyFatPercent <= 13) {
        category = 'Vận động viên (Athletes)';
        categoryColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      } else if (bodyFatPercent <= 17) {
        category = 'Thể hình cân đối (Fitness)';
        categoryColor = 'text-blue-600 bg-blue-50 border-blue-200';
      } else if (bodyFatPercent <= 24) {
        category = 'Trung bình chấp nhận được (Average)';
        categoryColor = 'text-slate-700 bg-slate-100 border-slate-200';
      } else {
        category = 'Thừa mỡ / Nguy cơ béo phì (Obese)';
        categoryColor = 'text-rose-600 bg-rose-50 border-rose-200';
      }
    } else {
      if (bodyFatPercent < 14) {
        category = 'Mỡ thiết yếu (Cực thấp)';
        categoryColor = 'text-amber-600 bg-amber-50 border-amber-200';
      } else if (bodyFatPercent <= 20) {
        category = 'Vận động viên (Athletes)';
        categoryColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      } else if (bodyFatPercent <= 24) {
        category = 'Thể hình cân đối (Fitness)';
        categoryColor = 'text-blue-600 bg-blue-50 border-blue-200';
      } else if (bodyFatPercent <= 31) {
        category = 'Trung bình chấp nhận được (Average)';
        categoryColor = 'text-slate-700 bg-slate-100 border-slate-200';
      } else {
        category = 'Thừa mỡ / Nguy cơ béo phì (Obese)';
        categoryColor = 'text-rose-600 bg-rose-50 border-rose-200';
      }
    }

    return {
      bodyFatPercent,
      fatMassKg,
      leanMassKg,
      category,
      categoryColor
    };
  }, [gender, hCm, wKg, nCm, wsCm, hpCm]);

  const handleCopy = () => {
    const text = `Kết quả đo tỷ lệ mỡ cơ thể (US Navy Method):
- Giới tính: ${gender === 'male' ? 'Nam' : 'Nữ'} (${age} tuổi)
- Tỷ lệ mỡ (Body Fat): ${result.bodyFatPercent}%
- Phân loại: ${result.category}
- Khối lượng mỡ: ${result.fatMassKg} kg
- Khối lượng nạc (cơ bắp, xương, nước): ${result.leanMassKg} kg`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="body-fat-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Body Fat Calculator (Tỷ Lệ Mỡ Cơ Thể)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đo lường tỷ lệ mỡ cơ thể theo chuẩn Hải quân Hoa Kỳ (U.S. Navy Method) dựa trên chu vi các vòng cơ thể.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* Controls: Gender & Units */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Giới tính</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Nam ♂
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Nữ ♀
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Hệ đơn vị</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    unitSystem === 'metric' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Metric (cm/kg)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    unitSystem === 'imperial' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Imperial (in/lbs)
                </button>
              </div>
            </div>
          </div>

          {/* Core Body Dimensions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Thông số chiều cao &amp; cân nặng
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-600 block mb-1">Chiều cao ({unitSystem === 'metric' ? 'cm' : 'inches'}):</span>
                <input
                  type="number"
                  value={unitSystem === 'metric' ? heightCm : heightIn}
                  onChange={(e) => unitSystem === 'metric' ? setHeightCm(Number(e.target.value)) : setHeightIn(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Cân nặng ({unitSystem === 'metric' ? 'kg' : 'lbs'}):</span>
                <input
                  type="number"
                  value={unitSystem === 'metric' ? weightKg : weightLbs}
                  onChange={(e) => unitSystem === 'metric' ? setWeightKg(Number(e.target.value)) : setWeightLbs(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Circumference Measurements */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Số đo chu vi vòng (thước dây sát da)
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-semibold">1. Vòng cổ (đo ngay dưới yết hầu):</span>
                  <span className="font-bold text-slate-900">{unitSystem === 'metric' ? `${neckCm} cm` : `${neckIn} in`}</span>
                </div>
                <input
                  type="number"
                  step={0.5}
                  value={unitSystem === 'metric' ? neckCm : neckIn}
                  onChange={(e) => unitSystem === 'metric' ? setNeckCm(Number(e.target.value)) : setNeckIn(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 font-semibold">2. Vòng eo (đo ngang rốn khi thở ra bình thường):</span>
                  <span className="font-bold text-slate-900">{unitSystem === 'metric' ? `${waistCm} cm` : `${waistIn} in`}</span>
                </div>
                <input
                  type="number"
                  step={0.5}
                  value={unitSystem === 'metric' ? waistCm : waistIn}
                  onChange={(e) => unitSystem === 'metric' ? setWaistCm(Number(e.target.value)) : setWaistIn(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              {gender === 'female' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-700 font-semibold">3. Vòng hông (đo tại điểm rộng nhất của mông):</span>
                    <span className="font-bold text-slate-900">{unitSystem === 'metric' ? `${hipCm} cm` : `${hipIn} in`}</span>
                  </div>
                  <input
                    type="number"
                    step={0.5}
                    value={unitSystem === 'metric' ? hipCm : hipIn}
                    onChange={(e) => unitSystem === 'metric' ? setHipCm(Number(e.target.value)) : setHipIn(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Card */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-teal-900 dark:via-slate-900 dark:to-emerald-950 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Tỷ Lệ Mỡ Cơ Thể (Body Fat)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-semibold">
                U.S. Navy Standard
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {result.bodyFatPercent}%
              </span>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-bold ${result.categoryColor}`}>
              Đánh giá: {result.category}
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Rất thấp</span>
                <span>Vận động viên</span>
                <span>Cân đối</span>
                <span>Thừa mỡ</span>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-1/5 bg-amber-400" title="Essential fat" />
                <div className="w-1/4 bg-emerald-500" title="Athletes" />
                <div className="w-1/4 bg-blue-500" title="Fitness" />
                <div className="w-1/4 bg-orange-400" title="Average" />
                <div className="flex-1 bg-rose-500" title="Obese" />
              </div>
            </div>
          </div>

          {/* Mass Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Khối lượng mỡ (Fat Mass)</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
                {result.fatMassKg} kg
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Lượng mỡ dưới da &amp; mỡ nội tạng
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">Khối lượng nạc (Lean Mass)</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">
                {result.leanMassKg} kg
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Cơ bắp, xương, nước &amp; nội tạng
              </p>
            </div>
          </div>

          {/* Reference Table */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Bảng chuẩn ACE cho {gender === 'male' ? 'Nam giới' : 'Nữ giới'}:
            </span>
            <div className="divide-y divide-slate-200 text-slate-600">
              <div className="py-1.5 flex justify-between">
                <span>Mỡ thiết yếu:</span>
                <span className="font-bold font-mono text-slate-800">{gender === 'male' ? '2 - 5%' : '10 - 13%'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Vận động viên:</span>
                <span className="font-bold font-mono text-emerald-600">{gender === 'male' ? '6 - 13%' : '14 - 20%'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Người tập thể hình (Fitness):</span>
                <span className="font-bold font-mono text-blue-600">{gender === 'male' ? '14 - 17%' : '21 - 24%'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Mức trung bình:</span>
                <span className="font-bold font-mono text-slate-800">{gender === 'male' ? '18 - 24%' : '25 - 31%'}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Nguy cơ béo phì:</span>
                <span className="font-bold font-mono text-rose-600">{gender === 'male' ? '25%+' : '32%+'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
