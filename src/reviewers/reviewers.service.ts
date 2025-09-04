import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateReviewerDto } from './dto/create-reviewer.dto';
import { UpdateReviewerDto } from './dto/update-reviewer.dto';
import { ReviewerAbstractRepository } from './infrastructure/persistence/reviewer.abstract.repository';
import { Reviewer } from './domain/reviewer';

@Injectable()
export class ReviewersService {
  constructor(
    private readonly reviewerRepository: ReviewerAbstractRepository,
  ) {}

  create(createReviewerDto: CreateReviewerDto) {
    return this.reviewerRepository.create(createReviewerDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reviewerRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Reviewer['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Reviewer['id'], updateReviewerDto: UpdateReviewerDto) {
    const reviewer = this.reviewerRepository.update(id, updateReviewerDto);
    if (!reviewer) {
      throw NOT_FOUND('Reviewer', { id });
    }
    return reviewer;
  }

  remove(id: Reviewer['id']) {
    return this.reviewerRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.reviewerRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on reviewer repository.`,
        field,
      );
    }

    const reviewer = await this.reviewerRepository[repoFunction](value);
    if (!reviewer) {
      throw NOT_FOUND('Reviewer', { [field]: value });
    }
    return reviewer;
  }
}
