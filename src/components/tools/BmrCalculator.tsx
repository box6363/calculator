import React, { useState, useMemo } from 'react';
import { Flame, Activity, RotateCcw, User } from 'lucide-react';

export const BmrCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [formula, setFormula] = useState<'mifflin' | 'harris'>('mifflin');

  const calculations = useMemo(() => {
    const w = Math.max(20, weightKg);
    const h = Math.max(80, heightCm);
    const a = Math.max(10, age);

    // 1. Mifflin-St Jeor Equation
    // Men: BMR = 10W + 6.25H - 5A + 5
    // Women: BMR = 10W + 6.25H - 5A - 161
    let mifflinBmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') {
      mifflinBmr += 5;
    } else {
      mifflinBmr -= 161;
    }

    // 2. Revised Harris-Benedict Equation
    // Men: BMR = 13.397W + 4.799H - 5.677A + 88.362
    // Women: BMR = 9.247W + 3.098H - 4.330A + 447.593
    let harrisBmr = 0;
    if (gender === 'male') {
      harrisBmr = (13.397 * w) + (4.799 * h) - (5.677 * a) + 88.362;
    } else {
      harrisBmr = (9.247 * w) + (3.098 * h) - (4.330 * a) + 447.593;
    }

    const selectedBmr = formula === 'mifflin' ? mifflinBmr : harrisBmr;

    // Daily calories needed based on activity level
    const activityLevels = [
      { name: 'Ít vận động (Ngồi nhiều, không tập thể dục)', mult: 1.2, calories: selectedBmr * 1.2 },
      { name: 'Vận động nhẹ (Tập thể thao 1-3 ngày/tuần)', mult: 1.375, calories: selectedBmr * 1.375 },
      { name: 'Vận động vừa (Tập luyện 3-5 ngày/tuần)', mult: 1.55, calories: selectedBmr * 1.55 },
      { name: 'Vận động nhiều (Tập nặng 6-7 ngày/tuần)', mult: 1.725, calories: selectedBmr * 1.725 },
      { name: 'Vận động rất nhiều (Vận động viên, tập 2 buổi/ngày)', mult: 1.9, calories: selectedBmr * 1.9 },
    ];

    return {
      selectedBmr: Math.round(selectedBmr),
      mifflinBmr: Math.round(mifflinBmr),
      harrisBmr: Math.round(harrisBmr),
      activityLevels
    };
  }, [gender, age, weightKg, heightCm, formula]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-900/40 via-slate-800 to-slate-900 border border-orange-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">BMR Calculator – Tỷ Lệ Trao Đổi Chất Cơ Bản</h1>
            <p className="text-xs sm:text-sm text-slate-400">Đo lượng calo cơ thể tiêu thụ khi nghỉ ngơi hoàn toàn (Mifflin-St Jeor & Harris-Benedict)</p>
          </div>
        </div>
        <button
          id="bmr-reset-btn"
          onClick={() => { setGender('male'); setAge(25); setWeightKg(70); setHeightCm(175); setFormula('mifflin'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-orange-400" />
            Thông số cơ thể
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Giới tính</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="bmr-gender-male"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                  gender === 'male' ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Nam (Male)
              </button>
              <button
                type="button"
                id="bmr-gender-female"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                  gender === 'female' ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Nữ (Female)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tuổi</label>
              <input
                id="bmr-age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cân nặng (kg)</label>
              <input
                id="bmr-weight"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao (cm)</label>
              <input
                id="bmr-height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Công thức tính BMR</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="bmr-formula-mifflin"
                onClick={() => setFormula('mifflin')}
                className={`py-2 px-2 text-[11px] rounded-xl border text-center transition-all ${
                  formula === 'mifflin' ? 'bg-orange-600 text-white border-orange-500 font-semibold' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Mifflin-St Jeor (Chuẩn)
              </button>
              <button
                type="button"
                id="bmr-formula-harris"
                onClick={() => setFormula('harris')}
                className={`py-2 px-2 text-[11px] rounded-xl border text-center transition-all ${
                  formula === 'harris' ? 'bg-orange-600 text-white border-orange-500 font-semibold' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Harris-Benedict
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-950/40 to-slate-900 border border-orange-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-orange-300 font-semibold">Chỉ số BMR tối thiểu hàng ngày</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-orange-400 font-sans tabular-nums">
              {calculations.selectedBmr.toLocaleString()}
              <span className="text-sm font-normal text-slate-400"> Calo/ngày</span>
            </div>
            <p className="text-xs text-slate-400">
              Lượng năng lượng cơ thể cần để duy trì sự sống cơ bản (tim đập, hô hấp, tuần hoàn, não bộ)
            </p>
          </div>

          {/* Activity Calories Table (TDEE) */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              Calo cần tiêu thụ theo mức độ vận động (TDEE)
            </h3>
            <div className="space-y-2">
              {calculations.activityLevels.map((act, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-300 pr-2">{act.name}</span>
                  <span className="font-bold text-orange-400 font-sans tabular-nums shrink-0">
                    {Math.round(act.calories).toLocaleString()} Calo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
