import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Review } from '@src/reviews/domain/review';
import { ReviewAbstractRepository } from '@src/reviews/infrastructure/persistence/review.abstract.repository';
import { ReviewMapper } from '@src/reviews/infrastructure/persistence/relational/mappers/review.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ReviewEntity } from '@src/reviews/infrastructure/persistence/relational/entities/review.entity';

@Injectable()
export class ReviewRelationalRepository implements ReviewAbstractRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(data: Review): Promise<Review> {
    const persistenceModel = ReviewMapper.toPersistence(data);
    const newEntity = await this.reviewRepository.save(
      this.reviewRepository.create(persistenceModel),
    );
    return ReviewMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ReviewMapper.toDomain(entity));
  }

  async findById(id: Review['id']): Promise<NullableType<Review>> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    });

    return entity ? ReviewMapper.toDomain(entity) : null;
  }

  async update(
    id: Review['id'],
    payload: Partial<Review>,
  ): Promise<Review | null> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.reviewRepository.save(
      this.reviewRepository.create(
        ReviewMapper.toPersistence({
          ...ReviewMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ReviewMapper.toDomain(updatedEntity);
  }

  async remove(id: Review['id']): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
