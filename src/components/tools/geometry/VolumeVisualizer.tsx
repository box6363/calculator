import React from 'react';
import { Eye } from 'lucide-react';

interface VolumeVisualizerProps {
  solid: 'cuboid' | 'cylinder' | 'sphere' | 'cone';
  d1: number; // cuboid: length, cylinder/sphere/cone: radius
  d2: number; // cuboid: width, cylinder/cone: height
  d3: number; // cuboid: height
  volume: number;
  surfaceArea: number;
}

export const VolumeVisualizer: React.FC<VolumeVisualizerProps> = ({
  solid,
  d1,
  d2,
  d3,
  volume,
  surfaceArea
}) => {
  // Normalize values safely
  const val1 = Math.max(0.1, Number(d1) || 1);
  const val2 = Math.max(0.1, Number(d2) || 1);
  const val3 = Math.max(0.1, Number(d3) || 1);

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Mô Hình Trực Quan 3D Không Gian
            </h3>
            <p className="text-[11px] text-slate-400">
              Hình dạng và kích thước co giãn theo số liệu nhập
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Live Vector 3D
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <svg
          viewBox="0 0 400 280"
          className="w-full h-full max-h-64 select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="topFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="frontFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="sideFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#172554" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="cylinderBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="sphereLightGrad" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#60a5fa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#172554" stopOpacity="0.95" />
            </linearGradient>

            {/* Arrowhead marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
            <marker
              id="arrowAmber"
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

          {/* ================= CUBOID (Hình Hộp Chữ Nhật) ================= */}
          {solid === 'cuboid' && (() => {
            const maxVal = Math.max(val1, val2, val3);
            // Dynamic scaling with clamp
            const scaledL = Math.max(70, Math.min(170, (val1 / maxVal) * 150 + 20));
            const scaledW = Math.max(35, Math.min(80, (val2 / maxVal) * 65 + 15));
            const scaledH = Math.max(45, Math.min(125, (val3 / maxVal) * 110 + 15));

            // Origin of front-bottom-left corner
            const ox = 200 - scaledL / 2 - (scaledW * 0.7) / 2;
            const oy = 140 + scaledH / 2;

            // Vector along depth (30 degrees axonometric)
            const dx = scaledW * 0.85;
            const dy = -scaledW * 0.45;

            // Front face corners
            const p1 = { x: ox, y: oy }; // bottom-left
            const p2 = { x: ox + scaledL, y: oy }; // bottom-right
            const p3 = { x: ox + scaledL, y: oy - scaledH }; // top-right
            const p4 = { x: ox, y: oy - scaledH }; // top-left

            // Back face corners (offset by dx, dy)
            const p5 = { x: ox + dx, y: oy + dy };
            const p6 = { x: ox + scaledL + dx, y: oy + dy };
            const p7 = { x: ox + scaledL + dx, y: oy - scaledH + dy };
            const p8 = { x: ox + dx, y: oy - scaledH + dy };

            return (
              <g>
                {/* Hidden / Internal dashed edges */}
                <line x1={p1.x} y1={p1.y} x2={p5.x} y2={p5.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1={p5.x} y1={p5.y} x2={p6.x} y2={p6.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1={p5.x} y1={p5.y} x2={p8.x} y2={p8.y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

                {/* Back / Side Faces */}
                {/* Top Face */}
                <polygon
                  points={`${p4.x},${p4.y} ${p3.x},${p3.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`}
                  fill="url(#topFaceGrad)"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                />
                {/* Right Side Face */}
                <polygon
                  points={`${p2.x},${p2.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p3.x},${p3.y}`}
                  fill="url(#sideFaceGrad)"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                />
                {/* Front Face */}
                <polygon
                  points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                  fill="url(#frontFaceGrad)"
                  stroke="#93c5fd"
                  strokeWidth="1.8"
                />

                {/* Dimension 1: Length (Chiếu dài l) */}
                <g>
                  <line
                    x1={p1.x}
                    y1={p1.y + 18}
                    x2={p2.x}
                    y2={p2.y + 18}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    markerStart="url(#arrow)"
                    markerEnd="url(#arrow)"
                  />
                  <line x1={p1.x} y1={p1.y + 4} x2={p1.x} y2={p1.y + 24} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  <line x1={p2.x} y1={p2.y + 4} x2={p2.x} y2={p2.y + 24} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  <rect
                    x={(p1.x + p2.x) / 2 - 38}
                    y={p1.y + 8}
                    width="76"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#0284c7"
                    strokeWidth="1"
                  />
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={p1.y + 21}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Dài: {d1}
                  </text>
                </g>

                {/* Dimension 2: Width (Chiều rộng w) */}
                <g>
                  <line
                    x1={p2.x + 14}
                    y1={p2.y + 7}
                    x2={p6.x + 14}
                    y2={p6.y + 7}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    markerStart="url(#arrowAmber)"
                    markerEnd="url(#arrowAmber)"
                  />
                  <rect
                    x={(p2.x + p6.x) / 2 + 10}
                    y={(p2.y + p6.y) / 2 - 2}
                    width="78"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <text
                    x={(p2.x + p6.x) / 2 + 49}
                    y={(p2.y + p6.y) / 2 + 11}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Rộng: {d2}
                  </text>
                </g>

                {/* Dimension 3: Height (Chiều cao h) */}
                <g>
                  <line
                    x1={p1.x - 16}
                    y1={p1.y}
                    x2={p4.x - 16}
                    y2={p4.y}
                    stroke="#34d399"
                    strokeWidth="1.5"
                  />
                  <line x1={p1.x - 22} y1={p1.y} x2={p1.x - 8} y2={p1.y} stroke="#34d399" strokeWidth="1" />
                  <line x1={p4.x - 22} y1={p4.y} x2={p4.x - 8} y2={p4.y} stroke="#34d399" strokeWidth="1" />
                  <rect
                    x={p1.x - 72}
                    y={(p1.y + p4.y) / 2 - 9}
                    width="52"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#059669"
                    strokeWidth="1"
                  />
                  <text
                    x={p1.x - 46}
                    y={(p1.y + p4.y) / 2 + 4}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    h: {d3}
                  </text>
                </g>
              </g>
            );
          })()}

          {/* ================= CYLINDER (Hình Trụ Tròn) ================= */}
          {solid === 'cylinder' && (() => {
            const maxVal = Math.max(val1 * 2, val2);
            const rX = Math.max(35, Math.min(85, (val1 / (maxVal / 2)) * 65 + 20));
            const rY = rX * 0.35; // perspective tilt
            const h = Math.max(50, Math.min(140, (val2 / maxVal) * 125 + 20));

            const cx = 190;
            const topCy = 140 - h / 2;
            const botCy = 140 + h / 2;

            return (
              <g>
                {/* Bottom dashed hidden arc */}
                <ellipse cx={cx} cy={botCy} rx={rX} ry={rY} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

                {/* Body filled */}
                <path
                  d={`M ${cx - rX} ${topCy} L ${cx - rX} ${botCy} A ${rX} ${rY} 0 0 0 ${cx + rX} ${botCy} L ${cx + rX} ${topCy} Z`}
                  fill="url(#cylinderBodyGrad)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />

                {/* Bottom solid front half */}
                <path
                  d={`M ${cx - rX} ${botCy} A ${rX} ${rY} 0 0 0 ${cx + rX} ${botCy}`}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="1.8"
                />

                {/* Top solid ellipse */}
                <ellipse
                  cx={cx}
                  cy={topCy}
                  rx={rX}
                  ry={rY}
                  fill="url(#topFaceGrad)"
                  stroke="#bfdbfe"
                  strokeWidth="2"
                />

                {/* Radius indicator on top face */}
                <circle cx={cx} cy={topCy} r="3" fill="#ffffff" />
                <line
                  x1={cx}
                  y1={topCy}
                  x2={cx + rX}
                  y2={topCy}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  markerEnd="url(#arrowAmber)"
                />
                <rect
                  x={cx + rX / 2 - 28}
                  y={topCy - 22}
                  width="56"
                  height="17"
                  rx="4"
                  fill="#0f172a"
                  stroke="#b45309"
                  strokeWidth="1"
                />
                <text
                  x={cx + rX / 2}
                  y={topCy - 10}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="10.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  r = {d1}
                </text>

                {/* Height indicator */}
                <line
                  x1={cx + rX + 22}
                  y1={topCy}
                  x2={cx + rX + 22}
                  y2={botCy}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <line x1={cx + rX + 14} y1={topCy} x2={cx + rX + 30} y2={topCy} stroke="#38bdf8" strokeWidth="1" />
                <line x1={cx + rX + 14} y1={botCy} x2={cx + rX + 30} y2={botCy} stroke="#38bdf8" strokeWidth="1" />
                <rect
                  x={cx + rX + 28}
                  y={140 - 9}
                  width="56"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
                <text
                  x={cx + rX + 56}
                  y={140 + 4}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  h = {d2}
                </text>
              </g>
            );
          })()}

          {/* ================= SPHERE (Hình Cầu) ================= */}
          {solid === 'sphere' && (() => {
            const r = 75; // standard normalized radius
            const cx = 200;
            const cy = 135;

            return (
              <g>
                {/* 3D Shaded sphere body */}
                <circle cx={cx} cy={cy} r={r} fill="url(#sphereLightGrad)" stroke="#60a5fa" strokeWidth="2" />

                {/* Equator back dashed line */}
                <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="none" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.55" />

                {/* Equator front solid line */}
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r * 0.32} 0 0 0 ${cx + r} ${cy}`}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Center dot */}
                <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
                <text x={cx - 12} y={cy - 6} fill="#ffffff" fontSize="11" fontWeight="bold">O</text>

                {/* Radius vector */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx + r * 0.86}
                  y2={cy - r * 0.5}
                  stroke="#fbbf24"
                  strokeWidth="2.2"
                  markerEnd="url(#arrowAmber)"
                />

                <rect
                  x={cx + 15}
                  y={cy - 46}
                  width="70"
                  height="20"
                  rx="4"
                  fill="#0f172a"
                  stroke="#b45309"
                  strokeWidth="1"
                />
                <text
                  x={cx + 50}
                  y={cy - 32}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Bán kính r: {d1}
                </text>

                {/* Diameter indicator text */}
                <text
                  x={cx}
                  y={cy + r + 24}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  Đường kính d = 2r = {(val1 * 2).toLocaleString()}
                </text>
              </g>
            );
          })()}

          {/* ================= CONE (Hình Nón) ================= */}
          {solid === 'cone' && (() => {
            const maxVal = Math.max(val1 * 2, val2);
            const rX = Math.max(35, Math.min(85, (val1 / (maxVal / 2)) * 65 + 20));
            const rY = rX * 0.35;
            const h = Math.max(60, Math.min(150, (val2 / maxVal) * 135 + 25));

            const cx = 190;
            const botCy = 145 + h / 3;
            const apexY = botCy - h;

            return (
              <g>
                {/* Base dashed back curve */}
                <ellipse cx={cx} cy={botCy} rx={rX} ry={rY} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

                {/* Cone side surface */}
                <path
                  d={`M ${apexY ? cx : cx} ${apexY} L ${cx - rX} ${botCy} A ${rX} ${rY} 0 0 0 ${cx + rX} ${botCy} Z`}
                  fill="url(#coneGrad)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />

                {/* Base front solid curve */}
                <path
                  d={`M ${cx - rX} ${botCy} A ${rX} ${rY} 0 0 0 ${cx + rX} ${botCy}`}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="1.8"
                />

                {/* Center vertical altitude line (h) */}
                <line x1={cx} y1={apexY} x2={cx} y2={botCy} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx={cx} cy={botCy} r="2.5" fill="#ffffff" />

                {/* Base radius line (r) */}
                <line x1={cx} y1={botCy} x2={cx + rX} y2={botCy} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowAmber)" />

                {/* Right-angle indicator */}
                <path d={`M ${cx} ${botCy - 8} L ${cx + 8} ${botCy - 8} L ${cx + 8} ${botCy}`} fill="none" stroke="#38bdf8" strokeWidth="1" />

                {/* Radius label */}
                <rect
                  x={cx + rX / 2 - 26}
                  y={botCy + 8}
                  width="52"
                  height="17"
                  rx="4"
                  fill="#0f172a"
                  stroke="#b45309"
                  strokeWidth="1"
                />
                <text
                  x={cx + rX / 2}
                  y={botCy + 20}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="10.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  r = {d1}
                </text>

                {/* Height label */}
                <rect
                  x={cx - 62}
                  y={(apexY + botCy) / 2 - 9}
                  width="54"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke="#0284c7"
                  strokeWidth="1"
                />
                <text
                  x={cx - 35}
                  y={(apexY + botCy) / 2 + 4}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  h = {d2}
                </text>

                {/* Slant height line label */}
                <text
                  x={cx + rX / 2 + 25}
                  y={(apexY + botCy) / 2 - 6}
                  fill="#34d399"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  s = {Math.sqrt(val1 * val1 + val2 * val2).toFixed(1)}
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Live overlay badges */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm">
          <span>
            Thể tích: <strong className="text-blue-400 font-sans">{volume.toLocaleString()}</strong>
          </span>
          <span>
            Diện tích toàn phần: <strong className="text-emerald-400 font-sans">{surfaceArea.toLocaleString()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
