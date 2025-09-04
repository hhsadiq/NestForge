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

import { MediaPlatformsService } from './media-platforms.service';
import { CreateMediaPlatformDto } from './dto/create-media-platform.dto';
import { UpdateMediaPlatformDto } from './dto/update-media-platform.dto';
import { MediaPlatform } from './domain/media-platform';
import { FindAllMediaPlatformsDto } from './dto/find-all-media-platforms.dto';

@ApiTags('Media platforms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'media-platforms',
  version: '1',
})
export class MediaPlatformsController {
  constructor(private readonly mediaPlatformsService: MediaPlatformsService) {}

  @Post()
  @ApiCreatedResponse({
    type: MediaPlatform,
  })
  create(@Body() createMediaPlatformDto: CreateMediaPlatformDto) {
    return this.mediaPlatformsService.create(createMediaPlatformDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(MediaPlatform),
  })
  async findAll(
    @Query() query: FindAllMediaPlatformsDto,
  ): Promise<InfinityPaginationResponseDto<MediaPlatform>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.mediaPlatformsService.findAllWithPagination({
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
    return this.mediaPlatformsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: MediaPlatform,
  })
  update(
    @Param('id') id: number,
    @Body() updateMediaPlatformDto: UpdateMediaPlatformDto,
  ) {
    return this.mediaPlatformsService.update(id, updateMediaPlatformDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.mediaPlatformsService.remove(id);
  }
}
