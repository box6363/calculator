import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Coins,
  Ruler,
  Weight,
  Square,
  ThermometerSun
} from 'lucide-react';

type UnitCategory = 'currency' | 'length' | 'weight' | 'area' | 'temperature';

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  factorToBase: number; // For non-temp: multiplier to convert to base unit
}

// Currency reference rates (Base = USD)
const CURRENCIES: Record<string, { name: string; symbol: string; rateToUSD: number }> = {
  VND: { name: 'Đồng Việt Nam', symbol: '₫', rateToUSD: 25450 },
  USD: { name: 'Đô la Mỹ', symbol: '$', rateToUSD: 1 },
  EUR: { name: 'Euro Châu Âu', symbol: '€', rateToUSD: 0.92 },
  JPY: { name: 'Yên Nhật', symbol: '¥', rateToUSD: 154.5 },
  GBP: { name: 'Bảng Anh', symbol: '£', rateToUSD: 0.79 },
  CNY: { name: 'Nhân dân tệ', symbol: '¥', rateToUSD: 7.24 },
  KRW: { name: 'Won Hàn Quốc', symbol: '₩', rateToUSD: 1380 },
  SGD: { name: 'Đô la Singapore', symbol: 'S$', rateToUSD: 1.35 },
  AUD: { name: 'Đô la Úc', symbol: 'A$', rateToUSD: 1.52 },
  CAD: { name: 'Đô la Canada', symbol: 'C$', rateToUSD: 1.37 },
};

// Length (Base = meter)
const LENGTH_UNITS: UnitDef[] = [
  { id: 'm', name: 'Mét', symbol: 'm', factorToBase: 1 },
  { id: 'km', name: 'Kilômét', symbol: 'km', factorToBase: 1000 },
  { id: 'cm', name: 'Xentimét', symbol: 'cm', factorToBase: 0.01 },
  { id: 'mm', name: 'Milimét', symbol: 'mm', factorToBase: 0.001 },
  { id: 'inch', name: 'Inch', symbol: 'in', factorToBase: 0.0254 },
  { id: 'foot', name: 'Foot / Feet', symbol: 'ft', factorToBase: 0.3048 },
  { id: 'yard', name: 'Yard', symbol: 'yd', factorToBase: 0.9144 },
  { id: 'mile', name: 'Dặm (Mile)', symbol: 'mi', factorToBase: 1609.344 },
];

// Weight (Base = kilogram)
const WEIGHT_UNITS: UnitDef[] = [
  { id: 'kg', name: 'Kilôgam', symbol: 'kg', factorToBase: 1 },
  { id: 'g', name: 'Gam', symbol: 'g', factorToBase: 0.001 },
  { id: 'mg', name: 'Miligam', symbol: 'mg', factorToBase: 0.000001 },
  { id: 'tan', name: 'Tấn (Việt Nam)', symbol: 'tấn', factorToBase: 1000 },
  { id: 'ta', name: 'Tạ (Việt Nam)', symbol: 'tạ', factorToBase: 100 },
  { id: 'yen', name: 'Yến (Việt Nam)', symbol: 'yến', factorToBase: 10 },
  { id: 'lb', name: 'Pound (lbs)', symbol: 'lb', factorToBase: 0.45359237 },
  { id: 'oz', name: 'Ounce (oz)', symbol: 'oz', factorToBase: 0.028349523 },
];

// Area (Base = square meter)
const AREA_UNITS: UnitDef[] = [
  { id: 'm2', name: 'Mét vuông', symbol: 'm²', factorToBase: 1 },
  { id: 'km2', name: 'Kilômét vuông', symbol: 'km²', factorToBase: 1000000 },
  { id: 'ha', name: 'Hécta', symbol: 'ha', factorToBase: 10000 },
  { id: 'ft2', name: 'Square Foot', symbol: 'ft²', factorToBase: 0.092903 },
  { id: 'sao_bac', name: 'Sào Bắc Bộ', symbol: 'sào BB', factorToBase: 360 },
  { id: 'sao_trung', name: 'Sào Trung Bộ', symbol: 'sào TB', factorToBase: 500 },
  { id: 'cong_nam', name: 'Công (Sào Nam Bộ)', symbol: 'công', factorToBase: 1000 },
  { id: 'mau_vn', name: 'Mẫu (Nam Bộ)', symbol: 'mẫu', factorToBase: 10000 },
];

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('currency');
  const [inputValue, setInputValue] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  // Currency states
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('VND');

  // Other units states
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('m');

  // Temperature states
  const [fromTemp, setFromTemp] = useState<string>('C');
  const [toTemp, setToTemp] = useState<string>('F');

  // Reset units when category changes
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    if (cat === 'currency') {
      setInputValue(100);
    } else if (cat === 'length') {
      setInputValue(5);
      setFromUnit('km');
      setToUnit('m');
    } else if (cat === 'weight') {
      setInputValue(10);
      setFromUnit('kg');
      setToUnit('lb');
    } else if (cat === 'area') {
      setInputValue(2);
      setFromUnit('ha');
      setToUnit('m2');
    } else if (cat === 'temperature') {
      setInputValue(37);
      setFromTemp('C');
      setToTemp('F');
    }
  };

  // Convert
  const resultValue = useMemo(() => {
    if (category === 'currency') {
      const fromRate = CURRENCIES[fromCurrency]?.rateToUSD || 1;
      const toRate = CURRENCIES[toCurrency]?.rateToUSD || 1;
      // Convert to USD, then to target
      const inUSD = inputValue / fromRate;
      return inUSD * toRate;
    }

    if (category === 'temperature') {
      let c = inputValue;
      if (fromTemp === 'F') c = (inputValue - 32) * (5 / 9);
      if (fromTemp === 'K') c = inputValue - 273.15;

      if (toTemp === 'C') return c;
      if (toTemp === 'F') return (c * 9) / 5 + 32;
      if (toTemp === 'K') return c + 273.15;
      return c;
    }

    let unitList = LENGTH_UNITS;
    if (category === 'weight') unitList = WEIGHT_UNITS;
    if (category === 'area') unitList = AREA_UNITS;

    const fromDef = unitList.find(u => u.id === fromUnit);
    const toDef = unitList.find(u => u.id === toUnit);

    if (!fromDef || !toDef || toDef.factorToBase === 0) return 0;

    const baseValue = inputValue * fromDef.factorToBase;
    return baseValue / toDef.factorToBase;
  }, [category, inputValue, fromCurrency, toCurrency, fromUnit, toUnit, fromTemp, toTemp]);

  const handleSwap = () => {
    if (category === 'currency') {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
    } else if (category === 'temperature') {
      setFromTemp(toTemp);
      setToTemp(fromTemp);
    } else {
      setFromUnit(toUnit);
      setToUnit(fromUnit);
    }
  };

  const formatDisplay = (num: number) => {
    if (category === 'currency' && toCurrency === 'VND') {
      return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num);
    }
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 }).format(num);
  };

  const copyResult = () => {
    let text = '';
    if (category === 'currency') {
      text = `${inputValue} ${fromCurrency} = ${formatDisplay(resultValue)} ${toCurrency}`;
    } else if (category === 'temperature') {
      text = `${inputValue}°${fromTemp} = ${formatDisplay(resultValue)}°${toTemp}`;
    } else {
      text = `${inputValue} ${fromUnit} = ${formatDisplay(resultValue)} ${toUnit}`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Category Nav Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => handleCategoryChange('currency')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            category === 'currency' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Tiền tệ ngoại tệ</span>
        </button>

        <button
          onClick={() => handleCategoryChange('length')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            category === 'length' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Chiều dài</span>
        </button>

        <button
          onClick={() => handleCategoryChange('weight')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            category === 'weight' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Weight className="w-4 h-4" />
          <span>Khối lượng</span>
        </button>

        <button
          onClick={() => handleCategoryChange('area')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            category === 'area' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Square className="w-4 h-4" />
          <span>Diện tích (Sào/Mẫu)</span>
        </button>

        <button
          onClick={() => handleCategoryChange('temperature')}
          className={`flex items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
            category === 'temperature' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ThermometerSun className="w-4 h-4" />
          <span>Nhiệt độ</span>
        </button>
      </div>

      {/* Converter Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Input Side (Col 1-5) */}
        <div className="lg:col-span-5 space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">Số lượng cần chuyển đổi</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-full h-14 px-4 rounded-xl border border-slate-200 text-2xl font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          />

          {/* From Select */}
          {category === 'currency' ? (
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              {Object.entries(CURRENCIES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {code} – {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          ) : category === 'temperature' ? (
            <select
              value={fromTemp}
              onChange={(e) => setFromTemp(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              <option value="C">Độ C (°C - Celsius)</option>
              <option value="F">Độ F (°F - Fahrenheit)</option>
              <option value="K">Độ K (Kelvin)</option>
            </select>
          ) : (
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              {(category === 'length' ? LENGTH_UNITS : category === 'weight' ? WEIGHT_UNITS : AREA_UNITS).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Swap Button (Col 6) */}
        <div className="lg:col-span-2 flex justify-center py-2 lg:py-0">
          <button
            onClick={handleSwap}
            title="Đảo ngược đơn vị"
            className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 shadow-md flex items-center justify-center transition-all duration-300 active:scale-90 active:rotate-180"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Output Side (Col 7-12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Đơn vị muốn nhận</label>
            <button
              onClick={copyResult}
              className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="w-full h-14 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between overflow-x-auto">
            <span className="text-2xl font-black text-[#10B981] font-mono tracking-tight whitespace-nowrap">
              {formatDisplay(resultValue)}
            </span>
          </div>

          {/* To Select */}
          {category === 'currency' ? (
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              {Object.entries(CURRENCIES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {code} – {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          ) : category === 'temperature' ? (
            <select
              value={toTemp}
              onChange={(e) => setToTemp(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              <option value="C">Độ C (°C - Celsius)</option>
              <option value="F">Độ F (°F - Fahrenheit)</option>
              <option value="K">Độ K (Kelvin)</option>
            </select>
          ) : (
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full min-h-[50px] px-3.5 rounded-xl border border-slate-200 text-base sm:text-sm font-semibold text-slate-800 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer shadow-xs"
            >
              {(category === 'length' ? LENGTH_UNITS : category === 'weight' ? WEIGHT_UNITS : AREA_UNITS).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          )}
        </div>

      </div>

      {/* Quick Conversion Rate Table for Currency or Area */}
      {category === 'currency' && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Bảng tỷ giá tham khảo (1 {fromCurrency} đổi sang các loại tiền khác)</span>
            <span className="text-[11px] text-slate-400 font-mono">Tỷ giá thị trường tự do</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            {['VND', 'USD', 'EUR', 'JPY', 'GBP', 'CNY', 'KRW', 'SGD']
              .filter(code => code !== fromCurrency)
              .slice(0, 4)
              .map(code => {
                const rate = ((1 / (CURRENCIES[fromCurrency]?.rateToUSD || 1)) * (CURRENCIES[code]?.rateToUSD || 1));
                return (
                  <div key={code} className="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-xs">
                    <span className="font-semibold text-slate-600">{code}</span>
                    <span className="font-bold text-slate-900">
                      {code === 'VND' ? new Intl.NumberFormat('vi-VN').format(Math.round(rate)) : rate.toFixed(3)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {category === 'area' && (
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <span className="font-bold block">Quy chuẩn diện tích truyền thống Việt Nam:</span>
          <p className="leading-relaxed text-emerald-900">
            • 1 Sào Bắc Bộ = 360 m² &nbsp;|&nbsp; 1 Sào Trung Bộ = 500 m² &nbsp;|&nbsp; 1 Công (Sào Nam Bộ) = 1.000 m² &nbsp;|&nbsp; 1 Mẫu = 10.000 m² (1 Hécta).
          </p>
        </div>
      )}

    </div>
  );
};
