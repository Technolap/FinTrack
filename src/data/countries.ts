import { Country } from '../types';

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', phoneCode: '+44' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: '$', phoneCode: '+1' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: '$', phoneCode: '+61' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', phoneCode: '+49' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', phoneCode: '+33' },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', phoneCode: '+39' },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', phoneCode: '+34' },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', phoneCode: '+81' },
  { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', phoneCode: '+86' },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', phoneCode: '+91' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', phoneCode: '+55' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', phoneCode: '+27' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', phoneCode: '+234' },
  { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', phoneCode: '+254' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', phoneCode: '+20' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: '﷼', phoneCode: '+966' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'د.إ', phoneCode: '+971' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: '$', phoneCode: '+65' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM', phoneCode: '+60' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByCurrency = (currency: string): Country | undefined => {
  return countries.find(country => country.currency === currency);
};

export const getCurrencySymbol = (currency: string): string => {
  const country = getCountryByCurrency(currency);
  return country ? country.currencySymbol : '$';
};
