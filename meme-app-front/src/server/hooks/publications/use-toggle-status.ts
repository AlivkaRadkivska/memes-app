import { queryKeys } from '@/server/queryKeys';
import {
  hidePublication,
  showPublication,
} from '@/server/services/publication-service';
import { CommonError } from '@/server/types/common';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePublicationFilters } from './use-publication-filters';

export default function useTogglePublicationStatus(
  options?: UseMutationOptions<
    void,
    AxiosError<CommonError>,
    { publicationId: string; status: 'active' | 'hidden' }
  >
) {
  const queryClient = useQueryClient();
  const { filters } = usePublicationFilters();

  const { mutate: togglePublicationStatus, isPending } = useMutation({
    mutationFn: (data) =>
      data.status === 'active'
        ? hidePublication(data.publicationId)
        : showPublication(data.publicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getPublications(filters),
      });
    },
    onError: (err) => {
      console.error('API Error:', err);
    },
    ...options,
  });

  return {
    togglePublicationStatus,
    isPending,
  };
}
