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

import { VersesService } from './verses.service';
import { CreateVerseDto } from './dto/create-verse.dto';
import { UpdateVerseDto } from './dto/update-verse.dto';
import { Verse } from './domain/verse';
import { FindAllVersesDto } from './dto/find-all-verses.dto';

@ApiTags('Verses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'verses',
  version: '1',
})
export class VersesController {
  constructor(private readonly versesService: VersesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Verse,
  })
  create(@Body() createVerseDto: CreateVerseDto) {
    return this.versesService.create(createVerseDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Verse),
  })
  async findAll(
    @Query() query: FindAllVersesDto,
  ): Promise<InfinityPaginationResponseDto<Verse>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.versesService.findAllWithPagination({
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
    return this.versesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Verse,
  })
  update(@Param('id') id: number, @Body() updateVerseDto: UpdateVerseDto) {
    return this.versesService.update(id, updateVerseDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.versesService.remove(id);
  }
}
