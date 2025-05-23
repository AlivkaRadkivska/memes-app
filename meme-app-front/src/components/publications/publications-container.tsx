'use client';
import useGetPublications from '@/server/hooks/publications/use-get-publications';
import { useInView } from 'react-intersection-observer';
import { PublicationCard } from './publication-card';
import { useEffect } from 'react';

export function PublicationsContainer() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPublications();

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.flatMap((page) =>
        page.items.map((publication) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            onLike={() => {}}
            onComment={() => {}}
          />
        ))
      )}

      {isFetchingNextPage && (
        <p className="text-center text-sm">Завантаження...</p>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
}
