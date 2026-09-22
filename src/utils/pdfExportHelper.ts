import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export interface PdfExportOptions {
  fileName: string;
  pageSelector?: string; // default '.pdf-report-page'
  onProgress?: (progressText: string, current: number, total: number) => void;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4';
}

export interface PdfExportResult {
  blob: Blob;
  blobUrl: string;
  fileName: string;
}

/**
 * Xuất toàn bộ các trang tài liệu (A4) từ một container HTML thành file PDF chất lượng cao.
 * Khắc phục triệt để lỗi trắng trang hoặc lỗi color oklch/lab nhờ html2canvas-pro.
 * 
 * Cơ chế hoạt động:
 * Tự động clone từng trang vào một Isolated Render Host tạm thời đặt tại tọa độ chuẩn (0, 0)
 * ẩn dưới z-index âm, kết xuất canvas 2x Retina sắc nét rồi giải phóng DOM sạch sẽ.
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
      // Dùng trực tiếp containerEl làm trang in
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

  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.format || 'a4',
    compress: true,
  });

  const pdfWidth = options.orientation === 'landscape' ? 297 : 210;
  const pdfHeight = options.orientation === 'landscape' ? 210 : 297;

  // Lưu vị trí cuộn trang hiện tại
  const origScrollX = window.scrollX || window.pageXOffset || 0;
  const origScrollY = window.scrollY || window.pageYOffset || 0;

  // Tạo khung chứa render tạm thời cô lập, gắn trực tiếp vào document.body
  const host = document.createElement('div');
  host.id = 'pdf-isolated-render-host';
  host.setAttribute('data-pdf-rendering', 'true');
  host.setAttribute('data-theme', 'light');
  host.style.position = 'fixed';
  host.style.top = '0px';
  host.style.left = '0px';
  host.style.width = '794px';
  host.style.height = 'auto';
  host.style.minHeight = '1123px';
  host.style.zIndex = '-9999'; // Nằm dưới cùng, tránh nhấp nháy trên giao diện người dùng
  host.style.backgroundColor = '#ffffff';
  host.style.color = '#000000';
  host.style.overflow = 'visible';
  host.style.pointerEvents = 'none';
  host.style.boxSizing = 'border-box';
  host.style.margin = '0';
  host.style.padding = '0';
  host.style.opacity = '1';
  host.style.visibility = 'visible';

  // Nhúng style cưỡng chế tài liệu PDF in ra 100% đen trắng rõ nét, không bị ảnh hưởng bởi theme
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
      color: #000000 !important;
    }
    #pdf-isolated-render-host .pdf-report-page {
      background-color: #ffffff !important;
      color: #000000 !important;
      box-shadow: none !important;
    }
    /* Đảm bảo toàn bộ chữ có màu đen sắc nét */
    #pdf-isolated-render-host *:not(style) {
      color: #000000 !important;
    }
    #pdf-isolated-render-host .text-slate-400,
    #pdf-isolated-render-host .text-slate-500,
    #pdf-isolated-render-host .text-slate-600,
    #pdf-isolated-render-host .text-gray-400,
    #pdf-isolated-render-host .text-gray-500 {
      color: #334155 !important;
    }
    /* Thanh phân mục bảng: nền xám nhạt với chữ đen rõ ràng */
    #pdf-isolated-render-host .bg-slate-100,
    #pdf-isolated-render-host .bg-slate-200,
    #pdf-isolated-render-host .bg-gray-100,
    #pdf-isolated-render-host .bg-gray-200,
    #pdf-isolated-render-host thead {
      background-color: #f1f5f9 !important;
      color: #000000 !important;
      border: 1px solid #cbd5e1 !important;
    }
    #pdf-isolated-render-host .bg-slate-50,
    #pdf-isolated-render-host .bg-gray-50 {
      background-color: #f8fafc !important;
      color: #000000 !important;
    }
    /* Các khối card nổi bật */
    #pdf-isolated-render-host .bg-emerald-50,
    #pdf-isolated-render-host .bg-emerald-100,
    #pdf-isolated-render-host .bg-violet-50,
    #pdf-isolated-render-host .bg-violet-100,
    #pdf-isolated-render-host .bg-rose-50,
    #pdf-isolated-render-host .bg-rose-100,
    #pdf-isolated-render-host .bg-blue-50,
    #pdf-isolated-render-host .bg-blue-100,
    #pdf-isolated-render-host .bg-amber-50,
    #pdf-isolated-render-host .bg-amber-100 {
      background-color: #f8fafc !important;
      border: 1px solid #000000 !important;
      color: #000000 !important;
    }
    /* Đường kẻ bảng */
    #pdf-isolated-render-host table {
      border-color: #cbd5e1 !important;
    }
    #pdf-isolated-render-host th,
    #pdf-isolated-render-host td {
      border-color: #e2e8f0 !important;
      color: #000000 !important;
    }
    #pdf-isolated-render-host .border-t-2,
    #pdf-isolated-render-host .border-b-2 {
      border-color: #000000 !important;
    }
    #pdf-isolated-render-host hr,
    #pdf-isolated-render-host .border-b,
    #pdf-isolated-render-host .border-t {
      border-color: #cbd5e1 !important;
    }
    #pdf-isolated-render-host svg {
      stroke: #000000 !important;
      color: #000000 !important;
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

      const canvas = await html2canvas(clone, {
        scale: 2, // Độ phân giải 2x cho chữ và số liệu sắc nét chuẩn Retina
        useCORS: true,
        allowTaint: false, // Ngăn chặn tainted canvas làm lỗi khi gọi toDataURL
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error(`Lỗi kết xuất canvas trang ${i + 1}`);
      }

      // Chuyển đổi toàn bộ pixel trên canvas sang đen trắng / grayscale thuần túy theo chuẩn ITU-R BT.601
      try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let p = 0; p < data.length; p += 4) {
            const gray = Math.round(0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]);
            data[p] = gray;
            data[p + 1] = gray;
            data[p + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }
      } catch (canvasErr) {
        console.warn('Canvas B&W post-processing:', canvasErr);
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

    // Tạo blob trước để đảm bảo có sẵn file ngay cả khi trình duyệt sandbox chặn phương thức download ngầm
    const pdfBlob = pdf.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    // Kích hoạt download an toàn: thử pdf.save() trước, nếu thất bại (do iframe/sandbox) thì fallback thẻ <a>
    let savedSuccessfully = false;
    try {
      pdf.save(finalFileName);
      savedSuccessfully = true;
    } catch (saveError) {
      console.warn('pdf.save() gặp lỗi, kích hoạt phương thức tải dự phòng:', saveError);
    }

    if (!savedSuccessfully) {
      try {
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfBlobUrl;
        downloadLink.download = finalFileName;
        downloadLink.target = '_blank';
        downloadLink.rel = 'noopener noreferrer';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (document.body.contains(downloadLink)) {
            document.body.removeChild(downloadLink);
          }
        }, 4000);
      } catch (linkError) {
        console.warn('Fallback download link gặp lỗi:', linkError);
      }
    }

    // Tự động thu hồi URL blob sau 60 giây để tránh rò rỉ bộ nhớ
    setTimeout(() => {
      try {
        URL.revokeObjectURL(pdfBlobUrl);
      } catch {
        // ignore
      }
    }, 60000);

    return {
      blob: pdfBlob,
      blobUrl: pdfBlobUrl,
      fileName: finalFileName,
    };
  } finally {
    // Luôn dọn dẹp sạch sẽ khung render tạm
    if (document.body.contains(host)) {
      document.body.removeChild(host);
    }
  }
}
