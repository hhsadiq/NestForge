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

import { StanzasService } from './stanzas.service';
import { CreateStanzaDto } from './dto/create-stanza.dto';
import { UpdateStanzaDto } from './dto/update-stanza.dto';
import { Stanza } from './domain/stanza';
import { FindAllStanzasDto } from './dto/find-all-stanzas.dto';

@ApiTags('Stanzas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'stanzas',
  version: '1',
})
export class StanzasController {
  constructor(private readonly stanzasService: StanzasService) {}

  @Post()
  @ApiCreatedResponse({
    type: Stanza,
  })
  create(@Body() createStanzaDto: CreateStanzaDto) {
    return this.stanzasService.create(createStanzaDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Stanza),
  })
  async findAll(
    @Query() query: FindAllStanzasDto,
  ): Promise<InfinityPaginationResponseDto<Stanza>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.stanzasService.findAllWithPagination({
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
    return this.stanzasService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Stanza,
  })
  update(@Param('id') id: number, @Body() updateStanzaDto: UpdateStanzaDto) {
    return this.stanzasService.update(id, updateStanzaDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.stanzasService.remove(id);
  }
}
