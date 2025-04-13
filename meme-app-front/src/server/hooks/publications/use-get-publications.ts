import { queryKeys } from '@/server/queryKeys';
import { fetchPublications } from '@/server/services/publication-service';
import { Publication } from '@/server/types/publication';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function useGetPublications() {
  const {
    data: publications,
    isLoading: arePublicationsLoading,
    refetch: refetchPublications,
  } = useQuery<Publication[]>({
    queryKey: queryKeys.getPublications(),
    queryFn: () => fetchPublications(),
    placeholderData: keepPreviousData,
  });

  return {
    publications,
    arePublicationsLoading,
    refetchPublications,
  };
}
