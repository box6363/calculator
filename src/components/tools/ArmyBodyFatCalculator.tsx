import React, { useState, useMemo } from 'react';
import {
  Shield,
  RotateCcw,
  User,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const ArmyBodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(24);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [hipCm, setHipCm] = useState<number>(96); // only for females

  const calculations = useMemo(() => {
    // Convert cm to inches for standard DoD/Army formula:
    // Men: %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
    // Women: %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
    const heightIn = heightCm / 2.54;
    const neckIn = neckCm / 2.54;
    const waistIn = waistCm / 2.54;
    const hipIn = hipCm / 2.54;

    let bodyFat = 0;
    if (gender === 'male') {
      const diff = waistIn - neckIn;
      if (diff > 0 && heightIn > 0) {
        bodyFat = 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76;
      }
    } else {
      const sum = waistIn + hipIn - neckIn;
      if (sum > 0 && heightIn > 0) {
        bodyFat = 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387;
      }
    }

    bodyFat = Math.max(2, Math.min(60, bodyFat));

    // Army Max Allowable BF Standards by age:
    // 17-20: M: 20%, F: 30%
    // 21-27: M: 22%, F: 32%
    // 28-39: M: 24%, F: 34%
    // 40+:   M: 26%, F: 36%
    let maxAllowed = 22;
    if (gender === 'male') {
      if (age <= 20) maxAllowed = 20;
      else if (age <= 27) maxAllowed = 22;
      else if (age <= 39) maxAllowed = 24;
      else maxAllowed = 26;
    } else {
      if (age <= 20) maxAllowed = 30;
      else if (age <= 27) maxAllowed = 32;
      else if (age <= 39) maxAllowed = 34;
      else maxAllowed = 36;
    }

    const passesStandard = bodyFat <= maxAllowed;

    return {
      bodyFat: Math.round(bodyFat * 10) / 10,
      maxAllowed,
      passesStandard
    };
  }, [gender, age, heightCm, neckCm, waistCm, hipCm]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-800 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Army Body Fat Calculator – Tiêu Chuẩn Quân Đội Hoa Kỳ</h1>
            <p className="text-xs sm:text-sm text-slate-400">Đo tỷ lệ phần trăm mỡ cơ thể theo chuẩn Army Regulation 600-9 (Băng đo chu vi)</p>
          </div>
        </div>
        <button
          id="army-fat-reset-btn"
          onClick={() => { setGender('male'); setAge(24); setHeightCm(178); setNeckCm(38); setWaistCm(84); setHipCm(96); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            Số đo chu vi cơ thể (cm)
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="army-gender-male"
              onClick={() => setGender('male')}
              className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                gender === 'male' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Nam quân nhân
            </button>
            <button
              type="button"
              id="army-gender-female"
              onClick={() => setGender('female')}
              className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                gender === 'female' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Nữ quân nhân
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tuổi</label>
              <input
                id="army-age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao (cm)</label>
              <input
                id="army-height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vòng cổ (cm)</label>
              <input
                id="army-neck"
                type="number"
                value={neckCm}
                onChange={(e) => setNeckCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vòng bụng/eo (cm)</label>
              <input
                id="army-waist"
                type="number"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {gender === 'female' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vòng mông (Hip - cm)</label>
              <input
                id="army-hip"
                type="number"
                value={hipCm}
                onChange={(e) => setHipCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Tỷ lệ mỡ cơ thể ước tính (Body Fat)</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-sans tabular-nums">
              {calculations.bodyFat}%
            </div>
            <p className="text-xs text-slate-400">
              Giới hạn tối đa cho phép theo độ tuổi ({age} tuổi): <span className="text-white font-semibold font-sans">{calculations.maxAllowed}%</span>
            </p>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            calculations.passesStandard
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            {calculations.passesStandard ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {calculations.passesStandard ? 'Đạt tiêu chuẩn thể lực quân đội' : 'Chưa đạt tiêu chuẩn quân đội'}
              </div>
              <p className="text-xs opacity-80">
                {calculations.passesStandard
                  ? `Mức mỡ của bạn nằm trong giới hạn an toàn quy định của U.S. Army AR 600-9.`
                  : `Tỷ lệ mỡ vượt quá ngưỡng ${calculations.maxAllowed}% cho phép, cần tập luyện và điều chỉnh dinh dưỡng.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
