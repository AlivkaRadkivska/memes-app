'use client';

import { queryKeys } from '@/server/queryKeys';
import {
  getCurrentUser,
  loginWithCredentials,
} from '@/server/services/auth-service';
import { AuthContextType, LoginCredentials } from '@/server/types/auth';
import { User } from '@/server/types/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  refetchUser: () => {},
  login: async () => {},
  logout: () => {},
  setAuthFromRedirect: () => {},
});

const cookies = new Cookies();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    refetch,
  } = useQuery<User | undefined>({
    queryKey: queryKeys.getCurrentUser(),
    queryFn: () => getCurrentUser(),
    enabled: !!token,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) setToken(storedToken);
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isCurrentUserLoading) {
      if (!currentUser && token) {
        localStorage.removeItem('auth_token');
        cookies.remove('auth_token', { path: '/' });
        setToken(undefined);
      }
      setIsLoading(false);
    }
  }, [currentUser, isCurrentUserLoading, token]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await loginWithCredentials(credentials);
      setToken(result.accessToken);

      localStorage.setItem('auth_token', result.accessToken);
      cookies.set('auth_token', result.accessToken, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

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

    localStorage.removeItem('auth_token');
    cookies.remove('auth_token', { path: '/' });
    setToken(undefined);

    queryClient.invalidateQueries({ queryKey: queryKeys.getCurrentUser() });
    router.push('/auth');

    setIsLoading(false);
  };

  const setAuthFromRedirect = (tokenStr: string) => {
    try {
      setToken(tokenStr);

      localStorage.setItem('auth_token', tokenStr);
      cookies.set('auth_token', tokenStr, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    } catch (error) {
      console.error('Error setting auth from redirect:', error);
    }
  };

  const contextValue: AuthContextType = {
    user: currentUser,
    token,
    isAuthenticated: !!token && !!currentUser,
    isLoading: isLoading || isCurrentUserLoading,
    refetchUser: refetch,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};
