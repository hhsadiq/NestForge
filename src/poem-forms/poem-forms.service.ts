import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreatePoemFormDto } from './dto/create-poem-form.dto';
import { UpdatePoemFormDto } from './dto/update-poem-form.dto';
import { PoemFormAbstractRepository } from './infrastructure/persistence/poem-form.abstract.repository';
import { PoemForm } from './domain/poem-form';

@Injectable()
export class PoemFormsService {
  constructor(
    private readonly poemFormRepository: PoemFormAbstractRepository,
  ) {}

  create(createPoemFormDto: CreatePoemFormDto) {
    return this.poemFormRepository.create(createPoemFormDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.poemFormRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: PoemForm['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: PoemForm['id'], updatePoemFormDto: UpdatePoemFormDto) {
    const poemForm = this.poemFormRepository.update(id, updatePoemFormDto);
    if (!poemForm) {
      throw NOT_FOUND('PoemForm', { id });
    }
    return poemForm;
  }

  remove(id: PoemForm['id']) {
    return this.poemFormRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.poemFormRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on poemForm repository.`,
        field,
      );
    }

    const poemForm = await this.poemFormRepository[repoFunction](value);
    if (!poemForm) {
      throw NOT_FOUND('PoemForm', { [field]: value });
    }
    return poemForm;
  }
}
