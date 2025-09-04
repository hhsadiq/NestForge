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

import { PoemMediaService } from './poem-media.service';
import { CreatePoemMediaDto } from './dto/create-poem-media.dto';
import { UpdatePoemMediaDto } from './dto/update-poem-media.dto';
import { PoemMedia } from './domain/poem-media';
import { FindAllPoemMediaDto } from './dto/find-all-poem-media.dto';

@ApiTags('Poem media')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'poem-media',
  version: '1',
})
export class PoemMediaController {
  constructor(private readonly poemMediaService: PoemMediaService) {}

  @Post()
  @ApiCreatedResponse({
    type: PoemMedia,
  })
  create(@Body() createPoemMediaDto: CreatePoemMediaDto) {
    return this.poemMediaService.create(createPoemMediaDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PoemMedia),
  })
  async findAll(
    @Query() query: FindAllPoemMediaDto,
  ): Promise<InfinityPaginationResponseDto<PoemMedia>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.poemMediaService.findAllWithPagination({
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
    return this.poemMediaService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PoemMedia,
  })
  update(
    @Param('id') id: number,
    @Body() updatePoemMediaDto: UpdatePoemMediaDto,
  ) {
    return this.poemMediaService.update(id, updatePoemMediaDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.poemMediaService.remove(id);
  }
}
