import { useContext } from 'react';
import { RouterContext } from '@/App';

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterContext.Provider');
  }
  return context;
};

export const useNavigate = () => {
  const { setCurrentPage, setPageParams } = useContext(RouterContext);
  
  return (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    if (params) {
      setPageParams(params);
    }
    window.scrollTo(0, 0);
  };
};

export const useParams = () => {
  const { pageParams } = useContext(RouterContext);
  return pageParams;
};

export const useSearchParams = () => {
  const { pageParams, setPageParams } = useContext(RouterContext);
  
  const get = (key: string) => pageParams[key];
  
  const set = (params: Record<string, string>) => {
    setPageParams({ ...pageParams, ...params });
  };
  
  return [{
    get,
    toString: () => new URLSearchParams(pageParams).toString(),
  }, set] as const;
};

export const Link: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({ 
  to, 
  children, 
  className 
}) => {
  const { setCurrentPage } = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage(to);
    window.scrollTo(0, 0);
  };
  
  return (
    <a href={`#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
