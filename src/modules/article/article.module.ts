import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import ArticleEntity from './article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), CategoriesModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
