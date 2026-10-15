export type ToolCategory = 'math' | 'geometry' | 'financial' | 'fitness' | 'conversion' | 'utility' | 'knowledge';

export type ToolId = 
  // Financial
  | 'mortgage'
  | 'loan'
  | 'autoloan'
  | 'interest'
  | 'payment'
  | 'retirement'
  | 'amortization'
  | 'investment'
  | 'inflation'
  | 'finance'
  | 'salary'
  | 'tax'
  | 'compound'
  | 'lottery'
  // Fitness & Health
  | 'bmi'
  | 'calorie'
  | 'bodyfat'
  | 'bmr'
  | 'idealweight'
  | 'pregnancy'
  | 'pace'
  | 'armybodyfat'
  | 'healthyweight'
  | 'ovulation'
  // Math
  | 'basic'
  | 'percentage'
  | 'fraction'
  | 'triangle'
  | 'standarddeviation'
  | 'random'
  | 'average'
  | 'meanmedianmode'
  | 'root'
  | 'exponent'
  | 'log'
  | 'quadratic'
  | 'slope'
  | 'area'
  | 'volume'
  | 'perimeter'
  | 'circle'
  | 'righttriangle'
  | 'statistics'
  | 'probability'
  | 'trigonometry'
  | 'graphing'
  | 'gpa'
  // Conversions & Others
  | 'unit'
  | 'length'
  | 'weight'
  | 'temperature'
  | 'currency'
  | 'time'
  | 'date'
  | 'age'
  | 'password'
  | 'ipsubnet'
  | 'concrete'
  | 'tip'
  | 'discount'
  | 'utilitybill'
  | 'love'
  | 'ai'
  | 'blog';

export interface ToolMeta {
  id: ToolId;
  category?: ToolCategory;
  name: string;
  shortName: string;
  badge?: string;
  tierNumber: 1 | 2 | 3;
  iconName: string;
  seoTitle: string;
  seoH1: string;
  tagline?: string;
  description: string;
  formulaDescription: string;
  formulaEquation?: string;
  usageSteps: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedToolIds: ToolId[];
}

export interface CalculationHistoryItem {
  id: string;
  toolId: ToolId;
  timestamp: number;
  title: string;
  summary: string;
}
