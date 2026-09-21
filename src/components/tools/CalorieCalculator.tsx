import React, { useState, useMemo } from 'react';
import {
  Flame,
  Scale,
  Check,
  Copy,
  Apple,
  Dumbbell
} from 'lucide-react';

export const CalorieCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Metric inputs
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);

  // Imperial inputs
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(8);
  const [weightLbs, setWeightLbs] = useState<number>(150);

  // Activity level
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Light exercise
  const formula: 'mifflin' | 'harris' = 'mifflin';
  const [copied, setCopied] = useState<boolean>(false);

  // Normalize metrics
  const { normalizedWeightKg, normalizedHeightCm } = useMemo(() => {
    if (unitSystem === 'metric') {
      return { normalizedWeightKg: weightKg, normalizedHeightCm: heightCm };
    } else {
      const kg = weightLbs * 0.45359237;
      const cm = (heightFt * 12 + heightIn) * 2.54;
      return { normalizedWeightKg: kg, normalizedHeightCm: cm };
    }
  }, [unitSystem, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  // BMR & TDEE Calculations
  const calculations = useMemo(() => {
    let bmr = 0;
    if (formula === 'mifflin') {
      // Mifflin-St Jeor: 10*W + 6.25*H - 5*A + S (S=+5 male, -161 female)
      const s = gender === 'male' ? 5 : -161;
      bmr = 10 * normalizedWeightKg + 6.25 * normalizedHeightCm - 5 * age + s;
    } else {
      // Harris-Benedict (Revised)
      if (gender === 'male') {
        bmr = 13.397 * normalizedWeightKg + 4.799 * normalizedHeightCm - 5.677 * age + 88.362;
      } else {
        bmr = 9.247 * normalizedWeightKg + 3.098 * normalizedHeightCm - 4.330 * age + 447.593;
      }
    }

    const tdee = Math.round(bmr * activityLevel);
    const maintainCalories = tdee;
    const mildLoss = Math.max(1000, tdee - 250); // -0.25 kg/wk
    const moderateLoss = Math.max(1000, tdee - 500); // -0.5 kg/wk
    const extremeLoss = Math.max(1000, tdee - 1000); // -1.0 kg/wk
    const mildGain = tdee + 250; // +0.25 kg/wk
    const fastGain = tdee + 500; // +0.5 kg/wk

    // Macronutrients for maintain (Protein 30%, Carb 45%, Fat 25%)
    const proteinGrams = Math.round((maintainCalories * 0.30) / 4);
    const carbGrams = Math.round((maintainCalories * 0.45) / 4);
    const fatGrams = Math.round((maintainCalories * 0.25) / 9);

    return {
      bmr: Math.round(bmr),
      tdee,
      maintainCalories,
      mildLoss,
      moderateLoss,
      extremeLoss,
      mildGain,
      fastGain,
      macros: {
        proteinGrams,
        carbGrams,
        fatGrams
      }
    };
  }, [gender, age, normalizedWeightKg, normalizedHeightCm, activityLevel, formula]);

  const handleCopy = () => {
    const text = `Nhu cầu Calo hàng ngày (TDEE):
- Giới tính: ${gender === 'male' ? 'Nam' : 'Nữ'}, Tuổi: ${age}
- BMR (Năng lượng trao đổi chất cơ bản): ${calculations.bmr} kcal/ngày
- TDEE (Năng lượng tiêu hao giữ cân): ${calculations.tdee} kcal/ngày
- Giảm cân nhẹ (-0.25kg/tuần): ${calculations.mildLoss} kcal/ngày
- Giảm cân chuẩn (-0.5kg/tuần): ${calculations.moderateLoss} kcal/ngày
- Tăng cân chuẩn (+0.5kg/tuần): ${calculations.fastGain} kcal/ngày
- Macro giữ cân: Protein ${calculations.macros.proteinGrams}g, Carbs ${calculations.macros.carbGrams}g, Chất béo ${calculations.macros.fatGrams}g`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="calorie-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
              <Flame className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Calorie &amp; TDEE Calculator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ước tính lượng calo cần nạp mỗi ngày, chỉ số BMR và kế hoạch thâm hụt/dư thừa calo để tăng, giảm hoặc giữ cân.
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
        <div className="lg:col-span-5 space-y-4">
          {/* Gender & Unit Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Giới tính</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Nam ♂
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-rose-500 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
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
                    unitSystem === 'metric' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    unitSystem === 'imperial' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Tuổi: {age} tuổi</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {unitSystem === 'metric' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Chiều cao (cm):</span>
                  <input
                    type="number"
                    min={100}
                    max={250}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Cân nặng (kg):</span>
                  <input
                    type="number"
                    min={30}
                    max={250}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Feet (ft):</span>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Inches (in):</span>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Cân nặng (lbs):</span>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Activity Level Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Mức độ vận động hàng ngày
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500"
            >
              <option value={1.2}>Ít vận động (làm việc văn phòng, không tập thể dục)</option>
              <option value={1.375}>Vận động nhẹ (tập luyện nhẹ 1-3 ngày/tuần)</option>
              <option value={1.55}>Vận động vừa phải (tập thể thao 3-5 ngày/tuần)</option>
              <option value={1.725}>Vận động nhiều (tập cường độ cao 6-7 ngày/tuần)</option>
              <option value={1.9}>Vận động cực nhiều (vận động viên, lao động thể lực nặng)</option>
            </select>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main TDEE Hero Banner */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-amber-600 dark:via-orange-600 dark:to-rose-700 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600 dark:text-orange-300" /> Năng lượng giữ cân (TDEE)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-white/20 text-orange-800 dark:text-white border border-orange-200 dark:border-transparent font-medium">
                BMR: {calculations.bmr} kcal
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {calculations.tdee.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-orange-100">calo / ngày</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-orange-100 leading-relaxed border-t border-slate-200 dark:border-white/20 pt-3">
              Đây là tổng lượng năng lượng cơ thể bạn tiêu hao mỗi ngày bao gồm hoạt động sống cơ bản và vận động thể chất.
            </p>
          </div>

          {/* Goal Targets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Weight Loss */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wide">
                <Scale className="w-4 h-4" /> Mục tiêu giảm cân
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600">Giảm nhẹ (-0.25kg/tuần):</span>
                  <span className="font-bold text-slate-900 font-mono">{calculations.mildLoss} kcal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-blue-900 font-semibold">Giảm vừa (-0.5kg/tuần):</span>
                  <span className="font-bold text-blue-700 font-mono">{calculations.moderateLoss} kcal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600">Giảm nhanh (-1kg/tuần):</span>
                  <span className="font-bold text-rose-600 font-mono">{calculations.extremeLoss} kcal</span>
                </div>
              </div>
            </div>

            {/* Weight Gain */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                <Dumbbell className="w-4 h-4" /> Mục tiêu tăng cân / cơ bắp
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600">Tăng nhẹ (+0.25kg/tuần):</span>
                  <span className="font-bold text-slate-900 font-mono">{calculations.mildGain} kcal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-900 font-semibold">Tăng chuẩn (+0.5kg/tuần):</span>
                  <span className="font-bold text-emerald-700 font-mono">{calculations.fastGain} kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Macronutrients Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Apple className="w-4 h-4 text-emerald-500" /> Tỷ lệ dinh dưỡng đa lượng gợi ý (Macros)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Đạm (Protein - 30%)</span>
                <span className="text-base font-bold text-indigo-600 font-mono">{calculations.macros.proteinGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Tinh bột (Carbs - 45%)</span>
                <span className="text-base font-bold text-amber-600 font-mono">{calculations.macros.carbGrams}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Chất béo (Fat - 25%)</span>
                <span className="text-base font-bold text-rose-600 font-mono">{calculations.macros.fatGrams}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
