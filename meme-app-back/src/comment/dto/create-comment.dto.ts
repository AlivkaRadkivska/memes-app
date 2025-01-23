import { IsNotEmpty, IsOptional } from 'class-validator';
import { PublicationEntity } from 'src/publication/publication.entity';

export class CreateCommentDto {
  @IsOptional()
  picture: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  publication: PublicationEntity;
}
