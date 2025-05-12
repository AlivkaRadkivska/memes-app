'use client';

import { useAuth } from '@/contexts/auth-context';
import { loginWithCredentials } from '@/server/services/auth-service';
import { LoginCredentials } from '@/server/types/auth';
import { useState } from 'react';

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const { setAuthFromRedirect } = useAuth();

  const mutate = async (credentials: LoginCredentials) => {
    setIsPending(true);
    setErrors(null);

    try {
      const result = await loginWithCredentials(credentials);
      setAuthFromRedirect(result.accessToken, JSON.stringify(result.user));
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login error:', err);
      setErrors(err.response.data.message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, errors };
};
