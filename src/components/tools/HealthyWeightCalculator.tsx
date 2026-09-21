import React, { useState, useMemo } from 'react';
import { Heart, RotateCcw, User } from 'lucide-react';

export const HealthyWeightCalculator: React.FC = () => {
  const [heightCm, setHeightCm] = useState<number>(170);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(68);

  const calculations = useMemo(() => {
    const hMeter = Math.max(0.5, heightCm / 100);
    const w = Math.max(20, currentWeightKg);

    const currentBmi = w / (hMeter * hMeter);

    // WHO Standard BMI Categories:
    // Underweight: < 18.5
    // Normal / Healthy: 18.5 - 24.9
    // Overweight: 25.0 - 29.9
    // Obese: >= 30.0
    const minHealthyWeight = 18.5 * (hMeter * hMeter);
    const maxHealthyWeight = 24.9 * (hMeter * hMeter);
    const midHealthyWeight = 21.7 * (hMeter * hMeter);

    let status = 'Cân nặng bình thường, rất khỏe mạnh';
    let statusColor = 'text-emerald-400';
    let diff = 0;

    if (currentBmi < 18.5) {
      status = 'Thiếu cân (Underweight)';
      statusColor = 'text-amber-400';
      diff = minHealthyWeight - w;
    } else if (currentBmi > 24.9) {
      status = currentBmi >= 30 ? 'Béo phì (Obese)' : 'Thừa cân (Overweight)';
      statusColor = 'text-rose-400';
      diff = w - maxHealthyWeight;
    }

    return {
      currentBmi: Math.round(currentBmi * 10) / 10,
      minHealthyWeight: Math.round(minHealthyWeight * 10) / 10,
      maxHealthyWeight: Math.round(maxHealthyWeight * 10) / 10,
      midHealthyWeight: Math.round(midHealthyWeight * 10) / 10,
      status,
      statusColor,
      diff: Math.round(diff * 10) / 10,
      isHealthy: currentBmi >= 18.5 && currentBmi <= 24.9
    };
  }, [heightCm, currentWeightKg]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-900/40 via-slate-800 to-slate-900 border border-teal-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600/20 text-teal-400 rounded-xl border border-teal-500/30">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Healthy Weight Calculator – Tính Cân Nặng Khỏe Mạnh</h1>
            <p className="text-xs sm:text-sm text-slate-400">Dải cân nặng tối ưu bảo vệ tim mạch và phòng ngừa bệnh lý theo khuyến cáo WHO</p>
          </div>
        </div>
        <button
          id="healthy-weight-reset-btn"
          onClick={() => { setHeightCm(170); setCurrentWeightKg(68); }}
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
            Chiều cao & Cân nặng
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Chiều cao của bạn (cm)</label>
            <input
              id="healthy-height"
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cân nặng hiện tại (kg)</label>
            <input
              id="healthy-weight"
              type="number"
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-teal-400">Tiêu chuẩn BMI Quốc tế:</div>
            <div>• Dưới 18.5: Thiếu cân</div>
            <div>• 18.5 – 24.9: Cân nặng bình thường, lý tưởng</div>
            <div>• 25.0 – 29.9: Thừa cân</div>
            <div>• Trên 30.0: Béo phì</div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-950/40 to-slate-900 border border-teal-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">Dải cân nặng khỏe mạnh khuyến nghị</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-sans tabular-nums">
              {calculations.minHealthyWeight} kg – {calculations.maxHealthyWeight} kg
            </div>
            <p className="text-xs text-slate-400">
              Điểm cân nặng trung tâm lý tưởng: <span className="text-white font-bold font-sans">{calculations.midHealthyWeight} kg</span> (BMI 21.7)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Chỉ số BMI hiện tại</span>
              <div className="text-xl font-bold text-white font-sans tabular-nums">
                {calculations.currentBmi} kg/m²
              </div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Tình trạng thể chất</span>
              <div className={`text-sm font-bold ${calculations.statusColor}`}>
                {calculations.status}
              </div>
            </div>
          </div>

          {!calculations.isHealthy && (
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 flex items-center justify-between">
              <span>{calculations.currentBmi < 18.5 ? 'Khuyến nghị tăng cân:' : 'Khuyến nghị giảm cân:'}</span>
              <span className="font-bold text-teal-400 font-sans tabular-nums">
                {calculations.currentBmi < 18.5 ? `Tăng thêm tối thiểu ${calculations.diff} kg` : `Giảm bớt khoảng ${calculations.diff} kg`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
