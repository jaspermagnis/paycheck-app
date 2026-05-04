import React from 'react';
import { Calculator, Globe, TrendingUp, Shield, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';

const About: React.FC = () => {
  const values = [
    {
      icon: <Accuracy className="h-6 w-6" />,
      title: 'Accuracy',
      description: 'We use official tax data and update our calculations regularly to ensure precision.',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Accessibility',
      description: 'Our calculator is free and available to everyone, everywhere in the world.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Privacy',
      description: 'We don\'t store personal salary information. Your data stays private.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Transparency',
      description: 'We show you exactly how taxes are calculated with detailed breakdowns.',
    },
  ];

  const stats = [
    { label: 'Countries Supported', value: '100+' },
    { label: 'Calculations Made', value: '1M+' },
    { label: 'Happy Users', value: '500K+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Global Paycheck Calculator',
    description: 'Learn about our mission to provide accurate paycheck calculations worldwide.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Global Paycheck Calculator',
      description: 'Free paycheck calculator supporting 100+ countries worldwide.',
      url: 'https://paycheckcalculator.com',
    },
  };

  return (
    <div className="space-y-12">
      <SEO
        title="About Us - Global Paycheck Calculator"
        description="Learn about our mission to provide accurate, free paycheck calculations for everyone worldwide."
        schema={schema}
      />

      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to make paycheck calculations simple, accurate, and accessible 
          to everyone, everywhere in the world.
        </p>
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            Global Paycheck Calculator was born from a simple observation: understanding your 
            take-home pay shouldn't be complicated. Whether you're considering a job offer in 
            a new country, planning your budget, or just curious about where your money goes, 
            you deserve clear, accurate information.
          </p>
          <p className="text-muted-foreground">
            What started as a simple calculator for a few countries has grown into a comprehensive 
            platform supporting 100+ countries worldwide. We continuously update our tax data to 
            ensure you get the most accurate calculations possible.
          </p>
          <p className="text-muted-foreground">
            Today, millions of users trust our calculator for their salary planning needs. 
            We're proud to be a free resource that helps people make informed financial decisions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Calculator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Global Coverage</h3>
            <p className="text-muted-foreground">
              We support 100+ countries with accurate local tax rules and currency support.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Detailed Breakdowns</h3>
            <p className="text-muted-foreground">
              See exactly how much goes to taxes, deductions, and your take-home pay with 
              comprehensive charts and tables.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Always Free</h3>
            <p className="text-muted-foreground">
              No hidden fees, no premium features. Everything is free and accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Have Questions?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to us for support, feedback, or partnership inquiries.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

// Helper component for the Accuracy icon
const Accuracy: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default About;
