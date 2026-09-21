import React, { useState, useMemo, useEffect } from 'react';
import {
  Coins,
  RotateCcw,
  ArrowRightLeft,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';

interface CurrencyRateData {
  name: string;
  nameEn: string;
  symbol: string;
  rate: number; // units per 1 USD
  flag: string;
}

const RATES_TO_USD: Record<string, CurrencyRateData> = {
  USD: { name: 'Đô la Mỹ', nameEn: 'US Dollar', symbol: '$', rate: 1, flag: '🇺🇸' },
  EUR: { name: 'Đồng Euro', nameEn: 'Euro', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  GBP: { name: 'Bảng Anh', nameEn: 'British Pound', symbol: '£', rate: 0.79, flag: '🇬🇧' },
  JPY: { name: 'Yên Nhật', nameEn: 'Japanese Yen', symbol: '¥', rate: 155.4, flag: '🇯🇵' },
  CAD: { name: 'Đô la Canada', nameEn: 'Canadian Dollar', symbol: 'C$', rate: 1.37, flag: '🇨🇦' },
  AUD: { name: 'Đô la Úc', nameEn: 'Australian Dollar', symbol: 'A$', rate: 1.52, flag: '🇦🇺' },
  CHF: { name: 'Franc Thụy Sĩ', nameEn: 'Swiss Franc', symbol: 'CHF', rate: 0.91, flag: '🇨🇭' },
  CNY: { name: 'Nhân dân tệ', nameEn: 'Chinese Yuan', symbol: '¥', rate: 7.24, flag: '🇨🇳' },
  SGD: { name: 'Đô la Singapore', nameEn: 'Singapore Dollar', symbol: 'S$', rate: 1.35, flag: '🇸🇬' },
  KRW: { name: 'Won Hàn Quốc', nameEn: 'South Korean Won', symbol: '₩', rate: 1380, flag: '🇰🇷' },
  VND: { name: 'Việt Nam Đồng', nameEn: 'Vietnamese Dong', symbol: '₫', rate: 25450, flag: '🇻🇳' },
  THB: { name: 'Baht Thái', nameEn: 'Thai Baht', symbol: '฿', rate: 36.8, flag: '🇹🇭' },
  INR: { name: 'Rupee Ấn Độ', nameEn: 'Indian Rupee', symbol: '₹', rate: 83.5, flag: '🇮🇳' },
  HKD: { name: 'Đô la Hồng Kông', nameEn: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82, flag: '🇭🇰' },
  BRL: { name: 'Real Brazil', nameEn: 'Brazilian Real', symbol: 'R$', rate: 5.45, flag: '🇧🇷' },
  MXN: { name: 'Peso Mexico', nameEn: 'Mexican Peso', symbol: 'Mex$', rate: 18.2, flag: '🇲🇽' }
};

export const CurrencyConverter: React.FC = () => {
  const { currency } = useCurrency();

  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>(() => {
    return currency !== 'USD' && RATES_TO_USD[currency] ? currency : 'EUR';
  });

  // Keep target currency in sync if user changes global currency
  useEffect(() => {
    if (currency !== fromCurr && RATES_TO_USD[currency]) {
      setToCurr(currency);
    }
  }, [currency, fromCurr]);

  const converted = useMemo(() => {
    const fromRate = RATES_TO_USD[fromCurr]?.rate || 1;
    const toRate = RATES_TO_USD[toCurr]?.rate || 1;

    // Convert fromCurr to USD base, then USD to toCurr
    const inUSD = amount / fromRate;
    return inUSD * toRate;
  }, [amount, fromCurr, toCurr]);

  const exchangeRateInfo = useMemo(() => {
    const fromRate = RATES_TO_USD[fromCurr]?.rate || 1;
    const toRate = RATES_TO_USD[toCurr]?.rate || 1;
    const rate1Unit = (1 / fromRate) * toRate;
    const reverseRate = (1 / toRate) * fromRate;
    return { rate1Unit, reverseRate };
  }, [fromCurr, toCurr]);

  const allConverted = useMemo(() => {
    const fromRate = RATES_TO_USD[fromCurr]?.rate || 1;
    const inUSD = amount / fromRate;
    return Object.entries(RATES_TO_USD).map(([code, data]) => ({
      code,
      name: data.name,
      symbol: data.symbol,
      flag: data.flag,
      rate: data.rate,
      val: inUSD * data.rate
    }));
  }, [amount, fromCurr]);

  const handleSwap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const handleReset = () => {
    setAmount(100);
    setFromCurr('USD');
    setToCurr(currency !== 'USD' && RATES_TO_USD[currency] ? currency : 'EUR');
  };

  const formatNumberWithDecimals = (val: number, maxDecimals = 2) => {
    if (val >= 1000) {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDecimals }).format(val);
    }
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(val);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Currency Converter – Chuyển Đổi Ngoại Tệ Quốc Tế</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tỷ giá tham chiếu chuẩn quốc tế (USD Base) giữa hơn 16 đồng tiền phổ biến toàn cầu</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="curr-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Số tiền chuyển đổi</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{RATES_TO_USD[fromCurr]?.symbol}</span>
              <input
                id="curr-val-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans text-lg font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              id="curr-from-select"
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {Object.entries(RATES_TO_USD).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.flag} {code} - {item.name} ({item.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex justify-center">
            <button
              id="curr-swap-btn"
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-blue-400 hover:text-white transition-all cursor-pointer shadow-md"
              title="Đảo chiều ngoại tệ"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-3 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Quy đổi tương đương</label>
            <div className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-emerald-400 font-bold font-sans text-xl tabular-nums truncate flex items-center justify-between">
              <span>{formatNumberWithDecimals(converted, toCurr === 'VND' || toCurr === 'JPY' || toCurr === 'KRW' ? 0 : 2)}</span>
              <span className="text-sm font-semibold text-slate-300">{RATES_TO_USD[toCurr]?.symbol} {toCurr}</span>
            </div>
            <select
              id="curr-to-select"
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {Object.entries(RATES_TO_USD).map(([code, item]) => (
                <option key={code} value={code}>
                  {item.flag} {code} - {item.name} ({item.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live exchange rate display */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>
              1 {fromCurr} = <strong className="text-white font-sans">{formatNumberWithDecimals(exchangeRateInfo.rate1Unit, 4)} {toCurr}</strong>
            </span>
          </div>
          <div className="text-slate-400">
            1 {toCurr} = <strong className="text-slate-200 font-sans">{formatNumberWithDecimals(exchangeRateInfo.reverseRate, 4)} {fromCurr}</strong>
          </div>
        </div>

        {/* Global Multi-Currency Grid */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Bảng quy đổi tương đương các đồng tiền chính toàn cầu
            </h3>
            <span className="text-[11px] text-slate-400">Gốc: {amount.toLocaleString()} {fromCurr}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {allConverted.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setToCurr(item.code)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  toCurr === item.code
                    ? 'bg-blue-950/50 border-blue-500/50 ring-1 ring-blue-400/30'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{item.flag}</span>
                    <span>{item.code}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">{item.symbol}</span>
                </div>
                <div className="text-sm font-bold text-emerald-400 font-sans tabular-nums truncate">
                  {formatNumberWithDecimals(item.val, item.code === 'VND' || item.code === 'JPY' || item.code === 'KRW' ? 0 : 2)}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{item.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
