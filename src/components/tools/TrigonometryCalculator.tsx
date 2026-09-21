import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  LineChart
} from 'lucide-react';
import { InteractiveGraphPlotter } from './geometry/InteractiveGraphPlotter';

type AngleUnit = 'deg' | 'rad';
type TrigTab = 'functions' | 'waveform_graph' | 'triangle_solver';

interface TrigResult {
  exact: string | null;
  decimal: string;
  isUndefined: boolean;
}

// Exact values for standard angles in school mathematics (0, 30, 45, 60, 90, 120, etc.)
const SPECIAL_TRIG_TABLE: Record<number, {
  sin: string;
  cos: string;
  tan: string;
  cot: string;
  sec: string;
  csc: string;
}> = {
  0: { sin: '0', cos: '1', tan: '0', cot: 'Không xác định', sec: '1', csc: 'Không xác định' },
  30: { sin: '1/2', cos: '√3/2', tan: '√3/3', cot: '√3', sec: '2√3/3', csc: '2' },
  45: { sin: '√2/2', cos: '√2/2', tan: '1', cot: '1', sec: '√2', csc: '√2' },
  60: { sin: '√3/2', cos: '1/2', tan: '√3', cot: '√3/3', sec: '2', csc: '2√3/3' },
  90: { sin: '1', cos: '0', tan: 'Không xác định', cot: '0', sec: 'Không xác định', csc: '1' },
  120: { sin: '√3/2', cos: '-1/2', tan: '-√3', cot: '-√3/3', sec: '-2', csc: '2√3/3' },
  135: { sin: '√2/2', cos: '-√2/2', tan: '-1', cot: '-1', sec: '-√2', csc: '√2' },
  150: { sin: '1/2', cos: '-√3/2', tan: '-√3/3', cot: '-√3', sec: '-2√3/3', csc: '2' },
  180: { sin: '0', cos: '-1', tan: '0', cot: 'Không xác định', sec: '-1', csc: 'Không xác định' },
  210: { sin: '-1/2', cos: '-√3/2', tan: '√3/3', cot: '√3', sec: '-2√3/3', csc: '-2' },
  225: { sin: '-√2/2', cos: '-√2/2', tan: '1', cot: '1', sec: '-√2', csc: '-√2' },
  240: { sin: '-√3/2', cos: '-1/2', tan: '√3', cot: '√3/3', sec: '-2', csc: '-2√3/3' },
  270: { sin: '-1', cos: '0', tan: 'Không xác định', cot: '0', sec: 'Không xác định', csc: '-1' },
  300: { sin: '-√3/2', cos: '1/2', tan: '-√3', cot: '-√3/3', sec: '2', csc: '-2√3/3' },
  315: { sin: '-√2/2', cos: '√2/2', tan: '-1', cot: '-1', sec: '√2', csc: '-√2' },
  330: { sin: '-1/2', cos: '√3/2', tan: '-√3/3', cot: '-√3', sec: '2√3/3', csc: '-2' },
  360: { sin: '0', cos: '1', tan: '0', cot: 'Không xác định', sec: '1', csc: 'Không xác định' },
};

export const TrigonometryCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TrigTab>('functions');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [angleInput, setAngleInput] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);

  // Right Triangle Solver inputs
  // a: adjacent/side 1, b: opposite/side 2, c: hypotenuse, angleA: acute angle in deg
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);

  // Waveform Graph inputs
  const [waveFunc, setWaveFunc] = useState<'sin' | 'cos' | 'tan'>('sin');
  const [waveAmp, setWaveAmp] = useState<number>(1);
  const [waveFreq, setWaveFreq] = useState<number>(1);
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Angle in radians for math functions
  const angleInRad = useMemo(() => {
    return angleUnit === 'deg' ? (angleInput * Math.PI) / 180 : angleInput;
  }, [angleInput, angleUnit]);

  // Check if angle corresponds to a special degree angle modulo 360
  const specialKey = useMemo(() => {
    const deg = angleUnit === 'deg' ? angleInput : (angleInput * 180) / Math.PI;
    const rounded = Math.round(deg);
    if (Math.abs(deg - rounded) < 1e-4) {
      const normalized = ((rounded % 360) + 360) % 360;
      if (SPECIAL_TRIG_TABLE[normalized]) {
        return normalized;
      }
    }
    return null;
  }, [angleInput, angleUnit]);

  // Trig function values (both exact formula & decimal values)
  const trigValues = useMemo(() => {
    const sinVal = Math.sin(angleInRad);
    const cosVal = Math.cos(angleInRad);
    
    // Tan undefined near 90 + k*180 deg
    const isTanUndefined = Math.abs(cosVal) < 1e-12;
    const tanVal = isTanUndefined ? Infinity : Math.tan(angleInRad);

    // Cot undefined near k*180 deg
    const isCotUndefined = Math.abs(sinVal) < 1e-12;
    const cotVal = isCotUndefined ? Infinity : 1 / tanVal;

    const secVal = Math.abs(cosVal) < 1e-12 ? Infinity : 1 / cosVal;
    const cscVal = Math.abs(sinVal) < 1e-12 ? Infinity : 1 / sinVal;

    const formatVal = (v: number) => {
      if (!isFinite(v)) return 'Không xác định (∞)';
      const rounded = Number(v.toFixed(6));
      return rounded.toString();
    };

    const special = specialKey !== null ? SPECIAL_TRIG_TABLE[specialKey] : null;

    const makeResult = (val: number, specialExact?: string): TrigResult => {
      const isUndef = !isFinite(val) || specialExact === 'Không xác định';
      return {
        exact: specialExact && specialExact !== 'Không xác định' ? specialExact : null,
        decimal: isUndef ? 'Không xác định (∞)' : formatVal(val),
        isUndefined: isUndef
      };
    };

    return {
      sin: makeResult(sinVal, special?.sin),
      cos: makeResult(cosVal, special?.cos),
      tan: makeResult(tanVal, special?.tan),
      cot: makeResult(cotVal, special?.cot),
      sec: makeResult(secVal, special?.sec),
      csc: makeResult(cscVal, special?.csc),
      isSpecialAngle: special !== null,
      specialDegree: specialKey
    };
  }, [angleInRad, specialKey]);

  // Triangle solver calculation (from a and b)
  const triangleData = useMemo(() => {
    const a = Math.max(0.1, sideA);
    const b = Math.max(0.1, sideB);
    const c = Math.sqrt(a * a + b * b); // hypotenuse

    const angleADeg = (Math.atan2(b, a) * 180) / Math.PI;
    const angleBDeg = 90 - angleADeg;

    const area = (a * b) / 2;
    const perimeter = a + b + c;

    return {
      a: Number(a.toFixed(3)),
      b: Number(b.toFixed(3)),
      c: Number(c.toFixed(3)),
      angleA: Number(angleADeg.toFixed(2)),
      angleB: Number(angleBDeg.toFixed(2)),
      area: Number(area.toFixed(3)),
      perimeter: Number(perimeter.toFixed(3)),
    };
  }, [sideA, sideB]);

  const copyResult = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Sub-tabs: Functions vs Triangle Solver */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'functions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bảng tính Sin / Cos / Tan
          </button>
          <button
            onClick={() => setActiveTab('triangle_solver')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'triangle_solver' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Giải tam giác vuông trực quan
          </button>
          <button
            onClick={() => setActiveTab('waveform_graph')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'waveform_graph' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Đồ thị Sin / Cos / Tan</span>
          </button>
        </div>

        {activeTab === 'functions' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAngleUnit('deg')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                angleUnit === 'deg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Độ (Degrees °)
            </button>
            <button
              onClick={() => setAngleUnit('rad')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                angleUnit === 'rad' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Radian (rad)
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Functions View */}
      {activeTab === 'functions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Nhập góc α ({angleUnit === 'deg' ? 'Độ °' : 'Radian'})
              </label>
              <input
                type="number"
                step={angleUnit === 'deg' ? '1' : '0.01'}
                value={angleInput}
                onChange={(e) => setAngleInput(parseFloat(e.target.value) || 0)}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 text-3xl font-black text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            {/* Quick angle presets */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Góc đặc biệt phổ biến:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[0, 30, 45, 60, 90, 120, 180, 270, 360].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => {
                      setAngleUnit('deg');
                      setAngleInput(deg);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      angleUnit === 'deg' && angleInput === deg ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Hệ thức lượng cơ bản
              </span>
              <p className="text-[11px] leading-relaxed">
                sin²(α) + cos²(α) = 1 &nbsp;|&nbsp; tan(α) × cot(α) = 1 &nbsp;|&nbsp; 1 + tan²(α) = 1 / cos²(α)
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Giá Trị Các Hàm Lượng Giác (α = {angleInput}{angleUnit === 'deg' ? '°' : ' rad'})
                </span>
                {trigValues.isSpecialAngle && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded-full">
                    Góc đặc biệt chuẩn SGK
                  </span>
                )}
              </div>
              <button
                onClick={() => copyResult(`sin(${angleInput}) = ${trigValues.sin.exact || trigValues.sin.decimal}, cos(${angleInput}) = ${trigValues.cos.exact || trigValues.cos.decimal}, tan(${angleInput}) = ${trigValues.tan.exact || trigValues.tan.decimal}`)}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép kết quả'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* sin */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">sin(α)</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-black text-[#10B981] font-mono tracking-tight block">
                    {trigValues.sin.exact || trigValues.sin.decimal}
                  </span>
                  {trigValues.sin.exact && trigValues.sin.exact !== trigValues.sin.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.sin.decimal}
                    </span>
                  )}
                </div>
              </div>

              {/* cos */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">cos(α)</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono tracking-tight block">
                    {trigValues.cos.exact || trigValues.cos.decimal}
                  </span>
                  {trigValues.cos.exact && trigValues.cos.exact !== trigValues.cos.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.cos.decimal}
                    </span>
                  )}
                </div>
              </div>

              {/* tan */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">tan(α)</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-black text-purple-600 font-mono tracking-tight block">
                    {trigValues.tan.exact || trigValues.tan.decimal}
                  </span>
                  {trigValues.tan.exact && trigValues.tan.exact !== trigValues.tan.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.tan.decimal}
                    </span>
                  )}
                </div>
              </div>

              {/* cot */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">cot(α)</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono tracking-tight block">
                    {trigValues.cot.exact || trigValues.cot.decimal}
                  </span>
                  {trigValues.cot.exact && trigValues.cot.exact !== trigValues.cot.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.cot.decimal}
                    </span>
                  )}
                </div>
              </div>

              {/* sec */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">sec(α) = 1/cos</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono tracking-tight block">
                    {trigValues.sec.exact || trigValues.sec.decimal}
                  </span>
                  {trigValues.sec.exact && trigValues.sec.exact !== trigValues.sec.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.sec.decimal}
                    </span>
                  )}
                </div>
              </div>

              {/* csc */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 block">csc(α) = 1/sin</span>
                <div className="mt-1">
                  <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono tracking-tight block">
                    {trigValues.csc.exact || trigValues.csc.decimal}
                  </span>
                  {trigValues.csc.exact && trigValues.csc.exact !== trigValues.csc.decimal && (
                    <span className="text-xs text-slate-400 font-mono block mt-0.5">
                      ≈ {trigValues.csc.decimal}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation Note for Mathematical vs Decimal representations */}
            {trigValues.isSpecialAngle && (
              <div className="p-3 bg-blue-50/90 rounded-xl border border-blue-200/80 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Quy đổi căn thức chính xác trong SGK Toán ({trigValues.specialDegree}°):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-800 pl-1">
                  <div>• cos({trigValues.specialDegree}°) = <strong>{trigValues.cos.exact}</strong> ≈ {trigValues.cos.decimal}</div>
                  <div>• tan({trigValues.specialDegree}°) = <strong>{trigValues.tan.exact}</strong> ≈ {trigValues.tan.decimal}</div>
                  <div>• sin({trigValues.specialDegree}°) = <strong>{trigValues.sin.exact}</strong> ≈ {trigValues.sin.decimal}</div>
                  <div>• cot({trigValues.specialDegree}°) = <strong>{trigValues.cot.exact}</strong> ≈ {trigValues.cot.decimal}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Right-Triangle Solver with Dynamic SVG */}
      {activeTab === 'triangle_solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Nhập kích thước 2 cạnh góc vuông
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cạnh đáy a (Kề)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={sideA}
                onChange={(e) => setSideA(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cạnh đứng b (Đối)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={sideB}
                onChange={(e) => setSideB(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Quick Pythagorean triples */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Bộ 3 số Pythagoras kinh điển:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => { setSideA(3); setSideB(4); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                >
                  3 - 4 - 5
                </button>
                <button
                  type="button"
                  onClick={() => { setSideA(5); setSideB(12); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                >
                  5 - 12 - 13
                </button>
                <button
                  type="button"
                  onClick={() => { setSideA(8); setSideB(15); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                >
                  8 - 15 - 17
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            
            {/* SVG Visual Right Triangle */}
            <div className="h-44 w-full bg-white rounded-xl border border-slate-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
              <svg viewBox="0 0 240 140" className="w-full h-full max-w-xs">
                {/* Right Triangle: vertices at (30, 110), (190, 110), (190, 30) */}
                <polygon
                  points="40,115 200,115 200,25"
                  className="fill-blue-500/10 stroke-blue-600"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Right angle square indicator at (200, 115) */}
                <path
                  d="M 185,115 L 185,100 L 200,100"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />
                {/* Labels */}
                <text x="120" y="130" textAnchor="middle" className="text-[11px] fill-slate-700 font-bold font-mono">
                  a = {triangleData.a}
                </text>
                <text x="210" y="75" textAnchor="start" className="text-[11px] fill-slate-700 font-bold font-mono">
                  b = {triangleData.b}
                </text>
                <text x="110" y="60" textAnchor="middle" className="text-[11px] fill-emerald-600 font-bold font-mono">
                  c = {triangleData.c}
                </text>
                {/* Angle α at bottom left */}
                <text x="55" y="110" className="text-[10px] fill-purple-600 font-bold">
                  {triangleData.angleA}°
                </text>
              </svg>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cạnh huyền (c)</span>
                <span className="text-lg font-black text-[#10B981] font-mono block mt-0.5">
                  {triangleData.c}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Góc đáy A</span>
                <span className="text-lg font-bold text-purple-600 font-mono block mt-0.5">
                  {triangleData.angleA}°
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Diện tích (S)</span>
                <span className="text-lg font-bold text-slate-800 font-mono block mt-0.5">
                  {triangleData.area}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Chu vi (P)</span>
                <span className="text-lg font-bold text-slate-800 font-mono block mt-0.5">
                  {triangleData.perimeter}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 3: Waveform Graph with InteractiveGraphPlotter */}
      {activeTab === 'waveform_graph' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Hàm sóng</label>
              <div className="flex gap-1 bg-slate-200/70 p-1 rounded-xl">
                {(['sin', 'cos', 'tan'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setWaveFunc(fn)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      waveFunc === fn ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {fn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Biên độ (A)</label>
              <input
                type="number"
                step="0.5"
                value={waveAmp}
                onChange={(e) => setWaveAmp(parseFloat(e.target.value) || 1)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Tần số góc (ω)</label>
              <input
                type="number"
                step="0.5"
                value={waveFreq}
                onChange={(e) => setWaveFreq(parseFloat(e.target.value) || 1)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Độ lệch pha φ (rad)</label>
              <input
                type="number"
                step="0.25"
                value={wavePhase}
                onChange={(e) => setWavePhase(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <InteractiveGraphPlotter
            expression={`${waveAmp === 1 ? '' : `${waveAmp}*`}${waveFunc}(${waveFreq === 1 ? '' : `${waveFreq}*`}x ${wavePhase > 0 ? `+ ${wavePhase}` : wavePhase < 0 ? `- ${Math.abs(wavePhase)}` : ''})`}
            title={`Đồ thị sóng y = ${waveAmp === 1 ? '' : waveAmp}${waveFunc}(${waveFreq === 1 ? 'x' : `${waveFreq}x`}${wavePhase ? ` + ${wavePhase}` : ''})`}
            initialXRange={[-Math.PI * 2, Math.PI * 2]}
            initialYRange={waveFunc === 'tan' ? [-5, 5] : [-Math.abs(waveAmp) * 1.5 - 0.5, Math.abs(waveAmp) * 1.5 + 0.5]}
            isTrig={true}
          />
        </div>
      )}

    </div>
  );
};
