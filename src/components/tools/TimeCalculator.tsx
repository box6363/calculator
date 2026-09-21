import React, { useState, useMemo } from 'react';
import {
  Clock,
  Plus,
  Minus,
  Check,
  Copy
} from 'lucide-react';

export const TimeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'duration' | 'arithmetic' | 'timesheet'>('duration');
  const [copied, setCopied] = useState<boolean>(false);

  // Tab 1: Duration between two times
  const [startTime, setStartTime] = useState<string>('08:30');
  const [endTime, setEndTime] = useState<string>('17:45');
  const [breakMinutes, setBreakMinutes] = useState<number>(60); // Lunch break

  // Tab 2: Add/Subtract from a time
  const [baseTime, setBaseTime] = useState<string>('14:30');
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [addHours, setAddHours] = useState<number>(3);
  const [addMinutes, setAddMinutes] = useState<number>(45);

  // Tab 3: Timesheet simple list
  const [shifts, setShifts] = useState<{ day: string; start: string; end: string; breakMin: number }[]>([
    { day: 'Thứ Hai', start: '08:00', end: '17:00', breakMin: 60 },
    { day: 'Thứ Ba', start: '08:00', end: '17:30', breakMin: 60 },
    { day: 'Thứ Tư', start: '08:30', end: '17:30', breakMin: 60 },
    { day: 'Thứ Năm', start: '08:00', end: '17:00', breakMin: 60 },
    { day: 'Thứ Sáu', start: '08:00', end: '16:30', breakMin: 30 },
  ]);

  // Calculations for Duration
  const durationResult = useMemo(() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    let startTotalM = sh * 60 + sm;
    let endTotalM = eh * 60 + em;

    // Overnight support (e.g. 22:00 to 06:00 next day)
    if (endTotalM < startTotalM) {
      endTotalM += 24 * 60;
    }

    const grossMinutes = endTotalM - startTotalM;
    const netMinutes = Math.max(0, grossMinutes - breakMinutes);

    const hours = Math.floor(netMinutes / 60);
    const minutes = netMinutes % 60;
    const decimalHours = Number((netMinutes / 60).toFixed(2));
    const totalSeconds = netMinutes * 60;

    return {
      grossMinutes,
      netMinutes,
      hours,
      minutes,
      decimalHours,
      totalSeconds
    };
  }, [startTime, endTime, breakMinutes]);

  // Calculations for Arithmetic
  const arithmeticResult = useMemo(() => {
    const [h, m] = baseTime.split(':').map(Number);
    let totalMinutes = h * 60 + m;
    const delta = addHours * 60 + addMinutes;

    if (op === 'add') {
      totalMinutes += delta;
    } else {
      totalMinutes -= delta;
    }

    // Wrap around 24 hours
    totalMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);

    const resH = Math.floor(totalMinutes / 60);
    const resM = totalMinutes % 60;
    const formatted = `${String(resH).padStart(2, '0')}:${String(resM).padStart(2, '0')}`;

    return {
      formatted,
      resH,
      resM
    };
  }, [baseTime, op, addHours, addMinutes]);

  // Calculations for Timesheet
  const timesheetResult = useMemo(() => {
    let totalMins = 0;
    const rows = shifts.map(shift => {
      const [sh, sm] = shift.start.split(':').map(Number);
      const [eh, em] = shift.end.split(':').map(Number);
      let sM = sh * 60 + sm;
      let eM = eh * 60 + em;
      if (eM < sM) eM += 24 * 60;
      const net = Math.max(0, eM - sM - shift.breakMin);
      totalMins += net;
      return {
        ...shift,
        netHours: Number((net / 60).toFixed(2))
      };
    });

    const totalHours = Math.floor(totalMins / 60);
    const totalRemainingMinutes = totalMins % 60;
    const totalDecimal = Number((totalMins / 60).toFixed(2));

    return {
      rows,
      totalHours,
      totalRemainingMinutes,
      totalDecimal
    };
  }, [shifts]);

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'duration') {
      text = `Khoảng thời gian: từ ${startTime} đến ${endTime} (nghỉ ${breakMinutes} phút)\n- Kết quả: ${durationResult.hours} giờ ${durationResult.minutes} phút\n- Số giờ quy đổi thập phân: ${durationResult.decimalHours} giờ`;
    } else if (activeTab === 'arithmetic') {
      text = `Cộng/Trừ thời gian: ${baseTime} ${op === 'add' ? '+' : '-'} ${addHours}h ${addMinutes}m = ${arithmeticResult.formatted}`;
    } else {
      text = `Bảng chấm công tổng tuần: ${timesheetResult.totalHours} giờ ${timesheetResult.totalRemainingMinutes} phút (${timesheetResult.totalDecimal} giờ)`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="time-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Time Calculator (Tính Thời Gian)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cộng trừ giờ phút, đo khoảng cách thời gian giữa 2 mốc và quy đổi số giờ công tính lương.
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
          onClick={() => setActiveTab('duration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'duration' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Khoảng cách 2 mốc giờ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('arithmetic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'arithmetic' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cộng / Trừ giờ phút
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timesheet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'timesheet' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Chấm công tuần
        </button>
      </div>

      {/* Mode 1: Duration */}
      {activeTab === 'duration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nhập mốc thời gian bắt đầu &amp; kết thúc
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">Giờ bắt đầu:</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1.5">Giờ kết thúc:</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-semibold">Thời gian nghỉ trừ ra:</span>
                <span className="font-bold text-slate-900">{breakMinutes} phút ({Number((breakMinutes / 60).toFixed(1))} giờ)</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={5}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex gap-2 pt-1">
                {[0, 30, 45, 60, 90].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setBreakMinutes(m)}
                    className={`text-[11px] px-2 py-1 rounded-lg border font-semibold ${
                      breakMinutes === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              * Tự động nhận diện trường hợp ca làm việc qua đêm (qua 00:00 sáng hôm sau).
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Tổng thời gian thực tế (Net Duration)
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
                  {durationResult.hours}h {durationResult.minutes}m
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                  <span className="text-slate-400 block mb-0.5">Số giờ thập phân (tính lương)</span>
                  <span className="text-xl font-black text-indigo-400 font-mono">
                    {durationResult.decimalHours} giờ
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                  <span className="text-slate-400 block mb-0.5">Tổng số giây</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {durationResult.totalSeconds.toLocaleString()} s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Arithmetic (Add / Subtract) */}
      {activeTab === 'arithmetic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cộng hoặc trừ từ một mốc thời gian
            </h3>

            <div className="text-xs">
              <label className="text-slate-600 font-semibold block mb-1.5">Mốc thời gian ban đầu:</label>
              <input
                type="time"
                value={baseTime}
                onChange={(e) => setBaseTime(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOp('add')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                  op === 'add' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Plus className="w-4 h-4" /> Cộng thêm (+)
              </button>
              <button
                type="button"
                onClick={() => setOp('subtract')}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 ${
                  op === 'subtract' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                <Minus className="w-4 h-4" /> Trừ đi (-)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Số giờ:</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={addHours}
                  onChange={(e) => setAddHours(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Số phút:</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={addMinutes}
                  onChange={(e) => setAddMinutes(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Mốc thời gian kết quả
              </span>

              <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white py-2">
                {arithmeticResult.formatted}
              </div>

              <p className="text-xs text-indigo-200 border-t border-slate-800 pt-3">
                {baseTime} {op === 'add' ? 'cộng' : 'trừ'} {addHours} giờ {addMinutes} phút = {arithmeticResult.formatted}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Timesheet */}
      {activeTab === 'timesheet' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3 overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2">Thứ</th>
                  <th className="py-2">Vào ca</th>
                  <th className="py-2">Tan ca</th>
                  <th className="py-2">Nghỉ trưa (phút)</th>
                  <th className="py-2 text-right">Giờ công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {shifts.map((shift, idx) => {
                  const [sh, sm] = shift.start.split(':').map(Number);
                  const [eh, em] = shift.end.split(':').map(Number);
                  let sM = sh * 60 + sm;
                  let eM = eh * 60 + em;
                  if (eM < sM) eM += 24 * 60;
                  const net = Math.max(0, eM - sM - shift.breakMin);
                  const netH = Number((net / 60).toFixed(2));
                  return (
                    <tr key={shift.day} className="hover:bg-slate-100/50">
                      <td className="py-2.5 font-bold text-slate-800">{shift.day}</td>
                      <td className="py-2">
                        <input
                          type="time"
                          value={shift.start}
                          onChange={(e) => {
                            const newShifts = [...shifts];
                            newShifts[idx].start = e.target.value;
                            setShifts(newShifts);
                          }}
                          className="p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="time"
                          value={shift.end}
                          onChange={(e) => {
                            const newShifts = [...shifts];
                            newShifts[idx].end = e.target.value;
                            setShifts(newShifts);
                          }}
                          className="p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          step={5}
                          min={0}
                          max={120}
                          value={shift.breakMin}
                          onChange={(e) => {
                            const newShifts = [...shifts];
                            newShifts[idx].breakMin = Number(e.target.value);
                            setShifts(newShifts);
                          }}
                          className="w-16 p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                        />
                      </td>
                      <td className="py-2 text-right font-bold text-indigo-600 font-mono text-sm">
                        {netH}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-5 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Tổng giờ làm việc trong tuần</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-0.5">
                {timesheetResult.totalHours} giờ {timesheetResult.totalRemainingMinutes} phút
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-xs text-slate-400 block">Quy đổi số thập phân</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                {timesheetResult.totalDecimal} giờ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
