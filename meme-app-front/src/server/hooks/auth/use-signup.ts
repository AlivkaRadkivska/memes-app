import { useAuth } from '@/contexts/auth-context';
import { signupWithCredentials } from '@/server/services/auth-service';
import { AuthResult, SignupCredentials } from '@/server/types/auth';
import { CommonError } from '@/server/types/common';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useSignup(
  options?: UseMutationOptions<
    AuthResult,
    AxiosError<CommonError>,
    SignupCredentials
  >
) {
  const router = useRouter();
  const { setAuthFromRedirect } = useAuth();
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const { mutate: signup, isPending } = useMutation({
    mutationFn: (data) => signupWithCredentials(data),
    onSuccess: (response) => {
      setAuthFromRedirect(response.accessToken, JSON.stringify(response.user));
      router.push('/');
    },
    onError: (err) => {
      console.error('API Error:', err);
      if (err.response?.data.statusCode.toString().startsWith('5'))
        toast('Щось пішло не так...');
      else setErrors(err.response?.data.message);
    },
    ...options,
  });

  return {
    signup,
    isPending,
    errors,
  };
}
