import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Check,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

// Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

// Unbiased Fisher-Yates Shuffle
function secureShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  // Bulk generated list
  const [bulkList, setBulkList] = useState<string[]>([]);

  const generate = () => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[lo]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charPool = '';
    const guaranteed: string[] = [];

    if (includeUpper) {
      charPool += upper;
      guaranteed.push(upper[secureRandomInt(upper.length)]);
    }
    if (includeLower) {
      charPool += lower;
      guaranteed.push(lower[secureRandomInt(lower.length)]);
    }
    if (includeNumbers) {
      charPool += numbers;
      guaranteed.push(numbers[secureRandomInt(numbers.length)]);
    }
    if (includeSymbols) {
      charPool += symbols;
      guaranteed.push(symbols[secureRandomInt(symbols.length)]);
    }

    if (charPool.length === 0) {
      setPassword('');
      return;
    }

    const genOne = () => {
      let pwd = [...guaranteed];
      for (let i = pwd.length; i < length; i++) {
        pwd.push(charPool[secureRandomInt(charPool.length)]);
      }
      // Cryptographically secure unbiased shuffle
      return secureShuffle(pwd).join('');
    };

    const main = genOne();
    setPassword(main);

    // Generate 4 bulk alternatives
    setBulkList(Array.from({ length: 4 }, () => genOne()));
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Calculate entropy and strength
  const { entropy, strengthLabel, strengthColor, strengthWidth } = (() => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;

    const bits = length * (poolSize > 0 ? Math.log2(poolSize) : 0);
    const roundedBits = Math.round(bits);

    if (roundedBits < 40) {
      return { entropy: roundedBits, strengthLabel: 'Yếu (Dễ bị bẻ khóa)', strengthColor: 'bg-rose-500', strengthWidth: '25%' };
    } else if (roundedBits < 60) {
      return { entropy: roundedBits, strengthLabel: 'Trung bình', strengthColor: 'bg-amber-500', strengthWidth: '50%' };
    } else if (roundedBits < 80) {
      return { entropy: roundedBits, strengthLabel: 'Mạnh (An toàn cao)', strengthColor: 'bg-blue-500', strengthWidth: '75%' };
    } else {
      return { entropy: roundedBits, strengthLabel: 'Cực kỳ an toàn (Chuẩn quân sự)', strengthColor: 'bg-emerald-500', strengthWidth: '100%' };
    }
  })();

  const handleCopy = (textToCopy?: string) => {
    const txt = textToCopy || password;
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="password-generator" className="p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <KeyRound className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Password Generator (Tạo Mật Khẩu An Toàn)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tạo mật khẩu ngẫu nhiên độ bảo mật cao, chống dò quét brute-force với đo lường entropy thời gian thực.
          </p>
        </div>

        <button
          onClick={() => handleCopy()}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép mật khẩu'}</span>
        </button>
      </div>

      {/* Main Password Showcase Banner */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 p-6 rounded-3xl border border-slate-200 dark:border-transparent text-slate-900 dark:text-white shadow-xs dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Mật khẩu tạo ngẫu nhiên
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={generate}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors"
              title="Tạo lại"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Display String */}
        <div className="flex items-center justify-between gap-2 p-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider break-all text-slate-900 dark:text-emerald-400 select-all">
            {showPassword ? password : '•'.repeat(password.length)}
          </span>
          <button
            type="button"
            onClick={() => handleCopy()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shrink-0 active:scale-95"
            title="Sao chép"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Strength Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Độ mạnh: <strong className="text-slate-900 dark:text-white">{strengthLabel}</strong></span>
            <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">{entropy} bits entropy</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${strengthColor} transition-all duration-300`}
              style={{ width: strengthWidth }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cấu hình ký tự</h3>

          {/* Length Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Độ dài mật khẩu:</span>
              <span className="text-emerald-600 font-mono text-sm">{length} ký tự</span>
            </div>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>6 (Ngắn)</span>
              <span>16 (Khuyến nghị)</span>
              <span>64 (Tối đa)</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
            <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="font-semibold text-slate-800">Chữ hoa (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="font-semibold text-slate-800">Chữ thường (a-z)</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="font-semibold text-slate-800">Chữ số (0-9)</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="font-semibold text-slate-800">Ký tự đặc biệt (!@#$)</span>
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-600 pt-1">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
            />
            <span>Loại bỏ ký tự dễ nhầm lẫn (ví dụ: i, l, 1, L, o, 0, O)</span>
          </label>
        </div>

        {/* Alternative Suggestions */}
        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Mật khẩu gợi ý bổ sung
          </span>
          <div className="space-y-2">
            {bulkList.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono"
              >
                <span className="text-slate-800 truncate pr-2">{pwd}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(pwd)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  title="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
