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

import { VerseAuthorsService } from './verse-authors.service';
import { CreateVerseAuthorDto } from './dto/create-verse-author.dto';
import { UpdateVerseAuthorDto } from './dto/update-verse-author.dto';
import { VerseAuthor } from './domain/verse-author';
import { FindAllVerseAuthorsDto } from './dto/find-all-verse-authors.dto';

@ApiTags('Verse authors')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'verse-authors',
  version: '1',
})
export class VerseAuthorsController {
  constructor(private readonly verseAuthorsService: VerseAuthorsService) {}

  @Post()
  @ApiCreatedResponse({
    type: VerseAuthor,
  })
  create(@Body() createVerseAuthorDto: CreateVerseAuthorDto) {
    return this.verseAuthorsService.create(createVerseAuthorDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(VerseAuthor),
  })
  async findAll(
    @Query() query: FindAllVerseAuthorsDto,
  ): Promise<InfinityPaginationResponseDto<VerseAuthor>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.verseAuthorsService.findAllWithPagination({
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
    return this.verseAuthorsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: VerseAuthor,
  })
  update(
    @Param('id') id: number,
    @Body() updateVerseAuthorDto: UpdateVerseAuthorDto,
  ) {
    return this.verseAuthorsService.update(id, updateVerseAuthorDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.verseAuthorsService.remove(id);
  }
}
