import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { ArticleController } from './article.controller';
import ArticleEntity from './article.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [CategoriesModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
