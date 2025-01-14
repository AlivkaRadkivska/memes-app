import {
  IsOptional,
  IsIn,
  IsArray,
  ArrayMaxSize,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  pictures: string[];

  @IsOptional()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;
}
