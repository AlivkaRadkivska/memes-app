import { useAuth } from '@/contexts/auth-context';
import { loginWithCredentials } from '@/server/services/auth-service';
import { AuthResult, LoginCredentials } from '@/server/types/auth';
import { CommonError } from '@/server/types/common';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useLogin(
  options?: UseMutationOptions<
    AuthResult,
    AxiosError<CommonError>,
    LoginCredentials
  >
) {
  const router = useRouter();
  const { setAuthFromRedirect } = useAuth();
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data) => loginWithCredentials(data),
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
    login,
    isPending,
    errors,
  };
}
