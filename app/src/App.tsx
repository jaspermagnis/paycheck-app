import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Calculator from '@/pages/Calculator';
import Countries from '@/pages/Countries';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';

// Simple router state
export const RouterContext = React.createContext<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pageParams: Record<string, string>;
  setPageParams: (params: Record<string, string>) => void;
}>({
  currentPage: 'home',
  setCurrentPage: () => {},
  pageParams: {},
  setPageParams: () => {},
});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'calculator':
        return <Calculator />;
      case 'countries':
        return <Countries />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'blog':
        return <Blog />;
      case 'blog-post':
        return <BlogPost />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider>
      <RouterContext.Provider value={{ currentPage, setCurrentPage, pageParams, setPageParams }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-16 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
              {renderPage()}
            </div>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors />
      </RouterContext.Provider>
    </ThemeProvider>
  );
};

export default App;
