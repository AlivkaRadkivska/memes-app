'use client';

import {
  getCurrentUser,
  loginWithCredentials,
} from '@/server/services/auth-service';
import { AuthContextType, LoginCredentials } from '@/server/types/auth';
import { User } from '@/server/types/user';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  setAuthFromRedirect: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const storedToken = localStorage.getItem('auth_token');

      if (storedToken) {
        setToken(storedToken);

        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Token verification failed:', error);

          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    })();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await loginWithCredentials(credentials);
      setToken(result.accessToken);

      localStorage.setItem('auth_token', result.accessToken);

      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }

    setIsLoading(false);
    router.push('/login');
  };

  const setAuthFromRedirect = (tokenStr: string) => {
    try {
      setToken(tokenStr);

      localStorage.setItem('auth_token', tokenStr);
    } catch (error) {
      console.error('Error setting auth from redirect:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    setAuthFromRedirect,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
