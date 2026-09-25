import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, Check, Coins } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'header' | 'inline' | 'compact';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { currency, setCurrency, currencyInfo, currencies } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          id="currency-compact-selector-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="currency-compact-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          title={isVi ? 'Đổi đơn vị tiền tệ' : 'Change Currency'}
        >
          <span>{currencyInfo.flag}</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{currencyInfo.symbol}</span>
          <span className="text-[11px] text-slate-600 dark:text-slate-300">{currencyInfo.code}</span>
          <ChevronDown className={`w-3 h-3 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="currency-compact-dropdown absolute right-0 mt-1.5 w-56 max-h-72 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            <div className="px-2.5 py-1 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
              {isVi ? 'Chọn tiền tệ (Gốc: $ USD)' : 'Select Currency (Base: $ USD)'}
            </div>
            {currencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`currency-option-btn w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{curr.flag}</span>
                    <div>
                      <span className={`currency-code-text font-bold mr-1.5 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{curr.code}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">({curr.symbol})</span>
                      <div className="currency-subtext text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {isVi ? curr.nameVi : curr.nameEn}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {currencies.map((curr) => {
          const isSelected = curr.code === currency;
          return (
            <button
              key={curr.code}
              type="button"
              onClick={() => handleSelect(curr.code)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700/60'
              }`}
            >
              <span>{curr.flag}</span>
              <span className="font-mono">{curr.symbol}</span>
              <span className="text-[11px] opacity-80">{curr.code}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'header' variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        id="header-currency-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Currency"
        className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <span className="text-sm leading-none">{currencyInfo.flag}</span>
        <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{currencyInfo.symbol}</span>
        <span className="text-[11px] text-slate-600 dark:text-slate-300 hidden sm:inline">{currencyInfo.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          id="header-currency-dropdown"
          className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 shadow-2xl z-50 p-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isVi ? 'Đơn vị tiền tệ (Gốc: $ USD)' : 'Currency (Base: $ USD)'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              13 Quốc gia
            </span>
          </div>

          <div className="space-y-0.5">
            {currencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  id={`currency-option-${curr.code}`}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                    isSelected 
                      ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base shrink-0">{curr.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{curr.code}</span>
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          ({curr.symbol})
                        </span>
                        {curr.code === 'USD' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 font-medium">
                            {isVi ? 'Gốc' : 'Base'}
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] truncate max-w-[150px] ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {isVi ? curr.nameVi : curr.nameEn}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
