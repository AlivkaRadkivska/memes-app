import { Expose, Type } from 'class-transformer';

class User {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

export class ShowPublicationDto {
  @Expose()
  id: string;

  @Expose()
  pictures: string[];

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  status: string;

  @Expose()
  isBanned: boolean;

  @Expose()
  banReason: string;

  @Expose()
  banExpiresAt: Date;

  @Expose()
  @Type(() => User)
  author: User;
}
