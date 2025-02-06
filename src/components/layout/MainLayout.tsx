import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import TopNavigation from './TopNavigation';
import { ToastContainer } from '../common/Toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      {user && !isAuthPage && <TopNavigation />}
      <main className={user && !isAuthPage ? 'pt-16' : ''}>
        {children}
      </main>
      <ToastContainer />
    </div>
  );
};

export default MainLayout; 