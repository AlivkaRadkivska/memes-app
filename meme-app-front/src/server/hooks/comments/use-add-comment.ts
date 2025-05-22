import { queryKeys } from '@/server/queryKeys';
import { commentPublication } from '@/server/services/comment-service';
import { CommentFilters, CommentPayload } from '@/server/types/comment';
import { CommonError } from '@/server/types/common';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useAddComment(
  passingFilters?: Partial<CommentFilters>,
  options?: UseMutationOptions<void, AxiosError<CommonError>, CommentPayload>
) {
  const queryClient = useQueryClient();
  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (data) => commentPublication(data),
    onMutate: () => toast('Коментар додається...'),
    onSuccess: () => {
      toast('Коментар додано');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getComments(passingFilters),
      });
    },
    onError: (err) => {
      toast('Щось пішло не так...');
      console.error('API Error:', err);
    },
    ...options,
  });

  return {
    addComment,
    isPending,
  };
}
