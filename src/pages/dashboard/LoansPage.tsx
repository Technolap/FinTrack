import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanks } from '../../context/BankContext';
import { getCountryByCode } from '../../data/countries';
import { LoanCard } from '../../components/dashboard/loans/LoanCard';
import { ApplyLoanModal } from '../../components/dashboard/loans/ApplyLoanModal';
import { EditLoanModal } from '../../components/dashboard/loans/EditLoanModal';
import { ConfirmationModal } from '../../components/dashboard/ConfirmationModal';
import { LoanFormData } from '../../components/dashboard/loans/LoanApplyForm';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { Button } from '../../components/ui/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loan } from '../../types';

export const LoansPage: React.FC = () => {
  const { user } = useAuth();
  const { loans, applyLoan, updateLoan, deleteLoan } = useBanks();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return null;
  }

  const country = getCountryByCode(user.country);
  const currency = country?.currency || 'USD';

  const handleApplyLoan = async (data: LoanFormData) => {
    await applyLoan({
      name: data.name,
      amount: data.amount,
      balance: data.amount,
      purpose: data.purpose,
      duration: `${data.duration} months`,
      apr: (5 + Math.random() * 10).toFixed(2),
      paymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      currency
    });
    setShowApplyModal(false);
  };

  const handleEditLoan = async (id: string, data: LoanFormData) => {
    await updateLoan(id, {
      name: data.name,
      amount: data.amount,
      balance: data.amount, // Note: In a real app, you might want to keep the existing balance
      purpose: data.purpose,
      duration: `${data.duration} months`,
    });
    setShowEditModal(false);
    setSelectedLoan(null);
  };

  const handleDeleteLoan = async () => {
    if (!selectedLoan) return;
    
    setIsDeleting(true);
    try {
      await deleteLoan(selectedLoan.id);
      setShowDeleteModal(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Failed to delete loan:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Loans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Loans</h1>
        <Button onClick={() => setShowApplyModal(true)}>Apply for a Loan</Button>
      </div>

      {loans.length === 0 ? (
        <EmptyState 
          type="loans" 
          title="No loans yet"
          description="Apply for a loan to get started"
          onAction={() => setShowApplyModal(true)} 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan} 
              onEdit={() => {
                setSelectedLoan(loan);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setSelectedLoan(loan);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Apply Loan Modal */}
      {showApplyModal && (
        <ApplyLoanModal
          onApply={handleApplyLoan}
          onClose={() => setShowApplyModal(false)}
          currency={currency}
        />
      )}

      {/* Edit Loan Modal */}
      {showEditModal && selectedLoan && (
        <EditLoanModal
          loan={selectedLoan}
          onUpdate={handleEditLoan}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLoan(null);
          }}
          currency={currency}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedLoan && (
        <ConfirmationModal
          title="Delete Loan"
          message={`Are you sure you want to delete "${selectedLoan.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteLoan}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedLoan(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};
