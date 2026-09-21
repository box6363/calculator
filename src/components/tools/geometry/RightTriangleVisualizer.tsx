import React from 'react';
import { Eye } from 'lucide-react';

interface RightTriangleVisualizerProps {
  legA: number;
  legB: number;
  hypotenuse: string;
  angleA: string;
  angleB: string;
  altitudeC: string;
  area: string;
}

export const RightTriangleVisualizer: React.FC<RightTriangleVisualizerProps> = ({
  legA,
  legB,
  hypotenuse,
  angleA,
  angleB,
  altitudeC,
  area
}) => {
  const a = Math.max(0.1, Number(legA) || 1);
  const b = Math.max(0.1, Number(legB) || 1);

  // Proportional sizing
  const maxLeg = Math.max(a, b);
  const scaledB = Math.max(80, Math.min(230, (b / maxLeg) * 200 + 30)); // Base (cạnh kề b)
  const scaledA = Math.max(60, Math.min(150, (a / maxLeg) * 140 + 20)); // Height (cạnh đối a)

  const originX = 200 - scaledB / 2;
  const originY = 140 + scaledA / 2;

  // Vertices:
  // C is right angle (originX, originY)
  // B is bottom-right (originX + scaledB, originY)
  // A is top-left (originX, originY - scaledA)
  const pC = { x: originX, y: originY };
  const pB = { x: originX + scaledB, y: originY };
  const pA = { x: originX, y: originY - scaledA };

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col space-y-3 shadow-xs dark:shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              Hình Vẽ Tam Giác Vuông Trực Quan
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Định lý Pytago & Tỉ số lượng giác theo kích thước thực
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold">
          Pythagoras 2D
        </span>
      </div>

      <div className="w-full h-64 sm:h-72 bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

        <svg
          viewBox="0 0 380 260"
          className="w-full h-full max-h-64 select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="rightTriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.25" />
            </linearGradient>
            <marker
              id="arrowInd"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Right triangle polygon */}
          <polygon
            points={`${pC.x},${pC.y} ${pB.x},${pB.y} ${pA.x},${pA.y}`}
            fill="url(#rightTriGrad)"
            stroke="#818cf8"
            strokeWidth="2.2"
          />

          {/* Right angle marker at C */}
          <path
            d={`M ${pC.x} ${pC.y - 12} L ${pC.x + 12} ${pC.y - 12} L ${pC.x + 12} ${pC.y}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle cx={pC.x + 6} cy={pC.y - 6} r="1.5" fill="#fbbf24" />

          {/* Angle arc at B (angle B / beta) */}
          <path
            d={`M ${pB.x - 22} ${pB.y} A 22 22 0 0 1 ${pB.x - 18} ${pB.y - 12}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text
            x={pB.x - 38}
            y={pB.y - 8}
            fill="#38bdf8"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            β={angleB}°
          </text>

          {/* Angle arc at A (angle A / alpha) */}
          <path
            d={`M ${pA.x} ${pA.y + 22} A 22 22 0 0 0 ${pA.x + 12} ${pA.y + 18}`}
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <text
            x={pA.x + 15}
            y={pA.y + 28}
            fill="#34d399"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            α={angleA}°
          </text>

          {/* Vertices dots and labels */}
          <circle cx={pC.x} cy={pC.y} r="3" fill="#ffffff" />
          <text x={pC.x - 14} y={pC.y + 14} fill="#ffffff" fontSize="11" fontWeight="bold">C (90°)</text>

          <circle cx={pB.x} cy={pB.y} r="3" fill="#ffffff" />
          <text x={pB.x + 8} y={pB.y + 6} fill="#ffffff" fontSize="11" fontWeight="bold">B</text>

          <circle cx={pA.x} cy={pA.y} r="3" fill="#ffffff" />
          <text x={pA.x - 4} y={pA.y - 10} fill="#ffffff" fontSize="11" fontWeight="bold">A</text>

          {/* Leg a (vertical side AC) */}
          <rect
            x={pC.x - 72}
            y={(pC.y + pA.y) / 2 - 9}
            width="64"
            height="18"
            rx="4"
            fill="#0f172a"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x={pC.x - 40}
            y={(pC.y + pA.y) / 2 + 4}
            textAnchor="middle"
            fill="#818cf8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            a = {legA}
          </text>

          {/* Leg b (horizontal side CB) */}
          <rect
            x={(pC.x + pB.x) / 2 - 32}
            y={pC.y + 10}
            width="64"
            height="18"
            rx="4"
            fill="#0f172a"
            stroke="#4338ca"
            strokeWidth="1"
          />
          <text
            x={(pC.x + pB.x) / 2}
            y={pC.y + 23}
            textAnchor="middle"
            fill="#818cf8"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            b = {legB}
          </text>

          {/* Hypotenuse c (side AB) */}
          <rect
            x={(pA.x + pB.x) / 2 + 10}
            y={(pA.y + pB.y) / 2 - 12}
            width="88"
            height="20"
            rx="4"
            fill="#0f172a"
            stroke="#d97706"
            strokeWidth="1"
          />
          <text
            x={(pA.x + pB.x) / 2 + 54}
            y={(pA.y + pB.y) / 2 + 2}
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="11.5"
            fontWeight="bold"
            fontFamily="monospace"
          >
            c = {hypotenuse}
          </text>
        </svg>

        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 pointer-events-none bg-white/90 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
          <span>
            Cạnh huyền c = <strong className="text-amber-600 dark:text-amber-400 font-sans">{hypotenuse}</strong>
          </span>
          <span>
            Diện tích S = <strong className="text-indigo-600 dark:text-indigo-400 font-sans">{area}</strong>
          </span>
          <span>
            Đường cao hc = <strong className="text-emerald-600 dark:text-emerald-400 font-sans">{altitudeC}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
