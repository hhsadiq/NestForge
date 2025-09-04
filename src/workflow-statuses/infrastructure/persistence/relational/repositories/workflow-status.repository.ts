import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { WorkflowStatus } from '@src/workflow-statuses/domain/workflow-status';
import { WorkflowStatusAbstractRepository } from '@src/workflow-statuses/infrastructure/persistence/workflow-status.abstract.repository';
import { WorkflowStatusMapper } from '@src/workflow-statuses/infrastructure/persistence/relational/mappers/workflow-status.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { WorkflowStatusEntity } from '@src/workflow-statuses/infrastructure/persistence/relational/entities/workflow-status.entity';

@Injectable()
export class WorkflowStatusRelationalRepository
  implements WorkflowStatusAbstractRepository
{
  constructor(
    @InjectRepository(WorkflowStatusEntity)
    private readonly workflowStatusRepository: Repository<WorkflowStatusEntity>,
  ) {}

  async create(data: WorkflowStatus): Promise<WorkflowStatus> {
    const persistenceModel = WorkflowStatusMapper.toPersistence(data);
    const newEntity = await this.workflowStatusRepository.save(
      this.workflowStatusRepository.create(persistenceModel),
    );
    return WorkflowStatusMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WorkflowStatus[]> {
    const entities = await this.workflowStatusRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => WorkflowStatusMapper.toDomain(entity));
  }

  async findById(
    id: WorkflowStatus['id'],
  ): Promise<NullableType<WorkflowStatus>> {
    const entity = await this.workflowStatusRepository.findOne({
      where: { id },
    });

    return entity ? WorkflowStatusMapper.toDomain(entity) : null;
  }

  async update(
    id: WorkflowStatus['id'],
    payload: Partial<WorkflowStatus>,
  ): Promise<WorkflowStatus | null> {
    const entity = await this.workflowStatusRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.workflowStatusRepository.save(
      this.workflowStatusRepository.create(
        WorkflowStatusMapper.toPersistence({
          ...WorkflowStatusMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return WorkflowStatusMapper.toDomain(updatedEntity);
  }

  async remove(id: WorkflowStatus['id']): Promise<void> {
    await this.workflowStatusRepository.delete(id);
  }
}
