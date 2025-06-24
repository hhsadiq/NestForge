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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { ClapsService } from './claps.service';
import { Clap } from './domain/clap';
import { CreateClapDto } from './dto/create-clap.dto';
import { FindAllClapsDto } from './dto/find-all-claps.dto';
import { UpdateClapDto } from './dto/update-clap.dto';

@ApiTags('Claps')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'claps',
  version: '1',
})
export class ClapsController {
  constructor(private readonly clapsService: ClapsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Clap,
  })
  create(@Body() createClapDto: CreateClapDto) {
    return this.clapsService.create(createClapDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Clap),
  })
  async findAll(
    @Query() query: FindAllClapsDto,
  ): Promise<InfinityPaginationResponseDto<Clap>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.clapsService.findAllWithPagination({
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
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.clapsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Clap,
  })
  update(@Param('id') id: string, @Body() updateClapDto: UpdateClapDto) {
    return this.clapsService.update(id, updateClapDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.clapsService.remove(id);
  }
}
