import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: Omit<User, 'id' | 'createdAt'>, password: string) => Promise<User>;
  updateUser: (userData: User) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('fin-track-user', null);
  const [users, setUsers] = useLocalStorage<Record<string, { user: User; password: string }>>('fin-track-users', {});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading authentication state
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userRecord = Object.values(users).find(
          record => record.user.email.toLowerCase() === email.toLowerCase()
        );

        if (!userRecord || userRecord.password !== password) {
          reject(new Error('Invalid email or password'));
          return;
        }

        setUser(userRecord.user);
        resolve(userRecord.user);
      }, 800);
    });
  };

  const register = async (
    userData: Omit<User, 'id' | 'createdAt'>, 
    password: string
  ): Promise<User> => {
    // Simulate API request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = Object.values(users).some(
          record => record.user.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (emailExists) {
          reject(new Error('Email already exists'));
          return;
        }

        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
        };

        setUsers({
          ...users,
          [newUser.id]: { user: newUser, password }
        });

        setUser(newUser);
        resolve(newUser);
      }, 800);
    });
  };

  const updateUser = async (userData: User): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Update the user in the storage
        setUser(userData);
        
        // Also update in the users storage
        if (userData.id) {
          setUsers(prev => {
            const userRecord = prev[userData.id];
            if (!userRecord) {
              reject(new Error('User not found'));
              return prev;
            }
            
            return {
              ...prev,
              [userData.id]: {
                ...userRecord,
                user: userData
              }
            };
          });
        }
        
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
