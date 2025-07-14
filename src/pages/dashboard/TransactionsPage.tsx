import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanks } from '../../context/BankContext';

import { TransactionItem } from '../../components/dashboard/TransactionItem';
import { AddTransactionModal } from '../../components/dashboard/AddTransactionModal';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { Button } from '../../components/ui/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { banks, transactions, addTransaction } = useBanks();
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  if (!user) {
    return null;
  }



  return (
    <DashboardLayout title="Transactions">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
        <Button 
          onClick={() => setShowAddTransactionModal(true)}
          disabled={banks.length === 0}
        >
          Add Transaction
        </Button>
      </div>

      {transactions.length === 0 ? (
        banks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">You need to add an account before you can add transactions.</p>
          </div>
        ) : (
          <EmptyState 
            type="transactions" 
            onAction={() => setShowAddTransactionModal(true)} 
          />
        )
      ) : (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-y-auto max-h-[600px] space-y-1">
              {transactions.map(transaction => {
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
          </div>
        </div>
      )}

      {showAddTransactionModal && (
        <AddTransactionModal
          banks={banks}
          onAddTransaction={addTransaction}
          onClose={() => setShowAddTransactionModal(false)}
        />
      )}
    </DashboardLayout>
  );
};
