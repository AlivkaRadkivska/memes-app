import { Expose } from 'class-transformer';

export class ShowUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  role: string;

  @Expose()
  birthday: Date;

  @Expose()
  signature: string;

  @Expose()
  isBanned: boolean;

  @Expose()
  banReason: string;

  @Expose()
  banExpiresAt: Date;
}
