import { useAuth } from '@/contexts/auth-context';
import { queryKeys } from '@/server/queryKeys';
import { startFollow, stopFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { FollowResponse, User } from '@/server/types/user';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { usePublicationFilters } from '../publications/use-publication-filters';

export default function useFollow(
  following?: User,
  options?: UseMutationOptions<
    FollowResponse | void,
    AxiosError<CommonError>,
    { followingId: string; isFollowed: boolean }
  >
) {
  const { refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const { filters } = usePublicationFilters();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: (data) =>
      data.isFollowed
        ? stopFollow(data.followingId)
        : startFollow(data.followingId),
    onSuccess: (response) => {
      if (response?.id) toast('Тепер ви слідкуєте за цією людиною');
      else toast('Ви більше не слідкуєте за цією людиною');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getPublications(filters),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getPublications({
          ...filters,
          onlyFollowing: true,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUser({ email: following?.email }),
      });
      refetchUser();
      console.log(following?.email);
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
