export type UserPlan = 'free' | 'monthly' | 'yearly';

export interface UserAccount {
  id: string;
  stt?: number;
  email: string;
  name: string;
  avatar?: string;
  plan: UserPlan;
  price?: number;
  currency?: string;
  paymentMethod?: string;
  paypalOrderId?: string;
  subscribedAt?: string;
  expiresAt?: string | null;
  daysRemaining?: number;
  status?: 'active' | 'expired';
  aiCountToday?: number;
  aiResetDate?: string;
  aiQuotaRemaining?: number;
  totalAiQueries?: number;
}

export interface PricingPlan {
  id: 'monthly' | 'yearly';
  nameVi: string;
  nameEn: string;
  priceUSD: number;
  priceVND: number;
  periodVi: string;
  periodEn: string;
  durationDays: number;
  savingsVi?: string;
  savingsEn?: string;
  popular?: boolean;
  featuresVi: string[];
  featuresEn: string[];
}
