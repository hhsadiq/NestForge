import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreatePoemMediaDto } from './dto/create-poem-media.dto';
import { UpdatePoemMediaDto } from './dto/update-poem-media.dto';
import { PoemMediaAbstractRepository } from './infrastructure/persistence/poem-media.abstract.repository';
import { PoemMedia } from './domain/poem-media';

@Injectable()
export class PoemMediaService {
  constructor(
    private readonly poemMediaRepository: PoemMediaAbstractRepository,
  ) {}

  create(createPoemMediaDto: CreatePoemMediaDto) {
    return this.poemMediaRepository.create(createPoemMediaDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.poemMediaRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: PoemMedia['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: PoemMedia['id'], updatePoemMediaDto: UpdatePoemMediaDto) {
    const poemMedia = this.poemMediaRepository.update(id, updatePoemMediaDto);
    if (!poemMedia) {
      throw NOT_FOUND('PoemMedia', { id });
    }
    return poemMedia;
  }

  remove(id: PoemMedia['id']) {
    return this.poemMediaRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.poemMediaRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on poemMedia repository.`,
        field,
      );
    }

    const poemMedia = await this.poemMediaRepository[repoFunction](value);
    if (!poemMedia) {
      throw NOT_FOUND('PoemMedia', { [field]: value });
    }
    return poemMedia;
  }
}
