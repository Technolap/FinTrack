import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { Loan } from '../../../types';
import { Button } from '../../ui/Button';

interface LoanCardProps {
  loan: Loan;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ 
  loan, 
  onClick, 
  onEdit,
  onDelete 
}) => {
  const { name, amount, balance, apr, duration, paymentDue, currency } = loan;
  
  // Calculate percentage paid
  const percentagePaid = ((amount - balance) / amount) * 100;
  
  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl"
    >
      <div 
        className="p-6 h-44 bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex flex-col justify-between"
      >
        <div>
          <p className="text-sm font-medium opacity-80">Loan</p>
          <h3 className="text-lg font-bold mt-1">{name}</h3>
        </div>
        
        <div className="flex flex-col">
          <p className="text-xs font-medium opacity-80">Remaining Balance</p>
          <p className="text-2xl font-bold">
            {formatCurrency(balance, currency)}
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">Payment Due</p>
            <p className="text-sm">{paymentDue}</p>
          </div>
          
          <div className="text-right">
            <p className="text-xs opacity-80">APR</p>
            <p className="text-sm">{apr}%</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
            <div 
              className="bg-white h-1.5 rounded-full" 
              style={{ width: `${percentagePaid}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs">{percentagePaid.toFixed(0)}% paid</p>
            <p className="text-xs">{duration}</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      {(onEdit || onDelete) && (
        <div className="p-3 bg-white border-t border-gray-100 flex justify-end space-x-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )}
      
      {/* Make the card body clickable if onClick is provided */}
      {onClick && (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={onClick}
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
};
