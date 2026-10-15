import { ToolId } from '../types';

export interface ToolColorTheme {
  iconColor: string;      // Tailwind text color for icon
  badgeClass: string;     // Tailwind classes for the icon container badge (light + dark)
  activeClass: string;    // Badge classes when the item itself is active
  hoverClass: string;     // Hover ring/shadow effect
}

export const TOOL_COLOR_MAP: Record<ToolId, ToolColorTheme> = {
  // --- MATH TOOLS ---
  basic: {
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400 group-hover:shadow-blue-500/20'
  },
  percentage: {
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400 group-hover:shadow-rose-500/20'
  },
  fraction: {
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400 group-hover:shadow-amber-500/20'
  },
  root: {
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400 group-hover:shadow-emerald-500/20'
  },
  exponent: {
    iconColor: 'text-sky-500 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-600 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400 group-hover:shadow-sky-500/20'
  },
  log: {
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    badgeClass: 'bg-cyan-50 text-cyan-600 border border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-cyan-400 group-hover:shadow-cyan-500/20'
  },
  quadratic: {
    iconColor: 'text-violet-500 dark:text-violet-400',
    badgeClass: 'bg-violet-50 text-violet-600 border border-violet-200/80 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-violet-400 group-hover:shadow-violet-500/20'
  },
  slope: {
    iconColor: 'text-fuchsia-500 dark:text-fuchsia-400',
    badgeClass: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200/80 dark:bg-fuchsia-950/50 dark:text-fuchsia-400 dark:border-fuchsia-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-fuchsia-400 group-hover:shadow-fuchsia-500/20'
  },
  average: {
    iconColor: 'text-blue-500 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400 group-hover:shadow-blue-500/20'
  },
  standarddeviation: {
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400 group-hover:shadow-indigo-500/20'
  },
  meanmedianmode: {
    iconColor: 'text-teal-500 dark:text-teal-400',
    badgeClass: 'bg-teal-50 text-teal-600 border border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-teal-400 group-hover:shadow-teal-500/20'
  },
  statistics: {
    iconColor: 'text-purple-500 dark:text-purple-400',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-purple-400 group-hover:shadow-purple-500/20'
  },
  probability: {
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400 group-hover:shadow-amber-500/20'
  },
  random: {
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400 group-hover:shadow-rose-500/20'
  },
  trigonometry: {
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400 group-hover:shadow-blue-500/20'
  },
  graphing: {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400 group-hover:shadow-emerald-500/20'
  },
  gpa: {
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400 group-hover:shadow-indigo-500/20'
  },

  // --- GEOMETRY ---
  triangle: {
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400'
  },
  righttriangle: {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400'
  },
  circle: {
    iconColor: 'text-sky-500 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-600 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400'
  },
  perimeter: {
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400'
  },
  area: {
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400'
  },
  volume: {
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400'
  },

  // --- FINANCIAL & BANKING ---
  loan: {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400 group-hover:shadow-emerald-500/20'
  },
  salary: {
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400 group-hover:shadow-sky-500/20'
  },
  mortgage: {
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400 group-hover:shadow-indigo-500/20'
  },
  compound: {
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-purple-400 group-hover:shadow-purple-500/20'
  },
  autoloan: {
    iconColor: 'text-orange-500 dark:text-orange-400',
    badgeClass: 'bg-orange-50 text-orange-600 border border-orange-200/80 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-orange-400'
  },
  interest: {
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-teal-400'
  },
  payment: {
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  retirement: {
    iconColor: 'text-pink-600 dark:text-pink-400',
    badgeClass: 'bg-pink-50 text-pink-700 border border-pink-200/80 dark:bg-pink-950/50 dark:text-pink-400 dark:border-pink-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-pink-400'
  },
  amortization: {
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-cyan-400'
  },
  investment: {
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400'
  },
  inflation: {
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400'
  },
  finance: {
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400'
  },
  tax: {
    iconColor: 'text-violet-600 dark:text-violet-400',
    badgeClass: 'bg-violet-50 text-violet-700 border border-violet-200/80 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-violet-400'
  },
  utilitybill: {
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  lottery: {
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    badgeClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200/80 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-yellow-400'
  },

  // --- FITNESS & HEALTH ---
  bmi: {
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400 group-hover:shadow-emerald-500/20'
  },
  calorie: {
    iconColor: 'text-orange-500 dark:text-orange-400',
    badgeClass: 'bg-orange-50 text-orange-600 border border-orange-200/80 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-orange-400'
  },
  bodyfat: {
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400'
  },
  bmr: {
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  idealweight: {
    iconColor: 'text-teal-600 dark:text-teal-400',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-teal-400'
  },
  healthyweight: {
    iconColor: 'text-green-600 dark:text-green-400',
    badgeClass: 'bg-green-50 text-green-700 border border-green-200/80 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-green-400'
  },
  pregnancy: {
    iconColor: 'text-pink-500 dark:text-pink-400',
    badgeClass: 'bg-pink-50 text-pink-600 border border-pink-200/80 dark:bg-pink-950/50 dark:text-pink-400 dark:border-pink-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-pink-400'
  },
  ovulation: {
    iconColor: 'text-fuchsia-500 dark:text-fuchsia-400',
    badgeClass: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200/80 dark:bg-fuchsia-950/50 dark:text-fuchsia-400 dark:border-fuchsia-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-fuchsia-400'
  },
  pace: {
    iconColor: 'text-sky-500 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-600 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400'
  },
  armybodyfat: {
    iconColor: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400'
  },

  // --- AI TOOL ---
  ai: {
    iconColor: 'text-violet-500 dark:text-violet-400',
    badgeClass: 'bg-violet-50 text-violet-600 border border-violet-200/80 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-violet-400 group-hover:shadow-violet-500/25'
  },

  // --- CONVERSIONS & UTILITIES ---
  unit: {
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200/80 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-cyan-400'
  },
  length: {
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400'
  },
  weight: {
    iconColor: 'text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-purple-400'
  },
  temperature: {
    iconColor: 'text-rose-500 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400'
  },
  currency: {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-emerald-400'
  },
  time: {
    iconColor: 'text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-sky-400'
  },
  date: {
    iconColor: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  age: {
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  tip: {
    iconColor: 'text-pink-500 dark:text-pink-400',
    badgeClass: 'bg-pink-50 text-pink-600 border border-pink-200/80 dark:bg-pink-950/50 dark:text-pink-400 dark:border-pink-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-pink-400'
  },
  discount: {
    iconColor: 'text-rose-600 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-rose-400'
  },
  password: {
    iconColor: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-amber-400'
  },
  ipsubnet: {
    iconColor: 'text-blue-500 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-blue-400'
  },
  concrete: {
    iconColor: 'text-slate-600 dark:text-slate-300',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-slate-400'
  },
  love: {
    iconColor: 'text-red-600 dark:text-red-500',
    badgeClass: 'bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-red-400'
  },
  blog: {
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50 shadow-xs',
    activeClass: 'bg-white/20 text-white',
    hoverClass: 'group-hover:border-indigo-400'
  }
};

const DEFAULT_COLOR_THEME: ToolColorTheme = {
  iconColor: 'text-blue-600 dark:text-blue-400',
  badgeClass: 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50 shadow-xs',
  activeClass: 'bg-white/20 text-white',
  hoverClass: 'group-hover:border-blue-400'
};

export const getToolColorTheme = (id: ToolId): ToolColorTheme => {
  return TOOL_COLOR_MAP[id] || DEFAULT_COLOR_THEME;
};
