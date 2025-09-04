import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateVerseAuthorDto } from './dto/create-verse-author.dto';
import { UpdateVerseAuthorDto } from './dto/update-verse-author.dto';
import { VerseAuthorAbstractRepository } from './infrastructure/persistence/verse-author.abstract.repository';
import { VerseAuthor } from './domain/verse-author';

@Injectable()
export class VerseAuthorsService {
  constructor(
    private readonly verseAuthorRepository: VerseAuthorAbstractRepository,
  ) {}

  create(createVerseAuthorDto: CreateVerseAuthorDto) {
    return this.verseAuthorRepository.create(createVerseAuthorDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.verseAuthorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: VerseAuthor['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: VerseAuthor['id'], updateVerseAuthorDto: UpdateVerseAuthorDto) {
    const verseAuthor = this.verseAuthorRepository.update(
      id,
      updateVerseAuthorDto,
    );
    if (!verseAuthor) {
      throw NOT_FOUND('VerseAuthor', { id });
    }
    return verseAuthor;
  }

  remove(id: VerseAuthor['id']) {
    return this.verseAuthorRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.verseAuthorRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on verseAuthor repository.`,
        field,
      );
    }

    const verseAuthor = await this.verseAuthorRepository[repoFunction](value);
    if (!verseAuthor) {
      throw NOT_FOUND('VerseAuthor', { [field]: value });
    }
    return verseAuthor;
  }
}
