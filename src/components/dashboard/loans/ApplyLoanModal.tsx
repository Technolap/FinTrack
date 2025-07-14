import React from 'react';
import { LoanApplyForm, LoanFormData } from './LoanApplyForm';

interface ApplyLoanModalProps {
  onApply: (data: LoanFormData) => Promise<void>;
  onClose: () => void;
  currency: string;
}

export const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({ 
  onApply, 
  onClose,
  currency
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Apply for a Loan</h3>
        </div>
        
        <div className="px-6 py-4">
          <LoanApplyForm 
            onApply={onApply} 
            onCancel={onClose}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
};
