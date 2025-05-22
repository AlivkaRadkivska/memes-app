import { queryKeys } from '@/server/queryKeys';
import { fetchPublications } from '@/server/services/publication-service';
import { PaginatedData } from '@/server/types/common';
import { Publication, PublicationFilters } from '@/server/types/publication';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function useGetPublications(
  passingFilters?: Partial<PublicationFilters>
) {
  const [filters, setFilters] = useState<Partial<PublicationFilters>>({
    ...passingFilters,
    limit: 3,
  });

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<PaginatedData<Publication>>({
      queryKey: queryKeys.getPublications({ ...filters }),
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
    setFilters,
    fetchNextPage,
  };
}
