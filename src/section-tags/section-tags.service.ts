import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateSectionTagDto } from './dto/create-section-tag.dto';
import { UpdateSectionTagDto } from './dto/update-section-tag.dto';
import { SectionTagAbstractRepository } from './infrastructure/persistence/section-tag.abstract.repository';
import { SectionTag } from './domain/section-tag';

@Injectable()
export class SectionTagsService {
  constructor(
    private readonly sectionTagRepository: SectionTagAbstractRepository,
  ) {}

  create(createSectionTagDto: CreateSectionTagDto) {
    return this.sectionTagRepository.create(createSectionTagDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.sectionTagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: SectionTag['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: SectionTag['id'], updateSectionTagDto: UpdateSectionTagDto) {
    const sectionTag = this.sectionTagRepository.update(
      id,
      updateSectionTagDto,
    );
    if (!sectionTag) {
      throw NOT_FOUND('SectionTag', { id });
    }
    return sectionTag;
  }

  remove(id: SectionTag['id']) {
    return this.sectionTagRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.sectionTagRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on sectionTag repository.`,
        field,
      );
    }

    const sectionTag = await this.sectionTagRepository[repoFunction](value);
    if (!sectionTag) {
      throw NOT_FOUND('SectionTag', { [field]: value });
    }
    return sectionTag;
  }
}
