import React from 'react';
import SEO from '@/components/SEO';

const Terms: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <SEO
        title="Terms of Service - Global Paycheck Calculator"
        description="Our terms of service outline the rules and regulations for using our paycheck calculator."
      />

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          By accessing and using the Global Paycheck Calculator website, you accept and agree to 
          be bound by the terms and provisions of this agreement.
        </p>

        <h2>Use of the Service</h2>
        <p>
          Global Paycheck Calculator provides a free online tool for estimating net salary and 
          tax deductions. The service is provided "as is" and is free to use for personal and 
          commercial purposes.
        </p>

        <h2>Accuracy of Information</h2>
        <p>
          While we strive to provide accurate and up-to-date tax information, we make no 
          representations or warranties of any kind, express or implied, about the completeness, 
          accuracy, reliability, suitability, or availability of the calculator or the information 
          it provides.
        </p>
        <p>
          <strong>Important:</strong> Tax calculations are estimates based on standard tax brackets 
          and rates. Individual tax situations may vary significantly based on credits, deductions, 
          filing status, and other factors not captured by our calculator. Always consult a qualified 
          tax professional for personalized tax advice.
        </p>

        <h2>Limitations</h2>
        <p>
          In no event shall Global Paycheck Calculator be liable for any loss or damage including 
          without limitation, indirect or consequential loss or damage, arising from:
        </p>
        <ul>
          <li>Use of or reliance on our calculator</li>
          <li>Decisions made based on calculator results</li>
          <li>Tax liabilities or penalties</li>
          <li>Any other matter relating to our service</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to text, graphics, logos, and 
          software, is the property of Global Paycheck Calculator and is protected by copyright 
          and other intellectual property laws.
        </p>

        <h2>User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the service</li>
          <li>Scrape or automate access to the service</li>
          <li>Submit false or misleading information</li>
        </ul>

        <h2>Modifications</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be effective 
          immediately upon posting to this page. Your continued use of the service constitutes 
          acceptance of the modified terms.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with applicable laws, 
          without regard to conflict of law principles.
        </p>

        <h2>Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@paycheckcalculator.com" className="text-primary hover:underline">
            support@paycheckcalculator.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Terms;
