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

import { ReviewersService } from './reviewers.service';
import { CreateReviewerDto } from './dto/create-reviewer.dto';
import { UpdateReviewerDto } from './dto/update-reviewer.dto';
import { Reviewer } from './domain/reviewer';
import { FindAllReviewersDto } from './dto/find-all-reviewers.dto';

@ApiTags('Reviewers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'reviewers',
  version: '1',
})
export class ReviewersController {
  constructor(private readonly reviewersService: ReviewersService) {}

  @Post()
  @ApiCreatedResponse({
    type: Reviewer,
  })
  create(@Body() createReviewerDto: CreateReviewerDto) {
    return this.reviewersService.create(createReviewerDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Reviewer),
  })
  async findAll(
    @Query() query: FindAllReviewersDto,
  ): Promise<InfinityPaginationResponseDto<Reviewer>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.reviewersService.findAllWithPagination({
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
    return this.reviewersService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: Reviewer,
  })
  update(
    @Param('id') id: number,
    @Body() updateReviewerDto: UpdateReviewerDto,
  ) {
    return this.reviewersService.update(id, updateReviewerDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.reviewersService.remove(id);
  }
}
