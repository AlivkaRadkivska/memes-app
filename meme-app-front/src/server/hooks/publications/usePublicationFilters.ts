import { PublicationFilters } from '@/server/types/publication';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function usePublicationFilters(): Partial<PublicationFilters> {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const getBoolean = (value: string | null): boolean | undefined =>
      value === 'true' ? true : value === 'false' ? false : undefined;

    const getNumber = (value: string | null): number | undefined =>
      value !== null ? Number(value) : undefined;

    const params: Partial<PublicationFilters> = {
      keywords: searchParams.get('keywords') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      isBanned: getBoolean(searchParams.get('isBanned')),
      search: searchParams.get('search') ?? undefined,
      author: searchParams.get('author') ?? undefined,
      createdAtDesc: getBoolean(searchParams.get('createdAtDesc')),
      limit: getNumber(searchParams.get('limit')),
      page: getNumber(searchParams.get('page')),
    };

    return params;
  }, [searchParams]);

  return filters;
}
