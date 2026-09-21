import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import {
  evaluateExpression,
  formatExactMath,
  formatPiNotation
} from '../../../utils/mathParser';

export interface KeyPoint {
  x: number;
  y: number;
  label: string;
  type: 'root' | 'vertex' | 'y-intercept' | 'inflection' | 'max' | 'min' | 'intersection';
  color?: string;
}

interface InteractiveGraphPlotterProps {
  expression?: string; // e.g. "x^2 - 4" or "sin(x)"
  expression2?: string; // second function, e.g. "2*x" or "dx" or "x - 1"
  label1?: string;
  label2?: string;
  params?: Record<string, number>; // e.g. { d: paramD }
  customFn?: (x: number) => number;
  customFn2?: (x: number) => number;
  initialXRange?: [number, number];
  initialYRange?: [number, number];
  keyPoints?: KeyPoint[];
  title?: string;
  isTrig?: boolean;
}

export const InteractiveGraphPlotter: React.FC<InteractiveGraphPlotterProps> = ({
  expression = 'x^2 - 4',
  expression2 = '',
  params,
  customFn,
  customFn2,
  initialXRange = [-10, 10],
  initialYRange = [-8, 8],
  keyPoints: externalKeyPoints,
  title,
  isTrig = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // View ranges
  const [xRange, setXRange] = useState<[number, number]>(initialXRange);
  const [yRange, setYRange] = useState<[number, number]>(initialYRange);

  // Label display mode: 'arrows' (far with thin leader arrows), 'compact' (close), 'hover' (hover only), 'off' (hidden)
  const [labelMode, setLabelMode] = useState<'arrows' | 'hover' | 'off'>('arrows');

  // Hover state
  const [hoverCoord, setHoverCoord] = useState<{ 
    x: number; 
    y1: number; 
    y2: number | null; 
    px: number; 
    py1: number; 
    py2: number | null;
  } | null>(null);

  // Pan / Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origXRange: [number, number]; origYRange: [number, number] } | null>(null);

  // Update ranges when initial props change
  useEffect(() => {
    setXRange(initialXRange);
    setYRange(initialYRange);
  }, [initialXRange[0], initialXRange[1], initialYRange[0], initialYRange[1]]);

  // Canvas size
  const [dimensions, setDimensions] = useState({ width: 680, height: 420 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = Math.max(340, Math.min(500, Math.round(w * 0.62)));
        setDimensions({ width: Math.max(320, w), height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const width = dimensions.width;
  const height = dimensions.height;

  // Coordinate transforms
  const toScreenX = useCallback((x: number) => {
    return ((x - xMin) / (xMax - xMin)) * width;
  }, [xMin, xMax, width]);

  const toScreenY = useCallback((y: number) => {
    return height - ((y - yMin) / (yMax - yMin)) * height;
  }, [yMin, yMax, height]);

  const toMathX = useCallback((screenX: number) => {
    return xMin + (screenX / width) * (xMax - xMin);
  }, [xMin, xMax, width]);

  // Clean negative zero to prevent "-0.00"
  const cleanZero = useCallback((val: number): number => {
    return Math.abs(val) < 1e-5 ? 0 : val;
  }, []);

  // Detect whether trigonometric context applies (explicit isTrig or functions contain sin/cos/tan)
  const isTrigMode = useMemo(() => {
    return Boolean(
      isTrig ||
      expression.toLowerCase().includes('sin') ||
      expression.toLowerCase().includes('cos') ||
      expression.toLowerCase().includes('tan') ||
      (expression2 && (
        expression2.toLowerCase().includes('sin') ||
        expression2.toLowerCase().includes('cos') ||
        expression2.toLowerCase().includes('tan')
      ))
    );
  }, [isTrig, expression, expression2]);

  // Evaluate function 1
  const evalY1 = useCallback((x: number): number => {
    if (customFn) return customFn(x);
    return evaluateExpression(expression, x, params);
  }, [customFn, expression, params]);

  // Evaluate function 2 (if present)
  const hasSecondCurve = useMemo(() => {
    if (customFn2) return true;
    return Boolean(expression2 && expression2.trim());
  }, [customFn2, expression2]);

  const evalY2 = useCallback((x: number): number | null => {
    if (!hasSecondCurve) return null;
    if (customFn2) return customFn2(x);
    return evaluateExpression(expression2, x, params);
  }, [hasSecondCurve, customFn2, expression2, params]);

  // Compute graph paths for curve 1 and curve 2, plus auto detected points
  const { pathData1, pathData2, detectedPoints } = useMemo(() => {
    const samples = 650;
    const dx = (xMax - xMin) / samples;
    const segments1: string[] = [];
    let currentSegment1: string[] = [];

    const segments2: string[] = [];
    let currentSegment2: string[] = [];

    let prevY1 = NaN;
    let prevY2 = NaN;
    let prevX = NaN;

    const autoPoints: KeyPoint[] = [];

    // Check y-intercept: f(0). Strictly omit if y(0) == 0 (do not show Oy (0, 0.00) at origin)
    if (xMin <= 0 && xMax >= 0) {
      const y0 = evalY1(0);
      if (Number.isFinite(y0) && Math.abs(cleanZero(y0)) > 1e-4) {
        const yExact = formatExactMath(y0, false);
        autoPoints.push({
          x: 0,
          y: Number(cleanZero(y0).toFixed(4)),
          label: `Oy (0; ${yExact.exact || yExact.formatted})`,
          type: 'y-intercept',
          color: '#c084fc'
        });
      }
    }

    for (let i = 0; i <= samples; i++) {
      const x = xMin + i * dx;
      const y1 = evalY1(x);
      const y2 = hasSecondCurve ? evalY2(x) : null;

      // 1. Root crossing for Curve 1: f(x) * prevY1 <= 0 with 24 bisection steps for micro-precision
      if (!isNaN(prevY1) && isFinite(prevY1) && isFinite(y1) && prevY1 * y1 <= 0 && Math.abs(prevY1 - y1) < (yMax - yMin)) {
        let rA = prevX;
        let rB = x;
        for (let step = 0; step < 24; step++) {
          const rMid = (rA + rB) / 2;
          const yMid = evalY1(rMid);
          if (evalY1(rA) * yMid <= 0) {
            rB = rMid;
          } else {
            rA = rMid;
          }
        }
        const rootX = (rA + rB) / 2;
        if (autoPoints.filter(p => p.type === 'root' && Math.abs(p.x - rootX) < 0.25).length === 0) {
          const xExact = formatExactMath(rootX, isTrigMode);
          const rootText = xExact.exact ? `Nghiệm x = ${xExact.exact}` : `Nghiệm x ≈ ${xExact.formatted}`;
          autoPoints.push({
            x: Number(cleanZero(rootX).toFixed(4)),
            y: 0,
            label: rootText,
            type: 'root',
            color: '#38bdf8'
          });
        }
      }

      // 2. Intersections between Curve 1 and Curve 2: 24 bisection steps
      if (hasSecondCurve && y2 !== null && isFinite(y1) && isFinite(y2) && !isNaN(prevY1) && !isNaN(prevY2)) {
        const prevDiff = prevY1 - prevY2;
        const currDiff = y1 - y2;
        if (isFinite(prevDiff) && isFinite(currDiff) && prevDiff * currDiff <= 0 && Math.abs(prevDiff - currDiff) < (yMax - yMin)) {
          let iA = prevX;
          let iB = x;
          for (let step = 0; step < 24; step++) {
            const iMid = (iA + iB) / 2;
            const diffMid = evalY1(iMid) - (evalY2(iMid) ?? 0);
            const diffA = evalY1(iA) - (evalY2(iA) ?? 0);
            if (diffA * diffMid <= 0) {
              iB = iMid;
            } else {
              iA = iMid;
            }
          }
          const interX = (iA + iB) / 2;
          const interY = evalY1(interX);
          if (isFinite(interY) && autoPoints.filter(p => p.type === 'intersection' && Math.abs(p.x - interX) < 0.25).length === 0) {
            const xExact = formatExactMath(interX, isTrigMode);
            const yExact = formatExactMath(interY);
            const xStr = xExact.exact || xExact.formatted;
            const yStr = yExact.exact || yExact.formatted;
            autoPoints.push({
              x: Number(cleanZero(interX).toFixed(4)),
              y: Number(cleanZero(interY).toFixed(4)),
              label: `Giao (${xStr}; ${yStr})`,
              type: 'intersection',
              color: '#f43f5e'
            });
          }
        }
      }

      // 3. Detect local extrema for Curve 1 with golden-section search
      if (i > 1 && i < samples - 1) {
        const yBefore = evalY1(x - dx);
        const yAfter = evalY1(x + dx);
        if (isFinite(yBefore) && isFinite(y1) && isFinite(yAfter)) {
          const d1 = y1 - yBefore;
          const d2 = yAfter - y1;
          if (d1 > 0 && d2 < 0) {
            // Golden section search for local maximum
            let a = x - dx;
            let b = x + dx;
            const gr = (Math.sqrt(5) - 1) / 2;
            let c = b - gr * (b - a);
            let d = a + gr * (b - a);
            for (let step = 0; step < 16; step++) {
              if (evalY1(c) < evalY1(d)) {
                a = c;
              } else {
                b = d;
              }
              c = b - gr * (b - a);
              d = a + gr * (b - a);
            }
            const peakX = (a + b) / 2;
            const peakY = evalY1(peakX);
            if (autoPoints.filter(p => p.type === 'max' && Math.abs(p.x - peakX) < 0.35).length === 0) {
              const xExact = formatExactMath(peakX, isTrigMode);
              const yExact = formatExactMath(peakY);
              const xStr = xExact.exact || xExact.formatted;
              const yStr = yExact.exact || yExact.formatted;
              autoPoints.push({
                x: Number(cleanZero(peakX).toFixed(4)),
                y: Number(cleanZero(peakY).toFixed(4)),
                label: `Cực đại (${xStr}; ${yStr})`,
                type: 'max',
                color: '#34d399'
              });
            }
          } else if (d1 < 0 && d2 > 0) {
            // Golden section search for local minimum
            let a = x - dx;
            let b = x + dx;
            const gr = (Math.sqrt(5) - 1) / 2;
            let c = b - gr * (b - a);
            let d = a + gr * (b - a);
            for (let step = 0; step < 16; step++) {
              if (evalY1(c) > evalY1(d)) {
                a = c;
              } else {
                b = d;
              }
              c = b - gr * (b - a);
              d = a + gr * (b - a);
            }
            const valleyX = (a + b) / 2;
            const valleyY = evalY1(valleyX);
            if (autoPoints.filter(p => p.type === 'min' && Math.abs(p.x - valleyX) < 0.35).length === 0) {
              const xExact = formatExactMath(valleyX, isTrigMode);
              const yExact = formatExactMath(valleyY);
              const xStr = xExact.exact || xExact.formatted;
              const yStr = yExact.exact || yExact.formatted;
              autoPoints.push({
                x: Number(cleanZero(valleyX).toFixed(4)),
                y: Number(cleanZero(valleyY).toFixed(4)),
                label: `Cực tiểu (${xStr}; ${yStr})`,
                type: 'min',
                color: '#fbbf24'
              });
            }
          }
        }
      }

      prevX = x;
      prevY1 = y1;
      if (y2 !== null) prevY2 = y2;

      // Build Curve 1 Segment
      const sy1 = toScreenY(y1);
      const sx = toScreenX(x);
      const isOutOfBounds1 = isNaN(y1) || !isFinite(y1) || Math.abs(y1) > 1e4;
      const isAsymptoteJump1 = !isNaN(prevY1) && Math.abs(sy1 - toScreenY(prevY1)) > height * 0.8;

      if (isOutOfBounds1 || isAsymptoteJump1) {
        if (currentSegment1.length > 0) {
          segments1.push(currentSegment1.join(' '));
          currentSegment1 = [];
        }
      } else {
        if (currentSegment1.length === 0) {
          currentSegment1.push(`M ${sx.toFixed(2)} ${sy1.toFixed(2)}`);
        } else {
          currentSegment1.push(`L ${sx.toFixed(2)} ${sy1.toFixed(2)}`);
        }
      }

      // Build Curve 2 Segment (if present)
      if (hasSecondCurve && y2 !== null) {
        const sy2 = toScreenY(y2);
        const isOutOfBounds2 = isNaN(y2) || !isFinite(y2) || Math.abs(y2) > 1e4;
        const isAsymptoteJump2 = !isNaN(prevY2) && Math.abs(sy2 - toScreenY(prevY2)) > height * 0.8;

        if (isOutOfBounds2 || isAsymptoteJump2) {
          if (currentSegment2.length > 0) {
            segments2.push(currentSegment2.join(' '));
            currentSegment2 = [];
          }
        } else {
          if (currentSegment2.length === 0) {
            currentSegment2.push(`M ${sx.toFixed(2)} ${sy2.toFixed(2)}`);
          } else {
            currentSegment2.push(`L ${sx.toFixed(2)} ${sy2.toFixed(2)}`);
          }
        }
      }
    }

    if (currentSegment1.length > 0) segments1.push(currentSegment1.join(' '));
    if (currentSegment2.length > 0) segments2.push(currentSegment2.join(' '));

    return {
      pathData1: segments1.join(' '),
      pathData2: segments2.join(' '),
      detectedPoints: autoPoints.slice(0, 10)
    };
  }, [xMin, xMax, yMin, yMax, evalY1, evalY2, hasSecondCurve, toScreenX, toScreenY, width, height, cleanZero, isTrigMode]);

  // Points to render: combine external points and detected points, deduplicating coincident points
  const pointsToRender = useMemo(() => {
    const rawList = externalKeyPoints && externalKeyPoints.length > 0
      ? [...externalKeyPoints, ...detectedPoints.filter(p => p.type === 'intersection')]
      : detectedPoints;

    // Filter out any y-intercept that is at the origin (0, 0)
    const filteredList = rawList.filter(
      p => !(p.type === 'y-intercept' && Math.abs(p.x) < 1e-4 && Math.abs(p.y) < 1e-4)
    );

    // Deduplicate / merge coincident points within 0.15 distance
    const merged: KeyPoint[] = [];
    for (const pt of filteredList) {
      const existing = merged.find(p => Math.abs(p.x - pt.x) < 0.15 && Math.abs(p.y - pt.y) < 0.15);
      if (existing) {
        if (pt.type === 'intersection' || existing.type === 'intersection') {
          const xExact = formatExactMath(existing.x, isTrigMode);
          const yExact = formatExactMath(existing.y);
          existing.type = 'intersection';
          existing.color = '#f43f5e';
          existing.label = `Giao (${xExact.exact || xExact.formatted}; ${yExact.exact || yExact.formatted})`;
        } else if (pt.type === 'root' || existing.type === 'root') {
          const xExact = formatExactMath(existing.x, isTrigMode);
          existing.type = 'root';
          existing.color = '#38bdf8';
          existing.label = xExact.exact ? `Nghiệm x = ${xExact.exact}` : `Nghiệm x ≈ ${xExact.formatted}`;
        }
      } else {
        merged.push({ ...pt });
      }
    }

    // Final safety: strictly no y-intercept at origin
    return merged.filter(p => !(p.type === 'y-intercept' && Math.abs(p.x) < 1e-4 && Math.abs(p.y) < 1e-4));
  }, [externalKeyPoints, detectedPoints, isTrigMode]);

  // Grid step calculation
  const getGridTicks = (min: number, max: number, targetCount: number = 8) => {
    const rawStep = (max - min) / targetCount;
    const power = Math.floor(Math.log10(Math.max(1e-9, rawStep)));
    const magnitude = Math.pow(10, power);
    const normalized = rawStep / magnitude;

    let step: number;
    if (normalized < 1.5) step = 1 * magnitude;
    else if (normalized < 3.5) step = 2 * magnitude;
    else if (normalized < 7.5) step = 5 * magnitude;
    else step = 10 * magnitude;

    const firstTick = Math.ceil(min / step) * step;
    const ticks: number[] = [];
    for (let t = firstTick; t <= max + step * 0.1; t += step) {
      const clean = Number(t.toFixed(6));
      ticks.push(clean);
    }
    return { step, ticks };
  };

  const xGrid = useMemo(() => getGridTicks(xMin, xMax, 10), [xMin, xMax]);
  const yGrid = useMemo(() => getGridTicks(yMin, yMax, 8), [yMin, yMax]);

  // Trigonometric X Grid when in trig mode
  const trigXGrid = useMemo(() => {
    if (!isTrigMode) return null;
    const span = xMax - xMin;
    const pi = Math.PI;
    let step = pi;
    if (span <= 4.5) step = pi / 4;
    else if (span <= 10) step = pi / 2;
    else if (span <= 22) step = pi;
    else if (span <= 45) step = 2 * pi;
    else step = 4 * pi;

    const firstTick = Math.ceil(xMin / step) * step;
    const ticks: { val: number; label: string }[] = [];
    for (let t = firstTick; t <= xMax + step * 0.05; t += step) {
      const clean = cleanZero(t);
      const label = formatPiNotation(clean, true) || clean.toFixed(2);
      ticks.push({ val: clean, label });
    }
    return { step, ticks };
  }, [isTrigMode, xMin, xMax, cleanZero, formatPiNotation]);

  // Zero axes coordinates in screen
  const screenOriginX = toScreenX(0);
  const screenOriginY = toScreenY(0);

  // Pan and Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origXRange: [...xRange],
      origYRange: [...yRange]
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;

    // Update hover coord
    const mathX = toMathX(clientX);
    const y1 = evalY1(mathX);
    const y2 = hasSecondCurve ? evalY2(mathX) : null;

    if (isFinite(y1)) {
      setHoverCoord({
        x: mathX,
        y1,
        y2: y2 !== null && isFinite(y2) ? y2 : null,
        px: clientX,
        py1: toScreenY(y1),
        py2: y2 !== null && isFinite(y2) ? toScreenY(y2) : null
      });
    } else {
      setHoverCoord(null);
    }

    // Drag / Pan logic
    if (isDragging && dragStartRef.current) {
      const dxPx = e.clientX - dragStartRef.current.startX;
      const dyPx = e.clientY - dragStartRef.current.startY;

      const spanX = dragStartRef.current.origXRange[1] - dragStartRef.current.origXRange[0];
      const spanY = dragStartRef.current.origYRange[1] - dragStartRef.current.origYRange[0];

      const dxMath = (dxPx / width) * spanX;
      const dyMath = (dyPx / height) * spanY;

      setXRange([
        dragStartRef.current.origXRange[0] - dxMath,
        dragStartRef.current.origXRange[1] - dxMath
      ]);
      setYRange([
        dragStartRef.current.origYRange[0] + dyMath,
        dragStartRef.current.origYRange[1] + dyMath
      ]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    setHoverCoord(null);
  };

  // Zoom Handler
  const handleZoom = (scaleFactor: number) => {
    const midX = (xMin + xMax) / 2;
    const midY = (yMin + yMax) / 2;
    const spanX = (xMax - xMin) * scaleFactor;
    const spanY = (yMax - yMin) * scaleFactor;

    setXRange([midX - spanX / 2, midX + spanX / 2]);
    setYRange([midY - spanY / 2, midY + spanY / 2]);
  };

  // Reset View
  const handleReset = () => {
    setXRange(initialXRange);
    setYRange(initialYRange);
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    handleZoom(factor);
  };

  // Calculate layout coordinates for points and labels with true diagonal leader arrows ("mũi tên chéo để chỉ")
  const layoutPoints = useMemo(() => {
    const placedBoxes: { x: number; y: number; w: number; h: number }[] = [];

    // Filter points within screen view area
    const visiblePoints = pointsToRender.filter((pt) => {
      const sx = toScreenX(pt.x);
      const sy = toScreenY(pt.y);
      return sx >= -40 && sx <= width + 40 && sy >= -40 && sy <= height + 40;
    });

    return visiblePoints.map((pt, idx) => {
      const sx = toScreenX(pt.x);
      const sy = toScreenY(pt.y);
      const color = pt.color || '#38bdf8';
      const labelText = pt.label;
      const badgeW = Math.max(76, labelText.length * 6.8 + 20);
      const badgeH = 22;

      // Diagonal direction selection:
      // dirX: +1 (badge to right of point), -1 (badge to left of point)
      // dirY: -1 (badge above point), +1 (badge below point)
      let dirX: 1 | -1 = 1;
      let dirY: 1 | -1 = -1;

      // Horizontal direction logic
      if (sx > width - 145) {
        dirX = -1;
      } else if (sx < 145) {
        dirX = 1;
      } else {
        if (pt.type === 'intersection') {
          dirX = idx % 2 === 0 ? 1 : -1;
        } else if (pt.type === 'root') {
          dirX = pt.x >= 0 ? 1 : -1;
        } else if (pt.type === 'y-intercept') {
          dirX = -1;
        } else {
          dirX = idx % 2 === 0 ? 1 : -1;
        }
      }

      // Vertical direction logic
      if (sy < 80) {
        dirY = 1; // force below point, pointing up-diagonal
      } else if (sy > height - 80) {
        dirY = -1; // force above point, pointing down-diagonal
      } else {
        if (pt.type === 'max' || pt.type === 'vertex') {
          dirY = -1;
        } else if (pt.type === 'min') {
          dirY = 1;
        } else {
          dirY = idx % 2 === 0 ? -1 : 1;
        }
      }

      // Diagonal offsets in pixels: creating a natural diagonal angle (~35° - 50°)
      let distX = 46 + (idx % 3) * 12;
      let distY = 34 + (idx % 2) * 12;

      let tentativeX = dirX > 0 ? sx + distX : sx - distX - badgeW;
      let tentativeY = dirY > 0 ? sy + distY : sy - distY - badgeH;

      // Anti-collision checking against already placed badges
      for (const prev of placedBoxes) {
        const overlapX = Math.abs(tentativeX + badgeW / 2 - (prev.x + prev.w / 2)) < (badgeW + prev.w) / 2 + 8;
        const overlapY = Math.abs(tentativeY + badgeH / 2 - (prev.y + prev.h) / 2) < (badgeH + prev.h) / 2 + 6;
        if (overlapX && overlapY) {
          // Push further along diagonal to prevent badge overlap
          distX += 28;
          distY += 22;
          tentativeX = dirX > 0 ? sx + distX : sx - distX - badgeW;
          tentativeY = dirY > 0 ? sy + distY : sy - distY - badgeH;
        }
      }

      const clampedX = Math.max(8, Math.min(width - badgeW - 8, tentativeX));
      const clampedY = Math.max(8, Math.min(height - badgeH - 8, tentativeY));

      placedBoxes.push({ x: clampedX, y: clampedY, w: badgeW, h: badgeH });

      // Determine the connection anchor on the badge corner closest to (sx, sy)
      const badgeCenterX = clampedX + badgeW / 2;
      const badgeCenterY = clampedY + badgeH / 2;

      let startX: number;
      let startY: number;

      if (badgeCenterX < sx && badgeCenterY < sy) {
        // Badge is Top-Left of point -> anchor is bottom-right corner
        startX = clampedX + badgeW - 3;
        startY = clampedY + badgeH - 3;
      } else if (badgeCenterX >= sx && badgeCenterY < sy) {
        // Badge is Top-Right of point -> anchor is bottom-left corner
        startX = clampedX + 3;
        startY = clampedY + badgeH - 3;
      } else if (badgeCenterX < sx && badgeCenterY >= sy) {
        // Badge is Bottom-Left of point -> anchor is top-right corner
        startX = clampedX + badgeW - 3;
        startY = clampedY + 3;
      } else {
        // Badge is Bottom-Right of point -> anchor is top-left corner
        startX = clampedX + 3;
        startY = clampedY + 3;
      }

      // Compute diagonal target vector pointing directly at perimeter of circle (r = 5.5)
      const angle = Math.atan2(sy - startY, sx - startX);
      const targetX = sx - Math.cos(angle) * 7.5;
      const targetY = sy - Math.sin(angle) * 7.5;

      return {
        pt,
        sx,
        sy,
        color,
        badgeW,
        badgeH,
        clampedX,
        clampedY,
        startX,
        startY,
        targetX,
        targetY
      };
    }).filter(Boolean);
  }, [pointsToRender, toScreenX, toScreenY, width, height]);

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-slate-900/95 rounded-2xl border border-slate-800 p-3 sm:p-5 flex flex-col space-y-3 shadow-2xl relative"
    >
      {/* Header bar with formulas and controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2 flex-wrap">
              <span>{title || 'Đồ Thị Hàm Số Oxy'}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/30">
                y₁ = {expression}
              </span>
              {hasSecondCurve && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-amber-600/20 text-amber-300 border border-amber-500/30">
                  y₂ = {expression2}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Kéo chuột để di chuyển (Pan) • Lăn chuột hoặc nút +/- để thu phóng (Zoom)
            </p>
          </div>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Label Mode Switcher */}
          <button
            onClick={() => {
              if (labelMode === 'arrows') setLabelMode('hover');
              else if (labelMode === 'hover') setLabelMode('off');
              else setLabelMode('arrows');
            }}
            title="Chế độ hiển thị nhãn điểm & mũi tên chỉ dẫn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {labelMode === 'arrows' && 'Nhãn: Mũi tên'}
              {labelMode === 'hover' && 'Nhãn: Rê chuột'}
              {labelMode === 'off' && 'Nhãn: Ẩn'}
            </span>
          </button>

          <button
            id="graph-zoom-in"
            onClick={() => handleZoom(0.8)}
            title="Thu phóng gần (Zoom in)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="graph-zoom-out"
            onClick={() => handleZoom(1.25)}
            title="Thu phóng xa (Zoom out)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="graph-reset"
            onClick={handleReset}
            title="Đặt lại góc nhìn (Reset View)"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div 
        className="w-full relative rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#0a0e18] via-[#0c1220] to-[#0a0e18] overflow-hidden select-none cursor-crosshair touch-none"
        style={{ height: `${dimensions.height}px` }}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full"
        >
          <defs>
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.38" />
            </pattern>
            
            {/* Gradient for Curve 1 */}
            <linearGradient id="curve1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            {/* Gradient for Curve 2 */}
            <linearGradient id="curve2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Axes arrows */}
            <marker id="axisArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#94a3b8" />
            </marker>

            {/* Leader pointer arrows with auto orientation for true diagonal pointing */}
            <marker id="labelPointerArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 L 2 5 z" fill="#cbd5e1" />
            </marker>
          </defs>

          {/* Grid background dots */}
          <rect width={width} height={height} fill="url(#dotGrid)" />

          {/* Vertical Grid Lines (X-axis ticks, with π multiples in trig mode) */}
          {(trigXGrid ? trigXGrid.ticks : xGrid.ticks.map((v) => ({ val: v, label: String(v) }))).map((tick) => {
            const sx = toScreenX(tick.val);
            const isZero = Math.abs(tick.val) < 1e-9;
            return (
              <g key={`x-grid-${tick.val}`}>
                <line
                  x1={sx}
                  y1={0}
                  x2={sx}
                  y2={height}
                  stroke={isZero ? '#64748b' : '#1e293b'}
                  strokeWidth={isZero ? 1.5 : 1}
                  strokeDasharray={isZero ? undefined : '2 3'}
                />
                {!isZero && (
                  <text
                    x={sx}
                    y={Math.min(height - 6, Math.max(16, screenOriginY + 14))}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily={trigXGrid ? 'sans-serif' : 'monospace'}
                  >
                    {tick.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Horizontal Grid Lines (Y-axis ticks) */}
          {yGrid.ticks.map((val) => {
            const sy = toScreenY(val);
            const isZero = Math.abs(val) < 1e-9;
            return (
              <g key={`y-grid-${val}`}>
                <line
                  x1={0}
                  y1={sy}
                  x2={width}
                  y2={sy}
                  stroke={isZero ? '#64748b' : '#1e293b'}
                  strokeWidth={isZero ? 1.5 : 1}
                  strokeDasharray={isZero ? undefined : '2 3'}
                />
                {!isZero && (
                  <text
                    x={Math.max(6, Math.min(width - 24, screenOriginX - 8))}
                    y={sy + 3.5}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Main X Axis */}
          {screenOriginY >= 0 && screenOriginY <= height && (
            <g>
              <line
                x1={0}
                y1={screenOriginY}
                x2={width}
                y2={screenOriginY}
                stroke="#94a3b8"
                strokeWidth="1.8"
                markerEnd="url(#axisArrow)"
              />
              <text
                x={width - 12}
                y={screenOriginY - 8}
                textAnchor="end"
                fill="#f8fafc"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                x
              </text>
            </g>
          )}

          {/* Main Y Axis */}
          {screenOriginX >= 0 && screenOriginX <= width && (
            <g>
              <line
                x1={screenOriginX}
                y1={height}
                x2={screenOriginX}
                y2={0}
                stroke="#94a3b8"
                strokeWidth="1.8"
                markerEnd="url(#axisArrow)"
              />
              <text
                x={screenOriginX + 12}
                y={16}
                fill="#f8fafc"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                y
              </text>
            </g>
          )}

          {/* Origin label (O) */}
          {screenOriginX >= 0 && screenOriginX <= width && screenOriginY >= 0 && screenOriginY <= height && (
            <text
              x={screenOriginX - 10}
              y={screenOriginY + 14}
              fill="#94a3b8"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              O
            </text>
          )}

          {/* Curve 1 Path */}
          {pathData1 && (
            <path
              d={pathData1}
              fill="none"
              stroke="url(#curve1Gradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Curve 2 Path (if enabled) */}
          {hasSecondCurve && pathData2 && (
            <path
              d={pathData2}
              fill="none"
              stroke="url(#curve2Gradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 3"
            />
          )}

          {/* Characteristic Points & Leader Arrows */}
          {layoutPoints.map((item, idx) => {
            if (!item) return null;
            const { pt, sx, sy, color, badgeW, badgeH, clampedX, clampedY, startX, startY, targetX, targetY } = item;

            return (
              <g key={`pt-${idx}`} className="transition-all duration-150">
                {/* Point dot on the curve */}
                <circle 
                  cx={sx} 
                  cy={sy} 
                  r="5.5" 
                  fill={color} 
                  stroke="#090d16" 
                  strokeWidth="2" 
                />

                {/* Leader line and arrow from label badge to point */}
                {labelMode === 'arrows' && (
                  <g>
                    <circle cx={startX} cy={startY} r="1.5" fill={color} opacity="0.9" />
                    <line
                      x1={startX}
                      y1={startY}
                      x2={targetX}
                      y2={targetY}
                      stroke={color}
                      strokeWidth="1.1"
                      strokeDasharray="3 2"
                      opacity="0.8"
                      markerEnd="url(#labelPointerArrow)"
                    />
                  </g>
                )}

                {/* Label badge box */}
                {labelMode === 'arrows' && (
                  <g>
                    <rect
                      x={clampedX}
                      y={clampedY}
                      width={badgeW}
                      height={badgeH}
                      rx="5"
                      fill="#070b14"
                      stroke={color}
                      strokeWidth="1.2"
                      opacity="0.95"
                      className="shadow-md"
                    />
                    <text
                      x={clampedX + badgeW / 2}
                      y={clampedY + 14.5}
                      textAnchor="middle"
                      fill={color}
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Interactive Mouse Hover Crosshair */}
          {hoverCoord && hoverCoord.px >= 0 && hoverCoord.px <= width && (
            <g>
              {/* Vertical crosshair line */}
              <line
                x1={hoverCoord.px}
                y1={0}
                x2={hoverCoord.px}
                y2={height}
                stroke="#60a5fa"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.7"
              />
              {/* Point 1 on curve 1 */}
              {hoverCoord.py1 >= 0 && hoverCoord.py1 <= height && (
                <g>
                  <line
                    x1={0}
                    y1={hoverCoord.py1}
                    x2={width}
                    y2={hoverCoord.py1}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                  <circle
                    cx={hoverCoord.px}
                    cy={hoverCoord.py1}
                    r="5.5"
                    fill="#38bdf8"
                    stroke="#090d16"
                    strokeWidth="2.5"
                  />
                </g>
              )}
              {/* Point 2 on curve 2 (if present) */}
              {hoverCoord.py2 !== null && hoverCoord.py2 >= 0 && hoverCoord.py2 <= height && (
                <g>
                  <circle
                    cx={hoverCoord.px}
                    cy={hoverCoord.py2}
                    r="5.5"
                    fill="#fb923c"
                    stroke="#090d16"
                    strokeWidth="2.5"
                  />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverCoord && (
          <div
            className="absolute pointer-events-none px-3.5 py-2 rounded-xl bg-slate-900/95 border border-blue-500/40 shadow-2xl text-xs font-mono text-white backdrop-blur-md transition-all space-y-0.5"
            style={{
              left: `${Math.min(width - 170, Math.max(12, hoverCoord.px + 14))}px`,
              top: `${Math.min(height - 75, Math.max(12, hoverCoord.py1 - 40))}px`,
            }}
          >
            <div className="text-[11px] text-slate-400 font-sans font-semibold flex items-center justify-between gap-3">
              <span>
                Tọa độ x = {hoverCoord.x.toFixed(3)}
                {formatPiNotation(hoverCoord.x, isTrigMode) ? ` (${formatPiNotation(hoverCoord.x, isTrigMode)})` : ''}
              </span>
            </div>
            <div className="text-blue-300 font-bold">
              y₁ = {hoverCoord.y1.toFixed(3)}
            </div>
            {hoverCoord.y2 !== null && (
              <div className="text-amber-300 font-bold">
                y₂ = {hoverCoord.y2.toFixed(3)}
              </div>
            )}
            {hoverCoord.y2 !== null && (
              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-0.5">
                Δy = {Math.abs(hoverCoord.y1 - hoverCoord.y2).toFixed(3)}
              </div>
            )}
          </div>
        )}

        {/* Range badge */}
        <div className="absolute bottom-2 left-3 flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          <span>X: [{xMin.toFixed(1)}, {xMax.toFixed(1)}]</span>
          <span>•</span>
          <span>Y: [{yMin.toFixed(1)}, {yMax.toFixed(1)}]</span>
        </div>
      </div>

      {/* Legend / Info bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-1">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-blue-400 inline-block" />
            <span className="text-slate-300 font-medium">Hàm y₁</span>
          </span>
          {hasSecondCurve && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-amber-400 inline-block border-dashed" />
              <span className="text-amber-300 font-medium">Hàm y₂ (y = dx)</span>
            </span>
          )}
          {hasSecondCurve && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="text-rose-300 font-medium">Giao điểm (y₁ = y₂)</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            <span>Nghiệm f(x)=0</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span>Giao trục Oy</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Cực đại</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Cực tiểu</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Mũi tên mảnh chỉ số tọa độ vào điểm vẽ
        </span>
      </div>
    </div>
  );
};
