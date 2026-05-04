import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Shield, Heart, PiggyBank, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculatorApi } from '@/services/api';
import type { Country, CalculatorResult } from '@/types';

interface CalculatorFormProps {
  onCalculate: (result: CalculatorResult, country: Country | null) => void;
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  onCalculate,
  selectedCountry,
  onCountryChange,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState<Country | null>(null);

  // Form state
  const [grossSalary, setGrossSalary] = useState('60000');
  const [bonus, setBonus] = useState('0');
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | 'annually'>('annually');
  
  // Pre-tax deductions
  const [retirement401k, setRetirement401k] = useState('0');
  const [healthInsurance, setHealthInsurance] = useState('0');
  const [hsa, setHsa] = useState('0');
  const [fsa, setFsa] = useState('0');
  const [otherPreTax, setOtherPreTax] = useState('0');
  
  // Post-tax deductions
  const [otherPostTax, setOtherPostTax] = useState('0');

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const country = countries.find(c => c.code === selectedCountry);
    setSelectedCountryData(country || null);
  }, [selectedCountry, countries]);

  const fetchCountries = async () => {
    try {
      const response = await calculatorApi.getCountries();
      setCountries(response.data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const input = {
        grossSalary: parseFloat(grossSalary) || 0,
        bonus: parseFloat(bonus) || 0,
        payFrequency,
        countryCode: selectedCountry,
        preTaxDeductions: {
          retirement401k: parseFloat(retirement401k) || 0,
          healthInsurance: parseFloat(healthInsurance) || 0,
          hsa: parseFloat(hsa) || 0,
          fsa: parseFloat(fsa) || 0,
          other: parseFloat(otherPreTax) || 0,
        },
        postTaxDeductions: {
          other: parseFloat(otherPostTax) || 0,
        },
      };

      const response = await calculatorApi.calculate(input);
      onCalculate(response.data, selectedCountryData);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Country & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Income Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.currencySymbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payFrequency">Pay Frequency</Label>
              <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">
                Gross Salary ({selectedCountryData?.currencySymbol})
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="grossSalary"
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  className="pl-10"
                  placeholder="Enter gross salary"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus">
                Annual Bonus ({selectedCountryData?.currencySymbol})
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bonus"
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  className="pl-10"
                  placeholder="Enter bonus"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-tax Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Pre-tax Deductions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="retirement" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="retirement">Retirement</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="retirement" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="retirement401k">
                  Retirement Contribution ({selectedCountryData?.currencySymbol}/year)
                </Label>
                <div className="relative">
                  <PiggyBank className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="retirement401k"
                    type="number"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(e.target.value)}
                    className="pl-10"
                    placeholder="e.g., 6000"
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  401(k), IRA, or other retirement plan contributions
                </p>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="healthInsurance">
                    Health Insurance ({selectedCountryData?.currencySymbol}/year)
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="healthInsurance"
                      type="number"
                      value={healthInsurance}
                      onChange={(e) => setHealthInsurance(e.target.value)}
                      className="pl-10"
                      placeholder="e.g., 2400"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsa">HSA ({selectedCountryData?.currencySymbol}/year)</Label>
                    <Input
                      id="hsa"
                      type="number"
                      value={hsa}
                      onChange={(e) => setHsa(e.target.value)}
                      placeholder="e.g., 3650"
                      min="0"
                      step="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fsa">FSA ({selectedCountryData?.currencySymbol}/year)</Label>
                    <Input
                      id="fsa"
                      type="number"
                      value={fsa}
                      onChange={(e) => setFsa(e.target.value)}
                      placeholder="e.g., 2850"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="otherPreTax">
                  Other Pre-tax Deductions ({selectedCountryData?.currencySymbol}/year)
                </Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otherPreTax"
                    type="number"
                    value={otherPreTax}
                    onChange={(e) => setOtherPreTax(e.target.value)}
                    className="pl-10"
                    placeholder="e.g., 0"
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Commuter benefits, dependent care, etc.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Post-tax Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Post-tax Deductions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otherPostTax">
              Other Post-tax Deductions ({selectedCountryData?.currencySymbol}/year)
            </Label>
            <Input
              id="otherPostTax"
              type="number"
              value={otherPostTax}
              onChange={(e) => setOtherPostTax(e.target.value)}
              placeholder="e.g., 0"
              min="0"
              step="100"
            />
            <p className="text-xs text-muted-foreground">
              Union dues, garnishments, charitable contributions, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center space-x-2">
            <span className="animate-spin">⏳</span>
            <span>Calculating...</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Calculate Paycheck</span>
          </span>
        )}
      </Button>
    </form>
  );
};

export default CalculatorForm;
