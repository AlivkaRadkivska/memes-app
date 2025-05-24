import { queryKeys } from '@/server/queryKeys';
import { fetchComments } from '@/server/services/comment-service';
import { Comment, CommentFilters } from '@/server/types/comment';
import { PaginatedData } from '@/server/types/common';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function useGetComments(
  passingFilters?: Partial<CommentFilters>,
  options?: { enabled?: boolean }
) {
  const [filters, setFilters] = useState<Partial<CommentFilters>>({
    ...passingFilters,
    limit: 3,
  });

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PaginatedData<Comment>>({
      queryKey: queryKeys.getComments(filters),
      queryFn: ({ pageParam = 1 }) =>
        fetchComments({ page: pageParam as number, ...filters }),
      getNextPageParam: (res) => {
        return res.items && res.totalPages > res.page ? res.page + 1 : null;
      },
      initialPageParam: 1,
      ...options,
    });

  return {
    data,
    filters,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    setFilters,
  };
}
