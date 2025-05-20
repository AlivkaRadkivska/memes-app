import { UserRole } from 'src/user/dto/user-role.dto';

export class AuthResultDto {
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
  };
  accessToken: string;
}
