import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookAbstractRepository } from './infrastructure/persistence/book.abstract.repository';
import { Book } from './domain/book';

@Injectable()
export class BooksService {
  constructor(private readonly bookRepository: BookAbstractRepository) {}

  create(createBookDto: CreateBookDto) {
    return this.bookRepository.create(createBookDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.bookRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Book['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Book['id'], updateBookDto: UpdateBookDto) {
    const book = this.bookRepository.update(id, updateBookDto);
    if (!book) {
      throw NOT_FOUND('Book', { id });
    }
    return book;
  }

  remove(id: Book['id']) {
    return this.bookRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.bookRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on book repository.`,
        field,
      );
    }

    const book = await this.bookRepository[repoFunction](value);
    if (!book) {
      throw NOT_FOUND('Book', { [field]: value });
    }
    return book;
  }
}
