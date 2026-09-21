import React, { useState, useMemo } from 'react';
import { Scale, RotateCcw, User } from 'lucide-react';

export const IdealWeightCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(172);
  const [age, setAge] = useState<number>(28);
  const [currentWeight, setCurrentWeight] = useState<number>(68);

  const calculations = useMemo(() => {
    const h = heightCm;
    const heightInches = h / 2.54;
    const inchesOver5Ft = Math.max(0, heightInches - 60);

    // 1. Devine Formula (1974)
    const devine = gender === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;

    // 2. Robinson Formula (1983)
    const robinson = gender === 'male' ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;

    // 3. Miller Formula (1983)
    const miller = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;

    // 4. Hamwi Formula (1964)
    const hamwi = gender === 'male' ? 48.0 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

    // Healthy BMI Range WHO: 18.5 - 24.9 kg/m^2
    const hMeter = h / 100;
    const minBmiWeight = 18.5 * (hMeter * hMeter);
    const maxBmiWeight = 24.9 * (hMeter * hMeter);

    const averageIdeal = (devine + robinson + miller + hamwi) / 4;

    // Current Status
    const currentBmi = currentWeight / (hMeter * hMeter);
    const diffFromIdeal = currentWeight - averageIdeal;

    let statusText = 'Cân đối lý tưởng';
    let statusColor = 'text-emerald-400';
    let recommendation = 'Cân nặng hiện tại của bạn nằm trong khoảng chuẩn lý tưởng.';

    if (currentWeight < minBmiWeight) {
      statusText = 'Dưới chuẩn (Thiếu cân nhẹ)';
      statusColor = 'text-amber-400';
      recommendation = `Bạn đang nhẹ hơn khoảng an toàn tối thiểu ${(minBmiWeight - currentWeight).toFixed(1)} kg. Nên bổ sung dinh dưỡng hợp lý.`;
    } else if (currentWeight > maxBmiWeight) {
      statusText = 'Vượt chuẩn (Thừa cân)';
      statusColor = 'text-rose-400';
      recommendation = `Bạn đang nặng hơn ngưỡng an toàn ${(currentWeight - maxBmiWeight).toFixed(1)} kg. Nên điều chỉnh thâm hụt calo và vận động.`;
    } else {
      statusText = 'Khỏe mạnh chuẩn WHO';
      statusColor = 'text-emerald-400';
      recommendation = 'Tuyệt vời! Cân nặng của bạn nằm trọn vẹn trong dải cân nặng khỏe mạnh chuẩn WHO.';
    }

    return {
      devine: Math.round(devine * 10) / 10,
      robinson: Math.round(robinson * 10) / 10,
      miller: Math.round(miller * 10) / 10,
      hamwi: Math.round(hamwi * 10) / 10,
      averageIdeal: Math.round(averageIdeal * 10) / 10,
      minBmiWeight: Math.round(minBmiWeight * 10) / 10,
      maxBmiWeight: Math.round(maxBmiWeight * 10) / 10,
      currentBmi: Math.round(currentBmi * 10) / 10,
      diffFromIdeal: Math.round(diffFromIdeal * 10) / 10,
      statusText,
      statusColor,
      recommendation
    };
  }, [gender, heightCm, currentWeight]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-900/40 via-slate-800 to-slate-900 border border-teal-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600/20 text-teal-400 rounded-xl border border-teal-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Ideal Weight Calculator – Tính Cân Nặng Lý Tưởng</h1>
            <p className="text-xs sm:text-sm text-slate-400">Xác định cân nặng chuẩn theo 4 công thức y khoa quốc tế (Devine, Robinson, Miller, Hamwi)</p>
          </div>
        </div>
        <button
          id="ideal-weight-reset-btn"
          onClick={() => { setGender('male'); setHeightCm(172); setAge(28); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            Thông số cá nhân
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Giới tính</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="ideal-gender-male"
                onClick={() => setGender('male')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                  gender === 'male' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Nam giới
              </button>
              <button
                type="button"
                id="ideal-gender-female"
                onClick={() => setGender('female')}
                className={`py-2 px-3 text-xs rounded-xl border font-medium transition-all ${
                  gender === 'female' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Nữ giới
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao (cm)</label>
              <input
                id="ideal-height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cân nặng hiện tại (kg)</label>
              <input
                id="ideal-current-weight"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Độ tuổi</label>
              <input
                id="ideal-age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-950/40 to-slate-900 border border-teal-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">Cân nặng lý tưởng trung bình</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-teal-400 font-sans tabular-nums">
              {calculations.averageIdeal} <span className="text-xl font-normal text-slate-400">kg</span>
            </div>
            <p className="text-xs text-slate-400">
              Khuyến nghị dải cân nặng an toàn theo WHO: <span className="text-emerald-400 font-bold font-sans">{calculations.minBmiWeight} kg – {calculations.maxBmiWeight} kg</span>
            </p>
          </div>

          {/* Assessment & Healthy Weight Status */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Đánh giá thể trạng hiện tại:</span>
              <span className={`text-xs font-bold ${calculations.statusColor} px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700`}>
                {calculations.statusText} (BMI: {calculations.currentBmi})
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {calculations.recommendation} {calculations.diffFromIdeal !== 0 && (
                <span className="text-slate-400">
                  (Chênh lệch {calculations.diffFromIdeal > 0 ? `+${calculations.diffFromIdeal}` : calculations.diffFromIdeal} kg so với cân nặng lý tưởng).
                </span>
              )}
            </p>
          </div>

          {/* Formulas breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[11px] text-slate-400">Công thức Devine (1974)</span>
              <div className="text-lg font-bold text-white font-sans tabular-nums">{calculations.devine} kg</div>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[11px] text-slate-400">Công thức Robinson (1983)</span>
              <div className="text-lg font-bold text-white font-sans tabular-nums">{calculations.robinson} kg</div>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[11px] text-slate-400">Công thức Miller (1983)</span>
              <div className="text-lg font-bold text-white font-sans tabular-nums">{calculations.miller} kg</div>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[11px] text-slate-400">Công thức Hamwi (1964)</span>
              <div className="text-lg font-bold text-white font-sans tabular-nums">{calculations.hamwi} kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
