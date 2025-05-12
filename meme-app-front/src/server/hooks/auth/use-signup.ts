'use client';

import { useAuth } from '@/contexts/auth-context';
import { signupWithCredentials } from '@/server/services/auth-service';
import { SignupCredentials } from '@/server/types/auth';
import { useState } from 'react';

export const useSignup = () => {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const { setAuthFromRedirect } = useAuth();

  const mutate = async (credentials: SignupCredentials) => {
    setIsPending(true);
    setErrors(null);

    try {
      const result = await signupWithCredentials(credentials);
      setAuthFromRedirect(result.accessToken, JSON.stringify(result.user));
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrors(err.response.data.message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, errors };
};
