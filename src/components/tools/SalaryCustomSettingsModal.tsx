import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  SlidersHorizontal,
  Percent,
  Coins,
  Building2,
  MapPin
} from 'lucide-react';
import { 
  CountrySalaryProfile, 
  INTERNATIONAL_CURRENCIES,
  COUNTRY_PROFILES 
} from '../../data/salaryInternationalData';

interface SalaryCustomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CountrySalaryProfile;
  onSaveProfile: (updatedProfile: CountrySalaryProfile) => void;
  onResetToCountryDefault: () => void;
  lang: string;
}

export const SalaryCustomSettingsModal: React.FC<SalaryCustomSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetToCountryDefault,
  lang
}) => {
  const isVi = lang === 'vi';
  const [activeTab, setActiveTab] = useState<'insurance' | 'allowances' | 'tax' | 'subregions' | 'currency'>('insurance');
  const [editableProfile, setEditableProfile] = useState<CountrySalaryProfile>(profile);

  // Sync state when modal opens or profile changes
  React.useEffect(() => {
    setEditableProfile(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(editableProfile);
    onClose();
  };

  const handleReset = () => {
    onResetToCountryDefault();
    const defaultProf = COUNTRY_PROFILES[profile.id] || COUNTRY_PROFILES['CUSTOM'];
    setEditableProfile(defaultProf);
  };

  // Insurance handlers
  const updateEmpRate = (id: string, newRate: number) => {
    setEditableProfile(prev => ({
      ...prev,
      employeeInsurances: prev.employeeInsurances.map(item => 
        item.id === id ? { ...item, rate: newRate } : item
      )
    }));
  };

  const updateCompRate = (id: string, newRate: number) => {
    setEditableProfile(prev => ({
      ...prev,
      employerContributions: prev.employerContributions.map(item => 
        item.id === id ? { ...item, rate: newRate } : item
      )
    }));
  };

  const updateSubRegionRate = (id: string, newRate: number) => {
    setEditableProfile(prev => ({
      ...prev,
      subRegions: prev.subRegions?.map(item => 
        item.id === id ? { ...item, rate: newRate } : item
      )
    }));
  };

  // Bracket handlers
  const updateBracket = (index: number, field: 'min' | 'max' | 'rate', value: number) => {
    setEditableProfile(prev => {
      const nextBrackets = [...prev.taxBracketsAnnual];
      nextBrackets[index] = { ...nextBrackets[index], [field]: value };
      return { ...prev, taxBracketsAnnual: nextBrackets };
    });
  };

  const addBracket = () => {
    setEditableProfile(prev => {
      const len = prev.taxBracketsAnnual.length;
      const last = prev.taxBracketsAnnual[len - 1];
      const newMin = last ? (last.max === Infinity ? last.min + 50000 : last.max) : 0;
      return {
        ...prev,
        taxBracketsAnnual: [
          ...prev.taxBracketsAnnual,
          { bracket: len + 1, min: newMin, max: Infinity, rate: (last ? last.rate + 5 : 10) }
        ]
      };
    });
  };

  const removeBracket = (index: number) => {
    if (editableProfile.taxBracketsAnnual.length <= 1) return;
    setEditableProfile(prev => ({
      ...prev,
      taxBracketsAnnual: prev.taxBracketsAnnual.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isVi ? 'Tùy chỉnh Tham số Tính Lương' : 'Customize Payroll Parameters'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  {editableProfile.flag} {editableProfile.name}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVi ? 'Tự do thay đổi tỷ lệ bảo hiểm, mức giảm trừ, thuế suất và tiền tệ' : 'Adjust social contributions, tax brackets, allowances and currency'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-5 gap-2 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('insurance')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'insurance' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVi ? 'Bảo hiểm & An sinh' : 'Social Security & Insurances'}</span>
          </button>
          <button
            onClick={() => setActiveTab('allowances')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'allowances' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isVi ? 'Mức giảm trừ' : 'Allowances & Deductions'}</span>
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tax' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>{isVi ? 'Biểu thuế TNCN' : 'Tax Brackets'}</span>
          </button>
          {editableProfile.subRegions && editableProfile.subRegions.length > 0 && (
            <button
              onClick={() => setActiveTab('subregions')}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'subregions' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold' 
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{isVi ? 'Khu vực / Tiểu bang' : 'Regions & States'}</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('currency')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'currency' 
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>{isVi ? 'Tiền tệ & Đơn vị' : 'Currency & Format'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: INSURANCES */}
          {activeTab === 'insurance' && (
            <div className="space-y-6">
              {/* Employee Contributions */}
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{isVi ? 'Đóng góp Người Lao Động (Khấu trừ vào lương)' : 'Employee Contributions (Deducted from Pay)'}</span>
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi ? 'Tổng' : 'Total'}: {editableProfile.employeeInsurances.reduce((a, b) => a + b.rate, 0).toFixed(2)}%
                  </span>
                </div>

                <div className="space-y-3">
                  {editableProfile.employeeInsurances.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {isVi && item.nameVi ? item.nameVi : item.name}
                        </span>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="100"
                          value={item.rate}
                          onChange={(e) => updateEmpRate(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2.5 py-1.5 text-right font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:border-blue-500 focus:outline-hidden text-sm"
                        />
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employer Contributions */}
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isVi ? 'Đóng góp Doanh nghiệp (Người sử dụng LĐ)' : 'Employer Contributions (Company Cost)'}</span>
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi ? 'Tổng' : 'Total'}: {editableProfile.employerContributions.reduce((a, b) => a + b.rate, 0).toFixed(2)}%
                  </span>
                </div>

                <div className="space-y-3">
                  {editableProfile.employerContributions.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {isVi && item.nameVi ? item.nameVi : item.name}
                        </span>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          step="0.05"
                          min="0"
                          max="100"
                          value={item.rate}
                          onChange={(e) => updateCompRate(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2.5 py-1.5 text-right font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md focus:border-blue-500 focus:outline-hidden text-sm"
                        />
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALLOWANCES */}
          {activeTab === 'allowances' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isVi ? 'Mức giảm trừ cá nhân / bản thân (Năm)' : 'Personal / Standard Allowance (Annual)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{editableProfile.currencySymbol}</span>
                    <input
                      type="number"
                      value={editableProfile.personalAllowanceAnnual}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        personalAllowanceAnnual: parseFloat(e.target.value) || 0
                      }))}
                      className="flex-1 px-3 py-2 font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isVi ? `Tương đương ~${(editableProfile.personalAllowanceAnnual / 12).toLocaleString()} ${editableProfile.currencySymbol}/tháng` : `Approx ~${(editableProfile.personalAllowanceAnnual / 12).toLocaleString()} ${editableProfile.currencySymbol}/month`}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    {isVi ? 'Mức giảm trừ Người Phụ Thuộc (Mỗi người / Năm)' : 'Dependent Allowance (Per Person / Annual)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{editableProfile.currencySymbol}</span>
                    <input
                      type="number"
                      value={editableProfile.dependentAllowanceAnnual}
                      onChange={(e) => setEditableProfile(prev => ({
                        ...prev,
                        dependentAllowanceAnnual: parseFloat(e.target.value) || 0
                      }))}
                      className="flex-1 px-3 py-2 font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isVi ? `Tương đương ~${(editableProfile.dependentAllowanceAnnual / 12).toLocaleString()} ${editableProfile.currencySymbol}/tháng` : `Approx ~${(editableProfile.dependentAllowanceAnnual / 12).toLocaleString()} ${editableProfile.currencySymbol}/month`}
                  </p>
                </div>
              </div>

              {/* Vietnam specific regional salaries if VN */}
              {editableProfile.id === 'VN' && editableProfile.regions && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50">
                  <h5 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">
                    {isVi ? 'Lương tối thiểu theo 4 Vùng (Nghị định 74/2024/NĐ-CP)' : 'Vietnam Regional Minimum Wages'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {editableProfile.regions.map(r => (
                      <div key={r.id} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{r.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{r.minMonthly.toLocaleString()} ₫</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TAX BRACKETS */}
          {activeTab === 'tax' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200">
                    {isVi ? 'Biểu thuế Lũy tiến Từng phần (Hàng năm)' : 'Annual Progressive Tax Brackets'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi ? 'Thuế suất tính theo các bậc thu nhập tính thuế sau giảm trừ' : 'Marginal tax rates applied to taxable income'}
                  </p>
                </div>
                <button
                  onClick={addBracket}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-200 dark:hover:bg-blue-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Thêm bậc' : 'Add Bracket'}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">{isVi ? 'Bậc' : '#'}</th>
                      <th className="py-2.5 px-3">{isVi ? 'Thu nhập từ' : 'From'}</th>
                      <th className="py-2.5 px-3">{isVi ? 'Đến trần' : 'Up to'}</th>
                      <th className="py-2.5 px-3 text-right">{isVi ? 'Thuế (%)' : 'Rate (%)'}</th>
                      <th className="py-2.5 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {editableProfile.taxBracketsAnnual.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {b.bracket || idx + 1}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={b.min}
                            onChange={(e) => updateBracket(idx, 'min', parseFloat(e.target.value) || 0)}
                            className="w-24 sm:w-28 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium focus:border-blue-500 focus:outline-hidden"
                          />
                        </td>
                        <td className="py-2 px-3">
                          {b.max === Infinity ? (
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 italic px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                              {isVi ? 'Không giới hạn' : 'Unlimited (Max)'}
                            </span>
                          ) : (
                            <input
                              type="number"
                              value={b.max}
                              onChange={(e) => updateBracket(idx, 'max', parseFloat(e.target.value) || Infinity)}
                              className="w-24 sm:w-28 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium focus:border-blue-500 focus:outline-hidden"
                            />
                          )}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            <input
                              type="number"
                              step="0.5"
                              value={b.rate}
                              onChange={(e) => updateBracket(idx, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold text-blue-600 dark:text-blue-400 text-right focus:border-blue-500 focus:outline-hidden"
                            />
                            <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">%</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {editableProfile.taxBracketsAnnual.length > 1 && (
                            <button
                              onClick={() => removeBracket(idx)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SUBREGIONS & LOCAL/STATE TAXES */}
          {activeTab === 'subregions' && editableProfile.subRegions && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>
                    {isVi 
                      ? (editableProfile.subRegionLabelVi || 'Các Khu Vực & Thuế Tiểu Bang / Địa Phương') 
                      : (editableProfile.subRegionLabel || 'Regions & Local / State Taxes')}
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isVi 
                    ? 'Tùy chỉnh tỷ lệ thuế địa phương, thuế bang hoặc phân loại quyền lợi đặc thù theo từng khu vực' 
                    : 'Configure regional tax rates, state surcharges, or local deduction parameters'}
                </p>
              </div>

              <div className="space-y-2.5">
                {editableProfile.subRegions.map((sr) => (
                  <div key={sr.id} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-200">
                        {isVi ? sr.nameVi : sr.name}
                      </div>
                      {sr.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {sr.description}
                        </p>
                      )}
                    </div>

                    {sr.rate !== undefined && (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {isVi ? 'Thuế suất' : 'Rate'}:
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="50"
                          value={sr.rate}
                          onChange={(e) => updateSubRegionRate(sr.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2.5 py-1.5 text-right font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:border-blue-500 focus:outline-hidden text-xs"
                        />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {editableProfile.id === 'VN' && editableProfile.regions && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50">
                  <h5 className="font-semibold text-xs sm:text-sm text-blue-800 dark:text-blue-300 mb-2">
                    {isVi ? 'Lương tối thiểu theo 4 Vùng (Nghị định 74/2024/NĐ-CP)' : 'Vietnam Regional Minimum Wages'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {editableProfile.regions.map(r => (
                      <div key={r.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{r.name}</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">{r.minMonthly.toLocaleString()} ₫/tháng</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CURRENCY */}
          {activeTab === 'currency' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  {isVi ? 'Chọn đồng tiền hiển thị' : 'Select Display Currency'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INTERNATIONAL_CURRENCIES.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => setEditableProfile(prev => ({
                        ...prev,
                        currencyCode: curr.code,
                        currencySymbol: curr.symbol,
                        decimals: curr.decimals
                      }))}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                        editableProfile.currencyCode === curr.code
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-sm">{curr.code}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{curr.name.split('(')[0]}</div>
                      </div>
                      <span className="text-base font-bold text-slate-600 dark:text-slate-400">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {isVi ? 'Số chữ số thập phân (Decimals)' : 'Decimal Places'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isVi ? 'Ví dụ: 0 cho VND / JPY, 2 cho USD / EUR' : 'E.g., 0 for VND / JPY, 2 for USD / EUR'}
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0, 2].map(d => (
                    <button
                      key={d}
                      onClick={() => setEditableProfile(prev => ({ ...prev, decimals: d }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        editableProfile.decimals === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {d} {isVi ? 'chữ số' : 'decimals'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isVi ? 'Khôi phục chuẩn quốc gia' : 'Reset to Country Standards'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isVi ? 'Hủy bỏ' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isVi ? 'Lưu & Áp dụng ngay' : 'Save & Apply Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
