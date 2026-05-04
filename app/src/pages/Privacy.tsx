import React from 'react';
import SEO from '@/components/SEO';

const Privacy: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <SEO
        title="Privacy Policy - Global Paycheck Calculator"
        description="Our privacy policy explains how we handle your data and protect your privacy."
      />

      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p>
          At Global Paycheck Calculator, we take your privacy seriously. This Privacy Policy 
          explains how we collect, use, and protect your personal information when you use our website.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Usage Data:</strong> We collect anonymous data about how you use our calculator, 
            including the countries selected and salary ranges entered. This data is aggregated and 
            cannot be used to identify you personally.
          </li>
          <li>
            <strong>Contact Information:</strong> When you submit our contact form, we collect your 
            name, email address, and message content to respond to your inquiry.
          </li>
          <li>
            <strong>Technical Data:</strong> We may collect your IP address, browser type, and device 
            information for security and analytics purposes.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our paycheck calculator services</li>
          <li>Respond to your inquiries and support requests</li>
          <li>Analyze usage patterns to improve our website</li>
          <li>Prevent fraud and ensure security</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal 
          information. Salary data entered into our calculator is not stored on our servers - 
          calculations are performed in real-time and the data is discarded immediately after.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies to enhance your browsing experience, including remembering your theme 
          preferences (light/dark mode). You can disable cookies in your browser settings, but 
          this may affect some functionality.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We may use third-party analytics services to help us understand how our website is used. 
          These services may collect anonymous usage data.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of communications</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle your data, 
          please contact us at{' '}
          <a href="mailto:support@paycheckcalculator.com" className="text-primary hover:underline">
            support@paycheckcalculator.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
