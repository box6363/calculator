import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Check,
  Copy
} from 'lucide-react';

export const ConcreteCalculator: React.FC = () => {
  const [shape, setShape] = useState<'slab' | 'column' | 'footing'>('slab');
  
  // Slab / Footing dimensions (meters)
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(6);
  const [thicknessCm, setThicknessCm] = useState<number>(12); // cm

  // Cylinder column dimensions
  const [diameterCm, setDiameterCm] = useState<number>(30); // cm
  const [heightM, setHeightM] = useState<number>(3.5);
  const [columnCount, setColumnCount] = useState<number>(6);

  // Waste margin
  const [wastePercent, setWastePercent] = useState<number>(10); // 10% standard

  // Concrete Grade (Mac)
  const [grade, setGrade] = useState<'M200' | 'M250' | 'M300'>('M250');

  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    let rawVolumeM3 = 0;

    if (shape === 'slab' || shape === 'footing') {
      const thicknessM = thicknessCm / 100;
      rawVolumeM3 = length * width * thicknessM;
    } else {
      // Cylinder: pi * r^2 * h * count
      const radiusM = (diameterCm / 2) / 100;
      const singleColVol = Math.PI * Math.pow(radiusM, 2) * heightM;
      rawVolumeM3 = singleColVol * columnCount;
    }

    const totalVolumeM3 = rawVolumeM3 * (1 + wastePercent / 100);

    // Material Mix per 1 m3 concrete:
    // M200: ~350kg cement (7 bags), 0.48m3 sand, 0.9m3 stone, 185L water
    // M250: ~415kg cement (8.3 bags), 0.46m3 sand, 0.88m3 stone, 195L water
    // M300: ~450kg cement (9 bags), 0.44m3 sand, 0.86m3 stone, 200L water
    const gradeRates = {
      M200: { cementKg: 350, sandM3: 0.48, stoneM3: 0.90, waterL: 185 },
      M250: { cementKg: 415, sandM3: 0.46, stoneM3: 0.88, waterL: 195 },
      M300: { cementKg: 450, sandM3: 0.44, stoneM3: 0.86, waterL: 200 },
    };

    const rates = gradeRates[grade];
    const totalCementKg = Math.round(totalVolumeM3 * rates.cementKg);
    const cementBags50kg = Math.ceil(totalCementKg / 50);
    const totalSandM3 = Number((totalVolumeM3 * rates.sandM3).toFixed(2));
    const totalStoneM3 = Number((totalVolumeM3 * rates.stoneM3).toFixed(2));
    const totalWaterL = Math.round(totalVolumeM3 * rates.waterL);

    // Ready-mix concrete trucks (Xe bồn 6m3 & 9m3)
    const trucks6m3 = Math.ceil(totalVolumeM3 / 6);

    return {
      rawVolumeM3: Number(rawVolumeM3.toFixed(2)),
      totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
      cementBags50kg,
      totalCementKg,
      totalSandM3,
      totalStoneM3,
      totalWaterL,
      trucks6m3
    };
  }, [shape, length, width, thicknessCm, diameterCm, heightM, columnCount, wastePercent, grade]);

  const handleCopy = () => {
    const text = `Dự toán khối lượng Bê Tông (Mác ${grade}):
- Khối lượng thực tế: ${calculations.totalVolumeM3} m³ (đã cộng ${wastePercent}% hao hụt)
- Số lượng xi măng: ${calculations.cementBags50kg} bao (loại 50kg) ~ ${calculations.totalCementKg} kg
- Cát vàng: ${calculations.totalSandM3} m³
- Đá 1x2: ${calculations.totalStoneM3} m³
- Nước sạch: ${calculations.totalWaterL} lít
- Nếu gọi bê tông tươi: ~${calculations.trucks6m3} chuyến xe bồn (loại 6m³)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="concrete-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <Boxes className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Concrete Calculator (Dự Toán Khối Lượng Bê Tông)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính số khối bê tông m³ cho sàn, móng, cột và cấp phối vật tư xi măng, cát, đá tương ứng.
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

      {/* Shape Selector */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setShape('slab')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            shape === 'slab' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Đổ sàn bê tông phẳng
        </button>
        <button
          type="button"
          onClick={() => setShape('column')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            shape === 'column' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Cột tròn / Trụ tròn
        </button>
        <button
          type="button"
          onClick={() => setShape('footing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            shape === 'footing' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Móng băng / Tường chắn
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Kích thước hình học
            </span>

            {shape !== 'column' ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Chiều dài (mét):</label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.1}
                      value={length}
                      onChange={(e) => setLength(Math.max(0.1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Chiều rộng (mét):</label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.1}
                      value={width}
                      onChange={(e) => setWidth(Math.max(0.1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-600">
                    <span>Độ dày sàn/móng:</span>
                    <span className="font-bold text-slate-900">{thicknessCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={thicknessCm}
                    onChange={(e) => setThicknessCm(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Đường kính cột (cm):</label>
                    <input
                      type="number"
                      value={diameterCm}
                      onChange={(e) => setDiameterCm(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Chiều cao cột (mét):</label>
                    <input
                      type="number"
                      step={0.1}
                      value={heightM}
                      onChange={(e) => setHeightM(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Số lượng cột:</label>
                  <input
                    type="number"
                    min={1}
                    value={columnCount}
                    onChange={(e) => setColumnCount(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Waste Factor & Mac Concrete */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1 uppercase tracking-wider">
                  Mác Bê Tông (Mac)
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="M200">Mác 200 (Công trình thông thường)</option>
                  <option value="M250">Mác 250 (Nhà phố tiêu chuẩn)</option>
                  <option value="M300">Mác 300 (Chịu lực cao / Tầng hầm)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1 uppercase tracking-wider">
                  Hao hụt / Dự phòng
                </label>
                <select
                  value={wastePercent}
                  onChange={(e) => setWastePercent(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value={5}>5% (Tay nghề chuẩn)</option>
                  <option value={10}>10% (Khuyến nghị chuẩn)</option>
                  <option value={15}>15% (Địa hình gồ ghề)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Volume */}
          <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-slate-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Tổng thể tích bê tông cần đặt
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
                {calculations.totalVolumeM3}
              </span>
              <span className="text-lg font-semibold text-amber-200">m³ (khối)</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-xs flex justify-between items-center">
              <span className="text-slate-300">Nếu đặt xe bồn thương phẩm:</span>
              <span className="font-bold text-amber-300 font-mono text-sm">
                ~{calculations.trucks6m3} xe bồn (6m³)
              </span>
            </div>
          </div>

          {/* Material breakdown */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Dự toán cấp phối vật liệu rời (Mác {grade})
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Xi măng (bao 50kg)</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {calculations.cementBags50kg} bao
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">~{calculations.totalCementKg.toLocaleString()} kg</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Cát vàng</span>
                <span className="text-lg font-black text-amber-600 font-mono">
                  {calculations.totalSandM3} m³
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Cát bê tông rửa sạch</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Đá 1x2</span>
                <span className="text-lg font-black text-blue-600 font-mono">
                  {calculations.totalStoneM3} m³
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Đá sàng tiêu chuẩn</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Nước sạch</span>
                <span className="text-lg font-black text-cyan-600 font-mono">
                  {calculations.totalWaterL.toLocaleString()} lít
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Nước ngọt sinh hoạt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
