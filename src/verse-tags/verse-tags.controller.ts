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

import { VerseTagsService } from './verse-tags.service';
import { CreateVerseTagDto } from './dto/create-verse-tag.dto';
import { UpdateVerseTagDto } from './dto/update-verse-tag.dto';
import { VerseTag } from './domain/verse-tag';
import { FindAllVerseTagsDto } from './dto/find-all-verse-tags.dto';

@ApiTags('Verse tags')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'verse-tags',
  version: '1',
})
export class VerseTagsController {
  constructor(private readonly verseTagsService: VerseTagsService) {}

  @Post()
  @ApiCreatedResponse({
    type: VerseTag,
  })
  create(@Body() createVerseTagDto: CreateVerseTagDto) {
    return this.verseTagsService.create(createVerseTagDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(VerseTag),
  })
  async findAll(
    @Query() query: FindAllVerseTagsDto,
  ): Promise<InfinityPaginationResponseDto<VerseTag>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.verseTagsService.findAllWithPagination({
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
    return this.verseTagsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: VerseTag,
  })
  update(
    @Param('id') id: number,
    @Body() updateVerseTagDto: UpdateVerseTagDto,
  ) {
    return this.verseTagsService.update(id, updateVerseTagDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.verseTagsService.remove(id);
  }
}
