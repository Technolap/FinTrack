import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bank } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface AddBankModalProps {
  onAddBank: (bank: Omit<Bank, 'id' | 'userId'>) => Promise<Bank>;
  onClose: () => void;
  defaultCurrency: string;
}

interface BankFormData {
  name: string;
  type: Bank['type'];
  balance: string;
  lastFour: string;
  color: string;
}

export const AddBankModal: React.FC<AddBankModalProps> = ({
  onAddBank,
  onClose,
  defaultCurrency,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BankFormData>({
    defaultValues: {
      type: 'checking',
      color: '#4F46E5',
    },
  });

  const selectedType = watch('type');
  const selectedColor = watch('color');

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
  ];

  const colorOptions = [
    { value: '#4F46E5', label: 'Indigo' },
    { value: '#10B981', label: 'Emerald' },
    { value: '#EF4444', label: 'Red' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#6366F1', label: 'Violet' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#8B5CF6', label: 'Purple' },
  ];

  const onSubmit = async (data: BankFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const balanceValue = parseFloat(data.balance);
      
      if (isNaN(balanceValue)) {
        throw new Error('Please enter a valid balance amount');
      }
      
      // For credit cards, if positive balance is entered, make it negative
      const finalBalance = data.type === 'credit' && balanceValue > 0 
        ? -balanceValue 
        : balanceValue;
      
      await onAddBank({
        name: data.name,
        type: data.type,
        balance: finalBalance,
        currency: defaultCurrency,
        color: data.color,
        lastFour: data.lastFour,
      });
      
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to add account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New Account</h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Input
              label="Account Name"
              placeholder="e.g. Main Checking"
              error={errors.name?.message}
              {...register('name', {
                required: 'Account name is required',
              })}
            />
            
            <Select
              label="Account Type"
              error={errors.type?.message}
              options={accountTypes}
              {...register('type', {
                required: 'Please select an account type',
              })}
            />
            
            <Input
              label={selectedType === 'credit' ? 'Current Balance (negative for amount owed)' : 'Current Balance'}
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.balance?.message}
              {...register('balance', {
                required: 'Balance is required',
              })}
            />
            
            <Input
              label="Last 4 Digits"
              placeholder="e.g. 1234"
              error={errors.lastFour?.message}
              {...register('lastFour', {
                required: 'Last 4 digits are required',
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Please enter exactly 4 digits',
                },
              })}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Color
              </label>
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map(color => (
                  <label
                    key={color.value}
                    className={`
                      w-full aspect-square rounded-full cursor-pointer
                      flex items-center justify-center
                      ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : ''}
                    `}
                    style={{ backgroundColor: color.value }}
                  >
                    <input
                      type="radio"
                      value={color.value}
                      className="sr-only"
                      {...register('color', {
                        required: 'Please select a color',
                      })}
                    />
                    {selectedColor === color.value && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="white" 
                        className="w-4 h-4"
                      >
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
            >
              Add Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
