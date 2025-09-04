import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageAbstractRepository } from './infrastructure/persistence/language.abstract.repository';
import { Language } from './domain/language';

@Injectable()
export class LanguagesService {
  constructor(
    private readonly languageRepository: LanguageAbstractRepository,
  ) {}

  create(createLanguageDto: CreateLanguageDto) {
    return this.languageRepository.create(createLanguageDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.languageRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Language['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Language['id'], updateLanguageDto: UpdateLanguageDto) {
    const language = this.languageRepository.update(id, updateLanguageDto);
    if (!language) {
      throw NOT_FOUND('Language', { id });
    }
    return language;
  }

  remove(id: Language['id']) {
    return this.languageRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.languageRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on language repository.`,
        field,
      );
    }

    const language = await this.languageRepository[repoFunction](value);
    if (!language) {
      throw NOT_FOUND('Language', { [field]: value });
    }
    return language;
  }
}
