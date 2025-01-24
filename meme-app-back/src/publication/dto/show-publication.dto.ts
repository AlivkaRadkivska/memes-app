import { Expose, Type } from 'class-transformer';
import { MinShowUserDto } from 'src/user/dto/min-show-user.dto';

export class ShowPublicationDto {
  @Expose()
  id: string;

  @Expose()
  pictures: string[];

  @Expose()
  description: string;

  @Expose()
  keywords: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  lastUpdatedAt: Date;

  @Expose()
  status: string;

  @Expose()
  isBanned: boolean;

  @Expose()
  banReason: string;

  @Expose()
  banExpiresAt: Date;

  @Expose()
  @Type(() => MinShowUserDto)
  author: MinShowUserDto;

  @Expose()
  likesCount: number;

  @Expose()
  isLiked: boolean;
}
