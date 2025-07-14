import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanks } from '../../context/BankContext';
import { getCountryByCode } from '../../data/countries';
import { BankCard } from '../../components/dashboard/BankCard';
import { AddBankModal } from '../../components/dashboard/AddBankModal';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { Button } from '../../components/ui/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const AccountsPage: React.FC = () => {
  const { user } = useAuth();
  const { banks, addBank, deleteBank } = useBanks();
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return null;
  }

  const country = getCountryByCode(user.country);
  const currency = country?.currency || 'USD';

  const handleDeleteBank = async (bankId: string) => {
    if (window.confirm('Are you sure you want to delete this account? This will also delete all transactions associated with this account.')) {
      setIsDeleting(true);
      try {
        await deleteBank(bankId);
      } catch (error) {
        console.error('Error deleting bank:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <DashboardLayout title="Accounts">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
        <Button 
          onClick={() => setShowAddBankModal(true)}
          disabled={isDeleting}
        >
          Add Account
        </Button>
      </div>

      {banks.length === 0 ? (
        <EmptyState 
          type="accounts" 
          onAction={() => setShowAddBankModal(true)} 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banks.map(bank => (
            <BankCard 
              key={bank.id} 
              bank={bank} 
              onDelete={() => handleDeleteBank(bank.id)}
            />
          ))}
        </div>
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
