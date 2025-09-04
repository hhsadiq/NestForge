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

import { TranslatorsService } from './translators.service';
import { CreateTranslatorDto } from './dto/create-translator.dto';
import { UpdateTranslatorDto } from './dto/update-translator.dto';
import { Translator } from './domain/translator';
import { FindAllTranslatorsDto } from './dto/find-all-translators.dto';

@ApiTags('Translators')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'translators',
  version: '1',
})
export class TranslatorsController {
  constructor(private readonly translatorsService: TranslatorsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Translator,
  })
  create(@Body() createTranslatorDto: CreateTranslatorDto) {
    return this.translatorsService.create(createTranslatorDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Translator),
  })
  async findAll(
    @Query() query: FindAllTranslatorsDto,
  ): Promise<InfinityPaginationResponseDto<Translator>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.translatorsService.findAllWithPagination({
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
    return this.translatorsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Translator,
  })
  update(
    @Param('id') id: number,
    @Body() updateTranslatorDto: UpdateTranslatorDto,
  ) {
    return this.translatorsService.update(id, updateTranslatorDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.translatorsService.remove(id);
  }
}
