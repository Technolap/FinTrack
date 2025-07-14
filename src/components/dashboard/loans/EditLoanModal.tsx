import React, { useState } from 'react';
import { Loan } from '../../../types';
import { LoanApplyForm, LoanFormData } from './LoanApplyForm';

interface EditLoanModalProps {
  loan: Loan;
  onUpdate: (id: string, data: LoanFormData) => Promise<void>;
  onClose: () => void;
  currency: string;
}

export const EditLoanModal: React.FC<EditLoanModalProps> = ({ 
  loan, 
  onUpdate, 
  onClose,
  currency
}) => {
  const [error, setError] = useState<string | null>(null);

  // Convert loan to form data format
  const initialFormData: LoanFormData = {
    name: loan.name,
    amount: loan.amount,
    purpose: loan.purpose || 'personal',
    duration: parseInt(loan.duration?.split(' ')[0] || '12'),
  };

  const handleUpdate = async (data: LoanFormData) => {
    try {
      await onUpdate(loan.id, data);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to update loan');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Edit Loan</h3>
        </div>
        
        <div className="px-6 py-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}
          
          <LoanApplyForm 
            onApply={handleUpdate} 
            onCancel={onClose}
            currency={currency}
            initialData={initialFormData}
          />
        </div>
      </div>
    </div>
  );
};
