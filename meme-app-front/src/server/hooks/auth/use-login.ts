'use client';

import { useAuth } from '@/contexts/auth-context';
import { loginWithCredentials } from '@/server/services/auth-service';
import { LoginCredentials } from '@/server/types/auth';
import { useState } from 'react';

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthFromRedirect } = useAuth();

  const mutate = async (credentials: LoginCredentials) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await loginWithCredentials(credentials);

      setAuthFromRedirect(result.accessToken, JSON.stringify(result.user));

      return result;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
};
