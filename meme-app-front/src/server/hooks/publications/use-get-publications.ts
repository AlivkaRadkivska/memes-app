import { queryKeys } from '@/server/queryKeys';
import { fetchPublications } from '@/server/services/publication-service';
import { PaginatedData } from '@/server/types/common';
import { Publication, PublicationFilters } from '@/server/types/publication';
import { useInfiniteQuery } from '@tanstack/react-query';
import { usePublicationFilters } from './use-publication-filters';

export default function useGetPublications(
  passingFilters?: Partial<PublicationFilters>
) {
  const { filters, setFilters, setCurrentPage } =
    usePublicationFilters(passingFilters);

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<PaginatedData<Publication>>({
    queryKey: queryKeys.getPublications({ ...filters }),
    queryFn: ({ pageParam = 1 }) => {
      setCurrentPage(pageParam as number);
      return fetchPublications({ ...filters, page: pageParam as number });
    },
    getNextPageParam: (res) => {
      return res.items && res.totalPages > res.page ? res.page + 1 : null;
    },
    initialPageParam: 1,
  });

  return {
    data,
    isInitialFetching: isFetching && !isFetchingNextPage,
    hasNextPage,
    isFetchingNextPage,
    filters,
    setFilters,
    refetch,
    fetchNextPage,
  };
}
