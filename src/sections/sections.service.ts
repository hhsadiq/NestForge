import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionAbstractRepository } from './infrastructure/persistence/section.abstract.repository';
import { Section } from './domain/section';

@Injectable()
export class SectionsService {
  constructor(private readonly sectionRepository: SectionAbstractRepository) {}

  create(createSectionDto: CreateSectionDto) {
    return this.sectionRepository.create(createSectionDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.sectionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Section['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Section['id'], updateSectionDto: UpdateSectionDto) {
    const section = this.sectionRepository.update(id, updateSectionDto);
    if (!section) {
      throw NOT_FOUND('Section', { id });
    }
    return section;
  }

  remove(id: Section['id']) {
    return this.sectionRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.sectionRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on section repository.`,
        field,
      );
    }

    const section = await this.sectionRepository[repoFunction](value);
    if (!section) {
      throw NOT_FOUND('Section', { [field]: value });
    }
    return section;
  }
}
