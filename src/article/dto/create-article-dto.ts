import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  fullDescription: string;

  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  categories?: any[];

  @ApiProperty()
  tagList?: string[];

  @ApiProperty()
  mdContent?: string;

  @ApiProperty()
  htmlContent?: string;
}
