import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { PoemAbstractRepository } from './infrastructure/persistence/poem.abstract.repository';
import { Poem } from './domain/poem';

@Injectable()
export class PoemsService {
  constructor(private readonly poemRepository: PoemAbstractRepository) {}

  create(createPoemDto: CreatePoemDto) {
    return this.poemRepository.create(createPoemDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.poemRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Poem['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Poem['id'], updatePoemDto: UpdatePoemDto) {
    const poem = this.poemRepository.update(id, updatePoemDto);
    if (!poem) {
      throw NOT_FOUND('Poem', { id });
    }
    return poem;
  }

  remove(id: Poem['id']) {
    return this.poemRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.poemRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on poem repository.`,
        field,
      );
    }

    const poem = await this.poemRepository[repoFunction](value);
    if (!poem) {
      throw NOT_FOUND('Poem', { [field]: value });
    }
    return poem;
  }
}
