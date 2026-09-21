import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Cake,
  Clock,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  // Default birth date: 25 years ago
  const defaultBirthDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25);
    return d.toISOString().split('T')[0];
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [birthDateStr, setBirthDateStr] = useState<string>(defaultBirthDate);
  const [targetDateStr, setTargetDateStr] = useState<string>(todayStr);
  const [copied, setCopied] = useState<boolean>(false);

  // Age calculations
  const ageData = useMemo(() => {
    const birth = new Date(birthDateStr);
    const target = new Date(targetDateStr);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month of target
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    
    // Day of week born
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const bornDayOfWeek = daysOfWeek[birth.getDay()];
    const nextBdayDayOfWeek = daysOfWeek[nextBday.getDay()];

    // Zodiac Sign
    const day = birth.getDate();
    const month = birth.getMonth() + 1;
    let zodiac = { name: '', symbol: '', trait: '' };

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      zodiac = { name: 'Bạch Dương (Aries)', symbol: '♈', trait: 'Nhiệt huyết, dũng cảm, quyết đoán' };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      zodiac = { name: 'Kim Ngưu (Taurus)', symbol: '♉', trait: 'Kiên nhẫn, thực tế, đáng tin cậy' };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      zodiac = { name: 'Song Tử (Gemini)', symbol: '♊', trait: 'Thông minh, linh hoạt, thích giao tiếp' };
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      zodiac = { name: 'Cự Giải (Cancer)', symbol: '♋', trait: 'Giàu cảm xúc, chăm sóc, trực giác tốt' };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      zodiac = { name: 'Sư Tử (Leo)', symbol: '♌', trait: 'Tự tin, hào phóng, có tố chất lãnh đạo' };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      zodiac = { name: 'Xử Nữ (Virgo)', symbol: '♍', trait: 'Tỉ mỉ, cẩn thận, có trách nhiệm cao' };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
      zodiac = { name: 'Thiên Bình (Libra)', symbol: '♎', trait: 'Công bằng, hài hòa, duyên dáng' };
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
      zodiac = { name: 'Bọ Cạp (Scorpio)', symbol: '♏', trait: 'Mạnh mẽ, sâu sắc, trực giác nhạy bén' };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      zodiac = { name: 'Nhân Mã (Sagittarius)', symbol: '♐', trait: 'Lạc quan, yêu tự do, thích khám phá' };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      zodiac = { name: 'Ma Kết (Capricorn)', symbol: '♑', trait: 'Kiên định, kỷ luật, có hoài bão lớn' };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      zodiac = { name: 'Bảo Bình (Aquarius)', symbol: '♒', trait: 'Sáng tạo, độc lập, nhân ái' };
    } else {
      zodiac = { name: 'Song Ngư (Pisces)', symbol: '♓', trait: 'Thấu hiểu, giàu lòng trắc ẩn, nghệ sĩ' };
    }

    // Chinese Zodiac (Can Chi)
    const can = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const chi = ['Tý (Chuột)', 'Sửu (Trâu)', 'Dần (Hổ)', 'Mão (Mèo)', 'Thìn (Rồng)', 'Tỵ (Rắn)', 'Ngọ (Ngựa)', 'Mùi (Dê)', 'Thân (Khỉ)', 'Dậu (Gà)', 'Tuất (Chó)', 'Hợi (Lợn)'];
    const birthYear = birth.getFullYear();
    const canIndex = (birthYear + 6) % 10;
    const chiIndex = (birthYear + 8) % 12;
    const canChi = `${can[canIndex]} ${chi[chiIndex]}`;

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysToNextBday,
      bornDayOfWeek,
      nextBdayDayOfWeek,
      zodiac,
      canChi,
    };
  }, [birthDateStr, targetDateStr]);

  const copyResult = () => {
    if (!ageData) return;
    const text = `Tuổi của tôi: ${ageData.years} tuổi, ${ageData.months} tháng, ${ageData.days} ngày (Tổng ${ageData.totalDays.toLocaleString('vi-VN')} ngày sống). Sinh vào ${ageData.bornDayOfWeek}, Cung ${ageData.zodiac.name}, Năm ${ageData.canChi}. Tính tại Web Calculator`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Inputs (Col 1-5) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Birth Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Ngày, tháng, năm sinh</span>
            </label>
            <input
              type="date"
              value={birthDateStr}
              max={todayStr}
              onChange={(e) => setBirthDateStr(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Calculate to date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Tính tuổi đến thời điểm</span>
            </label>
            <input
              type="date"
              value={targetDateStr}
              onChange={(e) => setTargetDateStr(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Quick preset birth years */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-medium">Chọn nhanh năm sinh thế hệ:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[2005, 2000, 1995, 1990, 1985, 1980].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setBirthDateStr(`${year}-06-15`)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  Năm {year}
                </button>
              ))}
            </div>
          </div>

          {/* Life philosophy quote */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Thời gian là vốn quý nhất
            </span>
            <p className="text-[11px] leading-relaxed text-blue-800">
              Mỗi ngày trôi qua là một trang nhật ký mới. Hãy trân trọng từng khoảnh khắc ý nghĩa bên những người bạn thương yêu!
            </p>
          </div>

        </div>

        {/* Right Results Card (Col 6-12) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-5">
          
          {ageData ? (
            <>
              {/* Primary Age Result - Highlight color: #10B981 */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Độ Tuổi Chính Xác Của Bạn
                  </span>
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Big Age Stat */}
                <div className="flex flex-wrap items-baseline gap-2 mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
                    {ageData.years}
                  </span>
                  <span className="text-lg font-bold text-slate-600">tuổi</span>
                  <span className="text-2xl font-bold text-blue-600 font-mono">
                    {ageData.months}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">tháng</span>
                  <span className="text-2xl font-bold text-[#10B981] font-mono">
                    {ageData.days}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">ngày</span>
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  Bạn sinh vào <strong>{ageData.bornDayOfWeek}</strong>
                </p>
              </div>

              {/* Next Birthday Countdown */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block">Sinh nhật kế tiếp</span>
                    <span className="text-sm font-bold text-slate-900">
                      Còn {ageData.daysToNextBday} ngày nữa ({ageData.nextBdayDayOfWeek})
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
                  {ageData.daysToNextBday === 0 ? 'Hôm nay! 🎂' : `${ageData.daysToNextBday} ngày`}
                </span>
              </div>

              {/* Lived Metrics Grid */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Tổng Thời Gian Đã Trải Qua
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số ngày</span>
                    <span className="text-base font-bold text-blue-600 font-mono">
                      {ageData.totalDays.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số tuần</span>
                    <span className="text-base font-bold text-slate-800 font-mono">
                      {ageData.totalWeeks.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số tháng</span>
                    <span className="text-base font-bold text-slate-800 font-mono">
                      {ageData.totalMonths.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs col-span-1 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số giờ</span>
                    <span className="text-sm font-bold text-slate-800 font-mono">
                      {ageData.totalHours.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs col-span-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tổng số phút</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      {ageData.totalMinutes.toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Zodiac & Can Chi Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-medium text-slate-500 block">Cung Hoàng Đạo</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-base">{ageData.zodiac.symbol}</span>
                    <span className="text-xs font-bold text-slate-900">{ageData.zodiac.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{ageData.zodiac.trait}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-medium text-slate-500 block">Năm Âm Lịch (Can Chi)</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Năm {ageData.canChi}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Con giáp tính theo chu kỳ Can Chi</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-rose-500 text-sm font-medium">
              Vui lòng chọn ngày kết thúc lớn hơn hoặc bằng ngày sinh.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
