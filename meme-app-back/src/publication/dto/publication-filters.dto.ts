export class PublicationFiltersDto {
  keywords?: string;
  status?: string;
  isBanned?: boolean;
  search?: string;
  author?: string;
  authorId?: string;
  createdAtDesc?: boolean;

  limit?: number;
  page?: number;
}
