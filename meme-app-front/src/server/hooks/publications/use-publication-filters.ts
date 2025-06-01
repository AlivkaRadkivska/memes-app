import { PublicationFilters } from '@/server/types/publication';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function usePublicationFilters(
  passingFilters?: Partial<PublicationFilters>
) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Partial<PublicationFilters>>({
    ...passingFilters,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getBoolean = (value: string | null): boolean | undefined =>
      value === 'true' ? true : false;

    const getNumber = (value: string | null): number | undefined =>
      value !== null ? Number(value) : undefined;

    const params: Partial<PublicationFilters> = {};

    if (searchParams.get('keywords') != null)
      params.keywords = searchParams.get('keywords')!;

    if (searchParams.get('search') != null)
      params.search = searchParams.get('search')!;

    if (searchParams.get('author') != null)
      params.author = searchParams.get('author')!;

    if (searchParams.get('createdAtDesc') != null)
      params.createdAtDesc = getBoolean(searchParams.get('createdAtDesc'))!;

    if (searchParams.get('limit') != null)
      params.limit = getNumber(searchParams.get('limit'))!;

    if (searchParams.get('page') != null)
      params.page = getNumber(searchParams.get('page'))!;

    setFilters((prev) => ({ ...prev, ...params }));
  }, [searchParams]);

  return { filters, currentPage, setCurrentPage, setFilters };
}
