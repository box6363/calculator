import React, { useState } from 'react';
import {
  Dice5,
  Shuffle,
  RotateCcw,
  Check,
  Copy,
  Trophy
} from 'lucide-react';

export const RandomNumberCalculator: React.FC = () => {
  const [tab, setTab] = useState<'range' | 'dice' | 'picker'>('range');

  // Mode 1: Range
  const [minVal, setMinVal] = useState<number>(1);
  const [maxVal, setMaxVal] = useState<number>(100);
  const [count, setCount] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortResult, setSortResult] = useState<boolean>(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([7, 23, 42, 68, 91]);

  // Mode 2: Dice
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceRolls, setDiceRolls] = useState<number[]>([4, 6]);

  // Mode 3: Picker
  const [namesText, setNamesText] = useState<string>('Nguyễn Văn A\nTrần Thị B\nLê Hoàng C\nPhạm Minh D\nVũ Thu Trang\nĐặng Quốc Tuấn');
  const [winner, setWinner] = useState<string | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  const generateRandomNumbers = () => {
    const effectiveMin = Math.min(minVal, maxVal);
    const effectiveMax = Math.max(minVal, maxVal);
    const rangeSpan = effectiveMax - effectiveMin + 1;

    let results: number[] = [];
    if (!allowDuplicates && count <= rangeSpan) {
      const pool = Array.from({ length: rangeSpan }, (_, i) => effectiveMin + i);
      for (let i = 0; i < count; i++) {
        const randIdx = Math.floor(Math.random() * pool.length);
        results.push(pool[randIdx]);
        pool.splice(randIdx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * rangeSpan) + effectiveMin);
      }
    }

    if (sortResult) {
      results.sort((a, b) => a - b);
    }
    setGeneratedNumbers(results);
  };

  const rollDice = () => {
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1);
    setDiceRolls(rolls);
  };

  const pickWinner = () => {
    const list = namesText.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    const rand = Math.floor(Math.random() * list.length);
    setWinner(list[rand]);
  };

  const handleCopy = () => {
    let text = '';
    if (tab === 'range') {
      text = `Dãy số ngẫu nhiên [${minVal} - ${maxVal}]: ${generatedNumbers.join(', ')}`;
    } else if (tab === 'dice') {
      const sum = diceRolls.reduce((a, b) => a + b, 0);
      text = `Tung ${diceCount} xúc xắc d${diceSides}: ${diceRolls.join(' + ')} = ${sum}`;
    } else {
      text = `Người may mắn trúng thưởng: ${winner || 'Chưa quay'}`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="random-number-calculator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Dice5 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Random Number Generator (Quay Số Ngẫu Nhiên)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bộ công cụ tạo số ngẫu nhiên chuẩn mật mã, tung xúc xắc đa diện và bốc thăm quay thưởng.
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
          onClick={() => setTab('range')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'range' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Tạo số trong khoảng (Min - Max)
        </button>
        <button
          type="button"
          onClick={() => setTab('dice')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'dice' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Tung xúc xắc (Dice Roller)
        </button>
        <button
          type="button"
          onClick={() => setTab('picker')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'picker' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Bốc thăm may mắn (Lucky Draw)
        </button>
      </div>

      {/* Tab 1: Range */}
      {tab === 'range' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cấu hình khoảng số</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Số nhỏ nhất (Min):</label>
                <input
                  type="number"
                  value={minVal}
                  onChange={(e) => setMinVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Số lớn nhất (Max):</label>
                <input
                  type="number"
                  value={maxVal}
                  onChange={(e) => setMaxVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="text-xs">
              <div className="flex justify-between font-semibold text-slate-600 mb-1">
                <span>Số lượng số cần tạo:</span>
                <span className="font-bold text-slate-900">{count} số</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                />
                <span>Cho phép số trùng lặp</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={sortResult}
                  onChange={(e) => setSortResult(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                />
                <span>Sắp xếp kết quả từ nhỏ đến lớn</span>
              </label>
            </div>

            <button
              type="button"
              onClick={generateRandomNumbers}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Shuffle className="w-4 h-4" /> Quay số ngẫu nhiên ngay
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gradient-to-br from-amber-900 via-slate-900 to-stone-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Kết quả tạo ({generatedNumbers.length} số trong khoảng {minVal} - {maxVal})
                </span>
                <button
                  type="button"
                  onClick={generateRandomNumbers}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Quay lại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 py-4 min-h-[140px] items-center">
                {generatedNumbers.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-black text-xl sm:text-2xl flex items-center justify-center shadow-inner animate-in zoom-in"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dice */}
      {tab === 'dice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider">Cấu hình xúc xắc</h3>

            <div>
              <span className="text-slate-600 font-semibold block mb-1.5">Loại xúc xắc (Số mặt):</span>
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 10, 12, 20, 100].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDiceSides(s)}
                    className={`py-2 rounded-xl font-bold ${
                      diceSides === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    d{s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-600 font-semibold block mb-1">Số lượng xúc xắc:</span>
              <input
                type="number"
                min={1}
                max={10}
                value={diceCount}
                onChange={(e) => setDiceCount(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={rollDice}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Dice5 className="w-4 h-4" /> Tung xúc xắc
            </button>
          </div>

          <div className="lg:col-span-7 bg-gradient-to-br from-amber-900 via-slate-900 to-stone-950 p-6 rounded-3xl text-white shadow-xl space-y-4">
            <div className="flex justify-between items-center text-xs text-amber-300 font-bold uppercase">
              <span>Kết quả tung ({diceCount}d{diceSides})</span>
              <span>Tổng: {diceRolls.reduce((a, b) => a + b, 0)}</span>
            </div>

            <div className="flex flex-wrap gap-3 py-4 min-h-[140px] items-center">
              {diceRolls.map((d, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-2xl bg-white text-slate-900 font-mono font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-400 animate-in spin-in-1"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Picker */}
      {tab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3 text-xs">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Danh sách ứng viên / phần thưởng (Mỗi dòng 1 tên):
            </label>
            <textarea
              rows={8}
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-2xl font-medium text-slate-800 focus:ring-2 focus:ring-amber-500"
              placeholder="Nhập danh sách..."
            />
            <button
              type="button"
              onClick={pickWinner}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Trophy className="w-4 h-4" /> Quay chọn ngẫu nhiên
            </button>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-amber-900 via-stone-900 to-slate-950 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-center items-center text-center space-y-3">
            <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Người / Mục May Mắn Trúng Giải
            </span>
            <div className="text-2xl sm:text-4xl font-black text-white py-2">
              {winner ? winner : 'Bấm nút "Quay chọn" để tìm ra người thắng!'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
