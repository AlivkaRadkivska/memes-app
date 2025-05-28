import { queryKeys } from '@/server/queryKeys';
import { deleteOnePublication } from '@/server/services/publication-service';
import { CommonError } from '@/server/types/common';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { usePublicationFilters } from './use-publication-filters';

export default function useDeletePublication(
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const queryClient = useQueryClient();
  const { filters } = usePublicationFilters();

  const { mutate: deletePublication, isPending } = useMutation({
    mutationFn: (data) => deleteOnePublication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getPublications(filters),
      });
      toast('Успішно видалено');
    },
    onError: (err) => {
      console.error('API Error:', err);
      toast('Щось пішло не так...');
    },
    ...options,
  });

  return {
    deletePublication,
    isPending,
  };
}
