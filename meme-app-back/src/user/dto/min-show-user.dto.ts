import { Expose } from 'class-transformer';

export class MinShowUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}
