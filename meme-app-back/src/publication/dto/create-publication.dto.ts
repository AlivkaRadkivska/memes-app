import {
  IsNotEmpty,
  IsIn,
  MinLength,
  ArrayMinSize,
  IsArray,
  IsString,
} from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @MinLength(1)
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keywords: string[];

  @IsNotEmpty()
  @IsIn(['active', 'hidden'])
  status: string;
}
