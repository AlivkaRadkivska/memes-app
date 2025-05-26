import { IsOptional, IsIn, MinLength, IsArray } from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsArray()
  keywords: string[];

  @IsOptional()
  @IsIn(['active', 'hidden'])
  status: string;
}
