import { ToolId } from '../types';
import { LanguageCode } from '../i18n/languages';
import { TOOLS_CONFIG } from './toolsData';

export interface LocalizedToolContent {
  name: string;
  tagline: string;
  description: string;
  formulaDescription: string;
  formulaEquation: string;
  usageSteps: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const ENGLISH_TOOL_CONTENT: Record<string, LocalizedToolContent> = {
  basic: {
    name: 'Basic & Scientific Calculator',
    tagline: 'Fast, accurate, and responsive online calculator with history and memory registers',
    description: 'Free online scientific calculator featuring standard arithmetic (+, -, ×, ÷, %), power, roots, trigonometry (sin, cos, tan), logarithms, mathematical constants (π, e), full memory registers (MC, MR, M+, M-), and chronological calculation history.',
    formulaDescription: 'Calculations adhere strictly to standard algebraic order of operations (PEMDAS/BODMAS): Parentheses, Exponents, Multiplication & Division (left to right), Addition & Subtraction (left to right).',
    formulaEquation: 'f(x, y) = x [+, -, ×, ÷] y',
    usageSteps: [
      'Enter numbers directly using your physical keyboard or the on-screen interactive keypad.',
      'Select mathematical operators (+, -, ×, ÷, %, √, ^) to build your expression.',
      'Press Enter or the equals (=) button to instantly calculate the result.',
      'Use memory buttons (MC, MR, M+, M-) or inspect previous computations in the History panel.'
    ],
    faqs: [
      {
        question: 'Does this calculator support keyboard shortcuts?',
        answer: 'Yes! You can use standard number keys 0-9, arithmetic keys (+, -, *, /), Enter for equals, Backspace to delete the last digit, and Escape to clear (AC).'
      },
      {
        question: 'Is my calculation history saved when I close the browser?',
        answer: 'Yes, your calculation history is saved securely in your browser local storage. Your data never leaves your device and you can clear it anytime.'
      },
      {
        question: 'How many decimal digits of precision are supported?',
        answer: 'The calculator computes with IEEE-754 double-precision floating-point arithmetic and formats results up to 10 decimal digits with smart rounding.'
      }
    ]
  },
  ai: {
    name: 'AI Math & Problem Solver',
    tagline: 'Step-by-step problem solver and multimodal math assistant powered by Gemini AI',
    description: 'Solve complex math problems, algebraic equations, geometry, calculus, and financial questions with step-by-step pedagogical explanations and KaTeX LaTeX rendering.',
    formulaDescription: 'Analyzes inputs with multimodal neural reasoning, formulating formal step-by-step algebraic and mathematical solutions.',
    formulaEquation: '\\lim_{x \\to a} f(x) = L \\quad \\text{or} \\quad \\int f(x) dx',
    usageSteps: [
      'Type your math problem or question in natural language, or upload an image of a handwritten equation.',
      'Select your preferred explanation detail level or pedagogical mode.',
      'Click Solve to generate a complete step-by-step solution formatted with LaTeX equations.',
      'Ask follow-up questions to clarify concepts or test alternative scenarios.'
    ],
    faqs: [
      {
        question: 'Can the AI solver read handwritten equations and charts from photos?',
        answer: 'Yes, the multimodal engine can analyze uploaded images of handwritten math, printed textbook problems, geometry diagrams, and graphs.'
      },
      {
        question: 'Are formulas displayed in clean mathematical formatting?',
        answer: 'All mathematical formulas and symbols are rendered using standard KaTeX/LaTeX formatting for clear textbook-grade readability.'
      }
    ]
  },
  bmi: {
    name: 'BMI Calculator',
    tagline: 'Body Mass Index and healthy weight calculator based on WHO & Asian standards',
    description: 'Calculate your exact Body Mass Index (BMI) using standard WHO and Asian body composition criteria. View your healthy weight range, classification category, and personalized wellness recommendations.',
    formulaDescription: 'Body Mass Index is defined as body mass divided by the square of body height in meters.',
    formulaEquation: 'BMI = Weight (kg) / [Height (m)]²',
    usageSteps: [
      'Select your unit preference: Metric (cm, kg) or Imperial (ft, in, lbs).',
      'Enter your current height and weight accurately.',
      'Review your calculated BMI value, health category, and healthy target weight bracket.',
      'Explore actionable dietary and physical activity recommendations based on international guidelines.'
    ],
    faqs: [
      {
        question: 'What is considered a healthy BMI range?',
        answer: 'According to the World Health Organization (WHO), a BMI between 18.5 and 24.9 is considered normal weight. For Asian populations, the recommended healthy cutoff is 18.5 to 22.9.'
      },
      {
        question: 'Does BMI distinguish between muscle mass and body fat?',
        answer: 'BMI measures total body mass relative to height. For muscular athletes, we recommend using our Body Fat Calculator alongside BMI for comprehensive assessment.'
      }
    ]
  },
  loan: {
    name: 'Loan & Mortgage Payment Calculator',
    tagline: 'Monthly EMI payment and reducing balance loan amortization schedule',
    description: 'Calculate monthly loan repayments (Equated Monthly Installments - EMI), total interest payable, and detailed monthly amortization breakdowns for home mortgages, auto loans, and personal borrowing.',
    formulaDescription: 'Monthly EMI is derived using standard fixed-annuity compound discounting formula over the total number of payment periods.',
    formulaEquation: 'EMI = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]',
    usageSteps: [
      'Enter your total borrowed principal loan amount.',
      'Input the annual interest rate offered by your financial institution.',
      'Select your loan tenure in years or months.',
      'Toggle between Fixed EMI or Reducing Balance method to inspect monthly principal vs. interest amortization.'
    ],
    faqs: [
      {
        question: 'What is the difference between Fixed EMI and Reducing Balance loan schedules?',
        answer: 'With Fixed EMI, your total monthly payment remains constant throughout the loan term. With reducing balance, you pay a fixed principal each month plus interest on the remaining balance, so payments decrease over time.'
      },
      {
        question: 'Can I view or export the full amortization schedule?',
        answer: 'Yes, you can inspect every monthly breakdown showing starting balance, principal paid, interest paid, and remaining balance.'
      }
    ]
  },
  salary: {
    name: 'Salary Gross to Net Calculator',
    tagline: 'International multi-country paycheck, income tax, and social security calculator',
    description: 'Comprehensive international payroll calculator supporting Gross to Net and Net to Gross conversions across multiple jurisdictions with progressive tax brackets, social contributions, and flexible pay periods (Annual, Monthly, Bi-weekly, Hourly).',
    formulaDescription: 'Net Pay equals Gross Salary minus mandatory social security/insurance contributions minus progressive income tax after standard personal deductions.',
    formulaEquation: 'Net = Gross - Social Security - Income Tax',
    usageSteps: [
      'Select your target country and tax jurisdiction.',
      'Choose calculation direction: Gross to Net (Take-home pay) or Net to Gross.',
      'Select your pay period: Annual, Monthly, Bi-weekly, Weekly, or Hourly (40h/week).',
      'Enter your income figure and number of dependents.',
      'Inspect your detailed pay stub breakdown and customizable tax brackets.'
    ],
    faqs: [
      {
        question: 'What is the difference between Gross salary and Net salary?',
        answer: 'Gross salary is the total agreed compensation before any payroll deductions. Net salary (take-home pay) is the actual cash deposited into your bank account after mandatory taxes and social contributions.'
      },
      {
        question: 'Can I customize tax rates and insurance percentages?',
        answer: 'Yes! Click "Customize Parameters" to fine-tune employee and employer contribution rates, tax brackets, and currency symbols.'
      }
    ]
  },
  age: {
    name: 'Age Calculator',
    tagline: 'Calculate exact chronological age in years, months, days, and birthday countdown',
    description: 'Determine your exact chronological age down to the day and minute. Calculate total elapsed days lived, countdown to your next birthday, and explore astrological and planetary insights.',
    formulaDescription: 'Computes calendar elapsed intervals between birth date and target reference date, precisely accounting for leap years and month day counts.',
    formulaEquation: 'Age = Target Date - Date of Birth',
    usageSteps: [
      'Select your date of birth from the interactive calendar.',
      'Optionally adjust the target comparison date (defaults to today).',
      'View your exact age in years, months, days, as well as total days, hours, and minutes lived.',
      'Check the countdown timer to your upcoming birthday.'
    ],
    faqs: [
      {
        question: 'Does the calculator properly account for leap years and February 29th?',
        answer: 'Yes, the algorithm rigorously accounts for leap years, including births on leap days (February 29).'
      },
      {
        question: 'Can I calculate the duration between two past historical dates?',
        answer: 'Yes, you can change both the start date and end date to calculate the exact duration between any two events in history.'
      }
    ]
  },
  percentage: {
    name: 'Percentage Calculator',
    tagline: 'Calculate percentages, discount sales, proportional ratios, and sales tax/VAT',
    description: 'Solve common percentage calculations effortlessly: percentage of a number, percentage increase/decrease, retail discounts, sales tax, VAT, and ratio comparisons.',
    formulaDescription: 'A percentage expresses a dimensionless ratio as a fraction of 100 parts.',
    formulaEquation: 'P% = (Value / Total) × 100',
    usageSteps: [
      'Choose the percentage calculation type from the intuitive tab options.',
      'Enter the known values into the corresponding input fields.',
      'Results update instantly in real-time as you type.',
      'Review step-by-step formula explanations for educational or business purposes.'
    ],
    faqs: [
      {
        question: 'How do I calculate a percentage increase or decrease?',
        answer: 'Use the formula: Percentage Change = [(New Value - Original Value) / Original Value] × 100. A positive result indicates growth, while negative indicates a decrease.'
      },
      {
        question: 'Can this tool calculate combined discounts with sales tax?',
        answer: 'Yes, the Discount & Tax mode lets you input original price, sale discount percentage, and applicable VAT/sales tax to show total savings and final amount payable.'
      }
    ]
  },
  unit: {
    name: 'Unit & Currency Converter',
    tagline: 'Convert metric and imperial units of length, weight, area, temperature, and live currencies',
    description: 'Instant conversion between metric, imperial, and international measurement units for length, mass, area, temperature, and popular foreign exchange currencies (USD, EUR, GBP, JPY, CAD, AUD, etc.).',
    formulaDescription: 'Converts input values to standardized SI base units and maps them to target measurement scales.',
    formulaEquation: 'V_out = (V_in × Factor_in) / Factor_out',
    usageSteps: [
      'Select the measurement category: Currency, Length, Weight/Mass, Area, or Temperature.',
      'Enter the numerical value and select your source unit.',
      'Choose your target destination unit to view instant converted values.',
      'For currency, adjust benchmark exchange rates to match your financial provider.'
    ],
    faqs: [
      {
        question: 'What is the formula for converting Celsius to Fahrenheit?',
        answer: 'To convert Celsius to Fahrenheit: °F = (°C × 9/5) + 32. To convert Fahrenheit to Celsius: °C = (°F - 32) × 5/9.'
      }
    ]
  },
  trigonometry: {
    name: 'Trigonometry & Right Triangle Calculator',
    tagline: 'Calculate sin, cos, tan, inverse functions, and solve right triangles visually',
    description: 'Compute trigonometric functions (sin, cos, tan, cot, arcsin, arccos, arctan) in both degrees (deg) and radians (rad). Includes interactive right-triangle solver with dynamic SVG geometric rendering.',
    formulaDescription: 'Trigonometric ratios in right triangles: sin(θ) = Opposite/Hypotenuse, cos(θ) = Adjacent/Hypotenuse, tan(θ) = Opposite/Adjacent.',
    formulaEquation: 'sin²(θ) + cos²(θ) = 1, \\quad a² + b² = c²',
    usageSteps: [
      'Select your preferred angle unit: Degrees (°) or Radians (rad).',
      'Use the quick trigonometric evaluator or switch to the Right Triangle Solver tab.',
      'Enter two known elements (e.g., two sides, or one side and an acute angle).',
      'Inspect the dynamically rendered triangle diagram with exact side lengths, angles, perimeter, and area.'
    ],
    faqs: [
      {
        question: 'When should I use degrees versus radians?',
        answer: 'Use degrees (°) for standard geometry, engineering, navigation, and construction. Use radians (rad) for calculus, periodic oscillations, and advanced physics.'
      }
    ]
  },
  compound: {
    name: 'Compound Interest Calculator',
    tagline: 'Simulate long-term wealth growth, periodic contributions, and exponential compounding',
    description: 'Model the power of compound interest over time. Simulate initial deposits, regular monthly contributions, compounding frequencies, and projected total wealth accumulation with interactive visual graphs.',
    formulaDescription: 'Standard compound interest with recurring annuity contributions: A = P(1 + r/n)^(nt) + PMT × {[(1 + r/n)^(nt) - 1] / (r/n)}.',
    formulaEquation: 'A = P(1 + r/n)^{nt} + PMT \\times \\frac{(1 + r/n)^{nt} - 1}{r/n}',
    usageSteps: [
      'Enter your initial starting investment principal (P).',
      'Enter your periodic monthly contribution amount (PMT).',
      'Input the expected annual return rate (%) and select compounding frequency.',
      'Choose the investment horizon in years to visualize compounding growth curves and yearly balance tables.'
    ],
    faqs: [
      {
        question: 'Why did Albert Einstein call compound interest the 8th wonder of the world?',
        answer: 'Because interest earned on principal is added back into your capital to earn further interest in subsequent periods, creating exponential wealth growth over time.'
      },
      {
        question: 'How does compounding frequency impact returns?',
        answer: 'More frequent compounding (e.g., monthly vs. annually) causes interest to compound faster, resulting in slightly higher effective annual yields.'
      }
    ]
  },
  calorie: {
    name: 'Calorie & TDEE Calculator',
    tagline: 'Estimate daily caloric expenditure (TDEE) and BMR based on clinical formulas',
    description: 'Estimate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using clinical Mifflin-St Jeor and Harris-Benedict formulas. Determine targeted calorie deficits for healthy fat loss or surpluses for muscle gain.',
    formulaDescription: 'BMR calculated via Mifflin-St Jeor: 10W + 6.25H - 5A + S. Total Daily Energy Expenditure equals BMR multiplied by Physical Activity Level (PAL).',
    formulaEquation: 'TDEE = BMR \\times \\text{Activity Factor (1.2 - 1.9)}',
    usageSteps: [
      'Select gender, input age, height, and body weight.',
      'Select your weekly physical activity level from sedentary to athlete.',
      'View your estimated BMR and maintenance calories (TDEE).',
      'Select your goal (weight loss, maintenance, or muscle gain) to view recommended macro calorie targets.'
    ],
    faqs: [
      {
        question: 'What is the difference between BMR and TDEE?',
        answer: 'BMR (Basal Metabolic Rate) is the calories burned at complete rest to maintain vital organ functions. TDEE (Total Daily Energy Expenditure) is total calories burned daily including movement, work, and exercise.'
      },
      {
        question: 'How large of a calorie deficit is recommended for safe fat loss?',
        answer: 'A moderate deficit of 300 to 500 kcal/day is standard for sustainable fat loss of approximately 0.5 to 1 lb (0.25-0.5 kg) per week without compromising lean muscle mass.'
      }
    ]
  },
  mortgage: {
    name: 'Mortgage Calculator',
    tagline: 'Calculate home purchase payments, principal, interest, taxes, and insurance',
    description: 'Detailed home mortgage payment analyzer calculating monthly principal, interest, property taxes, homeowners insurance, and private mortgage insurance (PMI).',
    formulaDescription: 'Fixed-rate long-term mortgage loan amortization formula.',
    formulaEquation: 'M = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1} + \\text{Taxes} + \\text{Insurance}',
    usageSteps: [
      'Enter the property purchase price and your down payment amount or percentage.',
      'Select the loan tenure (15, 20, 30 years) and annual interest rate.',
      'Optionally include annual property tax, insurance, and HOA dues.',
      'View the monthly cost breakdown and multi-year amortization schedule.'
    ],
    faqs: [
      {
        question: 'What percentage down payment is recommended?',
        answer: 'A down payment of 20% is recommended to avoid private mortgage insurance (PMI) and lower monthly payments.'
      }
    ]
  },
  tax: {
    name: 'Tax Calculator',
    tagline: 'Progressive personal income tax and deduction estimator',
    description: 'Estimate personal income tax liability with progressive tax brackets, standard personal deductions, family allowances, and mandatory withholdings.',
    formulaDescription: 'Taxable Income = Gross Income - Exemptions - Deductions. Total Tax = Sum of bracket marginal taxes.',
    formulaEquation: 'Tax = \\sum (\\text{Bracket Income} \\times \\text{Rate})',
    usageSteps: [
      'Enter total monthly or annual gross income.',
      'Specify personal exemptions and qualifying dependents.',
      'Review marginal and effective tax rates, tax bracket breakdown, and net earnings.'
    ],
    faqs: [
      {
        question: 'What is the difference between marginal and effective tax rates?',
        answer: 'The marginal tax rate is the tax rate applied to your highest dollar of income. The effective tax rate is the total tax paid divided by your total income.'
      }
    ]
  },
  love: {
    name: 'Love Calculator',
    tagline: 'Calculate love compatibility, romantic harmony, and test your bond with your crush',
    description: 'Free online Love Calculator to test love compatibility, relationship chemistry, mutual understanding, and FLAMES fortune telling based on names.',
    formulaDescription: 'Calculated using character frequency harmonics, numerological name compatibility, and the classic FLAMES relationship algorithm.',
    formulaEquation: 'LoveMatch\\% = \\text{HarmonicMatch}(Name_1, Name_2) \\times 100',
    usageSteps: [
      'Enter your full name in the "Your name" field.',
      'Enter your crush\'s full name in the "Your crush" field.',
      'Click the "Calculate love" button to run the compatibility engine.',
      'Review the love match percentage, relationship harmony breakdown, and romantic advice.'
    ],
    faqs: [
      {
        question: 'How does this Love Calculator work?',
        answer: 'The calculator analyzes the vibrational harmony and letter frequencies between two names using a deterministic symmetrical algorithm, providing consistent and fun compatibility scores.'
      },
      {
        question: 'Does the order of names change the result?',
        answer: 'No. The algorithm is completely symmetrical; entering Name A + Name B yields the exact same love percentage as Name B + Name A.'
      },
      {
        question: 'What is the FLAMES game mode?',
        answer: 'FLAMES stands for Friendship, Love, Affection, Marriage, Enemy, and Sibling — a beloved classic relationship game played across generations.'
      }
    ]
  }
};

/**
 * Returns localized tool content (name, tagline, description, steps, faqs, formulas)
 * For Vietnamese, it retrieves rich native content.
 * For English and all international languages, it returns clean, fully translated English content.
 */
export function getLocalizedToolContent(toolId: ToolId, lang: LanguageCode): LocalizedToolContent {
  const defaultTool = TOOLS_CONFIG[toolId] || TOOLS_CONFIG.basic;

  if (lang === 'vi') {
    return {
      name: defaultTool.name,
      tagline: defaultTool.tagline || 'Máy tính online đa năng chuẩn xác 100%',
      description: defaultTool.description || 'Công cụ tính toán trực tuyến chuẩn xác, bảo mật và miễn phí.',
      formulaDescription: defaultTool.formulaDescription || '',
      formulaEquation: defaultTool.formulaEquation || '',
      usageSteps: defaultTool.usageSteps || [],
      faqs: defaultTool.faqs || []
    };
  }

  const enContent = ENGLISH_TOOL_CONTENT[toolId];
  if (enContent) {
    return enContent;
  }

  // Fallback to basic english content
  return ENGLISH_TOOL_CONTENT.basic;
}
