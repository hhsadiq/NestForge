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

import { FeedbackPresetsService } from './feedback-presets.service';
import { CreateFeedbackPresetDto } from './dto/create-feedback-preset.dto';
import { UpdateFeedbackPresetDto } from './dto/update-feedback-preset.dto';
import { FeedbackPreset } from './domain/feedback-preset';
import { FindAllFeedbackPresetsDto } from './dto/find-all-feedback-presets.dto';

@ApiTags('Feedback presets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'feedback-presets',
  version: '1',
})
export class FeedbackPresetsController {
  constructor(
    private readonly feedbackPresetsService: FeedbackPresetsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: FeedbackPreset,
  })
  create(@Body() createFeedbackPresetDto: CreateFeedbackPresetDto) {
    return this.feedbackPresetsService.create(createFeedbackPresetDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(FeedbackPreset),
  })
  async findAll(
    @Query() query: FindAllFeedbackPresetsDto,
  ): Promise<InfinityPaginationResponseDto<FeedbackPreset>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.feedbackPresetsService.findAllWithPagination({
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
    return this.feedbackPresetsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: FeedbackPreset,
  })
  update(
    @Param('id') id: number,
    @Body() updateFeedbackPresetDto: UpdateFeedbackPresetDto,
  ) {
    return this.feedbackPresetsService.update(id, updateFeedbackPresetDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.feedbackPresetsService.remove(id);
  }
}
