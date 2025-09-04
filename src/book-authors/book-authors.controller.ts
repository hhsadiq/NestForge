import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { BookAuthorsService } from './book-authors.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { BookAuthor } from './domain/book-author';
import { FindAllBookAuthorsDto } from './dto/find-all-book-authors.dto';

@ApiTags('Book authors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'book-authors',
  version: '1',
})
export class BookAuthorsController {
  constructor(private readonly bookAuthorsService: BookAuthorsService) {}

  @Post()
  @ApiCreatedResponse({
    type: BookAuthor,
  })
  create(@Body() createBookAuthorDto: CreateBookAuthorDto) {
    return this.bookAuthorsService.create(createBookAuthorDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(BookAuthor),
  })
  async findAll(
    @Query() query: FindAllBookAuthorsDto,
  ): Promise<InfinityPaginationResponseDto<BookAuthor>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.bookAuthorsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findOne(@Param('id') id: number) {
    return this.bookAuthorsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: BookAuthor,
  })
  update(
    @Param('id') id: number,
    @Body() updateBookAuthorDto: UpdateBookAuthorDto,
  ) {
    return this.bookAuthorsService.update(id, updateBookAuthorDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.bookAuthorsService.remove(id);
  }
}
