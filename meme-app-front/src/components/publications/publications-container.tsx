'use client';
import useGetPublications from '@/server/hooks/publications/use-get-publications';

export function PublicationsContainer() {
  const { publications } = useGetPublications();
  console.log(publications);

  return <div></div>;
}
