import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import ArticleEntity from './article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';
import { CategoriesService } from '../categories/categories.service';
import { ListResponse } from '../../types/common';
import UserEntity from '../users/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: any): Promise<ListResponse<ArticleEntity>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect(
        'article.author',
        'author',
        'author.id = article.authorId',
      )
      .leftJoin('article.categories', 'category')
      .select([
        'article',
        'author.id',
        'author.name',
        'author.email',
        'category.id',
        'category.name',
      ])
      .skip(skip)
      .take(limit);

    if (query.tag) {
      queryBuilder.andWhere('article.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }
    if (query.name) {
      queryBuilder.andWhere('article.title LIKE :title', {
        title: `%${query.name}`,
      });
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');

    const articles = await queryBuilder.getMany();
    const totalRows = await queryBuilder.getCount();

    return {
      data: articles,
      pagination: {
        page,
        limit,
        totalRows,
      },
    };
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    currentUser: UserEntity,
  ): Promise<ArticleEntity> {
    const newSlug = this.getSlug(createArticleDto.title);
    const categories = Array.isArray(createArticleDto.categories)
      ? createArticleDto.categories
      : [];
    const categoryEntities =
      await this.categoriesService.getCategoriesByIds(categories);
    if (!createArticleDto.tagList) {
      createArticleDto.tagList = [];
    }

    const newArticle = await this.articleRepository.create({
      ...createArticleDto,
      slug: newSlug,
      author: currentUser,
      categories: categoryEntities,
    });
    await this.articleRepository.save(newArticle);

    return newArticle;
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.categories', 'category')
      .where('article.slug = :slug', { slug })
      .select([
        'article',
        'author.id',
        'author.name',
        'author.email',
        'category.id',
        'category.name',
      ])
      .getOne();
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ): Promise<ArticleEntity> {
    const updateArticle = await this.findBySlug(slug);
    if (!updateArticle) {
      throw new HttpException('Article does not exits', HttpStatus.NOT_FOUND);
    }
    if (updateArticle.author.id !== userId) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN);
    }
    if (updateArticle.categories) {
      const categories = await this.categoriesService.getCategoriesByIds(
        updateArticleDto.categories,
      );
      updateArticleDto.categories = categories;
    }
    Object.assign(updateArticle, updateArticleDto);
    updateArticle.updatedAt = new Date();

    return await this.articleRepository.save(updateArticle);
  }

  async deleteArticle(slug: string, userId: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exits', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== userId) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN);
    }
    await this.removeCategoriesFromArticle(article);

    return this.articleRepository.delete({ slug });
  }

  async getArticlesByIds(ids: string[]): Promise<ArticleEntity[]> {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.categories', 'category')
      .where('article.id IN (:...ids)', { ids: ids })
      .select([
        'article',
        'author.id',
        'author.name',
        'author.email',
        'category.id',
        'category.name',
      ])
      .getMany();
    if (articles.length !== ids.length) {
      throw new HttpException('Article does not exits', HttpStatus.NOT_FOUND);
    }
    return articles;
  }

  async deleteManyArticle(
    articleIds: string[],
    userId: string,
  ): Promise<DeleteResult> {
    const articles = await this.getArticlesByIds(articleIds);

    const isAuthorized = articles.every(
      (article) => article.author.id === userId,
    );

    if (!isAuthorized) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN);
    }

    for (const article of articles) {
      await this.removeCategoriesFromArticle(article);
    }

    return await this.articleRepository.delete(articleIds);
  }

  private getSlug(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  private async removeCategoriesFromArticle(article: ArticleEntity) {
    const categoryIds = article.categories.map((category) => category.id);
    return await this.articleRepository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .remove(categoryIds);
  }
}
