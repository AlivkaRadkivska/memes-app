import { useAuth } from '@/contexts/auth-context';
import { startFollow, stopFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { FollowResponse } from '@/server/types/user';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useFollow(
  options?: UseMutationOptions<
    FollowResponse | void,
    AxiosError<CommonError>,
    { publicationId: string; isFollowed: boolean }
  >
) {
  const { refetchUser } = useAuth();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: (data) =>
      data.isFollowed
        ? stopFollow(data.publicationId)
        : startFollow(data.publicationId),
    onSuccess: (response) => {
      if (response?.id) toast('Тепер ви слідкуєте за цією людиною');
      else toast('Ви більше не слідкуєте за цією людиною');
      refetchUser();
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
