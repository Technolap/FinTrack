import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { BankProvider } from './context/BankContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/dashboard/AccountsPage';
import { TransactionsPage } from './pages/dashboard/TransactionsPage';
import { LoansPage } from './pages/dashboard/LoansPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './index.css';

// Initialize React Query client
const queryClient = new QueryClient();

export function App() {
  // Load Google Fonts
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BankProvider>
          <Router>
            <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/dashboard/accounts"
                  element={
                    <ProtectedRoute>
                      <AccountsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/dashboard/transactions"
                  element={
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/dashboard/loans"
                  element={
                    <ProtectedRoute>
                      <LoansPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </BankProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
