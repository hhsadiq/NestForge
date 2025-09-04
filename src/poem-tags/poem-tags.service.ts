import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreatePoemTagDto } from './dto/create-poem-tag.dto';
import { UpdatePoemTagDto } from './dto/update-poem-tag.dto';
import { PoemTagAbstractRepository } from './infrastructure/persistence/poem-tag.abstract.repository';
import { PoemTag } from './domain/poem-tag';

@Injectable()
export class PoemTagsService {
  constructor(private readonly poemTagRepository: PoemTagAbstractRepository) {}

  create(createPoemTagDto: CreatePoemTagDto) {
    return this.poemTagRepository.create(createPoemTagDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.poemTagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: PoemTag['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: PoemTag['id'], updatePoemTagDto: UpdatePoemTagDto) {
    const poemTag = this.poemTagRepository.update(id, updatePoemTagDto);
    if (!poemTag) {
      throw NOT_FOUND('PoemTag', { id });
    }
    return poemTag;
  }

  remove(id: PoemTag['id']) {
    return this.poemTagRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.poemTagRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on poemTag repository.`,
        field,
      );
    }

    const poemTag = await this.poemTagRepository[repoFunction](value);
    if (!poemTag) {
      throw NOT_FOUND('PoemTag', { [field]: value });
    }
    return poemTag;
  }
}
