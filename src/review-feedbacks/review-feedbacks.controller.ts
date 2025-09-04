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

import { ReviewFeedbacksService } from './review-feedbacks.service';
import { CreateReviewFeedbackDto } from './dto/create-review-feedback.dto';
import { UpdateReviewFeedbackDto } from './dto/update-review-feedback.dto';
import { ReviewFeedback } from './domain/review-feedback';
import { FindAllReviewFeedbacksDto } from './dto/find-all-review-feedbacks.dto';

@ApiTags('Review feedbacks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'review-feedbacks',
  version: '1',
})
export class ReviewFeedbacksController {
  constructor(
    private readonly reviewFeedbacksService: ReviewFeedbacksService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: ReviewFeedback,
  })
  create(@Body() createReviewFeedbackDto: CreateReviewFeedbackDto) {
    return this.reviewFeedbacksService.create(createReviewFeedbackDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ReviewFeedback),
  })
  async findAll(
    @Query() query: FindAllReviewFeedbacksDto,
  ): Promise<InfinityPaginationResponseDto<ReviewFeedback>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.reviewFeedbacksService.findAllWithPagination({
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
    return this.reviewFeedbacksService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: ReviewFeedback,
  })
  update(
    @Param('id') id: number,
    @Body() updateReviewFeedbackDto: UpdateReviewFeedbackDto,
  ) {
    return this.reviewFeedbacksService.update(id, updateReviewFeedbackDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.reviewFeedbacksService.remove(id);
  }
}
