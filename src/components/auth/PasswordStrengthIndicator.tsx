import React from 'react';
import { calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../utils/formatters';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const label = getPasswordStrengthLabel(strength);
  const color = getPasswordStrengthColor(strength);
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${Math.min((strength / 6) * 100, 100)}%`,
            backgroundColor: color
          }}
        />
      </div>
      
      {strength < 5 && (
        <div className="mt-2 text-xs text-gray-600">
          <p>For a strong password include:</p>
          <ul className="mt-1 space-y-1">
            {password.length < 12 && (
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                At least 12 characters
              </li>
            )}
            {!/[a-z]/.test(password) && (
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Lowercase letters (a-z)
              </li>
            )}
            {!/[A-Z]/.test(password) && (
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Uppercase letters (A-Z)
              </li>
            )}
            {!/[0-9]/.test(password) && (
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Numbers (0-9)
              </li>
            )}
            {!/[^a-zA-Z0-9]/.test(password) && (
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Special characters (!@#$%^&*)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
