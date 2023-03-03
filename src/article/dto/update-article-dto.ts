import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
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
