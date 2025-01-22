import { IsOptional, IsIn, MinLength } from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  pictures: string[];

  @IsOptional()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;
}
