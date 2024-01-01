import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import CategoryEntity from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryReposity: Repository<CategoryEntity>,
  ) {}
  async findAll() {
    return await this.categoryReposity.find({ relations: ['articles'] });
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryReposity.findOne({
      where: { id },
      relations: ['articles'],
    });
    if (!category) {
      throw new HttpException('Category does not exits', HttpStatus.NOT_FOUND);
    }
    return category;
  }
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const newCategory = this.categoryReposity.create(createCategoryDto);
    await this.categoryReposity.save(newCategory);
    return newCategory;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    updateCategoryDto.updatedAt = new Date();

    await this.categoryReposity.update(id, updateCategoryDto);
    const updatedCategory = await this.findById(id);

    return updatedCategory;
  }

  async removeCategory(id: string): Promise<DeleteResult> {
    const article = await this.findById(id);
    if (!article) {
      throw new HttpException('Category does not exits', HttpStatus.NOT_FOUND);
    }
    return this.categoryReposity.delete({ id });
  }

  async getCategoriesByIds(ids: string[]): Promise<CategoryEntity[]> {
    const categories = await this.categoryReposity.find({
      where: { id: In(ids) },
    });

    if (categories.length !== ids.length) {
      throw new HttpException('Category does not exits', HttpStatus.NOT_FOUND);
    }

    return categories;
  }
}
