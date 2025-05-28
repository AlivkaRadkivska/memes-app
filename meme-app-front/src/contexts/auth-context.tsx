'use client';

import { queryKeys } from '@/server/queryKeys';
import { getCurrentUser } from '@/server/services/auth-service';
import { AuthContextType } from '@/server/types/auth';
import { User } from '@/server/types/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  refetchUser: () => {},
  logout: () => {},
  setAuthFromRedirect: () => {},
});

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
    const storedToken = cookies.get('auth_token');

    if (storedToken) setToken(storedToken);
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isCurrentUserLoading) {
      if (!currentUser && token) {
        cookies.remove('auth_token', { path: '/' });
        setToken(undefined);
      }
      setIsLoading(false);
    }
  }, [currentUser, isCurrentUserLoading, token]);

  const logout = async () => {
    setIsLoading(true);

    cookies.remove('auth_token', { path: '/' });
    setToken(undefined);

    queryClient.invalidateQueries({ queryKey: queryKeys.getCurrentUser() });
    router.push('/auth');

    setIsLoading(false);
  };

  const setAuthFromRedirect = (tokenStr: string) => {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      setToken(tokenStr);
      cookies.set('auth_token', tokenStr, {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: threeDaysFromNow,
      });
    } catch (error) {
      console.error('Error setting auth from redirect:', error);
    }
  };

  const contextValue: AuthContextType = useMemo(
    () => ({
      user: currentUser,
      token,
      isAuthenticated: !!token && !!currentUser,
      isLoading: isLoading || isCurrentUserLoading,
      refetchUser: refetch,
      logout,
      setAuthFromRedirect,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, isCurrentUserLoading, isLoading, token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};
