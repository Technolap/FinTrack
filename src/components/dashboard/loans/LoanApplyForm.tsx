import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { formatAmountWithCommas } from '../../../utils/formatters';

interface LoanApplyFormProps {
  onApply: (data: LoanFormData) => Promise<void>;
  onCancel: () => void;
  currency: string;
  initialData?: LoanFormData;
}

export interface LoanFormData {
  name: string;
  amount: number;
  purpose: string;
  duration: number;
}

export const LoanApplyForm: React.FC<LoanApplyFormProps> = ({ 
  onApply, 
  onCancel,
  currency,
  initialData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoanFormData>({
    defaultValues: initialData || {
      duration: 12,
    }
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^\d]/g, '');
    
    // Format with commas
    const formatted = formatAmountWithCommas(value);
    setFormattedAmount(formatted);
    
    // Store the numeric value
    setValue('amount', parseInt(value) || 0);
  };
  
  // Initialize formatted amount if there's initial data
  React.useEffect(() => {
    if (initialData?.amount) {
      setFormattedAmount(formatAmountWithCommas(initialData.amount.toString()));
    }
  }, [initialData]);

  const onSubmit = async (data: LoanFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await onApply(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to submit loan application');
    } finally {
      setIsLoading(false);
    }
  };

  const loanPurposes = [
    { value: 'personal', label: 'Personal Loan' },
    { value: 'auto', label: 'Auto Loan' },
    { value: 'home', label: 'Home Loan' },
    { value: 'education', label: 'Education Loan' },
    { value: 'business', label: 'Business Loan' },
    { value: 'debt_consolidation', label: 'Debt Consolidation' },
  ];

  const loanTerms = [
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' },
    { value: '48', label: '48 Months' },
    { value: '60', label: '60 Months' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Loan Name"
        placeholder="e.g. New Car Loan"
        error={errors.name?.message}
        {...register('name', {
          required: 'Loan name is required',
        })}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loan Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            value={formattedAmount}
            onChange={handleAmountChange}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>
      
      <Select
        label="Loan Purpose"
        error={errors.purpose?.message}
        options={loanPurposes}
        {...register('purpose', {
          required: 'Please select a loan purpose',
        })}
      />
      
      <Select
        label="Loan Term"
        error={errors.duration?.message}
        options={loanTerms}
        {...register('duration', {
          required: 'Please select a loan term',
        })}
      />
      
      <div className="flex space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Apply for Loan
        </Button>
      </div>
    </form>
  );
};
