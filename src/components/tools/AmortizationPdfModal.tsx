import React, { useState, useRef } from 'react';
import { X, FileDown, Printer, Check, Loader2, Calendar, FileSpreadsheet, ShieldAlert, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf } from '../../utils/pdfExportHelper';

export interface MonthlyScheduleItem {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface YearlyScheduleItem {
  year: number;
  principal: number;
  interest: number;
  balance: number;
  extra: number;
}

export interface AmortizationPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  extraMonthlyPayment: number;
  calculations: {
    baseMonthlyPayment: number;
    actualMonthlyPayment: number;
    totalInterestPaid: number;
    totalPaid: number;
    actualMonthsTaken: number;
    interestSaved: number;
    monthsSaved: number;
    monthlySchedule: MonthlyScheduleItem[];
    yearlySchedule: YearlyScheduleItem[];
  };
}

export const AmortizationPdfModal: React.FC<AmortizationPdfModalProps> = ({
  isOpen,
  onClose,
  loanAmount,
  interestRate,
  loanTermYears,
  extraMonthlyPayment,
  calculations
}) => {
  const { currencyInfo, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Export options: 'comprehensive' (both yearly + monthly), 'yearly' (summary only), 'monthly' (monthly only)
  const [exportScope, setExportScope] = useState<'comprehensive' | 'yearly' | 'monthly'>('comprehensive');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Split monthly schedule into pages (approx 32 rows per page for perfect A4 fit)
  const ROWS_PER_MONTHLY_PAGE = 32;
  const monthlyPages: MonthlyScheduleItem[][] = [];
  if (exportScope === 'comprehensive' || exportScope === 'monthly') {
    for (let i = 0; i < calculations.monthlySchedule.length; i += ROWS_PER_MONTHLY_PAGE) {
      monthlyPages.push(calculations.monthlySchedule.slice(i, i + ROWS_PER_MONTHLY_PAGE));
    }
  }

  // Calculate total pages for display and PDF metadata
  const totalPagesCount = (exportScope === 'monthly' ? 0 : 1) + monthlyPages.length;

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing document pages...');

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const safeAmount = Math.round(loanAmount).toString();
      const fileName = isVi
        ? `Lich_Trinh_Tra_No_${safeAmount}_${currencyInfo.code}_${dateStr}.pdf`
        : `Amortization_Schedule_${safeAmount}_${currencyInfo.code}_${dateStr}.pdf`;

      await exportElementPagesToPdf(printContainerRef.current, {
        fileName,
        pageSelector: '.pdf-report-page',
        onProgress: (text) => setExportProgress(text),
      });

      setIsDone(true);
      setExportProgress(isVi ? 'Xuất PDF thành công!' : 'PDF export complete!');
      setTimeout(() => {
        setIsDone(false);
        setExportProgress('');
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi xuất file PDF:', error);
      alert(isVi ? 'Có lỗi xảy ra khi tạo PDF. Bạn có thể thử chức năng "In trực tiếp".' : 'Error generating PDF. You can try "Print directly".');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isVi ? 'Xuất File PDF Lịch Trình Trả Nợ' : 'Export Amortization Schedule to PDF'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Bao gồm đầy đủ thông số khoản vay, bảng tổng hợp theo năm và lịch phân bổ theo tháng' 
                  : 'Includes complete loan parameters, yearly summary, and monthly breakdown'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Quick Loan Overview Card */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isVi ? 'Tóm tắt thông số sẽ xuất trong báo cáo' : 'Summary of exported loan parameters'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Số tiền vay' : 'Loan Amount'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatMoney(loanAmount)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Lãi suất' : 'Interest Rate'}</span>
                <span className="text-sm font-bold text-cyan-400 tabular-nums">{interestRate}% / {isVi ? 'năm' : 'yr'}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Thời hạn vay' : 'Loan Term'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{loanTermYears} {isVi ? 'năm' : 'years'}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Trả mỗi tháng' : 'Monthly Payment'}</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">{formatMoney(calculations.actualMonthlyPayment)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-900/50">
                <span className="text-slate-400">{isVi ? 'Tổng tiền lãi:' : 'Total Interest:'}</span>
                <span className="font-bold text-rose-400 tabular-nums">{formatMoney(calculations.totalInterestPaid)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/50">
                <span className="text-slate-400">{isVi ? 'Tổng gốc & lãi:' : 'Total Repayment:'}</span>
                <span className="font-bold text-white tabular-nums">{formatMoney(calculations.totalPaid)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/50 col-span-2 sm:col-span-1">
                <span className="text-slate-400">{isVi ? 'Kỳ trả nợ:' : 'Total Months:'}</span>
                <span className="font-bold text-cyan-400 tabular-nums">{calculations.actualMonthsTaken} {isVi ? 'tháng' : 'months'}</span>
              </div>
            </div>

            {extraMonthlyPayment > 0 && calculations.interestSaved > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {isVi 
                    ? `Trả thêm ${formatMoney(extraMonthlyPayment)}/tháng giúp tiết kiệm ${formatMoney(calculations.interestSaved)} tiền lãi và tất toán sớm ${calculations.monthsSaved} tháng.`
                    : `Paying an extra ${formatMoney(extraMonthlyPayment)}/mo saves ${formatMoney(calculations.interestSaved)} in interest and pays off ${calculations.monthsSaved} months earlier.`}
                </span>
              </div>
            )}
          </div>

          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {isVi ? 'Chọn phạm vi nội dung xuất file PDF:' : 'Select PDF Export Scope:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Comprehensive (Default - Exactly what user asked) */}
              <button
                type="button"
                onClick={() => setExportScope('comprehensive')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportScope === 'comprehensive'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-xs'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Toàn diện (Khuyên dùng)' : 'Comprehensive'}</span>
                  </span>
                  {exportScope === 'comprehensive' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {isVi 
                    ? 'Thông số + Lịch trình năm + Toàn bộ các tháng' 
                    : 'Loan params + Yearly schedule + All months'}
                </p>
                <span className="text-[10px] text-cyan-400/80 mt-2 font-mono">
                  ~{1 + Math.ceil(calculations.monthlySchedule.length / ROWS_PER_MONTHLY_PAGE)} {isVi ? 'trang A4' : 'A4 pages'}
                </span>
              </button>

              {/* Option 2: Yearly summary */}
              <button
                type="button"
                onClick={() => setExportScope('yearly')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportScope === 'yearly'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-xs'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Tóm tắt theo năm' : 'Yearly Summary'}</span>
                  </span>
                  {exportScope === 'yearly' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {isVi 
                    ? 'Thông số khoản vay + Bảng tổng hợp các năm' 
                    : 'Loan params + Yearly summary table'}
                </p>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">
                  1 {isVi ? 'trang A4 gọn' : 'compact A4 page'}
                </span>
              </button>

              {/* Option 3: Monthly schedule */}
              <button
                type="button"
                onClick={() => setExportScope('monthly')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportScope === 'monthly'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-xs'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Chi tiết theo tháng' : 'Monthly Only'}</span>
                  </span>
                  {exportScope === 'monthly' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {isVi 
                    ? 'Thông số khoản vay + Lịch trình từng tháng' 
                    : 'Loan params + Detailed monthly table'}
                </p>
                <span className="text-[10px] text-slate-400 mt-2 font-mono">
                  ~{Math.ceil(calculations.monthlySchedule.length / ROWS_PER_MONTHLY_PAGE)} {isVi ? 'trang A4' : 'A4 pages'}
                </span>
              </button>
            </div>
          </div>

          {/* Progress / Status indicator */}
          {exportProgress && (
            <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl flex items-center gap-2.5 text-xs text-cyan-300">
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
              ) : isDone ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : null}
              <span>{exportProgress}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{isVi ? 'Định dạng tài liệu A4 chuẩn ngân hàng, nền trắng sắc nét' : 'Bank-standard A4 format, high-contrast white layout'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title={isVi ? 'Mở hộp thoại In hoặc Lưu PDF của trình duyệt' : 'Open browser print or Save as PDF'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isVi ? 'In / Lưu PDF' : 'Print / Save'}</span>
            </button>

            <button
              type="button"
              id="confirm-download-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isVi ? 'Đang tạo PDF...' : 'Generating PDF...'}</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isVi ? 'Đã tải xong!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Tải file PDF ngay' : 'Download PDF Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIDDEN PRINTABLE CONTAINER FOR HTML2CANVAS & BROWSER PRINTING             */}
      {/* Stored off-screen, formatted into precise A4 pages (794px x 1123px)       */}
      {/* ========================================================================= */}
      <div
        ref={printContainerRef}
        id="amortization-pdf-printable-source"
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
        {/* ===================================================================== */}
        {/* PAGE 1: HEADER + LOAN PARAMETERS + YEARLY SCHEDULE                    */}
        {/* ===================================================================== */}
        {exportScope !== 'monthly' && (
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
              {/* Report Header Bar */}
              <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0284c7' }}>
                      WEB CALCULATOR FINANCIAL TOOLS • BÁO CÁO TÀI CHÍNH
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                      LỊCH TRÌNH PHÂN BỔ TRẢ NỢ VAY (AMORTIZATION SCHEDULE)
                    </h1>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      Bảng tính chi tiết dòng tiền thanh toán nợ gốc, lãi vay và tiến độ giảm dư nợ
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                    <div>Ngày xuất: <strong style={{ color: '#0f172a' }}>{currentDateFormatted}</strong></div>
                    <div>Tiền tệ: <strong style={{ color: '#0f172a' }}>{currencyInfo.code} ({currencyInfo.symbol})</strong></div>
                    <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 700 }}>
                      Phương thức: Dư nợ giảm dần
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Thông số khoản vay (Loan Parameters Card) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#0284c7', borderRadius: '2px', display: 'inline-block' }} />
                  <span>1. THÔNG SỐ KHOẢN VAY &amp; CHỈ SỐ TÀI CHÍNH</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>SỐ TIỀN VAY GỐC</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{formatMoney(loanAmount)}</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>LÃI SUẤT DANH NGHĨA</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>{interestRate}% / năm</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>THỜI HẠN VAY</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{loanTermYears} năm ({loanTermYears * 12} tháng)</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TRẢ HÀNG THÁNG</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{formatMoney(calculations.actualMonthlyPayment)}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Tổng tiền lãi phải trả:</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#e11d48' }}>{formatMoney(calculations.totalInterestPaid)}</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Tổng tiền gốc &amp; lãi:</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{formatMoney(calculations.totalPaid)}</span>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Thời gian tất toán:</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7' }}>{calculations.actualMonthsTaken} tháng ({Math.floor(calculations.actualMonthsTaken / 12)}n {calculations.actualMonthsTaken % 12}t)</span>
                  </div>
                </div>

                {extraMonthlyPayment > 0 && calculations.interestSaved > 0 && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '11px', color: '#065f46' }}>
                    <strong>★ Lợi ích trả thêm {formatMoney(extraMonthlyPayment)}/tháng:</strong> Tiết kiệm{' '}
                    <strong style={{ color: '#047857' }}>{formatMoney(calculations.interestSaved)}</strong> tiền lãi và rút ngắn thời hạn vay{' '}
                    <strong style={{ color: '#047857' }}>{calculations.monthsSaved} tháng</strong>.
                  </div>
                )}
              </div>

              {/* Section 2: Lịch trình theo năm (Yearly Schedule Table) */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#059669', borderRadius: '2px', display: 'inline-block' }} />
                    <span>2. LỊCH TRÌNH PHÂN BỔ THEO NĂM (ANNUAL AMORTIZATION SCHEDULE)</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal' }}>
                    Tổng cộng {calculations.yearlySchedule.length} năm
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>NĂM</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>TIỀN GỐC TRẢ</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#e11d48' }}>TIỀN LÃI TRẢ</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0284c7' }}>TỔNG THANH TOÁN</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>DƯ NỢ CÒN LẠI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.yearlySchedule.map((row, idx) => (
                      <tr
                        key={row.year}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        }}
                      >
                        <td style={{ padding: '5px 8px', fontWeight: 700, color: '#0f172a' }}>Năm {row.year}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{formatMoney(row.principal)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#e11d48', fontWeight: 600 }}>{formatMoney(row.interest)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#0284c7', fontWeight: 700 }}>{formatMoney(row.principal + row.interest)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>{formatMoney(row.balance)}</td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr style={{ background: '#e2e8f0', borderTop: '2px solid #94a3b8', fontWeight: 800 }}>
                      <td style={{ padding: '6px 8px', color: '#0f172a' }}>TỔNG CỘNG</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#059669' }}>{formatMoney(loanAmount)}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#e11d48' }}>{formatMoney(calculations.totalInterestPaid)}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#0284c7' }}>{formatMoney(calculations.totalPaid)}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', color: '#0f172a' }}>0 {currencyInfo.symbol}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Page 1 Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#94a3b8' }}>
              <div>Web Calculator • Công cụ tính toán tài chính &amp; Lịch trình phân bổ nợ vay</div>
              <div>Trang 1 / {totalPagesCount}</div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGES 2+: MONTHLY AMORTIZATION SCHEDULE TABLE (CHUNKED)              */}
        {/* ===================================================================== */}
        {(exportScope === 'comprehensive' || exportScope === 'monthly') && (
          monthlyPages.map((pageRows, pageIdx) => {
            const pageNumber = (exportScope === 'monthly' ? 1 : 2) + pageIdx;
            const startMonth = pageRows[0]?.month || 1;
            const endMonth = pageRows[pageRows.length - 1]?.month || pageRows.length;

            return (
              <div
                key={`monthly-page-${pageIdx}`}
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
                  {/* Monthly Sub-header */}
                  <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0284c7' }}>
                        LỊCH TRÌNH PHÂN BỔ THEO THÁNG (MONTHLY SCHEDULE)
                      </div>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                        Kỳ thanh toán từ Tháng {startMonth} đến Tháng {endMonth}
                      </h2>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                      <div>Khoản vay: <strong style={{ color: '#0f172a' }}>{formatMoney(loanAmount)}</strong> ({interestRate}%)</div>
                      <div>Trả hàng tháng: <strong style={{ color: '#059669' }}>{formatMoney(calculations.actualMonthlyPayment)}</strong></div>
                    </div>
                  </div>

                  {/* Monthly Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '5px 6px', textAlign: 'left', fontWeight: 700, color: '#334155', width: '70px' }}>KỲ (THÁNG)</th>
                        <th style={{ padding: '5px 6px', textAlign: 'left', fontWeight: 700, color: '#334155', width: '60px' }}>NĂM</th>
                        <th style={{ padding: '5px 6px', textAlign: 'right', fontWeight: 700, color: '#0284c7' }}>SỐ TIỀN TRẢ</th>
                        <th style={{ padding: '5px 6px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>TIỀN GỐC</th>
                        <th style={{ padding: '5px 6px', textAlign: 'right', fontWeight: 700, color: '#e11d48' }}>TIỀN LÃI</th>
                        <th style={{ padding: '5px 6px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>DƯ NỢ CÒN LẠI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, rIdx) => (
                        <tr
                          key={row.month}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            background: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          }}
                        >
                          <td style={{ padding: '4.5px 6px', fontWeight: 700, color: '#0f172a' }}>Tháng {row.month}</td>
                          <td style={{ padding: '4.5px 6px', color: '#64748b' }}>Năm {row.year}</td>
                          <td style={{ padding: '4.5px 6px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>{formatMoney(row.payment)}</td>
                          <td style={{ padding: '4.5px 6px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{formatMoney(row.principal)}</td>
                          <td style={{ padding: '4.5px 6px', textAlign: 'right', color: '#e11d48', fontWeight: 600 }}>{formatMoney(row.interest)}</td>
                          <td style={{ padding: '4.5px 6px', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>{formatMoney(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Page Footer */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#94a3b8' }}>
                  <div>Lịch trình phân bổ nợ vay từng tháng • Dữ liệu tính theo phương pháp chuẩn quốc tế</div>
                  <div>Trang {pageNumber} / {totalPagesCount}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
