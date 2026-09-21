import React, { useState, useRef, useMemo } from 'react';
import { X, FileDown, Printer, Check, Loader2, Calendar, Car, ShieldAlert } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf } from '../../utils/pdfExportHelper';

export interface AutoLoanPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehiclePrice: number;
  loanTermMonths: number;
  interestRate: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  otherFees: number;
  calculations: {
    salesTaxAmount: number;
    loanAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    totalLoanCost: number;
    totalPurchaseCost: number;
  };
}

export const AutoLoanPdfModal: React.FC<AutoLoanPdfModalProps> = ({
  isOpen,
  onClose,
  vehiclePrice,
  loanTermMonths,
  interestRate,
  downPayment,
  tradeInValue,
  salesTaxRate,
  otherFees,
  calculations
}) => {
  const { currencyInfo, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [exportScope, setExportScope] = useState<'full' | 'firstYear'>('firstYear');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  // Compute full monthly schedule
  const fullSchedule = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const schedule = [];
    let balance = calculations.loanAmount;
    const count = exportScope === 'firstYear' ? Math.min(12, loanTermMonths) : loanTermMonths;

    for (let m = 1; m <= count; m++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = calculations.monthlyPayment - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);
      schedule.push({
        month: m,
        payment: calculations.monthlyPayment,
        principal: principalForMonth,
        interest: interestForMonth,
        balance
      });
    }
    return schedule;
  }, [calculations.loanAmount, calculations.monthlyPayment, interestRate, loanTermMonths, exportScope]);

  if (!isOpen) return null;

  // Split schedule into pages (~26 rows per page)
  const ROWS_PER_PAGE = 26;
  const schedulePages = [];
  for (let i = 0; i < fullSchedule.length; i += ROWS_PER_PAGE) {
    schedulePages.push(fullSchedule.slice(i, i + ROWS_PER_PAGE));
  }
  const totalPagesCount = Math.max(1, schedulePages.length);

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing pages...');

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = isVi
        ? `Lich_Tra_No_Vay_O_To_${Math.round(calculations.loanAmount)}_${currencyInfo.code}_${dateStr}.pdf`
        : `Auto_Loan_Payment_Plan_${Math.round(calculations.loanAmount)}_${currencyInfo.code}_${dateStr}.pdf`;

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
      console.error('Lỗi khi xuất PDF:', error);
      alert(isVi ? 'Có lỗi khi tạo PDF. Bạn có thể chọn In trực tiếp.' : 'Error generating PDF. Try Print directly.');
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
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isVi ? 'Xuất Báo Cáo & Lịch Trả Nợ Vay Mua Ô Tô' : 'Export Auto Loan Report & Schedule'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Bao gồm giá xe, thuế phí lăn bánh, số tiền vay và bảng trả nợ định kỳ' 
                  : 'Includes vehicle cost, taxes & fees, loan amount, and monthly payment schedule'}
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
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Scope Selector */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {isVi ? 'Phạm vi xuất lịch trả nợ:' : 'Schedule export scope:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportScope('firstYear')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  exportScope === 'firstYear'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isVi ? 'Năm đầu tiên (12 tháng)' : 'First Year (12 months)'}
              </button>
              <button
                type="button"
                onClick={() => setExportScope('full')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  exportScope === 'full'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isVi ? `Toàn bộ kỳ hạn (${loanTermMonths} tháng)` : `Full Loan (${loanTermMonths} months)`}
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{isVi ? 'Tóm tắt thông số khoản vay xe' : 'Auto loan parameters summary'}</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Giá xe niêm yết' : 'Vehicle Price'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatMoney(vehiclePrice)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Trả trước + Đổi xe' : 'Down + Trade-in'}</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {formatMoney(downPayment + tradeInValue)}
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Lãi suất vay' : 'Interest Rate'}</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">{interestRate}% / {isVi ? 'năm' : 'yr'}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Thời gian vay' : 'Loan Term'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{loanTermMonths} {isVi ? 'tháng' : 'months'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border border-emerald-500/40 text-center space-y-1">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                {isVi ? 'Ước tính trả góp hàng tháng' : 'Estimated Monthly Payment'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                {formatMoney(calculations.monthlyPayment)}
                <span className="text-xs text-slate-400 font-normal"> /{isVi ? 'tháng' : 'mo'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Số tiền vay' : 'Loan Amount'}</span>
                <span className="text-xs sm:text-sm font-bold text-white tabular-nums">{formatMoney(calculations.loanAmount)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Tổng tiền lãi' : 'Total Interest'}</span>
                <span className="text-xs sm:text-sm font-bold text-rose-400 tabular-nums">{formatMoney(calculations.totalInterest)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Thuế trước bạ' : 'Sales Tax'}</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 tabular-nums">{formatMoney(calculations.salesTaxAmount)}</span>
              </div>
            </div>
          </div>

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
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{isVi ? 'Định dạng tài liệu A4 chuẩn ngân hàng' : 'Bank-standard A4 format'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isVi ? 'In / Lưu PDF' : 'Print / Save'}</span>
            </button>

            <button
              type="button"
              id="confirm-download-autoloan-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
        id="autoloan-pdf-printable-source"
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
        {schedulePages.map((pageRows, pageIdx) => (
          <div
            key={`page-${pageIdx}`}
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
              <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#2563eb' }}>
                      BÁO CÁO TÀI CHÍNH • AUTO FINANCING REPORT
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                      BẢNG DỰ TOÁN KHOẢN VAY MUA XE Ô TÔ
                    </h1>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      Chi tiết chi phí mua xe, thuế trước bạ, phí lăn bánh và lịch trình trả góp định kỳ
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                    <div>Ngày lập: <strong style={{ color: '#0f172a' }}>{currentDateFormatted}</strong></div>
                    <div>Tiền tệ: <strong style={{ color: '#0f172a' }}>{currencyInfo.code} ({currencyInfo.symbol})</strong></div>
                    <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontWeight: 700 }}>
                      Phương thức: Trả góp dư nợ cố định (EMI)
                    </div>
                  </div>
                </div>
              </div>

              {pageIdx === 0 && (
                <>
                  {/* Summary Cards */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '2px', display: 'inline-block' }} />
                      <span>1. THÔNG SỐ XE &amp; KHOẢN VAY</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>GIÁ XE NIÊM YẾT</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{formatMoney(vehiclePrice)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>SỐ TIỀN TRẢ TRƯỚC</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{formatMoney(downPayment)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>THUẾ TRƯỚC BẠ ({salesTaxRate}%)</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>{formatMoney(calculations.salesTaxAmount)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>PHÍ LĂN BÁNH KHÁC</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{formatMoney(otherFees)}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 700 }}>TRẢ GÓP HÀNG THÁNG</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                          {formatMoney(calculations.monthlyPayment)} <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>/tháng</span>
                        </div>
                        <div style={{ fontSize: '9.5px', color: '#3b82f6', marginTop: '2px' }}>
                          Kỳ hạn: <strong>{loanTermMonths} tháng</strong> • Lãi suất: <strong>{interestRate}%/năm</strong>
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>SỐ TIỀN VAY GỐC</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '3px' }}>
                          {formatMoney(calculations.loanAmount)}
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9.5px', color: '#e11d48', fontWeight: 600 }}>TỔNG TIỀN LÃI</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#e11d48', marginTop: '3px' }}>
                          {formatMoney(calculations.totalInterest)}
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9.5px', color: '#0f172a', fontWeight: 600 }}>TỔNG GIÁ TRỊ XE MUA</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '3px' }}>
                          {formatMoney(calculations.totalPurchaseCost)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Amortization Schedule Table */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '2px', display: 'inline-block' }} />
                    <span>2. BẢNG KẾ HOẠCH TRẢ NỢ CHI TIẾT</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    (Từ Kỳ #{pageRows[0]?.month} đến Kỳ #{pageRows[pageRows.length - 1]?.month})
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>KỲ (THÁNG)</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>KHOẢN TRẢ / THÁNG</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>TRẢ TIỀN GỐC</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#e11d48' }}>TRẢ TIỀN LÃI</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#334155' }}>DƯ NỢ CÒN LẠI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => (
                      <tr
                        key={row.month}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        }}
                      >
                        <td style={{ padding: '5px 8px', fontWeight: 700, color: '#0f172a' }}>Tháng #{row.month}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{formatMoney(row.payment)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>{formatMoney(row.principal)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#e11d48' }}>{formatMoney(row.interest)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#334155', fontWeight: 700 }}>{formatMoney(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#94a3b8' }}>
              <div>Web Calculator • Bảng dự toán vay mua ô tô trả góp</div>
              <div>Trang {pageIdx + 1} / {totalPagesCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
