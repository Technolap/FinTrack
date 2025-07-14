export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  countryCode?: string;
  phone?: string;
  createdAt: string;
  emailVerified?: boolean;
}

export interface Loan {
  id: string;
  userId: string;
  name: string;
  amount: number;
  balance: number;
  purpose: string;
  duration: string;
  apr: string;
  paymentDue: string;
  currency: string;
}

export interface Bank {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  color: string;
  lastFour: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  bankId: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: string;
  type: 'income' | 'expense';
}

export type TransactionCategory = 
  | 'food' 
  | 'shopping' 
  | 'housing' 
  | 'transportation' 
  | 'entertainment' 
  | 'utilities' 
  | 'healthcare' 
  | 'education' 
  | 'travel' 
  | 'salary' 
  | 'investment' 
  | 'other';

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
}
