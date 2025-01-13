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
  status: string;

  @Expose()
  @Type(() => User)
  author: User;
}
