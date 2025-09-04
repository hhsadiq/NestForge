import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { FeedbackPreset } from '@src/feedback-presets/domain/feedback-preset';
import { FeedbackPresetAbstractRepository } from '@src/feedback-presets/infrastructure/persistence/feedback-preset.abstract.repository';
import { FeedbackPresetMapper } from '@src/feedback-presets/infrastructure/persistence/relational/mappers/feedback-preset.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { FeedbackPresetEntity } from '@src/feedback-presets/infrastructure/persistence/relational/entities/feedback-preset.entity';

@Injectable()
export class FeedbackPresetRelationalRepository
  implements FeedbackPresetAbstractRepository
{
  constructor(
    @InjectRepository(FeedbackPresetEntity)
    private readonly feedbackPresetRepository: Repository<FeedbackPresetEntity>,
  ) {}

  async create(data: FeedbackPreset): Promise<FeedbackPreset> {
    const persistenceModel = FeedbackPresetMapper.toPersistence(data);
    const newEntity = await this.feedbackPresetRepository.save(
      this.feedbackPresetRepository.create(persistenceModel),
    );
    return FeedbackPresetMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FeedbackPreset[]> {
    const entities = await this.feedbackPresetRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => FeedbackPresetMapper.toDomain(entity));
  }

  async findById(
    id: FeedbackPreset['id'],
  ): Promise<NullableType<FeedbackPreset>> {
    const entity = await this.feedbackPresetRepository.findOne({
      where: { id },
    });

    return entity ? FeedbackPresetMapper.toDomain(entity) : null;
  }

  async update(
    id: FeedbackPreset['id'],
    payload: Partial<FeedbackPreset>,
  ): Promise<FeedbackPreset | null> {
    const entity = await this.feedbackPresetRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.feedbackPresetRepository.save(
      this.feedbackPresetRepository.create(
        FeedbackPresetMapper.toPersistence({
          ...FeedbackPresetMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return FeedbackPresetMapper.toDomain(updatedEntity);
  }

  async remove(id: FeedbackPreset['id']): Promise<void> {
    await this.feedbackPresetRepository.delete(id);
  }
}
