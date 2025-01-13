import {
  IsNotEmpty,
  IsIn,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  pictures: string[];

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsIn(['active', 'hidden', 'draft'])
  status: string;
}
