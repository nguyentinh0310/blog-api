import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { CategoriesService } from 'src/categories/categories.service';
import { ListResponse } from 'src/types/common';
import UserEntity from 'src/users/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import ArticleEntity from './article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';

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
      .createQueryBuilder('articles')
      .leftJoinAndSelect(
        'articles.author',
        'author',
        'author.id = articles.authorId',
      )
      .select(['articles', 'author.id', 'author.name', 'author.email'])
      .leftJoinAndSelect('articles.categories', 'category')
      .skip(skip)
      .take(limit);

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }
    queryBuilder.orderBy('articles.createdAt', 'DESC');

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
    const categoryEntities = await this.categoriesService.getCategoriesByIds(
      categories,
    );
    if (!createArticleDto.tagList) {
      createArticleDto.tagList = [];
    }

    const newPost = await this.articleRepository.create({
      ...createArticleDto,
      slug: newSlug,
      author: currentUser,
      categories: categoryEntities,
    });
    await this.articleRepository.save(newPost);

    return newPost;
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
    const updatePost = await this.findBySlug(slug);
    if (!updatePost) {
      throw new HttpException('Article does not exits', HttpStatus.NOT_FOUND);
    }
    if (updatePost.author.id !== userId) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN);
    }
    if (updatePost.categories) {
      const categories = await this.categoriesService.getCategoriesByIds(
        updateArticleDto.categories,
      );
      updateArticleDto.categories = categories;
    }
    Object.assign(updatePost, updateArticleDto);
    updatePost.updatedAt = new Date();

    return await this.articleRepository.save(updatePost);
  }

  async deleteArticle(slug: string, userId: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exits', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== userId) {
      throw new HttpException('You are not author', HttpStatus.FORBIDDEN);
    }

    const categoryIds = article.categories.map((category) => category.id);
    await this.articleRepository
      .createQueryBuilder()
      .relation(ArticleEntity, 'categories')
      .of(article)
      .remove(categoryIds);

    return this.articleRepository.delete({ slug });
  }

  private getSlug(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
