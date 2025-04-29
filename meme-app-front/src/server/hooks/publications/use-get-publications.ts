import { queryKeys } from '@/server/queryKeys';
import { fetchPublications } from '@/server/services/publication-service';
import { PaginatedData } from '@/server/types/common';
import { Publication } from '@/server/types/publication';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useGetPublications() {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PaginatedData<Publication>>({
      queryKey: queryKeys.getPublications(),
      queryFn: ({ pageParam = 1 }) =>
        fetchPublications({ page: pageParam as number }),
      getNextPageParam: (res) => {
        return res.items && res.totalPages > res.page ? res.page + 1 : null;
      },
      initialPageParam: 1,
    });

  return {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
