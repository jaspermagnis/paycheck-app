import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CalculatorForm from '@/components/CalculatorForm';
import CalculatorResults from '@/components/CalculatorResults';
import type { CalculatorResult, Country } from '@/types';
import SEO from '@/components/SEO';

const Calculator: React.FC = () => {
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCountryData, setSelectedCountryData] = useState<Country | null>(null);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setResult(null);
  };

  const handleCalculate = (calculationResult: CalculatorResult, countryData: Country | null) => {
    setResult(calculationResult);
    setSelectedCountryData(countryData);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Paycheck Calculator',
    description: `Calculate your net salary and taxes for ${selectedCountryData?.name || 'your country'}.`,
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How accurate is the paycheck calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our calculator uses current tax rates and brackets for each country. However, individual circumstances may vary, so we recommend consulting a tax professional for personalized advice.',
          },
        },
        {
          '@type': 'Question',
          name: 'What deductions are included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The calculator includes federal income tax, social security contributions, Medicare, and optional pre-tax deductions like retirement contributions and health insurance.',
          },
        },
      ],
    },
  };

  return (
    <div className="space-y-8">
      <SEO
        title={`Paycheck Calculator - ${selectedCountryData?.name || 'Global'} Salary & Tax Calculator`}
        description={`Calculate your net salary, taxes, and take-home pay for ${selectedCountryData?.name || 'any country'}. Free paycheck calculator with detailed tax breakdowns.`}
        schema={schema}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <CalculatorIcon className="h-8 w-8 text-primary" />
          Paycheck Calculator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate your net salary, tax deductions, and take-home pay. 
          Select your country and enter your income details below.
        </p>
      </div>

      {/* Disclaimer */}
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Important Notice</AlertTitle>
        <AlertDescription className="text-amber-700">
          Tax calculations are estimates based on current rates and may not reflect your exact tax liability. 
          Individual circumstances vary. Please consult a qualified tax professional for personalized advice.
        </AlertDescription>
      </Alert>

      {/* Calculator Form */}
      <CalculatorForm
        onCalculate={handleCalculate}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
      />

      {/* Results */}
      {result && (
        <div id="results" className="scroll-mt-20">
          <CalculatorResults result={result} country={selectedCountryData} />
        </div>
      )}

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">How accurate is this calculator?</h3>
            <p className="text-muted-foreground text-sm">
              We use official tax brackets and rates for each country, updated regularly. 
              However, individual tax situations may vary based on credits, deductions, and other factors.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">What is taxable income?</h3>
            <p className="text-muted-foreground text-sm">
              Taxable income is your gross income minus pre-tax deductions like retirement 
              contributions, health insurance, and other eligible deductions.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Why are my results different from my actual paycheck?</h3>
            <p className="text-muted-foreground text-sm">
              Differences may occur due to additional withholdings, state/local taxes, 
              tax credits, or other individual circumstances not captured in the calculator.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Can I save my calculation?</h3>
            <p className="text-muted-foreground text-sm">
              Yes! You can download your results as a PDF, print them, or copy the summary 
              to your clipboard using the buttons above your results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
