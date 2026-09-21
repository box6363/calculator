import React, { useState, useMemo, useEffect } from 'react';
import {
  Tag,
  Check,
  Copy
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

export const DiscountCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  // Base price in current currency (Base = $100 USD)
  const [originalPrice, setOriginalPrice] = useState<number>(() => {
    return currency === 'VND' ? 500000 : 100;
  });
  const [discountPercent, setDiscountPercent] = useState<number>(30);
  const [extraDiscountPercent, setExtraDiscountPercent] = useState<number>(10);
  const [enableExtraDiscount, setEnableExtraDiscount] = useState<boolean>(false);
  const taxPercent = 0;
  const [copied, setCopied] = useState<boolean>(false);

  // Sync default price when switching between VND and international
  useEffect(() => {
    setOriginalPrice((prev) => {
      if (currency === 'VND' && prev < 1000) return 500000;
      if (currency !== 'VND' && prev >= 10000) return 100;
      return prev;
    });
  }, [currency]);

  const calculations = useMemo(() => {
    // 1. First discount
    const firstDiscountAmount = (originalPrice * discountPercent) / 100;
    const priceAfterFirst = originalPrice - firstDiscountAmount;

    // 2. Extra discount (stacked on discounted price)
    let extraDiscountAmount = 0;
    if (enableExtraDiscount) {
      extraDiscountAmount = (priceAfterFirst * extraDiscountPercent) / 100;
    }
    const priceAfterDiscounts = priceAfterFirst - extraDiscountAmount;

    // 3. Tax / VAT
    const taxAmount = (priceAfterDiscounts * taxPercent) / 100;
    const finalPrice = Math.round(priceAfterDiscounts + taxAmount);

    const totalSavings = Math.round(originalPrice - priceAfterDiscounts);
    const effectiveDiscountPercent = originalPrice > 0 
      ? Number(((totalSavings / originalPrice) * 100).toFixed(1)) 
      : 0;

    return {
      firstDiscountAmount: Math.round(firstDiscountAmount),
      extraDiscountAmount: Math.round(extraDiscountAmount),
      taxAmount: Math.round(taxAmount),
      finalPrice,
      totalSavings,
      effectiveDiscountPercent
    };
  }, [originalPrice, discountPercent, extraDiscountPercent, enableExtraDiscount, taxPercent]);

  const handleCopy = () => {
    const text = `Tính giá khuyến mãi:
- Giá gốc: ${formatMoney(originalPrice)}
- Mức giảm giá: ${discountPercent}% ${enableExtraDiscount ? `+ giảm thêm ${extraDiscountPercent}%` : ''}
- Số tiền tiết kiệm: ${formatMoney(calculations.totalSavings)} (giảm ${calculations.effectiveDiscountPercent}%)
- Giá thực tế phải trả: ${formatMoney(calculations.finalPrice)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pricePresets = useMemo(() => {
    if (currency === 'VND') {
      return [
        { label: '100k', val: 100000 },
        { label: '250k', val: 250000 },
        { label: '500k', val: 500000 },
        { label: '1 Triệu', val: 1000000 },
        { label: '2 Triệu', val: 2000000 },
      ];
    }
    return [
      { label: `${currencyInfo.symbol}25`, val: 25 },
      { label: `${currencyInfo.symbol}50`, val: 50 },
      { label: `${currencyInfo.symbol}100`, val: 100 },
      { label: `${currencyInfo.symbol}250`, val: 250 },
      { label: `${currencyInfo.symbol}500`, val: 500 },
    ];
  }, [currency, currencyInfo.symbol]);

  return (
    <div id="discount-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Discount Calculator (Tính Giảm Giá)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính toán giá sau giảm, chiết khấu kép (mã voucher thêm) và số tiền thực tế bạn tiết kiệm được.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          {/* 1. Original Price */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Giá niêm yết ban đầu ({currencyInfo.symbol} {currencyInfo.code})
              </label>
              <span className="text-xs font-bold text-pink-600 font-mono">
                {formatMoney(originalPrice)}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                type="number"
                min={0}
                step={currency === 'VND' ? 10000 : 5}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-14 py-2.5 bg-white border border-slate-300 rounded-2xl text-lg font-black text-slate-900 focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-bold text-xs">{currencyInfo.code}</span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pt-1">
              {pricePresets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setOriginalPrice(p.val)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    originalPrice === p.val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Primary Discount Percent */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mức giảm giá chính
              </label>
              <span className="text-sm font-black text-slate-900 font-mono">
                {discountPercent}%
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={99}
              step={1}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[10, 20, 30, 50, 70].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDiscountPercent(p)}
                  className={`py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                    discountPercent === p ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Extra Voucher Stack */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Áp dụng thêm mã giảm giá thứ 2 (Voucher / Thẻ thành viên)
              </span>
              <input
                type="checkbox"
                checked={enableExtraDiscount}
                onChange={(e) => setEnableExtraDiscount(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 accent-pink-600 cursor-pointer"
              />
            </label>

            {enableExtraDiscount && (
              <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Giảm thêm:</span>
                  <span className="text-xs font-bold text-purple-600 font-mono">{extraDiscountPercent}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 15, 20].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setExtraDiscountPercent(p)}
                      className={`py-1.5 text-xs rounded-xl font-bold cursor-pointer transition-all ${
                        extraDiscountPercent === p ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Price Card */}
          <div className="hero-result-card bg-white dark:bg-gradient-to-br dark:from-pink-900 dark:via-slate-900 dark:to-rose-950 p-6 rounded-3xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
                Giá thực tế phải trả (Final Price)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                Tiết kiệm {calculations.effectiveDiscountPercent}%
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formatMoney(calculations.finalPrice)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-xs flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Số tiền bạn tiết kiệm được:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm font-mono">
                {formatMoney(calculations.totalSavings)}
              </span>
            </div>
          </div>

          {/* Breakdown stats */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Chi tiết các khoản giảm
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600">Giá niêm yết ban đầu:</span>
                <span className="font-bold text-slate-800 font-mono">{formatMoney(originalPrice)}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600">Giảm đợt 1 ({discountPercent}%):</span>
                <span className="font-bold text-pink-600 font-mono">-{formatMoney(calculations.firstDiscountAmount)}</span>
              </div>
              {enableExtraDiscount && (
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-600">Voucher bổ sung ({extraDiscountPercent}%):</span>
                  <span className="font-bold text-purple-600 font-mono">-{formatMoney(calculations.extraDiscountAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
