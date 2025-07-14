import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bank, Transaction, Loan } from '../types';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from '../utils/uuid';

interface BankContextType {
  banks: Bank[];
  transactions: Transaction[];
  loans: Loan[];
  isLoading: boolean;
  addBank: (bank: Omit<Bank, 'id' | 'userId'>) => Promise<Bank>;
  updateBank: (id: string, updates: Partial<Omit<Bank, 'id' | 'userId'>>) => Promise<Bank>;
  deleteBank: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<Transaction>;
  applyLoan: (loan: Omit<Loan, 'id' | 'userId'>) => Promise<Loan>;
  updateLoan: (id: string, updates: Partial<Omit<Loan, 'id' | 'userId'>>) => Promise<Loan>;
  deleteLoan: (id: string) => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const useBanks = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBanks must be used within a BankProvider');
  }
  return context;
};

interface BankProviderProps {
  children: React.ReactNode;
}

export const BankProvider: React.FC<BankProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [banksData, setBanksData] = useLocalStorage<Record<string, Bank[]>>('fin-track-banks', {});
  const [transactionsData, setTransactionsData] = useLocalStorage<Record<string, Transaction[]>>('fin-track-transactions', {});
  const [loansData, setLoansData] = useLocalStorage<Record<string, Loan[]>>('fin-track-loans', {});
  const [banks, setBanks] = useState<Bank[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBanks([]);
      setTransactions([]);
      setLoans([]);
      setIsLoading(false);
      return;
    }

    // Initialize empty arrays if the user has no data yet
    if (!banksData[user.id]) {
      setBanksData(prev => ({
        ...prev,
        [user.id]: []
      }));
    }
    
    if (!transactionsData[user.id]) {
      setTransactionsData(prev => ({
        ...prev,
        [user.id]: []
      }));
    }
    
    if (!loansData[user.id]) {
      setLoansData(prev => ({
        ...prev,
        [user.id]: []
      }));
    }

    // Set the user's data from storage
    setBanks(banksData[user.id] || []);
    setTransactions(transactionsData[user.id] || []);
    setLoans(loansData[user.id] || []);

    setIsLoading(false);
  }, [user, banksData, transactionsData, loansData, setBanksData, setTransactionsData, setLoansData]);

  const addBank = async (bankData: Omit<Bank, 'id' | 'userId'>): Promise<Bank> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const newBank: Bank = {
          ...bankData,
          id: uuidv4(),
          userId: user.id
        };

        const updatedBanks = [...banks, newBank];
        setBanks(updatedBanks);
        setBanksData(prev => ({
          ...prev,
          [user.id]: updatedBanks
        }));

        resolve(newBank);
      }, 500);
    });
  };

  const updateBank = async (
    id: string,
    updates: Partial<Omit<Bank, 'id' | 'userId'>>
  ): Promise<Bank> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const bankIndex = banks.findIndex(bank => bank.id === id);
        if (bankIndex === -1) {
          reject(new Error('Bank not found'));
          return;
        }

        const updatedBank = { ...banks[bankIndex], ...updates };
        const updatedBanks = [...banks];
        updatedBanks[bankIndex] = updatedBank;

        setBanks(updatedBanks);
        setBanksData(prev => ({
          ...prev,
          [user.id]: updatedBanks
        }));

        resolve(updatedBank);
      }, 500);
    });
  };

  const deleteBank = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const updatedBanks = banks.filter(bank => bank.id !== id);
        setBanks(updatedBanks);
        setBanksData(prev => ({
          ...prev,
          [user.id]: updatedBanks
        }));

        // Also delete all transactions for this bank
        const updatedTransactions = transactions.filter(
          transaction => transaction.bankId !== id
        );
        setTransactions(updatedTransactions);
        setTransactionsData(prev => ({
          ...prev,
          [user.id]: updatedTransactions
        }));

        resolve();
      }, 500);
    });
  };

  const addTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'userId'>
  ): Promise<Transaction> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: uuidv4(),
          userId: user.id
        };

        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        setTransactionsData(prev => ({
          ...prev,
          [user.id]: updatedTransactions
        }));

        // Update bank balance
        const bankIndex = banks.findIndex(bank => bank.id === transactionData.bankId);
        if (bankIndex !== -1) {
          const updatedBank = { 
            ...banks[bankIndex], 
            balance: banks[bankIndex].balance + transactionData.amount 
          };
          
          const updatedBanks = [...banks];
          updatedBanks[bankIndex] = updatedBank;
          
          setBanks(updatedBanks);
          setBanksData(prev => ({
            ...prev,
            [user.id]: updatedBanks
          }));
        }

        resolve(newTransaction);
      }, 500);
    });
  };

  const applyLoan = async (
    loanData: Omit<Loan, 'id' | 'userId'>
  ): Promise<Loan> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const newLoan: Loan = {
          ...loanData,
          id: uuidv4(),
          userId: user.id
        };

        const updatedLoans = [...loans, newLoan];
        setLoans(updatedLoans);
        setLoansData(prev => ({
          ...prev,
          [user.id]: updatedLoans
        }));

        resolve(newLoan);
      }, 500);
    });
  };
  
  const updateLoan = async (
    id: string,
    updates: Partial<Omit<Loan, 'id' | 'userId'>>
  ): Promise<Loan> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const loanIndex = loans.findIndex(loan => loan.id === id);
        if (loanIndex === -1) {
          reject(new Error('Loan not found'));
          return;
        }

        const updatedLoan = { ...loans[loanIndex], ...updates };
        const updatedLoans = [...loans];
        updatedLoans[loanIndex] = updatedLoan;

        setLoans(updatedLoans);
        setLoansData(prev => ({
          ...prev,
          [user.id]: updatedLoans
        }));

        resolve(updatedLoan);
      }, 500);
    });
  };
  
  const deleteLoan = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('User not authenticated'));
        return;
      }

      setTimeout(() => {
        const updatedLoans = loans.filter(loan => loan.id !== id);
        setLoans(updatedLoans);
        setLoansData(prev => ({
          ...prev,
          [user.id]: updatedLoans
        }));

        resolve();
      }, 500);
    });
  };

  return (
    <BankContext.Provider
      value={{
        banks,
        transactions,
        loans,
        isLoading,
        addBank,
        updateBank,
        deleteBank,
        addTransaction,
        applyLoan,
        updateLoan,
        deleteLoan
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
