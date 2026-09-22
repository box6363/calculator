import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  Trash2,
  Check,
  Copy,
  Info,
  Delete,
  Calculator,
  Sigma,
  ChevronDown,
  X
} from 'lucide-react';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  time: string;
}

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Format calculation result up to 10 decimal digits without floating point artifacts
function formatCalcResult(val: number): string {
  if (Object.is(val, -0)) return '0';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';
  if (Math.abs(val) >= 1e12 || (Math.abs(val) < 1e-9 && val !== 0)) {
    return val.toExponential(8).replace(/\.?0+e/, 'e');
  }
  // Up to 10 decimal places, matching Google/Casio scientific format
  const fixed = Number(val.toFixed(10));
  return fixed.toString();
}

// Comprehensive scientific formula evaluator
function evaluateScientificFormula(
  expr: string, 
  angleMode: 'deg' | 'rad', 
  ansValue: number
): { value: number | null; error: string | null } {
  try {
    let clean = expr.trim();
    if (!clean) return { value: 0, error: null };

    // Auto-balance closing parentheses
    let openCount = (clean.match(/\(/g) || []).length;
    let closeCount = (clean.match(/\)/g) || []).length;
    while (openCount > closeCount) {
      clean += ')';
      closeCount++;
    }

    // Replace Ans with its numeric value
    clean = clean.replace(/Ans/gi, `(${ansValue})`);

    // Handle root(y, x) -> Math.pow(x, 1/y)
    clean = clean.replace(/root\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, 'Math.pow($2, 1/($1))');

    // Handle factorials: e.g. 5! or (3+2)!
    clean = clean.replace(/(\d+(\.\d+)?|\([^()]+\))!/g, (_, p1) => `factorial(${p1})`);

    // Handle Constants: π and e
    clean = clean.replace(/π/g, '(Math.PI)');
    // Replace e when standalone constant (not part of e.g. 1e5 or exp)
    clean = clean.replace(/(^|[^a-zA-Z0-9_.])e([^a-zA-Z0-9_.]|$)/g, '$1(Math.E)$2');

    // Handle power symbol ^ -> **
    clean = clean.replace(/\^/g, '**');

    // Handle Trig and ArcTrig according to angleMode (Deg vs Rad)
    if (angleMode === 'deg') {
      clean = clean.replace(/sin⁻¹\(/g, '((180/Math.PI)*Math.asin(');
      clean = clean.replace(/cos⁻¹\(/g, '((180/Math.PI)*Math.acos(');
      clean = clean.replace(/tan⁻¹\(/g, '((180/Math.PI)*Math.atan(');
      clean = clean.replace(/asin\(/g, '((180/Math.PI)*Math.asin(');
      clean = clean.replace(/acos\(/g, '((180/Math.PI)*Math.acos(');
      clean = clean.replace(/atan\(/g, '((180/Math.PI)*Math.atan(');

      clean = clean.replace(/sin\(/g, 'Math.sin((Math.PI/180)*');
      clean = clean.replace(/cos\(/g, 'Math.cos((Math.PI/180)*');
      clean = clean.replace(/tan\(/g, 'Math.tan((Math.PI/180)*');
    } else {
      clean = clean.replace(/sin⁻¹\(/g, 'Math.asin(');
      clean = clean.replace(/cos⁻¹\(/g, 'Math.acos(');
      clean = clean.replace(/tan⁻¹\(/g, 'Math.atan(');
      clean = clean.replace(/asin\(/g, 'Math.asin(');
      clean = clean.replace(/acos\(/g, 'Math.acos(');
      clean = clean.replace(/atan\(/g, 'Math.atan(');

      clean = clean.replace(/sin\(/g, 'Math.sin(');
      clean = clean.replace(/cos\(/g, 'Math.cos(');
      clean = clean.replace(/tan\(/g, 'Math.tan(');
    }

    // Handle Logarithms
    clean = clean.replace(/log\(/g, 'Math.log10(');
    clean = clean.replace(/ln\(/g, 'Math.log(');

    // Handle Roots
    clean = clean.replace(/cbrt\(/g, 'Math.cbrt(');
    clean = clean.replace(/³√\(/g, 'Math.cbrt(');
    clean = clean.replace(/sqrt\(/g, 'Math.sqrt(');
    clean = clean.replace(/√\(/g, 'Math.sqrt(');

    // Handle standard arithmetic symbols
    clean = clean.replace(/×/g, '*');
    clean = clean.replace(/÷/g, '/');

    // Handle scientific notation E: e.g. 2E3 -> (2e3)
    clean = clean.replace(/(\d+(\.\d+)?)E([+-]?\d+)/g, '($1e$3)');

    // Handle implicit multiplication: 2(3), (2)(3), 2Math, )Math
    clean = clean.replace(/(\d)\s*\(/g, '$1 * (');
    clean = clean.replace(/\)\s*(\d)/g, ') * $1');
    clean = clean.replace(/\)\s*\(/g, ') * (');
    clean = clean.replace(/(\d)\s*Math/g, '$1 * Math');
    clean = clean.replace(/\)\s*Math/g, ') * Math');

    // Handle Percentage: 50% -> (50*0.01)
    clean = clean.replace(/(\d+(\.\d+)?)%/g, '($1*0.01)');

    const scope = {
      Math,
      factorial,
    };

    // Safe scoped evaluation
    const fn = new Function('scope', `with(scope) { return (${clean}); }`);
    const evalResult = fn(scope);

    if (typeof evalResult !== 'number' || isNaN(evalResult)) {
      return { value: null, error: 'Lỗi cú pháp' };
    }
    if (!isFinite(evalResult)) {
      return { value: null, error: 'Không thể chia cho 0' };
    }

    return { value: evalResult, error: null };
  } catch (err) {
    return { value: null, error: 'Lỗi phép tính' };
  }
}

interface BasicCalculatorProps {
  initialMode?: 'standard' | 'scientific';
}

export const BasicCalculator: React.FC<BasicCalculatorProps> = ({ initialMode = 'standard' }) => {
  // Initial state: default is 0 with clean formula
  const [formula, setFormula] = useState<string>('');
  const [display, setDisplay] = useState<string>('0');
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [ansValue, setAnsValue] = useState<number>(0);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  // Modern mode toggle: 'standard' (4-column clean numpad) vs 'scientific' (full suite)
  const [calcMode, setCalcMode] = useState<'standard' | 'scientific'>(initialMode);
  // Dropdown menu state for collapsed functions (Cơ bản, Khoa học, Sao chép, Lịch sử)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // Mobile sub-tab for scientific mode: 'numbers' or 'scientific'
  const [mobileTab, setMobileTab] = useState<'numbers' | 'fx'>('numbers');

  // History log
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_scientific_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((item: HistoryItem) => item.id !== 'demo-log-2') : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('calc_scientific_history', JSON.stringify(history.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [history]);

  // Giá trị hiển thị chính trên màn hình: khi đang nhập (chưa ấn =) sẽ hiển thị trực tiếp biểu thức đang gõ (như 33+6) với cỡ chữ to; khi ấn = sẽ hiển thị kết quả tính
  const currentMainDisplay = hasEvaluated ? display : (formula || '0');

  // Main evaluation handler
  const handleEquals = useCallback(() => {
    if (!formula.trim()) return;

    // Auto-balance closing parentheses
    let balancedFormula = formula;
    const openCount = (balancedFormula.match(/\(/g) || []).length;
    const closeCount = (balancedFormula.match(/\)/g) || []).length;
    for (let i = 0; i < openCount - closeCount; i++) {
      balancedFormula += ')';
    }

    const { value, error } = evaluateScientificFormula(balancedFormula, angleUnit, ansValue);

    if (error) {
      setDisplay(error);
      setHasEvaluated(true);
      return;
    }

    if (value !== null) {
      const formatted = formatCalcResult(value);
      setDisplay(formatted);
      setFormula(balancedFormula);
      setAnsValue(value);
      setHasEvaluated(true);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: balancedFormula,
        result: formatted,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev.slice(0, 29)]);
    }
  }, [formula, angleUnit, ansValue]);

  // Insert token or append to formula
  const appendToken = useCallback((token: string, replaceIfFresh = false) => {
    if (hasEvaluated && replaceIfFresh) {
      setFormula(token);
      setHasEvaluated(false);
    } else {
      setFormula(prev => {
        if (prev === '0' && !['+', '-', '×', '/', '^', '.', '%'].includes(token)) {
          return token;
        }
        return prev + token;
      });
      setHasEvaluated(false);
    }
  }, [hasEvaluated]);

  // Number / Decimal inputs
  const handleDigit = useCallback((d: string) => {
    if (hasEvaluated) {
      setFormula(d);
      setHasEvaluated(false);
    } else {
      setFormula(prev => (prev === '0' ? d : prev + d));
    }
  }, [hasEvaluated]);

  // Binary operators (+, -, ×, /)
  const handleOperator = useCallback((op: string) => {
    if (hasEvaluated) {
      setFormula(display + op);
      setHasEvaluated(false);
    } else {
      setFormula(prev => {
        if (!prev) return '0' + op;
        if (/[+\-×/]$/.test(prev)) {
          return prev.slice(0, -1) + op;
        }
        return prev + op;
      });
    }
  }, [display, hasEvaluated]);

  // Function calls like sin(, cos(, tan(, log(, ln(, etc.
  const handleFunctionCall = useCallback((fnName: string) => {
    appendToken(`${fnName}(`, true);
  }, [appendToken]);

  // Constant inputs (π, e)
  const handleConstant = useCallback((c: string) => {
    appendToken(c, true);
  }, [appendToken]);

  // Power and root handlers
  const handlePower = useCallback((type: 'xy' | 'x3' | 'x2' | 'ex' | '10x' | 'yroot' | 'cbrt' | 'sqrt' | 'reciprocal' | 'factorial' | 'percent') => {
    switch (type) {
      case 'xy':
        appendToken('^');
        break;
      case 'x3':
        appendToken('^3');
        break;
      case 'x2':
        appendToken('^2');
        break;
      case 'ex':
        appendToken('e^(');
        break;
      case '10x':
        appendToken('10^(');
        break;
      case 'yroot':
        appendToken('^(1/');
        break;
      case 'cbrt':
        appendToken('³√(');
        break;
      case 'sqrt':
        appendToken('√(');
        break;
      case 'reciprocal':
        if (!formula || hasEvaluated) {
          setFormula('1/(');
        } else {
          setFormula(prev => `1/(${prev})`);
        }
        setHasEvaluated(false);
        break;
      case 'factorial':
        appendToken('!');
        break;
      case 'percent':
        appendToken('%');
        break;
    }
  }, [appendToken, formula, hasEvaluated]);

  // Backspace handler
  const handleBack = useCallback(() => {
    if (hasEvaluated) {
      setHasEvaluated(false);
    }
    if (!formula) return;
    const tokens = [
      'sin⁻¹(', 'cos⁻¹(', 'tan⁻¹(', 'asin(', 'acos(', 'atan(',
      'cbrt(', '³√(', 'sqrt(', '√(', '10^(', 'e^(', '^(1/', '1/(',
      'sin(', 'cos(', 'tan(', 'log(', 'ln(', 'Ans'
    ];

    for (const t of tokens) {
      if (formula.endsWith(t)) {
        setFormula(prev => prev.slice(0, -t.length));
        return;
      }
    }

    setFormula(prev => prev.slice(0, -1));
  }, [formula, hasEvaluated]);

  // Toggle plus/minus (±)
  const handleToggleSign = useCallback(() => {
    setFormula(prev => {
      if (!prev) return '-';
      const match = prev.match(/([+-]?\d+(\.\d+)?)$/);
      if (match) {
        const numStr = match[1];
        const toggled = numStr.startsWith('-') ? numStr.slice(1) : '-' + numStr;
        return prev.slice(0, -numStr.length) + toggled;
      }
      return prev.startsWith('-') ? prev.slice(1) : `-${prev}`;
    });
  }, []);

  // Random number RND
  const handleRND = useCallback(() => {
    const rnd = Math.random().toFixed(4);
    appendToken(rnd, true);
  }, [appendToken]);

  // EXP (Scientific notation)
  const handleEXP = useCallback(() => {
    appendToken('E');
  }, [appendToken]);

  // Memory handlers: M+, M-, MR, MC
  const handleMemoryAdd = useCallback(() => {
    const currentVal = parseFloat(display);
    if (!isNaN(currentVal)) {
      setMemory(prev => prev + currentVal);
    }
  }, [display]);

  const handleMemorySub = useCallback(() => {
    const currentVal = parseFloat(display);
    if (!isNaN(currentVal)) {
      setMemory(prev => prev - currentVal);
    }
  }, [display]);

  const handleMemoryRecall = useCallback(() => {
    appendToken(memory.toString(), false);
  }, [appendToken, memory]);

  const handleMemoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  // Clear (AC)
  const handleClearAll = useCallback(() => {
    setFormula('');
    setDisplay('0');
    setHasEvaluated(false);
  }, []);

  // Copy result
  const copyResult = () => {
    const textToCopy = hasEvaluated ? display : (formula || display || '0');
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDigit('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (e.key === '%') {
        e.preventDefault();
        handlePower('percent');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        appendToken(e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        appendToken('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClearAll();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleOperator, appendToken, handleEquals, handleBack, handleClearAll, handlePower]);

  // Dynamic responsive font sizing for calculator display on Mobile, Tablet, and Desktop
  const getDisplaySizeClass = (len: number) => {
    if (len > 18) return "text-lg sm:text-xl md:text-2xl lg:text-3xl";
    if (len > 14) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
    if (len > 10) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
    if (len > 7) return "text-3xl sm:text-4xl md:text-5xl lg:text-5xl";
    return "text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px]";
  };

  // Modern, tactile button styling definitions with device-adaptive typography
  const numBtnClass = "calc-num-btn h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white font-semibold text-xl sm:text-2xl md:text-2xl border border-slate-700/80 hover:border-slate-600 shadow-xs active:scale-[0.97] transition-all flex items-center justify-center select-none cursor-pointer touch-manipulation font-sans tabular-nums";
  const opBtnClass = "calc-op-btn h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-blue-600/25 hover:bg-blue-600/35 active:bg-blue-600/45 text-blue-400 hover:text-blue-300 font-bold text-2xl sm:text-3xl md:text-3xl border border-blue-500/40 shadow-xs active:scale-[0.97] transition-all flex items-center justify-center select-none cursor-pointer touch-manipulation font-sans";
  const equalsBtnClass = "calc-equals-btn h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-2xl sm:text-3xl md:text-3xl shadow-md shadow-blue-600/35 active:scale-[0.97] transition-all flex items-center justify-center select-none cursor-pointer touch-manipulation";
  const clearBtnClass = "calc-clear-btn h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-rose-600/25 hover:bg-rose-600/35 active:bg-rose-600/45 text-rose-400 hover:text-rose-300 font-bold text-base sm:text-lg md:text-lg border border-rose-500/40 shadow-xs active:scale-[0.97] transition-all flex items-center justify-center select-none cursor-pointer touch-manipulation";
  const actionBtnClass = "calc-action-btn h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-slate-800/70 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white font-bold text-base sm:text-lg md:text-lg border border-slate-700/70 shadow-xs active:scale-[0.97] transition-all flex items-center justify-center select-none cursor-pointer touch-manipulation";
  const sciBtnClass = "calc-sci-btn h-10.5 sm:h-11 md:h-11 lg:h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 active:bg-slate-600 text-slate-200 hover:text-white font-medium text-[13px] sm:text-[13.5px] md:text-[13.5px] lg:text-[15px] border border-slate-700/60 shadow-xs active:scale-[0.97] transition-all flex items-center justify-center select-none tracking-tight cursor-pointer touch-manipulation font-sans tabular-nums";
  const memBtnClass = "calc-mem-btn h-8 sm:h-8.5 px-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white text-xs sm:text-xs md:text-sm font-semibold border border-slate-700/70 transition-all flex items-center justify-center cursor-pointer touch-manipulation";

  return (
    <div className="w-full max-w-4xl mx-auto p-2.5 sm:p-5 lg:p-6 space-y-2.5 sm:space-y-4">
      
      {/* 1. Header Control Bar: Nút mũi tên xổ xuống tích hợp tất cả chức năng & Quick actions */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 pb-1">
          
          {/* Nút mũi tên chỉ xuống gom gọn các chức năng: Cơ bản, Khoa học, Sao chép, Lịch sử */}
          <button
            type="button"
            id="calc-tools-dropdown-btn"
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="calc-mode-btn inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border border-slate-700/80 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer select-none touch-manipulation"
            title="Nhấn để chọn chế độ (Cơ bản / Khoa học) hoặc mở Sao chép, Lịch sử"
          >
            <span className="flex items-center gap-1.5">
              {calcMode === 'scientific' ? (
                <Sigma className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{calcMode === 'scientific' ? 'Khoa học (fx)' : 'Cơ bản'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
          </button>

          {/* Quick Actions bên phải: Sao chép nhanh & Mở Lịch sử & Trạng thái DEG/RAD */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {calcMode === 'scientific' && (
              <button
                type="button"
                onClick={() => setAngleUnit(prev => prev === 'deg' ? 'rad' : 'deg')}
                className="calc-quick-btn px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer touch-manipulation"
                title="Đổi đơn vị góc: DEG (Độ) / RAD (Radian)"
              >
                {angleUnit.toUpperCase()}
              </button>
            )}

            <button
              type="button"
              onClick={copyResult}
              className="calc-quick-btn flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer touch-manipulation"
              title="Sao chép kết quả hiện tại"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Sao chép</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowHistory(prev => !prev)}
              className={`calc-quick-btn flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer border touch-manipulation ${
                showHistory 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xs' 
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/80'
              }`}
              title="Bật/tắt xem lịch sử phép tính"
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử {history.length > 0 ? `(${history.length})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Menu Popover xổ xuống khi bấm nút mũi tên */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs" 
              onClick={() => setIsMenuOpen(false)} 
            />

            <div 
              className="absolute top-full left-0 z-50 mt-1.5 w-72 sm:w-80 p-3.5 rounded-2xl border shadow-xl shadow-black/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: 'var(--app-surface, #1b1d33)',
                borderColor: 'var(--app-border, #272a47)',
                color: 'var(--app-text-primary)'
              }}
            >
              
              {/* Nhóm 1: Chế độ máy tính */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Chế độ máy tính
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode('standard');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      calcMode === 'standard'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Cơ bản</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode('scientific');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      calcMode === 'scientific'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Sigma className="w-3.5 h-3.5" />
                    <span>Khoa học (fx)</span>
                  </button>
                </div>
              </div>

              {/* Nhóm 2: Tiện ích & Lịch sử */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Tiện ích
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      copyResult();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sao chép</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowHistory(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    <span>Lịch sử ({history.length})</span>
                  </button>
                </div>
              </div>

              {/* Nhóm 3: Đơn vị góc (cho fx) */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Đơn vị góc:</span>
                <div className="inline-flex p-0.5 bg-slate-900/60 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAngleUnit('deg')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      angleUnit === 'deg' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    DEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setAngleUnit('rad')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                      angleUnit === 'rad' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    RAD
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* 2. Main Layout Grid: Máy tính chính & Bảng Lịch sử */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Khối Máy tính */}
        <div className={`${showHistory ? 'lg:col-span-8' : 'lg:col-span-12 max-w-3xl mx-auto w-full'} transition-all space-y-3 sm:space-y-4`}>
          
          {/* Màn hình số điện tử tương phản cao */}
          <div className="calc-display-screen bg-[#060a16] rounded-2xl p-3.5 sm:p-4 md:p-5 border border-slate-800 shadow-inner relative overflow-hidden space-y-1">
            
            {/* Thanh trạng thái đỉnh màn hình: Đơn vị góc, Bộ nhớ M */}
            <div className="flex items-center justify-between text-xs sm:text-sm min-h-[22px]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAngleUnit(prev => prev === 'deg' ? 'rad' : 'deg')}
                  className="calc-deg-badge px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] sm:text-xs font-sans font-bold hover:bg-slate-700 transition-colors cursor-pointer touch-manipulation"
                  title="Chạm để chuyển DEG / RAD"
                >
                  {angleUnit.toUpperCase()}
                </button>

                {memory !== 0 && (
                  <span className="calc-mem-indicator px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-sans font-bold tabular-nums">
                    M={memory}
                  </span>
                )}
              </div>
            </div>

            {/* Hàng biểu thức (hiển thị công thức kèm dấu = sau khi đã ấn tính) */}
            <div className="calc-display-formula min-h-[24px] sm:min-h-[28px] flex items-center justify-end text-slate-400 font-sans text-xs sm:text-sm md:text-base tracking-wide overflow-x-auto scrollbar-none select-text whitespace-nowrap tabular-nums">
              {hasEvaluated && formula ? (
                <span>{formula} =</span>
              ) : (
                <span className="calc-empty-formula text-slate-600 select-none">&nbsp;</span>
              )}
            </div>

            {/* Hàng hiển thị chính: số đang nhập như 33+6 hoặc kết quả tính với kích thước to nổi bật */}
            <div className="flex items-center justify-end min-h-[44px] sm:min-h-[52px] md:min-h-[60px]">
              <span className={`calc-display-result text-right font-sans font-bold tracking-tight text-white whitespace-nowrap overflow-x-auto scrollbar-none select-all tabular-nums transition-all ${getDisplaySizeClass(currentMainDisplay.length)}`}>
                {currentMainDisplay}
              </span>
            </div>

          </div>

          {/* 3. Bàn phím máy tính theo chế độ đã chọn */}
          {calcMode === 'standard' ? (
            
            /* ============================================================
               CHẾ ĐỘ CƠ BẢN: Bàn phím 4 cột tinh gọn, cân đối tỉ lệ vàng
               ============================================================ */
            <div className="max-w-md mx-auto space-y-2.5 pt-1">
              
              {/* Thanh nhớ siêu mỏng */}
              <div className="flex items-center justify-between gap-1.5 px-0.5">
                <button onClick={handleMemoryClear} className={memBtnClass} title="Xóa bộ nhớ">MC</button>
                <button onClick={handleMemoryRecall} className={memBtnClass} title="Gọi lại bộ nhớ">MR</button>
                <button onClick={handleMemoryAdd} className={memBtnClass} title="Cộng vào bộ nhớ">M+</button>
                <button onClick={handleMemorySub} className={memBtnClass} title="Trừ khỏi bộ nhớ">M-</button>
              </div>

              {/* Lưới 4 cột chuẩn */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {/* Hàng 1 */}
                <button onClick={handleClearAll} className={clearBtnClass}>AC</button>
                <button onClick={handleBack} className={actionBtnClass} title="Xóa ký tự cuối">
                  <Delete className="w-5 h-5" />
                </button>
                <button onClick={() => handlePower('percent')} className={actionBtnClass}>%</button>
                <button onClick={() => handleOperator('/')} className={opBtnClass}>÷</button>

                {/* Hàng 2 */}
                <button onClick={() => handleDigit('7')} className={numBtnClass}>7</button>
                <button onClick={() => handleDigit('8')} className={numBtnClass}>8</button>
                <button onClick={() => handleDigit('9')} className={numBtnClass}>9</button>
                <button onClick={() => handleOperator('*')} className={opBtnClass}>×</button>

                {/* Hàng 3 */}
                <button onClick={() => handleDigit('4')} className={numBtnClass}>4</button>
                <button onClick={() => handleDigit('5')} className={numBtnClass}>5</button>
                <button onClick={() => handleDigit('6')} className={numBtnClass}>6</button>
                <button onClick={() => handleOperator('-')} className={opBtnClass}>−</button>

                {/* Hàng 4 */}
                <button onClick={() => handleDigit('1')} className={numBtnClass}>1</button>
                <button onClick={() => handleDigit('2')} className={numBtnClass}>2</button>
                <button onClick={() => handleDigit('3')} className={numBtnClass}>3</button>
                <button onClick={() => handleOperator('+')} className={opBtnClass}>+</button>

                {/* Hàng 5 */}
                <button onClick={handleToggleSign} className={numBtnClass}>±</button>
                <button onClick={() => handleDigit('0')} className={numBtnClass}>0</button>
                <button onClick={() => handleDigit('.')} className={numBtnClass}>.</button>
                <button id="calc-equals-button" onClick={handleEquals} className={equalsBtnClass}>=</button>
              </div>
            </div>

          ) : (

            /* ============================================================
               CHẾ ĐỘ KHOA HỌC (fx): Cực kỳ trực quan, tối ưu cho Mobile & Desktop
               ============================================================ */
            <div className="space-y-2.5">
              
              {/* Tab con trên Mobile (< md): Tiết kiệm diện tích, chuyển tức thì */}
              <div className="md:hidden flex items-center p-1 bg-slate-800/70 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setMobileTab('numbers')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mobileTab === 'numbers' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔢 Bàn phím số & Phép tính
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('fx')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mobileTab === 'fx' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  𝑓(𝑥) Hàm khoa học
                </button>
              </div>

              {/* Lưới phân chia: Trên Desktop 2 cột song song / Trên Mobile hiển thị tab tương ứng */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start">
                
                {/* Panel Trái: Hàm khoa học & Hằng số (5 cột) */}
                <div className={`md:col-span-6 lg:col-span-6 space-y-1.5 ${mobileTab === 'fx' ? 'block' : 'hidden md:block'}`}>
                  
                  {/* Memory shortcuts gọn gàng */}
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-[12.5px] font-bold uppercase tracking-wider text-slate-400">
                      Hàm khoa học
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={handleMemoryClear} className={memBtnClass} title="Xóa bộ nhớ">MC</button>
                      <button onClick={handleMemoryRecall} className={memBtnClass} title="Gọi bộ nhớ">MR</button>
                      <button onClick={handleMemoryAdd} className={memBtnClass} title="Cộng bộ nhớ">M+</button>
                      <button onClick={handleMemorySub} className={memBtnClass} title="Trừ bộ nhớ">M-</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                    {/* Hàng 1: Lượng giác */}
                    <button onClick={() => handleFunctionCall('sin')} className={sciBtnClass}>sin</button>
                    <button onClick={() => handleFunctionCall('cos')} className={sciBtnClass}>cos</button>
                    <button onClick={() => handleFunctionCall('tan')} className={sciBtnClass}>tan</button>
                    <button onClick={() => handleConstant('π')} className={sciBtnClass}>π</button>
                    <button onClick={() => handleConstant('e')} className={sciBtnClass}>e</button>

                    {/* Hàng 2: Lượng giác ngược & Log */}
                    <button onClick={() => handleFunctionCall('sin⁻¹')} className={sciBtnClass}>sin⁻¹</button>
                    <button onClick={() => handleFunctionCall('cos⁻¹')} className={sciBtnClass}>cos⁻¹</button>
                    <button onClick={() => handleFunctionCall('tan⁻¹')} className={sciBtnClass}>tan⁻¹</button>
                    <button onClick={() => handleFunctionCall('ln')} className={sciBtnClass}>ln</button>
                    <button onClick={() => handleFunctionCall('log')} className={sciBtnClass}>log</button>

                    {/* Hàng 3: Lũy thừa */}
                    <button onClick={() => handlePower('xy')} className={sciBtnClass}>xʸ</button>
                    <button onClick={() => handlePower('x2')} className={sciBtnClass}>x²</button>
                    <button onClick={() => handlePower('x3')} className={sciBtnClass}>x³</button>
                    <button onClick={() => handlePower('ex')} className={sciBtnClass}>eˣ</button>
                    <button onClick={() => handlePower('10x')} className={sciBtnClass}>10ˣ</button>

                    {/* Hàng 4: Căn bậc & Giai thừa */}
                    <button onClick={() => handlePower('sqrt')} className={sciBtnClass}>√x</button>
                    <button onClick={() => handlePower('cbrt')} className={sciBtnClass}>³√x</button>
                    <button onClick={() => handlePower('yroot')} className={sciBtnClass}>ʸ√x</button>
                    <button onClick={() => handlePower('reciprocal')} className={sciBtnClass}>1/x</button>
                    <button onClick={() => handlePower('factorial')} className={sciBtnClass}>n!</button>

                    {/* Hàng 5: Ngoặc & Hằng số phụ */}
                    <button onClick={() => appendToken('(')} className={sciBtnClass}>(</button>
                    <button onClick={() => appendToken(')')} className={sciBtnClass}>)</button>
                    <button onClick={() => appendToken('Ans')} className={sciBtnClass} title="Kết quả trước">Ans</button>
                    <button onClick={handleEXP} className={sciBtnClass} title="Số mũ khoa học">EXP</button>
                    <button onClick={handleRND} className={sciBtnClass} title="Số ngẫu nhiên">RND</button>
                  </div>

                  {/* Mobile Action nhanh chuyển về bàn phím số */}
                  <div className="md:hidden pt-1">
                    <button
                      onClick={() => setMobileTab('numbers')}
                      className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-blue-500/30"
                    >
                      <span>Nhập số & phép tính tiếp theo</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                    </button>
                  </div>
                </div>

                {/* Panel Phải: Bàn phím số & Thao tác (4 cột) */}
                <div className={`md:col-span-6 lg:col-span-6 space-y-1.5 ${mobileTab === 'numbers' ? 'block' : 'hidden md:block'}`}>
                  
                  <div className="hidden md:flex items-center justify-between px-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Bàn phím số
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Enter (=), Esc (AC)
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {/* Hàng 1 */}
                    <button onClick={handleClearAll} className={clearBtnClass}>AC</button>
                    <button onClick={handleBack} className={actionBtnClass} title="Xóa ký tự cuối">
                      <Delete className="w-5 h-5" />
                    </button>
                    <button onClick={() => handlePower('percent')} className={actionBtnClass}>%</button>
                    <button onClick={() => handleOperator('/')} className={opBtnClass}>÷</button>

                    {/* Hàng 2 */}
                    <button onClick={() => handleDigit('7')} className={numBtnClass}>7</button>
                    <button onClick={() => handleDigit('8')} className={numBtnClass}>8</button>
                    <button onClick={() => handleDigit('9')} className={numBtnClass}>9</button>
                    <button onClick={() => handleOperator('*')} className={opBtnClass}>×</button>

                    {/* Hàng 3 */}
                    <button onClick={() => handleDigit('4')} className={numBtnClass}>4</button>
                    <button onClick={() => handleDigit('5')} className={numBtnClass}>5</button>
                    <button onClick={() => handleDigit('6')} className={numBtnClass}>6</button>
                    <button onClick={() => handleOperator('-')} className={opBtnClass}>−</button>

                    {/* Hàng 4 */}
                    <button onClick={() => handleDigit('1')} className={numBtnClass}>1</button>
                    <button onClick={() => handleDigit('2')} className={numBtnClass}>2</button>
                    <button onClick={() => handleDigit('3')} className={numBtnClass}>3</button>
                    <button onClick={() => handleOperator('+')} className={opBtnClass}>+</button>

                    {/* Hàng 5 */}
                    <button onClick={handleToggleSign} className={numBtnClass}>±</button>
                    <button onClick={() => handleDigit('0')} className={numBtnClass}>0</button>
                    <button onClick={() => handleDigit('.')} className={numBtnClass}>.</button>
                    <button id="calc-equals-button" onClick={handleEquals} className={equalsBtnClass}>=</button>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* Gợi ý phím tắt: Ẩn trên điện thoại, hiển thị thanh mảnh trên máy tính */}
          <div className="hidden sm:flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Phím tắt: <strong>0-9</strong>, <strong>+ - * /</strong>, <strong>Enter (=)</strong>, <strong>Backspace (Xóa)</strong>, <strong>Esc (AC)</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Enter = Bằng</span>
              <span>•</span>
              <span>Esc = Xóa hết</span>
            </div>
          </div>

        </div>

        {/* 4. History Panel: Trên Desktop (lg+) xuất hiện bên phải; Trên Mobile xuất hiện Modal/Drawer */}
        {showHistory && (
          <>
            {/* Mobile Sheet Backdrop & Drawer (< lg) */}
            <div 
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
              onClick={() => setShowHistory(false)}
            >
              <div 
                className="rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col p-4 shadow-2xl border animate-in slide-in-from-bottom-4 duration-200"
                style={{
                  backgroundColor: 'var(--app-surface, #1b1d33)',
                  borderColor: 'var(--app-border, #272a47)',
                  color: 'var(--app-text-primary)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <History className="w-4 h-4 text-blue-400" />
                    <span>Lịch sử phép tính ({history.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={() => setHistory([])}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                        title="Xóa toàn bộ lịch sử"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa hết</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowHistory(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Đóng lịch sử"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[50vh] scrollbar-thin">
                  {history.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-slate-500 text-xs text-center">
                      <History className="w-8 h-8 mb-2 opacity-40 text-slate-500" />
                      <span>Chưa có phép tính nào trong lịch sử.</span>
                    </div>
                  ) : (
                    history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setFormula(item.result);
                          setDisplay(item.result);
                          setHasEvaluated(true);
                          setShowHistory(false);
                        }}
                        className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 active:border-blue-500 cursor-pointer transition-all shadow-xs"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 font-sans tabular-nums">
                          <span className="truncate pr-2">{item.expression} =</span>
                          <span className="text-[10px]">{item.time}</span>
                        </div>
                        <div className="text-base font-bold text-white font-sans tabular-nums mt-0.5 flex items-center justify-between">
                          <span className="truncate">{item.result}</span>
                          <span className="text-[10px] text-blue-400 font-sans font-medium">
                            Chạm để dùng
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                  Chạm vào kết quả bất kỳ để nạp lại vào máy tính
                </div>
              </div>
            </div>

            {/* Desktop Side Panel (lg+) */}
            <div className="hidden lg:flex lg:col-span-4 bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 flex-col h-full min-h-[460px] animate-in fade-in duration-200 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>Lịch sử ({history.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                      title="Xóa toàn bộ lịch sử"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa hết</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Đóng bảng lịch sử"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[440px] scrollbar-thin">
                {history.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                    <History className="w-8 h-8 mb-2 opacity-40 text-slate-500" />
                    <span>Chưa có phép tính nào.</span>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setFormula(item.result);
                        setDisplay(item.result);
                        setHasEvaluated(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-blue-500/60 cursor-pointer transition-all shadow-xs group"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 font-sans tabular-nums">
                        <span className="truncate pr-2">{item.expression} =</span>
                        <span className="text-[10px]">{item.time}</span>
                      </div>
                      <div className="text-sm font-bold text-white font-sans tabular-nums mt-0.5 group-hover:text-blue-400 flex items-center justify-between">
                        <span className="truncate">{item.result}</span>
                        <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 font-sans transition-opacity ml-2 font-medium">
                          Dùng lại
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                Nhấn vào kết quả để nạp lại vào máy tính
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
};
