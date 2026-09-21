import React from 'react';
import { 
  DetailedCalculationResult, 
  formatCurrency 
} from '../../utils/salaryEngine';
import { 
  CountrySalaryProfile, 
  PayPeriod, 
  PERIOD_LABELS 
} from '../../data/salaryInternationalData';
import { Calendar } from 'lucide-react';

interface SalaryMultiPeriodTableProps {
  result: DetailedCalculationResult;
  profile: CountrySalaryProfile;
  currentPeriod: PayPeriod;
  onSelectPeriod: (period: PayPeriod) => void;
  lang: string;
}

export const SalaryMultiPeriodTable: React.FC<SalaryMultiPeriodTableProps> = ({
  result,
  profile,
  currentPeriod,
  onSelectPeriod,
  lang
}) => {
  const isVi = lang === 'vi';
  const periods: PayPeriod[] = ['annual', 'monthly', 'biweekly', 'weekly', 'hourly'];

  const rows = [
    {
      key: 'gross',
      labelEn: 'Gross Salary',
      labelVi: 'Lương Gross (Tổng thu nhập)',
      isHighlight: false,
      getValue: (p: PayPeriod) => result.periods[p].gross,
      color: 'text-slate-900 dark:text-slate-100 font-semibold'
    },
    {
      key: 'insurance',
      labelEn: 'Social Security & Insurances',
      labelVi: 'Bảo hiểm & An sinh NLĐ đóng',
      isHighlight: false,
      getValue: (p: PayPeriod) => result.periods[p].employeeInsurance,
      color: 'text-amber-600 dark:text-amber-400 font-semibold'
    },
    {
      key: 'tax',
      labelEn: 'Income Tax',
      labelVi: 'Thuế Thu nhập Cá nhân (PIT)',
      isHighlight: false,
      getValue: (p: PayPeriod) => result.periods[p].tax,
      color: 'text-rose-600 dark:text-rose-400 font-semibold'
    },
    {
      key: 'net',
      labelEn: 'Net Take-Home Pay',
      labelVi: 'LƯƠNG NET THỰC NHẬN',
      isHighlight: true,
      getValue: (p: PayPeriod) => result.periods[p].net,
      color: 'text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      key: 'employerCost',
      labelEn: 'Total Employer Cost',
      labelVi: 'Tổng chi phí Doanh nghiệp trả',
      isHighlight: false,
      getValue: (p: PayPeriod) => result.periods[p].totalEmployerCost,
      color: 'text-indigo-600 dark:text-indigo-300 font-medium'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="px-4 py-3.5 bg-slate-100 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
            {isVi ? 'Bảng Đối chiếu Chu kỳ Lương Chuẩn Quốc tế' : 'International Multi-Period Salary Conversion'}
          </h4>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {isVi ? 'Quy đổi Năm ↔ Tháng ↔ 2 Tuần ↔ Tuần ↔ Giờ' : 'Equivalents across Year ↔ Month ↔ Bi-week ↔ Week ↔ Hour'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-950/90 text-slate-800 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3 sm:px-4">{isVi ? 'Hạng mục' : 'Component'}</th>
              {periods.map(p => {
                const isCurrent = currentPeriod === p;
                return (
                  <th 
                    key={p} 
                    className={`py-3 px-3 sm:px-4 text-right cursor-pointer transition-colors ${
                      isCurrent ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                    onClick={() => onSelectPeriod(p)}
                    title={isVi ? 'Nhấp để đổi chu kỳ tính' : 'Click to select this pay period'}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{isVi ? PERIOD_LABELS[p].vi : PERIOD_LABELS[p].en}</span>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {rows.map(row => (
              <tr 
                key={row.key} 
                className={`${row.isHighlight ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
              >
                <td className="py-2.5 px-3 sm:px-4 font-medium text-slate-800 dark:text-slate-200">
                  {isVi ? row.labelVi : row.labelEn}
                </td>
                {periods.map(p => {
                  const val = row.getValue(p);
                  const isCurrent = currentPeriod === p;
                  return (
                    <td 
                      key={p} 
                      className={`py-2.5 px-3 sm:px-4 text-right tabular-nums ${row.color} ${
                        isCurrent ? (row.isHighlight ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200' : 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200') : ''
                      }`}
                    >
                      {formatCurrency(val, profile.currencySymbol, profile.decimals)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>
          {isVi 
            ? '* Chu kỳ giờ tính trên tiêu chuẩn quốc tế: 40 giờ/tuần (2.080 giờ/năm)' 
            : '* Hourly rate calculated on international standard: 40 hrs/week (2,080 hrs/year)'}
        </span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {profile.flag} {profile.currencyCode}
        </span>
      </div>
    </div>
  );
};
