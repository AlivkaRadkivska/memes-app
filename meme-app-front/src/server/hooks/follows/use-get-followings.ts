import { queryKeys } from '@/server/queryKeys';
import { fetchFollowings } from '@/server/services/follow-service';
import { Follow } from '@/server/types/follows';
import { useQuery } from '@tanstack/react-query';

export default function useGetFollowings(followerId: string) {
  const {
    data: follows,
    isFetching,
    isRefetching,
  } = useQuery<Follow[]>({
    queryKey: queryKeys.getFollowings(),
    queryFn: () => fetchFollowings(followerId),
  });

  return {
    follows,
    followings: follows?.map((item) => item.following),
    isFetching,
    isInitialFetching: isFetching && !isRefetching,
  };
}
