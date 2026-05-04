// Mock API service for demo purposes
// In production, replace with actual axios implementation

// Mock data
const mockCountries = [
  { id: '1', code: 'US', name: 'United States', currencyCode: 'USD', currencySymbol: '$', region: 'North America', hasFederalTax: true, hasRegionalTax: true, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '2', code: 'GB', name: 'United Kingdom', currencyCode: 'GBP', currencySymbol: '£', region: 'Europe', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '3', code: 'CA', name: 'Canada', currencyCode: 'CAD', currencySymbol: 'C$', region: 'North America', hasFederalTax: true, hasRegionalTax: true, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '4', code: 'AU', name: 'Australia', currencyCode: 'AUD', currencySymbol: 'A$', region: 'Oceania', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '5', code: 'DE', name: 'Germany', currencyCode: 'EUR', currencySymbol: '€', region: 'Europe', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '6', code: 'FR', name: 'France', currencyCode: 'EUR', currencySymbol: '€', region: 'Europe', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '7', code: 'IN', name: 'India', currencyCode: 'INR', currencySymbol: '₹', region: 'Asia', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '8', code: 'JP', name: 'Japan', currencyCode: 'JPY', currencySymbol: '¥', region: 'Asia', hasFederalTax: true, hasRegionalTax: true, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '9', code: 'SG', name: 'Singapore', currencyCode: 'SGD', currencySymbol: 'S$', region: 'Asia', hasFederalTax: true, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
  { id: '10', code: 'AE', name: 'United Arab Emirates', currencyCode: 'AED', currencySymbol: 'د.إ', region: 'Middle East', hasFederalTax: false, hasRegionalTax: false, payPeriods: { weekly: 52, biweekly: 26, monthly: 12, annually: 1 } },
];

// Mock calculator function
const mockCalculate = (data: any) => {
  const grossAnnual = (parseFloat(data.grossSalary) || 0) + (parseFloat(data.bonus) || 0);
  const preTaxTotal = Object.values(data.preTaxDeductions || {}).reduce((a: any, b: any) => a + (parseFloat(b) || 0), 0) as number;
  const taxableIncome = Math.max(0, grossAnnual - preTaxTotal);
  
  // Simple tax calculation (25% effective rate)
  const taxRate = 0.25;
  const totalTax = taxableIncome * taxRate;
  const netAnnual = grossAnnual - totalTax - (parseFloat(data.postTaxDeductions?.other) || 0);
  
  return {
    input: data,
    grossAnnual,
    taxableIncome,
    taxes: {
      federal: { amount: totalTax * 0.7, rate: taxRate * 0.7, brackets: [] },
      regional: { amount: totalTax * 0.3, rate: taxRate * 0.3, brackets: [] },
      social: { amount: 0, breakdown: {} },
      total: totalTax,
      effectiveRate: taxRate,
    },
    deductions: {
      preTax: {
        retirement401k: parseFloat(data.preTaxDeductions?.retirement401k) || 0,
        healthInsurance: parseFloat(data.preTaxDeductions?.healthInsurance) || 0,
        hsa: parseFloat(data.preTaxDeductions?.hsa) || 0,
        fsa: parseFloat(data.preTaxDeductions?.fsa) || 0,
        other: parseFloat(data.preTaxDeductions?.other) || 0,
        total: preTaxTotal,
      },
      postTax: {
        other: parseFloat(data.postTaxDeductions?.other) || 0,
        total: parseFloat(data.postTaxDeductions?.other) || 0,
      },
      total: preTaxTotal + (parseFloat(data.postTaxDeductions?.other) || 0),
    },
    netAnnual,
    netPayPeriod: netAnnual / 12,
    payPeriodsPerYear: 12,
    breakdown: {
      weekly: netAnnual / 52,
      biweekly: netAnnual / 26,
      monthly: netAnnual / 12,
      annually: netAnnual,
    },
  };
};

// Calculator API
export const calculatorApi = {
  calculate: async (data: any) => ({ data: mockCalculate(data) }),
  getCountries: async () => ({ data: mockCountries }),
  getCountryDetails: async (code: string) => ({ data: mockCountries.find(c => c.code === code) }),
  getTaxSlabs: async () => ({ data: [] }),
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    if (email === 'admin@paycheckcalculator.com' && password === 'admin') {
      return { data: { token: 'mock-token', user: { id: '1', email, role: 'admin' as const } } };
    }
    throw new Error('Invalid credentials');
  },
  getProfile: async () => ({ data: { id: '1', email: 'admin@paycheckcalculator.com', role: 'admin' as const } }),
  changePassword: async () => ({ data: { message: 'Password changed' } }),
};

// Blog API
export const blogApi = {
  getPosts: async () => ({ 
    data: { 
      posts: [
        { id: '1', title: 'Understanding Income Tax', slug: 'understanding-income-tax', excerpt: 'Learn how income tax works...', content: '<p>Income tax is...</p>', category: 'Taxes', tags: ['tax', 'income'], published: true, publishedAt: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01', authorId: '1', metaTitle: 'Understanding Income Tax', metaDescription: 'Learn about income tax' },
        { id: '2', title: 'Retirement Planning', slug: 'retirement-planning', excerpt: 'Plan for your future...', content: '<p>Retirement planning is...</p>', category: 'Finance', tags: ['retirement', 'savings'], published: true, publishedAt: '2024-01-15', createdAt: '2024-01-15', updatedAt: '2024-01-15', authorId: '1', metaTitle: 'Retirement Planning', metaDescription: 'Plan for retirement' },
      ], 
      total: 2, 
      page: 1, 
      totalPages: 1 
    } 
  }),
  getPostBySlug: async (_slug: string) => ({ 
    data: { 
      id: '1', 
      title: 'Understanding Income Tax', 
      slug: 'understanding-income-tax', 
      excerpt: 'Learn how income tax works...', 
      content: '<p>Income tax is a tax imposed on individuals or entities that varies with respective income or profits. Income tax generally is computed as the product of a tax rate times taxable income.</p><p>Taxation rates may vary by type or characteristics of the taxpayer. The tax rate may increase as taxable income increases (referred to as graduated or progressive rates).</p>', 
      category: 'Taxes', 
      tags: ['tax', 'income'], 
      published: true, 
      publishedAt: '2024-01-01', 
      createdAt: '2024-01-01', 
      updatedAt: '2024-01-01', 
      authorId: '1',
      metaTitle: 'Understanding Income Tax - Paycheck Calculator',
      metaDescription: 'Learn how income tax works and how it affects your paycheck.',
    } 
  }),
  getCategories: async () => ({ data: ['Taxes', 'Finance', 'Career'] }),
  getTags: async () => ({ data: ['tax', 'income', 'retirement', 'savings'] }),
  getRelatedPosts: async (_slug: string) => ({ data: [] }),
  createPost: async (data: any) => ({ data: { id: '3', ...data } }),
  updatePost: async (id: string, data: any) => ({ data: { id, ...data } }),
  deletePost: async () => ({ data: { message: 'Deleted' } }),
};

// Admin API
export const adminApi = {
  getDashboardStats: async () => ({ 
    data: {
      calculations: { total: 15000, last30Days: 2500, last7Days: 600 },
      topCountries: [{ countryCode: 'US', count: '5000' }, { countryCode: 'GB', count: '3000' }],
      salaryRanges: [{ range: '$50k-$100k', count: '8000' }],
      dailyCalculations: [{ date: '2024-01-01', count: '100' }],
      blogPosts: { total: 10, published: 8 },
      contactMessages: { unread: 5 },
    }
  }),
  getUsageStats: async () => ({ data: [] }),
  createTaxSlab: async (data: any) => ({ data: { id: '1', ...data } }),
  updateTaxSlab: async (id: string, data: any) => ({ data: { id, ...data } }),
  deleteTaxSlab: async () => ({ data: { message: 'Deleted' } }),
  createCountry: async (data: any) => ({ data: { id: '1', ...data } }),
  updateCountry: async (id: string, data: any) => ({ data: { id, ...data } }),
  getContactMessages: async () => ({ data: { messages: [], total: 0, page: 1, totalPages: 1 } }),
  markMessageAsRead: async (id: string) => ({ data: { id, read: true } }),
  deleteContactMessage: async () => ({ data: { message: 'Deleted' } }),
};

// Contact API
export const contactApi = {
  submit: async (_data: { name: string; email: string; subject: string; message: string }) =>
    ({ data: { message: 'Thank you for your message', id: '1' } }),
};

export default { calculatorApi, authApi, blogApi, adminApi, contactApi };
