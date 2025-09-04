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

import { ParagraphsService } from './paragraphs.service';
import { CreateParagraphDto } from './dto/create-paragraph.dto';
import { UpdateParagraphDto } from './dto/update-paragraph.dto';
import { Paragraph } from './domain/paragraph';
import { FindAllParagraphsDto } from './dto/find-all-paragraphs.dto';

@ApiTags('Paragraphs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'paragraphs',
  version: '1',
})
export class ParagraphsController {
  constructor(private readonly paragraphsService: ParagraphsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Paragraph,
  })
  create(@Body() createParagraphDto: CreateParagraphDto) {
    return this.paragraphsService.create(createParagraphDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Paragraph),
  })
  async findAll(
    @Query() query: FindAllParagraphsDto,
  ): Promise<InfinityPaginationResponseDto<Paragraph>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paragraphsService.findAllWithPagination({
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
    return this.paragraphsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Paragraph,
  })
  update(
    @Param('id') id: number,
    @Body() updateParagraphDto: UpdateParagraphDto,
  ) {
    return this.paragraphsService.update(id, updateParagraphDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.paragraphsService.remove(id);
  }
}
