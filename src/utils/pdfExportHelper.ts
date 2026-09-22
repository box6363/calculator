import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export interface PdfExportOptions {
  fileName: string;
  pageSelector?: string; // default '.pdf-report-page'
  onProgress?: (progressText: string, current: number, total: number) => void;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4';
  autoDownload?: boolean; // default true
  showMobileSheet?: boolean; // default true on mobile
}

export interface PdfExportResult {
  blob: Blob;
  blobUrl: string;
  fileName: string;
  sharedDirectly?: boolean;
}

/**
 * Kiểm tra thiết bị di động (iOS / Android / Máy tính bảng)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobileUa = /Mobi|Tablet|Opera Mini|CriOS|FxiOS/i.test(ua);
  return isIOS || isAndroid || isMobileUa;
}

/**
 * Kiểm tra thiết bị Apple iOS (iPhone, iPad, iPod)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Hiển thị Bottom Sheet / Floating Action Banner trên điện thoại để người dùng
 * chạm trực tiếp tải file hoặc mở native Share Sheet (Lưu vào Tệp / Files).
 * Điều này khắc phục 100% tình trạng popup blocker hoặc Safari/Chrome chặn tải ngầm.
 */
export function showMobilePdfDownloadSheet(result: PdfExportResult, isVi = true): void {
  // Xóa sheet cũ nếu đang hiển thị
  const existingSheet = document.getElementById('mobile-pdf-export-sheet');
  if (existingSheet && document.body.contains(existingSheet)) {
    document.body.removeChild(existingSheet);
  }

  const sheet = document.createElement('div');
  sheet.id = 'mobile-pdf-export-sheet';
  sheet.style.position = 'fixed';
  sheet.style.bottom = '0px';
  sheet.style.left = '0px';
  sheet.style.right = '0px';
  sheet.style.zIndex = '999999';
  sheet.style.backgroundColor = '#0f172a';
  sheet.style.color = '#ffffff';
  sheet.style.borderTop = '1px solid #334155';
  sheet.style.boxShadow = '0 -10px 25px -5px rgba(0, 0, 0, 0.5)';
  sheet.style.padding = '16px';
  sheet.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  sheet.style.boxSizing = 'border-box';
  sheet.style.animation = 'fadeInUp 0.25s ease-out';

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  sheet.innerHTML = `
    <div style="max-width: 540px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; items-center; justify-content: space-between; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background-color: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; color: #34d399; font-size: 18px; flex-shrink: 0;">
            📄
          </div>
          <div style="min-width: 0;">
            <div style="font-size: 14px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${result.fileName}
            </div>
            <div style="font-size: 11px; color: #94a3b8;">
              ${isVi ? 'File PDF đã sẵn sàng! Chạm bên dưới để mở hoặc lưu về máy:' : 'PDF ready! Tap below to open or save to your device:'}
            </div>
          </div>
        </div>
        <button id="close-mobile-pdf-sheet-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px; line-height: 1;">
          ✕
        </button>
      </div>

      <div style="display: grid; grid-template-columns: ${canNativeShare ? '1fr 1fr' : '1fr'}; gap: 8px;">
        <a id="direct-mobile-download-link" href="${result.blobUrl}" download="${result.fileName}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 14px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);">
          <span>📥</span>
          <span>${isVi ? 'Mở / Tải file PDF' : 'Open / Save PDF'}</span>
        </a>

        ${canNativeShare ? `
          <button id="native-mobile-share-btn" type="button" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 14px; background-color: #1e293b; color: #f8fafc; border: 1px solid #475569; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer;">
            <span>📤</span>
            <span>${isVi ? 'Lưu vào Tệp / Share' : 'Save to Files / Share'}</span>
          </button>
        ` : ''}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748b; padding-top: 2px;">
        <span>${isVi ? '💡 Mẹo: Nhấn "Lưu vào Tệp" (iPhone) hoặc "Tải về" (Android)' : '💡 Tip: Choose "Save to Files" (iPhone) or "Download" (Android)'}</span>
        <button id="print-fallback-mobile-btn" type="button" style="background: none; border: none; color: #38bdf8; font-size: 11px; text-decoration: underline; cursor: pointer; padding: 0;">
          ${isVi ? 'In trực tiếp' : 'Print directly'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(sheet);

  // Gắn sự kiện đóng
  const closeBtn = document.getElementById('close-mobile-pdf-sheet-btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (document.body.contains(sheet)) {
        document.body.removeChild(sheet);
      }
    };
  }

  // Gắn sự kiện in
  const printBtn = document.getElementById('print-fallback-mobile-btn');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }

  // Gắn sự kiện Share Native khi người dùng chạm trực tiếp (đảm bảo user gesture hợp lệ)
  const shareBtn = document.getElementById('native-mobile-share-btn');
  if (shareBtn && canNativeShare) {
    shareBtn.onclick = async () => {
      try {
        const file = new File([result.blob], result.fileName, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: result.fileName,
            text: isVi ? 'Tài liệu bảng tính PDF' : 'Financial Statement PDF',
          });
        } else {
          // Fallback share link nếu không share được file trực tiếp
          await navigator.share({
            title: result.fileName,
            url: result.blobUrl,
          });
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Lỗi khi chia sẻ file:', err);
          // Mở trực tiếp link PDF nếu share gặp sự cố
          window.open(result.blobUrl, '_blank');
        }
      }
    };
  }
}

/**
 * Xuất toàn bộ các trang tài liệu (A4) từ một container HTML thành file PDF chất lượng cao.
 * Tối ưu hóa đặc biệt cho thiết bị di động (Android & iPhone/iPad):
 * - Tách biệt vùng dựng hình A4 chuẩn 794px không bị co dúm hay cắt góc bởi viewport điện thoại.
 * - Loại bỏ các vòng lặp tính toán pixel nặng để không gây tràn bộ nhớ (Jetsam) làm Safari tự động reload trang.
 * - Kích hoạt Native Web Share API và Drawer tải trực tiếp để vượt qua popup/download blocker trên di động.
 */
export async function exportElementPagesToPdf(
  containerEl: HTMLElement,
  options: PdfExportOptions
): Promise<PdfExportResult> {
  if (!containerEl) {
    throw new Error('Không tìm thấy phần tử tài liệu để xuất PDF');
  }

  const pageSelector = options.pageSelector || '.pdf-report-page';
  let pageElements = Array.from(containerEl.querySelectorAll<HTMLElement>(pageSelector));

  // Nếu bản thân containerEl chính là trang hoặc querySelectorAll không tìm thấy phần tử con nào
  if (pageElements.length === 0) {
    if (containerEl.matches && containerEl.matches(pageSelector)) {
      pageElements = [containerEl];
    } else {
      pageElements = [containerEl];
    }
  }

  if (pageElements.length === 0) {
    throw new Error('Không tìm thấy trang tài liệu nào để xuất PDF');
  }

  // Chờ phông chữ tải xong hoàn chỉnh để các con số và ký hiệu tài chính sắc nét
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Bỏ qua nếu môi trường không hỗ trợ font API
    }
  }

  const isLandscape = options.orientation === 'landscape';
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: options.format || 'a4',
    compress: true,
  });

  const pdfWidth = isLandscape ? 297 : 210;
  const pdfHeight = isLandscape ? 210 : 297;

  // Tạo khung chứa render tạm thời cô lập, định vị tuyệt đối để không bị giới hạn bởi màn hình điện thoại
  const host = document.createElement('div');
  host.id = 'pdf-isolated-render-host';
  host.setAttribute('data-pdf-rendering', 'true');
  host.setAttribute('data-theme', 'light');
  host.style.position = 'absolute';
  host.style.top = '0px';
  host.style.left = '0px';
  host.style.width = '794px';
  host.style.minWidth = '794px';
  host.style.maxWidth = 'none';
  host.style.height = 'auto';
  host.style.minHeight = '1123px';
  host.style.zIndex = '-100'; // Đặt z-index âm vừa đủ, không dùng -9999 để tránh bị browser culling trên iOS
  host.style.backgroundColor = '#ffffff';
  host.style.color = '#000000';
  host.style.overflow = 'visible';
  host.style.pointerEvents = 'none';
  host.style.boxSizing = 'border-box';
  host.style.margin = '0';
  host.style.padding = '0';
  host.style.opacity = '1';
  host.style.visibility = 'visible';

  // Nhúng style hỗ trợ tài liệu in rõ nét, chuẩn màu
  const bwStyle = document.createElement('style');
  bwStyle.id = 'pdf-bw-style-enforcer';
  bwStyle.textContent = `
    #pdf-isolated-render-host,
    #pdf-isolated-render-host * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box !important;
    }
    #pdf-isolated-render-host {
      background-color: #ffffff !important;
      color: #0f172a !important;
    }
    #pdf-isolated-render-host .pdf-report-page {
      background-color: #ffffff !important;
      color: #0f172a !important;
      box-shadow: none !important;
    }
  `;
  host.appendChild(bwStyle);
  document.body.appendChild(host);

  try {
    for (let i = 0; i < pageElements.length; i++) {
      if (options.onProgress) {
        options.onProgress(
          `Đang xử lý trang ${i + 1}/${pageElements.length}...`,
          i + 1,
          pageElements.length
        );
      }

      const sourcePage = pageElements[i];
      const isFixedPage = sourcePage.classList.contains('pdf-report-page');

      // Clone trang nguồn để render độc lập
      const clone = sourcePage.cloneNode(true) as HTMLElement;
      clone.style.visibility = 'visible';
      clone.style.position = 'relative';
      clone.style.top = '0px';
      clone.style.left = '0px';
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#000000';
      clone.style.transform = 'none';
      clone.style.opacity = '1';

      if (isFixedPage) {
        clone.style.width = '794px';
        clone.style.minHeight = '1123px';
        clone.style.height = 'auto';
        clone.style.maxHeight = 'none';
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.justifyContent = 'space-between';
      } else {
        clone.style.width = '794px';
        clone.style.height = 'auto';
        clone.style.minHeight = 'auto';
        clone.style.display = 'block';
      }

      // Làm sạch các node con của host trừ thẻ style cưỡng chế đen trắng
      const existingStyle = host.querySelector('#pdf-bw-style-enforcer');
      host.innerHTML = '';
      if (existingStyle) {
        host.appendChild(existingStyle);
      }
      host.appendChild(clone);

      // Đợi trình duyệt layout xong các thẻ, bảng và SVG icons
      await new Promise((resolve) => setTimeout(resolve, 80));

      const targetHeight = clone.scrollHeight || clone.offsetHeight || 1123;

      const canvas = await html2canvas(clone, {
        scale: 2, // Độ phân giải 2x chuẩn sắc nét
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 794,
        width: 794,
        height: targetHeight,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error(`Lỗi kết xuất canvas trang ${i + 1}`);
      }

      const imgData = canvas.toDataURL('image/png');

      const a4Ratio = pdfHeight / pdfWidth; // 297 / 210 = 1.4142857
      const canvasRatio = canvas.height / canvas.width;

      if (canvasRatio <= a4Ratio * 1.05) {
        if (i > 0) {
          pdf.addPage();
        }
        const renderedHeight = Math.min(pdfHeight, (canvas.height * pdfWidth) / canvas.width);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedHeight, undefined, 'FAST');
      } else {
        // Tự động phân trang cho tài liệu dài liên tục
        const pageCanvasHeight = Math.floor(canvas.width * a4Ratio);
        let renderedOffset = 0;
        let sliceIdx = 0;

        while (renderedOffset < canvas.height) {
          if (i > 0 || sliceIdx > 0) {
            pdf.addPage();
          }

          const sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedOffset);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageCanvasHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              renderedOffset,
              canvas.width,
              sliceHeight,
              0,
              0,
              canvas.width,
              sliceHeight
            );
            const pageImg = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImg, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          }

          renderedOffset += sliceHeight;
          sliceIdx++;
        }
      }
    }

    if (options.onProgress) {
      options.onProgress('Đang chuẩn bị file PDF...', pageElements.length, pageElements.length);
    }

    const rawName = (options.fileName || 'Bang_Tinh_Thue.pdf').replace(/[^a-z0-9_.-]/gi, '_');
    const finalFileName = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;

    // Tạo blob trực tiếp với MIME type chuẩn application/pdf
    const pdfBlob = pdf.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    const isMobile = isMobileDevice();
    const isIOS = isIOSDevice();
    let sharedDirectly = false;

    // 1. Nếu là thiết bị di động và hỗ trợ Web Share API với files:
    // Thử gọi navigator.share để mở native Action Sheet (Lưu vào Tệp / Chia sẻ)
    if (isMobile && typeof navigator !== 'undefined' && navigator.canShare) {
      try {
        const pdfFile = new File([pdfBlob], finalFileName, { type: 'application/pdf' });
        if (navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            files: [pdfFile],
            title: finalFileName,
            text: 'Tài liệu PDF bảng tính tài chính',
          });
          sharedDirectly = true;
        }
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          // Người dùng chủ động bấm Hủy trên Share Sheet của điện thoại
          sharedDirectly = true;
        } else {
          console.warn('Native share không khả dụng trong ngữ cảnh async:', shareErr);
        }
      }
    }

    // 2. Kích hoạt tải tự động (chủ yếu cho Desktop hoặc trình duyệt cho phép)
    if (!sharedDirectly) {
      try {
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfBlobUrl;
        downloadLink.download = finalFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (document.body.contains(downloadLink)) {
            document.body.removeChild(downloadLink);
          }
        }, 3000);
      } catch (linkError) {
        console.warn('Tải tự động qua liên kết bị hạn chế:', linkError);
      }
    }

    const exportResult: PdfExportResult = {
      blob: pdfBlob,
      blobUrl: pdfBlobUrl,
      fileName: finalFileName,
      sharedDirectly,
    };

    // 3. ĐỐI VỚI ĐIỆN THOẠI (Android & iOS):
    // Luôn luôn hiển thị Mobile PDF Action Sheet tương tác (trừ khi người dùng đã share thành công)
    // để người dùng có thể chạm trực tiếp 1 chạm tải về máy 100% không bao giờ bị chặn!
    const shouldShowMobileSheet = options.showMobileSheet !== false && isMobile;
    if (shouldShowMobileSheet && !sharedDirectly) {
      showMobilePdfDownloadSheet(exportResult, true);
    }

    // Giữ blob URL sống trong 10 phút để người dùng có thể tải nhiều lần mà không bị lỗi đứt link
    setTimeout(() => {
      try {
        URL.revokeObjectURL(pdfBlobUrl);
      } catch {
        // ignore
      }
    }, 600000);

    return exportResult;
  } finally {
    // Dọn dẹp khung render tạm
    if (document.body.contains(host)) {
      document.body.removeChild(host);
    }
  }
}

