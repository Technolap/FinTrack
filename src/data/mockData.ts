import { Bank, Transaction, User } from '../types';
import { countries } from './countries';
import { v4 as uuidv4 } from '../utils/uuid';

export const generateMockUser = (
  name: string,
  email: string,
  country: string,
  countryCode?: string,
  phone?: string
): User => {
  return {
    id: uuidv4(),
    name,
    email,
    country,
    countryCode,
    phone,
    createdAt: new Date().toISOString(),
  };
};

export const generateDefaultBanks = (userId: string, country: string): Bank[] => {
  const countryObj = countries.find(c => c.code === country) || countries[0];
  const currency = countryObj.currency;
  
  return [
    {
      id: uuidv4(),
      userId,
      name: "Main Checking",
      type: "checking",
      balance: 2543.87,
      currency,
      color: "#4F46E5",
      lastFour: "4782",
      isDefault: true,
    },
    {
      id: uuidv4(),
      userId,
      name: "Savings Account",
      type: "savings",
      balance: 15750.42,
      currency,
      color: "#10B981",
      lastFour: "9031",
    },
    {
      id: uuidv4(),
      userId,
      name: "Credit Card",
      type: "credit",
      balance: -432.19,
      currency,
      color: "#EF4444",
      lastFour: "1598",
    }
  ];
};

export const generateMockTransactions = (
  userId: string,
  bankId: string,
  count: number = 15
): Transaction[] => {
  const categories: Transaction['category'][] = [
    'food', 'shopping', 'housing', 'transportation', 'entertainment',
    'utilities', 'healthcare', 'education', 'travel', 'salary', 'investment', 'other'
  ];
  
  const descriptions = {
    food: ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Fast Food'],
    shopping: ['Department Store', 'Online Shopping', 'Electronics Store', 'Clothing Store'],
    housing: ['Rent Payment', 'Mortgage', 'Home Insurance', 'Property Tax'],
    transportation: ['Gas Station', 'Public Transport', 'Car Insurance', 'Vehicle Maintenance'],
    entertainment: ['Movie Theater', 'Concert Tickets', 'Streaming Service', 'Gaming'],
    utilities: ['Electric Bill', 'Water Bill', 'Internet Service', 'Phone Bill'],
    healthcare: ['Doctor Visit', 'Pharmacy', 'Health Insurance', 'Dental Care'],
    education: ['Tuition Payment', 'Books & Supplies', 'Online Course', 'School Fees'],
    travel: ['Airline Tickets', 'Hotel Booking', 'Car Rental', 'Travel Insurance'],
    salary: ['Paycheck', 'Bonus', 'Commission', 'Freelance Payment'],
    investment: ['Stock Purchase', 'Dividend', 'Bond Interest', 'Crypto Investment'],
    other: ['Miscellaneous', 'Gift', 'Donation', 'Subscription']
  };
  
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const type = category === 'salary' || category === 'investment' 
      ? 'income' 
      : 'expense';
    
    const desc = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
    
    // Generate date within last 30 days
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Amount between 5 and 2000, with negative sign for expenses
    let amount = Math.random() * 1995 + 5;
    amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    if (type === 'expense') amount = -amount;
    
    transactions.push({
      id: uuidv4(),
      userId,
      bankId,
      amount,
      description: desc,
      category,
      date: date.toISOString(),
      type,
    });
  }
  
  // Sort by date, most recent first
  return transactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
