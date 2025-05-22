import { queryKeys } from '@/server/queryKeys';
import { fetchPublications } from '@/server/services/publication-service';
import { PaginatedData } from '@/server/types/common';
import { Publication } from '@/server/types/publication';
import { useInfiniteQuery } from '@tanstack/react-query';
import { usePublicationFilters } from './usePublicationFilters';

export default function useGetPublications() {
  const filters = usePublicationFilters();

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<PaginatedData<Publication>>({
    queryKey: queryKeys.getPublications(filters),
    queryFn: ({ pageParam = 1 }) =>
      fetchPublications({ ...filters, page: pageParam as number }),
    getNextPageParam: (res) => {
      return res.items && res.totalPages > res.page ? res.page + 1 : null;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    filters,
    refetch,
    fetchNextPage,
  };
}
