import { Expose, Type } from 'class-transformer';
import { MinShowUserDto } from 'src/user/dto/min-show-user.dto';

export class ShowLikeDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => MinShowUserDto)
  user: MinShowUserDto;

  @Expose()
  @Type(
    () =>
      class {
        id: string;
      },
  )
  publication: { id: string };
}
