import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Droplet,
  Scale,
  HeartPulse
} from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';
type StandardType = 'asian' | 'who';
type Gender = 'male' | 'female';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [standard, setStandard] = useState<StandardType>('asian');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(25);

  // Metric inputs
  const [heightCm, setHeightCm] = useState<number>(() => {
    if (typeof window === 'undefined') return 168;
    const h = new URLSearchParams(window.location.search).get('height');
    return h && !isNaN(Number(h)) ? Number(h) : 168;
  });
  const [weightKg, setWeightKg] = useState<number>(() => {
    if (typeof window === 'undefined') return 62;
    const w = new URLSearchParams(window.location.search).get('weight');
    return w && !isNaN(Number(w)) ? Number(w) : 62;
  });

  // Imperial inputs
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(6);
  const [weightLbs, setWeightLbs] = useState<number>(137);

  const [copied, setCopied] = useState<boolean>(false);

  // Calculate actual height in meters and weight in kg
  const { heightM, weightActualKg } = useMemo(() => {
    if (unitSystem === 'metric') {
      return {
        heightM: Math.max(0.5, heightCm / 100),
        weightActualKg: Math.max(10, weightKg),
      };
    } else {
      const totalInches = heightFt * 12 + heightIn;
      const m = totalInches * 0.0254;
      const kg = weightLbs * 0.45359237;
      return {
        heightM: Math.max(0.5, m),
        weightActualKg: Math.max(10, kg),
      };
    }
  }, [unitSystem, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  // BMI calculation
  const bmi = useMemo(() => {
    if (!heightM || heightM <= 0) return 0;
    const val = weightActualKg / (heightM * heightM);
    return Number(val.toFixed(1));
  }, [heightM, weightActualKg]);

  // Classification based on WHO or Asian standards
  const categoryInfo = useMemo(() => {
    if (standard === 'asian') {
      // Asian-Pacific IDI & WPRO criteria
      if (bmi < 18.5) {
        return {
          categoryKey: 'underweight' as const,
          name: 'Thiếu cân (Gầy)',
          color: 'text-sky-600 dark:text-sky-400',
          bgColor: 'bg-sky-500/10',
          borderColor: 'border-sky-500/30',
          status: 'warning',
          desc: 'Chỉ số BMI dưới mức tiêu chuẩn. Bạn nên bổ sung dinh dưỡng hợp lý, tăng lượng protein và rèn luyện thể thao để phát triển cơ bắp.',
          gaugePercent: Math.max(4, Math.min(23, (bmi / 18.5) * 25)),
        };
      } else if (bmi <= 22.9) {
        return {
          categoryKey: 'normal' as const,
          name: 'Bình thường (Lý tưởng)',
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          status: 'good',
          desc: 'Chúc mừng! Thể trạng của bạn đang ở mức rất lý tưởng đối với thể trạng người châu Á. Hãy duy trì chế độ ăn và vận động hiện tại.',
          gaugePercent: 25 + Math.min(23, Math.max(2, ((bmi - 18.5) / (22.9 - 18.5)) * 25)),
        };
      } else if (bmi <= 24.9) {
        return {
          categoryKey: 'overweight' as const,
          name: 'Thừa cân (Tiền béo phì)',
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          status: 'warning',
          desc: 'Cân nặng đang vượt mức khuyến nghị. Nên chủ động giảm đồ ngọt, thức ăn nhanh và dành 30 phút thể dục mỗi ngày.',
          gaugePercent: 50 + Math.min(23, Math.max(2, ((bmi - 23.0) / (24.9 - 23.0)) * 25)),
        };
      } else if (bmi <= 29.9) {
        return {
          categoryKey: 'obese' as const,
          name: 'Béo phì độ 1',
          color: 'text-rose-600 dark:text-rose-400',
          bgColor: 'bg-rose-500/10',
          borderColor: 'border-rose-500/30',
          status: 'danger',
          desc: 'Nguy cơ mắc các bệnh tim mạch, huyết áp và chuyển hóa cao. Bạn nên xây dựng kế hoạch giảm cân khoa học.',
          gaugePercent: 75 + Math.min(14, Math.max(2, ((bmi - 25.0) / (29.9 - 25.0)) * 14)),
        };
      } else {
        return {
          categoryKey: 'obese' as const,
          name: 'Béo phì độ 2 (Nguy hiểm)',
          color: 'text-red-700 dark:text-red-400',
          bgColor: 'bg-red-500/15',
          borderColor: 'border-red-500/40',
          status: 'critical',
          desc: 'Mức độ béo phì nghiêm trọng. Bạn nên tham khảo ý kiến bác sĩ dinh dưỡng hoặc chuyên gia y tế để can thiệp kịp thời.',
          gaugePercent: Math.min(96, 88 + Math.min(8, ((bmi - 30.0) / 10.0) * 8)),
        };
      }
    } else {
      // WHO International criteria
      if (bmi < 18.5) {
        return {
          categoryKey: 'underweight' as const,
          name: 'Thiếu cân (Underweight)',
          color: 'text-sky-600 dark:text-sky-400',
          bgColor: 'bg-sky-500/10',
          borderColor: 'border-sky-500/30',
          status: 'warning',
          desc: 'Cân nặng thấp hơn mức trung bình quốc tế.',
          gaugePercent: Math.max(4, Math.min(23, (bmi / 18.5) * 25)),
        };
      } else if (bmi <= 24.9) {
        return {
          categoryKey: 'normal' as const,
          name: 'Bình thường (Normal)',
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          status: 'good',
          desc: 'Cân nặng cân đối theo tiêu chuẩn WHO.',
          gaugePercent: 25 + Math.min(23, Math.max(2, ((bmi - 18.5) / (24.9 - 18.5)) * 25)),
        };
      } else if (bmi <= 29.9) {
        return {
          categoryKey: 'overweight' as const,
          name: 'Thừa cân (Overweight)',
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          status: 'warning',
          desc: 'Cao hơn mức cân nặng khuyến nghị quốc tế.',
          gaugePercent: 50 + Math.min(23, Math.max(2, ((bmi - 25.0) / (29.9 - 25.0)) * 25)),
        };
      } else {
        return {
          categoryKey: 'obese' as const,
          name: 'Béo phì (Obese)',
          color: 'text-rose-600 dark:text-rose-400',
          bgColor: 'bg-rose-500/10',
          borderColor: 'border-rose-500/30',
          status: 'danger',
          desc: 'Nguy cơ sức khỏe tăng cao.',
          gaugePercent: Math.min(96, 75 + Math.min(21, ((bmi - 30.0) / 10.0) * 21)),
        };
      }
    }
  }, [bmi, standard]);

  // Ideal weight range
  const idealWeight = useMemo(() => {
    const minBmi = 18.5;
    const maxBmi = standard === 'asian' ? 22.9 : 24.9;
    const minKg = minBmi * heightM * heightM;
    const maxKg = maxBmi * heightM * heightM;
    return {
      min: Number(minKg.toFixed(1)),
      max: Number(maxKg.toFixed(1)),
    };
  }, [heightM, standard]);

  // Water need estimate (35ml / kg)
  const dailyWaterLiters = useMemo(() => {
    return Number(((weightActualKg * 35) / 1000).toFixed(1));
  }, [weightActualKg]);

  const copyResult = () => {
    const text = `Kết quả BMI của tôi: ${bmi} (${categoryInfo.name}) - Dải cân nặng lý tưởng: ${idealWeight.min} - ${idealWeight.max} kg. Kiểm tra tại Web Calculator`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Unit & Standard Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unitSystem === 'metric' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hệ Mét (cm, kg)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unitSystem === 'imperial' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hệ Anh-Mỹ (ft/in, lbs)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Chuẩn đánh giá:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStandard('asian')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                standard === 'asian' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Châu Á (Khuyên dùng)
            </button>
            <button
              onClick={() => setStandard('who')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                standard === 'who' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              WHO Quốc tế
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Form Inputs (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setGender('male')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    gender === 'male' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Nam
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    gender === 'female' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Nữ
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Độ tuổi</label>
              <input
                type="number"
                min="2"
                max="120"
                value={age}
                onChange={(e) => setAge(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm outline-none"
              />
            </div>
          </div>

          {/* Height Input */}
          {unitSystem === 'metric' ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Chiều cao (cm)</label>
                <span className="text-xs font-bold text-blue-600 font-mono">{heightCm} cm</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-24 h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                <input
                  type="range"
                  min="100"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                <span>100 cm</span>
                <span>160 cm</span>
                <span>220 cm</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Chiều cao (Feet & Inches)</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={heightFt}
                    onChange={(e) => setHeightFt(parseInt(e.target.value) || 0)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="text-xs text-slate-500 font-semibold">ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightIn}
                    onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="text-xs text-slate-500 font-semibold">in</span>
                </div>
              </div>
            </div>
          )}

          {/* Weight Input */}
          {unitSystem === 'metric' ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Cân nặng (kg)</label>
                <span className="text-xs font-bold text-blue-600 font-mono">{weightKg} kg</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-24 h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                <span>30 kg</span>
                <span>90 kg</span>
                <span>150 kg</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cân nặng (Pounds / lbs)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="40"
                  max="500"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(parseInt(e.target.value) || 0)}
                  className="w-28 h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                />
                <span className="text-xs text-slate-500 font-semibold">lbs</span>
              </div>
            </div>
          )}

          {/* Quick presets for demo */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-medium">Mẫu nhanh:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <button
                onClick={() => { setHeightCm(170); setWeightKg(65); }}
                className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                1m70 - 65kg
              </button>
              <button
                onClick={() => { setHeightCm(160); setWeightKg(50); }}
                className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                1m60 - 50kg
              </button>
              <button
                onClick={() => { setHeightCm(175); setWeightKg(82); }}
                className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                1m75 - 82kg
              </button>
            </div>
          </div>
        </div>

        {/* Right Result Card (Col 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
          
          {/* Primary Big Result Banner - Specification: Kết quả / thành công: #10B981 (Lime green) */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chỉ Số Khối Cơ Thể Của Bạn
              </span>
              <button
                onClick={copyResult}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép kết quả' : 'Sao chép'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 mt-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
                {bmi}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg/m²</span>
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${categoryInfo.bgColor} ${categoryInfo.color} ${categoryInfo.borderColor}`}>
                {categoryInfo.name}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="mt-4 space-y-2">
              <div className="relative pt-1 pb-1">
                {/* 4 Distinct Segments Bar */}
                <div className="relative h-4 w-full rounded-full overflow-hidden flex shadow-inner border border-slate-200 dark:border-slate-700 bg-slate-100">
                  {/* 1. Thiếu cân: Sky Blue */}
                  <div
                    className="w-1/4 h-full bg-sky-400 border-r border-white/60 dark:border-white/30 relative"
                    title="Thiếu cân (< 18.5)"
                  />
                  {/* 2. Lý tưởng: Emerald Green */}
                  <div
                    className="w-1/4 h-full bg-emerald-500 border-r border-white/60 dark:border-white/30 relative"
                    title={standard === 'asian' ? 'Lý tưởng (18.5 - 22.9)' : 'Bình thường (18.5 - 24.9)'}
                  />
                  {/* 3. Thừa cân: Amber Orange */}
                  <div
                    className="w-1/4 h-full bg-amber-400 border-r border-white/60 dark:border-white/30 relative"
                    title={standard === 'asian' ? 'Thừa cân (23.0 - 24.9)' : 'Thừa cân (25.0 - 29.9)'}
                  />
                  {/* 4. Béo phì: Rose Red */}
                  <div
                    className="w-1/4 h-full bg-rose-500 relative"
                    title={standard === 'asian' ? 'Béo phì (≥ 25.0)' : 'Béo phì (≥ 30.0)'}
                  />

                  {/* Marker Needle on the Bar - Always pure white with glow in both light and dark mode */}
                  <div
                    className="bmi-needle absolute top-0 bottom-0 w-2 keep-light -translate-x-1/2 z-10 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)] dark:shadow-[0_0_10px_rgba(255,255,255,0.95)] border border-slate-300 dark:border-white"
                    style={{ left: `${categoryInfo.gaugePercent}%`, backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Arrow Pointer & Indicator Tag */}
                <div className="relative h-10 w-full mt-1">
                  <div 
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ease-out z-20 pointer-events-none"
                    style={{ left: `${categoryInfo.gaugePercent}%` }}
                  >
                    {/* Clear Upward Triangle Arrow Pointer */}
                    <div className="w-0 h-0 border-x-[7px] border-x-transparent border-b-[8px] border-b-slate-900 dark:border-b-white drop-shadow-sm" />
                    
                    {/* Floating current BMI badge */}
                    <div className="mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-black tracking-tight bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md font-mono whitespace-nowrap flex items-center gap-1">
                      <span>{bmi}</span>
                      <span className="text-[9px] font-semibold opacity-75">BMI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Category Labels with Active Category Highlight */}
              <div className="grid grid-cols-4 gap-1 text-center -mt-1">
                <div className={`px-1 py-1 rounded-lg transition-all ${
                  categoryInfo.categoryKey === 'underweight' 
                    ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold ring-1 ring-sky-400' 
                    : 'text-slate-500 font-medium'
                }`}>
                  <span className="block text-[11px] sm:text-xs">Thiếu cân</span>
                  <span className="block text-[10px] opacity-75 font-mono">&lt;18.5</span>
                </div>

                <div className={`px-1 py-1 rounded-lg transition-all ${
                  categoryInfo.categoryKey === 'normal' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500' 
                    : 'text-slate-500 font-medium'
                }`}>
                  <span className="block text-[11px] sm:text-xs">Lý tưởng</span>
                  <span className="block text-[10px] opacity-75 font-mono">
                    {standard === 'asian' ? '18.5 - 22.9' : '18.5 - 24.9'}
                  </span>
                </div>

                <div className={`px-1 py-1 rounded-lg transition-all ${
                  categoryInfo.categoryKey === 'overweight' 
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold ring-1 ring-amber-500' 
                    : 'text-slate-500 font-medium'
                }`}>
                  <span className="block text-[11px] sm:text-xs">Thừa cân</span>
                  <span className="block text-[10px] opacity-75 font-mono">
                    {standard === 'asian' ? '23 - 24.9' : '25 - 29.9'}
                  </span>
                </div>

                <div className={`px-1 py-1 rounded-lg transition-all ${
                  categoryInfo.categoryKey === 'obese' 
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold ring-1 ring-rose-500' 
                    : 'text-slate-500 font-medium'
                }`}>
                  <span className="block text-[11px] sm:text-xs">Béo phì</span>
                  <span className="block text-[10px] opacity-75 font-mono">
                    {standard === 'asian' ? '≥25' : '≥30'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {categoryInfo.desc}
            </p>
          </div>

          {/* Health Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
            
            {/* Ideal Weight Box */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">Cân nặng lý tưởng</span>
                <span className="text-sm font-bold text-slate-900">
                  {idealWeight.min} – {idealWeight.max} kg
                </span>
              </div>
            </div>

            {/* Water Recommendation */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">Lượng nước mỗi ngày</span>
                <span className="text-sm font-bold text-slate-900">
                  ~{dailyWaterLiters} Lít / ngày
                </span>
              </div>
            </div>
          </div>

          {/* Standard notice */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {standard === 'asian'
                ? 'Theo chuẩn IDI & WPRO dành riêng cho tạng người châu Á (Việt Nam).'
                : 'Theo chuẩn WHO dành cho cộng đồng quốc tế.'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
