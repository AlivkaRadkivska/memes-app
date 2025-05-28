import {
  dislikePublication,
  likePublication,
} from '@/server/services/publication-service';
import { CommonError } from '@/server/types/common';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePublicationFilters } from './use-publication-filters';
import { queryKeys } from '@/server/queryKeys';

export default function useLike(
  options?: UseMutationOptions<
    void,
    AxiosError<CommonError>,
    { publicationId: string; isLiked: boolean }
  >
) {
  const { filters } = usePublicationFilters();
  const queryClient = useQueryClient();

  const { mutate: like, isPending } = useMutation({
    mutationFn: (data) =>
      data.isLiked
        ? dislikePublication(data.publicationId)
        : likePublication(data.publicationId),
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
    like,
    isPending,
  };
}
