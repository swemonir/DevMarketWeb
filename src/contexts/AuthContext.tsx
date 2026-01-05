import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from '../types';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Mock User for demo
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  email: 'alex@devnexus.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  verified: true,
  role: 'user'
};
export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      // Check local storage or firebase auth state here
      const storedUser = localStorage.getItem('devnexus_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate API call
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setUser(MOCK_USER);
        localStorage.setItem('devnexus_user', JSON.stringify(MOCK_USER));
        setLoading(false);
        resolve();
      }, 1500);
    });
  };
  const signup = async (name: string, email: string, pass: string) => {
    setLoading(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const newUser = {
          ...MOCK_USER,
          name,
          email
        };
        setUser(newUser);
        localStorage.setItem('devnexus_user', JSON.stringify(newUser));
        setLoading(false);
        resolve();
      }, 1500);
    });
  };
  const loginWithGoogle = async () => {
    setLoading(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setUser(MOCK_USER);
        localStorage.setItem('devnexus_user', JSON.stringify(MOCK_USER));
        setLoading(false);
        resolve();
      }, 1500);
    });
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('devnexus_user');
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}