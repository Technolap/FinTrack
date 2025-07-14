import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanks } from '../context/BankContext';
import { getCountryByCode } from '../data/countries';
import { BankCard } from '../components/dashboard/BankCard';
import { deleteBank } from '../context/BankContext';
import { TransactionItem } from '../components/dashboard/TransactionItem';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { AddTransactionModal } from '../components/dashboard/AddTransactionModal';
import { AddBankModal } from '../components/dashboard/AddBankModal';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { EmptyState } from '../components/dashboard/EmptyState';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { banks, transactions, addTransaction, addBank, deleteBank, loans } = useBanks();
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | undefined>(
    banks.length > 0 ? banks[0].id : undefined
  );

  if (!user) {
    return null;
  }

  const country = getCountryByCode(user.country);
  const currency = country?.currency || 'USD';

  const totalBalance = banks.reduce((sum, bank) => sum + bank.balance, 0);
  const filteredTransactions = selectedBankId
    ? transactions.filter(t => t.bankId === selectedBankId)
    : transactions;
  const selectedBank = banks.find(bank => bank.id === selectedBankId);

  const hasAccounts = banks.length > 0;
  const hasTransactions = transactions.length > 0;
  const hasLoans = loans.length > 0;

  return (
    <DashboardLayout title="Dashboard">
      {/* Summary Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Total Balance</h2>
              <p className="mt-1 text-3xl font-semibold text-indigo-600">
                {formatCurrency(totalBalance, currency)}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 space-x-3">
              <Button
                onClick={() => setShowAddBankModal(true)}
                variant="outline"
              >
                Add Account
              </Button>
              <Button
                onClick={() => setShowAddTransactionModal(true)}
                disabled={!hasAccounts}
              >
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Cards Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Accounts</h2>
          {hasAccounts && (
            <Link 
              to="/dashboard/accounts"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          )}
        </div>
        
        {!hasAccounts ? (
          <EmptyState 
            type="accounts" 
            onAction={() => setShowAddBankModal(true)} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.slice(0, 3).map(bank => (
              <BankCard
                key={bank.id}
                bank={bank}
                onClick={() => setSelectedBankId(bank.id)}
                onDelete={() => deleteBank(bank.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      {hasAccounts && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spending Chart */}
          <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Spending Overview</h3>
              {hasTransactions ? (
                <SpendingChart 
                  transactions={filteredTransactions} 
                  currency={currency} 
                />
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Add transactions to see your spending overview</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedBank 
                    ? `Transactions: ${selectedBank.name}` 
                    : 'Recent Transactions'}
                </h3>
                {selectedBank && (
                  <button
                    onClick={() => setSelectedBankId(undefined)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View All
                  </button>
                )}
              </div>
              
              {!hasTransactions ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No transactions found</p>
                  <Button 
                    onClick={() => setShowAddTransactionModal(true)}
                    className="mt-4"
                    size="sm"
                  >
                    Add Your First Transaction
                  </Button>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[450px] space-y-1">
                  {filteredTransactions.slice(0, 20).map(transaction => {
                    const bank = banks.find(b => b.id === transaction.bankId)!;
                    return (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        bank={bank}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loans Section - Preview */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Loans</h2>
          <Link 
            to="/dashboard/loans"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View All
          </Link>
        </div>
        
        {!hasLoans ? (
          <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-4">You don't have any active loans</p>
            <Link to="/dashboard/loans">
              <Button>Apply for a Loan</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.slice(0, 3).map(loan => (
              <div 
                key={loan.id} 
                className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white rounded-lg shadow-lg p-4"
              >
                <h3 className="font-semibold">{loan.name}</h3>
                <p className="text-xl font-bold mt-1">{formatCurrency(loan.balance, currency)}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Due: {loan.paymentDue}</span>
                  <span>APR: {loan.apr}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddTransactionModal && (
        <AddTransactionModal
          banks={banks}
          onAddTransaction={addTransaction}
          onClose={() => setShowAddTransactionModal(false)}
          defaultBankId={selectedBankId}
        />
      )}

      {showAddBankModal && (
        <AddBankModal
          onAddBank={addBank}
          onClose={() => setShowAddBankModal(false)}
          defaultCurrency={currency}
        />
      )}
    </DashboardLayout>
  );
};
