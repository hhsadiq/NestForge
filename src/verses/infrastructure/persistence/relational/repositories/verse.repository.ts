import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Verse } from '@src/verses/domain/verse';
import { VerseAbstractRepository } from '@src/verses/infrastructure/persistence/verse.abstract.repository';
import { VerseMapper } from '@src/verses/infrastructure/persistence/relational/mappers/verse.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { VerseEntity } from '@src/verses/infrastructure/persistence/relational/entities/verse.entity';

@Injectable()
export class VerseRelationalRepository implements VerseAbstractRepository {
  constructor(
    @InjectRepository(VerseEntity)
    private readonly verseRepository: Repository<VerseEntity>,
  ) {}

  async create(data: Verse): Promise<Verse> {
    const persistenceModel = VerseMapper.toPersistence(data);
    const newEntity = await this.verseRepository.save(
      this.verseRepository.create(persistenceModel),
    );
    return VerseMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Verse[]> {
    const entities = await this.verseRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => VerseMapper.toDomain(entity));
  }

  async findById(id: Verse['id']): Promise<NullableType<Verse>> {
    const entity = await this.verseRepository.findOne({
      where: { id },
    });

    return entity ? VerseMapper.toDomain(entity) : null;
  }

  async update(
    id: Verse['id'],
    payload: Partial<Verse>,
  ): Promise<Verse | null> {
    const entity = await this.verseRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.verseRepository.save(
      this.verseRepository.create(
        VerseMapper.toPersistence({
          ...VerseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VerseMapper.toDomain(updatedEntity);
  }

  async remove(id: Verse['id']): Promise<void> {
    await this.verseRepository.delete(id);
  }
}
