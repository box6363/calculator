import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Wifi, 
  Home, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Printer, 
  Copy, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Minus, 
  PieChart, 
  ArrowRight,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Coins
} from 'lucide-react';
import { useCurrency, CurrencyCode } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

// Preset standard profiles in user-requested order
export type StandardCountry = 'US' | 'EU' | 'JP' | 'KR' | 'VN' | 'CUSTOM';

interface CountryPreset {
  id: StandardCountry;
  name: string;
  currencyCode: CurrencyCode;
  unitWater: 'm³' | 'kGal';
  unitGas: 'bình' | 'm³' | 'Therms';
  // Default values in native preset currency
  defaultElectricityKwh: number;
  defaultElectricityRate: number; // Flat rate fallback
  isTieredElectricity: boolean;
  electricityTiers: { maxKwh: number; rate: number; label: string }[];
  electricityVatRate: number; // %
  electricityFixedFee: number;
  
  defaultWaterUsage: number;
  waterRate: number;
  isTieredWater: boolean;
  waterTiers: { maxM3PerPerson: number; rate: number; label: string }[];
  sewerFeeRate: number; // % or flat
  waterVatRate: number; // %
  
  gasMode: 'cylinder' | 'piped' | 'none';
  cylinderPrice: number;
  cylinderMonths: number;
  pipedGasUsage: number;
  pipedGasRate: number;
  
  internetFee: number;
  tvFee: number;
  mobilePlanPrice: number;
  mobileLinesCount: number;
  
  managementFee: number;
  parkingFee: number;
  rentFee: number;
  foodFee: number;
}

const COUNTRY_PRESETS: Record<StandardCountry, CountryPreset> = {
  US: {
    id: 'US',
    name: 'Hoa Kỳ (EIA & CCF/Gal)',
    currencyCode: 'USD',
    unitWater: 'kGal',
    unitGas: 'Therms',
    defaultElectricityKwh: 850,
    defaultElectricityRate: 0.165,
    isTieredElectricity: true,
    electricityTiers: [
      { maxKwh: 400, rate: 0.135, label: 'Tier 1 (0 - 400 kWh)' },
      { maxKwh: 800, rate: 0.175, label: 'Tier 2 (401 - 800 kWh)' },
      { maxKwh: Infinity, rate: 0.225, label: 'Tier 3 (> 800 kWh)' },
    ],
    electricityVatRate: 6.5,
    electricityFixedFee: 14.50,
    defaultWaterUsage: 7, // 7k gallons
    waterRate: 6.20,
    isTieredWater: false,
    waterTiers: [],
    sewerFeeRate: 65,
    waterVatRate: 0,
    gasMode: 'piped',
    cylinderPrice: 45,
    cylinderMonths: 1,
    pipedGasUsage: 45,
    pipedGasRate: 1.42,
    internetFee: 65,
    tvFee: 35,
    mobilePlanPrice: 40,
    mobileLinesCount: 2,
    managementFee: 180,
    parkingFee: 50,
    rentFee: 1650,
    foodFee: 600,
  },
  EU: {
    id: 'EU',
    name: 'Châu Âu (Standing Charge & m³)',
    currencyCode: 'EUR',
    unitWater: 'm³',
    unitGas: 'm³',
    defaultElectricityKwh: 320,
    defaultElectricityRate: 0.285,
    isTieredElectricity: false,
    electricityTiers: [],
    electricityVatRate: 5,
    electricityFixedFee: 16.50,
    defaultWaterUsage: 12,
    waterRate: 2.10,
    isTieredWater: false,
    waterTiers: [],
    sewerFeeRate: 70,
    waterVatRate: 5,
    gasMode: 'piped',
    cylinderPrice: 38,
    cylinderMonths: 1.5,
    pipedGasUsage: 60,
    pipedGasRate: 0.95,
    internetFee: 38,
    tvFee: 15,
    mobilePlanPrice: 20,
    mobileLinesCount: 2,
    managementFee: 120,
    parkingFee: 60,
    rentFee: 950,
    foodFee: 420,
  },
  JP: {
    id: 'JP',
    name: 'Nhật Bản (TEPCO & Tokyo Gas)',
    currencyCode: 'JPY',
    unitWater: 'm³',
    unitGas: 'm³',
    defaultElectricityKwh: 300,
    defaultElectricityRate: 35,
    isTieredElectricity: true,
    electricityTiers: [
      { maxKwh: 120, rate: 29.8, label: 'Bậc 1 (0 - 120 kWh)' },
      { maxKwh: 300, rate: 36.4, label: 'Bậc 2 (121 - 300 kWh)' },
      { maxKwh: Infinity, rate: 40.5, label: 'Bậc 3 (> 300 kWh)' },
    ],
    electricityVatRate: 10,
    electricityFixedFee: 1180,
    defaultWaterUsage: 18,
    waterRate: 190,
    isTieredWater: false,
    waterTiers: [],
    sewerFeeRate: 85,
    waterVatRate: 10,
    gasMode: 'piped',
    cylinderPrice: 6500,
    cylinderMonths: 1.5,
    pipedGasUsage: 25,
    pipedGasRate: 155,
    internetFee: 5200,
    tvFee: 1800,
    mobilePlanPrice: 3200,
    mobileLinesCount: 2,
    managementFee: 8500,
    parkingFee: 12000,
    rentFee: 78000,
    foodFee: 55000,
  },
  KR: {
    id: 'KR',
    name: 'Hàn Quốc (KEPCO 3 Bậc & Gas Sưởi Ondol)',
    currencyCode: 'KRW',
    unitWater: 'm³',
    unitGas: 'm³',
    defaultElectricityKwh: 310,
    defaultElectricityRate: 214,
    isTieredElectricity: true,
    electricityTiers: [
      { maxKwh: 200, rate: 120, label: 'Bậc 1 (0 - 200 kWh)' },
      { maxKwh: 400, rate: 214, label: 'Bậc 2 (201 - 400 kWh)' },
      { maxKwh: Infinity, rate: 307, label: 'Bậc 3 (> 400 kWh)' },
    ],
    electricityVatRate: 10,
    electricityFixedFee: 1600,
    defaultWaterUsage: 14,
    waterRate: 650,
    isTieredWater: false,
    waterTiers: [],
    sewerFeeRate: 80,
    waterVatRate: 0,
    gasMode: 'piped',
    cylinderPrice: 45000,
    cylinderMonths: 1,
    pipedGasUsage: 35,
    pipedGasRate: 1050,
    internetFee: 33000,
    tvFee: 12000,
    mobilePlanPrice: 45000,
    mobileLinesCount: 2,
    managementFee: 150000,
    parkingFee: 30000,
    rentFee: 650000,
    foodFee: 500000,
  },
  VN: {
    id: 'VN',
    name: 'Việt Nam (EVN 6 Bậc & Định Mức Nước)',
    currencyCode: 'VND',
    unitWater: 'm³',
    unitGas: 'bình',
    defaultElectricityKwh: 280,
    defaultElectricityRate: 2600,
    isTieredElectricity: true,
    electricityTiers: [
      { maxKwh: 50, rate: 1893, label: 'Bậc 1 (0 - 50 kWh)' },
      { maxKwh: 100, rate: 1956, label: 'Bậc 2 (51 - 100 kWh)' },
      { maxKwh: 200, rate: 2271, label: 'Bậc 3 (101 - 200 kWh)' },
      { maxKwh: 300, rate: 2860, label: 'Bậc 4 (201 - 300 kWh)' },
      { maxKwh: 400, rate: 3197, label: 'Bậc 5 (301 - 400 kWh)' },
      { maxKwh: Infinity, rate: 3302, label: 'Bậc 6 (> 400 kWh)' },
    ],
    electricityVatRate: 8,
    electricityFixedFee: 0,
    defaultWaterUsage: 16,
    waterRate: 9900,
    isTieredWater: true,
    waterTiers: [
      { maxM3PerPerson: 10, rate: 8500, label: 'Định mức 1 (≤ 10 m³)' },
      { maxM3PerPerson: 20, rate: 9900, label: 'Định mức 2 (10 - 20 m³)' },
      { maxM3PerPerson: 30, rate: 11600, label: 'Định mức 3 (20 - 30 m³)' },
      { maxM3PerPerson: Infinity, rate: 27000, label: 'Vượt định mức (> 30 m³)' },
    ],
    sewerFeeRate: 15,
    waterVatRate: 5,
    gasMode: 'cylinder',
    cylinderPrice: 430000,
    cylinderMonths: 1.5,
    pipedGasUsage: 0,
    pipedGasRate: 32000,
    internetFee: 220000,
    tvFee: 60000,
    mobilePlanPrice: 90000,
    mobileLinesCount: 2,
    managementFee: 350000,
    parkingFee: 240000,
    rentFee: 5500000,
    foodFee: 4500000,
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Tùy Chỉnh Toàn Cầu',
    currencyCode: 'USD',
    unitWater: 'm³',
    unitGas: 'bình',
    defaultElectricityKwh: 300,
    defaultElectricityRate: 0.15,
    isTieredElectricity: false,
    electricityTiers: [],
    electricityVatRate: 10,
    electricityFixedFee: 0,
    defaultWaterUsage: 15,
    waterRate: 2.0,
    isTieredWater: false,
    waterTiers: [],
    sewerFeeRate: 20,
    waterVatRate: 5,
    gasMode: 'cylinder',
    cylinderPrice: 30,
    cylinderMonths: 1,
    pipedGasUsage: 0,
    pipedGasRate: 1.5,
    internetFee: 30,
    tvFee: 10,
    mobilePlanPrice: 15,
    mobileLinesCount: 1,
    managementFee: 50,
    parkingFee: 20,
    rentFee: 500,
    foodFee: 300,
  }
};

// Exact order requested by user: Hoa Kỳ, Châu Âu, Nhật Bản, Hàn Quốc, Việt Nam, Tùy chỉnh (NO abbreviations)
const COUNTRY_DISPLAY_LIST: { id: StandardCountry; name: string }[] = [
  { id: 'US', name: 'Hoa Kỳ' },
  { id: 'EU', name: 'Châu Âu' },
  { id: 'JP', name: 'Nhật Bản' },
  { id: 'KR', name: 'Hàn Quốc' },
  { id: 'VN', name: 'Việt Nam' },
  { id: 'CUSTOM', name: 'Tùy chỉnh' },
];

// Household appliance list for quick electricity estimation
interface ApplianceItem {
  id: string;
  name: string;
  powerW: number;
  defaultHours: number;
  count: number;
  hoursPerDay: number;
  enabled: boolean;
}

export const UtilityBillCalculator: React.FC = () => {
  const { currency, setCurrency, currencyInfo, currencies, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Helper to get exchange rate ratio between any two currencies
  const getExchangeRateRatio = useCallback((from: string, to: string): number => {
    if (from === to) return 1.0;
    const fromRate = currencies.find(c => c.code === from)?.rateToUSD || 1.0;
    const toRate = currencies.find(c => c.code === to)?.rateToUSD || 1.0;
    return fromRate > 0 ? toRate / fromRate : 1.0;
  }, [currencies]);

  // Active Standard Profile - defaults to US as requested first in order
  const [selectedCountry, setSelectedCountry] = useState<StandardCountry>('US');
  const preset = COUNTRY_PRESETS[selectedCountry];

  // Number of people in house
  const [householdMembers, setHouseholdMembers] = useState<number>(3);

  // Active Sub-Tab: 'all' | 'electricity' | 'water' | 'gas' | 'internet' | 'living' | 'split'
  const [activeTab, setActiveTab] = useState<'all' | 'electricity' | 'water' | 'gas' | 'internet' | 'living' | 'split'>('all');

  // ELECTRICITY STATE
  const [electricityInputMode, setElectricityInputMode] = useState<'kwh' | 'meter' | 'appliances'>('kwh');
  const [electricityKwh, setElectricityKwh] = useState<number>(preset.defaultElectricityKwh);
  const [meterOld, setMeterOld] = useState<number>(1420);
  const [meterNew, setMeterNew] = useState<number>(1700);
  const [useTieredElectricity, setUseTieredElectricity] = useState<boolean>(preset.isTieredElectricity);
  const [electricityFlatRate, setElectricityFlatRate] = useState<number>(preset.defaultElectricityRate);
  const [electricityVat, setElectricityVat] = useState<number>(preset.electricityVatRate);
  const [electricityFixedFee, setElectricityFixedFee] = useState<number>(preset.electricityFixedFee);

  // Appliances Estimator State
  const [appliances, setAppliances] = useState<ApplianceItem[]>([
    { id: 'ac', name: 'Điều hòa nhiệt độ (Inverter 1.5 HP)', powerW: 1100, defaultHours: 8, count: 1, hoursPerDay: 8, enabled: true },
    { id: 'fridge', name: 'Tủ lạnh (Gia đình 250 - 350L)', powerW: 120, defaultHours: 24, count: 1, hoursPerDay: 12, enabled: true },
    { id: 'waterheater', name: 'Bình nước nóng lạnh (2500W)', powerW: 2500, defaultHours: 1, count: 1, hoursPerDay: 1, enabled: true },
    { id: 'washer', name: 'Máy giặt & sấy (500W)', powerW: 500, defaultHours: 1.5, count: 1, hoursPerDay: 1.5, enabled: true },
    { id: 'cooker', name: 'Bếp từ đôi / Bếp hồng ngoại', powerW: 2000, defaultHours: 1.5, count: 1, hoursPerDay: 1.5, enabled: true },
    { id: 'ricecooker', name: 'Nồi cơm điện (700W)', powerW: 700, defaultHours: 1.5, count: 1, hoursPerDay: 1.5, enabled: true },
    { id: 'fan', name: 'Quạt máy làm mát (55W)', powerW: 55, defaultHours: 10, count: 2, hoursPerDay: 10, enabled: true },
    { id: 'lighting', name: 'Hệ thống đèn LED chiếu sáng', powerW: 60, defaultHours: 6, count: 1, hoursPerDay: 6, enabled: true },
    { id: 'tv', name: 'Smart TV màn hình lớn (100W)', powerW: 100, defaultHours: 4, count: 1, hoursPerDay: 4, enabled: true },
    { id: 'pc', name: 'Máy tính PC / Laptop (150W)', powerW: 150, defaultHours: 6, count: 1, hoursPerDay: 6, enabled: true },
  ]);

  // WATER STATE
  const [waterUsage, setWaterUsage] = useState<number>(preset.defaultWaterUsage);
  const [waterMeterOld, setWaterMeterOld] = useState<number>(310);
  const [waterMeterNew, setWaterMeterNew] = useState<number>(326);
  const [waterRate, setWaterRate] = useState<number>(preset.waterRate);
  const [useTieredWater, setUseTieredWater] = useState<boolean>(preset.isTieredWater);
  const [sewerRatePercent, setSewerRatePercent] = useState<number>(preset.sewerFeeRate);
  const [waterVat, setWaterVat] = useState<number>(preset.waterVatRate);

  // GAS STATE
  const [gasMode, setGasMode] = useState<'cylinder' | 'piped' | 'none'>(preset.gasMode);
  const [cylinderPrice, setCylinderPrice] = useState<number>(preset.cylinderPrice);
  const [cylinderMonths, setCylinderMonths] = useState<number>(preset.cylinderMonths);
  const [pipedGasUsage, setPipedGasUsage] = useState<number>(preset.pipedGasUsage);
  const [pipedGasRate, setPipedGasRate] = useState<number>(preset.pipedGasRate);

  // INTERNET & TELCO STATE
  const [internetFee, setInternetFee] = useState<number>(preset.internetFee);
  const [tvFee, setTvFee] = useState<number>(preset.tvFee);
  const [mobilePlanPrice, setMobilePlanPrice] = useState<number>(preset.mobilePlanPrice);
  const [mobileLinesCount, setMobileLinesCount] = useState<number>(preset.mobileLinesCount);

  // OTHER MONTHLY LIVING EXPENSES
  const [managementFee, setManagementFee] = useState<number>(preset.managementFee);
  const [parkingFee, setParkingFee] = useState<number>(preset.parkingFee);
  const [rentFee, setRentFee] = useState<number>(preset.rentFee);
  const [foodFee, setFoodFee] = useState<number>(preset.foodFee);
  const [otherMiscFee, setOtherMiscFee] = useState<number>(0);

  // ROOMMATE SPLITTER
  const [splitCount, setSplitCount] = useState<number>(householdMembers);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Previous currency ref to automatically convert user inputs when currency toggles
  const prevCurrencyRef = useRef<CurrencyCode>(currency);

  // If user enters with a different currency than the preset default, scale initial values appropriately
  useEffect(() => {
    if (preset.currencyCode !== currency) {
      const ratio = getExchangeRateRatio(preset.currencyCode, currency);
      if (ratio !== 1.0 && !isNaN(ratio) && ratio > 0) {
        setElectricityFlatRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setElectricityFixedFee(prev => Math.round((prev * ratio) * 100) / 100);
        setWaterRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setCylinderPrice(prev => Math.round((prev * ratio) * 100) / 100);
        setPipedGasRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setInternetFee(prev => Math.round((prev * ratio) * 100) / 100);
        setTvFee(prev => Math.round((prev * ratio) * 100) / 100);
        setMobilePlanPrice(prev => Math.round((prev * ratio) * 100) / 100);
        setManagementFee(prev => Math.round((prev * ratio) * 100) / 100);
        setParkingFee(prev => Math.round((prev * ratio) * 100) / 100);
        setRentFee(prev => Math.round((prev * ratio) * 100) / 100);
        setFoodFee(prev => Math.round((prev * ratio) * 100) / 100);
      }
    }
  }, []);

  // When currency is switched (e.g. from USD to VND or vice-versa), dynamically scale all amounts
  useEffect(() => {
    if (prevCurrencyRef.current !== currency) {
      const oldCode = prevCurrencyRef.current;
      const newCode = currency;
      prevCurrencyRef.current = currency;

      const ratio = getExchangeRateRatio(oldCode, newCode);
      if (ratio !== 1.0 && !isNaN(ratio) && ratio > 0) {
        setElectricityFlatRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setElectricityFixedFee(prev => Math.round((prev * ratio) * 100) / 100);
        setWaterRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setCylinderPrice(prev => Math.round((prev * ratio) * 100) / 100);
        setPipedGasRate(prev => Math.round((prev * ratio) * 1000) / 1000);
        setInternetFee(prev => Math.round((prev * ratio) * 100) / 100);
        setTvFee(prev => Math.round((prev * ratio) * 100) / 100);
        setMobilePlanPrice(prev => Math.round((prev * ratio) * 100) / 100);
        setManagementFee(prev => Math.round((prev * ratio) * 100) / 100);
        setParkingFee(prev => Math.round((prev * ratio) * 100) / 100);
        setRentFee(prev => Math.round((prev * ratio) * 100) / 100);
        setFoodFee(prev => Math.round((prev * ratio) * 100) / 100);
        setOtherMiscFee(prev => Math.round((prev * ratio) * 100) / 100);
      }
    }
  }, [currency, getExchangeRateRatio]);

  // When country preset changes, sync that country's currency and load preset values
  const handleSelectCountry = (country: StandardCountry) => {
    setSelectedCountry(country);
    const p = COUNTRY_PRESETS[country];

    // Automatically sync currency to selected country's native currency (US -> USD, VN -> VND, etc.)
    if (p.currencyCode) {
      prevCurrencyRef.current = p.currencyCode;
      setCurrency(p.currencyCode);
    }

    setElectricityKwh(p.defaultElectricityKwh);
    setUseTieredElectricity(p.isTieredElectricity);
    setElectricityFlatRate(p.defaultElectricityRate);
    setElectricityVat(p.electricityVatRate);
    setElectricityFixedFee(p.electricityFixedFee);
    
    setWaterUsage(p.defaultWaterUsage);
    setWaterRate(p.waterRate);
    setUseTieredWater(p.isTieredWater);
    setSewerRatePercent(p.sewerFeeRate);
    setWaterVat(p.waterVatRate);
    
    setGasMode(p.gasMode);
    setCylinderPrice(p.cylinderPrice);
    setCylinderMonths(p.cylinderMonths);
    setPipedGasUsage(p.pipedGasUsage);
    setPipedGasRate(p.pipedGasRate);
    
    setInternetFee(p.internetFee);
    setTvFee(p.tvFee);
    setMobilePlanPrice(p.mobilePlanPrice);
    setMobileLinesCount(p.mobileLinesCount);
    
    setManagementFee(p.managementFee);
    setParkingFee(p.parkingFee);
    setRentFee(p.rentFee);
    setFoodFee(p.foodFee);
  };

  // Compute kWh from appliances
  const estimatedApplianceKwh = useMemo(() => {
    let monthlyTotalWh = 0;
    appliances.forEach(app => {
      if (app.enabled) {
        // Daily Wh = count * power * hours
        const dailyWh = app.count * app.powerW * app.hoursPerDay;
        monthlyTotalWh += dailyWh * 30; // 30 days
      }
    });
    return Math.round(monthlyTotalWh / 1000);
  }, [appliances]);

  // Actual kWh used
  const effectiveKwh = useMemo(() => {
    if (electricityInputMode === 'meter') {
      return Math.max(0, meterNew - meterOld);
    }
    if (electricityInputMode === 'appliances') {
      return estimatedApplianceKwh;
    }
    return Math.max(0, electricityKwh);
  }, [electricityInputMode, meterNew, meterOld, estimatedApplianceKwh, electricityKwh]);

  // Compute Electricity Cost
  const electricityCalculation = useMemo(() => {
    let baseCost = 0;
    const tierDetails: { label: string; kwh: number; rate: number; cost: number }[] = [];
    const tierRatio = getExchangeRateRatio(preset.currencyCode, currency);

    if (useTieredElectricity && preset.electricityTiers.length > 0) {
      let remainingKwh = effectiveKwh;
      let prevLimit = 0;

      for (let i = 0; i < preset.electricityTiers.length; i++) {
        const tier = preset.electricityTiers[i];
        const tierCapacity = tier.maxKwh === Infinity ? Infinity : tier.maxKwh - prevLimit;
        const kwhInThisTier = Math.min(Math.max(0, remainingKwh), tierCapacity);
        const tierRate = tier.rate * tierRatio;

        if (kwhInThisTier > 0) {
          const costInTier = kwhInThisTier * tierRate;
          baseCost += costInTier;
          tierDetails.push({
            label: tier.label,
            kwh: kwhInThisTier,
            rate: tierRate,
            cost: costInTier
          });
          remainingKwh -= kwhInThisTier;
        }

        if (remainingKwh <= 0) break;
        prevLimit = tier.maxKwh;
      }
    } else {
      // Flat rate
      baseCost = effectiveKwh * electricityFlatRate;
      tierDetails.push({
        label: `Đơn giá phẳng (${formatMoney(electricityFlatRate)}/kWh)`,
        kwh: effectiveKwh,
        rate: electricityFlatRate,
        cost: baseCost
      });
    }

    const subtotalWithFixed = baseCost + electricityFixedFee;
    const vatAmount = subtotalWithFixed * (electricityVat / 100);
    const totalElectricity = subtotalWithFixed + vatAmount;

    return {
      effectiveKwh,
      baseCost,
      electricityFixedFee,
      vatAmount,
      totalElectricity,
      tierDetails
    };
  }, [effectiveKwh, useTieredElectricity, preset.electricityTiers, preset.currencyCode, currency, getExchangeRateRatio, electricityFlatRate, electricityFixedFee, electricityVat, formatMoney]);

  // Compute Water Cost
  const effectiveWaterUsage = useMemo(() => {
    return Math.max(0, waterUsage);
  }, [waterUsage]);

  const waterCalculation = useMemo(() => {
    let cleanWaterBase = 0;
    const tierDetails: { label: string; m3: number; rate: number; cost: number }[] = [];
    const tierRatio = getExchangeRateRatio(preset.currencyCode, currency);

    if (useTieredWater && preset.waterTiers.length > 0) {
      let remainingM3 = effectiveWaterUsage;
      let prevCap = 0;

      for (let i = 0; i < preset.waterTiers.length; i++) {
        const tier = preset.waterTiers[i];
        // Quota scaled by household members
        const tierCap = tier.maxM3PerPerson === Infinity ? Infinity : (tier.maxM3PerPerson - prevCap) * Math.max(1, householdMembers);
        const m3InTier = Math.min(Math.max(0, remainingM3), tierCap);
        const tierRate = tier.rate * tierRatio;

        if (m3InTier > 0) {
          const costInTier = m3InTier * tierRate;
          cleanWaterBase += costInTier;
          tierDetails.push({
            label: tier.label,
            m3: m3InTier,
            rate: tierRate,
            cost: costInTier
          });
          remainingM3 -= m3InTier;
        }

        if (remainingM3 <= 0) break;
        prevCap = tier.maxM3PerPerson;
      }
    } else {
      cleanWaterBase = effectiveWaterUsage * waterRate;
      tierDetails.push({
        label: `Đơn giá nước (${formatMoney(waterRate)}/${preset.unitWater})`,
        m3: effectiveWaterUsage,
        rate: waterRate,
        cost: cleanWaterBase
      });
    }

    const sewerAmount = cleanWaterBase * (sewerRatePercent / 100);
    const waterVatAmount = cleanWaterBase * (waterVat / 100);
    const totalWater = cleanWaterBase + sewerAmount + waterVatAmount;

    return {
      effectiveWaterUsage,
      cleanWaterBase,
      sewerAmount,
      waterVatAmount,
      totalWater,
      tierDetails
    };
  }, [effectiveWaterUsage, useTieredWater, preset.waterTiers, preset.currencyCode, currency, getExchangeRateRatio, householdMembers, waterRate, formatMoney, preset.unitWater, sewerRatePercent, waterVat]);

  // Compute Gas Cost
  const gasCalculation = useMemo(() => {
    if (gasMode === 'none') {
      return { totalGas: 0, description: 'Không sử dụng gas' };
    }
    if (gasMode === 'cylinder') {
      const months = Math.max(0.1, cylinderMonths);
      const monthlyCost = cylinderPrice / months;
      return {
        totalGas: monthlyCost,
        description: `Bình gas (${formatMoney(cylinderPrice)} / ${cylinderMonths} tháng)`
      };
    }
    // Piped
    const pipedCost = pipedGasUsage * pipedGasRate;
    return {
      totalGas: pipedCost,
      description: `Gas đường ống (${pipedGasUsage} ${preset.unitGas} × ${formatMoney(pipedGasRate)})`
    };
  }, [gasMode, cylinderMonths, cylinderPrice, pipedGasUsage, pipedGasRate, formatMoney, preset.unitGas]);

  // Compute Internet & Telco Cost
  const telcoCalculation = useMemo(() => {
    const totalMobile = mobilePlanPrice * mobileLinesCount;
    const totalTelco = internetFee + tvFee + totalMobile;
    return {
      internetFee,
      tvFee,
      totalMobile,
      totalTelco
    };
  }, [internetFee, tvFee, mobilePlanPrice, mobileLinesCount]);

  // Compute Other Living Expenses
  const otherExpensesCalculation = useMemo(() => {
    const totalOther = managementFee + parkingFee + rentFee + foodFee + otherMiscFee;
    return {
      managementFee,
      parkingFee,
      rentFee,
      foodFee,
      otherMiscFee,
      totalOther
    };
  }, [managementFee, parkingFee, rentFee, foodFee, otherMiscFee]);

  // GRAND TOTALS
  const grandTotals = useMemo(() => {
    // 4 Utilities: Electricity, Water, Gas, Internet
    const utilitiesOnly = 
      electricityCalculation.totalElectricity +
      waterCalculation.totalWater +
      gasCalculation.totalGas +
      telcoCalculation.totalTelco;

    // Total living expenses
    const grandMonthly = utilitiesOnly + otherExpensesCalculation.totalOther;
    const dailyCost = grandMonthly / 30;
    const perCapitaCost = grandMonthly / Math.max(1, householdMembers);
    const annualProjected = grandMonthly * 12;

    // Percentages
    const calcPct = (amt: number) => (grandMonthly > 0 ? (amt / grandMonthly) * 100 : 0);

    return {
      utilitiesOnly,
      grandMonthly,
      dailyCost,
      perCapitaCost,
      annualProjected,
      pctElectricity: calcPct(electricityCalculation.totalElectricity),
      pctWater: calcPct(waterCalculation.totalWater),
      pctGas: calcPct(gasCalculation.totalGas),
      pctInternet: calcPct(telcoCalculation.totalTelco),
      pctOther: calcPct(otherExpensesCalculation.totalOther),
    };
  }, [electricityCalculation, waterCalculation, gasCalculation, telcoCalculation, otherExpensesCalculation, householdMembers]);

  // Roommate split calculation
  const splitPerPerson = useMemo(() => {
    return grandTotals.grandMonthly / Math.max(1, splitCount);
  }, [grandTotals.grandMonthly, splitCount]);

  const splitUtilitiesOnly = useMemo(() => {
    return grandTotals.utilitiesOnly / Math.max(1, splitCount);
  }, [grandTotals.utilitiesOnly, splitCount]);

  // Copy share message for roommates / family
  const handleCopySummary = () => {
    const text = `📋 [BẢNG KÊ TIỀN PHÒNG & SINH HOẠT THÁNG]
• Tiền điện (${effectiveKwh} kWh): ${formatMoney(electricityCalculation.totalElectricity)}
• Tiền nước (${waterUsage} ${preset.unitWater}): ${formatMoney(waterCalculation.totalWater)}
• Tiền gas: ${formatMoney(gasCalculation.totalGas)}
• Internet & Viễn thông: ${formatMoney(telcoCalculation.totalTelco)}
--------------------------
⚡ Tổng 4 khoản tiện ích: ${formatMoney(grandTotals.utilitiesOnly)}
🏠 Chi phí phòng / sinh hoạt khác: ${formatMoney(otherExpensesCalculation.totalOther)}
💰 TỔNG CỘNG CẢ NHÀ: ${formatMoney(grandTotals.grandMonthly)}
👥 Chia đều ${splitCount} người: 👉 ${formatMoney(splitPerPerson)} / người
(Tính qua AC Studio Utility Calculator)`;

    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Toggle appliance
  const toggleAppliance = (id: string) => {
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  // Update appliance hours
  const updateApplianceHours = (id: string, hours: number) => {
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, hoursPerDay: hours } : a));
  };

  // Update appliance count
  const updateApplianceCount = (id: string, count: number) => {
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, count: Math.max(1, count) } : a));
  };

  return (
    <div className="space-y-6">
      {/* Top Standard Country Selector Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Chuẩn tính toán Quốc tế & Biểu giá sinh hoạt
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ đầy đủ biểu giá sinh hoạt Hoa Kỳ (EIA), Châu Âu, Nhật Bản (TEPCO), Hàn Quốc (KEPCO) & Việt Nam (EVN 6 bậc).
            </p>
          </div>

          {/* Country preset selector buttons: Hoa Kỳ, Châu Âu, Nhật Bản, Hàn Quốc, Việt Nam, Tùy chỉnh (No abbreviations) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            {COUNTRY_DISPLAY_LIST.map((item) => {
              const isSelected = selectedCountry === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCountry(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.id === 'CUSTOM' && <Sliders className="w-3.5 h-3.5 text-sky-300" />}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency & International Exchange Status Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Coins className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-300 font-medium">
              Đang tính theo: <strong className="text-sky-400 font-bold">{currencyInfo.code} ({currencyInfo.symbol})</strong>
            </span>
            {currency === 'VND' && selectedCountry !== 'VN' && (
              <span className="text-[11px] text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/40 font-medium shadow-xs">
                ✓ Quy đổi chuẩn VNĐ (1 USD = 25.450 ₫)
              </span>
            )}
            {currency !== 'VND' && (
              <span className="text-[11px] text-slate-400">
                (Tỷ giá quy đổi tự động bảo toàn giá trị thực tế)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Đổi nhanh tiền tệ:</span>
            {(['USD', 'VND', 'EUR', 'JPY', 'KRW'] as CurrencyCode[]).map((cCode) => (
              <button
                key={cCode}
                type="button"
                onClick={() => setCurrency(cCode)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  currency === cCode
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cCode === 'USD' ? 'USD' : cCode === 'VND' ? 'VNĐ' : cCode === 'EUR' ? 'EUR' : cCode === 'JPY' ? 'JPY' : 'KRW'}
              </button>
            ))}
          </div>
        </div>

        {/* Global info row: Household members & Quick actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-4 h-4 text-sky-400" />
              Nhân khẩu gia đình:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 rounded-lg border border-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setHouseholdMembers(prev => Math.max(1, prev - 1))}
                className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-bold text-white">{householdMembers} người</span>
              <button
                type="button"
                onClick={() => setHouseholdMembers(prev => prev + 1)}
                className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="text-slate-500 hidden sm:inline">(Dùng để tính định mức nước sinh hoạt & chia bình quân)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              title="In báo cáo chi tiêu"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>In hóa đơn</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              title="Sao chép bảng kê gửi người thân / bạn trọ"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-sky-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedShare ? 'Đã sao chép!' : 'Chia sẻ bảng kê'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 MAIN KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Utilities Only */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Tổng 4 Tiện Ích
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatMoney(grandTotals.utilitiesOnly)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Điện, Nước, Gas & Internet
            </p>
          </div>
        </div>

        {/* Card 2: Grand Total Living Expenses */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/15 via-slate-900 to-slate-900 border border-sky-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Tổng Chi Tiêu 1 Tháng
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-sky-300 tracking-tight">
              {formatMoney(grandTotals.grandMonthly)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toàn bộ chi phí sinh hoạt
            </p>
          </div>
        </div>

        {/* Card 3: Daily Average */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 border border-blue-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Chi Phí Mỗi Ngày
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatMoney(grandTotals.dailyCost)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Trung bình 30 ngày sinh hoạt
            </p>
          </div>
        </div>

        {/* Card 4: Per Capita Cost */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Bình Quân Mỗi Người
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-purple-300 tracking-tight">
              {formatMoney(grandTotals.perCapitaCost)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cho gia đình {householdMembers} người
            </p>
          </div>
        </div>
      </div>

      {/* Visual Expense Breakdown Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-sky-400" />
            Tỷ Trọng Chi Tiêu Hàng Tháng
          </span>
          <span className="text-xs text-slate-400">
            Dự toán cả năm: <strong className="text-white">{formatMoney(grandTotals.annualProjected)}</strong>
          </span>
        </div>

        {/* Multi-color Progress bar */}
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: `${grandTotals.pctElectricity}%` }} className="bg-amber-400 h-full transition-all" title={`Điện: ${grandTotals.pctElectricity.toFixed(1)}%`} />
          <div style={{ width: `${grandTotals.pctWater}%` }} className="bg-blue-400 h-full transition-all" title={`Nước: ${grandTotals.pctWater.toFixed(1)}%`} />
          <div style={{ width: `${grandTotals.pctGas}%` }} className="bg-rose-400 h-full transition-all" title={`Gas: ${grandTotals.pctGas.toFixed(1)}%`} />
          <div style={{ width: `${grandTotals.pctInternet}%` }} className="bg-purple-400 h-full transition-all" title={`Internet: ${grandTotals.pctInternet.toFixed(1)}%`} />
          <div style={{ width: `${grandTotals.pctOther}%` }} className="bg-emerald-500 h-full transition-all" title={`Chi phí khác: ${grandTotals.pctOther.toFixed(1)}%`} />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Điện:</span>
            <span className="font-bold text-white">{formatMoney(electricityCalculation.totalElectricity)} ({grandTotals.pctElectricity.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span className="text-slate-300">Nước:</span>
            <span className="font-bold text-white">{formatMoney(waterCalculation.totalWater)} ({grandTotals.pctWater.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-slate-300">Gas:</span>
            <span className="font-bold text-white">{formatMoney(gasCalculation.totalGas)} ({grandTotals.pctGas.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">Internet:</span>
            <span className="font-bold text-white">{formatMoney(telcoCalculation.totalTelco)} ({grandTotals.pctInternet.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Sinh hoạt khác:</span>
            <span className="font-bold text-white">{formatMoney(otherExpensesCalculation.totalOther)} ({grandTotals.pctOther.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold">
        {[
          { id: 'all', label: 'Tất cả dịch vụ', icon: Layers },
          { id: 'electricity', label: '⚡ Tiền Điện', icon: Zap },
          { id: 'water', label: '💧 Tiền Nước', icon: Droplets },
          { id: 'gas', label: '🔥 Tiền Gas', icon: Flame },
          { id: 'internet', label: '🌐 Internet & Telco', icon: Wifi },
          { id: 'living', label: '🏠 Chi Phí Khác', icon: Home },
          { id: 'split', label: '👥 Chia Tiền Phòng', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MODULES */}

      {/* SECTION 1: TIỀN ĐIỆN (ELECTRICITY) */}
      {(activeTab === 'all' || activeTab === 'electricity') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-slate-100 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. Tiền Điện Sinh Hoạt (Electricity)</h3>
                <p className="text-xs text-slate-400">
                  Áp dụng {useTieredElectricity ? `biểu giá bậc thang lũy tiến (${preset.electricityTiers.length} bậc)` : 'đơn giá phẳng'} + VAT {electricityVat}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Thành tiền điện tháng:</span>
              <span className="text-lg font-black text-amber-400">
                {formatMoney(electricityCalculation.totalElectricity)}
              </span>
            </div>
          </div>

          {/* Mode Selector for Electricity input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setElectricityInputMode('kwh')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                electricityInputMode === 'kwh'
                  ? 'bg-amber-500/15 border-amber-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold">Nhập số kWh trực tiếp</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Nhập tổng số kWh trên hóa đơn</div>
            </button>

            <button
              type="button"
              onClick={() => setElectricityInputMode('meter')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                electricityInputMode === 'meter'
                  ? 'bg-amber-500/15 border-amber-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold">Chỉ số công tơ điện</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tính theo (Chỉ số Mới - Cũ)</div>
            </button>

            <button
              type="button"
              onClick={() => setElectricityInputMode('appliances')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                electricityInputMode === 'appliances'
                  ? 'bg-amber-500/15 border-amber-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Ước tính theo thiết bị</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[10px]">Smart</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Bật tắt điều hòa, tủ lạnh, quạt...</div>
            </button>
          </div>

          {/* Form inputs depending on mode */}
          {electricityInputMode === 'kwh' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Tổng số điện tiêu thụ trong tháng (kWh):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={electricityKwh}
                    onChange={(e) => setElectricityKwh(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-base focus:outline-hidden focus:border-amber-400"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kWh</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Thuế VAT & Phí cố định:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={electricityVat}
                      onChange={(e) => setElectricityVat(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-amber-400"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">% VAT</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={electricityFixedFee}
                      onChange={(e) => setElectricityFixedFee(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-amber-400"
                      title="Phí duy trì đồng hồ / công tơ cố định"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">Phí cố định</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {electricityInputMode === 'meter' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Chỉ số công tơ kỳ CŨ:
                </label>
                <input
                  type="number"
                  min="0"
                  value={meterOld}
                  onChange={(e) => setMeterOld(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Chỉ số công tơ kỳ MỚI:
                </label>
                <input
                  type="number"
                  min="0"
                  value={meterNew}
                  onChange={(e) => setMeterNew(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Số kWh tiêu thụ thực tế:
                </label>
                <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold text-base flex items-center justify-between">
                  <span>{effectiveKwh} kWh</span>
                  <span className="text-[11px] font-normal text-slate-400">(Mới - Cũ)</span>
                </div>
              </div>
            </div>
          )}

          {electricityInputMode === 'appliances' && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Ước tính tiêu thụ điện từ thiết bị gia đình:
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Bật/tắt và chỉnh số giờ dùng mỗi ngày. Tổng tiêu thụ ước tính: <strong className="text-amber-300 font-bold">{estimatedApplianceKwh} kWh/tháng</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {appliances.map((app) => (
                  <div
                    key={app.id}
                    className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 ${
                      app.enabled
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={app.enabled}
                        onChange={() => toggleAppliance(app.id)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-slate-100">{app.name}</div>
                        <div className="text-[10px] text-slate-400">Công suất: ~{app.powerW}W</div>
                      </div>
                    </div>

                    {app.enabled && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={app.hoursPerDay}
                            onChange={(e) => updateApplianceHours(app.id, Math.max(0, Math.min(24, parseFloat(e.target.value) || 0)))}
                            className="w-12 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-center font-bold text-amber-400"
                          />
                          <span className="text-[10px] text-slate-400">h/ngày</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tier breakdown table */}
          {useTieredElectricity && electricityCalculation.tierDetails.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5 font-semibold">Bậc thang điện</th>
                    <th className="py-1.5 font-semibold text-right">Số kWh bậc</th>
                    <th className="py-1.5 font-semibold text-right">Đơn giá</th>
                    <th className="py-1.5 font-semibold text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {electricityCalculation.tierDetails.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-1.5 font-medium text-slate-200">{t.label}</td>
                      <td className="py-1.5 text-right font-bold text-amber-300">{t.kwh} kWh</td>
                      <td className="py-1.5 text-right">{formatMoney(t.rate)}</td>
                      <td className="py-1.5 text-right font-bold text-white">{formatMoney(t.cost)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold text-slate-200 border-t border-slate-700">
                    <td className="py-2" colSpan={3}>Cộng tiền điện trước thuế:</td>
                    <td className="py-2 text-right">{formatMoney(electricityCalculation.baseCost)}</td>
                  </tr>
                  <tr className="text-slate-400 text-[11px]">
                    <td className="py-1" colSpan={3}>Thuế giá trị gia tăng (VAT {electricityVat}%):</td>
                    <td className="py-1 text-right text-slate-300">{formatMoney(electricityCalculation.vatAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: TIỀN NƯỚC (WATER & SEWAGE) */}
      {(activeTab === 'all' || activeTab === 'water') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-blue-500/20 text-slate-100 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">2. Tiền Nước Sinh Hoạt & Phí Thoát Nước (Water & Sewer)</h3>
                <p className="text-xs text-slate-400">
                  Bao gồm nước sạch sinh hoạt, phí dịch vụ thoát nước / bảo vệ môi trường ({sewerRatePercent}%) & VAT {waterVat}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Thành tiền nước tháng:</span>
              <span className="text-lg font-black text-blue-400">
                {formatMoney(waterCalculation.totalWater)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Lượng nước tiêu thụ ({preset.unitWater}):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={waterUsage}
                  onChange={(e) => setWaterUsage(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-base focus:outline-hidden focus:border-blue-400"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">{preset.unitWater}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Phí thoát nước / BV môi trường:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={sewerRatePercent}
                  onChange={(e) => setSewerRatePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-blue-400"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Thuế VAT nước sạch:
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={waterVat}
                  onChange={(e) => setWaterVat(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-blue-400"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">%</span>
              </div>
            </div>
          </div>

          {/* Water Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1.5 font-semibold">Khoản mục nước</th>
                  <th className="py-1.5 font-semibold text-right">Khối lượng</th>
                  <th className="py-1.5 font-semibold text-right">Đơn giá / Tỷ lệ</th>
                  <th className="py-1.5 font-semibold text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {waterCalculation.tierDetails.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-1.5 font-medium text-slate-200">{t.label}</td>
                    <td className="py-1.5 text-right font-bold text-blue-300">{t.m3} {preset.unitWater}</td>
                    <td className="py-1.5 text-right">{formatMoney(t.rate)}</td>
                    <td className="py-1.5 text-right font-bold text-white">{formatMoney(t.cost)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1.5 text-slate-300">Phí thoát nước thải & bảo vệ môi trường ({sewerRatePercent}%):</td>
                  <td className="py-1.5 text-right text-slate-400">-</td>
                  <td className="py-1.5 text-right text-slate-400">{sewerRatePercent}%</td>
                  <td className="py-1.5 text-right font-medium text-slate-200">{formatMoney(waterCalculation.sewerAmount)}</td>
                </tr>
                <tr className="text-slate-400 text-[11px]">
                  <td className="py-1">Thuế VAT nước sạch ({waterVat}%):</td>
                  <td className="py-1 text-right">-</td>
                  <td className="py-1 text-right">{waterVat}%</td>
                  <td className="py-1 text-right text-slate-300">{formatMoney(waterCalculation.waterVatAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: TIỀN GAS (GAS & HEATING) */}
      {(activeTab === 'all' || activeTab === 'gas') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-rose-500/20 text-slate-100 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">3. Tiền Gas & Nhiên Liệu Nấu Nướng (Gas / LPG)</h3>
                <p className="text-xs text-slate-400">
                  Hỗ trợ gas bình đổi (LPG 12kg/45kg) hoặc khí thiên nhiên đường ống (m³/Therms)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Thành tiền gas tháng:</span>
              <span className="text-lg font-black text-rose-400">
                {formatMoney(gasCalculation.totalGas)}
              </span>
            </div>
          </div>

          {/* Gas Mode Selector */}
          <div className="flex items-center gap-2">
            {[
              { id: 'cylinder', label: 'Bình gas đổi (LPG)', icon: Flame },
              { id: 'piped', label: 'Gas đường ống / Trung tâm', icon: Layers },
              { id: 'none', label: 'Không dùng gas (Chỉ dùng điện)', icon: Zap },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setGasMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  gasMode === m.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {gasMode === 'cylinder' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Giá tiền 1 bình gas (12kg hoặc 45kg):
                </label>
                <input
                  type="number"
                  min="0"
                  value={cylinderPrice}
                  onChange={(e) => setCylinderPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Thời gian dùng hết 1 bình (tháng):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.2"
                    step="0.1"
                    value={cylinderMonths}
                    onChange={(e) => setCylinderMonths(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-rose-400"
                  />
                  <span className="text-xs text-slate-400 whitespace-nowrap">tháng / bình</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Quy đổi: Chi phí gas bình quân mỗi tháng = {formatMoney(gasCalculation.totalGas)}
                </p>
              </div>
            </div>
          )}

          {gasMode === 'piped' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Số {preset.unitGas} gas đường ống tiêu thụ:
                </label>
                <input
                  type="number"
                  min="0"
                  value={pipedGasUsage}
                  onChange={(e) => setPipedGasUsage(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Đơn giá mỗi {preset.unitGas}:
                </label>
                <input
                  type="number"
                  min="0"
                  value={pipedGasRate}
                  onChange={(e) => setPipedGasRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-rose-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: INTERNET & VIỄN THÔNG (INTERNET, TV, MOBILE) */}
      {(activeTab === 'all' || activeTab === 'internet') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-purple-500/20 text-slate-100 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">4. Internet, Truyền Hình & Cước Di Động (Telco)</h3>
                <p className="text-xs text-slate-400">
                  Cáp quang băng thông rộng, truyền hình số & các gói cước 4G/5G gia đình
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Thành tiền viễn thông tháng:</span>
              <span className="text-lg font-black text-purple-400">
                {formatMoney(telcoCalculation.totalTelco)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Gói Internet cáp quang (FTTH):
              </label>
              <input
                type="number"
                min="0"
                value={internetFee}
                onChange={(e) => setInternetFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-purple-400"
              />
              <span className="text-[11px] text-slate-500">Tốc độ cao 100 - 500 Mbps</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Truyền hình cáp / Streaming (K+, Netflix):
              </label>
              <input
                type="number"
                min="0"
                value={tvFee}
                onChange={(e) => setTvFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-purple-400"
              />
              <span className="text-[11px] text-slate-500">Thuê bao truyền hình số</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Cước 4G/5G di động gia đình:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={mobilePlanPrice}
                  onChange={(e) => setMobilePlanPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-hidden focus:border-purple-400"
                  placeholder="Giá gói"
                  title="Giá 1 gói cước"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    value={mobileLinesCount}
                    onChange={(e) => setMobileLinesCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-hidden focus:border-purple-400 text-center"
                    placeholder="Số máy"
                    title="Số thuê bao"
                  />
                  <span className="text-[10px] text-slate-400">máy</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">= {formatMoney(telcoCalculation.totalMobile)}/tháng</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CHI PHÍ SINH HOẠT KHÁC (OTHER LIVING EXPENSES) */}
      {(activeTab === 'all' || activeTab === 'living') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 text-slate-100 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">5. Chi Phí Sinh Hoạt Khác Trong Tháng (Living Expenses)</h3>
                <p className="text-xs text-slate-400">
                  Phí quản lý tòa nhà, gửi xe, tiền thuê nhà & tiền chợ búa thực phẩm
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Tổng khoản sinh hoạt khác:</span>
              <span className="text-lg font-black text-emerald-400">
                {formatMoney(otherExpensesCalculation.totalOther)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Phí quản lý / Rác thải vệ sinh:
              </label>
              <input
                type="number"
                min="0"
                value={managementFee}
                onChange={(e) => setManagementFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Tiền gửi xe (Xe máy / Ô tô):
              </label>
              <input
                type="number"
                min="0"
                value={parkingFee}
                onChange={(e) => setParkingFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Tiền thuê nhà / Mặt bằng:
              </label>
              <input
                type="number"
                min="0"
                value={rentFee}
                onChange={(e) => setRentFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Tiền ăn uống & siêu thị thực phẩm:
              </label>
              <input
                type="number"
                min="0"
                value={foodFee}
                onChange={(e) => setFoodFee(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-hidden focus:border-emerald-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: CHIA TIỀN PHÒNG TRỌ / BẠN CÙNG PHÒNG (ROOMMATE BILL SPLITTER) */}
      {(activeTab === 'all' || activeTab === 'split') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 text-slate-100 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">6. Chia Tiền Phòng Trọ / Bạn Cùng Phòng (Bill Splitter)</h3>
                <p className="text-xs text-slate-400">
                  Tự động chia đều hóa đơn tiền phòng & tiền điện nước theo từng người kèm nút sao chép thông báo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Số người chia:</span>
              <div className="flex items-center gap-1 bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setSplitCount(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-white">{splitCount}</span>
                <button
                  type="button"
                  onClick={() => setSplitCount(prev => prev + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Chỉ chia 4 khoản Tiện ích (Điện, nước, gas, nét):</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {formatMoney(splitUtilitiesOnly)}
              </span>
              <span className="text-[11px] text-slate-500">Mỗi người / tháng</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 block">Chia TRỌN GÓI tất cả chi phí (kèm tiền phòng):</span>
              <span className="text-2xl font-black text-indigo-400 mt-1 block">
                {formatMoney(splitPerPerson)}
              </span>
              <span className="text-[11px] text-slate-400">Mỗi người cần đóng</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShare ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép tin nhắn thông báo'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Dán nhanh vào Zalo, Messenger, WhatsApp...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ENERGY SAVING TIPS & INTERNATIONAL STANDARDS */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Mẹo Tiết Kiệm 15 - 30% Hóa Đơn Điện, Nước & Gas Chuẩn Quốc Tế
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Tối ưu tiền điện
            </div>
            <p className="text-slate-400 leading-relaxed">
              Cài đặt điều hòa ở 26°C - 28°C kết hợp quạt gió giúp tiết kiệm 20% điện. Vệ sinh lưới lọc bụi 2 tuần/lần và rút phích cắm các thiết bị ở chế độ chờ (standby).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" />
              Tiết kiệm nước sạch
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sử dụng đầu vòi tăng áp và vòi sen tiết kiệm dòng chảy. Thường xuyên kiểm tra rò rỉ bồn cầu và gom đủ mẻ quần áo trước khi bật máy giặt.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Sử dụng gas an toàn & hiệu quả
            </div>
            <p className="text-slate-400 leading-relaxed">
              Điều chỉnh ngọn lửa xanh vừa đáy nồi để nhiệt lượng không tản ra ngoài. Đậy vung kín khi đun nấu giúp thức ăn chín nhanh hơn 30% và tiết kiệm gas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UtilityBillCalculator;
