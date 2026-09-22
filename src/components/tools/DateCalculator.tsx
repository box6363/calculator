import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Plus,
  Minus,
  CalendarDays,
  Clock,
  Briefcase
} from 'lucide-react';
import {
  parseLocalDate,
  formatLocalISODate,
  getTodayLocalISODate
} from '../../utils/dateUtils';

export const DateCalculator: React.FC = () => {
  const [tab, setTab] = useState<'difference' | 'add_subtract'>('difference');
  const [copied, setCopied] = useState<boolean>(false);

  // Mode 1: Difference
  const todayStr = useMemo(() => getTodayLocalISODate(), []);
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return formatLocalISODate(d);
  });
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);

  // Mode 2: Add/Subtract
  const [baseDate, setBaseDate] = useState<string>(todayStr);
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [addYears, setAddYears] = useState<number>(0);
  const [addMonths, setAddMonths] = useState<number>(1);
  const [addWeeks, setAddWeeks] = useState<number>(0);
  const [addDays, setAddDays] = useState<number>(15);

  // Calculation for Difference
  const diffResult = useMemo(() => {
    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    let diffMs = end.getTime() - start.getTime();
    const isReversed = diffMs < 0;
    if (isReversed) diffMs = Math.abs(diffMs);

    let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (includeEndDate && !isReversed) totalDays += 1;

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Working days (business days excluding Saturday & Sunday)
    let businessDays = 0;
    const cur = new Date(isReversed ? end : start);
    const target = new Date(isReversed ? start : end);
    while (cur < target) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (includeEndDate) {
      const endDayOfWeek = target.getDay();
      if (endDayOfWeek !== 0 && endDayOfWeek !== 6) businessDays++;
    }

    const hours = totalDays * 24;
    const minutes = hours * 60;

    return {
      totalDays,
      weeks,
      remainingDays,
      businessDays,
      hours,
      minutes,
      isReversed
    };
  }, [startDate, endDate, includeEndDate]);

  // Calculation for Add/Subtract
  const calcDateResult = useMemo(() => {
    const d = parseLocalDate(baseDate);
    if (isNaN(d.getTime())) return null;

    const sign = op === 'add' ? 1 : -1;
    d.setFullYear(d.getFullYear() + sign * addYears);
    d.setMonth(d.getMonth() + sign * addMonths);
    const daysOffset = (addWeeks * 7 + addDays) * sign;
    d.setDate(d.getDate() + daysOffset);

    const dayOfWeekNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayOfWeek = dayOfWeekNames[d.getDay()];
    const formatted = d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      dateObj: d,
      dayOfWeek,
      formatted,
      iso: formatLocalISODate(d)
    };
  }, [baseDate, op, addYears, addMonths, addWeeks, addDays]);

  const handleCopy = () => {
    let text = '';
    if (tab === 'difference' && diffResult) {
      text = `Khoảng cách giữa ${startDate} và ${endDate}:
- Tổng số ngày: ${diffResult.totalDays} ngày
- Quy đổi: ${diffResult.weeks} tuần và ${diffResult.remainingDays} ngày
- Số ngày làm việc (không tính T7, CN): ${diffResult.businessDays} ngày`;
    } else if (tab === 'add_subtract' && calcDateResult) {
      text = `Kết quả tính ngày: ${baseDate} ${op === 'add' ? '+' : '-'} (${addYears} năm, ${addMonths} tháng, ${addDays} ngày) = ${calcDateResult.formatted} (${calcDateResult.dayOfWeek})`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="date-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Date Calculator (Tính Số Ngày)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính khoảng cách số ngày, tuần, tháng giữa 2 mốc thời gian và cộng/trừ ngày tháng năm chính xác.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setTab('difference')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'difference' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đếm số ngày giữa 2 ngày
        </button>
        <button
          type="button"
          onClick={() => setTab('add_subtract')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'add_subtract' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cộng / Trừ ngày tháng
        </button>
      </div>

      {/* Mode 1: Difference */}
      {tab === 'difference' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chọn mốc ngày bắt đầu và kết thúc
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Ngày bắt đầu:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Ngày kết thúc:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={includeEndDate}
                    onChange={(e) => setIncludeEndDate(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                  />
                  <span>Bao gồm cả ngày kết thúc (+1 ngày)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {diffResult && (
              <>
                <div className="bg-white dark:bg-gradient-to-br dark:from-rose-900 dark:via-slate-900 dark:to-pink-950 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    Tổng số ngày cách biệt
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {diffResult.totalDays.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-rose-200">ngày</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-rose-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                    Tương đương: <strong className="text-slate-900 dark:text-white">{diffResult.weeks} tuần</strong> và <strong className="text-slate-900 dark:text-white">{diffResult.remainingDays} ngày</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Ngày làm việc (T2-T6)
                    </span>
                    <span className="text-2xl font-black text-blue-600 font-mono">
                      {diffResult.businessDays} ngày
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">Đã loại trừ Thứ 7 &amp; Chủ Nhật</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Tổng số giờ
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {diffResult.hours.toLocaleString()} h
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">={diffResult.minutes.toLocaleString()} phút</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Add/Subtract */}
      {tab === 'add_subtract' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cộng hoặc trừ ngày từ mốc ban đầu
            </h3>

            <div className="text-xs">
              <label className="text-slate-600 font-semibold block mb-1">Mốc ngày gốc:</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOp('add')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                  op === 'add' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Plus className="w-4 h-4" /> Cộng thêm tương lai (+)
              </button>
              <button
                type="button"
                onClick={() => setOp('subtract')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                  op === 'subtract' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Minus className="w-4 h-4" /> Trừ lùi quá khứ (-)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Năm:</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={addYears}
                  onChange={(e) => setAddYears(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Tháng:</label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={addMonths}
                  onChange={(e) => setAddMonths(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Tuần:</label>
                <input
                  type="number"
                  min={0}
                  max={520}
                  value={addWeeks}
                  onChange={(e) => setAddWeeks(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Ngày:</label>
                <input
                  type="number"
                  min={0}
                  max={3650}
                  value={addDays}
                  onChange={(e) => setAddDays(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {calcDateResult && (
              <div className="bg-white dark:bg-gradient-to-br dark:from-rose-900 dark:via-slate-900 dark:to-indigo-950 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  Ngày kết quả
                </span>

                <div className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white py-2">
                  {calcDateResult.formatted}
                </div>

                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-xs flex justify-between items-center text-slate-800 dark:text-white">
                  <span className="text-slate-600 dark:text-rose-200">Thứ trong tuần:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{calcDateResult.dayOfWeek}</span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ISO Format: {calcDateResult.iso}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
