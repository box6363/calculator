import React, { useState, useMemo } from 'react';
import { Baby, Calendar, RotateCcw, Heart } from 'lucide-react';
import {
  parseLocalDate,
  formatLocalISODate
} from '../../utils/dateUtils';

export const PregnancyCalculator: React.FC = () => {
  // Method: lmp (Last Menstrual Period), conception (Conception Date), ivf (IVF Transfer)
  const [calcMethod, setCalcMethod] = useState<'lmp' | 'conception'>('lmp');
  
  // Default to 8 weeks ago in local time
  const defaultLmp = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 56);
    return formatLocalISODate(d);
  }, []);
  const [inputDate, setInputDate] = useState<string>(defaultLmp);
  const [cycleLengthDays, setCycleLengthDays] = useState<number>(28);

  const calculations = useMemo(() => {
    const baseDate = parseLocalDate(inputDate);
    if (isNaN(baseDate.getTime())) {
      return null;
    }

    let dueDate = new Date(baseDate);
    let gestationalDays = 0;

    if (calcMethod === 'lmp') {
      // Naegele's rule: LMP + 280 days + (cycleLength - 28) days
      const cycleAdjustment = cycleLengthDays - 28;
      dueDate.setDate(dueDate.getDate() + 280 + cycleAdjustment);
      
      const today = new Date();
      gestationalDays = Math.round((today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      // Conception date: Conception + 266 days
      dueDate.setDate(dueDate.getDate() + 266);
      
      const today = new Date();
      // Conception is gestational day 14 approximately
      gestationalDays = Math.round((today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)) + 14;
    }

    const currentWeeks = Math.floor(gestationalDays / 7);
    const currentDays = gestationalDays % 7;
    const daysRemaining = Math.max(0, Math.round((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    // Trimester
    let trimester = 'Tam cá nguyệt thứ nhất (Tuần 1 - 13)';
    let trimesterColor = 'text-amber-400';
    if (currentWeeks >= 28) {
      trimester = 'Tam cá nguyệt thứ ba (Tuần 28 - 40+)';
      trimesterColor = 'text-rose-400';
    } else if (currentWeeks >= 14) {
      trimester = 'Tam cá nguyệt thứ hai (Tuần 14 - 27)';
      trimesterColor = 'text-teal-400';
    }

    return {
      dueDate: dueDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      currentWeeks: Math.max(0, currentWeeks),
      currentDays: Math.max(0, currentDays),
      daysRemaining,
      trimester,
      trimesterColor,
      progressPercent: Math.min(100, Math.max(0, Math.round((gestationalDays / 280) * 100)))
    };
  }, [inputDate, calcMethod, cycleLengthDays]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-900/40 via-slate-800 to-slate-900 border border-pink-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-600/20 text-pink-400 rounded-xl border border-pink-500/30">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Pregnancy & Due Date Calculator – Tính Ngày Dự Sinh</h1>
            <p className="text-xs sm:text-sm text-slate-400">Dự đoán ngày sinh nở chính xác theo chu kỳ kinh nguyệt (LMP) hoặc ngày thụ thai</p>
          </div>
        </div>
        <button
          id="pregnancy-reset-btn"
          onClick={() => { setCalcMethod('lmp'); setInputDate(defaultLmp); setCycleLengthDays(28); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-400" />
            Phương pháp tính toán
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="calc-method-lmp"
              onClick={() => setCalcMethod('lmp')}
              className={`py-2 px-2 text-xs rounded-xl border font-medium transition-all ${
                calcMethod === 'lmp' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Ngày đầu kỳ kinh cuối (LMP)
            </button>
            <button
              type="button"
              id="calc-method-conception"
              onClick={() => setCalcMethod('conception')}
              className={`py-2 px-2 text-xs rounded-xl border font-medium transition-all ${
                calcMethod === 'conception' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Ngày thụ thai (Conception)
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {calcMethod === 'lmp' ? 'Ngày đầu tiên của kỳ kinh nguyệt cuối cùng' : 'Ngày thụ thai ước tính'}
            </label>
            <input
              id="pregnancy-input-date"
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          {calcMethod === 'lmp' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Độ dài chu kỳ kinh nguyệt bình thường (ngày)</label>
              <input
                id="pregnancy-cycle-length"
                type="number"
                value={cycleLengthDays}
                onChange={(e) => setCycleLengthDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
          )}
        </div>

        {calculations && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-pink-950/40 to-slate-900 border border-pink-500/40 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-pink-300 font-semibold flex items-center justify-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                NGÀY DỰ SINH ƯỚC TÍNH (DUE DATE)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-pink-300 font-sans">
                {calculations.dueDate}
              </div>
              <p className="text-xs text-slate-400">
                Còn khoảng <span className="text-pink-400 font-bold font-sans">{calculations.daysRemaining} ngày</span> nữa đến ngày đón bé yêu
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Tuổi thai hiện tại</span>
                <div className="text-lg sm:text-xl font-bold text-white font-sans">
                  {calculations.currentWeeks} tuần {calculations.currentDays} ngày
                </div>
              </div>
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">Giai đoạn thai kỳ</span>
                <div className={`text-xs sm:text-sm font-bold ${calculations.trimesterColor}`}>
                  {calculations.trimester}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Tiến trình thai kỳ</span>
                <span className="text-white font-bold font-sans">{calculations.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-500" 
                  style={{ width: `${calculations.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
