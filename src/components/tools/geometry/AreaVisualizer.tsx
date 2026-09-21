import React from 'react';
import { Eye } from 'lucide-react';

interface AreaVisualizerProps {
  shape: 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'ellipse';
  dim1: number; // rect: length, circle: radius, tri: base, trap: base a, ellipse: axis a
  dim2: number; // rect: width, tri: height, trap: base b, ellipse: axis b
  dim3: number; // trap: height
  area: number;
  formula: string;
}

export const AreaVisualizer: React.FC<AreaVisualizerProps> = ({
  shape,
  dim1,
  dim2,
  dim3,
  area,
  formula
}) => {
  const v1 = Math.max(0.1, Number(dim1) || 1);
  const v2 = Math.max(0.1, Number(dim2) || 1);

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Hình Vẽ Hình Học Trực Quan 2D
            </h3>
            <p className="text-[11px] text-slate-400">
              Co giãn tỷ lệ chuẩn theo số liệu nhập vào
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Live 2D Diagram
        </span>
      </div>

      <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <svg
          viewBox="0 0 380 260"
          className="w-full h-full max-h-64 select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
            </linearGradient>
            <marker
              id="arrowEmerald"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
            </marker>
            <marker
              id="arrowAmber2"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#fbbf24" />
            </marker>
          </defs>

          {/* ================= RECTANGLE ================= */}
          {shape === 'rectangle' && (() => {
            const maxV = Math.max(v1, v2);
            const w = Math.max(70, Math.min(240, (v1 / maxV) * 210 + 30));
            const h = Math.max(50, Math.min(140, (v2 / maxV) * 125 + 20));
            const x = 190 - w / 2;
            const y = 130 - h / 2;

            return (
              <g>
                {/* Main Rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill="url(#areaFillGrad)"
                  stroke="#10b981"
                  strokeWidth="2"
                  rx="2"
                />

                {/* Right angles at corners */}
                <path d={`M ${x} ${y + 8} L ${x + 8} ${y + 8} L ${x + 8} ${y}`} fill="none" stroke="#34d399" strokeWidth="1" />
                <path d={`M ${x + w - 8} ${y} L ${x + w - 8} ${y + 8} L ${x + w} ${y + 8}`} fill="none" stroke="#34d399" strokeWidth="1" />

                {/* Dimension: Length (Chiếu dài) */}
                <line x1={x} y1={y + h + 16} x2={x + w} y2={y + h + 16} stroke="#34d399" strokeWidth="1.5" markerStart="url(#arrowEmerald)" markerEnd="url(#arrowEmerald)" />
                <line x1={x} y1={y + h + 4} x2={x} y2={y + h + 22} stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <line x1={x + w} y1={y + h + 4} x2={x + w} y2={y + h + 22} stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <rect x={190 - 45} y={y + h + 7} width="90" height="18" rx="4" fill="#0f172a" stroke="#059669" strokeWidth="1" />
                <text x={190} y={y + h + 20} textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Dài = {dim1}
                </text>

                {/* Dimension: Width (Chiều rộng) */}
                <line x1={x - 16} y1={y} x2={x - 16} y2={y + h} stroke="#fbbf24" strokeWidth="1.5" markerStart="url(#arrowAmber2)" markerEnd="url(#arrowAmber2)" />
                <rect x={x - 85} y={130 - 9} width="64" height="18" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                <text x={x - 53} y={130 + 4} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Rộng = {dim2}
                </text>

                {/* Center Area label */}
                <text x={190} y={130} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  A = {area.toLocaleString()}
                </text>
              </g>
            );
          })()}

          {/* ================= CIRCLE ================= */}
          {shape === 'circle' && (() => {
            const cx = 190;
            const cy = 130;
            const r = 75;

            return (
              <g>
                <circle cx={cx} cy={cy} r={r} fill="url(#areaFillGrad)" stroke="#10b981" strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
                <text x={cx - 14} y={cy - 6} fill="#ffffff" fontSize="12" fontWeight="bold">O</text>

                {/* Radius arrow */}
                <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowAmber2)" />
                <rect x={cx + 12} y={cy - 22} width="66" height="18" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                <text x={cx + 45} y={cy - 9} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  r = {dim1}
                </text>

                <text x={cx} y={cy + 35} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                  Diện tích A = {area.toLocaleString()}
                </text>
                <text x={cx} y={cy + 52} textAnchor="middle" fill="#94a3b8" fontSize="10.5">
                  Chu vi C = 2πr = {(2 * Math.PI * v1).toFixed(2)}
                </text>
              </g>
            );
          })()}

          {/* ================= TRIANGLE ================= */}
          {shape === 'triangle' && (() => {
            const baseW = 200;
            const h = 120;
            const xA = 190;
            const yA = 130 - h / 2;
            const xB = 190 - baseW / 2;
            const yB = 130 + h / 2;
            const xC = 190 + baseW / 2;
            const yC = 130 + h / 2;

            return (
              <g>
                <polygon
                  points={`${xA},${yA} ${xB},${yB} ${xC},${yC}`}
                  fill="url(#areaFillGrad)"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Altitude dashed line */}
                <line x1={xA} y1={yA} x2={xA} y2={yB} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d={`M ${xA} ${yB - 8} L ${xA + 8} ${yB - 8} L ${xA + 8} ${yB}`} fill="none" stroke="#38bdf8" strokeWidth="1" />

                {/* Base measurement */}
                <line x1={xB} y1={yB + 16} x2={xC} y2={yC + 16} stroke="#34d399" strokeWidth="1.5" markerStart="url(#arrowEmerald)" markerEnd="url(#arrowEmerald)" />
                <rect x={190 - 45} y={yB + 7} width="90" height="18" rx="4" fill="#0f172a" stroke="#059669" strokeWidth="1" />
                <text x={190} y={yB + 20} textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Đáy = {dim1}
                </text>

                {/* Height label */}
                <rect x={xA - 68} y={130 - 9} width="58" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                <text x={xA - 39} y={130 + 4} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  h = {dim2}
                </text>
              </g>
            );
          })()}

          {/* ================= TRAPEZOID ================= */}
          {shape === 'trapezoid' && (() => {
            const h = 110;
            const topW = 100;
            const botW = 200;
            const yTop = 130 - h / 2;
            const yBot = 130 + h / 2;

            const p1 = { x: 190 - topW / 2, y: yTop };
            const p2 = { x: 190 + topW / 2, y: yTop };
            const p3 = { x: 190 + botW / 2, y: yBot };
            const p4 = { x: 190 - botW / 2, y: yBot };

            return (
              <g>
                <polygon
                  points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                  fill="url(#areaFillGrad)"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Top base a */}
                <line x1={p1.x} y1={yTop - 14} x2={p2.x} y2={yTop - 14} stroke="#fbbf24" strokeWidth="1.5" markerStart="url(#arrowAmber2)" markerEnd="url(#arrowAmber2)" />
                <rect x={190 - 45} y={yTop - 23} width="90" height="17" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                <text x={190} y={yTop - 11} textAnchor="middle" fill="#fbbf24" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                  Đáy nhỏ b = {dim2}
                </text>

                {/* Bottom base b */}
                <line x1={p4.x} y1={yBot + 14} x2={p3.x} y2={yBot + 14} stroke="#34d399" strokeWidth="1.5" markerStart="url(#arrowEmerald)" markerEnd="url(#arrowEmerald)" />
                <rect x={190 - 45} y={yBot + 6} width="90" height="17" rx="4" fill="#0f172a" stroke="#059669" strokeWidth="1" />
                <text x={190} y={yBot + 18} textAnchor="middle" fill="#34d399" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                  Đáy lớn a = {dim1}
                </text>

                {/* Height dashed */}
                <line x1={p1.x} y1={yTop} x2={p1.x} y2={yBot} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d={`M ${p1.x} ${yBot - 8} L ${p1.x + 8} ${yBot - 8} L ${p1.x + 8} ${yBot}`} fill="none" stroke="#38bdf8" strokeWidth="1" />
                <rect x={p1.x - 58} y={130 - 9} width="50" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                <text x={p1.x - 33} y={130 + 4} textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontWeight="bold" fontFamily="monospace">
                  h = {dim3}
                </text>
              </g>
            );
          })()}

          {/* ================= ELLIPSE ================= */}
          {shape === 'ellipse' && (() => {
            const cx = 190;
            const cy = 130;
            const rX = 95;
            const rY = 55;

            return (
              <g>
                <ellipse cx={cx} cy={cy} rx={rX} ry={rY} fill="url(#areaFillGrad)" stroke="#10b981" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="3" fill="#ffffff" />

                {/* Semi-major axis a */}
                <line x1={cx} y1={cy} x2={cx + rX} y2={cy} stroke="#34d399" strokeWidth="2" markerEnd="url(#arrowEmerald)" />
                <rect x={cx + 15} y={cy - 22} width="68" height="18" rx="4" fill="#0f172a" stroke="#059669" strokeWidth="1" />
                <text x={cx + 49} y={cy - 9} textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  a = {dim1}
                </text>

                {/* Semi-minor axis b */}
                <line x1={cx} y1={cy} x2={cx} y2={cy - rY} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowAmber2)" />
                <rect x={cx - 68} y={cy - rY / 2 - 9} width="60" height="18" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                <text x={cx - 38} y={cy - rY / 2 + 4} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  b = {dim2}
                </text>
              </g>
            );
          })()}
        </svg>

        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm">
          <span>
            Diện tích: <strong className="text-emerald-400 font-sans">{area.toLocaleString()}</strong>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">
            {formula}
          </span>
        </div>
      </div>
    </div>
  );
};
