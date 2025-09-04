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

import { PoemFormsService } from './poem-forms.service';
import { CreatePoemFormDto } from './dto/create-poem-form.dto';
import { UpdatePoemFormDto } from './dto/update-poem-form.dto';
import { PoemForm } from './domain/poem-form';
import { FindAllPoemFormsDto } from './dto/find-all-poem-forms.dto';

@ApiTags('Poem forms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'poem-forms',
  version: '1',
})
export class PoemFormsController {
  constructor(private readonly poemFormsService: PoemFormsService) {}

  @Post()
  @ApiCreatedResponse({
    type: PoemForm,
  })
  create(@Body() createPoemFormDto: CreatePoemFormDto) {
    return this.poemFormsService.create(createPoemFormDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(PoemForm),
  })
  async findAll(
    @Query() query: FindAllPoemFormsDto,
  ): Promise<InfinityPaginationResponseDto<PoemForm>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.poemFormsService.findAllWithPagination({
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
    return this.poemFormsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: PoemForm,
  })
  update(
    @Param('id') id: number,
    @Body() updatePoemFormDto: UpdatePoemFormDto,
  ) {
    return this.poemFormsService.update(id, updatePoemFormDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.poemFormsService.remove(id);
  }
}
