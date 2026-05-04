import React, { useState, useContext, useEffect } from 'react';
import { Menu, X, Moon, Sun, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { RouterContext } from '@/App';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentPage, setCurrentPage } = useContext(RouterContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: 'home', label: 'Home' },
    { to: 'calculator', label: 'Calculator' },
    { to: 'countries', label: 'Countries' },
    { to: 'blog', label: 'Blog' },
    { to: 'about', label: 'About' },
  ];

  const isActive = (path: string) => currentPage === path;

  const handleNavClick = (to: string) => {
    setCurrentPage(to);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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
            <div className="hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                PaycheckCalc
              </span>
              <span className="block text-[10px] text-muted-foreground -mt-1 tracking-wider uppercase">
                Global Salary Tool
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.to) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-muted"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-500" />
              )}
            </Button>

            <Button 
              className="hidden sm:flex btn-shine rounded-full px-5"
              onClick={() => handleNavClick('calculator')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 space-y-1 border-t border-border/50">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition-all text-left flex items-center ${
                  isActive(link.to) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
            <div className="pt-2">
              <Button 
                className="w-full btn-shine"
                onClick={() => handleNavClick('calculator')}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Start Calculating
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
