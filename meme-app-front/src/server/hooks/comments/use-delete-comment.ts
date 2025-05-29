import { queryKeys } from '@/server/queryKeys';
import { deleteCommentFromPublication } from '@/server/services/comment-service';
import { CommentFilters } from '@/server/types/comment';
import { CommonError } from '@/server/types/common';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useDeleteComment(
  passingFilters?: Partial<CommentFilters>,
  options?: UseMutationOptions<void, AxiosError<CommonError>, string>
) {
  const queryClient = useQueryClient();
  const { mutate: deleteComment, isPending } = useMutation({
    mutationFn: (data) => deleteCommentFromPublication(data),
    onSuccess: () => {
      toast('Коментар видалено');
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
    deleteComment,
    isPending,
  };
}
