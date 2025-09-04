import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorAbstractRepository } from './infrastructure/persistence/author.abstract.repository';
import { Author } from './domain/author';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorRepository: AuthorAbstractRepository) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorRepository.create(createAuthorDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.authorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Author['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Author['id'], updateAuthorDto: UpdateAuthorDto) {
    const author = this.authorRepository.update(id, updateAuthorDto);
    if (!author) {
      throw NOT_FOUND('Author', { id });
    }
    return author;
  }

  remove(id: Author['id']) {
    return this.authorRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.authorRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on author repository.`,
        field,
      );
    }

    const author = await this.authorRepository[repoFunction](value);
    if (!author) {
      throw NOT_FOUND('Author', { [field]: value });
    }
    return author;
  }
}
