import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Comment } from '@src/comments/domain/comment';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import {
  PaginationResponse,
  PaginationResponseDto,
} from '@src/utils/dto/pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { ArticlesService } from './articles.service';
import { Article } from './domain/article';
import { ArticleResponseMessageDto } from './dto/article-response-message.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentPathParamDto } from './dto/create-comment-path-param.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentPathParamDto } from './dto/delete-comment-path-param.dto';
import { FindAllArticlesFeedDto } from './dto/find-all-articles-feed.dto';
import { FindAllArticlesDto } from './dto/find-all-articles.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller({
  path: 'articles',
  version: '1',
})
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    type: Article,
  })
  async create(@Body() createArticleDto: CreateArticleDto, @Request() request) {
    return await this.articlesService.create(createArticleDto, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('standard')
  @ApiOkResponse({
    type: PaginationResponse(Article),
  })
  findAllPaginated(
    @Query() query: FindAllArticlesDto,
  ): Promise<PaginationResponseDto<Article>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return this.articlesService.findAllWithPaginationStandard({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Article),
  })
  async findAll(
    @Query() query: FindAllArticlesDto,
  ): Promise<InfinityPaginationResponseDto<Article>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.articlesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Article,
  })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/comments')
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    type: Comment,
  })
  async addComment(
    @Param() params: CreateCommentPathParamDto,
    @Body() createCommentDto: CreateCommentDto,
    @Request() request,
  ) {
    const { slug } = params;
    const { body } = createCommentDto;
    return this.articlesService.createComment(slug, body, request.user);
  }

  @Get(':slug/comments')
  @ApiOkResponse({
    type: InfinityPaginationResponse(Comment),
  })
  async findAllComments(
    @Param() params: CreateCommentPathParamDto,
    @Query() query: FindAllCommentsDto,
  ): Promise<InfinityPaginationResponseDto<Comment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;

    if (limit > 50) {
      limit = 50;
    }

    const { slug } = params;

    return infinityPagination(
      await this.articlesService.findAllCommentsWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        slug,
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':slug/comments/:id')
  removeComment(
    @Param() params: DeleteCommentPathParamDto,
    @Request() request,
  ) {
    const { id, slug } = params;
    return this.articlesService.removeComment(id, slug, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/favorite')
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  @ApiResponse({
    type: ArticleResponseMessageDto,
  })
  async favoriteArticle(
    @Param('slug') slug: string,
    @Request() request,
  ): Promise<ArticleResponseMessageDto> {
    const user = request.user;
    const result = await this.articlesService.favoriteArticle(slug, user);
    return { message: result };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':slug/favorite')
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
  })
  @ApiResponse({
    type: ArticleResponseMessageDto,
  })
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @Request() request,
  ): Promise<ArticleResponseMessageDto> {
    const user = request.user;
    const result = await this.articlesService.unfavoriteArticle(slug, user);
    return { message: result };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/feed')
  @ApiOkResponse({
    type: InfinityPaginationResponse(Article),
  })
  async getFeedArticles(
    @Request() request,
    @Query() query: FindAllArticlesFeedDto,
  ): Promise<InfinityPaginationResponseDto<Article>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const user = request.user;

    return infinityPagination(
      await this.articlesService.getFeedArticles({
        paginationOptions: { limit, page },
        user,
      }),
      { page, limit },
    );
  }
}
