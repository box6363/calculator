/**
 * Safe and fast mathematical expression evaluator for f(x)
 * Supports:
 * - Basic arithmetic: +, -, *, /, %, ^ (power)
 * - Functions: sin, cos, tan, cot, asin, acos, atan, sqrt, abs, ln, log, exp
 * - Constants: pi, e
 * - Implicit multiplication: 2x -> 2*x, 3x^2 -> 3*x^2, 4(x+1) -> 4*(x+1), x(x-1) -> x*(x-1)
 * - Degree notation or custom power formats like x^2, x^3
 */

export function sanitizeExpression(expr: string, params?: Record<string, number>): string {
  let s = expr.trim();
  if (!s) return '0';

  // Strip leading y = , f(x) = , g(x) = , y1 = , y2 =
  s = s.replace(/^(y\d*|f\(x\)|g\(x\)|h\(x\))\s*=\s*/i, '');

  // Replace unicode powers
  s = s.replace(/²/g, '^2').replace(/³/g, '^3');

  // Replace constants
  s = s.replace(/π/g, `(${Math.PI})`);
  s = s.replace(/\bpi\b/gi, `(${Math.PI})`);
  s = s.replace(/\be\b/g, `(${Math.E})`);

  // Support parameter d or other variables in params
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      s = s.replace(regex, `(${val})`);
    }
  }

  // Handle dx or d*x if d is treated as parameter without params specified
  s = s.replace(/\bdx\b/gi, 'd*x');

  // Normalize implicit multiplications:
  // e.g. 2x, 2.5x -> 2*x
  s = s.replace(/(\d+(\.\d+)?)\s*([a-zA-Z(])/g, '$1*$3');

  // e.g. x( -> x*(
  s = s.replace(/([xX])\s*\(/g, '$1*(');

  // e.g. )x -> )*x
  s = s.replace(/\)\s*([xX])/g, ')*$1');

  // e.g. ) ( -> )*(
  s = s.replace(/\)\s*\(/g, ')*(');

  // e.g. )2 -> )*2
  s = s.replace(/\)\s*(\d)/g, ')*$1');

  return s;
}

/**
 * Tokenizes and evaluates an expression at variable x with optional parameters
 */
export function evaluateExpression(rawExpr: string, x: number, params?: Record<string, number>): number {
  const expr = sanitizeExpression(rawExpr, params);

  try {
    // Parser using recursive descent or shunting-yard
    return evaluateTokens(tokenize(expr, x, params));
  } catch {
    return NaN;
  }
}

type TokenType = 'num' | 'op' | 'func' | 'lparen' | 'rparen';

interface Token {
  type: TokenType;
  value: string | number;
}

function tokenize(expr: string, xVal: number, params?: Record<string, number>): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = expr.length;

  while (i < n) {
    const char = expr[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < n && /[0-9.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: 'num', value: parseFloat(numStr) });
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = '';
      while (i < n && /[a-zA-Z]/.test(expr[i])) {
        word += expr[i];
        i++;
      }
      const lower = word.toLowerCase();
      if (lower === 'x') {
        tokens.push({ type: 'num', value: xVal });
      } else if (params && params[lower] !== undefined) {
        tokens.push({ type: 'num', value: params[lower] });
      } else if (['sin', 'cos', 'tan', 'cot', 'sqrt', 'abs', 'ln', 'log', 'exp', 'asin', 'acos', 'atan'].includes(lower)) {
        tokens.push({ type: 'func', value: lower });
      } else {
        // Unknown identifier, fallback to NaN
        tokens.push({ type: 'num', value: NaN });
      }
      continue;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      // Check unary plus/minus
      const prev = tokens[tokens.length - 1];
      const isUnary = !prev || prev.type === 'op' || prev.type === 'lparen';
      if (isUnary && (char === '+' || char === '-')) {
        tokens.push({ type: 'num', value: 0 });
        tokens.push({ type: 'op', value: char });
      } else {
        tokens.push({ type: 'op', value: char });
      }
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

function precedence(op: string): number {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/' || op === '%') return 2;
  if (op === '^') return 3;
  return 0;
}

function isRightAssociative(op: string): boolean {
  return op === '^';
}

function evaluateTokens(tokens: Token[]): number {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'num') {
      outputQueue.push(token);
    } else if (token.type === 'func') {
      operatorStack.push(token);
    } else if (token.type === 'op') {
      const o1 = token.value as string;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'func') {
          outputQueue.push(operatorStack.pop()!);
        } else if (top.type === 'op') {
          const o2 = top.value as string;
          if (
            (isRightAssociative(o1) && precedence(o1) < precedence(o2)) ||
            (!isRightAssociative(o1) && precedence(o1) <= precedence(o2))
          ) {
            outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === 'lparen') {
      operatorStack.push(token);
    } else if (token.type === 'rparen') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'lparen') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'lparen') {
        operatorStack.pop(); // discard lparen
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'func') {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!);
  }

  // Evaluate RPN
  const valStack: number[] = [];
  for (const token of outputQueue) {
    if (token.type === 'num') {
      valStack.push(token.value as number);
    } else if (token.type === 'op') {
      const b = valStack.pop();
      const a = valStack.pop();
      if (a === undefined || b === undefined) return NaN;
      const op = token.value as string;
      switch (op) {
        case '+': valStack.push(a + b); break;
        case '-': valStack.push(a - b); break;
        case '*': valStack.push(a * b); break;
        case '/': valStack.push(b === 0 ? (a >= 0 ? Infinity : -Infinity) : a / b); break;
        case '%': valStack.push(a % b); break;
        case '^': valStack.push(Math.pow(a, b)); break;
        default: return NaN;
      }
    } else if (token.type === 'func') {
      const a = valStack.pop();
      if (a === undefined) return NaN;
      const fn = token.value as string;
      switch (fn) {
        case 'sin': valStack.push(Math.sin(a)); break;
        case 'cos': valStack.push(Math.cos(a)); break;
        case 'tan': {
          const cos = Math.cos(a);
          valStack.push(Math.abs(cos) < 1e-12 ? NaN : Math.tan(a));
          break;
        }
        case 'cot': {
          const sin = Math.sin(a);
          valStack.push(Math.abs(sin) < 1e-12 ? NaN : 1 / Math.tan(a));
          break;
        }
        case 'sqrt': valStack.push(a < 0 ? NaN : Math.sqrt(a)); break;
        case 'abs': valStack.push(Math.abs(a)); break;
        case 'ln': valStack.push(a <= 0 ? NaN : Math.log(a)); break;
        case 'log': valStack.push(a <= 0 ? NaN : Math.log10(a)); break;
        case 'exp': valStack.push(Math.exp(a)); break;
        case 'asin': valStack.push(Math.asin(a)); break;
        case 'acos': valStack.push(Math.acos(a)); break;
        case 'atan': valStack.push(Math.atan(a)); break;
        default: return NaN;
      }
    }
  }

  return valStack.length === 1 ? valStack[0] : NaN;
}

/**
 * Formats a number to π notation if close to a rational fraction of π
 */
export function formatPiNotation(val: number, trigContext: boolean = false): string | null {
  const clean = Math.abs(val) < 1e-5 ? 0 : val;
  if (clean === 0) return '0';

  const pi = Math.PI;
  const denominators = [1, 2, 3, 4, 6];
  let bestMatch: { num: number; den: number; diff: number } | null = null;
  const maxAllowedDiff = trigContext ? 0.05 : 0.025;

  for (const den of denominators) {
    const k = (clean * den) / pi;
    const roundK = Math.round(k);
    if (roundK === 0) continue;
    const diff = Math.abs(clean - (roundK * pi) / den);
    if (diff < maxAllowedDiff) {
      if (!bestMatch || diff < bestMatch.diff) {
        bestMatch = { num: roundK, den, diff };
      }
    }
  }

  if (!bestMatch) return null;

  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const g = gcd(bestMatch.num, bestMatch.den);
  let num = bestMatch.num / g;
  let den = bestMatch.den / g;

  const sign = num < 0 ? '-' : '';
  num = Math.abs(num);

  if (den === 1) {
    if (num === 1) return `${sign}π`;
    return `${sign}${num}π`;
  } else {
    if (num === 1) return `${sign}π/${den}`;
    return `${sign}${num}π/${den}`;
  }
}

/**
 * Advanced Exact Mathematical Recognizer:
 * Detects whether a real number matches an exact algebraic representation:
 * - Integers: 0, 1, -2, 3...
 * - Multiples of π: π, -π, π/2, 2π/3...
 * - Radicals (căn bậc hai): √2, -√3, √3, √5, 2√2, 2√3, 3√2...
 * - Radical fractions: √3/2, √2/2, √3/3, √6/2...
 * - Shifted quadratic radicals: 1 + √3, 1 - √3, -1 + √2...
 * - Cube roots: ∛2, ∛3...
 * - Rational fractions: 1/2, -1/3, 2/3, 3/4, -5/2...
 */
export function formatExactMath(
  val: number,
  isTrigContext: boolean = false
): { exact: string | null; formatted: string } {
  const clean = Math.abs(val) < 1e-5 ? 0 : val;
  if (clean === 0) return { exact: '0', formatted: '0' };

  // 1. Integer check
  if (Math.abs(clean - Math.round(clean)) < 1e-4) {
    const rounded = Math.round(clean);
    return { exact: `${rounded}`, formatted: `${rounded}` };
  }

  const sign = clean < 0 ? '-' : '';
  const absVal = Math.abs(clean);

  // 2. Pi multiples check (with tight tolerance)
  const pi = Math.PI;
  const maxPiDiff = isTrigContext ? 0.015 : 0.008;
  for (const den of [1, 2, 3, 4, 6]) {
    const k = (clean * den) / pi;
    const roundK = Math.round(k);
    if (roundK === 0) continue;
    if (Math.abs(clean - (roundK * pi) / den) < maxPiDiff) {
      const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
      const g = gcd(roundK, den);
      let num = roundK / g;
      let d = den / g;
      const s = num < 0 ? '-' : '';
      num = Math.abs(num);
      const str = d === 1 
        ? (num === 1 ? `${s}π` : `${s}${num}π`) 
        : (num === 1 ? `${s}π/${d}` : `${s}${num}π/${d}`);
      return { exact: str, formatted: str };
    }
  }

  // Helper to extract square factors: sqrt(N) = k * sqrt(b) where b is square-free
  const simplifySqrt = (N: number): { k: number; b: number } => {
    let k = 1;
    let rem = N;
    for (let f = Math.floor(Math.sqrt(N)); f >= 2; f--) {
      if (rem % (f * f) === 0) {
        k *= f;
        rem = rem / (f * f);
        break;
      }
    }
    return { k, b: rem };
  };

  // 3. Pure & simplified square roots: ±√N or ±k√b
  const testRadicands = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 24, 27, 28, 32, 40, 45, 48, 50];
  for (const N of testRadicands) {
    if (Math.abs(absVal - Math.sqrt(N)) < 0.003) {
      const { k, b } = simplifySqrt(N);
      const radStr = k === 1 ? `√${b}` : `${k}√${b}`;
      return { exact: `${sign}${radStr}`, formatted: `${sign}${radStr}` };
    }
  }

  // 4. Radical fractions: ±√N / d or ±(k√b) / d (d in [2, 3, 4, 6])
  for (const d of [2, 3, 4, 6]) {
    const scaled = absVal * d;
    for (const N of [2, 3, 5, 6, 7, 8, 10, 11, 12, 15, 18, 20, 24, 27]) {
      if (Math.abs(scaled - Math.sqrt(N)) < 0.004) {
        const { k, b } = simplifySqrt(N);
        const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
        const g = gcd(k, d);
        const kRed = k / g;
        const dRed = d / g;

        let res = '';
        if (dRed === 1) {
          res = kRed === 1 ? `√${b}` : `${kRed}√${b}`;
        } else {
          res = kRed === 1 ? `√${b}/${dRed}` : `${kRed}√${b}/${dRed}`;
        }
        return { exact: `${sign}${res}`, formatted: `${sign}${res}` };
      }
    }
  }

  // 5. Shifted quadratic roots: m ± √N (e.g. 1 + √3, 1 - √3, -1 + √2)
  for (const m of [-4, -3, -2, -1, 1, 2, 3, 4]) {
    for (const N of [2, 3, 5, 6, 7]) {
      const sqrtN = Math.sqrt(N);
      if (Math.abs(clean - (m + sqrtN)) < 0.003) {
        return { exact: `${m} + √${N}`, formatted: `${m} + √${N}` };
      }
      if (Math.abs(clean - (m - sqrtN)) < 0.003) {
        return { exact: `${m} - √${N}`, formatted: `${m} - √${N}` };
      }
    }
  }

  // 6. Cube roots: ±∛N
  for (const N of [2, 3, 4, 5, 6, 7, 9, 10]) {
    if (Math.abs(absVal - Math.cbrt(N)) < 0.003) {
      return { exact: `${sign}∛${N}`, formatted: `${sign}∛${N}` };
    }
  }

  // 7. Rational fractions with small denominators: p / q with q in [2..10]
  for (const q of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const p = Math.round(absVal * q);
    if (p === 0) continue;
    if (Math.abs(absVal - p / q) < 0.0015) {
      const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
      const g = gcd(p, q);
      const redP = p / g;
      const redQ = q / g;
      if (redQ === 1) {
        return { exact: `${sign}${redP}`, formatted: `${sign}${redP}` };
      }
      const fracStr = `${sign}${redP}/${redQ}`;
      return { exact: fracStr, formatted: fracStr };
    }
  }

  // 8. Fallback: Clean decimal format
  return { exact: null, formatted: clean.toFixed(2) };
}

/**
 * Returns formatted string representing coordinate x or y
 */
export function formatExactCoord(val: number, isTrigContext: boolean = false): string {
  const res = formatExactMath(val, isTrigContext);
  return res.exact || res.formatted;
}
