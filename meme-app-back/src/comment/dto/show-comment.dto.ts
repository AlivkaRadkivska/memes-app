import { Expose, Type } from 'class-transformer';
import { ShowPublicationDto } from 'src/publication/dto/show-publication.dto';
import { MinShowUserDto } from 'src/user/dto/min-show-user.dto';

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
  @Type(() => ShowPublicationDto)
  publication: ShowCommentDto;
}
