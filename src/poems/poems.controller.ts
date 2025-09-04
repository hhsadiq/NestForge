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

import { PoemsService } from './poems.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { Poem } from './domain/poem';
import { FindAllPoemsDto } from './dto/find-all-poems.dto';

@ApiTags('Poems')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'poems',
  version: '1',
})
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Poem,
  })
  create(@Body() createPoemDto: CreatePoemDto) {
    return this.poemsService.create(createPoemDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Poem),
  })
  async findAll(
    @Query() query: FindAllPoemsDto,
  ): Promise<InfinityPaginationResponseDto<Poem>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.poemsService.findAllWithPagination({
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
    return this.poemsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Poem,
  })
  update(@Param('id') id: number, @Body() updatePoemDto: UpdatePoemDto) {
    return this.poemsService.update(id, updatePoemDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.poemsService.remove(id);
  }
}
