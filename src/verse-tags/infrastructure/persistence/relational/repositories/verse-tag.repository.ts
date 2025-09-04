import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { VerseTag } from '@src/verse-tags/domain/verse-tag';
import { VerseTagAbstractRepository } from '@src/verse-tags/infrastructure/persistence/verse-tag.abstract.repository';
import { VerseTagMapper } from '@src/verse-tags/infrastructure/persistence/relational/mappers/verse-tag.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { VerseTagEntity } from '@src/verse-tags/infrastructure/persistence/relational/entities/verse-tag.entity';

@Injectable()
export class VerseTagRelationalRepository
  implements VerseTagAbstractRepository
{
  constructor(
    @InjectRepository(VerseTagEntity)
    private readonly verseTagRepository: Repository<VerseTagEntity>,
  ) {}

  async create(data: VerseTag): Promise<VerseTag> {
    const persistenceModel = VerseTagMapper.toPersistence(data);
    const newEntity = await this.verseTagRepository.save(
      this.verseTagRepository.create(persistenceModel),
    );
    return VerseTagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VerseTag[]> {
    const entities = await this.verseTagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => VerseTagMapper.toDomain(entity));
  }

  async findById(id: VerseTag['id']): Promise<NullableType<VerseTag>> {
    const entity = await this.verseTagRepository.findOne({
      where: { id },
    });

    return entity ? VerseTagMapper.toDomain(entity) : null;
  }

  async update(
    id: VerseTag['id'],
    payload: Partial<VerseTag>,
  ): Promise<VerseTag | null> {
    const entity = await this.verseTagRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.verseTagRepository.save(
      this.verseTagRepository.create(
        VerseTagMapper.toPersistence({
          ...VerseTagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VerseTagMapper.toDomain(updatedEntity);
  }

  async remove(id: VerseTag['id']): Promise<void> {
    await this.verseTagRepository.delete(id);
  }
}
