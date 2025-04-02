'use client';
import useGetPublications from '@/server/hooks/publications/use-get-publications';
import { PublicationCard } from './publication-card';

export function PublicationsContainer() {
  const { publications } = useGetPublications();

  return (
    <div className="flex flex-col width-full height-full">
      {publications?.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          onLike={() => {}}
          onComment={() => {}}
        />
      ))}
    </div>
  );
}
