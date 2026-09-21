import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Tag,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

type PercentMode = 'percent_of' | 'is_what_percent' | 'change' | 'discount';

export const PercentageCalculator: React.FC = () => {
  const [activeMode, setActiveMode] = useState<PercentMode>('percent_of');
  const [copied, setCopied] = useState<boolean>(false);

  // Mode 1: What is X% of Y?
  const [m1Percent, setM1Percent] = useState<number>(25);
  const [m1Total, setM1Total] = useState<number>(480000);

  // Mode 2: X is what % of Y?
  const [m2Part, setM2Part] = useState<number>(120000);
  const [m2Total, setM2Total] = useState<number>(480000);

  // Mode 3: % Increase / Decrease from X to Y
  const [m3From, setM3From] = useState<number>(500000);
  const [m3To, setM3To] = useState<number>(650000);

  // Mode 4: Discount & Tax
  const [m4Price, setM4Price] = useState<number>(1200000);
  const [m4Discount, setM4Discount] = useState<number>(15);
  const [m4Tax, setM4Tax] = useState<number>(8); // 8% VAT

  // Calculations
  const m1Result = useMemo(() => {
    return (m1Percent / 100) * m1Total;
  }, [m1Percent, m1Total]);

  const m2Result = useMemo(() => {
    if (m2Total === 0) return 0;
    return Number(((m2Part / m2Total) * 100).toFixed(2));
  }, [m2Part, m2Total]);

  const m3Result = useMemo(() => {
    if (m3From === 0) return { percent: 0, isIncrease: true, diff: 0 };
    const diff = m3To - m3From;
    const pct = Number(((diff / m3From) * 100).toFixed(2));
    return {
      percent: Math.abs(pct),
      isIncrease: diff >= 0,
      diff: Math.abs(diff),
    };
  }, [m3From, m3To]);

  const m4Result = useMemo(() => {
    const discountAmount = (m4Price * m4Discount) / 100;
    const priceAfterDiscount = m4Price - discountAmount;
    const taxAmount = (priceAfterDiscount * m4Tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    return {
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
    };
  }, [m4Price, m4Discount, m4Tax]);

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val * 100) / 100);
  };

  const copyResult = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 4 Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveMode('percent_of')}
          className={`py-2.5 px-2 text-xs font-semibold rounded-xl transition-all ${
            activeMode === 'percent_of' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          X% của Y là gì?
        </button>

        <button
          onClick={() => setActiveMode('is_what_percent')}
          className={`py-2.5 px-2 text-xs font-semibold rounded-xl transition-all ${
            activeMode === 'is_what_percent' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          X là bao nhiêu % của Y?
        </button>

        <button
          onClick={() => setActiveMode('change')}
          className={`py-2.5 px-2 text-xs font-semibold rounded-xl transition-all ${
            activeMode === 'change' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          % Tăng / Giảm
        </button>

        <button
          onClick={() => setActiveMode('discount')}
          className={`py-2.5 px-2 text-xs font-semibold rounded-xl transition-all ${
            activeMode === 'discount' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Giảm giá & Thuế
        </button>
      </div>

      {/* Mode 1: What is X% of Y? */}
      {activeMode === 'percent_of' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Tính giá trị khi biết phần trăm
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phần trăm (%)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={m1Percent}
                  onChange={(e) => setM1Percent(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
                />
                <span className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold text-slate-700">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Của tổng số (Y)</label>
              <input
                type="number"
                value={m1Total}
                onChange={(e) => setM1Total(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5, 10, 15, 20, 25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setM1Percent(pct)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    m1Percent === pct ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kết quả tính toán</span>
                <button
                  onClick={() => copyResult(`${m1Percent}% của ${formatNumber(m1Total)} = ${formatNumber(m1Result)}`)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="mt-3">
                <span className="text-xs text-slate-500 block mb-1">
                  {m1Percent}% của {formatNumber(m1Total)} là:
                </span>
                <span className="text-4xl sm:text-5xl font-black text-[#10B981] font-mono tracking-tight">
                  {formatNumber(m1Result)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 mt-4 font-mono">
              Công thức: ({m1Percent} ÷ 100) × {formatNumber(m1Total)} = <strong>{formatNumber(m1Result)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: X is what % of Y? */}
      {activeMode === 'is_what_percent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Tính tỷ lệ phần trăm giữa hai số
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Số thành phần (X)</label>
              <input
                type="number"
                value={m2Part}
                onChange={(e) => setM2Part(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Là bao nhiêu % của tổng số (Y)?</label>
              <input
                type="number"
                value={m2Total}
                onChange={(e) => setM2Total(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kết quả tỷ lệ</span>
                <button
                  onClick={() => copyResult(`${m2Part} chiếm ${m2Result}% của ${m2Total}`)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="mt-3">
                <span className="text-xs text-slate-500 block mb-1">
                  {formatNumber(m2Part)} chiếm:
                </span>
                <span className="text-4xl sm:text-5xl font-black text-[#3B82F6] font-mono tracking-tight">
                  {m2Result}%
                </span>
                <span className="text-xs text-slate-500 block mt-1">trong tổng số {formatNumber(m2Total)}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 mt-4 font-mono">
              Công thức: ({formatNumber(m2Part)} ÷ {formatNumber(m2Total)}) × 100 = <strong>{m2Result}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Increase / Decrease */}
      {activeMode === 'change' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Tính phần trăm tăng trưởng hoặc sụt giảm
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Giá trị ban đầu (X)</label>
              <input
                type="number"
                value={m3From}
                onChange={(e) => setM3From(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Giá trị sau khi đổi (Y)</label>
              <input
                type="number"
                value={m3To}
                onChange={(e) => setM3To(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mức độ thay đổi</span>
                <button
                  onClick={() => copyResult(`Thay đổi từ ${m3From} sang ${m3To}: ${m3Result.isIncrease ? 'Tăng' : 'Giảm'} ${m3Result.percent}%`)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${m3Result.isIncrease ? 'bg-emerald-100 text-[#10B981]' : 'bg-rose-100 text-rose-600'}`}>
                    {m3Result.isIncrease ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-600">
                    {m3Result.isIncrease ? 'TĂNG TRƯỞNG' : 'SỤT GIẢM'}
                  </span>
                </div>

                <div className="mt-2">
                  <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                    m3Result.isIncrease ? 'text-[#10B981]' : 'text-rose-600'
                  }`}>
                    {m3Result.isIncrease ? '+' : '-'}{m3Result.percent}%
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Chênh lệch: {m3Result.isIncrease ? '+' : '-'}{formatNumber(m3Result.diff)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 mt-4 font-mono">
              Công thức: [({formatNumber(m3To)} – {formatNumber(m3From)}) ÷ {formatNumber(m3From)}] × 100
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Discount & Tax */}
      {activeMode === 'discount' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-150">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Máy tính giá khuyến mãi & thuế VAT</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Giá gốc ban đầu (VNĐ)</label>
              <input
                type="number"
                step="10000"
                value={m4Price}
                onChange={(e) => setM4Price(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-lg font-bold text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">% Giảm giá (Sale)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={m4Discount}
                    onChange={(e) => setM4Discount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="w-10 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold text-slate-700 text-xs">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">% Thuế VAT</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={m4Tax}
                    onChange={(e) => setM4Tax(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 outline-none"
                  />
                  <span className="w-10 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold text-slate-700 text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Quick sale chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[10, 15, 20, 30, 50, 70].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setM4Discount(d)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    m4Discount === d ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Giảm {d}%
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Giá thanh toán cuối cùng</span>
                <button
                  onClick={() => copyResult(`Giá thanh toán: ${formatNumber(m4Result.finalPrice)} đ (Tiết kiệm ${formatNumber(m4Result.discountAmount)} đ)`)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div className="mt-3">
                <span className="text-4xl sm:text-5xl font-black text-[#10B981] font-mono tracking-tight">
                  {formatNumber(m4Result.finalPrice)}
                </span>
                <span className="text-base font-semibold text-slate-600 ml-1">VNĐ</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Số tiền được giảm:</span>
                <span className="font-bold text-emerald-600 font-mono">
                  -{formatNumber(m4Result.discountAmount)} VNĐ ({m4Discount}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Giá sau giảm (chưa thuế):</span>
                <span className="font-bold text-slate-800 font-mono">
                  {formatNumber(m4Result.priceAfterDiscount)} VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Tiền thuế VAT ({m4Tax}%):</span>
                <span className="font-bold text-slate-800 font-mono">
                  +{formatNumber(m4Result.taxAmount)} VNĐ
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
