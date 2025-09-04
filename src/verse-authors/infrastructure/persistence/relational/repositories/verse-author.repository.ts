import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { VerseAuthor } from '@src/verse-authors/domain/verse-author';
import { VerseAuthorAbstractRepository } from '@src/verse-authors/infrastructure/persistence/verse-author.abstract.repository';
import { VerseAuthorMapper } from '@src/verse-authors/infrastructure/persistence/relational/mappers/verse-author.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { VerseAuthorEntity } from '@src/verse-authors/infrastructure/persistence/relational/entities/verse-author.entity';

@Injectable()
export class VerseAuthorRelationalRepository
  implements VerseAuthorAbstractRepository
{
  constructor(
    @InjectRepository(VerseAuthorEntity)
    private readonly verseAuthorRepository: Repository<VerseAuthorEntity>,
  ) {}

  async create(data: VerseAuthor): Promise<VerseAuthor> {
    const persistenceModel = VerseAuthorMapper.toPersistence(data);
    const newEntity = await this.verseAuthorRepository.save(
      this.verseAuthorRepository.create(persistenceModel),
    );
    return VerseAuthorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VerseAuthor[]> {
    const entities = await this.verseAuthorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => VerseAuthorMapper.toDomain(entity));
  }

  async findById(id: VerseAuthor['id']): Promise<NullableType<VerseAuthor>> {
    const entity = await this.verseAuthorRepository.findOne({
      where: { id },
    });

    return entity ? VerseAuthorMapper.toDomain(entity) : null;
  }

  async update(
    id: VerseAuthor['id'],
    payload: Partial<VerseAuthor>,
  ): Promise<VerseAuthor | null> {
    const entity = await this.verseAuthorRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.verseAuthorRepository.save(
      this.verseAuthorRepository.create(
        VerseAuthorMapper.toPersistence({
          ...VerseAuthorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VerseAuthorMapper.toDomain(updatedEntity);
  }

  async remove(id: VerseAuthor['id']): Promise<void> {
    await this.verseAuthorRepository.delete(id);
  }
}
