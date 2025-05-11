'use client';

import { useAuth } from '@/contexts/auth-context';
import { signupWithCredentials } from '@/server/services/auth-service';
import { SignupCredentials } from '@/server/types/auth';
import { useState } from 'react';

export const useSignup = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthFromRedirect } = useAuth();

  const mutate = async (credentials: SignupCredentials) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await signupWithCredentials(credentials);

      setAuthFromRedirect(result.accessToken, JSON.stringify(result.user));

      return result;
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to signup. Please check your credentials.');
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
};
