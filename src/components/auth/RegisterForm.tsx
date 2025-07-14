import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { useAuth } from '../../context/AuthContext';
import { countries } from '../../data/countries';
import { calculatePasswordStrength } from '../../utils/formatters';

interface RegisterFormData {
  name: string;
  email: string;
  country: string;
  phoneCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    defaultValues: {
      country: 'US',
      phoneCode: '+1',
    },
    mode: 'onChange',
  });

  const selectedCountry = watch('country');
  const passwordValue = watch('password', '');

  // Update phone code when country changes
  React.useEffect(() => {
    const country = countries.find(c => c.code === selectedCountry);
    if (country) {
      const countryPhoneCode = country.phoneCode;
      // This is a hack since we can't easily set the phoneCode field value
      setTimeout(() => {
        const phoneCodeSelect = document.querySelector('select[name="phoneCode"]') as HTMLSelectElement;
        if (phoneCodeSelect) {
          phoneCodeSelect.value = countryPhoneCode;
        }
      }, 0);
    }
  }, [selectedCountry]);

  // Update password state for strength indicator
  React.useEffect(() => {
    setPassword(passwordValue);
  }, [passwordValue]);

  const nextStep = async () => {
    // Validate fields for current step
    let fieldsToValidate: (keyof RegisterFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['country', 'phoneCode', 'phone'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RegisterFormData) => {
    const passwordStrength = calculatePasswordStrength(data.password);
    
    // Require at least medium strength password
    if (passwordStrength < 3) {
      setError('Please choose a stronger password');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const userData = {
        name: data.name,
        email: data.email,
        country: data.country,
        countryCode: data.phoneCode,
        phone: data.phone ? data.phone : undefined,
      };

      await registerUser(userData, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          <p className="text-sm text-gray-600 mb-6">Let's start with your basic details</p>
          
          <Input
            label="Full Name"
            placeholder="John Doe"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            }
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
            })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
        </>
      )}

      {currentStep === 2 && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Details</h3>
          <p className="text-sm text-gray-600 mb-6">Where are you from?</p>
          
          <Select
            label="Country"
            error={errors.country?.message}
            options={countries.map(country => ({
              value: country.code,
              label: country.name,
            }))}
            {...register('country', {
              required: 'Country is required',
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <div className="flex">
              <Controller
                name="phoneCode"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="rounded-l-md border-r-0 border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {countries.map(country => (
                      <option key={country.phoneCode} value={country.phoneCode}>
                        {country.phoneCode}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Input
                className="rounded-l-none"
                placeholder="Phone number"
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{6,15}$/,
                    message: 'Phone number must be between 6-15 digits',
                  },
                })}
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Security</h3>
          <p className="text-sm text-gray-600 mb-6">Create a secure password for your account</p>
          
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              }
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {password && <PasswordStrengthIndicator password={password} />}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === passwordValue || 'The passwords do not match',
            })}
          />
        </>
      )}

      <div className="flex justify-between gap-4 pt-4">
        {currentStep > 1 && (
          <Button 
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            Back
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button 
            type="button"
            onClick={nextStep}
            className={currentStep === 1 ? "w-full" : "flex-1"}
          >
            Continue
          </Button>
        ) : (
          <Button 
            type="submit"
            isLoading={isLoading}
            className="flex-1"
          >
            Create Account
          </Button>
        )}
      </div>
    </form>
  );
};
