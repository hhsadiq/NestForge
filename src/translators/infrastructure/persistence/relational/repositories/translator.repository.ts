import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Translator } from '@src/translators/domain/translator';
import { TranslatorAbstractRepository } from '@src/translators/infrastructure/persistence/translator.abstract.repository';
import { TranslatorMapper } from '@src/translators/infrastructure/persistence/relational/mappers/translator.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { TranslatorEntity } from '@src/translators/infrastructure/persistence/relational/entities/translator.entity';

@Injectable()
export class TranslatorRelationalRepository
  implements TranslatorAbstractRepository
{
  constructor(
    @InjectRepository(TranslatorEntity)
    private readonly translatorRepository: Repository<TranslatorEntity>,
  ) {}

  async create(data: Translator): Promise<Translator> {
    const persistenceModel = TranslatorMapper.toPersistence(data);
    const newEntity = await this.translatorRepository.save(
      this.translatorRepository.create(persistenceModel),
    );
    return TranslatorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Translator[]> {
    const entities = await this.translatorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TranslatorMapper.toDomain(entity));
  }

  async findById(id: Translator['id']): Promise<NullableType<Translator>> {
    const entity = await this.translatorRepository.findOne({
      where: { id },
    });

    return entity ? TranslatorMapper.toDomain(entity) : null;
  }

  async update(
    id: Translator['id'],
    payload: Partial<Translator>,
  ): Promise<Translator | null> {
    const entity = await this.translatorRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.translatorRepository.save(
      this.translatorRepository.create(
        TranslatorMapper.toPersistence({
          ...TranslatorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TranslatorMapper.toDomain(updatedEntity);
  }

  async remove(id: Translator['id']): Promise<void> {
    await this.translatorRepository.delete(id);
  }
}
