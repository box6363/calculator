import React from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

interface PerimeterVisualizerProps {
  shape: 'rectangle' | 'triangle' | 'circle' | 'polygon';
  v1: number; // rect: length, tri: side a, circle: radius
  v2: number; // rect: width, tri: side b
  v3: number; // tri: side c
  polygonSides: number; // regular polygon: number of sides n
  polygonSideLength: number; // regular polygon: side length s
  perimeter: number;
  formula: string;
}

export const PerimeterVisualizer: React.FC<PerimeterVisualizerProps> = ({
  shape,
  v1,
  v2,
  v3,
  polygonSides,
  polygonSideLength,
  perimeter,
  formula
}) => {
  const val1 = Math.max(0.1, Number(v1) || 1);
  const val2 = Math.max(0.1, Number(v2) || 1);
  const val3 = Math.max(0.1, Number(v3) || 1);
  const n = Math.max(3, Math.min(20, Math.floor(Number(polygonSides) || 5)));
  const s = Math.max(0.1, Number(polygonSideLength) || 1);

  // Triangle validation and coordinates
  let triangleValid = true;
  let triCoords = null;
  if (shape === 'triangle') {
    if (val1 + val2 > val3 && val1 + val3 > val2 && val2 + val3 > val1) {
      const cosA = (val2 * val2 + val3 * val3 - val1 * val1) / (2 * val2 * val3);
      const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
      const rawAx = 0;
      const rawAy = 0;
      const rawBx = val3;
      const rawBy = 0;
      const rawCx = val2 * cosA;
      const rawCy = val2 * sinA;

      const minX = Math.min(rawAx, rawBx, rawCx);
      const maxX = Math.max(rawAx, rawBx, rawCx);
      const minY = Math.min(rawAy, rawBy, rawCy);
      const maxY = Math.max(rawAy, rawBy, rawCy);
      const spanX = Math.max(0.001, maxX - minX);
      const spanY = Math.max(0.001, maxY - minY);

      const targetW = 230;
      const targetH = 130;
      const scale = Math.min(targetW / spanX, targetH / spanY);
      const centerX = 190;
      const centerY = 135;
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      triCoords = {
        Ax: centerX + (rawAx - midX) * scale,
        Ay: centerY - (rawAy - midY) * scale,
        Bx: centerX + (rawBx - midX) * scale,
        By: centerY - (rawBy - midY) * scale,
        Cx: centerX + (rawCx - midX) * scale,
        Cy: centerY - (rawCy - midY) * scale,
      };
    } else {
      triangleValid = false;
    }
  }

  // Regular Polygon points
  const polyPoints = (() => {
    if (shape !== 'polygon') return [];
    const cx = 190;
    const cy = 130;
    const r = 75;
    const pts: { x: number; y: number }[] = [];
    const offsetAngle = -Math.PI / 2; // start from top
    for (let i = 0; i < n; i++) {
      const angle = offsetAngle + (i * 2 * Math.PI) / n;
      pts.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    return pts;
  })();

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Hình Vẽ Chu Vi Trực Quan
            </h3>
            <p className="text-[11px] text-slate-400">
              Đường bao chu vi co giãn theo kích thước thực nhập vào
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Perimeter Mesh
        </span>
      </div>

      <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        {shape === 'triangle' && !triangleValid ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <span className="text-sm font-semibold text-white">3 cạnh không tạo thành tam giác</span>
            <p className="text-xs text-slate-400 max-w-xs">
              Tổng 2 cạnh bất kỳ phải lớn hơn cạnh còn lại (a + b &gt; c).
            </p>
          </div>
        ) : (
          <svg
            viewBox="0 0 380 260"
            className="w-full h-full max-h-64 select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="periGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.25" />
              </linearGradient>
              <marker
                id="arrowBlue"
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
                id="arrowAmberP"
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
              const maxV = Math.max(val1, val2);
              const w = Math.max(70, Math.min(230, (val1 / maxV) * 200 + 30));
              const h = Math.max(45, Math.min(130, (val2 / maxV) * 115 + 20));
              const x = 190 - w / 2;
              const y = 130 - h / 2;

              return (
                <g>
                  {/* Highlighted perimeter path with animated dash */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="url(#periGrad)"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    rx="2"
                  />

                  {/* Corner right angle markers */}
                  <path d={`M ${x} ${y + 8} L ${x + 8} ${y + 8} L ${x + 8} ${y}`} fill="none" stroke="#60a5fa" strokeWidth="1" />
                  <path d={`M ${x + w - 8} ${y} L ${x + w - 8} ${y + 8} L ${x + w} ${y + 8}`} fill="none" stroke="#60a5fa" strokeWidth="1" />
                  <path d={`M ${x + w} ${y + h - 8} L ${x + w - 8} ${y + h - 8} L ${x + w - 8} ${y + h}`} fill="none" stroke="#60a5fa" strokeWidth="1" />
                  <path d={`M ${x} ${y + h - 8} L ${x + 8} ${y + h - 8} L ${x + 8} ${y + h}`} fill="none" stroke="#60a5fa" strokeWidth="1" />

                  {/* Top: Length */}
                  <rect x={190 - 45} y={y - 24} width="90" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                  <text x={190} y={y - 11} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Dài: {v1}
                  </text>

                  {/* Bottom: Length */}
                  <rect x={190 - 45} y={y + h + 8} width="90" height="18" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                  <text x={190} y={y + h + 21} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Dài: {v1}
                  </text>

                  {/* Left: Width */}
                  <rect x={x - 72} y={130 - 9} width="60" height="18" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                  <text x={x - 42} y={130 + 4} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Rộng: {v2}
                  </text>

                  {/* Right: Width */}
                  <rect x={x + w + 12} y={130 - 9} width="60" height="18" rx="4" fill="#0f172a" stroke="#b45309" strokeWidth="1" />
                  <text x={x + w + 42} y={130 + 4} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    Rộng: {v2}
                  </text>

                  {/* Center info */}
                  <text x={190} y={130 + 4} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    P = 2 × ({v1} + {v2}) = {perimeter}
                  </text>
                </g>
              );
            })()}

            {/* ================= TRIANGLE ================= */}
            {shape === 'triangle' && triCoords && (() => {
              const { Ax, Ay, Bx, By, Cx, Cy } = triCoords;

              return (
                <g>
                  {/* Polygon body */}
                  <polygon
                    points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                    fill="url(#periGrad)"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Vertices */}
                  <circle cx={Ax} cy={Ay} r="3.5" fill="#ffffff" />
                  <text x={Ax - 12} y={Ay + 14} fill="#ffffff" fontSize="11" fontWeight="bold">A</text>

                  <circle cx={Bx} cy={By} r="3.5" fill="#ffffff" />
                  <text x={Bx + 8} y={By + 14} fill="#ffffff" fontSize="11" fontWeight="bold">B</text>

                  <circle cx={Cx} cy={Cy} r="3.5" fill="#ffffff" />
                  <text x={Cx} y={Cy - 8} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

                  {/* Side c (AB) */}
                  <rect
                    x={(Ax + Bx) / 2 - 35}
                    y={(Ay + By) / 2 + 6}
                    width="70"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#0284c7"
                    strokeWidth="1"
                  />
                  <text
                    x={(Ax + Bx) / 2}
                    y={(Ay + By) / 2 + 19}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    c = {v3}
                  </text>

                  {/* Side a (BC) */}
                  <rect
                    x={(Bx + Cx) / 2 + 6}
                    y={(By + Cy) / 2 - 9}
                    width="66"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <text
                    x={(Bx + Cx) / 2 + 39}
                    y={(By + Cy) / 2 + 4}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    a = {v1}
                  </text>

                  {/* Side b (AC) */}
                  <rect
                    x={(Ax + Cx) / 2 - 72}
                    y={(Ay + Cy) / 2 - 9}
                    width="66"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#059669"
                    strokeWidth="1"
                  />
                  <text
                    x={(Ax + Cx) / 2 - 39}
                    y={(Ay + Cy) / 2 + 4}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    b = {v2}
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
                  {/* Circle body & outer stroke representing circumference */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="url(#periGrad)"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                  />
                  <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
                  <text x={cx - 14} y={cy - 6} fill="#ffffff" fontSize="12" fontWeight="bold">O</text>

                  {/* Radius line */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + r}
                    y2={cy}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    markerEnd="url(#arrowAmberP)"
                  />
                  <rect
                    x={cx + 12}
                    y={cy - 22}
                    width="66"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#b45309"
                    strokeWidth="1"
                  />
                  <text
                    x={cx + 45}
                    y={cy - 9}
                    textAnchor="middle"
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    r = {v1}
                  </text>

                  {/* Diameter dashed line */}
                  <line
                    x1={cx - r}
                    y1={cy}
                    x2={cx}
                    y2={cy}
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />

                  <text x={cx} y={cy + 35} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    Chu vi C = 2πr = {perimeter.toLocaleString()}
                  </text>
                  <text x={cx} y={cy + 52} textAnchor="middle" fill="#94a3b8" fontSize="10.5">
                    Đường kính d = 2r = {(val1 * 2).toLocaleString()}
                  </text>
                </g>
              );
            })()}

            {/* ================= REGULAR POLYGON (Đa giác đều) ================= */}
            {shape === 'polygon' && (() => {
              const cx = 190;
              const cy = 130;
              const pointsStr = polyPoints.map(p => `${p.x},${p.y}`).join(' ');

              // Names for regular polygons
              const polyNames: Record<number, string> = {
                3: 'Tam giác đều (3 cạnh)',
                4: 'Hình vuông (4 cạnh)',
                5: 'Ngũ giác đều (5 cạnh)',
                6: 'Lục giác đều (6 cạnh)',
                7: 'Thất giác đều (7 cạnh)',
                8: 'Bát giác đều (8 cạnh)',
                9: 'Cửu giác đều (9 cạnh)',
                10: 'Thập giác đều (10 cạnh)',
                12: 'Thập nhị giác đều (12 cạnh)',
              };
              const polyTitle = polyNames[n] || `Đa giác đều ${n} cạnh`;

              return (
                <g>
                  {/* Polygon body */}
                  <polygon
                    points={pointsStr}
                    fill="url(#periGrad)"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Center dot */}
                  <circle cx={cx} cy={cy} r="2.5" fill="#93c5fd" opacity="0.6" />

                  {/* Vertices & side measurements */}
                  {polyPoints.map((p, idx) => (
                    <circle key={`v-${idx}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" />
                  ))}

                  {/* Highlight one side with label 's' */}
                  {polyPoints.length >= 2 && (() => {
                    const pA = polyPoints[0];
                    const pB = polyPoints[1];
                    const midX = (pA.x + pB.x) / 2;
                    const midY = (pA.y + pB.y) / 2;
                    return (
                      <g>
                        <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#fbbf24" strokeWidth="3.5" />
                        <rect
                          x={midX + 6}
                          y={midY - 10}
                          width="72"
                          height="18"
                          rx="4"
                          fill="#0f172a"
                          stroke="#b45309"
                          strokeWidth="1"
                        />
                        <text
                          x={midX + 42}
                          y={midY + 3}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          Cạnh s = {s}
                        </text>
                      </g>
                    );
                  })()}

                  {/* Center Label */}
                  <text x={cx} y={cy - 8} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    {polyTitle}
                  </text>
                  <text x={cx} y={cy + 12} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    P = {n} × {s} = {perimeter.toLocaleString()}
                  </text>
                </g>
              );
            })()}
          </svg>
        )}

        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm">
          <span>
            Chu vi: <strong className="text-blue-400 font-sans">{perimeter.toLocaleString()}</strong>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">
            {formula}
          </span>
        </div>
      </div>
    </div>
  );
};
