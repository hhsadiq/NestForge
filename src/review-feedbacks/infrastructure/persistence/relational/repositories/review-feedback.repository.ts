import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { ReviewFeedback } from '@src/review-feedbacks/domain/review-feedback';
import { ReviewFeedbackAbstractRepository } from '@src/review-feedbacks/infrastructure/persistence/review-feedback.abstract.repository';
import { ReviewFeedbackMapper } from '@src/review-feedbacks/infrastructure/persistence/relational/mappers/review-feedback.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ReviewFeedbackEntity } from '@src/review-feedbacks/infrastructure/persistence/relational/entities/review-feedback.entity';

@Injectable()
export class ReviewFeedbackRelationalRepository
  implements ReviewFeedbackAbstractRepository
{
  constructor(
    @InjectRepository(ReviewFeedbackEntity)
    private readonly reviewFeedbackRepository: Repository<ReviewFeedbackEntity>,
  ) {}

  async create(data: ReviewFeedback): Promise<ReviewFeedback> {
    const persistenceModel = ReviewFeedbackMapper.toPersistence(data);
    const newEntity = await this.reviewFeedbackRepository.save(
      this.reviewFeedbackRepository.create(persistenceModel),
    );
    return ReviewFeedbackMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ReviewFeedback[]> {
    const entities = await this.reviewFeedbackRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ReviewFeedbackMapper.toDomain(entity));
  }

  async findById(
    id: ReviewFeedback['id'],
  ): Promise<NullableType<ReviewFeedback>> {
    const entity = await this.reviewFeedbackRepository.findOne({
      where: { id },
    });

    return entity ? ReviewFeedbackMapper.toDomain(entity) : null;
  }

  async update(
    id: ReviewFeedback['id'],
    payload: Partial<ReviewFeedback>,
  ): Promise<ReviewFeedback | null> {
    const entity = await this.reviewFeedbackRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.reviewFeedbackRepository.save(
      this.reviewFeedbackRepository.create(
        ReviewFeedbackMapper.toPersistence({
          ...ReviewFeedbackMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ReviewFeedbackMapper.toDomain(updatedEntity);
  }

  async remove(id: ReviewFeedback['id']): Promise<void> {
    await this.reviewFeedbackRepository.delete(id);
  }
}
