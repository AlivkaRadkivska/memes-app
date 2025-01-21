import { IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class CreatePublicationDto {
  pictures: string[];

  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsNotEmpty()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;
}
