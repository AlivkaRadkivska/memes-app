import { Expose, Type } from 'class-transformer';
import { MinShowUserDto } from 'src/user/dto/min-show-user.dto';

export class PublicationId {
  @Expose()
  id: string;
}

export class ShowCommentDto {
  @Expose()
  id: string;

  @Expose()
  picture?: string;

  @Expose()
  text: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => MinShowUserDto)
  user: MinShowUserDto;

  @Expose()
  @Type(() => PublicationId)
  publication: PublicationId;
}
