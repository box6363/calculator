import React, { useState, useRef } from 'react';
import { X, FileDown, Printer, Check, Loader2, TrendingUp, DollarSign, Calendar, Sparkles, CheckCircle2, Share2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf, PdfExportResult } from '../../utils/pdfExportHelper';

export interface InterestPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  principal: number;
  rate: number;
  years: number;
  compoundFreq: number;
  calculations: {
    simpleInterest: number;
    simpleTotal: number;
    compoundTotal: number;
    compoundInterest: number;
    difference: number;
    yearlyBreakdown: {
      year: number;
      simple: number;
      compound: number;
      gain: number;
    }[];
  };
}

export const InterestPdfModal: React.FC<InterestPdfModalProps> = ({
  isOpen,
  onClose,
  principal,
  rate,
  years,
  compoundFreq,
  calculations
}) => {
  const { currencyInfo, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const [exportResult, setExportResult] = useState<PdfExportResult | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const freqLabel = compoundFreq === 1 
    ? (isVi ? 'Hàng năm (1 lần/năm)' : 'Annually')
    : compoundFreq === 4 
      ? (isVi ? 'Hàng quý (4 lần/năm)' : 'Quarterly')
      : compoundFreq === 12 
        ? (isVi ? 'Hàng tháng (12 lần/năm)' : 'Monthly')
        : (isVi ? 'Hàng ngày (365 lần/năm)' : 'Daily');

  const currentDateFormatted = new Date().toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing pages...');

      const fileName = `So_Sanh_Lai_Suat_${principal}_${years}nam_${new Date().toISOString().slice(0, 10)}.pdf`;

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
      console.error('Lỗi khi xuất PDF lãi suất:', err);
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
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isVi ? 'Xuất Kế Hoạch & So Sánh Lãi Suất (PDF)' : 'Export Interest Comparison (PDF)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi ? 'Định dạng chuẩn A4 in ấn, so sánh lãi đơn vs lãi kép' : 'Standard A4 ready for print & download'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm scrollbar-thin">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-700/60">
              <span>{isVi ? 'Tổng quan hồ sơ so sánh' : 'Summary'}</span>
              <span className="text-emerald-400 font-semibold">{currentDateFormatted}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Vốn ban đầu' : 'Principal'}</span>
                <span className="font-bold text-white font-mono mt-0.5 block">{formatMoney(principal)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Lãi suất / năm' : 'Annual Rate'}</span>
                <span className="font-bold text-emerald-400 font-mono mt-0.5 block">{rate}% / năm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Kỳ hạn gửi' : 'Duration'}</span>
                <span className="font-bold text-white font-mono mt-0.5 block">{years} {isVi ? 'năm' : 'years'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Ghép lãi' : 'Compounding'}</span>
                <span className="font-bold text-blue-400 mt-0.5 block truncate">{freqLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Lãi Đơn Thu Về</span>
                <span className="text-lg font-black text-slate-200 font-mono mt-0.5 block">
                  {formatMoney(calculations.simpleTotal)}
                </span>
                <span className="text-xs text-slate-400">
                  Tiền lãi: +{formatMoney(calculations.simpleInterest)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Lãi Kép Thu Về</span>
                <span className="text-lg font-black text-emerald-300 font-mono mt-0.5 block">
                  {formatMoney(calculations.compoundTotal)}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Tiền lãi: +{formatMoney(calculations.compoundInterest)} (Lãi kép hơn +{formatMoney(calculations.difference)})
                </span>
              </div>
            </div>

            {/* Khi file PDF đã sẵn sàng, hiển thị nút tải trực tiếp và share (đặc biệt hữu ích trên iPhone/Android) */}
            {exportResult && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                <div className="flex items-center gap-2 text-emerald-300 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold shrink-0">{isVi ? 'File PDF đã sẵn sàng:' : 'PDF ready:'}</span>
                  <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-300">{exportResult.fileName}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href={exportResult.blobUrl}
                    download={exportResult.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-center shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Mở / Tải file' : 'Open / Save'}</span>
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
                      <span>{isVi ? 'Lưu vào Tệp' : 'Save to Files'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            type="button"
            onClick={handleNativePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isVi ? 'In ấn ngay' : 'Print'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isVi ? 'Đóng' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{exportProgress || (isVi ? 'Đang tạo PDF...' : 'Generating...')}</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isVi ? 'Đã tải xong!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tải file PDF ngay' : 'Download PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PRINTABLE CONTAINER (Off-screen, NOT display: none for sharp html2canvas rendering) */}
      <div
        ref={printContainerRef}
        id="interest-pdf-printable-source"
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
          color: '#0f172a',
          zIndex: -9999,
        }}
      >
        <div
          className="pdf-report-page bg-white text-slate-900"
          style={{
            width: '794px',
            minHeight: '1123px',
            height: '1123px',
            padding: '36px 40px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div>
            {/* Header */}
            <div style={{ borderBottom: '2px solid #059669', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#059669' }}>
                    BÁO CÁO TÀI CHÍNH • SAVINGS &amp; INTEREST ANALYSIS
                  </div>
                  <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                    BÁO CÁO SO SÁNH LÃI SUẤT ĐƠN &amp; LÃI KÉP
                  </h1>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    Phân tích hiệu quả sinh lời và chênh lệch tăng trưởng theo thời gian tích lũy
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                  <div>Ngày lập: <strong style={{ color: '#0f172a' }}>{currentDateFormatted}</strong></div>
                  <div>Tiền tệ: <strong style={{ color: '#0f172a' }}>{currencyInfo.code} ({currencyInfo.symbol})</strong></div>
                  <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#ecfdf5', color: '#047857', borderRadius: '4px', fontWeight: 700 }}>
                    Kỳ ghép lãi: {freqLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông số cơ sở */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '8px' }}>
                Thông Số Đầu Vào Cơ Sở
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Vốn gốc ban đầu:</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(principal)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Lãi suất hàng năm:</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#059669' }}>{rate}% / năm</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Thời gian đầu tư:</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{years} năm ({years * 12} tháng)</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Tần suất ghép lãi:</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#2563eb' }}>{freqLabel}</div>
                </div>
              </div>
            </div>

            {/* Bảng so sánh kết quả chính */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>KẾT QUẢ LÃI ĐƠN</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#334155', margin: '4px 0' }}>{formatMoney(calculations.simpleTotal)}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>Tiền lãi: +{formatMoney(calculations.simpleInterest)}</div>
              </div>

              <div style={{ border: '2px solid #059669', background: '#f0fdf4', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>KẾT QUẢ LÃI KÉP</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#047857', margin: '4px 0' }}>{formatMoney(calculations.compoundTotal)}</div>
                <div style={{ fontSize: '10px', color: '#065f46', fontWeight: 700 }}>Tiền lãi: +{formatMoney(calculations.compoundInterest)}</div>
              </div>

              <div style={{ border: '1px solid #93c5fd', background: '#eff6ff', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>LÃI KÉP VƯỢT TRỘI HƠN</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>+{formatMoney(calculations.difference)}</div>
                <div style={{ fontSize: '10px', color: '#1e40af' }}>
                  Hiệu quả: +{((calculations.difference / Math.max(1, calculations.simpleInterest)) * 100).toFixed(1)}% so với lãi đơn
                </div>
              </div>
            </div>

            {/* Bảng tiến trình từng năm */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#334155', marginBottom: '6px' }}>
                Tiến Trình Tăng Trưởng Giá Trị Tài Sản Từng Năm
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', color: '#475569' }}>Năm</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right', color: '#475569' }}>Tổng tiền (Lãi đơn)</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right', color: '#047857' }}>Tổng tiền (Lãi kép)</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right', color: '#1d4ed8' }}>Chênh lệch do lãi kép mang lại</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.yearlyBreakdown.map((row, idx) => (
                    <tr key={row.year} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '5px 8px', fontWeight: 700, color: '#0f172a' }}>Năm {row.year}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', color: '#475569' }}>{formatMoney(row.simple)}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>{formatMoney(row.compound)}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#1d4ed8' }}>+{formatMoney(row.gain)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '9px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tài liệu phân tích tự động từ Web Calculator (AC Studio)</span>
            <span>Trang 1 / 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
