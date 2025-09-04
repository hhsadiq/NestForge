import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateWorkflowStatusDto } from './dto/create-workflow-status.dto';
import { UpdateWorkflowStatusDto } from './dto/update-workflow-status.dto';
import { WorkflowStatusAbstractRepository } from './infrastructure/persistence/workflow-status.abstract.repository';
import { WorkflowStatus } from './domain/workflow-status';

@Injectable()
export class WorkflowStatusesService {
  constructor(
    private readonly workflowStatusRepository: WorkflowStatusAbstractRepository,
  ) {}

  create(createWorkflowStatusDto: CreateWorkflowStatusDto) {
    return this.workflowStatusRepository.create(createWorkflowStatusDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.workflowStatusRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: WorkflowStatus['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: WorkflowStatus['id'],
    updateWorkflowStatusDto: UpdateWorkflowStatusDto,
  ) {
    const workflowStatus = this.workflowStatusRepository.update(
      id,
      updateWorkflowStatusDto,
    );
    if (!workflowStatus) {
      throw NOT_FOUND('WorkflowStatus', { id });
    }
    return workflowStatus;
  }

  remove(id: WorkflowStatus['id']) {
    return this.workflowStatusRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.workflowStatusRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on workflowStatus repository.`,
        field,
      );
    }

    const workflowStatus =
      await this.workflowStatusRepository[repoFunction](value);
    if (!workflowStatus) {
      throw NOT_FOUND('WorkflowStatus', { [field]: value });
    }
    return workflowStatus;
  }
}
