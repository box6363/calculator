import { ToolId } from '../types';

export type BlogCategory = 
  | 'all'
  | 'salary-tax'
  | 'loans-real-estate'
  | 'investment-saving'
  | 'health-fitness'
  | 'bills-utilities'
  | 'math-science'
  | 'ai-tech'
  | 'love-lifestyle';

export interface BlogCategoryMeta {
  id: BlogCategory;
  nameVi: string;
  nameEn: string;
  iconName: string;
  badgeColor: string;
}

export interface BlogSectionItem {
  id: string;
  headingVi: string;
  headingEn: string;
  contentVi: string;
  contentEn: string;
  callout?: {
    type: 'tip' | 'warning' | 'formula' | 'example';
    titleVi: string;
    titleEn: string;
    textVi: string;
    textEn: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  category: BlogCategory;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  coverImage?: string;
  iconName: string;
  gradient: string;
  readTimeMinutes: number;
  publishedDate: string;
  updatedDate: string;
  featured?: boolean;
  author: {
    name: string;
    roleVi: string;
    roleEn: string;
    avatar: string;
  };
  tagsVi: string[];
  tagsEn: string[];
  relatedToolIds: ToolId[];
  ctaToolId?: ToolId;
  ctaToolLabelVi?: string;
  ctaToolLabelEn?: string;
  sections: BlogSectionItem[];
  faqs: {
    qVi: string;
    qEn: string;
    aVi: string;
    aEn: string;
  }[];
}
