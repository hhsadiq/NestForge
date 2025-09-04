import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { BookAuthor } from '@src/book-authors/domain/book-author';
import { BookAuthorAbstractRepository } from '@src/book-authors/infrastructure/persistence/book-author.abstract.repository';
import { BookAuthorMapper } from '@src/book-authors/infrastructure/persistence/relational/mappers/book-author.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { BookAuthorEntity } from '@src/book-authors/infrastructure/persistence/relational/entities/book-author.entity';

@Injectable()
export class BookAuthorRelationalRepository
  implements BookAuthorAbstractRepository
{
  constructor(
    @InjectRepository(BookAuthorEntity)
    private readonly bookAuthorRepository: Repository<BookAuthorEntity>,
  ) {}

  async create(data: BookAuthor): Promise<BookAuthor> {
    const persistenceModel = BookAuthorMapper.toPersistence(data);
    const newEntity = await this.bookAuthorRepository.save(
      this.bookAuthorRepository.create(persistenceModel),
    );
    return BookAuthorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<BookAuthor[]> {
    const entities = await this.bookAuthorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => BookAuthorMapper.toDomain(entity));
  }

  async findById(id: BookAuthor['id']): Promise<NullableType<BookAuthor>> {
    const entity = await this.bookAuthorRepository.findOne({
      where: { id },
    });

    return entity ? BookAuthorMapper.toDomain(entity) : null;
  }

  async update(
    id: BookAuthor['id'],
    payload: Partial<BookAuthor>,
  ): Promise<BookAuthor | null> {
    const entity = await this.bookAuthorRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.bookAuthorRepository.save(
      this.bookAuthorRepository.create(
        BookAuthorMapper.toPersistence({
          ...BookAuthorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return BookAuthorMapper.toDomain(updatedEntity);
  }

  async remove(id: BookAuthor['id']): Promise<void> {
    await this.bookAuthorRepository.delete(id);
  }
}
