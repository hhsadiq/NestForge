import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateReviewFeedbackDto } from './dto/create-review-feedback.dto';
import { UpdateReviewFeedbackDto } from './dto/update-review-feedback.dto';
import { ReviewFeedbackAbstractRepository } from './infrastructure/persistence/review-feedback.abstract.repository';
import { ReviewFeedback } from './domain/review-feedback';

@Injectable()
export class ReviewFeedbacksService {
  constructor(
    private readonly reviewFeedbackRepository: ReviewFeedbackAbstractRepository,
  ) {}

  create(createReviewFeedbackDto: CreateReviewFeedbackDto) {
    return this.reviewFeedbackRepository.create(createReviewFeedbackDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reviewFeedbackRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: ReviewFeedback['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: ReviewFeedback['id'],
    updateReviewFeedbackDto: UpdateReviewFeedbackDto,
  ) {
    const reviewFeedback = this.reviewFeedbackRepository.update(
      id,
      updateReviewFeedbackDto,
    );
    if (!reviewFeedback) {
      throw NOT_FOUND('ReviewFeedback', { id });
    }
    return reviewFeedback;
  }

  remove(id: ReviewFeedback['id']) {
    return this.reviewFeedbackRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.reviewFeedbackRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on reviewFeedback repository.`,
        field,
      );
    }

    const reviewFeedback =
      await this.reviewFeedbackRepository[repoFunction](value);
    if (!reviewFeedback) {
      throw NOT_FOUND('ReviewFeedback', { [field]: value });
    }
    return reviewFeedback;
  }
}
