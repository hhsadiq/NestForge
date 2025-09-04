import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { WorkflowStatus } from '@src/workflow-statuses/domain/workflow-status';

export abstract class WorkflowStatusAbstractRepository {
  abstract create(
    data: Omit<WorkflowStatus, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WorkflowStatus>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<WorkflowStatus[]>;

  abstract findById(
    id: WorkflowStatus['id'],
  ): Promise<NullableType<WorkflowStatus>>;

  abstract update(
    id: WorkflowStatus['id'],
    payload: DeepPartial<WorkflowStatus>,
  ): Promise<WorkflowStatus | null>;

  abstract remove(id: WorkflowStatus['id']): Promise<void>;
}
