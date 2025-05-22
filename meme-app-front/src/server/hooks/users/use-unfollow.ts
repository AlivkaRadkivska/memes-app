import { deleteFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useUnfollow(
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const { mutate: unfollow, isPending } = useMutation({
    mutationFn: (data) => deleteFollow(data),
    onSuccess: () => {
      toast('Ви більше не слідкуєте за цією людиною');
    },
    onError: (err) => {
      toast('Щось пішло не так...');
      console.error('API Error:', err);
    },
    ...options,
  });

  return {
    unfollow,
    isPending,
  };
}
