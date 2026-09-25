import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  FileDown,
  Printer,
  Check,
  Loader2,
  LineChart,
  Sparkles,
  CheckCircle2,
  Share2,
  Table as TableIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf, PdfExportResult } from '../../utils/pdfExportHelper';
import { KeyPoint } from './geometry/InteractiveGraphPlotter';
import { evaluateExpression } from '../../utils/mathParser';

export interface GraphingPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'quadratic' | 'cubic' | 'trigonometric' | 'custom';
  expression: string;
  expression2?: string;
  showSecondExpr?: boolean;
  paramD?: number;
  hasParameterD?: boolean;
  mathAnalysis: {
    title: string;
    formula: string;
    details: { label: string; value: string; note?: string }[];
  };
  keyPoints: KeyPoint[];
  tableData: {
    x: number;
    y1: number;
    y2: number | null;
    diff: number | null;
  }[];
}

export const GraphingPdfModal: React.FC<GraphingPdfModalProps> = ({
  isOpen,
  onClose,
  mode,
  expression,
  expression2 = '',
  showSecondExpr = false,
  paramD = 1,
  hasParameterD = false,
  mathAnalysis,
  keyPoints,
  tableData,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const [exportResult, setExportResult] = useState<PdfExportResult | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);

  const currentDateFormatted = new Date().toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate suitable Oxy range for SVG vector plot
  const svgPlot = useMemo(() => {
    // Determine bounds
    let xMin = -6;
    let xMax = 6;
    let yMin = -6;
    let yMax = 6;

    if (keyPoints.length > 0) {
      const validXs = keyPoints.map((p) => p.x).filter((x) => Number.isFinite(x) && Math.abs(x) < 50);
      const validYs = keyPoints.map((p) => p.y).filter((y) => Number.isFinite(y) && Math.abs(y) < 50);
      if (validXs.length > 0 && validYs.length > 0) {
        const minX = Math.min(...validXs);
        const maxX = Math.max(...validXs);
        const minY = Math.min(...validYs);
        const maxY = Math.max(...validYs);

        const padX = Math.max(2, (maxX - minX) * 0.4);
        const padY = Math.max(2, (maxY - minY) * 0.4);

        xMin = Math.floor(Math.min(-4, minX - padX));
        xMax = Math.ceil(Math.max(4, maxX + padX));
        yMin = Math.floor(Math.min(-4, minY - padY));
        yMax = Math.ceil(Math.max(4, maxY + padY));
      }
    }

    // Keep aspect ratio balanced
    const spanX = xMax - xMin;
    const spanY = yMax - yMin;
    if (spanX > spanY * 2) {
      const diff = spanX / 2 - spanY;
      yMin -= Math.round(diff / 2);
      yMax += Math.round(diff / 2);
    } else if (spanY > spanX * 2) {
      const diff = spanY / 2 - spanX;
      xMin -= Math.round(diff / 2);
      xMax += Math.round(diff / 2);
    }

    const svgWidth = 714;
    const svgHeight = 350;
    const pad = 30;
    const plotW = svgWidth - 2 * pad;
    const plotH = svgHeight - 2 * pad;

    const toSvgX = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * plotW;
    const toSvgY = (y: number) => pad + ((yMax - y) / (yMax - yMin)) * plotH;

    // Origin (0,0) in SVG coords
    const originX = toSvgX(0);
    const originY = toSvgY(0);

    // Generate grid lines
    const xTicks: number[] = [];
    const stepX = (xMax - xMin) > 16 ? 2 : 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += stepX) {
      if (x !== 0) xTicks.push(x);
    }

    const yTicks: number[] = [];
    const stepY = (yMax - yMin) > 16 ? 2 : 1;
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += stepY) {
      if (y !== 0) yTicks.push(y);
    }

    // Sample path 1: f(x)
    const samples = 300;
    const stepSample = (xMax - xMin) / samples;
    let path1 = '';
    let isDrawing1 = false;

    for (let i = 0; i <= samples; i++) {
      const x = xMin + i * stepSample;
      try {
        const y = evaluateExpression(expression, x);
        if (Number.isFinite(y) && y >= yMin - 10 && y <= yMax + 10) {
          const sx = toSvgX(x);
          const sy = toSvgY(y);
          if (!isDrawing1) {
            path1 += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
            isDrawing1 = true;
          } else {
            path1 += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
          }
        } else {
          isDrawing1 = false;
        }
      } catch {
        isDrawing1 = false;
      }
    }

    // Sample path 2: g(x) if active
    let path2 = '';
    let isDrawing2 = false;
    if (showSecondExpr && expression2) {
      const expr2 = hasParameterD ? expression2.replace(/\bd\b/gi, `(${paramD})`) : expression2;
      for (let i = 0; i <= samples; i++) {
        const x = xMin + i * stepSample;
        try {
          const y = evaluateExpression(expr2, x);
          if (Number.isFinite(y) && y >= yMin - 10 && y <= yMax + 10) {
            const sx = toSvgX(x);
            const sy = toSvgY(y);
            if (!isDrawing2) {
              path2 += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
              isDrawing2 = true;
            } else {
              path2 += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
            }
          } else {
            isDrawing2 = false;
          }
        } catch {
          isDrawing2 = false;
        }
      }
    }

    // Keypoints in SVG
    const keyPointSvgs = keyPoints
      .filter((p) => p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax)
      .map((p) => ({
        ...p,
        sx: toSvgX(p.x),
        sy: toSvgY(p.y),
      }));

    return {
      svgWidth,
      svgHeight,
      originX,
      originY,
      xMin,
      xMax,
      yMin,
      yMax,
      pad,
      xTicks,
      yTicks,
      toSvgX,
      toSvgY,
      path1,
      path2,
      keyPointSvgs,
    };
  }, [expression, expression2, showSecondExpr, hasParameterD, paramD, keyPoints]);

  if (!isOpen) return null;

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị bản vẽ đồ thị & báo cáo...' : 'Preparing mathematical report...');

      const safeName = expression.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
      const fileName = `Do_Thi_Ham_So_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`;

      const result = await exportElementPagesToPdf(printContainerRef.current, {
        fileName,
        pageSelector: '.pdf-report-page',
        onProgress: (text) => setExportProgress(text),
      });

      setExportResult(result);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
      }, 4000);
    } catch (err) {
      console.error('Lỗi khi xuất PDF đồ thị hàm số:', err);
      alert(isVi ? 'Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.' : 'Error generating PDF. Please retry.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isVi ? 'Xuất Hồ Sơ Báo Cáo Đồ Thị Hàm Số (PDF A4)' : 'Export Function Graphing Report (PDF A4)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Bản vẽ hệ trục Oxy độ nét cao kèm phân tích đặc trưng toán học và bảng tọa độ điểm' 
                  : 'High-res Cartesian Oxy plot with math analysis and values table'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Preview Info */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Hàm số chính y₁:</span>
              <span className="font-mono text-sm font-bold text-blue-400">y₁ = {expression}</span>
            </div>
            {showSecondExpr && expression2 && (
              <div className="flex items-center justify-between border-t border-slate-700/60 pt-2">
                <span className="text-xs font-semibold text-slate-400">Đường thứ hai y₂:</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  y₂ = {hasParameterD ? `${expression2} (d=${paramD})` : expression2}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-700/60 pt-2 text-xs text-slate-300">
              <span>Số điểm đặc trưng nhận diện:</span>
              <span className="font-bold text-white">{keyPoints.length} điểm (Đỉnh / Nghiệm / Cực trị)</span>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Bản vẽ vector Oxy đen trắng chuẩn in ấn A4</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảng tọa độ giá trị điểm (x, y) chi tiết</span>
            </div>
          </div>

          {/* Progress / Status */}
          {exportProgress && (
            <div className="p-3 bg-blue-950/60 border border-blue-500/40 rounded-xl flex items-center gap-2.5 text-xs text-blue-300">
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
              ) : isDone ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : null}
              <span>{exportProgress}</span>
            </div>
          )}

          {/* PDF Ready Links */}
          {exportResult && (
            <div className="p-3 bg-slate-800 border border-slate-600 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-white min-w-0">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span className="font-semibold shrink-0">{isVi ? 'File PDF đã sẵn sàng:' : 'PDF ready:'}</span>
                <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-300">{exportResult.fileName}</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={exportResult.blobUrl}
                  download={exportResult.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tải file PDF' : 'Download PDF'}</span>
                </a>
                {typeof navigator !== 'undefined' && !!navigator.share && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const file = new File([exportResult.blob], exportResult.fileName, { type: 'application/pdf' });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                          await navigator.share({ files: [file], title: exportResult.fileName });
                        } else {
                          window.open(exportResult.blobUrl, '_blank');
                        }
                      } catch (err: any) {
                        if (err.name !== 'AbortError') {
                          window.open(exportResult.blobUrl, '_blank');
                        }
                      }
                    }}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Chia sẻ' : 'Share'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span>Tiêu chuẩn tài liệu A4 • Định dạng đơn sắc đen trắng sắc nét</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleNativePrint}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isVi ? 'In / Print' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isVi ? 'Đang tạo PDF...' : 'Generating...'}</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Đã xuất xong!' : 'Completed!'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tải PDF A4' : 'Download PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE CONTAINER (Off-screen, purely rendered in black & white monochrome) */}
      <div
        ref={printContainerRef}
        id="graphing-pdf-printable-source"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          height: 'auto',
          overflow: 'hidden',
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
          color: '#000000',
          zIndex: -9999,
        }}
      >
        <div
          className="pdf-report-page bg-white text-slate-900"
          style={{
            width: '794px',
            minHeight: '1123px',
            height: '1123px',
            padding: '34px 40px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#ffffff',
            color: '#000000',
          }}
        >
          <div>
            {/* 1. Header (Black & White Academic Style) */}
            <div style={{ borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#000000' }}>
                    HỒ SƠ TOÁN HỌC • BÁO CÁO KHẢO SÁT &amp; ĐỒ THỊ HÀM SỐ OXY
                  </div>
                  <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#000000', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                    {mathAnalysis.title || 'KHẢO SÁT VÀ ĐỒ THỊ HÀM SỐ'}
                  </h1>
                  <div style={{ fontSize: '11px', color: '#334155' }}>
                    Phương trình chính: <strong>y₁ = {expression}</strong>
                    {showSecondExpr && expression2 && (
                      <span> • Đường thứ hai: <strong>y₂ = {hasParameterD ? `${expression2} (d=${paramD})` : expression2}</strong></span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569' }}>
                  <div>Ngày lập: <strong style={{ color: '#000000' }}>{currentDateFormatted}</strong></div>
                  <div>Hệ tọa độ: <strong style={{ color: '#000000' }}>Cartesian Oxy</strong></div>
                  <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#f1f5f9', color: '#000000', border: '1px solid #94a3b8', borderRadius: '4px', fontWeight: 700 }}>
                    Chế độ: {mode === 'quadratic' ? 'Hàm Bậc 2 Parabol' : mode === 'cubic' ? 'Hàm Bậc 3' : mode === 'trigonometric' ? 'Lượng Giác' : 'Biểu thức f(x)'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Characteristics & Math Analysis Summary Grid */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: '#000000', borderRadius: '1px', display: 'inline-block' }} />
                <span>1. ĐẶC TRƯNG TOÁN HỌC &amp; THÔNG SỐ KHẢO SÁT</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {mathAnalysis.details.slice(0, 6).map((item, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 8px' }}>
                    <div style={{ fontSize: '8.5px', color: '#475569', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#000000', marginTop: '2px', fontFamily: 'monospace' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. High-Definition Vector SVG Graph */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#000000', borderRadius: '1px', display: 'inline-block' }} />
                  <span>2. BẢN VẼ HỆ TRỤC TỌA ĐỘ OXY (VECTOR MONOCHROME PLOT)</span>
                </div>
                <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>
                  <span>— y₁: Nét liền</span>
                  {showSecondExpr && expression2 && <span style={{ marginLeft: '10px' }}>--- y₂: Nét đứt</span>}
                </div>
              </div>

              <div style={{ border: '1.5px solid #000000', borderRadius: '8px', background: '#ffffff', overflow: 'hidden' }}>
                <svg
                  width={svgPlot.svgWidth}
                  height={svgPlot.svgHeight}
                  viewBox={`0 0 ${svgPlot.svgWidth} ${svgPlot.svgHeight}`}
                  style={{ display: 'block', margin: '0 auto', background: '#ffffff' }}
                >
                  <defs>
                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                    </pattern>
                  </defs>

                  {/* Grid background */}
                  <rect width={svgPlot.svgWidth} height={svgPlot.svgHeight} fill="url(#grid-pattern)" />

                  {/* Ox Grid Lines & Ticks */}
                  {svgPlot.xTicks.map((x) => {
                    const sx = svgPlot.toSvgX(x);
                    return (
                      <g key={`xtick-${x}`}>
                        <line x1={sx} y1={svgPlot.pad} x2={sx} y2={svgPlot.svgHeight - svgPlot.pad} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1={sx} y1={svgPlot.originY - 3} x2={sx} y2={svgPlot.originY + 3} stroke="#000000" strokeWidth="1" />
                        <text x={sx} y={svgPlot.originY + 12} fontSize="8" fill="#475569" textAnchor="middle" fontFamily="monospace">
                          {x}
                        </text>
                      </g>
                    );
                  })}

                  {/* Oy Grid Lines & Ticks */}
                  {svgPlot.yTicks.map((y) => {
                    const sy = svgPlot.toSvgY(y);
                    return (
                      <g key={`ytick-${y}`}>
                        <line x1={svgPlot.pad} y1={sy} x2={svgPlot.svgWidth - svgPlot.pad} y2={sy} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1={svgPlot.originX - 3} y1={sy} x2={svgPlot.originX + 3} stroke="#000000" strokeWidth="1" />
                        <text x={svgPlot.originX - 6} y={sy + 3} fontSize="8" fill="#475569" textAnchor="end" fontFamily="monospace">
                          {y}
                        </text>
                      </g>
                    );
                  })}

                  {/* Primary Axes: Ox & Oy in bold black */}
                  {/* Ox axis */}
                  <line
                    x1={svgPlot.pad}
                    y1={svgPlot.originY}
                    x2={svgPlot.svgWidth - svgPlot.pad + 12}
                    y2={svgPlot.originY}
                    stroke="#000000"
                    strokeWidth="1.75"
                  />
                  {/* Ox arrow */}
                  <polygon
                    points={`${svgPlot.svgWidth - svgPlot.pad + 16},${svgPlot.originY} ${svgPlot.svgWidth - svgPlot.pad + 8},${svgPlot.originY - 3.5} ${svgPlot.svgWidth - svgPlot.pad + 8},${svgPlot.originY + 3.5}`}
                    fill="#000000"
                  />
                  <text
                    x={svgPlot.svgWidth - svgPlot.pad + 18}
                    y={svgPlot.originY + 3.5}
                    fontSize="11"
                    fontWeight="bold"
                    fill="#000000"
                    fontFamily="serif"
                  >
                    x
                  </text>

                  {/* Oy axis */}
                  <line
                    x1={svgPlot.originX}
                    y1={svgPlot.svgHeight - svgPlot.pad}
                    x2={svgPlot.originX}
                    y2={svgPlot.pad - 12}
                    stroke="#000000"
                    strokeWidth="1.75"
                  />
                  {/* Oy arrow */}
                  <polygon
                    points={`${svgPlot.originX},${svgPlot.pad - 16} ${svgPlot.originX - 3.5},${svgPlot.pad - 8} ${svgPlot.originX + 3.5},${svgPlot.pad - 8}`}
                    fill="#000000"
                  />
                  <text
                    x={svgPlot.originX + 6}
                    y={svgPlot.pad - 14}
                    fontSize="11"
                    fontWeight="bold"
                    fill="#000000"
                    fontFamily="serif"
                  >
                    y
                  </text>

                  {/* Origin O */}
                  <text
                    x={svgPlot.originX - 8}
                    y={svgPlot.originY + 12}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#000000"
                    fontFamily="serif"
                  >
                    O
                  </text>

                  {/* Function Curve 1: Solid Black Line */}
                  {svgPlot.path1 && (
                    <path
                      d={svgPlot.path1}
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Function Curve 2: Dashed Black Line */}
                  {svgPlot.path2 && (
                    <path
                      d={svgPlot.path2}
                      fill="none"
                      stroke="#000000"
                      strokeWidth="1.8"
                      strokeDasharray="5 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Key Points markers & labels */}
                  {svgPlot.keyPointSvgs.map((pt, idx) => (
                    <g key={`pt-${idx}`}>
                      <circle cx={pt.sx} cy={pt.sy} r="4" fill="#000000" stroke="#ffffff" strokeWidth="1.5" />
                      <rect
                        x={pt.sx + 6}
                        y={pt.sy - 14}
                        width={Math.min(130, pt.label.length * 6 + 10)}
                        height="14"
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth="0.75"
                        rx="3"
                      />
                      <text
                        x={pt.sx + 10}
                        y={pt.sy - 4}
                        fontSize="8"
                        fontWeight="bold"
                        fill="#000000"
                        fontFamily="monospace"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 4. Table of Characteristic Values */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: '#000000', borderRadius: '1px', display: 'inline-block' }} />
                <span>3. BẢNG TỌA ĐỘ ĐIỂM TIÊU BIỂU (x, y)</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', fontFamily: 'monospace' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderTop: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                    <th style={{ padding: '4px 6px', textAlign: 'center', color: '#000000', fontWeight: 700 }}>x</th>
                    <th style={{ padding: '4px 6px', textAlign: 'center', color: '#000000', fontWeight: 700 }}>y₁ = f(x)</th>
                    {showSecondExpr && expression2 && (
                      <>
                        <th style={{ padding: '4px 6px', textAlign: 'center', color: '#000000', fontWeight: 700 }}>y₂ = g(x)</th>
                        <th style={{ padding: '4px 6px', textAlign: 'center', color: '#000000', fontWeight: 700 }}>|y₁ - y₂|</th>
                      </>
                    )}
                    <th style={{ padding: '4px 6px', textAlign: 'center', color: '#000000', fontWeight: 700 }}>Ý Nghĩa Hình Học / Đại Số</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 11).map((row, idx) => {
                    const isRoot = Math.abs(row.y1) < 1e-4;
                    const isYIntercept = Math.abs(row.x) < 1e-4;
                    const isIntersection = row.diff !== null && row.diff < 1e-3;

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: isIntersection || isRoot || isYIntercept ? '#f8fafc' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                          fontWeight: isIntersection || isRoot || isYIntercept ? 700 : 400,
                        }}
                      >
                        <td style={{ padding: '3.5px 6px', textAlign: 'center', color: '#000000' }}>{row.x}</td>
                        <td style={{ padding: '3.5px 6px', textAlign: 'center', color: '#000000' }}>
                          {isNaN(row.y1) ? 'Không xác định' : row.y1}
                        </td>
                        {showSecondExpr && expression2 && (
                          <>
                            <td style={{ padding: '3.5px 6px', textAlign: 'center', color: '#000000' }}>
                              {row.y2 === null || isNaN(row.y2) ? '-' : row.y2}
                            </td>
                            <td style={{ padding: '3.5px 6px', textAlign: 'center', color: '#000000' }}>
                              {row.diff === null || isNaN(row.diff) ? '-' : row.diff}
                            </td>
                          </>
                        )}
                        <td style={{ padding: '3.5px 6px', textAlign: 'center', color: '#334155' }}>
                          {isIntersection
                            ? '● Tọa độ giao điểm y₁ ≈ y₂'
                            : isRoot
                            ? '● Nghiệm hàm số (Giao Ox)'
                            : isYIntercept
                            ? '● Giao điểm trục tung Oy'
                            : 'Điểm tọa độ trên đồ thị'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Footer disclaimer & legal */}
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8.5px', color: '#64748b' }}>
            <div>Graphing Calculator Engine • Hệ trục tọa độ chuẩn giáo dục &amp; kỹ thuật</div>
            <div>Trang 1 / 1 • Tài liệu xuất tự động</div>
          </div>
        </div>
      </div>
    </div>
  );
};
