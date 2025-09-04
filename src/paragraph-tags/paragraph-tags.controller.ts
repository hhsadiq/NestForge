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

import { ParagraphTagsService } from './paragraph-tags.service';
import { CreateParagraphTagDto } from './dto/create-paragraph-tag.dto';
import { UpdateParagraphTagDto } from './dto/update-paragraph-tag.dto';
import { ParagraphTag } from './domain/paragraph-tag';
import { FindAllParagraphTagsDto } from './dto/find-all-paragraph-tags.dto';

@ApiTags('Paragraph tags')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'paragraph-tags',
  version: '1',
})
export class ParagraphTagsController {
  constructor(private readonly paragraphTagsService: ParagraphTagsService) {}

  @Post()
  @ApiCreatedResponse({
    type: ParagraphTag,
  })
  create(@Body() createParagraphTagDto: CreateParagraphTagDto) {
    return this.paragraphTagsService.create(createParagraphTagDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ParagraphTag),
  })
  async findAll(
    @Query() query: FindAllParagraphTagsDto,
  ): Promise<InfinityPaginationResponseDto<ParagraphTag>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paragraphTagsService.findAllWithPagination({
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
    return this.paragraphTagsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: ParagraphTag,
  })
  update(
    @Param('id') id: number,
    @Body() updateParagraphTagDto: UpdateParagraphTagDto,
  ) {
    return this.paragraphTagsService.update(id, updateParagraphTagDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.paragraphTagsService.remove(id);
  }
}
