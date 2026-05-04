export interface Country {
  id: string;
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  region: string;
  hasFederalTax: boolean;
  hasRegionalTax: boolean;
  payPeriods: {
    weekly: number;
    biweekly: number;
    monthly: number;
    annually: number;
  };
}

export interface CalculatorInput {
  grossSalary: number;
  bonus: number;
  payFrequency: 'weekly' | 'biweekly' | 'monthly' | 'annually';
  countryCode: string;
  regionCode?: string;
  preTaxDeductions: {
    retirement401k: number;
    healthInsurance: number;
    hsa: number;
    fsa: number;
    other: number;
  };
  postTaxDeductions: {
    other: number;
  };
  allowances?: number;
}

export interface TaxBreakdown {
  federal: {
    amount: number;
    rate: number;
    brackets: Array<{ min: number; max: number; rate: number; tax: number }>;
  };
  regional: {
    amount: number;
    rate: number;
    brackets: Array<{ min: number; max: number; rate: number; tax: number }>;
  };
  social: {
    amount: number;
    breakdown: Record<string, number>;
  };
  total: number;
  effectiveRate: number;
}

export interface DeductionBreakdown {
  preTax: {
    retirement401k: number;
    healthInsurance: number;
    hsa: number;
    fsa: number;
    other: number;
    total: number;
  };
  postTax: {
    other: number;
    total: number;
  };
  total: number;
}

export interface CalculatorResult {
  input: CalculatorInput;
  grossAnnual: number;
  taxableIncome: number;
  taxes: TaxBreakdown;
  deductions: DeductionBreakdown;
  netAnnual: number;
  netPayPeriod: number;
  payPeriodsPerYear: number;
  breakdown: {
    weekly: number;
    biweekly: number;
    monthly: number;
    annually: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  publishedAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    email: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardStats {
  calculations: {
    total: number;
    last30Days: number;
    last7Days: number;
  };
  topCountries: Array<{ countryCode: string; count: string }>;
  salaryRanges: Array<{ range: string; count: string }>;
  dailyCalculations: Array<{ date: string; count: string }>;
  blogPosts: {
    total: number;
    published: number;
  };
  contactMessages: {
    unread: number;
  };
}
