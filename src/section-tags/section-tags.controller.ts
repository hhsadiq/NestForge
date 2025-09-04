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

import { SectionTagsService } from './section-tags.service';
import { CreateSectionTagDto } from './dto/create-section-tag.dto';
import { UpdateSectionTagDto } from './dto/update-section-tag.dto';
import { SectionTag } from './domain/section-tag';
import { FindAllSectionTagsDto } from './dto/find-all-section-tags.dto';

@ApiTags('Section tags')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'section-tags',
  version: '1',
})
export class SectionTagsController {
  constructor(private readonly sectionTagsService: SectionTagsService) {}

  @Post()
  @ApiCreatedResponse({
    type: SectionTag,
  })
  create(@Body() createSectionTagDto: CreateSectionTagDto) {
    return this.sectionTagsService.create(createSectionTagDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(SectionTag),
  })
  async findAll(
    @Query() query: FindAllSectionTagsDto,
  ): Promise<InfinityPaginationResponseDto<SectionTag>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.sectionTagsService.findAllWithPagination({
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
    return this.sectionTagsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: SectionTag,
  })
  update(
    @Param('id') id: number,
    @Body() updateSectionTagDto: UpdateSectionTagDto,
  ) {
    return this.sectionTagsService.update(id, updateSectionTagDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.sectionTagsService.remove(id);
  }
}
