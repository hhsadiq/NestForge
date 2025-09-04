import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Language } from '@src/languages/domain/language';
import { LanguageAbstractRepository } from '@src/languages/infrastructure/persistence/language.abstract.repository';
import { LanguageMapper } from '@src/languages/infrastructure/persistence/relational/mappers/language.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { LanguageEntity } from '@src/languages/infrastructure/persistence/relational/entities/language.entity';

@Injectable()
export class LanguageRelationalRepository
  implements LanguageAbstractRepository
{
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(data: Language): Promise<Language> {
    const persistenceModel = LanguageMapper.toPersistence(data);
    const newEntity = await this.languageRepository.save(
      this.languageRepository.create(persistenceModel),
    );
    return LanguageMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Language[]> {
    const entities = await this.languageRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => LanguageMapper.toDomain(entity));
  }

  async findById(id: Language['id']): Promise<NullableType<Language>> {
    const entity = await this.languageRepository.findOne({
      where: { id },
    });

    return entity ? LanguageMapper.toDomain(entity) : null;
  }

  async update(
    id: Language['id'],
    payload: Partial<Language>,
  ): Promise<Language | null> {
    const entity = await this.languageRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.languageRepository.save(
      this.languageRepository.create(
        LanguageMapper.toPersistence({
          ...LanguageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LanguageMapper.toDomain(updatedEntity);
  }

  async remove(id: Language['id']): Promise<void> {
    await this.languageRepository.delete(id);
  }
}
