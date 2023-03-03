import { UpdateArticleDto } from './dto/update-article-dto';
import { ArticleService } from './article.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';
import { CreateArticleDto } from './dto/create-article-dto';
import { RequestWithUser } from 'src/types/authentication.interface';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPagination } from 'src/utils/pagination.swagger';

@ApiBearerAuth('defaultBearerAuth')
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiPagination()
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

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param('slug') slug: string,
    @Body() article: UpdateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.articleService.updateArticle(slug, article, req.user.id);
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
