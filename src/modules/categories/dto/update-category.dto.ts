import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsOptional()
  updatedAt: Date;
}
