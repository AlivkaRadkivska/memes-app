import {
  dislikePublication,
  likePublication,
} from '@/server/services/publication-service';
import { CommonError } from '@/server/types/common';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function useLike(
  options?: UseMutationOptions<
    void,
    AxiosError<CommonError>,
    { publicationId: string; isLiked: boolean }
  >
) {
  const { mutate: like, isPending } = useMutation({
    mutationFn: (data) =>
      data.isLiked
        ? dislikePublication(data.publicationId)
        : likePublication(data.publicationId),
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
