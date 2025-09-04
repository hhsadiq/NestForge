import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateTranslatorDto } from './dto/create-translator.dto';
import { UpdateTranslatorDto } from './dto/update-translator.dto';
import { TranslatorAbstractRepository } from './infrastructure/persistence/translator.abstract.repository';
import { Translator } from './domain/translator';

@Injectable()
export class TranslatorsService {
  constructor(
    private readonly translatorRepository: TranslatorAbstractRepository,
  ) {}

  create(createTranslatorDto: CreateTranslatorDto) {
    return this.translatorRepository.create(createTranslatorDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.translatorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Translator['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Translator['id'], updateTranslatorDto: UpdateTranslatorDto) {
    const translator = this.translatorRepository.update(
      id,
      updateTranslatorDto,
    );
    if (!translator) {
      throw NOT_FOUND('Translator', { id });
    }
    return translator;
  }

  remove(id: Translator['id']) {
    return this.translatorRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.translatorRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on translator repository.`,
        field,
      );
    }

    const translator = await this.translatorRepository[repoFunction](value);
    if (!translator) {
      throw NOT_FOUND('Translator', { [field]: value });
    }
    return translator;
  }
}
