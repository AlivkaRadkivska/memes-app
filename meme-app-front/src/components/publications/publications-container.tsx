'use client';
import useGetPublications from '@/server/hooks/publications/use-get-publications';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PublicationCard } from './publication-card';

export function PublicationsContainer() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPublications();

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (data?.pages[0].totalItems === 0) return <div>Нічого не має...</div>;

  return (
    <div>
      {data?.pages.flatMap((page) =>
        page.items.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} />
        ))
      )}

      {isFetchingNextPage && (
        <p className="text-center text-sm p-4">Завантаження...</p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
}
