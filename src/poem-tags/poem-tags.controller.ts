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

import { PoemTagsService } from './poem-tags.service';
import { CreatePoemTagDto } from './dto/create-poem-tag.dto';
import { UpdatePoemTagDto } from './dto/update-poem-tag.dto';
import { PoemTag } from './domain/poem-tag';
import { FindAllPoemTagsDto } from './dto/find-all-poem-tags.dto';

@ApiTags('Poem tags')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'poem-tags',
  version: '1',
})
export class PoemTagsController {
  constructor(private readonly poemTagsService: PoemTagsService) {}

  @Post()
  @ApiCreatedResponse({
    type: PoemTag,
  })
  create(@Body() createPoemTagDto: CreatePoemTagDto) {
    return this.poemTagsService.create(createPoemTagDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PoemTag),
  })
  async findAll(
    @Query() query: FindAllPoemTagsDto,
  ): Promise<InfinityPaginationResponseDto<PoemTag>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.poemTagsService.findAllWithPagination({
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
    return this.poemTagsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PoemTag,
  })
  update(@Param('id') id: number, @Body() updatePoemTagDto: UpdatePoemTagDto) {
    return this.poemTagsService.update(id, updatePoemTagDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.poemTagsService.remove(id);
  }
}
