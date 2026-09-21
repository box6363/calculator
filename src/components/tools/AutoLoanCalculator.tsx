import React, { useState, useMemo, useEffect } from 'react';
import { Car, DollarSign, RotateCcw, Calendar, FileDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencySelector } from '../common/CurrencySelector';
import { AutoLoanPdfModal } from './AutoLoanPdfModal';

export const AutoLoanCalculator: React.FC = () => {
  const { currency, currencyInfo, formatMoney } = useCurrency();

  const [vehiclePrice, setVehiclePrice] = useState<number>(() => {
    return currency === 'VND' ? 800000000 : 35000;
  });
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [downPayment, setDownPayment] = useState<number>(() => {
    return currency === 'VND' ? 150000000 : 5000;
  });
  const [tradeInValue, setTradeInValue] = useState<number>(() => {
    return currency === 'VND' ? 50000000 : 2000;
  });
  const [salesTaxRate, setSalesTaxRate] = useState<number>(6.5);
  const [otherFees, setOtherFees] = useState<number>(() => {
    return currency === 'VND' ? 20000000 : 800;
  });
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Synchronize when switching currency
  useEffect(() => {
    if (currency === 'VND') {
      setVehiclePrice((prev) => (prev < 100000 ? 800000000 : prev));
      setDownPayment((prev) => (prev < 10000 ? 150000000 : prev));
      setTradeInValue((prev) => (prev < 5000 ? 50000000 : prev));
      setOtherFees((prev) => (prev < 2000 ? 20000000 : prev));
    } else {
      setVehiclePrice((prev) => (prev >= 1000000 ? 35000 : prev));
      setDownPayment((prev) => (prev >= 100000 ? 5000 : prev));
      setTradeInValue((prev) => (prev >= 100000 ? 2000 : prev));
      setOtherFees((prev) => (prev >= 100000 ? 800 : prev));
    }
  }, [currency]);

  const calculations = useMemo(() => {
    const netPrice = Math.max(0, vehiclePrice - tradeInValue);
    const salesTaxAmount = (netPrice * salesTaxRate) / 100;
    const totalPurchaseCost = vehiclePrice + salesTaxAmount + otherFees;
    const totalCredits = downPayment + tradeInValue;
    const loanAmount = Math.max(0, totalPurchaseCost - totalCredits);

    const monthlyRate = interestRate / 100 / 12;
    let monthlyPayment = 0;
    let totalInterest = 0;

    if (monthlyRate > 0 && loanTermMonths > 0) {
      monthlyPayment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) / 
                       (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
      totalInterest = (monthlyPayment * loanTermMonths) - loanAmount;
    } else if (loanTermMonths > 0) {
      monthlyPayment = loanAmount / loanTermMonths;
      totalInterest = 0;
    }

    const totalLoanCost = loanAmount + totalInterest;

    // First 12 months amortization preview
    const schedule = [];
    let balance = loanAmount;
    for (let m = 1; m <= Math.min(12, loanTermMonths); m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);
      schedule.push({
        month: m,
        principal: principalForMonth,
        interest: interestForMonth,
        balance
      });
    }

    return {
      salesTaxAmount,
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalLoanCost,
      totalPurchaseCost,
      schedule
    };
  }, [vehiclePrice, loanTermMonths, interestRate, downPayment, tradeInValue, salesTaxRate, otherFees]);

  const handleReset = () => {
    setVehiclePrice(currency === 'VND' ? 800000000 : 35000);
    setLoanTermMonths(60);
    setInterestRate(5.5);
    setDownPayment(currency === 'VND' ? 150000000 : 5000);
    setTradeInValue(currency === 'VND' ? 50000000 : 2000);
    setSalesTaxRate(6.5);
    setOtherFees(currency === 'VND' ? 20000000 : 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="tool-header-banner p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="banner-icon-box p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Auto Loan Calculator – Tính Khoản Vay Mua Ô Tô</h1>
            <p className="text-xs sm:text-sm text-slate-400">Dự toán tiền trả hàng tháng, thuế trước bạ, lãi suất và tổng chi phí mua xe</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CurrencySelector variant="compact" />
          <button
            id="autoloan-export-pdf-header-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 rounded-lg transition-colors cursor-pointer font-medium"
            title="Xuất bảng trả nợ PDF hoặc In ấn"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF / In</span>
          </button>
          <button
            id="autoloan-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Thông số khoản vay &amp; Xe
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Giá xe niêm yết ({currencyInfo.symbol} {currencyInfo.code})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{currencyInfo.symbol}</span>
              <input
                id="autoloan-vehicle-price"
                type="number"
                step={currency === 'VND' ? 20000000 : 500}
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full pl-9 pr-14 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-bold">{currencyInfo.code}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thời hạn vay (tháng)</label>
              <select
                id="autoloan-term-select"
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={24}>24 tháng (2 năm)</option>
                <option value={36}>36 tháng (3 năm)</option>
                <option value={48}>48 tháng (4 năm)</option>
                <option value={60}>60 tháng (5 năm)</option>
                <option value={72}>72 tháng (6 năm)</option>
                <option value={84}>84 tháng (7 năm)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lãi suất năm (%/năm)</label>
              <input
                id="autoloan-rate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tiền trả trước ({currencyInfo.symbol})
              </label>
              <input
                id="autoloan-down-payment"
                type="number"
                step={currency === 'VND' ? 5000000 : 250}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Đổi xe cũ (Trade-in {currencyInfo.symbol})
              </label>
              <input
                id="autoloan-trade-in"
                type="number"
                step={currency === 'VND' ? 5000000 : 250}
                value={tradeInValue}
                onChange={(e) => setTradeInValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Thuế bán hàng / trước bạ (%)</label>
              <input
                id="autoloan-tax-rate"
                type="number"
                step="0.1"
                value={salesTaxRate}
                onChange={(e) => setSalesTaxRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phí biển số &amp; Đăng kiểm ({currencyInfo.symbol})
              </label>
              <input
                id="autoloan-other-fees"
                type="number"
                step={currency === 'VND' ? 1000000 : 50}
                value={otherFees}
                onChange={(e) => setOtherFees(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Key Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <div className="tool-hero-banner p-6 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900 border border-emerald-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Khoản thanh toán ước tính hàng tháng</span>
            <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400 font-sans tabular-nums">
              {formatMoney(calculations.monthlyPayment)}
              <span className="text-sm text-slate-400 font-normal"> /tháng</span>
            </div>
            <p className="text-xs text-slate-400">
              Trong vòng {loanTermMonths} tháng với lãi suất {interestRate}%/năm
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Số tiền vay gốc</span>
              <span className="text-sm sm:text-base font-bold text-white font-sans tabular-nums">{formatMoney(calculations.loanAmount)}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Tổng tiền lãi</span>
              <span className="text-sm sm:text-base font-bold text-rose-400 font-sans tabular-nums">{formatMoney(calculations.totalInterest)}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Thuế trước bạ</span>
              <span className="text-sm sm:text-base font-bold text-amber-400 font-sans tabular-nums">{formatMoney(calculations.salesTaxAmount)}</span>
            </div>
          </div>

          {/* 12 Months Amortization Preview */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Lịch trả nợ năm đầu tiên (12 tháng)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="autoloan-export-pdf-table-btn"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/30 rounded-lg transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Xuất PDF / In</span>
                </button>
                <span className="text-[11px] text-slate-400 font-bold">{currencyInfo.code}</span>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto scrollbar-thin">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[11px] uppercase bg-slate-800 text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Tháng</th>
                    <th className="p-2">Tiền gốc</th>
                    <th className="p-2">Tiền lãi</th>
                    <th className="p-2 text-right">Dư nợ còn lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans tabular-nums">
                  {calculations.schedule.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-800/40">
                      <td className="p-2 font-medium">#{row.month}</td>
                      <td className="p-2 text-emerald-400">{formatMoney(row.principal)}</td>
                      <td className="p-2 text-rose-400">{formatMoney(row.interest)}</td>
                      <td className="p-2 text-right text-slate-200">{formatMoney(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <AutoLoanPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        vehiclePrice={vehiclePrice}
        downPayment={downPayment}
        tradeInValue={tradeInValue}
        interestRate={interestRate}
        loanTermMonths={loanTermMonths}
        salesTaxRate={salesTaxRate}
        otherFees={otherFees}
        calculations={calculations}
      />
    </div>
  );
};
