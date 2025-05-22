import { queryKeys } from '@/server/queryKeys';
import { deleteFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { PublicationFilters } from '@/server/types/publication';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useUnfollow(
  passingFilters?: Partial<PublicationFilters>,
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const queryClient = useQueryClient();
  const { mutate: unfollow, isPending } = useMutation({
    mutationFn: (data) => deleteFollow(data),
    onSuccess: () => {
      toast('Ви більше не слідкуєте за цією людиною');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getPublication(passingFilters),
      });
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
