import React, { useState, useRef } from 'react';
import { X, FileDown, Printer, Check, Loader2, Calendar, TrendingUp, ShieldAlert } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf } from '../../utils/pdfExportHelper';

export interface CompoundInterestPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDeposit: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  compoundResult: {
    finalValue: number;
    finalDeposited: number;
    totalInterest: number;
    yearlyData: {
      year: number;
      totalDeposited: number;
      totalValue: number;
      interest: number;
    }[];
  };
}

export const CompoundInterestPdfModal: React.FC<CompoundInterestPdfModalProps> = ({
  isOpen,
  onClose,
  initialDeposit,
  monthlyContribution,
  annualRate,
  years,
  compoundResult
}) => {
  const { currencyInfo, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Split yearly data into pages (~28 rows per page)
  const ROWS_PER_PAGE = 28;
  const yearlyPages = [];
  for (let i = 0; i < compoundResult.yearlyData.length; i += ROWS_PER_PAGE) {
    yearlyPages.push(compoundResult.yearlyData.slice(i, i + ROWS_PER_PAGE));
  }
  const totalPagesCount = Math.max(1, yearlyPages.length);

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing pages...');

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = isVi
        ? `Lich_Lai_Kep_Tiet_Kiem_${Math.round(compoundResult.finalValue)}_${currencyInfo.code}_${dateStr}.pdf`
        : `Compound_Interest_Savings_Plan_${Math.round(compoundResult.finalValue)}_${currencyInfo.code}_${dateStr}.pdf`;

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
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isVi ? 'Xuất Báo Cáo Lãi Tiết Kiệm & Lãi Kép' : 'Export Compound Interest Savings Report'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Bao gồm vốn ban đầu, tiền gửi định kỳ, lãi kép và bảng tăng trưởng hàng năm' 
                  : 'Includes initial deposit, periodic contributions, compound interest, and yearly breakdown'}
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
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{isVi ? 'Tóm tắt thông số gửi tiết kiệm' : 'Savings plan parameters'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Tiền gửi ban đầu' : 'Initial Principal'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatMoney(initialDeposit)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Góp thêm hàng tháng' : 'Monthly Contribution'}</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">{formatMoney(monthlyContribution)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Lãi suất gửi' : 'Annual Rate'}</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">{annualRate}% / {isVi ? 'năm' : 'yr'}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Thời gian tích lũy' : 'Period'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{years} {isVi ? 'năm' : 'years'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/60 border border-blue-500/40 text-center space-y-1">
              <span className="text-xs text-blue-300 uppercase tracking-wider font-semibold">
                {isVi ? `Tổng số dư tích lũy sau ${years} năm` : `Total Balance After ${years} Years`}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 tabular-nums">
                {formatMoney(compoundResult.finalValue)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">{isVi ? 'Tổng tiền gốc đã gửi:' : 'Total Principal Deposited:'}</span>
                <span className="text-sm sm:text-base font-bold text-slate-200 tabular-nums">{formatMoney(compoundResult.finalDeposited)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">{isVi ? 'Tổng tiền lãi kép nhận được:' : 'Total Compound Interest:'}</span>
                <span className="text-sm sm:text-base font-bold text-emerald-400 tabular-nums">+{formatMoney(compoundResult.totalInterest)}</span>
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
              id="confirm-download-compound-pdf-btn"
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
        id="compound-interest-pdf-printable-source"
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
        {yearlyPages.map((pageRows, pageIdx) => (
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
                      BÁO CÁO TÀI CHÍNH • SAVINGS &amp; INVESTMENT REPORT
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                      BÁO CÁO LÃI SUẤT TIẾT KIỆM &amp; LÃI KÉP
                    </h1>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      Dự phóng tích lũy tài chính với mô hình lãi kép định kỳ hàng tháng
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                    <div>Ngày lập: <strong style={{ color: '#0f172a' }}>{currentDateFormatted}</strong></div>
                    <div>Tiền tệ: <strong style={{ color: '#0f172a' }}>{currencyInfo.code} ({currencyInfo.symbol})</strong></div>
                    <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontWeight: 700 }}>
                      Tần suất gộp lãi: Hàng tháng (12 kỳ/năm)
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
                      <span>1. THÔNG SỐ TIẾT KIỆM &amp; KẾT QUẢ TÍCH LŨY</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>TIỀN GỬI BAN ĐẦU</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{formatMoney(initialDeposit)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>GÓP HÀNG THÁNG</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>{formatMoney(monthlyContribution)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>LÃI SUẤT TIẾT KIỆM</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>{annualRate}% / năm</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>THỜI GIAN TÍCH LŨY</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{years} năm</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px' }}>
                        <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 700 }}>TỔNG GIÁ TRỊ TÀI SẢN TƯƠNG LAI</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#1d4ed8', marginTop: '2px' }}>
                          {formatMoney(compoundResult.finalValue)}
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>TỔNG TIỀN GỐC NẠP</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '3px' }}>
                          {formatMoney(compoundResult.finalDeposited)}
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '9.5px', color: '#059669', fontWeight: 600 }}>TỔNG TIỀN LÃI KÉP</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#059669', marginTop: '3px' }}>
                          +{formatMoney(compoundResult.totalInterest)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Yearly Breakdown Table */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '2px', display: 'inline-block' }} />
                    <span>2. TIẾN TRÌNH TĂNG TRƯỞNG THEO NĂM</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    (Từ Năm {pageRows[0]?.year} đến Năm {pageRows[pageRows.length - 1]?.year})
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>NĂM</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>TỔNG VỐN NẠP LŨY KẾ</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>LÃI SINH RA TÍCH LŨY</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>TỔNG SỐ DƯ TÀI KHOẢN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => (
                      <tr
                        key={row.year}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        }}
                      >
                        <td style={{ padding: '5px 8px', fontWeight: 700, color: '#0f172a' }}>Năm {row.year}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#334155', fontWeight: 600 }}>{formatMoney(row.totalDeposited)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>+{formatMoney(row.interest)}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'right', color: '#0f172a', fontWeight: 800 }}>{formatMoney(row.totalValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#94a3b8' }}>
              <div>Web Calculator • Công cụ tính toán lãi suất tiết kiệm &amp; lãi kép</div>
              <div>Trang {pageIdx + 1} / {totalPagesCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
