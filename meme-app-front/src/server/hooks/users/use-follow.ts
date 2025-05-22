import { queryKeys } from '@/server/queryKeys';
import { startFollow } from '@/server/services/user-service';
import { CommonError } from '@/server/types/common';
import { PublicationFilters } from '@/server/types/publication';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useFollow(
  passingFilters?: Partial<PublicationFilters>,
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: (data) => startFollow(data),
    onSuccess: () => {
      toast('Тепер ви слідкуєте за цією людиною');
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
    follow,
    isPending,
  };
}
