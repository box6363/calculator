import React, { useState, useRef } from 'react';
import { X, FileDown, Printer, Check, Loader2, Calendar, TrendingDown, ShieldAlert, Sparkles } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { exportElementPagesToPdf } from '../../utils/pdfExportHelper';

export interface InflationPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmount: number;
  inflationRate: number;
  years: number;
  calculations: {
    futureEquivalentCost: number;
    futurePurchasingPower: number;
    purchasingPowerLossPercent: number;
    timeline: {
      year: number;
      equivalent: number;
      purchasingPower: number;
    }[];
  };
}

export const InflationPdfModal: React.FC<InflationPdfModalProps> = ({
  isOpen,
  onClose,
  currentAmount,
  inflationRate,
  years,
  calculations
}) => {
  const { currencyInfo, formatMoney } = useCurrency();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isDone, setIsDone] = useState<boolean>(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Split timeline into pages (~30 rows per page if many years)
  const ROWS_PER_PAGE = 30;
  const timelinePages = [];
  for (let i = 0; i < calculations.timeline.length; i += ROWS_PER_PAGE) {
    timelinePages.push(calculations.timeline.slice(i, i + ROWS_PER_PAGE));
  }
  const totalPagesCount = Math.max(1, timelinePages.length);

  const handleExportPDF = async () => {
    if (isExporting || !printContainerRef.current) return;
    try {
      setIsExporting(true);
      setIsDone(false);
      setExportProgress(isVi ? 'Đang chuẩn bị trang in...' : 'Preparing pages...');

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = isVi
        ? `Bao_Cao_Lam_Phat_Suc_Mua_${Math.round(currentAmount)}_${currencyInfo.code}_${dateStr}.pdf`
        : `Inflation_Purchasing_Power_Report_${Math.round(currentAmount)}_${currencyInfo.code}_${dateStr}.pdf`;

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

  const rule72Years = (72 / Math.max(0.1, inflationRate)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isVi ? 'Xuất Báo Cáo Lạm Phát & Sức Mua' : 'Export Inflation & Purchasing Power Report'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Bao gồm thông số lạm phát, mức bào mòn sức mua và tiến trình theo từng năm' 
                  : 'Includes inflation metrics, purchasing power depreciation, and yearly timeline'}
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
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{isVi ? 'Tóm tắt thông số dự phóng' : 'Projection parameters summary'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Số tiền ban đầu' : 'Current Amount'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{formatMoney(currentAmount)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block">{isVi ? 'Tỷ lệ lạm phát' : 'Inflation Rate'}</span>
                <span className="text-sm font-bold text-rose-400 tabular-nums">{inflationRate}% / {isVi ? 'năm' : 'yr'}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block">{isVi ? 'Thời gian' : 'Time Horizon'}</span>
                <span className="text-sm font-bold text-white tabular-nums">{years} {isVi ? 'năm' : 'years'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30">
                <span className="text-rose-300 block mb-1">{isVi ? 'Sức mua còn lại thực tế:' : 'Future Purchasing Power:'}</span>
                <span className="text-base font-extrabold text-rose-400 tabular-nums">{formatMoney(calculations.futurePurchasingPower)}</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  ({isVi ? 'Giảm' : 'Down'} -{calculations.purchasingPowerLossPercent.toFixed(1)}% {isVi ? 'giá trị' : 'value'})
                </span>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30">
                <span className="text-amber-300 block mb-1">{isVi ? 'Số tiền tương đương cần có:' : 'Equivalent Future Cost:'}</span>
                <span className="text-base font-extrabold text-amber-300 tabular-nums">{formatMoney(calculations.futureEquivalentCost)}</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  (+{formatMoney(calculations.futureEquivalentCost - currentAmount)})
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isVi 
                  ? `Quy luật 72: Với mức lạm phát ${inflationRate}%/năm, giá cả hàng hóa sẽ tăng gấp đôi sau khoảng ${rule72Years} năm.`
                  : `Rule of 72: At ${inflationRate}% inflation, prices will double in approx ${rule72Years} years.`}
              </span>
            </div>
          </div>

          {exportProgress && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-400 shrink-0" />
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
            <span>{isVi ? 'Định dạng tài liệu A4 chuẩn in ấn, rõ nét' : 'Bank-standard A4 format'}</span>
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
              id="confirm-download-inflation-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
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
        id="inflation-pdf-printable-source"
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
        {timelinePages.map((pageRows, pageIdx) => (
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
              <div style={{ borderBottom: '2px solid #e11d48', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#e11d48' }}>
                      BÁO CÁO TÀI CHÍNH • FINANCIAL ANALYSIS REPORT
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px 0', letterSpacing: '-0.5px' }}>
                      BÁO CÁO DỰ BÁO LẠM PHÁT &amp; SỨC MUA
                    </h1>
                    <div style={{ fontSize: '11px', color: '#475569' }}>
                      Đo lường sự sụt giảm sức mua của tiền tệ và giá trị tương đương trong tương lai
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                    <div>Ngày lập: <strong style={{ color: '#0f172a' }}>{currentDateFormatted}</strong></div>
                    <div>Tiền tệ: <strong style={{ color: '#0f172a' }}>{currencyInfo.code} ({currencyInfo.symbol})</strong></div>
                    <div style={{ marginTop: '2px', display: 'inline-block', padding: '2px 6px', background: '#ffe4e6', color: '#be123c', borderRadius: '4px', fontWeight: 700 }}>
                      Mô hình: Tăng trưởng lũy kế hàng năm
                    </div>
                  </div>
                </div>
              </div>

              {pageIdx === 0 && (
                <>
                  {/* Summary Cards */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#e11d48', borderRadius: '2px', display: 'inline-block' }} />
                      <span>1. THÔNG SỐ TÍNH TOÁN &amp; KẾT QUẢ DỰ PHÓNG</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>SỐ TIỀN BAN ĐẦU</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{formatMoney(currentAmount)}</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>TỶ LỆ LẠM PHÁT DỰ KIẾN</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#e11d48', marginTop: '2px' }}>{inflationRate}% / năm</div>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>THỜI GIAN DỰ PHÓNG</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{years} năm</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#9f1239', fontWeight: 700 }}>SỨC MUA CÒN LẠI SAU {years} NĂM</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#be123c', marginTop: '3px' }}>
                          {formatMoney(calculations.futurePurchasingPower)}
                        </div>
                        <div style={{ fontSize: '10px', color: '#e11d48', marginTop: '2px' }}>
                          Mất đi <strong>-{calculations.purchasingPowerLossPercent.toFixed(1)}%</strong> giá trị thực tế do lạm phát
                        </div>
                      </div>

                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '10px', color: '#92400e', fontWeight: 700 }}>SỐ TIỀN TƯƠNG ĐƯƠNG CẦN CÓ TRONG TƯƠNG LAI</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#b45309', marginTop: '3px' }}>
                          {formatMoney(calculations.futureEquivalentCost)}
                        </div>
                        <div style={{ fontSize: '10px', color: '#d97706', marginTop: '2px' }}>
                          Cần thêm <strong>+{formatMoney(calculations.futureEquivalentCost - currentAmount)}</strong> để duy trì mức sống cũ
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '10.5px', color: '#334155' }}>
                      💡 <strong>Quy luật 72:</strong> Với mức lạm phát <strong>{inflationRate}%/năm</strong>, giá cả thị trường sẽ tăng gấp đôi sau khoảng <strong>{rule72Years} năm</strong>.
                    </div>
                  </div>
                </>
              )}

              {/* Timeline Table */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '2px', display: 'inline-block' }} />
                    <span>2. TIẾN TRÌNH SỨC MUA VÀ GIÁ TRỊ TƯƠNG ĐƯƠNG THEO NĂM</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    (Từ Năm {pageRows[0]?.year} đến Năm {pageRows[pageRows.length - 1]?.year})
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>NĂM</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#e11d48' }}>SỨC MUA CÒN LẠI CỦA {formatMoney(currentAmount)}</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#d97706' }}>SỐ TIỀN TƯƠNG ĐƯƠNG CẦN CÓ</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>TỶ LỆ HAO HỤT LŨY KẾ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => {
                      const lossPercent = currentAmount > 0 ? ((currentAmount - row.purchasingPower) / currentAmount) * 100 : 0;
                      return (
                        <tr
                          key={row.year}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          }}
                        >
                          <td style={{ padding: '5px 8px', fontWeight: 700, color: '#0f172a' }}>Năm {row.year}</td>
                          <td style={{ padding: '5px 8px', textAlign: 'right', color: '#be123c', fontWeight: 600 }}>{formatMoney(row.purchasingPower)}</td>
                          <td style={{ padding: '5px 8px', textAlign: 'right', color: '#b45309', fontWeight: 700 }}>{formatMoney(row.equivalent)}</td>
                          <td style={{ padding: '5px 8px', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>-{lossPercent.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#94a3b8' }}>
              <div>Web Calculator • Công cụ phân tích lạm phát và sức mua tiền tệ</div>
              <div>Trang {pageIdx + 1} / {totalPagesCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
