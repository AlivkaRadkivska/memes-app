'use client';

import useGetPublications from '@/server/hooks/publications/use-get-publications';
import { PublicationFilters } from '@/server/types/publication';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { PublicationCard } from '../publications/publication-card';
import { PublicationLocalFilters } from './publication-local-filters';

interface PublicationGridProps {
  userId: string;
  me?: boolean;
}

export function PublicationGrid({ userId, me = false }: PublicationGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    filters,
    setFilters,
  } = useGetPublications({
    authorId: userId,
    status: me ? undefined : 'active',
    limit: 2,
    createdAtDesc: true,
  });

  const handleFilterChange = (newFilters: PublicationFilters) => {
    setFilters({ ...newFilters });
  };

  const { ref, inView } = useInView({ threshold: 1 });
  const isEmpty = useMemo(() => data?.pages[0].totalItems === 0, [data?.pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <div className="flex-1 container px-4 mx-auto max-w-5xl py-6 relative">
      <PublicationLocalFilters
        onFilterChange={handleFilterChange}
        currentFilters={filters}
        me={me}
      />

      {isEmpty && <p>Ніц</p>}
      <div className="grid grid-cols-2 gap-4">
        {data?.pages.flatMap((page) =>
          page.items.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        )}
      </div>

      {isFetchingNextPage && (
        <p className="text-center text-sm p-4">Завантаження...</p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
}
