import { UserRole } from './user-role.dto';

export class UserFiltersDto {
  email?: string;
  name?: string;
  role?: UserRole;
  birthday?: string;
  isBanned?: boolean;
  search?: string;

  limit?: number;
  page?: number;
}
