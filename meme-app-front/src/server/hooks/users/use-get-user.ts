import { queryKeys } from '@/server/queryKeys';
import { getUserByEmail } from '@/server/services/user-service';
import { User } from '@/server/types/user';
import { useQuery } from '@tanstack/react-query';

export default function useGetUser(email: string) {
  const {
    data: user,
    isFetching,
    isRefetching,
  } = useQuery<User>({
    queryKey: queryKeys.getUser({ email }),
    queryFn: () => getUserByEmail(email),
  });

  return {
    user,
    isFetching,
    isInitialFetching: isFetching && !isRefetching,
  };
}
