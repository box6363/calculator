import React, { useState, useRef } from 'react';
import { X, FileDown, Printer, Check, Loader2, Calendar, Wallet, ShieldAlert, Globe, ArrowRight, CheckCircle2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useLanguage } from '../../context/LanguageContext';
import { PdfExportResult } from '../../utils/pdfExportHelper';
import {
  CountrySalaryProfile,
  PayPeriod,
  PERIOD_LABELS
} from '../../data/salaryInternationalData';
import { 
  formatCurrency,
  fromAnnualAmount,
  DetailedCalculationResult 
} from '../../utils/salaryEngine';

export interface SalaryPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CountrySalaryProfile;
  payPeriod: PayPeriod;
  salaryInput: number;
  dependents: number;
  subRegionName?: string;
  mode: 'gross_to_net' | 'net_to_gross';
  calculationResult: DetailedCalculationResult;
}

export const SalaryPdfModal: React.FC<SalaryPdfModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  payPeriod,
  salaryInput,
  dependents,
  subRegionName,
  mode,
  calculationResult
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);
  const [exportResult, setExportResult] = useState<PdfExportResult | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentPeriodData = calculationResult?.periods?.[payPeriod] || {
    gross: salaryInput || 0,
    net: calculationResult?.monthlyNet || 0,
    employeeInsurance: 0,
    tax: 0,
    totalEmployerCost: salaryInput || 0,
    period: payPeriod,
    taxableIncome: 0,
    employerContribution: 0,
  };
  const grossCurrent = currentPeriodData.gross || 0;
  const netCurrent = currentPeriodData.net || 0;
  const insCurrent = currentPeriodData.employeeInsurance || 0;
  const taxCurrent = currentPeriodData.tax || 0;

  const periodLabel = isVi 
    ? (PERIOD_LABELS[payPeriod]?.vi || payPeriod) 
    : (PERIOD_LABELS[payPeriod]?.en || payPeriod);

  const handleExportPDF = async () => {
    if (isExporting) return;
    const source = printContainerRef.current || document.getElementById('salary-pdf-printable-source');
    if (!source) {
      window.print();
      return;
    }

    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing payslip...');

      const dateStr = new Date().toISOString().slice(0, 10);
      const safeCountry = (activeProfile.id || 'VN').toUpperCase().replace(/[^a-z0-9_-]/gi, '_');
      const fileName = isVi
        ? `Phieu_Luong_${safeCountry}_Net_${Math.round(netCurrent)}_${dateStr}.pdf`
        : `Salary_Slip_${safeCountry}_Net_${Math.round(netCurrent)}_${dateStr}.pdf`;

      await new Promise((r) => setTimeout(r, 120));

      setExportProgress(isVi ? 'Đang kết xuất phiếu lương chuẩn A4...' : 'Rendering A4 payslip...');

      const canvas = await html2canvas(source, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('salary-pdf-printable-source');
          if (el) {
            el.style.position = 'static';
            el.style.left = '0px';
            el.style.top = '0px';
            el.style.width = '794px';
            el.style.visibility = 'visible';
            el.style.display = 'block';
            el.style.opacity = '1';
            el.style.zIndex = '1';
            el.style.filter = 'grayscale(100%)';
            el.style.backgroundColor = '#ffffff';
            el.style.color = '#000000';
          }
        },
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas render returned empty dimensions');
      }

      setExportProgress(isVi ? 'Đang tạo tệp PDF...' : 'Generating PDF file...');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Trang 1
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);

      // Các trang tiếp theo nếu nội dung dài hơn 1 trang
      let heightLeft = imgHeight - pdfHeight;
      let yOffset = -pdfHeight;
      while (heightLeft > 1) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfWidth, imgHeight);
        yOffset -= pdfHeight;
        heightLeft -= pdfHeight;
      }

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Kích hoạt download trực tiếp
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 3000);

      setExportResult({
        blob: pdfBlob,
        blobUrl,
        fileName,
      });

      setIsDone(true);
      setExportProgress(isVi ? 'Xuất PDF thành công! Đang tải file...' : 'PDF exported successfully! Downloading...');
      setTimeout(() => {
        setIsDone(false);
        setExportProgress('');
      }, 4500);
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
      alert(isVi ? 'Có lỗi khi tạo PDF. Bạn có thể bấm "In / Lưu PDF" để in trực tiếp.' : 'Error generating PDF. Try "Print / Save" directly.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="salary-modal-root">
      {/* Modal Dialog for screen view */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-600/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? 'Xuất Phiếu Lương (Gross ↔ Net)' : 'Export Payslip (Gross ↔ Net)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVi 
                  ? `Hồ sơ ${activeProfile.flag} ${activeProfile.name} • Chu kỳ ${periodLabel}` 
                  : `${activeProfile.flag} ${activeProfile.name} profile • ${periodLabel}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{isVi ? 'Thông tin phiếu lương' : 'Payslip overview'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {mode === 'gross_to_net' ? 'Gross → Net' : 'Net → Gross'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">{isVi ? 'Lương Gross' : 'Gross Salary'}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">{isVi ? 'Khấu trừ Bảo hiểm' : 'Social Deductions'}</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  -{formatCurrency(insCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">{isVi ? 'Thuế thu nhập' : 'Income Tax'}</span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  -{formatCurrency(taxCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">{isVi ? 'Số người phụ thuộc' : 'Dependents'}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {dependents} {isVi ? 'người' : 'persons'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/60 dark:via-slate-900 dark:to-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-center space-y-1">
              <span className="text-xs text-emerald-800 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                {isVi ? 'Thực nhận (Net Take-home Pay)' : 'Net Take-home Pay'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {formatCurrency(netCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal"> /{periodLabel.toLowerCase()}</span>
              </div>
            </div>

            {subRegionName && (
              <div className="text-xs text-slate-600 dark:text-slate-400 px-1">
                {isVi ? 'Khu vực / Tùy chọn:' : 'Region / Mode:'} <strong className="text-slate-900 dark:text-slate-200">{subRegionName}</strong>
              </div>
            )}
          </div>

          {exportProgress && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isDone ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : null}
              <span>{exportProgress}</span>
            </div>
          )}

          {/* Khi file PDF đã sẵn sàng, hiển thị nút tải trực tiếp và share (đặc biệt hữu ích trên iPhone/Android) */}
          {exportResult && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold shrink-0">{isVi ? 'File PDF đã sẵn sàng:' : 'PDF ready:'}</span>
                <span className="font-mono text-[11px] truncate max-w-[170px] text-slate-700 dark:text-slate-300">{exportResult.fileName}</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <a
                  href={exportResult.blobUrl}
                  download={exportResult.fileName}
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
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Lưu vào Tệp' : 'Save to Files'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{isVi ? 'Phiếu lương chuẩn A4 rõ nét, in trực tiếp' : 'Official standard A4 payslip format'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isVi ? 'In / Lưu PDF' : 'Print / Save'}</span>
            </button>

            <button
              type="button"
              id="confirm-download-salary-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isVi ? 'Đang tạo PDF...' : 'Generating...'}</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isVi ? 'Đã tải xong!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tải phiếu lương PDF' : 'Download Payslip PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* PRINTABLE CONTAINER (Off-screen, NOT display: none for sharp html2canvas rendering) */}
      <div
        ref={printContainerRef}
        id="salary-pdf-printable-source"
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
            <div style={{ borderBottom: '2px solid #000000', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#000000' }}>
                    PHIẾU LƯƠNG CHUẨN QUỐC TẾ • OFFICIAL PAYROLL SLIP
                  </div>
                  <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#000000', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                    PHIẾU TÍNH LƯƠNG &amp; NGHĨA VỤ THUẾ, BẢO HIỂM
                  </h1>
                  <div style={{ fontSize: '11px', color: '#334155' }}>
                    Quốc gia: <strong>{activeProfile.flag} {activeProfile.name}</strong> • Chu kỳ tính: <strong>{periodLabel}</strong> {subRegionName ? `• ${subRegionName}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569' }}>
                  <div>Ngày xuất: <strong style={{ color: '#000000' }}>{currentDateFormatted}</strong></div>
                  <div>Tiền tệ: <strong style={{ color: '#000000' }}>{activeProfile.currencyCode} ({activeProfile.currencySymbol})</strong></div>
                  <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#f1f5f9', color: '#000000', border: '1px solid #94a3b8', borderRadius: '4px', fontWeight: 700 }}>
                    Chế độ: {mode === 'gross_to_net' ? 'Gross sang Net' : 'Net sang Gross'}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Core Summary Cards */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 10px' }}>
                  <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>LƯƠNG GROSS ({periodLabel})</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                    {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 10px' }}>
                  <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>BẢO HIỂM NLĐ ĐÓNG</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                    -{formatCurrency(insCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 10px' }}>
                  <div style={{ fontSize: '9px', color: '#475569', fontWeight: 600 }}>THUẾ THU NHẬP</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                    -{formatCurrency(taxCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', border: '2px solid #000000', borderRadius: '8px', padding: '9px 10px' }}>
                  <div style={{ fontSize: '9px', color: '#000000', fontWeight: 700 }}>LƯƠNG THỰC NHẬN (NET)</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#000000', marginTop: '2px' }}>
                    {formatCurrency(netCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Detailed Breakdown Table */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', background: '#000000', borderRadius: '2px', display: 'inline-block' }} />
                <span>1. BẢNG CHI TIẾT CÁC KHOẢN KHẤU TRỪ VÀ THỰC NHẬN ({periodLabel})</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <tbody>
                  <tr style={{ background: '#f8fafc', borderTop: '1px solid #000000', borderBottom: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 800, color: '#000000' }}>1. Lương Gross (Thu nhập danh nghĩa)</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 800, color: '#000000' }}>
                      {formatCurrency(grossCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                    </td>
                  </tr>

                  {/* Insurance breakdown */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#000000', paddingLeft: '16px' }}>
                      2. Bảo hiểm bắt buộc &amp; An sinh Xã hội NLĐ đóng
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>
                      -{formatCurrency(insCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                    </td>
                  </tr>
                  {(calculationResult.employeeInsuranceItems || []).map((item, idx) => {
                    const itemPeriodAmount = fromAnnualAmount(item.annualAmount, payPeriod);
                    return (
                      <tr key={`ins-${idx}`} style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa', fontSize: '9.5px' }}>
                        <td style={{ padding: '4px 8px 4px 28px', color: '#475569' }}>
                          • {item.name} ({item.rate}%)
                        </td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', color: '#475569' }}>
                          -{formatCurrency(itemPeriodAmount, activeProfile.currencySymbol, activeProfile.decimals)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Income Tax */}
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#000000', paddingLeft: '16px' }}>
                      3. Thuế thu nhập cá nhân (TNCN / Income Tax)
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>
                      -{formatCurrency(taxCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                    </td>
                  </tr>

                  {/* Net Take-home */}
                  <tr style={{ background: '#f1f5f9', borderTop: '2px solid #000000', borderBottom: '2px solid #000000' }}>
                    <td style={{ padding: '8px 8px', fontWeight: 900, color: '#000000', fontSize: '11px' }}>
                      4. LƯƠNG THỰC NHẬN (NET TAKE-HOME)
                    </td>
                    <td style={{ padding: '8px 8px', textAlign: 'right', fontWeight: 900, color: '#000000', fontSize: '13px' }}>
                      {formatCurrency(netCurrent, activeProfile.currencySymbol, activeProfile.decimals)}
                    </td>
                  </tr>

                  {/* Employer cost */}
                  <tr style={{ borderBottom: '1px solid #cbd5e1', background: '#ffffff' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 600, color: '#334155' }}>
                      5. Chi phí Doanh nghiệp / Người sử dụng lao động chi trả
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>
                      {formatCurrency(currentPeriodData.totalEmployerCost, activeProfile.currencySymbol, activeProfile.decimals)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Conversion Table Across Periods */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', background: '#000000', borderRadius: '2px', display: 'inline-block' }} />
                <span>2. BẢNG QUY ĐỔI MỨC LƯƠNG TƯƠNG ĐƯƠNG CÁC CHU KỲ</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderTop: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                    <th style={{ padding: '5px 8px', textAlign: 'left', fontWeight: 700, color: '#000000' }}>CHU KỲ</th>
                    <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>LƯƠNG GROSS</th>
                    <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>BẢO HIỂM NLĐ</th>
                    <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>THUẾ TNCN</th>
                    <th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#000000' }}>THỰC NHẬN (NET)</th>
                  </tr>
                </thead>
                <tbody>
                  {(['annual', 'monthly', 'biweekly', 'weekly', 'hourly'] as PayPeriod[]).map((p, idx) => {
                    const rowData = calculationResult?.periods?.[p];
                    if (!rowData) return null;
                    const isSelected = p === payPeriod;
                    const labelObj = PERIOD_LABELS[p];
                    const labelText = isVi ? labelObj?.vi : labelObj?.en;
                    return (
                      <tr
                        key={p}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: isSelected ? '#f1f5f9' : idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          fontWeight: isSelected ? 800 : 500,
                        }}
                      >
                        <td style={{ padding: '5px 8px', color: '#000000' }}>
                          {labelText || p} {isSelected ? '★' : ''}
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#000000' }}>
                          {formatCurrency(rowData.gross, activeProfile.currencySymbol, activeProfile.decimals)}
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#000000' }}>
                          -{formatCurrency(rowData.employeeInsurance, activeProfile.currencySymbol, activeProfile.decimals)}
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#000000' }}>
                          -{formatCurrency(rowData.tax, activeProfile.currencySymbol, activeProfile.decimals)}
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#000000', fontWeight: isSelected ? 900 : 700 }}>
                          {formatCurrency(rowData.net, activeProfile.currencySymbol, activeProfile.decimals)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Note block */}
            <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '9.5px', color: '#334155' }}>
              ℹ️ <strong>Lưu ý pháp lý:</strong> Bảng tính tuân thủ biểu thuế lũy tiến từng phần và quy định tỷ lệ đóng bảo hiểm xã hội, y tế hiện hành của quốc gia được chọn. Kết quả mang tính tham khảo dự toán thu nhập.
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#64748b' }}>
            <div>Web Calculator • Hệ thống Tính tiền lương quốc tế Gross - Net</div>
            <div>Trang 1 / 1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
