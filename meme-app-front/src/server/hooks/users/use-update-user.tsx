import { useAuth } from '@/contexts/auth-context';
import { updateCurrentUser } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { User, UserUpdatePayload } from '@/server/types/user';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useUpdateUser(
  options?: UseMutationOptions<User, AxiosError<CommonError>, UserUpdatePayload>
) {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (data) => updateCurrentUser(data),
    onMutate: () => toast('Оновлюється...'),
    onSuccess: () => {
      toast('Профіль оновлено');
      refetchUser();
      router.push('/my-profile');
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
    updateUser,
    errors,
    setErrors,
    isPending,
  };
}
