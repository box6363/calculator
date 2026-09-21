import React, { useState, useMemo } from 'react';
import { TrendingUp, RotateCcw } from 'lucide-react';

export const SlopeCalculator: React.FC = () => {
  const [x1, setX1] = useState<number>(1);
  const [y1, setY1] = useState<number>(2);
  const [x2, setX2] = useState<number>(4);
  const [y2, setY2] = useState<number>(8);

  const calculations = useMemo(() => {
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Distance
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (dx === 0) {
      return {
        isVertical: true,
        equation: `x = ${x1}`,
        distance: distance.toFixed(4),
        angleDeg: '90.00',
        message: 'Đường thẳng thẳng đứng (song song trục tung Oy), hệ số góc không xác định (vô cực).'
      };
    }

    const slope = dy / dx;
    const yIntercept = y1 - slope * x1;
    const angleRad = Math.atan(slope);
    const angleDeg = (angleRad * 180) / Math.PI;

    return {
      isVertical: false,
      slope: slope.toFixed(4),
      yIntercept: yIntercept.toFixed(4),
      equation: `y = ${slope.toFixed(2)}x ${yIntercept >= 0 ? `+ ${yIntercept.toFixed(2)}` : `- ${Math.abs(yIntercept).toFixed(2)}`}`,
      distance: distance.toFixed(4),
      angleDeg: angleDeg.toFixed(2),
      message: slope > 0 ? 'Đường thẳng dốc lên từ trái sang phải.' : slope < 0 ? 'Đường thẳng dốc xuống từ trái sang phải.' : 'Đường thẳng nằm ngang (song song trục Ox).'
    };
  }, [x1, y1, x2, y2]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Slope Calculator – Máy Tính Độ Dốc Đường Thẳng</h1>
            <p className="text-xs sm:text-sm text-slate-400">Tìm hệ số góc m, phương trình đường thẳng y = mx + b, góc nghiêng và khoảng cách giữa 2 điểm</p>
          </div>
        </div>
        <button
          id="slope-reset-btn"
          onClick={() => { setX1(1); setY1(2); setX2(4); setY2(8); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <h2 className="text-base font-semibold text-white">Tọa độ 2 điểm</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Điểm thứ nhất P1 (x₁, y₁)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="slope-x1"
                type="number"
                value={x1}
                placeholder="x₁"
                onChange={(e) => setX1(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                id="slope-y1"
                type="number"
                value={y1}
                placeholder="y₁"
                onChange={(e) => setY1(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Điểm thứ hai P2 (x₂, y₂)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                id="slope-x2"
                type="number"
                value={x2}
                placeholder="x₂"
                onChange={(e) => setX2(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                id="slope-y2"
                type="number"
                value={y2}
                placeholder="y₂"
                onChange={(e) => setY2(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Hệ số góc m (Slope)</span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-sans tabular-nums">
              {calculations.isVertical ? 'Vô cực (∞)' : calculations.slope}
            </div>
            <p className="text-xs text-slate-400">{calculations.message}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Phương trình</span>
              <span className="text-sm font-bold text-white font-mono">{calculations.equation}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Khoảng cách P1-P2</span>
              <span className="text-sm font-bold text-white font-sans">{calculations.distance}</span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Góc nghiêng (θ)</span>
              <span className="text-sm font-bold text-white font-sans">{calculations.angleDeg}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
