import React, { useState, useMemo } from 'react';
import {
  Heart,
  Check,
  Copy,
  Baby
} from 'lucide-react';
import {
  parseLocalDate,
  getTodayLocalISODate
} from '../../utils/dateUtils';

export const OvulationCalculator: React.FC = () => {
  const todayStr = useMemo(() => getTodayLocalISODate(), []);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(todayStr);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lutealPhase, setLutealPhase] = useState<number>(14);
  const [copied, setCopied] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const lmp = parseLocalDate(lastPeriodDate);
    if (isNaN(lmp.getTime())) return null;

    // Ovulation date: LMP + (cycleLength - lutealPhase)
    const ovulationOffsetDays = cycleLength - lutealPhase;
    const ovulationDate = new Date(lmp);
    ovulationDate.setDate(ovulationDate.getDate() + ovulationOffsetDays);

    // Fertile window: 5 days before ovulation up to 1 day after
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Next period: LMP + cycleLength
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    // Due date (Naegele's rule: LMP + 280 days)
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);

    // Next 3 cycles
    const futureCycles = [1, 2, 3].map(i => {
      const futureLmp = new Date(lmp);
      futureLmp.setDate(futureLmp.getDate() + (cycleLength * i));
      const futureOvu = new Date(futureLmp);
      futureOvu.setDate(futureOvu.getDate() + ovulationOffsetDays);
      return {
        cycleNum: i + 1,
        ovulationStr: futureOvu.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric', year: 'numeric' }),
        periodStr: futureLmp.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      };
    });

    const formatDate = (d: Date) => d.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return {
      ovulationDateStr: formatDate(ovulationDate),
      fertileWindowStr: `${fertileStart.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })} - ${fertileEnd.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}`,
      nextPeriodStr: formatDate(nextPeriod),
      dueDateStr: formatDate(dueDate),
      futureCycles
    };
  }, [lastPeriodDate, cycleLength, lutealPhase]);

  const handleCopy = () => {
    if (!calculations) return;
    const text = `Dự đoán ngày rụng trứng & Chu kỳ sinh sản:
- Ngày đầu chu kỳ kinh cuối: ${lastPeriodDate} (độ dài chu kỳ ${cycleLength} ngày)
- Ngày rụng trứng dự kiến: ${calculations.ovulationDateStr}
- Khoảng thời gian dễ thụ thai nhất: ${calculations.fertileWindowStr}
- Ngày bắt đầu chu kỳ kinh tiếp theo: ${calculations.nextPeriodStr}
- Ngày dự sinh (nếu thụ thai kỳ này): ${calculations.dueDateStr}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ovulation-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Heart className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ovulation Calculator (Dự Đoán Rụng Trứng)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính toán ngày rụng trứng, khoảng thời gian dễ thụ thai và dự đoán các chu kỳ sắp tới.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Ngày đầu tiên của kỳ kinh gần nhất
              </label>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Độ dài chu kỳ trung bình:</span>
                <span className="text-rose-600 font-mono text-sm">{cycleLength} ngày</span>
              </div>
              <input
                type="range"
                min={21}
                max={45}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>21 ngày (ngắn)</span>
                <span>28 ngày (tiêu chuẩn)</span>
                <span>45 ngày (dài)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Độ dài pha hoàng thể (Luteal phase):</span>
                <span className="font-mono text-slate-900 font-bold">{lutealPhase} ngày</span>
              </div>
              <input
                type="range"
                min={10}
                max={16}
                value={lutealPhase}
                onChange={(e) => setLutealPhase(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="text-[11px] text-slate-400 block mt-0.5">
                * Thường dao động từ 12 - 14 ngày đối với đa số phụ nữ.
              </span>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          {calculations && (
            <>
              {/* Ovulation Hero Card */}
              <div className="bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Ngày rụng trứng ước tính
                </span>

                <div className="text-2xl sm:text-4xl font-black tracking-tight text-white py-1">
                  {calculations.ovulationDateStr}
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1">
                  <span className="text-rose-200 block font-semibold">Cửa sổ thụ thai cao nhất (Fertile Window):</span>
                  <span className="text-base font-bold text-white font-mono">{calculations.fertileWindowStr}</span>
                </div>
              </div>

              {/* Extra milestones */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">Kỳ kinh tiếp theo</span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {calculations.nextPeriodStr}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1">
                    <Baby className="w-3.5 h-3.5 text-pink-600" /> Ngày dự sinh (nếu đậu thai)
                  </span>
                  <span className="text-sm font-bold text-pink-600 block">
                    {calculations.dueDateStr}
                  </span>
                </div>
              </div>

              {/* Upcoming Cycles Forecast */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  Dự báo 3 chu kỳ kế tiếp
                </span>
                <div className="divide-y divide-slate-200 text-slate-600">
                  {calculations.futureCycles.map(c => (
                    <div key={c.cycleNum} className="py-2 flex justify-between items-center">
                      <span>Chu kỳ #{c.cycleNum}:</span>
                      <span className="font-mono text-slate-800">
                        Kinh nguyệt: <strong>{c.periodStr}</strong> | Rụng trứng: <strong className="text-rose-600">{c.ovulationStr}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
