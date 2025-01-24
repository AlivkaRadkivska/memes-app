import { IsNotEmpty } from 'class-validator';
import { PublicationEntity } from 'src/publication/publication.entity';

export class CreateLikeDto {
  @IsNotEmpty()
  publication: PublicationEntity;
}
