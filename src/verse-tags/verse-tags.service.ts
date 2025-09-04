import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateVerseTagDto } from './dto/create-verse-tag.dto';
import { UpdateVerseTagDto } from './dto/update-verse-tag.dto';
import { VerseTagAbstractRepository } from './infrastructure/persistence/verse-tag.abstract.repository';
import { VerseTag } from './domain/verse-tag';

@Injectable()
export class VerseTagsService {
  constructor(
    private readonly verseTagRepository: VerseTagAbstractRepository,
  ) {}

  create(createVerseTagDto: CreateVerseTagDto) {
    return this.verseTagRepository.create(createVerseTagDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.verseTagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: VerseTag['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: VerseTag['id'], updateVerseTagDto: UpdateVerseTagDto) {
    const verseTag = this.verseTagRepository.update(id, updateVerseTagDto);
    if (!verseTag) {
      throw NOT_FOUND('VerseTag', { id });
    }
    return verseTag;
  }

  remove(id: VerseTag['id']) {
    return this.verseTagRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.verseTagRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on verseTag repository.`,
        field,
      );
    }

    const verseTag = await this.verseTagRepository[repoFunction](value);
    if (!verseTag) {
      throw NOT_FOUND('VerseTag', { [field]: value });
    }
    return verseTag;
  }
}
