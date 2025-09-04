import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Book } from '@src/books/domain/book';
import { BookAbstractRepository } from '@src/books/infrastructure/persistence/book.abstract.repository';
import { BookMapper } from '@src/books/infrastructure/persistence/relational/mappers/book.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { BookEntity } from '@src/books/infrastructure/persistence/relational/entities/book.entity';

@Injectable()
export class BookRelationalRepository implements BookAbstractRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  async create(data: Book): Promise<Book> {
    const persistenceModel = BookMapper.toPersistence(data);
    const newEntity = await this.bookRepository.save(
      this.bookRepository.create(persistenceModel),
    );
    return BookMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Book[]> {
    const entities = await this.bookRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => BookMapper.toDomain(entity));
  }

  async findById(id: Book['id']): Promise<NullableType<Book>> {
    const entity = await this.bookRepository.findOne({
      where: { id },
    });

    return entity ? BookMapper.toDomain(entity) : null;
  }

  async update(id: Book['id'], payload: Partial<Book>): Promise<Book | null> {
    const entity = await this.bookRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.bookRepository.save(
      this.bookRepository.create(
        BookMapper.toPersistence({
          ...BookMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return BookMapper.toDomain(updatedEntity);
  }

  async remove(id: Book['id']): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
