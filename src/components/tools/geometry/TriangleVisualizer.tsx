import React from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

interface TriangleVisualizerProps {
  sideA: number;
  sideB: number;
  sideC: number;
  isValid: boolean;
  angleA?: string;
  angleB?: string;
  angleC?: string;
  area?: string;
  type?: string;
}

export const TriangleVisualizer: React.FC<TriangleVisualizerProps> = ({
  sideA,
  sideB,
  sideC,
  isValid,
  angleA,
  angleB,
  angleC,
  area,
  type
}) => {
  const a = Math.max(0.01, Number(sideA) || 1);
  const b = Math.max(0.01, Number(sideB) || 1);
  const c = Math.max(0.01, Number(sideC) || 1);

  // Compute coordinates if valid
  let coords = null;
  if (isValid && a + b > c && a + c > b && b + c > a) {
    // Law of cosines for angle A (between b and c)
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));

    // Unscaled coordinates:
    // A at (0, 0)
    // B at (c, 0)
    // C at (b * cosA, b * sinA)
    const rawAx = 0;
    const rawAy = 0;
    const rawBx = c;
    const rawBy = 0;
    const rawCx = b * cosA;
    const rawCy = b * sinA;

    // Bounding box
    const minX = Math.min(rawAx, rawBx, rawCx);
    const maxX = Math.max(rawAx, rawBx, rawCx);
    const minY = Math.min(rawAy, rawBy, rawCy);
    const maxY = Math.max(rawAy, rawBy, rawCy);

    const spanX = Math.max(0.001, maxX - minX);
    const spanY = Math.max(0.001, maxY - minY);

    // Target box in SVG: width 240, height 130
    const targetW = 240;
    const targetH = 130;
    const scale = Math.min(targetW / spanX, targetH / spanY);

    const centerX = 190;
    const centerY = 135;

    // Center scaled shape
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    coords = {
      // Invert Y because SVG y grows downwards
      Ax: centerX + (rawAx - midX) * scale,
      Ay: centerY - (rawAy - midY) * scale,
      Bx: centerX + (rawBx - midX) * scale,
      By: centerY - (rawBy - midY) * scale,
      Cx: centerX + (rawCx - midX) * scale,
      Cy: centerY - (rawCy - midY) * scale,
    };
  }

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Hình Vẽ Tam Giác Đồ Họa Vector (Tỉ Lệ Thật)
            </h3>
            <p className="text-[11px] text-slate-400">
              {type || 'Tam giác theo định lý Sin và Cosin'}
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Trigonometric Mesh
        </span>
      </div>

      <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center p-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

        {!isValid || !coords ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <span className="text-sm font-semibold text-white">Không Thể Vẽ Hình</span>
            <p className="text-xs text-slate-400 max-w-xs">
              3 cạnh nhập vào không thỏa mãn bất đẳng thức tam giác (a + b &gt; c).
            </p>
          </div>
        ) : (
          <svg
            viewBox="0 0 380 260"
            className="w-full h-full max-h-64 select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="triPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#164e63" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Triangle polygon */}
            <polygon
              points={`${coords.Ax},${coords.Ay} ${coords.Bx},${coords.By} ${coords.Cx},${coords.Cy}`}
              fill="url(#triPolyGrad)"
              stroke="#06b6d4"
              strokeWidth="2.2"
            />

            {/* Vertices dots */}
            <circle cx={coords.Ax} cy={coords.Ay} r="3.5" fill="#ffffff" />
            <text x={coords.Ax - 14} y={coords.Ay + 14} fill="#ffffff" fontSize="11" fontWeight="bold">A</text>

            <circle cx={coords.Bx} cy={coords.By} r="3.5" fill="#ffffff" />
            <text x={coords.Bx + 8} y={coords.By + 14} fill="#ffffff" fontSize="11" fontWeight="bold">B</text>

            <circle cx={coords.Cx} cy={coords.Cy} r="3.5" fill="#ffffff" />
            <text x={coords.Cx} y={coords.Cy - 8} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

            {/* Side c (AB) label */}
            <rect
              x={(coords.Ax + coords.Bx) / 2 - 32}
              y={(coords.Ay + coords.By) / 2 + 6}
              width="64"
              height="18"
              rx="4"
              fill="#0f172a"
              stroke="#0891b2"
              strokeWidth="1"
            />
            <text
              x={(coords.Ax + coords.Bx) / 2}
              y={(coords.Ay + coords.By) / 2 + 19}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              c = {sideC}
            </text>

            {/* Side a (BC) label */}
            <rect
              x={(coords.Bx + coords.Cx) / 2 + 6}
              y={(coords.By + coords.Cy) / 2 - 9}
              width="64"
              height="18"
              rx="4"
              fill="#0f172a"
              stroke="#0891b2"
              strokeWidth="1"
            />
            <text
              x={(coords.Bx + coords.Cx) / 2 + 38}
              y={(coords.By + coords.Cy) / 2 + 4}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              a = {sideA}
            </text>

            {/* Side b (AC) label */}
            <rect
              x={(coords.Ax + coords.Cx) / 2 - 70}
              y={(coords.Ay + coords.Cy) / 2 - 9}
              width="64"
              height="18"
              rx="4"
              fill="#0f172a"
              stroke="#0891b2"
              strokeWidth="1"
            />
            <text
              x={(coords.Ax + coords.Cx) / 2 - 38}
              y={(coords.Ay + coords.Cy) / 2 + 4}
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              b = {sideB}
            </text>
          </svg>
        )}

        {isValid && (
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 pointer-events-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 backdrop-blur-sm">
            <span>
              Góc A: <strong className="text-cyan-400 font-sans">{angleA}°</strong> | B: <strong className="text-cyan-400 font-sans">{angleB}°</strong> | C: <strong className="text-cyan-400 font-sans">{angleC}°</strong>
            </span>
            <span>
              Diện tích: <strong className="text-amber-400 font-sans">{area}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
