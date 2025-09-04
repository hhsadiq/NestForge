import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Translation } from '@src/translations/domain/translation';
import { TranslationAbstractRepository } from '@src/translations/infrastructure/persistence/translation.abstract.repository';
import { TranslationMapper } from '@src/translations/infrastructure/persistence/relational/mappers/translation.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { TranslationEntity } from '@src/translations/infrastructure/persistence/relational/entities/translation.entity';

@Injectable()
export class TranslationRelationalRepository
  implements TranslationAbstractRepository
{
  constructor(
    @InjectRepository(TranslationEntity)
    private readonly translationRepository: Repository<TranslationEntity>,
  ) {}

  async create(data: Translation): Promise<Translation> {
    const persistenceModel = TranslationMapper.toPersistence(data);
    const newEntity = await this.translationRepository.save(
      this.translationRepository.create(persistenceModel),
    );
    return TranslationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Translation[]> {
    const entities = await this.translationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TranslationMapper.toDomain(entity));
  }

  async findById(id: Translation['id']): Promise<NullableType<Translation>> {
    const entity = await this.translationRepository.findOne({
      where: { id },
    });

    return entity ? TranslationMapper.toDomain(entity) : null;
  }

  async update(
    id: Translation['id'],
    payload: Partial<Translation>,
  ): Promise<Translation | null> {
    const entity = await this.translationRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.translationRepository.save(
      this.translationRepository.create(
        TranslationMapper.toPersistence({
          ...TranslationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TranslationMapper.toDomain(updatedEntity);
  }

  async remove(id: Translation['id']): Promise<void> {
    await this.translationRepository.delete(id);
  }
}
