import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { countries } from '../../data/countries';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { User } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || undefined,
  });

  if (!user) {
    return null;
  }

  const onSubmit = async (data: User) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await updateUser({
        ...user,
        name: data.name,
        email: data.email,
        country: data.country,
        phone: data.phone,
      });
      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {isSuccess && (
                <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
                  Profile updated successfully!
                </div>
              )}
            
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              
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
              
              <Input
                label="Phone Number (Optional)"
                placeholder="Phone number"
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{6,15}$/,
                    message: 'Phone number must be between 6-15 digits',
                  },
                })}
              />
              
              <div>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
