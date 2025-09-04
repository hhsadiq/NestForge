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

import { WorkflowStatusesService } from './workflow-statuses.service';
import { CreateWorkflowStatusDto } from './dto/create-workflow-status.dto';
import { UpdateWorkflowStatusDto } from './dto/update-workflow-status.dto';
import { WorkflowStatus } from './domain/workflow-status';
import { FindAllWorkflowStatusesDto } from './dto/find-all-workflow-statuses.dto';

@ApiTags('Workflow statuses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'workflow-statuses',
  version: '1',
})
export class WorkflowStatusesController {
  constructor(
    private readonly workflowStatusesService: WorkflowStatusesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: WorkflowStatus,
  })
  create(@Body() createWorkflowStatusDto: CreateWorkflowStatusDto) {
    return this.workflowStatusesService.create(createWorkflowStatusDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(WorkflowStatus),
  })
  async findAll(
    @Query() query: FindAllWorkflowStatusesDto,
  ): Promise<InfinityPaginationResponseDto<WorkflowStatus>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.workflowStatusesService.findAllWithPagination({
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
    return this.workflowStatusesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: WorkflowStatus,
  })
  update(
    @Param('id') id: number,
    @Body() updateWorkflowStatusDto: UpdateWorkflowStatusDto,
  ) {
    return this.workflowStatusesService.update(id, updateWorkflowStatusDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.workflowStatusesService.remove(id);
  }
}
