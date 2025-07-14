import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Transaction } from '../../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SpendingChartProps {
  transactions: Transaction[];
  currency: string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, currency }) => {
  // Calculate data for the last 7 days
  const today = new Date();
  const lastWeek = subDays(today, 6);
  
  const days = eachDayOfInterval({
    start: lastWeek,
    end: today,
  });
  
  const labels = days.map(day => format(day, 'MMM d'));
  
  // Calculate daily spending totals
  const incomeData = Array(7).fill(0);
  const expenseData = Array(7).fill(0);
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    
    // Check if transaction is within our date range
    if (transactionDate >= lastWeek && transactionDate <= today) {
      // Get day index (0-6)
      const dayIndex = days.findIndex(day => 
        format(day, 'yyyy-MM-dd') === format(transactionDate, 'yyyy-MM-dd')
      );
      
      if (dayIndex >= 0) {
        if (transaction.type === 'income') {
          incomeData[dayIndex] += transaction.amount;
        } else {
          // Store expenses as positive values for the chart
          expenseData[dayIndex] += Math.abs(transaction.amount);
        }
      }
    }
  });
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
              });
              label += formatter.format(value);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: any, tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return tickValue.toLocaleString(undefined, {
                style: 'currency',
                currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
            }
            return tickValue;
          }
        }
      }
    }
  };
  
  return (
    <div className="w-full h-64">
      <Line data={data} options={options} />
    </div>
  );
};
