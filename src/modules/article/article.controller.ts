import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiPagination } from 'src/utils/pagination.swagger';
import { RequestWithUser } from '../../types';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiPagination()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @Get()
  async findAll(@Query() query: any) {
    return await this.articleService.findAll(query);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.articleService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() article: CreateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.articleService.createArticle(article, req.user);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @Body() article: UpdateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.articleService.updateArticle(slug, article, req.user.id);
  }

  @Delete('delete-many')
  @UseGuards(JwtAuthGuard)
  async deleteArticleMany(
    @Body('articleIds') articleIds: string[],
    @Req() req: RequestWithUser,
  ) {
    return await this.articleService.deleteManyArticle(articleIds, req.user.id);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.articleService.deleteArticle(slug, req.user.id);
  }
}
