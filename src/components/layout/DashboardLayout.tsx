import React from 'react';
import { SideNavigation } from '../dashboard/SideNavigation';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  title
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow h-16 flex items-center px-6">
          <h1 className="text-xl font-medium text-gray-900">
            {title || 'Dashboard'}
          </h1>
        </header>
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
