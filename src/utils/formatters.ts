import { format, parseISO } from 'date-fns';
import { getCurrencySymbol } from '../data/countries';

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace(/[A-Z]+/g, symbol);
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Complexity
  if (/[a-z]/.test(password)) strength += 1; // lowercase
  if (/[A-Z]/.test(password)) strength += 1; // uppercase
  if (/[0-9]/.test(password)) strength += 1; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // special chars
  
  return strength;
};

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength <= 2) return 'Weak';
  if (strength <= 4) return 'Medium';
  return 'Strong';
};

export const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 2) return '#EF4444'; // red
  if (strength <= 4) return '#F59E0B'; // amber
  return '#10B981'; // green
};

export const formatAmountWithCommas = (value: string): string => {
  // Convert to number and back to string to remove leading zeros
  const numberStr = Number(value).toString();
  
  // Format with commas
  if (numberStr === '0') return '';
  
  return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
