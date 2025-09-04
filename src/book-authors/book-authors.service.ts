import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { BookAuthorAbstractRepository } from './infrastructure/persistence/book-author.abstract.repository';
import { BookAuthor } from './domain/book-author';

@Injectable()
export class BookAuthorsService {
  constructor(
    private readonly bookAuthorRepository: BookAuthorAbstractRepository,
  ) {}

  create(createBookAuthorDto: CreateBookAuthorDto) {
    return this.bookAuthorRepository.create(createBookAuthorDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.bookAuthorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: BookAuthor['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: BookAuthor['id'], updateBookAuthorDto: UpdateBookAuthorDto) {
    const bookAuthor = this.bookAuthorRepository.update(
      id,
      updateBookAuthorDto,
    );
    if (!bookAuthor) {
      throw NOT_FOUND('BookAuthor', { id });
    }
    return bookAuthor;
  }

  remove(id: BookAuthor['id']) {
    return this.bookAuthorRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.bookAuthorRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on bookAuthor repository.`,
        field,
      );
    }

    const bookAuthor = await this.bookAuthorRepository[repoFunction](value);
    if (!bookAuthor) {
      throw NOT_FOUND('BookAuthor', { [field]: value });
    }
    return bookAuthor;
  }
}
