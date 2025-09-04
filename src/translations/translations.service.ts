import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { TranslationAbstractRepository } from './infrastructure/persistence/translation.abstract.repository';
import { Translation } from './domain/translation';

@Injectable()
export class TranslationsService {
  constructor(
    private readonly translationRepository: TranslationAbstractRepository,
  ) {}

  create(createTranslationDto: CreateTranslationDto) {
    return this.translationRepository.create(createTranslationDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.translationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Translation['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Translation['id'], updateTranslationDto: UpdateTranslationDto) {
    const translation = this.translationRepository.update(
      id,
      updateTranslationDto,
    );
    if (!translation) {
      throw NOT_FOUND('Translation', { id });
    }
    return translation;
  }

  remove(id: Translation['id']) {
    return this.translationRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.translationRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on translation repository.`,
        field,
      );
    }

    const translation = await this.translationRepository[repoFunction](value);
    if (!translation) {
      throw NOT_FOUND('Translation', { [field]: value });
    }
    return translation;
  }
}
