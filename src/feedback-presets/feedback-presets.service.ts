import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateFeedbackPresetDto } from './dto/create-feedback-preset.dto';
import { UpdateFeedbackPresetDto } from './dto/update-feedback-preset.dto';
import { FeedbackPresetAbstractRepository } from './infrastructure/persistence/feedback-preset.abstract.repository';
import { FeedbackPreset } from './domain/feedback-preset';

@Injectable()
export class FeedbackPresetsService {
  constructor(
    private readonly feedbackPresetRepository: FeedbackPresetAbstractRepository,
  ) {}

  create(createFeedbackPresetDto: CreateFeedbackPresetDto) {
    return this.feedbackPresetRepository.create(createFeedbackPresetDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.feedbackPresetRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: FeedbackPreset['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: FeedbackPreset['id'],
    updateFeedbackPresetDto: UpdateFeedbackPresetDto,
  ) {
    const feedbackPreset = this.feedbackPresetRepository.update(
      id,
      updateFeedbackPresetDto,
    );
    if (!feedbackPreset) {
      throw NOT_FOUND('FeedbackPreset', { id });
    }
    return feedbackPreset;
  }

  remove(id: FeedbackPreset['id']) {
    return this.feedbackPresetRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.feedbackPresetRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on feedbackPreset repository.`,
        field,
      );
    }

    const feedbackPreset =
      await this.feedbackPresetRepository[repoFunction](value);
    if (!feedbackPreset) {
      throw NOT_FOUND('FeedbackPreset', { [field]: value });
    }
    return feedbackPreset;
  }
}
