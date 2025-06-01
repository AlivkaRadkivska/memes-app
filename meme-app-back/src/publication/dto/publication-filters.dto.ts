export class PublicationFiltersDto {
  keywords?: string;
  status?: string;
  isBanned?: boolean;
  search?: string;
  author?: string;
  authorId?: string;
  createdAtDesc?: string;
  onlyFollowing?: string;

  limit?: number;
  page?: number;
}
