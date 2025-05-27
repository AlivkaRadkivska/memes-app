'use client';
import useGetPublications from '@/server/hooks/publications/use-get-publications';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PublicationCard } from './publication-card';
import { Skeleton } from '../ui/skeleton';
import { LoaderCircle } from 'lucide-react';

export function PublicationsContainer() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetPublications({ limit: 3, status: 'active' });

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (data?.pages[0].totalItems === 0) return <div>Нічого не має...</div>;

  return (
    <div>
      {isFetching && (
        <Skeleton className="absolute top-0 right-0 inset-0 w-full h-full bg-background flex items-center justify-center z-10 animate-none">
          <LoaderCircle className="w-36 h-36 animate-spin duration-1000" />
        </Skeleton>
      )}
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
