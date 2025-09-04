import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateVerseDto } from './dto/create-verse.dto';
import { UpdateVerseDto } from './dto/update-verse.dto';
import { VerseAbstractRepository } from './infrastructure/persistence/verse.abstract.repository';
import { Verse } from './domain/verse';

@Injectable()
export class VersesService {
  constructor(private readonly verseRepository: VerseAbstractRepository) {}

  create(createVerseDto: CreateVerseDto) {
    return this.verseRepository.create(createVerseDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.verseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Verse['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Verse['id'], updateVerseDto: UpdateVerseDto) {
    const verse = this.verseRepository.update(id, updateVerseDto);
    if (!verse) {
      throw NOT_FOUND('Verse', { id });
    }
    return verse;
  }

  remove(id: Verse['id']) {
    return this.verseRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.verseRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on verse repository.`,
        field,
      );
    }

    const verse = await this.verseRepository[repoFunction](value);
    if (!verse) {
      throw NOT_FOUND('Verse', { [field]: value });
    }
    return verse;
  }
}
