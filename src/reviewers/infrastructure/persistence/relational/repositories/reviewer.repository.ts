import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Reviewer } from '@src/reviewers/domain/reviewer';
import { ReviewerAbstractRepository } from '@src/reviewers/infrastructure/persistence/reviewer.abstract.repository';
import { ReviewerMapper } from '@src/reviewers/infrastructure/persistence/relational/mappers/reviewer.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ReviewerEntity } from '@src/reviewers/infrastructure/persistence/relational/entities/reviewer.entity';

@Injectable()
export class ReviewerRelationalRepository
  implements ReviewerAbstractRepository
{
  constructor(
    @InjectRepository(ReviewerEntity)
    private readonly reviewerRepository: Repository<ReviewerEntity>,
  ) {}

  async create(data: Reviewer): Promise<Reviewer> {
    const persistenceModel = ReviewerMapper.toPersistence(data);
    const newEntity = await this.reviewerRepository.save(
      this.reviewerRepository.create(persistenceModel),
    );
    return ReviewerMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reviewer[]> {
    const entities = await this.reviewerRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ReviewerMapper.toDomain(entity));
  }

  async findById(id: Reviewer['id']): Promise<NullableType<Reviewer>> {
    const entity = await this.reviewerRepository.findOne({
      where: { id },
    });

    return entity ? ReviewerMapper.toDomain(entity) : null;
  }

  async update(
    id: Reviewer['id'],
    payload: Partial<Reviewer>,
  ): Promise<Reviewer | null> {
    const entity = await this.reviewerRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.reviewerRepository.save(
      this.reviewerRepository.create(
        ReviewerMapper.toPersistence({
          ...ReviewerMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ReviewerMapper.toDomain(updatedEntity);
  }

  async remove(id: Reviewer['id']): Promise<void> {
    await this.reviewerRepository.delete(id);
  }
}
