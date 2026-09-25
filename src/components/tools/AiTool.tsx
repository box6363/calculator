import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  FileSpreadsheet,
  FileCode,
  Eye,
  EyeOff,
  Clipboard,
  Calculator,
  ChevronDown,
  ChevronUp,
  Delete
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

export type FileCategory = 'image' | 'pdf' | 'excel' | 'word' | 'text';

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  data?: string; // base64 data for image / pdf
  previewUrl?: string;
  extractedText?: string;
  details?: string;
}

interface QnAPair {
  id: string;
  timestamp: number;
  prompt: string;
  fileName?: string;
  fileCategory?: FileCategory;
  answer: string;
}

const DAILY_LIMIT = 3;
const STORAGE_KEY = 'ai_tool_daily_quota_v1';
const HISTORY_KEY = 'ai_tool_qna_history_v1';
const MAX_FILE_SIZE_MB = 1;

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const AiTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteToast, setPasteToast] = useState<string | null>(null);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);

  // Daily quota tracking
  const [usedCount, setUsedCount] = useState<number>(0);
  const [quotaDate, setQuotaDate] = useState<string>(getTodayString());

  // History tracking
  const [history, setHistory] = useState<QnAPair[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Virtual math keypad state
  const [showKeypad, setShowKeypad] = useState<boolean>(true);
  const [mobileKeypadTab, setMobileKeypadTab] = useState<'fx' | 'numbers'>('fx');
  const [showAdvancedSymbols, setShowAdvancedSymbols] = useState<boolean>(false);
  const [aiCalcMemory, setAiCalcMemory] = useState<number>(0);

  const handleAiCalcMemory = (action: 'MC' | 'MR' | 'M+' | 'M-') => {
    if (action === 'MC') {
      setAiCalcMemory(0);
    } else if (action === 'MR') {
      insertSymbol(aiCalcMemory.toString());
    } else if (action === 'M+') {
      const match = prompt.match(/(\d+(\.\d+)?)$/);
      const val = match ? parseFloat(match[1]) : 1;
      setAiCalcMemory((prev) => prev + val);
    } else if (action === 'M-') {
      const match = prompt.match(/(\d+(\.\d+)?)$/);
      const val = match ? parseFloat(match[1]) : 1;
      setAiCalcMemory((prev) => prev - val);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setPrompt((prev) => prev + symbol);
      return;
    }
    const start = textarea.selectionStart ?? prompt.length;
    const end = textarea.selectionEnd ?? prompt.length;
    const nextText = prompt.substring(0, start) + symbol + prompt.substring(end);
    setPrompt(nextText);

    setTimeout(() => {
      textarea.focus();
      let newCursor = start + symbol.length;
      if (symbol.includes('()')) {
        newCursor = start + symbol.indexOf('()') + 1;
      } else if (symbol.includes('{}')) {
        newCursor = start + symbol.indexOf('{}') + 1;
      } else if (symbol.includes('|x|')) {
        newCursor = start + 2;
      }
      textarea.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleBackspace = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setPrompt((prev) => prev.slice(0, -1));
      return;
    }
    const start = textarea.selectionStart ?? prompt.length;
    const end = textarea.selectionEnd ?? prompt.length;
    if (start !== end) {
      const nextText = prompt.substring(0, start) + prompt.substring(end);
      setPrompt(nextText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start);
      }, 10);
    } else if (start > 0) {
      const nextText = prompt.substring(0, start - 1) + prompt.substring(end);
      setPrompt(nextText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start - 1, start - 1);
      }, 10);
    }
  };

  // Initialize quota from localStorage
  useEffect(() => {
    const today = getTodayString();
    setQuotaDate(today);

    try {
      const rawQuota = localStorage.getItem(STORAGE_KEY);
      if (rawQuota) {
        const parsed = JSON.parse(rawQuota);
        if (parsed.date === today) {
          setUsedCount(parsed.count || 0);
        } else {
          // New day, reset quota
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
          setUsedCount(0);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        setUsedCount(0);
      }

      const rawHistory = localStorage.getItem(HISTORY_KEY);
      if (rawHistory) {
        const parsedHistory = JSON.parse(rawHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (e) {
      console.error('Error reading storage:', e);
    }
  }, []);

  const remainingQuota = Math.max(0, DAILY_LIMIT - usedCount);

  // Universal File Processor: Images, PDF, Excel (.xlsx, .xls), Word (.docx, .doc), CSV, TXT
  const processFile = async (file: File) => {
    setError(null);
    setParsingFile(true);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Dung lượng tệp quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn tệp nhỏ hơn ${MAX_FILE_SIZE_MB}MB.`);
      setParsingFile(false);
      return;
    }

    const fileNameLower = file.name.toLowerCase();
    const ext = fileNameLower.split('.').pop() || '';
    const mime = file.type.toLowerCase();

    try {
      // 1. Image Files
      if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) {
        let normalizedMime = mime;
        if (!normalizedMime || normalizedMime === 'image/jpg') {
          normalizedMime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : 'image/png';
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setAttachedFile({
              name: file.name,
              size: file.size,
              type: normalizedMime,
              category: 'image',
              data: result,
              previewUrl: result,
              details: 'Hình ảnh bài tập / Đồ thị'
            });
            setParsingFile(false);
          }
        };
        reader.onerror = () => {
          setError('Không thể đọc tệp ảnh đã chọn.');
          setParsingFile(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // 2. PDF Files
      if (mime === 'application/pdf' || ext === 'pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setAttachedFile({
              name: file.name,
              size: file.size,
              type: 'application/pdf',
              category: 'pdf',
              data: result,
              details: 'Tài liệu PDF đề thi / Báo cáo'
            });
            setParsingFile(false);
          }
        };
        reader.onerror = () => {
          setError('Không thể đọc tệp PDF.');
          setParsingFile(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // 3. Excel Spreadsheets (.xlsx, .xls, .csv)
      if (['xlsx', 'xls', 'csv'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel') || mime === 'text/csv') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        let extracted = `[Tài liệu bảng tính Excel: ${file.name}]\n`;
        let totalRows = 0;
        
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          const rowCount = csvText.trim().split('\n').filter(Boolean).length;
          totalRows += rowCount;
          extracted += `\n--- Bảng tính: "${sheetName}" (${rowCount} hàng dữ liệu) ---\n${csvText}\n`;
        }

        setAttachedFile({
          name: file.name,
          size: file.size,
          type: mime || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          category: 'excel',
          extractedText: extracted,
          details: `${workbook.SheetNames.length} trang tính (${workbook.SheetNames.join(', ')}), ~${totalRows} dòng dữ liệu`
        });
        setParsingFile(false);
        return;
      }

      // 4. Word Documents (.docx, .doc)
      if (['docx', 'doc'].includes(ext) || mime.includes('word') || mime.includes('msword')) {
        const buffer = await file.arrayBuffer();
        
        if (ext === 'docx') {
          try {
            const result = await mammoth.extractRawText({ arrayBuffer: buffer });
            const text = result.value.trim();
            const wordCount = text ? text.split(/\s+/).length : 0;

            setAttachedFile({
              name: file.name,
              size: file.size,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              category: 'word',
              extractedText: text,
              details: `Tài liệu Word DOCX (~${wordCount.toLocaleString()} từ)`
            });
            setParsingFile(false);
            return;
          } catch (mErr) {
            console.warn('Mammoth parse error:', mErr);
          }
        }

        // Fallback for .doc or if mammoth had issues
        try {
          // Attempt raw text decode
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const rawStr = decoder.decode(buffer);
          // Filter readable text strings
          const cleanText = rawStr.replace(/[^\x20-\x7E\u00A0-\uFFFF\r\n\t]/g, ' ').replace(/\s{2,}/g, ' ').trim();
          
          if (cleanText.length > 50) {
            setAttachedFile({
              name: file.name,
              size: file.size,
              type: 'application/msword',
              category: 'word',
              extractedText: cleanText.slice(0, 50000),
              details: `Tài liệu Word (${ext.toUpperCase()})`
            });
            setParsingFile(false);
            return;
          }
        } catch (docErr) {
          console.error('Doc parse error:', docErr);
        }

        setError('Định dạng tệp .doc cũ có thể bị mã hóa đặc biệt. Hãy lưu lại dưới dạng .docx hoặc .pdf để AI đọc văn bản chuẩn xác nhất.');
        setParsingFile(false);
        return;
      }

      // 5. Plain Text / Markdown / Code (.txt, .md, .json)
      if (['txt', 'md', 'json'].includes(ext) || mime.startsWith('text/')) {
        const textContent = await file.text();
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: mime || 'text/plain',
          category: 'text',
          extractedText: textContent,
          details: `Tệp văn bản (~${textContent.length} ký tự)`
        });
        setParsingFile(false);
        return;
      }

      // Unsupported format
      setError('Định dạng tệp chưa được hỗ trợ. Vui lòng tải ảnh (PNG, JPG, WebP), file PDF, bảng tính Excel (XLSX, XLS), tài liệu Word (DOCX) hoặc tệp văn bản.');
      setParsingFile(false);

    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(`Lỗi khi đọc tệp: ${err.message || 'Không thể trích xuất nội dung.'}`);
      setParsingFile(false);
    }
  };

  // Clipboard Paste Handler (Ctrl+V anywhere on input or container)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          processFile(file);
          setPasteToast('Đã dán ảnh từ bộ nhớ tạm (Clipboard)!');
          setTimeout(() => setPasteToast(null), 3500);
          return;
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setShowExtractedPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit request to Gemini
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!prompt.trim() && !attachedFile) {
      setError('Vui lòng nhập câu hỏi hoặc tải lên hình ảnh / tệp tài liệu.');
      return;
    }

    const today = getTodayString();
    let currentUsed = usedCount;
    if (quotaDate !== today) {
      currentUsed = 0;
      setQuotaDate(today);
    }

    if (currentUsed >= DAILY_LIMIT) {
      setError('Bạn đã sử dụng hết 3 lượt hỏi miễn phí hôm nay. Hạn mức sẽ tự động được làm mới vào 00:00 ngày mai.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const defaultPrompt = attachedFile?.category === 'image'
        ? 'Hãy trích xuất chính xác 100% đề bài từ hình ảnh, sau đó giải chi tiết từng bước theo phương pháp sư phạm chuẩn SGK và kết luận đáp số rõ ràng.'
        : 'Hãy nhận diện đề bài trong tệp đính kèm và giải chi tiết từng bước theo phương pháp sư phạm chuẩn mực (ưu tiên cách giải chuẩn SGK, có thể thêm cách giải nhanh/nhân tử và kết luận rõ ràng).';

      const payload: any = {
        prompt: prompt.trim() || defaultPrompt,
        toolName: 'AI Tool (Giải Toán & Xử Lý Tài Liệu)',
      };

      if (attachedFile) {
        payload.file = {
          name: attachedFile.name,
          mimeType: attachedFile.type,
          category: attachedFile.category,
          extractedText: attachedFile.extractedText,
          data: attachedFile.data
        };
      }

      const response = await fetch('/api/gemini/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi kết nối với AI.');
      }

      const answerText = data.answer;
      setCurrentAnswer(answerText);

      // Increment quota count
      const nextCount = currentUsed + 1;
      setUsedCount(nextCount);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: nextCount }));

      // Save to history
      const newQnA: QnAPair = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt: prompt.trim() || (attachedFile ? `[Tệp: ${attachedFile.name}]` : 'Câu hỏi'),
        fileName: attachedFile?.name,
        fileCategory: attachedFile?.category,
        answer: answerText
      };

      const updatedHistory = [newQnA, ...history].slice(0, 15);
      setHistory(updatedHistory);
      setActiveHistoryId(newQnA.id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

      // Scroll to result on mobile
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      console.error('Submit error:', err);
      let errorMsg = err.message || 'Không thể lấy câu trả lời từ AI. Vui lòng kiểm tra lại kết nối.';
      
      // Parse out raw JSON strings if thrown
      if (typeof errorMsg === 'string' && (errorMsg.includes('{"error":') || errorMsg.includes('"status":'))) {
        try {
          const match = errorMsg.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.error?.message) {
              errorMsg = parsed.error.message;
            }
          }
        } catch (_) {}
      }

      if (errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE')) {
        errorMsg = 'Hệ thống AI hiện đang trong thời gian cao điểm (Google 503 High Demand). Vui lòng đợi vài giây và bấm "Thử lại".';
      } else if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        errorMsg = 'Đã đạt giới hạn tần suất yêu cầu AI tạm thời. Vui lòng thử lại sau giây lát.';
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentAnswer) return;
    navigator.clipboard.writeText(currentAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectHistory = (item: QnAPair) => {
    setActiveHistoryId(item.id);
    setCurrentAnswer(item.answer);
    setPrompt(item.prompt);
    setError(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleClearCurrent = () => {
    setPrompt('');
    setAttachedFile(null);
    setShowExtractedPreview(false);
    setCurrentAnswer(null);
    setActiveHistoryId(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const samplePrompts = [
    'Giải phương trình bậc 3: x³ - 3x² + 4 = 0',
    'Tìm giá trị lớn nhất và nhỏ nhất của hàm số y = x⁴ - 2x² + 3',
    'Tính tích phân: ∫ (2x + 1) / (x² + x + 1) dx',
    'Đọc đề bài và giải chi tiết từng bước bài toán trong ảnh đính kèm',
    'Phân tích bảng số liệu Excel và tính tổng doanh thu trung bình',
    'Tóm tắt các ý chính và câu hỏi kiểm tra trong tài liệu Word này'
  ];

  // Render file icon by category
  const renderFileIcon = (category: FileCategory) => {
    switch (category) {
      case 'excel':
        return (
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col items-center justify-center text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">XLSX</span>
          </div>
        );
      case 'word':
        return (
          <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/40 flex flex-col items-center justify-center text-blue-400 shrink-0">
            <FileText className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">DOCX</span>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/40 flex flex-col items-center justify-center text-rose-400 shrink-0">
            <FileText className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">PDF</span>
          </div>
        );
      case 'text':
        return (
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex flex-col items-center justify-center text-slate-300 shrink-0">
            <FileCode className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">TXT</span>
          </div>
        );
      case 'image':
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-500/40 flex flex-col items-center justify-center text-violet-400 shrink-0">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">IMG</span>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full space-y-6 relative"
      onPaste={handlePaste}
    >
      {/* Clipboard Toast */}
      {pasteToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-bounce border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{pasteToast}</span>
        </div>
      )}

      {/* Top Banner & Quota Indicator */}
      <div className="bg-gradient-to-r from-violet-50 via-white to-indigo-50 dark:from-violet-900/30 dark:via-slate-800 dark:to-indigo-900/30 border border-violet-200 dark:border-violet-500/30 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-600/10 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">AI Tool – Trợ Lý Giải Toán & Tài Liệu</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              </p>
            </div>
          </div>

          {/* Quota Badge & Progress */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 flex flex-col items-center sm:items-end min-w-[200px] shrink-0 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Hạn mức miễn phí:</span>
              <strong className={`font-bold ${remainingQuota > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {remainingQuota}/{DAILY_LIMIT} lượt hôm nay
              </strong>
            </div>
            
            {/* Visual Quota Pills */}
            <div className="flex items-center gap-1.5 w-full justify-center sm:justify-end">
              {[0, 1, 2].map((idx) => {
                const isUsed = idx < usedCount;
                return (
                  <div 
                    key={idx}
                    className={`h-2 flex-1 sm:w-10 rounded-full transition-all ${
                      isUsed 
                        ? 'bg-slate-200 dark:bg-slate-700' 
                        : 'bg-emerald-500 shadow-xs shadow-emerald-500/30'
                    }`}
                    title={isUsed ? 'Đã sử dụng' : 'Lượt khả dụng'}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Làm mới lúc 00:00 hàng ngày</span>
          </div>
        </div>

        {remainingQuota === 0 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              Bạn đã sử dụng hết <strong>3/3 lượt miễn phí</strong> hôm nay. Hãy quay lại vào ngày mai hoặc xem lại các lời giải trước đó trong mục lịch sử bên dưới!
            </span>
          </div>
        )}
      </div>

      {/* Main Interaction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Input Form & File Attachment */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            className={`bg-white dark:bg-[#161F36] border rounded-2xl p-5 shadow-xs dark:shadow-xl transition-all relative ${
              isDragOver ? 'border-violet-400 ring-4 ring-violet-500/20 bg-violet-50 dark:bg-violet-950/20' : 'border-slate-200 dark:border-slate-700/80'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag Overlay visual cue */}
            {isDragOver && (
              <div className="absolute inset-0 z-20 bg-violet-950/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-violet-400 pointer-events-none">
                <Upload className="w-12 h-12 text-violet-300 animate-bounce mb-2" />
                <h4 className="text-base font-bold text-white">Thả tệp vào đây ngay bây giờ</h4>
                <p className="text-xs text-violet-200 mt-1">
                  Hỗ trợ Ảnh, PDF, Excel (xlsx, xls, csv) và Word (docx, doc)
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                    Nội dung câu hỏi hoặc bài toán cần giải:
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    <Clipboard className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                    <span>Hỗ trợ dán ảnh (Ctrl+V)</span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    id="ai-tool-prompt-input"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onPaste={handlePaste}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    placeholder="Nhập câu hỏi, phương trình toán học; hoặc Dán ảnh chụp màn hình bài tập (Ctrl+V); hoặc kéo thả file Ảnh, PDF, Excel, Word vào đây..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[var(--app-bg,#141526)] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all resize-y"
                    disabled={loading || remainingQuota <= 0}
                  />
                </div>

                {/* Scientific & Mathematical Virtual Input Keypad */}
                <div className="mt-2.5 bg-white dark:bg-[#060813] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-3 sm:p-4 space-y-3 shadow-md dark:shadow-2xl text-slate-800 dark:text-slate-100 transition-colors">
                  {/* Top Bar: Title & Toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Bàn phím hàm khoa học & toán học
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                          Đầy đủ sin, cos, tan, log, ln, căn, lũy thừa, số và phép tính
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mobile tab switcher */}
                      <div className="md:hidden flex items-center p-0.5 bg-slate-100 dark:bg-[#101728] rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setMobileKeypadTab('fx')}
                          className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            mobileKeypadTab === 'fx' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Hàm fx
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileKeypadTab('numbers')}
                          className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            mobileKeypadTab === 'numbers' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Số & Phép tính
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowKeypad(!showKeypad)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#101728] dark:hover:bg-[#18223c] text-slate-700 dark:text-white border border-slate-300/80 dark:border-slate-700/60 flex items-center gap-1.5 font-medium transition-colors cursor-pointer shadow-xs"
                        title={showKeypad ? 'Thu gọn bàn phím' : 'Hiện bàn phím'}
                      >
                        {showKeypad ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{showKeypad ? 'Thu gọn' : 'Hiện phím'}</span>
                      </button>
                    </div>
                  </div>

                  {showKeypad && (
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800/90">
                      {/* Dual Panels Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-start">
                        {/* Panel 1: HÀM KHOA HỌC */}
                        <div className={`space-y-2 ${mobileKeypadTab === 'fx' ? 'block' : 'hidden md:block'}`}>
                          <div className="flex items-center justify-between px-1 h-7">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                              Hàm khoa học
                            </span>
                          </div>

                          {/* 5x5 Scientific Functions Grid inside rounded card box */}
                          <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-[#080b18] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs dark:shadow-inner">
                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                              {/* Row 1 */}
                              <button type="button" onClick={() => insertSymbol('sin()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">sin</button>
                              <button type="button" onClick={() => insertSymbol('cos()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">cos</button>
                              <button type="button" onClick={() => insertSymbol('tan()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">tan</button>
                              <button type="button" onClick={() => insertSymbol('π')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer font-serif">π</button>
                              <button type="button" onClick={() => insertSymbol('e')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer font-serif italic">e</button>

                              {/* Row 2 */}
                              <button type="button" onClick={() => insertSymbol('arcsin()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">sin⁻¹</button>
                              <button type="button" onClick={() => insertSymbol('arccos()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">cos⁻¹</button>
                              <button type="button" onClick={() => insertSymbol('arctan()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">tan⁻¹</button>
                              <button type="button" onClick={() => insertSymbol('ln()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">ln</button>
                              <button type="button" onClick={() => insertSymbol('log()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">log</button>

                              {/* Row 3 */}
                              <button type="button" onClick={() => insertSymbol('^')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">xʸ</button>
                              <button type="button" onClick={() => insertSymbol('^2')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">x²</button>
                              <button type="button" onClick={() => insertSymbol('^3')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">x³</button>
                              <button type="button" onClick={() => insertSymbol('e^')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">eˣ</button>
                              <button type="button" onClick={() => insertSymbol('10^')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">10ˣ</button>

                              {/* Row 4 */}
                              <button type="button" onClick={() => insertSymbol('√()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">√x</button>
                              <button type="button" onClick={() => insertSymbol('³√()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">³√x</button>
                              <button type="button" onClick={() => insertSymbol('root(y, x)')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">ʸ√x</button>
                              <button type="button" onClick={() => insertSymbol('1/()')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">1/x</button>
                              <button type="button" onClick={() => insertSymbol('!')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">n!</button>

                              {/* Row 5 */}
                              <button type="button" onClick={() => insertSymbol('(')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">(</button>
                              <button type="button" onClick={() => insertSymbol(')')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">)</button>
                              <button type="button" onClick={() => insertSymbol('Ans')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Kết quả trước">Ans</button>
                              <button type="button" onClick={() => insertSymbol('E')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Số mũ E">EXP</button>
                              <button type="button" onClick={() => insertSymbol(Math.floor(Math.random() * 100).toString())} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-semibold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Số ngẫu nhiên">RND</button>
                            </div>
                          </div>
                        </div>

                        {/* Panel 2: SỐ & PHÉP TÍNH */}
                        <div className={`space-y-2 ${mobileKeypadTab === 'numbers' ? 'block' : 'hidden md:block'}`}>
                          {/* Header + Variable buttons x, y, z (matches Panel 1's h-7 header) */}
                          <div className="flex items-center justify-between px-1 h-7">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                              Số & Phép tính
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => insertSymbol('x')}
                                className="px-2.5 py-0.5 rounded-lg border border-cyan-300 dark:border-cyan-700/70 bg-cyan-50 hover:bg-cyan-100 dark:bg-[#062432] dark:hover:bg-[#0a3347] text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs transition-colors cursor-pointer"
                              >
                                x
                              </button>
                              <button
                                type="button"
                                onClick={() => insertSymbol('y')}
                                className="px-2.5 py-0.5 rounded-lg border border-cyan-300 dark:border-cyan-700/70 bg-cyan-50 hover:bg-cyan-100 dark:bg-[#062432] dark:hover:bg-[#0a3347] text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs transition-colors cursor-pointer"
                              >
                                y
                              </button>
                              <button
                                type="button"
                                onClick={() => insertSymbol('z')}
                                className="px-2.5 py-0.5 rounded-lg border border-cyan-300 dark:border-cyan-700/70 bg-cyan-50 hover:bg-cyan-100 dark:bg-[#062432] dark:hover:bg-[#0a3347] text-cyan-700 dark:text-cyan-300 font-mono font-bold text-xs transition-colors cursor-pointer"
                              >
                                z
                              </button>
                            </div>
                          </div>

                          {/* 5x5 Numeric & Operators Grid - Exactly matching 5 rows of Panel 1 */}
                          <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-[#080b18] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs dark:shadow-inner">
                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                              {/* Row 1 (Aligns with sin, cos, tan, π, e) */}
                              <button type="button" onClick={() => handleAiCalcMemory('MC')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-slate-300 dark:border-slate-700/50 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Xóa bộ nhớ">MC</button>
                              <button type="button" onClick={() => handleAiCalcMemory('MR')} className={`h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 ${aiCalcMemory !== 0 ? 'text-violet-600 dark:text-violet-400 border-violet-400 dark:border-violet-500/50' : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/50'} shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer`} title={`Gọi bộ nhớ (M=${aiCalcMemory})`}>MR</button>
                              <button type="button" onClick={() => handleAiCalcMemory('M+')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-slate-300 dark:border-slate-700/50 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Cộng vào bộ nhớ">M+</button>
                              <button type="button" onClick={() => handleAiCalcMemory('M-')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-slate-300 dark:border-slate-700/50 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Trừ khỏi bộ nhớ">M-</button>
                              <button type="button" onClick={() => setPrompt('')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 border border-amber-300 shadow-2xs dark:bg-[#331c08] dark:hover:bg-[#46260a] dark:active:bg-[#281504] dark:text-amber-400 dark:border-amber-600/70 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Xóa toàn bộ">AC</button>

                              {/* Row 2 (Aligns with sin⁻¹, cos⁻¹, tan⁻¹, ln, log) */}
                              <button type="button" onClick={() => insertSymbol('7')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">7</button>
                              <button type="button" onClick={() => insertSymbol('8')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">8</button>
                              <button type="button" onClick={() => insertSymbol('9')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">9</button>
                              <button type="button" onClick={() => insertSymbol(' / ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 border border-purple-200 shadow-2xs dark:bg-[#1d1538] dark:hover:bg-[#2a1d52] dark:active:bg-[#16102c] dark:text-purple-300 dark:border-purple-800/60 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">÷</button>
                              <button type="button" onClick={handleBackspace} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-rose-100 hover:bg-rose-200 active:bg-rose-300 text-rose-700 border border-rose-300 shadow-2xs dark:bg-[#360e19] dark:hover:bg-[#481222] dark:active:bg-[#2a0912] dark:text-rose-400 dark:border-rose-700/70 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Xóa lùi (Backspace)">
                                <Delete className="w-5 h-5" />
                              </button>

                              {/* Row 3 (Aligns with xʸ, x², x³, eˣ, 10ˣ) */}
                              <button type="button" onClick={() => insertSymbol('4')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">4</button>
                              <button type="button" onClick={() => insertSymbol('5')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">5</button>
                              <button type="button" onClick={() => insertSymbol('6')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">6</button>
                              <button type="button" onClick={() => insertSymbol(' * ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 border border-purple-200 shadow-2xs dark:bg-[#1d1538] dark:hover:bg-[#2a1d52] dark:active:bg-[#16102c] dark:text-purple-300 dark:border-purple-800/60 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">×</button>
                              <button type="button" onClick={() => insertSymbol('%')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 border border-purple-200 shadow-2xs dark:bg-[#1d1538] dark:hover:bg-[#2a1d52] dark:active:bg-[#16102c] dark:text-purple-300 dark:border-purple-800/60 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer" title="Phần trăm">%</button>

                              {/* Row 4 (Aligns with √x, ³√x, ʸ√x, 1/x, n!) */}
                              <button type="button" onClick={() => insertSymbol('1')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">1</button>
                              <button type="button" onClick={() => insertSymbol('2')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">2</button>
                              <button type="button" onClick={() => insertSymbol('3')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">3</button>
                              <button type="button" onClick={() => insertSymbol(' - ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 border border-purple-200 shadow-2xs dark:bg-[#1d1538] dark:hover:bg-[#2a1d52] dark:active:bg-[#16102c] dark:text-purple-300 dark:border-purple-800/60 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">-</button>
                              <button type="button" onClick={() => insertSymbol(' + ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 border border-purple-200 shadow-2xs dark:bg-[#1d1538] dark:hover:bg-[#2a1d52] dark:active:bg-[#16102c] dark:text-purple-300 dark:border-purple-800/60 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">+</button>

                              {/* Row 5 (Exactly aligned on the same horizontal row with: ( ) Ans EXP RND) */}
                              <button type="button" onClick={() => insertSymbol('0')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">0</button>
                              <button type="button" onClick={() => insertSymbol('.')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-white dark:border-slate-700/50 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">.</button>
                              <button type="button" onClick={() => insertSymbol(' = ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 text-emerald-800 border border-emerald-300 shadow-2xs dark:bg-[#062e1e] dark:hover:bg-[#093e29] dark:active:bg-[#042014] dark:text-emerald-400 dark:border-emerald-600/70 dark:shadow-xs font-bold text-base sm:text-lg active:scale-95 transition-all cursor-pointer">=</button>
                              <button type="button" onClick={() => insertSymbol('±')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-slate-300 dark:border-slate-700/50 dark:shadow-xs font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer">±</button>
                              <button type="button" onClick={() => insertSymbol(' ')} className="h-10 sm:h-11 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200/90 shadow-2xs dark:bg-[#101728] dark:hover:bg-[#18223c] dark:active:bg-[#0c1220] dark:text-slate-300 dark:border-slate-700/50 dark:shadow-xs font-medium text-xs sm:text-sm active:scale-95 transition-all cursor-pointer" title="Dấu cách">Space</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Calculus & Symbols Expandable Drawer */}
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800/90">
                        <div className="flex items-center justify-between mb-1.5">
                          <button
                            type="button"
                            onClick={() => setShowAdvancedSymbols(!showAdvancedSymbols)}
                            className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-[10px]">
                              {showAdvancedSymbols ? '▼' : '▶'}
                            </span>
                            <span>{showAdvancedSymbols ? 'Ẩn ký hiệu nâng cao (Giải tích, Hy Lạp)' : 'Mở rộng ký hiệu nâng cao (Giải tích ∫, d/dx, lim, Hy Lạp α, β, Δ...)'}</span>
                          </button>
                        </div>

                        {showAdvancedSymbols && (
                          <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-[#080b18] rounded-2xl border border-slate-200 dark:border-slate-800/90 space-y-2.5">
                            <div className="flex flex-wrap gap-1 font-mono text-xs">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 self-center font-sans mr-1">Giải tích:</span>
                              {[
                                { label: '∫', val: '∫ ' },
                                { label: '∫_a^b', val: '∫_{a}^{b} ' },
                                { label: 'dx', val: ' dx' },
                                { label: 'dy', val: ' dy' },
                                { label: 'd/dx', val: 'd/dx ' },
                                { label: 'lim', val: 'lim_{x→} ' },
                                { label: 'x→0', val: 'x→0' },
                                { label: 'x→∞', val: 'x→∞' },
                                { label: '∑', val: '∑ ' },
                                { label: '∞', val: '∞' },
                                { label: 'y\'', val: "y'" },
                                { label: 'f\'(x)', val: "f'(x)" },
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => insertSymbol(item.val)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 dark:bg-[#101728] dark:hover:bg-[#18223c] dark:text-slate-200 dark:border-slate-700/50 rounded-xl font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-1 font-mono text-xs pt-1.5 border-t border-slate-200 dark:border-slate-800">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 self-center font-sans mr-1">Hy Lạp & Logic:</span>
                              {[
                                { label: 'α', val: 'α' },
                                { label: 'β', val: 'β' },
                                { label: 'γ', val: 'γ' },
                                { label: 'θ', val: 'θ' },
                                { label: 'Δ', val: 'Δ' },
                                { label: 'Ω', val: 'Ω' },
                                { label: '⇒', val: ' ⇒ ' },
                                { label: '⇔', val: ' ⇔ ' },
                                { label: '∈', val: ' ∈ ' },
                                { label: '∉', val: ' ∉ ' },
                                { label: '≤', val: ' ≤ ' },
                                { label: '≥', val: ' ≥ ' },
                                { label: '≠', val: ' ≠ ' },
                                { label: '≈', val: ' ≈ ' },
                                { label: '⊥', val: ' ⊥ ' },
                                { label: '∥', val: ' ∥ ' },
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => insertSymbol(item.val)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 dark:bg-[#101728] dark:hover:bg-[#18223c] dark:text-slate-200 dark:border-slate-700/50 rounded-xl font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Attachment Dropzone & Paste Zone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-200">
                    Tệp đính kèm (Ảnh, PDF, Excel, Word):
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Tối đa {MAX_FILE_SIZE_MB}MB</span>
                </div>

                {parsingFile ? (
                  <div className="border-2 border-dashed border-violet-500/50 rounded-xl p-5 text-center bg-slate-50 dark:bg-[var(--app-bg,#141526)] flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-600 dark:text-violet-400" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Đang đọc và phân tích cấu trúc tệp dữ liệu...</p>
                  </div>
                ) : !attachedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!loading && remainingQuota > 0) {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                        : 'border-slate-300 dark:border-slate-700 hover:border-violet-500/50 bg-slate-50 hover:bg-slate-100 dark:bg-[var(--app-bg,#141526)]/60 dark:hover:bg-[var(--app-bg,#141526)]'
                    } ${remainingQuota <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.xlsx,.xls,.docx,.doc,.csv,.txt,image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading || remainingQuota <= 0}
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="p-2.5 rounded-full bg-violet-100 dark:bg-violet-600/15 text-violet-600 dark:text-violet-400">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                        Kéo thả file vào đây, <span className="text-violet-600 dark:text-violet-400 underline">chọn từ thiết bị</span>, hoặc <span className="text-emerald-600 dark:text-emerald-400 font-semibold">dán ảnh (Ctrl+V)</span>
                      </p>
                      
                      {/* Supported file pills */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-500/30 text-[10px] text-violet-700 dark:text-violet-300 font-medium">
                          Ảnh PNG/JPG/WebP
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-[10px] text-rose-700 dark:text-rose-300 font-medium">
                          PDF
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                          Excel (.xlsx, .xls)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                          Word (.docx, .doc)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-slate-50 dark:bg-[var(--app-bg,#141526)] border border-violet-200 dark:border-violet-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {attachedFile.previewUrl ? (
                          <img 
                            src={attachedFile.previewUrl} 
                            alt="Đính kèm" 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0" 
                          />
                        ) : (
                          renderFileIcon(attachedFile.category)
                        )}
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {attachedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {(attachedFile.size / 1024).toFixed(0)} KB {attachedFile.details ? `• ${attachedFile.details}` : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {attachedFile.extractedText && (
                          <button
                            type="button"
                            onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Xem trước dữ liệu đã trích xuất"
                          >
                            {showExtractedPreview ? <EyeOff className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" /> : <Eye className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
                            <span className="hidden sm:inline">{showExtractedPreview ? 'Đóng' : 'Xem nội dung'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          disabled={loading}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-colors"
                          title="Gỡ tệp này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Extracted text preview drawer */}
                    {showExtractedPreview && attachedFile.extractedText && (
                      <div className="bg-slate-100 dark:bg-[#090D1A] border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-300 max-h-48 overflow-y-auto font-mono whitespace-pre-wrap">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Nội dung trích xuất gửi cho AI:</span>
                          <span>{attachedFile.extractedText.length.toLocaleString()} ký tự</span>
                        </div>
                        {attachedFile.extractedText.slice(0, 5000)}
                        {attachedFile.extractedText.length > 5000 && (
                          <p className="text-violet-600 dark:text-violet-400 mt-2 font-sans italic">... và {attachedFile.extractedText.length - 5000} ký tự tiếp theo</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sample Prompt Quick Chips (Placed below File Attachment) */}
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">Gợi ý câu hỏi mẫu:</span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePrompts.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(s)}
                      disabled={loading || remainingQuota <= 0}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-violet-900/40 text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-200 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-500/40 transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading || remainingQuota <= 0}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-600/30 dark:hover:bg-rose-600/50 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thử lại ngay</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  id="ai-tool-submit-btn"
                  disabled={loading || parsingFile || remainingQuota <= 0 || (!prompt.trim() && !attachedFile)}
                  className={`flex-1 py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs dark:shadow-lg transition-all ${
                    loading || parsingFile || remainingQuota <= 0 || (!prompt.trim() && !attachedFile)
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>AI đang giải bài toán & phân tích tài liệu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-violet-200" />
                      <span>Gửi câu hỏi cho AI ({remainingQuota} lượt còn lại)</span>
                    </>
                  )}
                </button>

                {(prompt || attachedFile || currentAnswer) && (
                  <button
                    type="button"
                    onClick={handleClearCurrent}
                    disabled={loading || parsingFile}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                    title="Làm mới câu hỏi"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Quick FAQ info */}
          <div className="bg-slate-50 dark:bg-[#161F36]/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-300 font-medium">
              <HelpCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Mẹo sử dụng AI Tool hiệu quả nhất:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><strong className="text-slate-900 dark:text-slate-200">Dán nhanh ảnh (Ctrl+V)</strong>: Chụp màn hình bằng phím PrintScreen hoặc Snipping Tool, nhấp vào khung và nhấn Ctrl+V để tải ảnh ngay lập tức.</li>
              <li><strong className="text-slate-900 dark:text-slate-200">Kéo thả tệp linh hoạt</strong>: Hỗ trợ tệp Ảnh, PDF, bảng tính Excel (.xlsx, .xls) và văn bản Word (.docx, .doc).</li>
              <li><strong className="text-slate-900 dark:text-slate-200">Đọc bảng biểu</strong>: Tự động trích xuất các trang tính Excel thành dạng bảng chuẩn giúp AI tính toán chính xác số liệu thống kê.</li>
            </ul>
          </div>
        </div>

        {/* Right column: Answer Display & Solution */}
        <div className="lg:col-span-5 space-y-4" ref={resultRef}>
          <div className="bg-white dark:bg-[#161F36] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs dark:shadow-xl flex flex-col h-full min-h-[440px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Kết Quả & Lời Giải Chi Tiết
                </h3>
              </div>

              {currentAnswer && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-600 animate-spin" />
                  <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 absolute inset-0 m-auto" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Gemini đang giải đáp và phân tích...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Hệ thống đang trích xuất dữ kiện từ tài liệu, tính toán các bước và xây dựng lời giải sư phạm hoàn chỉnh.
                </p>
              </div>
            ) : currentAnswer ? (
              <div className="flex-1 overflow-y-auto max-h-[600px] pr-1 space-y-3">
                <div className="markdown-body prose prose-slate dark:prose-invert max-w-none text-slate-900 dark:text-slate-200 text-sm leading-relaxed">
                  <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentAnswer}
                  </Markdown>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400 space-y-2">
                <div className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                  <BookOpen className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-300">Chưa có câu hỏi nào</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Hãy nhập bài toán, dán ảnh (Ctrl+V) hoặc kéo thả file Ảnh, PDF, Excel, Word vào khung bên trái và bấm gửi để nhận lời giải chi tiết.
                </p>
              </div>
            )}
          </div>

          {/* Question history list */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-[#161F36] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-xs dark:shadow-xl">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Lịch sử câu hỏi gần đây</span>
                <span className="text-[11px] text-slate-500 font-normal">{history.length} câu đã lưu</span>
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {history.map((item) => {
                  const isActive = activeHistoryId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectHistory(item)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-500/50 text-violet-950 dark:text-white'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-slate-900 dark:text-white">{item.prompt}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {item.fileName && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-violet-700 dark:text-violet-300 border border-slate-200 dark:border-slate-700 truncate max-w-[140px]">
                              📎 {item.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
