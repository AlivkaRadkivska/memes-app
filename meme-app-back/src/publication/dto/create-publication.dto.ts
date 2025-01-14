import {
  IsNotEmpty,
  IsIn,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  pictures: string[];

  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsNotEmpty()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;
}
