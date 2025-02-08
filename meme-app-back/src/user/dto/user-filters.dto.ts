export class UserFiltersDto {
  email?: string;
  name?: string;
  role?: 'user' | 'moderator';
  birthday?: string;
  isBanned?: boolean;
  search?: string;
}
