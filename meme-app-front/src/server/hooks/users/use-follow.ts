import { startFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useFollow(
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const { mutate: follow, isPending } = useMutation({
    mutationFn: (data) => startFollow(data),
    onSuccess: () => {
      toast('Тепер ви слідкуєте за цією людиною');
    },
    onError: (err) => {
      toast('Щось пішло не так...');
      console.error('API Error:', err);
    },
    ...options,
  });

  return {
    follow,
    isPending,
  };
}
