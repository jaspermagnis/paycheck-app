import React, { useRef } from 'react';
import { Download, Printer, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CalculatorResult, Country } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

interface CalculatorResultsProps {
  result: CalculatorResult;
  country: Country | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ result, country }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const currencyCode = country?.currencyCode || 'USD';
  const currencySymbol = country?.currencySymbol || '$';

  const handleDownloadPDF = () => {
    // Trigger print dialog for PDF save
    window.print();
    toast.success('Use "Save as PDF" in the print dialog to download');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const summary = `
Paycheck Calculation Summary
============================
Gross Annual Income: ${formatCurrency(result.grossAnnual, currencyCode, currencySymbol)}
Taxable Income: ${formatCurrency(result.taxableIncome, currencyCode, currencySymbol)}

Tax Breakdown:
- Federal Tax: ${formatCurrency(result.taxes.federal.amount, currencyCode, currencySymbol)} (${formatPercentage(result.taxes.federal.rate)})
- Social Contributions: ${formatCurrency(result.taxes.social.amount, currencyCode, currencySymbol)}
- Total Tax: ${formatCurrency(result.taxes.total, currencyCode, currencySymbol)} (${formatPercentage(result.taxes.effectiveRate)})

Deductions:
- Pre-tax: ${formatCurrency(result.deductions.preTax.total, currencyCode, currencySymbol)}
- Post-tax: ${formatCurrency(result.deductions.postTax.total, currencyCode, currencySymbol)}

Net Annual Income: ${formatCurrency(result.netAnnual, currencyCode, currencySymbol)}
Net per Pay Period: ${formatCurrency(result.netPayPeriod, currencyCode, currencySymbol)}

Breakdown:
- Weekly: ${formatCurrency(result.breakdown.weekly, currencyCode, currencySymbol)}
- Bi-weekly: ${formatCurrency(result.breakdown.biweekly, currencyCode, currencySymbol)}
- Monthly: ${formatCurrency(result.breakdown.monthly, currencyCode, currencySymbol)}
    `.trim();

    navigator.clipboard.writeText(summary);
    toast.success('Results copied to clipboard!');
  };

  // Chart data
  const taxChartData = [
    { name: 'Federal Tax', value: result.taxes.federal.amount },
    { name: 'Regional Tax', value: result.taxes.regional.amount },
    { name: 'Social Security', value: result.taxes.social.amount },
    { name: 'Net Income', value: result.netAnnual },
  ].filter(item => item.value > 0);

  const deductionChartData = [
    { name: 'Retirement', value: result.deductions.preTax.retirement401k },
    { name: 'Health Insurance', value: result.deductions.preTax.healthInsurance },
    { name: 'HSA', value: result.deductions.preTax.hsa },
    { name: 'FSA', value: result.deductions.preTax.fsa },
    { name: 'Other Pre-tax', value: result.deductions.preTax.other },
    { name: 'Post-tax', value: result.deductions.postTax.other },
  ].filter(item => item.value > 0);

  const payPeriodData = [
    { name: 'Weekly', amount: result.breakdown.weekly },
    { name: 'Bi-weekly', amount: result.breakdown.biweekly },
    { name: 'Monthly', amount: result.breakdown.monthly },
    { name: 'Annually', amount: result.breakdown.annually },
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>

      <div ref={resultsRef} className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gross Annual Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(result.grossAnnual, currencyCode, currencySymbol)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tax ({formatPercentage(result.taxes.effectiveRate)})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(result.taxes.total, currencyCode, currencySymbol)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Annual Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(result.netAnnual, currencyCode, currencySymbol)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pay Period Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Frequency</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Taxes</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Weekly (52x)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.grossAnnual / 52, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {formatCurrency(result.taxes.total / 52, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(result.breakdown.weekly, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bi-weekly (26x)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.grossAnnual / 26, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {formatCurrency(result.taxes.total / 26, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(result.breakdown.biweekly, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Monthly (12x)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.grossAnnual / 12, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {formatCurrency(result.taxes.total / 12, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(result.breakdown.monthly, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-medium">Annually</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.grossAnnual, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {formatCurrency(result.taxes.total, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(result.breakdown.annually, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxes Tab */}
          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Federal Tax</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(result.taxes.federal.amount, currencyCode, currencySymbol)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(result.taxes.federal.rate)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Regional Tax</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(result.taxes.regional.amount, currencyCode, currencySymbol)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(result.taxes.regional.rate)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Social Security</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(result.taxes.social.amount, currencyCode, currencySymbol)}
                    </p>
                  </div>
                </div>

                {result.taxes.federal.brackets.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tax Brackets</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Income Range</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead className="text-right">Tax</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.taxes.federal.brackets.map((bracket, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {formatCurrency(bracket.min, currencyCode, currencySymbol)} - {' '}
                              {bracket.max === Infinity 
                                ? '∞' 
                                : formatCurrency(bracket.max, currencyCode, currencySymbol)}
                            </TableCell>
                            <TableCell>{formatPercentage(bracket.rate)}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(bracket.tax, currencyCode, currencySymbol)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {Object.keys(result.taxes.social.breakdown).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Social Security Breakdown</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(result.taxes.social.breakdown).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(value, currencyCode, currencySymbol)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deductions Tab */}
          <TabsContent value="deductions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pre-tax Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Annual</TableHead>
                      <TableHead className="text-right">Per Pay Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Retirement (401k/IRA)</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.retirement401k, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.retirement401k / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Health Insurance</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.healthInsurance, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.healthInsurance / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>HSA</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.hsa, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.hsa / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FSA</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.fsa, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.fsa / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Other</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.other, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.other / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total Pre-tax</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.total, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.preTax.total / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Post-tax Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Annual</TableHead>
                      <TableHead className="text-right">Per Pay Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Other Post-tax</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.postTax.other, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.postTax.other / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total Post-tax</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.postTax.total, currencyCode, currencySymbol)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.deductions.postTax.total / result.payPeriodsPerYear, currencyCode, currencySymbol)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taxChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taxChartData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currencyCode, currencySymbol)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deductions Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deductionChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deductionChartData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currencyCode, currencySymbol)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Net Income by Pay Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={payPeriodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value, currencyCode, currencySymbol)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currencyCode, currencySymbol)} />
                      <Bar dataKey="amount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CalculatorResults;
