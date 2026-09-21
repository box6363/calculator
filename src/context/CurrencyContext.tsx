import React, { createContext, useContext, useState, useMemo } from 'react';

export type CurrencyCode = 
  | 'USD' 
  | 'EUR' 
  | 'GBP' 
  | 'JPY' 
  | 'VND' 
  | 'CAD' 
  | 'AUD' 
  | 'SGD' 
  | 'CHF' 
  | 'CNY' 
  | 'INR' 
  | 'KRW' 
  | 'THB';

export interface CurrencyItem {
  code: CurrencyCode;
  symbol: string;
  nameEn: string;
  nameVi: string;
  flag: string;
  rateToUSD: number; // e.g. 1 USD = rateToUSD [Code]
  decimals: number;
  symbolPosition: 'prefix' | 'suffix';
}

export const SUPPORTED_CURRENCIES: CurrencyItem[] = [
  {
    code: 'USD',
    symbol: '$',
    nameEn: 'US Dollar',
    nameVi: 'Đô la Mỹ (USD)',
    flag: '🇺🇸',
    rateToUSD: 1.0,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'EUR',
    symbol: '€',
    nameEn: 'Euro',
    nameVi: 'Đồng Euro (EUR)',
    flag: '🇪🇺',
    rateToUSD: 0.92,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'GBP',
    symbol: '£',
    nameEn: 'British Pound',
    nameVi: 'Bảng Anh (GBP)',
    flag: '🇬🇧',
    rateToUSD: 0.79,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'JPY',
    symbol: '¥',
    nameEn: 'Japanese Yen',
    nameVi: 'Yên Nhật (JPY)',
    flag: '🇯🇵',
    rateToUSD: 155.4,
    decimals: 0,
    symbolPosition: 'prefix',
  },
  {
    code: 'VND',
    symbol: '₫',
    nameEn: 'Vietnamese Dong',
    nameVi: 'Việt Nam Đồng (VND)',
    flag: '🇻🇳',
    rateToUSD: 25450,
    decimals: 0,
    symbolPosition: 'suffix',
  },
  {
    code: 'CAD',
    symbol: 'C$',
    nameEn: 'Canadian Dollar',
    nameVi: 'Đô la Canada (CAD)',
    flag: '🇨🇦',
    rateToUSD: 1.37,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'AUD',
    symbol: 'A$',
    nameEn: 'Australian Dollar',
    nameVi: 'Đô la Úc (AUD)',
    flag: '🇦🇺',
    rateToUSD: 1.52,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'SGD',
    symbol: 'S$',
    nameEn: 'Singapore Dollar',
    nameVi: 'Đô la Singapore (SGD)',
    flag: '🇸🇬',
    rateToUSD: 1.35,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'CHF',
    symbol: 'CHF',
    nameEn: 'Swiss Franc',
    nameVi: 'Franc Thụy Sĩ (CHF)',
    flag: '🇨🇭',
    rateToUSD: 0.90,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'CNY',
    symbol: '¥',
    nameEn: 'Chinese Yuan',
    nameVi: 'Nhân dân tệ (CNY)',
    flag: '🇨🇳',
    rateToUSD: 7.23,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'INR',
    symbol: '₹',
    nameEn: 'Indian Rupee',
    nameVi: 'Rupee Ấn Độ (INR)',
    flag: '🇮🇳',
    rateToUSD: 83.5,
    decimals: 2,
    symbolPosition: 'prefix',
  },
  {
    code: 'KRW',
    symbol: '₩',
    nameEn: 'South Korean Won',
    nameVi: 'Won Hàn Quốc (KRW)',
    flag: '🇰🇷',
    rateToUSD: 1380,
    decimals: 0,
    symbolPosition: 'prefix',
  },
  {
    code: 'THB',
    symbol: '฿',
    nameEn: 'Thai Baht',
    nameVi: 'Baht Thái (THB)',
    flag: '🇹🇭',
    rateToUSD: 36.8,
    decimals: 2,
    symbolPosition: 'prefix',
  }
];

export const CURRENCIES_BY_CODE: Record<CurrencyCode, CurrencyItem> = SUPPORTED_CURRENCIES.reduce(
  (acc, item) => {
    acc[item.code] = item;
    return acc;
  },
  {} as Record<CurrencyCode, CurrencyItem>
);

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyInfo: CurrencyItem;
  currencies: CurrencyItem[];
  formatMoney: (amount: number, customDecimals?: number) => string;
  convertFromUSD: (usdAmount: number) => number;
  convertToUSD: (amountInCurrent: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // GỐC LÀ USD ($) - International Base
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window === 'undefined') return 'USD';
    try {
      const urlParam = new URLSearchParams(window.location.search).get('currency')?.toUpperCase() as CurrencyCode;
      if (urlParam && CURRENCIES_BY_CODE[urlParam]) {
        return urlParam;
      }
      const saved = localStorage.getItem('ac_calc_base_currency') as CurrencyCode;
      if (saved && CURRENCIES_BY_CODE[saved]) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES_BY_CODE[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('ac_calc_base_currency', code);
      } catch {
        // ignore
      }
    }
  };

  const currencyInfo = useMemo(() => {
    return CURRENCIES_BY_CODE[currency] || CURRENCIES_BY_CODE.USD;
  }, [currency]);

  // Convert functions
  const convertFromUSD = (usdAmount: number): number => {
    return usdAmount * currencyInfo.rateToUSD;
  };

  const convertToUSD = (amountInCurrent: number): number => {
    return currencyInfo.rateToUSD > 0 ? amountInCurrent / currencyInfo.rateToUSD : amountInCurrent;
  };

  // High precision & beautiful money formatting based on selected currency
  const formatMoney = (amount: number, customDecimals?: number): string => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return currencyInfo.symbolPosition === 'suffix' ? `0 ${currencyInfo.symbol}` : `${currencyInfo.symbol}0`;
    }

    const decimals = customDecimals !== undefined ? customDecimals : currencyInfo.decimals;

    // Use Intl.NumberFormat for the current currency
    const isNegative = amount < 0;
    const absVal = Math.abs(amount);

    let formattedNum: string;
    if (currencyInfo.code === 'VND') {
      formattedNum = new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(Math.round(absVal));
      return isNegative ? `-${formattedNum} ₫` : `${formattedNum} ₫`;
    } else if (currencyInfo.code === 'EUR') {
      formattedNum = new Intl.NumberFormat('de-DE', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(absVal);
      return isNegative ? `-€${formattedNum}` : `€${formattedNum}`;
    } else {
      formattedNum = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(absVal);

      if (currencyInfo.symbolPosition === 'suffix') {
        return isNegative ? `-${formattedNum} ${currencyInfo.symbol}` : `${formattedNum} ${currencyInfo.symbol}`;
      } else {
        return isNegative ? `-${currencyInfo.symbol}${formattedNum}` : `${currencyInfo.symbol}${formattedNum}`;
      }
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyInfo,
        currencies: SUPPORTED_CURRENCIES,
        formatMoney,
        convertFromUSD,
        convertToUSD,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
};
