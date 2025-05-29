import { queryKeys } from '@/server/queryKeys';
import { fetchFollowers } from '@/server/services/follow-service';
import { Follow } from '@/server/types/follows';
import { useQuery } from '@tanstack/react-query';

export default function useGetFollowers(followingId: string) {
  const {
    data: follows,
    isFetching,
    isRefetching,
  } = useQuery<Follow[]>({
    queryKey: queryKeys.getFollowers(),
    queryFn: () => fetchFollowers(followingId),
  });

  return {
    follows,
    followers: follows?.map((item) => item.follower),
    isFetching,
    isInitialFetching: isFetching && !isRefetching,
  };
}
