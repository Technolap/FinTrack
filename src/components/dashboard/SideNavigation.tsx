import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Banknote, BarChart3, CreditCard, LayoutDashboard, LogOut, User, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SideNavigation: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/dashboard/accounts', 
      label: 'Accounts', 
      icon: <CreditCard size={20} /> 
    },
    { 
      path: '/dashboard/transactions', 
      label: 'Transactions', 
      icon: <BarChart3 size={20} /> 
    },
    { 
      path: '/dashboard/loans', 
      label: 'Loans', 
      icon: <Banknote size={20} /> 
    },
    { 
      path: '/dashboard/profile', 
      label: 'Profile', 
      icon: <User size={20} /> 
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-64 fixed left-0 top-0 z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-900">FinTrack</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                  group transition-all duration-200 
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-600'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="mr-3 text-gray-500">
            <LogOut size={20} />
          </span>
          Log Out
        </button>
      </div>
    </div>
  );
};
