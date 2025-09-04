import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewAbstractRepository } from './infrastructure/persistence/review.abstract.repository';
import { Review } from './domain/review';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewAbstractRepository) {}

  create(createReviewDto: CreateReviewDto) {
    return this.reviewRepository.create(createReviewDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reviewRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Review['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Review['id'], updateReviewDto: UpdateReviewDto) {
    const review = this.reviewRepository.update(id, updateReviewDto);
    if (!review) {
      throw NOT_FOUND('Review', { id });
    }
    return review;
  }

  remove(id: Review['id']) {
    return this.reviewRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.reviewRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on review repository.`,
        field,
      );
    }

    const review = await this.reviewRepository[repoFunction](value);
    if (!review) {
      throw NOT_FOUND('Review', { [field]: value });
    }
    return review;
  }
}
