import React, { useState, useMemo } from 'react';
import {
  LineChart,
  RotateCcw,
  Sparkles,
  Table as TableIcon,
  Sliders,
  FileDown
} from 'lucide-react';
import { InteractiveGraphPlotter, KeyPoint } from './geometry/InteractiveGraphPlotter';
import { evaluateExpression, formatExactMath } from '../../utils/mathParser';
import { GraphingPdfModal } from './GraphingPdfModal';

type GraphMode = 'quadratic' | 'cubic' | 'trigonometric' | 'custom';
type TrigType = 'sin' | 'cos' | 'tan';

export const GraphingCalculator: React.FC = () => {
  const [mode, setMode] = useState<GraphMode>('quadratic');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Quadratic parameters: ax^2 + bx + c
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-2);
  const [quadC, setQuadC] = useState<number>(-3);

  // Cubic parameters: ax^3 + bx^2 + cx + d
  const [cubeA, setCubeA] = useState<number>(1);
  const [cubeB, setCubeB] = useState<number>(0);
  const [cubeC, setCubeC] = useState<number>(-3);
  const [cubeD, setCubeD] = useState<number>(0);

  // Trig parameters: y = A * func(omega * x + phi) + k
  const [trigFunc, setTrigFunc] = useState<TrigType>('sin');
  const [trigAmp, setTrigAmp] = useState<number>(1);
  const [trigOmega, setTrigOmega] = useState<number>(1);
  const [trigPhi, setTrigPhi] = useState<number>(0);
  const [trigK, setTrigK] = useState<number>(0);

  // Custom Expressions: f(x) and g(x) / y = dx
  const [customExpr, setCustomExpr] = useState<string>('x^3 - 3*x');
  const [customExpr2, setCustomExpr2] = useState<string>('2*x');
  const [showSecondExpr, setShowSecondExpr] = useState<boolean>(true);
  const [activeInput, setActiveInput] = useState<'f' | 'g'>('f');
  const [paramD, setParamD] = useState<number>(1);

  // Check if expression 2 contains parameter 'd'
  const hasParameterD = useMemo(() => /\bd\b/i.test(customExpr2), [customExpr2]);

  // Table of values configuration
  const [tableStart, setTableStart] = useState<number>(-5);
  const [tableEnd, setTableEnd] = useState<number>(5);
  const [tableStep, setTableStep] = useState<number>(1);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Build active expression & analysis based on mode
  const { currentExpression, mathAnalysis, keyPoints, initialXRange, initialYRange } = useMemo(() => {
    let expr = '';
    let analysis: {
      title: string;
      formula: string;
      details: { label: string; value: string; note?: string }[];
    } = { title: '', formula: '', details: [] };
    const points: KeyPoint[] = [];
    let xRange: [number, number] = [-10, 10];
    let yRange: [number, number] = [-8, 8];

    if (mode === 'quadratic') {
      const a = quadA;
      const b = quadB;
      const c = quadC;

      const formatTerm = (coef: number, power: string, isFirst: boolean) => {
        if (coef === 0) return '';
        const sign = isFirst ? (coef < 0 ? '-' : '') : (coef < 0 ? ' - ' : ' + ');
        const absVal = Math.abs(coef);
        const coefStr = (absVal === 1 && power !== '') ? '' : absVal.toString();
        return `${sign}${coefStr}${power}`;
      };

      const t1 = formatTerm(a, 'x^2', true);
      const t2 = formatTerm(b, 'x', !t1);
      const t3 = formatTerm(c, '', !t1 && !t2);
      expr = `${t1}${t2}${t3}` || '0';

      // Analysis
      const delta = b * b - 4 * a * c;
      const vx = a !== 0 ? -b / (2 * a) : 0;
      const vy = a * vx * vx + b * vx + c;

      if (a !== 0) {
        // Vertex point
        const vxExact = formatExactMath(vx);
        const vyExact = formatExactMath(vy);
        points.push({
          x: Number(vx.toFixed(4)),
          y: Number(vy.toFixed(4)),
          label: `Đỉnh I(${vxExact.exact || vxExact.formatted}; ${vyExact.exact || vyExact.formatted})`,
          type: 'vertex',
          color: a > 0 ? '#fbbf24' : '#34d399'
        });

        // Roots
        if (delta > 0) {
          const r1 = (-b + Math.sqrt(delta)) / (2 * a);
          const r2 = (-b - Math.sqrt(delta)) / (2 * a);
          const r1Exact = formatExactMath(r1);
          const r2Exact = formatExactMath(r2);
          points.push({
            x: Number(r1.toFixed(4)),
            y: 0,
            label: r1Exact.exact ? `x₁ = ${r1Exact.exact}` : `x₁ ≈ ${r1Exact.formatted}`,
            type: 'root',
            color: '#38bdf8'
          });
          points.push({
            x: Number(r2.toFixed(4)),
            y: 0,
            label: r2Exact.exact ? `x₂ = ${r2Exact.exact}` : `x₂ ≈ ${r2Exact.formatted}`,
            type: 'root',
            color: '#38bdf8'
          });
        } else if (delta === 0) {
          const vxExact = formatExactMath(vx);
          points.push({
            x: Number(vx.toFixed(4)),
            y: 0,
            label: vxExact.exact ? `Nghiệm kép x = ${vxExact.exact}` : `Nghiệm kép x ≈ ${vxExact.formatted}`,
            type: 'root',
            color: '#38bdf8'
          });
        }

        // Y-intercept: only show if distinct from origin (0, 0)
        if (Math.abs(c) > 1e-4) {
          const cExact = formatExactMath(c);
          points.push({
            x: 0,
            y: c,
            label: `Oy (0; ${cExact.exact || cExact.formatted})`,
            type: 'y-intercept',
            color: '#c084fc'
          });
        }
      }

      const vxExact = formatExactMath(vx);
      const vyExact = formatExactMath(vy);
      const cExact = formatExactMath(c);

      analysis = {
        title: 'Khảo sát hàm số bậc 2 (Parabol)',
        formula: `y = ${a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`,
        details: [
          { label: 'Tọa độ Đỉnh Parabol', value: `I(${vxExact.exact || vxExact.formatted}; ${vyExact.exact || vyExact.formatted})` },
          { label: 'Trục đối xứng', value: `x = ${vxExact.exact || vxExact.formatted}` },
          { label: 'Biệt thức Delta (Δ)', value: `Δ = ${delta.toFixed(2)} (${delta > 0 ? '2 nghiệm thực phân biệt' : delta === 0 ? 'Nghiệm kép' : 'Vô nghiệm thực'})` },
          { label: 'Bề lõm Parabol', value: a > 0 ? 'Quay lên trên (a > 0) → Đạt cực tiểu tại đỉnh' : 'Quay xuống dưới (a < 0) → Đạt cực đại tại đỉnh' },
          { label: 'Giao điểm trục tung (Oy)', value: Math.abs(c) < 1e-4 ? 'O(0; 0) (gốc tọa độ)' : `(0; ${cExact.exact || cExact.formatted})` },
          { label: 'Tập giá trị T', value: a > 0 ? `[${vyExact.exact || vyExact.formatted}; +∞)` : `(-∞; ${vyExact.exact || vyExact.formatted}]` }
        ]
      };

      // Smart ranges around vertex
      const spanX = Math.max(8, Math.abs(vx) * 2 + 6);
      const spanY = Math.max(10, Math.abs(vy) * 2 + 6);
      xRange = [Math.floor(vx - spanX / 2), Math.ceil(vx + spanX / 2)];
      yRange = [Math.floor(vy - spanY / 2), Math.ceil(vy + spanY / 2)];

    } else if (mode === 'cubic') {
      const a = cubeA;
      const b = cubeB;
      const c = cubeC;
      const d = cubeD;

      expr = `${a}*x^3 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}*x^2 ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}*x ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}`;

      // Inflection point: x = -b / (3a)
      const ix = a !== 0 ? -b / (3 * a) : 0;
      const iy = a * Math.pow(ix, 3) + b * Math.pow(ix, 2) + c * ix + d;
      const ixExact = formatExactMath(ix);
      const iyExact = formatExactMath(iy);

      points.push({
        x: Number(ix.toFixed(4)),
        y: Number(iy.toFixed(4)),
        label: `Điểm uốn U(${ixExact.exact || ixExact.formatted}; ${iyExact.exact || iyExact.formatted})`,
        type: 'inflection',
        color: '#f59e0b'
      });

      // Derivative y' = 3ax^2 + 2bx + c
      // Delta' = b^2 - 3ac
      const deltaPrime = b * b - 3 * a * c;
      let extremaInfo = 'Hàm số luôn đơn điệu trên R (không có cực trị)';

      if (deltaPrime > 0 && a !== 0) {
        const xCrit1 = (-b + Math.sqrt(deltaPrime)) / (3 * a);
        const xCrit2 = (-b - Math.sqrt(deltaPrime)) / (3 * a);
        const yCrit1 = a * Math.pow(xCrit1, 3) + b * Math.pow(xCrit1, 2) + c * xCrit1 + d;
        const yCrit2 = a * Math.pow(xCrit2, 3) + b * Math.pow(xCrit2, 2) + c * xCrit2 + d;

        const isA1Max = a > 0 ? (xCrit2 < xCrit1) : (xCrit1 < xCrit2);
        const maxPt = isA1Max ? { x: xCrit2, y: yCrit2 } : { x: xCrit1, y: yCrit1 };
        const minPt = isA1Max ? { x: xCrit1, y: yCrit1 } : { x: xCrit2, y: yCrit2 };

        const maxXExact = formatExactMath(maxPt.x);
        const maxYExact = formatExactMath(maxPt.y);
        points.push({
          x: Number(maxPt.x.toFixed(4)),
          y: Number(maxPt.y.toFixed(4)),
          label: `Cực đại (${maxXExact.exact || maxXExact.formatted}; ${maxYExact.exact || maxYExact.formatted})`,
          type: 'max',
          color: '#34d399'
        });

        const minXExact = formatExactMath(minPt.x);
        const minYExact = formatExactMath(minPt.y);
        points.push({
          x: Number(minPt.x.toFixed(4)),
          y: Number(minPt.y.toFixed(4)),
          label: `Cực tiểu (${minXExact.exact || minXExact.formatted}; ${minYExact.exact || minYExact.formatted})`,
          type: 'min',
          color: '#fbbf24'
        });

        extremaInfo = `Có 2 cực trị: Cực đại tại x = ${maxXExact.exact || maxXExact.formatted}, Cực tiểu tại x = ${minXExact.exact || minXExact.formatted}`;
      }

      // Exact roots for cubic when d = 0 (e.g. x^3 - 3x = 0 -> x = -√3, 0, √3)
      if (Math.abs(d) < 1e-6) {
        points.push({
          x: 0,
          y: 0,
          label: 'Nghiệm x = 0',
          type: 'root',
          color: '#38bdf8'
        });
        if (a !== 0) {
          const qDelta = b * b - 4 * a * c;
          if (qDelta > 0) {
            const cr1 = (-b + Math.sqrt(qDelta)) / (2 * a);
            const cr2 = (-b - Math.sqrt(qDelta)) / (2 * a);
            if (Math.abs(cr1) > 1e-4) {
              const ex1 = formatExactMath(cr1);
              points.push({
                x: Number(cr1.toFixed(4)),
                y: 0,
                label: ex1.exact ? `Nghiệm x = ${ex1.exact}` : `Nghiệm x ≈ ${ex1.formatted}`,
                type: 'root',
                color: '#38bdf8'
              });
            }
            if (Math.abs(cr2) > 1e-4) {
              const ex2 = formatExactMath(cr2);
              points.push({
                x: Number(cr2.toFixed(4)),
                y: 0,
                label: ex2.exact ? `Nghiệm x = ${ex2.exact}` : `Nghiệm x ≈ ${ex2.formatted}`,
                type: 'root',
                color: '#38bdf8'
              });
            }
          }
        }
      }

      // Y-intercept: only push if non-zero
      if (Math.abs(d) > 1e-4) {
        const dExact = formatExactMath(d);
        points.push({
          x: 0,
          y: d,
          label: `Oy (0; ${dExact.exact || dExact.formatted})`,
          type: 'y-intercept',
          color: '#c084fc'
        });
      }

      const dExact = formatExactMath(d);

      analysis = {
        title: 'Khảo sát hàm số bậc 3 (Cubic Polynomial)',
        formula: `y = ${a}x³ ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x² ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}x ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}`,
        details: [
          { label: 'Đạo hàm bậc nhất y\'', value: `y' = ${3 * a}x² ${2 * b >= 0 ? `+ ${2 * b}` : `- ${Math.abs(2 * b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}` },
          { label: 'Điểm uốn (Tâm đối xứng)', value: `U(${ixExact.exact || ixExact.formatted}; ${iyExact.exact || iyExact.formatted})` },
          { label: 'Khảo sát cực trị', value: extremaInfo },
          { label: 'Giao điểm trục tung (Oy)', value: Math.abs(d) < 1e-4 ? 'O(0; 0) (gốc tọa độ)' : `(0; ${dExact.exact || dExact.formatted})` },
          { label: 'Giới hạn vô cực', value: a > 0 ? 'lim(x→+∞) = +∞, lim(x→-∞) = -∞' : 'lim(x→+∞) = -∞, lim(x→-∞) = +∞' }
        ]
      };

      xRange = [-8, 8];
      yRange = [-10, 10];

    } else if (mode === 'trigonometric') {
      const A = trigAmp;
      const w = trigOmega;
      const phi = trigPhi;
      const k = trigK;

      let inner = `${w === 1 ? '' : w === -1 ? '-' : `${w}*`}x`;
      if (phi !== 0) {
        inner += phi > 0 ? ` + ${phi}` : ` - ${Math.abs(phi)}`;
      }

      expr = `${A === 1 ? '' : A === -1 ? '-' : `${A}*`}${trigFunc}(${inner})`;
      if (k !== 0) {
        expr += k > 0 ? ` + ${k}` : ` - ${Math.abs(k)}`;
      }

      const period = trigFunc === 'tan' 
        ? Math.PI / Math.abs(w || 1)
        : (2 * Math.PI) / Math.abs(w || 1);

      analysis = {
        title: `Khảo sát hàm lượng giác y = ${expr}`,
        formula: `y = ${expr}`,
        details: [
          { label: 'Biên độ sóng (Amplitude)', value: trigFunc === 'tan' ? 'Vô hạn (Không có biên độ)' : `${Math.abs(A)}` },
          { label: 'Chu kỳ tuần hoàn (T)', value: `T = ${period.toFixed(4)} rad (≈ ${(period / Math.PI).toFixed(2)}π)` },
          { label: 'Tần số góc (ω)', value: `${w} rad/s` },
          { label: 'Độ lệch pha (φ)', value: `${phi} rad` },
          { label: 'Tập giá trị T', value: trigFunc === 'tan' ? 'R (Toàn trục số thực)' : `[${(k - Math.abs(A)).toFixed(2)}, ${(k + Math.abs(A)).toFixed(2)}]` },
          { label: 'Tập xác định', value: trigFunc === 'tan' ? 'D = R \\ { π/2 + kπ }' : 'D = R' }
        ]
      };

      xRange = [-Math.PI * 2.5, Math.PI * 2.5];
      yRange = trigFunc === 'tan' ? [-6, 6] : [-Math.abs(A) * 1.6 - Math.abs(k) - 1, Math.abs(A) * 1.6 + Math.abs(k) + 1];

    } else {
      // Custom mode: supports two functions (e.g. f(x) and g(x) / y = dx)
      expr = customExpr.trim() || 'x^2 - 4';
      const expr2Clean = showSecondExpr && customExpr2.trim() ? customExpr2.trim() : '';
      const dParams = hasParameterD ? { d: paramD } : undefined;

      const details = [
        { label: 'Hàm f(x) thứ nhất [y₁]', value: `y₁ = ${expr}` },
      ];

      if (expr2Clean) {
        details.push({
          label: 'Hàm g(x) / y = dx [y₂]',
          value: hasParameterD ? `y₂ = ${expr2Clean} (tham số d = ${paramD})` : `y₂ = ${expr2Clean}`
        });
        details.push({
          label: 'Phương trình tương giao',
          value: `(${expr}) - (${expr2Clean}) = 0`
        });
      }

      const yAt0 = evaluateExpression(expr, 0, dParams);
      const yAt1 = evaluateExpression(expr, 1, dParams);
      const yAtMinus1 = evaluateExpression(expr, -1, dParams);

      const f0Exact = Number.isFinite(yAt0) ? formatExactMath(yAt0) : null;
      const f1Exact = Number.isFinite(yAt1) ? formatExactMath(yAt1) : null;
      const fMinus1Exact = Number.isFinite(yAtMinus1) ? formatExactMath(yAtMinus1) : null;

      details.push(
        { label: 'f(0) [Giao trục Oy]', value: f0Exact ? (f0Exact.exact || f0Exact.formatted) : 'Không xác định' },
        { label: 'f(1)', value: f1Exact ? (f1Exact.exact || f1Exact.formatted) : 'Không xác định' },
        { label: 'f(-1)', value: fMinus1Exact ? (fMinus1Exact.exact || fMinus1Exact.formatted) : 'Không xác định' }
      );

      analysis = {
        title: expr2Clean 
          ? `Tương giao giữa y₁ = ${expr} và y₂ = ${expr2Clean}` 
          : `Khảo sát đồ thị hàm số y = ${expr}`,
        formula: expr2Clean ? `y₁ = ${expr}  •  y₂ = ${expr2Clean}` : `y = ${expr}`,
        details
      };
      xRange = [-10, 10];
      yRange = [-8, 8];
    }

    return {
      currentExpression: expr,
      mathAnalysis: analysis,
      keyPoints: points,
      initialXRange: xRange,
      initialYRange: yRange
    };
  }, [mode, quadA, quadB, quadC, cubeA, cubeB, cubeC, cubeD, trigFunc, trigAmp, trigOmega, trigPhi, trigK, customExpr, customExpr2, showSecondExpr, hasParameterD, paramD]);

  // Generate Table of Values with support for dual functions comparison
  const tableData = useMemo(() => {
    const list: { x: number; y1: number; y2: number | null; diff: number | null }[] = [];
    const step = Math.max(0.1, tableStep);
    const dParams = hasParameterD ? { d: paramD } : undefined;
    const isComparing = mode === 'custom' && showSecondExpr && Boolean(customExpr2.trim());

    for (let x = tableStart; x <= tableEnd + 0.001; x += step) {
      const cleanX = Number(x.toFixed(4));
      const y1 = evaluateExpression(currentExpression, cleanX, dParams);
      let y2: number | null = null;
      let diff: number | null = null;

      if (isComparing) {
        const val2 = evaluateExpression(customExpr2, cleanX, dParams);
        if (Number.isFinite(val2)) {
          y2 = Number(val2.toFixed(4));
          if (Number.isFinite(y1)) {
            diff = Number(Math.abs(y1 - val2).toFixed(4));
          }
        }
      }

      list.push({ 
        x: cleanX, 
        y1: Number(y1.toFixed(4)), 
        y2,
        diff
      });
    }
    return list;
  }, [currentExpression, tableStart, tableEnd, tableStep, mode, showSecondExpr, customExpr2, hasParameterD, paramD]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Graphing Calculator – Khảo Sát & Vẽ Đồ Thị Hàm Số Trực Quan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Vẽ đồ thị hàm bậc 2 (Parabol), bậc 3, hàm lượng giác sin, cos, tan và biểu thức f(x) bất kỳ với hệ trục Oxy tương tác
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="graph-export-pdf-btn"
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20 active:scale-95"
            title="Tải hồ sơ báo cáo đồ thị hàm số chuẩn PDF A4"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải PDF / In A4</span>
            <span className="sm:hidden">Tải PDF</span>
          </button>
          <button
            id="graph-reset-btn"
            onClick={() => {
              setMode('quadratic');
              setQuadA(1);
              setQuadB(-2);
              setQuadC(-3);
              setCubeA(1);
              setCubeB(0);
              setCubeC(-3);
              setCubeD(0);
              setTrigFunc('sin');
              setTrigAmp(1);
              setTrigOmega(1);
              setTrigPhi(0);
              setTrigK(0);
              setCustomExpr('x^3 - 3*x');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* Mode navigation tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'quadratic', label: 'Hàm Bậc 2 (Parabol ax² + bx + c)', icon: 'y = ax² + bx + c' },
          { id: 'cubic', label: 'Hàm Bậc 3 (ax³ + bx² + cx + d)', icon: 'y = ax³ + bx² + ...' },
          { id: 'trigonometric', label: 'Lượng Giác (Sin, Cos, Tan)', icon: 'sin / cos / tan' },
          { id: 'custom', label: 'Nhập Biểu Thức f(x) Tùy Ý', icon: 'f(x) Tự do' },
        ].map((m) => (
          <button
            key={m.id}
            id={`graph-mode-${m.id}`}
            onClick={() => setMode(m.id as GraphMode)}
            className={`px-4 py-2.5 text-xs sm:text-sm rounded-xl border font-medium transition-all flex items-center gap-2 cursor-pointer ${
              mode === m.id
                ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Left Controls & Right Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Equation Inputs & Presets */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-white flex items-center justify-between">
              <span>Thông Số Hàm Số</span>
              <span className="text-[11px] text-blue-400 font-mono">y = f(x)</span>
            </h2>

            {/* Mode 1: Quadratic Inputs */}
            {mode === 'quadratic' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số a</label>
                    <input
                      id="quad-input-a"
                      type="number"
                      step="any"
                      value={quadA}
                      onChange={(e) => setQuadA(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số b</label>
                    <input
                      id="quad-input-b"
                      type="number"
                      step="any"
                      value={quadB}
                      onChange={(e) => setQuadB(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hệ số c</label>
                    <input
                      id="quad-input-c"
                      type="number"
                      step="any"
                      value={quadC}
                      onChange={(e) => setQuadC(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets for Quadratic */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">Hàm bậc 2 mẫu phổ biến:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'x² - 2x - 3', a: 1, b: -2, c: -3 },
                      { label: '-x² + 4x - 3', a: -1, b: 4, c: -3 },
                      { label: 'x² - 4', a: 1, b: 0, c: -4 },
                      { label: '2x² - 8x + 6', a: 2, b: -8, c: 6 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setQuadA(p.a); setQuadB(p.b); setQuadC(p.c); }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-blue-300 border border-slate-700/80 transition-colors text-center font-mono cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Cubic Inputs */}
            {mode === 'cubic' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">a (x³)</label>
                    <input
                      id="cube-input-a"
                      type="number"
                      step="any"
                      value={cubeA}
                      onChange={(e) => setCubeA(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">b (x²)</label>
                    <input
                      id="cube-input-b"
                      type="number"
                      step="any"
                      value={cubeB}
                      onChange={(e) => setCubeB(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">c (x)</label>
                    <input
                      id="cube-input-c"
                      type="number"
                      step="any"
                      value={cubeC}
                      onChange={(e) => setCubeC(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">d (tự do)</label>
                    <input
                      id="cube-input-d"
                      type="number"
                      step="any"
                      value={cubeD}
                      onChange={(e) => setCubeD(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets for Cubic */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">Hàm bậc 3 mẫu:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'x³ - 3x', a: 1, b: 0, c: -3, d: 0 },
                      { label: 'x³ - 3x² + 2', a: 1, b: -3, c: 0, d: 2 },
                      { label: '-x³ + 3x + 1', a: -1, b: 0, c: 3, d: 1 },
                      { label: '0.5x³ - 2x', a: 0.5, b: 0, c: -2, d: 0 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setCubeA(p.a); setCubeB(p.b); setCubeC(p.c); setCubeD(p.d); }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-blue-300 border border-slate-700/80 transition-colors text-center font-mono cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Trigonometric Inputs */}
            {mode === 'trigonometric' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(['sin', 'cos', 'tan'] as TrigType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTrigFunc(f)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        trigFunc === f
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {f.toUpperCase()}(x)
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Biên độ A</label>
                    <input
                      type="number"
                      step="any"
                      value={trigAmp}
                      onChange={(e) => setTrigAmp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tần số góc ω</label>
                    <input
                      type="number"
                      step="any"
                      value={trigOmega}
                      onChange={(e) => setTrigOmega(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Độ lệch pha φ (rad)</label>
                    <input
                      type="number"
                      step="any"
                      value={trigPhi}
                      onChange={(e) => setTrigPhi(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Dịch trục tung k</label>
                    <input
                      type="number"
                      step="any"
                      value={trigK}
                      onChange={(e) => setTrigK(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-sans focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets for Trig */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">Dạng sóng mẫu:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: 'sin(x)', f: 'sin' as TrigType, a: 1, w: 1, p: 0, k: 0 },
                      { label: '2·sin(2x)', f: 'sin' as TrigType, a: 2, w: 2, p: 0, k: 0 },
                      { label: 'cos(x)', f: 'cos' as TrigType, a: 1, w: 1, p: 0, k: 0 },
                      { label: 'tan(x)', f: 'tan' as TrigType, a: 1, w: 1, p: 0, k: 0 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTrigFunc(p.f);
                          setTrigAmp(p.a);
                          setTrigOmega(p.w);
                          setTrigPhi(p.p);
                          setTrigK(p.k);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-blue-300 border border-slate-700/80 transition-colors text-center font-mono cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 4: Custom Expression Inputs */}
            {mode === 'custom' && (
              <div className="space-y-3.5">
                {/* Input 1: f(x) */}
                <div className={`p-3 rounded-xl border transition-all ${activeInput === 'f' ? 'bg-slate-800/90 border-blue-500 ring-1 ring-blue-500/50 shadow-md' : 'bg-slate-800/40 border-slate-700/80'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-[11px] border border-blue-500/30">y₁</span>
                      <span>Phương trình f(x) thứ nhất:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveInput('f')}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${activeInput === 'f' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                      {activeInput === 'f' ? '● Đang chọn' : 'Chọn nhập'}
                    </button>
                  </div>
                  <input
                    id="custom-f-input"
                    type="text"
                    value={customExpr}
                    onFocus={() => setActiveInput('f')}
                    onChange={(e) => setCustomExpr(e.target.value)}
                    placeholder="vd: x^3 - 3*x hoặc x^2 - 4"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                {/* Input 2: g(x) / y = dx */}
                <div className={`p-3 rounded-xl border transition-all ${activeInput === 'g' ? 'bg-slate-800/90 border-amber-500 ring-1 ring-amber-500/50 shadow-md' : 'bg-slate-800/40 border-slate-700/80'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px] border border-amber-500/30">y₂</span>
                      <span>Phương trình thứ hai / y = dx:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showSecondExpr}
                          onChange={(e) => setShowSecondExpr(e.target.checked)}
                          className="rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-0"
                        />
                        <span>Vẽ</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveInput('g')}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${activeInput === 'g' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        {activeInput === 'g' ? '● Đang chọn' : 'Chọn nhập'}
                      </button>
                    </div>
                  </div>
                  <input
                    id="custom-g-input"
                    type="text"
                    value={customExpr2}
                    disabled={!showSecondExpr}
                    onFocus={() => setActiveInput('g')}
                    onChange={(e) => setCustomExpr2(e.target.value)}
                    placeholder="vd: dx hoặc 2*x hoặc x - 1"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-1 focus:ring-amber-500 outline-none text-sm disabled:opacity-50"
                  />

                  {/* Parameter 'd' interactive slider controller */}
                  {showSecondExpr && hasParameterD && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-200 font-medium flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5" />
                          Hệ số góc d cho đường thẳng y = dx:
                        </span>
                        <span className="font-mono font-bold text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/40">
                          d = {paramD}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-8"
                        max="8"
                        step="0.5"
                        value={paramD}
                        onChange={(e) => setParamD(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        {[-3, -2, -1, 0, 0.5, 1, 2, 3].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setParamD(val)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${paramD === val ? 'bg-amber-500 text-slate-900 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          >
                            d={val}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-amber-200/70">
                        Kéo thanh trượt d để xoay đường thẳng trực quan và tự động tính giao điểm Oxy!
                      </p>
                    </div>
                  )}
                </div>

                {/* Virtual Keypad for easy one-touch typing */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-400">
                      Bàn phím nhập nhanh (Đang nhập: <span className={activeInput === 'f' ? 'text-blue-400 font-bold' : 'text-amber-400 font-bold'}>{activeInput === 'f' ? 'Ô 1: f(x)' : 'Ô 2: g(x)'}</span>):
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (Bấm ⌫ xóa 1 ký tự, AC xóa hết)
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 font-mono text-xs">
                    {[
                      'x', 'd', 'x²', 'x³', '^', '√',
                      'sin', 'cos', 'tan', 'π', '(', ')',
                      '7', '8', '9', '+', '-', '⌫',
                      '4', '5', '6', '*', '/', 'AC',
                      '1', '2', '3', '0', '.', 'e'
                    ].map((k) => {
                      // Styling based on key type
                      let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700';
                      if (k === '⌫') {
                        btnStyle = 'bg-amber-950/50 text-amber-300 hover:bg-amber-900/70 border-amber-600/60 font-bold';
                      } else if (k === 'AC') {
                        btnStyle = 'bg-rose-950/50 text-rose-300 hover:bg-rose-900/70 border-rose-600/60 font-bold';
                      } else if (/^[0-9.]$/.test(k)) {
                        btnStyle = 'bg-slate-800 text-white font-bold hover:bg-slate-700 border-slate-700 text-sm';
                      } else if (['+', '-', '*', '/', '^'].includes(k)) {
                        btnStyle = 'bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 border-blue-700/50 font-bold';
                      } else if (['sin', 'cos', 'tan', '√', 'π', 'e'].includes(k)) {
                        btnStyle = 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border-purple-700/40 font-medium';
                      } else if (['x', 'd', 'x²', 'x³'].includes(k)) {
                        btnStyle = 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 border-cyan-700/40 font-semibold';
                      }

                      return (
                        <button
                          key={k}
                          type="button"
                          title={k === '⌫' ? 'Xóa 1 ký tự cuối' : k === 'AC' ? 'Xóa hết ô đang chọn' : undefined}
                          onClick={() => {
                            const setter = activeInput === 'f' ? setCustomExpr : setCustomExpr2;
                            if (k === '⌫') {
                              setter((prev) => prev.slice(0, -1));
                            } else if (k === 'AC') {
                              setter('');
                            } else if (k === 'x²') {
                              setter((prev) => prev + '^2');
                            } else if (k === 'x³') {
                              setter((prev) => prev + '^3');
                            } else if (k === '√') {
                              setter((prev) => prev + 'sqrt(');
                            } else if (['sin', 'cos', 'tan'].includes(k)) {
                              setter((prev) => prev + `${k}(`);
                            } else if (k === 'π') {
                              setter((prev) => prev + 'π');
                            } else {
                              setter((prev) => prev + k);
                            }
                          }}
                          className={`py-1.5 rounded-lg border transition-colors text-center cursor-pointer shadow-sm active:scale-95 ${btnStyle}`}
                        >
                          {k}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestions for 2-curve problems */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5">Bài toán tương giao mẫu (2 đồ thị):</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: 'Bậc 3 & y = 2x', f1: 'x^3 - 3*x', f2: '2*x' },
                      { name: 'Parabol & y = x - 1', f1: 'x^2 - 4', f2: 'x - 1' },
                      { name: 'Khảo sát y = dx', f1: 'x^2 - 2*x', f2: 'd*x' },
                      { name: 'Lượng giác & y = 0.5x', f1: 'sin(x)', f2: '0.5*x' },
                      { name: 'Hai parabol cắt nhau', f1: '-x^2 + 4', f2: 'x^2 - 2' },
                      { name: 'Tương giao sin & cos', f1: 'sin(x)', f2: 'cos(x)' },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomExpr(p.f1);
                          setCustomExpr2(p.f2);
                          setShowSecondExpr(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-blue-300 border border-slate-700/80 transition-colors font-mono truncate text-left cursor-pointer"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Live Formula Banner */}
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs text-slate-300 space-y-1">
              <span className="text-[11px] text-slate-400 block mb-0.5">Phương trình đang vẽ:</span>
              <div className="font-mono text-blue-300 font-bold text-sm tracking-wide truncate">
                y₁ = {currentExpression}
              </div>
              {mode === 'custom' && showSecondExpr && customExpr2 && (
                <div className="font-mono text-amber-300 font-bold text-sm tracking-wide truncate">
                  y₂ = {hasParameterD ? `${customExpr2} (d=${paramD})` : customExpr2}
                </div>
              )}
            </div>
          </div>

          {/* Mathematical Analysis Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{mathAnalysis.title}</span>
            </h3>

            <div className="space-y-2 text-xs">
              {mathAnalysis.details.map((d, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800 gap-1">
                  <span className="text-slate-400">{d.label}:</span>
                  <span className="font-mono font-bold text-slate-200 text-right">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Table of Values Button */}
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-blue-400" />
              <span>Bảng Giá Trị (Table of Values x & y)</span>
            </div>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {showTable ? 'Ẩn bảng' : 'Xem bảng'}
            </span>
          </button>
        </div>

        {/* Right Column: Interactive Graph Canvas & Table */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveGraphPlotter
            expression={currentExpression}
            expression2={mode === 'custom' && showSecondExpr ? customExpr2 : ''}
            label1={mode === 'custom' ? 'f(x)' : undefined}
            label2={mode === 'custom' ? (hasParameterD ? `y = (${paramD})x` : 'g(x)') : undefined}
            params={hasParameterD ? { d: paramD } : undefined}
            initialXRange={initialXRange}
            initialYRange={initialYRange}
            keyPoints={keyPoints}
            title={mathAnalysis.title}
            isTrig={mode === 'trigonometric'}
          />

          {/* Collapsible Table of Values */}
          {showTable && (
            <div className="bg-slate-900/95 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white">Bảng Tọa Độ Điểm (x, y)</h4>
                  </div>
                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    title="Xuất bảng giá trị và đồ thị ra file PDF A4"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>Xuất PDF</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Từ x =</span>
                  <input
                    type="number"
                    value={tableStart}
                    onChange={(e) => setTableStart(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center"
                  />
                  <span className="text-slate-400">đến</span>
                  <input
                    type="number"
                    value={tableEnd}
                    onChange={(e) => setTableEnd(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center"
                  />
                  <span className="text-slate-400">bước</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={tableStep}
                    onChange={(e) => setTableStep(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-800/90 text-slate-300 sticky top-0 border-b border-slate-700">
                    <tr>
                      <th className="p-2.5 text-center">x</th>
                      <th className="p-2.5 text-center text-blue-400">y₁ = f(x)</th>
                      {mode === 'custom' && showSecondExpr && customExpr2 && (
                        <>
                          <th className="p-2.5 text-center text-amber-400">y₂ = g(x)</th>
                          <th className="p-2.5 text-center text-rose-400">|y₁ - y₂|</th>
                        </>
                      )}
                      <th className="p-2.5 text-center">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tableData.map((row, idx) => {
                      const isRoot = Math.abs(row.y1) < 1e-4;
                      const isYIntercept = Math.abs(row.x) < 1e-4;
                      const isIntersection = row.diff !== null && row.diff < 1e-3;

                      return (
                        <tr 
                          key={idx} 
                          className={
                            isIntersection 
                              ? 'bg-rose-500/15' 
                              : isRoot 
                              ? 'bg-blue-500/10' 
                              : isYIntercept 
                              ? 'bg-purple-500/10' 
                              : 'hover:bg-slate-800/40'
                          }
                        >
                          <td className="p-2 text-center text-slate-200 font-bold">{row.x}</td>
                          <td className="p-2 text-center text-blue-400 font-bold">
                            {isNaN(row.y1) ? 'Không xác định' : row.y1.toLocaleString()}
                          </td>
                          {mode === 'custom' && showSecondExpr && customExpr2 && (
                            <>
                              <td className="p-2 text-center text-amber-400 font-bold">
                                {row.y2 === null || isNaN(row.y2) ? 'Không xác định' : row.y2.toLocaleString()}
                              </td>
                              <td className="p-2 text-center text-rose-400 font-bold">
                                {row.diff === null || isNaN(row.diff) ? '-' : row.diff.toLocaleString()}
                              </td>
                            </>
                          )}
                          <td className="p-2 text-center text-slate-400 text-[11px]">
                            {isIntersection && <span className="text-rose-400 font-sans font-bold">Giao điểm y₁ ≈ y₂</span>}
                            {!isIntersection && isRoot && <span className="text-blue-400 font-sans">Nghiệm f(x) = 0</span>}
                            {!isIntersection && isYIntercept && <span className="text-purple-400 font-sans">Cắt trục tung Oy</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Graphing PDF & Print Modal */}
      <GraphingPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        mode={mode}
        expression={currentExpression}
        expression2={mode === 'custom' && showSecondExpr ? customExpr2 : ''}
        showSecondExpr={mode === 'custom' && showSecondExpr}
        paramD={paramD}
        hasParameterD={hasParameterD}
        mathAnalysis={mathAnalysis}
        keyPoints={keyPoints}
        tableData={tableData}
      />
    </div>
  );
};
