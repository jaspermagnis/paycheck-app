import React, { useContext } from 'react';
import { Calculator, Mail, MapPin, Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { RouterContext } from '@/App';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { setCurrentPage } = useContext(RouterContext);

  const footerLinks = {
    product: [
      { to: 'calculator', label: 'Calculator' },
      { to: 'countries', label: 'Countries' },
      { to: 'blog', label: 'Blog' },
    ],
    company: [
      { to: 'about', label: 'About Us' },
      { to: 'contact', label: 'Contact' },
    ],
    legal: [
      { to: 'privacy', label: 'Privacy Policy' },
      { to: 'terms', label: 'Terms of Service' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const handleNavClick = (to: string) => {
    setCurrentPage(to);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="relative bg-muted/30 border-t">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold">PaycheckCalc</span>
            </button>
            <p className="text-sm text-muted-foreground max-w-xs">
              Calculate your net salary, taxes, and deductions accurately for any country worldwide. Free, fast, and accurate.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>support@paycheckcalculator.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Global Service</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-background border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <button
                    onClick={() => handleNavClick(link.to)}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <button
                    onClick={() => handleNavClick(link.to)}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <button
                    onClick={() => handleNavClick(link.to)}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors flex items-center group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            {currentYear} PaycheckCalc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <p className="text-xs text-muted-foreground">
              Tax calculations are estimates. Consult a tax professional for advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
