export class PaginatedDataDto<T> {
  items: T[];
  totalItems: number;
  limit: number;
  page: number;
  totalPages: number;
}
