import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bank, Transaction, TransactionCategory } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatAmountWithCommas } from '../../utils/formatters';

interface AddTransactionModalProps {
  banks: Bank[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<Transaction>;
  onClose: () => void;
  defaultBankId?: string;
}

interface TransactionFormData {
  bankId: string;
  amount: string;
  description: string;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  banks,
  onAddTransaction,
  onClose,
  defaultBankId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formattedAmount, setFormattedAmount] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      bankId: defaultBankId || (banks.length > 0 ? banks[0].id : ''),
      type: 'expense',
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    },
  });

  const selectedType = watch('type');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    // Format with commas
    const formatted = formatAmountWithCommas(value);
    setFormattedAmount(formatted);
    
    // Store the numeric value
    setValue('amount', value);
  };

  const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'salary', label: 'Salary' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' },
  ];

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const amountValue = parseFloat(data.amount.replace(/,/g, ''));
      
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount greater than zero');
      }
      
      // Convert amount to negative for expenses
      const finalAmount = data.type === 'expense' 
        ? -Math.abs(amountValue) 
        : Math.abs(amountValue);
      
      await onAddTransaction({
        bankId: data.bankId,
        amount: finalAmount,
        description: data.description,
        category: data.category,
        date: new Date(data.date).toISOString(),
        type: data.type,
      });
      
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBank = banks.find(bank => bank.id === watch('bankId'));
  const currency = selectedBank?.currency || 'USD';
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Add New Transaction</h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Select
              label="Account"
              error={errors.bankId?.message}
              options={banks.map(bank => ({
                value: bank.id,
                label: bank.name,
              }))}
              {...register('bankId', {
                required: 'Please select an account',
              })}
            />
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex">
                  <label className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-l-md ${selectedType === 'expense' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-gray-300 text-gray-500'}`}>
                    <input
                      type="radio"
                      value="expense"
                      className="sr-only"
                      {...register('type')}
                    />
                    <span>Expense</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center py-2 px-4 border rounded-r-md ${selectedType === 'income' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-500'}`}>
                    <input
                      type="radio"
                      value="income"
                      className="sr-only"
                      {...register('type')}
                    />
                    <span>Income</span>
                  </label>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    value={formattedAmount}
                    onChange={handleAmountChange}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>
            
            <Input
              label="Description"
              placeholder="e.g. Groceries at Whole Foods"
              error={errors.description?.message}
              {...register('description', {
                required: 'Description is required',
              })}
            />
            
            <Select
              label="Category"
              error={errors.category?.message}
              options={categories}
              {...register('category', {
                required: 'Please select a category',
              })}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register('date', {
                  required: 'Date is required',
                })}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
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
              Add Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
