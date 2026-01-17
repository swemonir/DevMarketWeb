import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response && response.user) {
        setUser(response.user);
      } else {
        // If query fails or invalid response, clear token
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, pass);
      // Backend returns { accessToken, user, ... }
      if (response.user) {
        setUser(response.user);
      } else {
        // If user object isn't in login response, fetch it
        const me = await authService.getMe();
        setUser(me.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw to let component handle UI feedback
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await authService.signup(name, email, pass);

      // If endpoint returns token/user immediately with 200/201
      if (response.accessToken) {
        if (response.user) {
          console.log(response.user);
          setUser(response.user);
        } else {
          const me = await authService.getMe();
          console.log(me.user);
          setUser(me.user);
        }
      } else {
        // If signup requires email verification or doesn't auto-login
        // We might just notify success. 
        // For now, assuming standard flow if token is present.
      }
      return response;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    // TODO: Implement Google Auth integration when backend ready
    setLoading(true);
    try {
      // Placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.error('Google Login not yet implemented on backend');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
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