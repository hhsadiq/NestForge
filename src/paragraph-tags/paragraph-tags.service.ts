import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateParagraphTagDto } from './dto/create-paragraph-tag.dto';
import { UpdateParagraphTagDto } from './dto/update-paragraph-tag.dto';
import { ParagraphTagAbstractRepository } from './infrastructure/persistence/paragraph-tag.abstract.repository';
import { ParagraphTag } from './domain/paragraph-tag';

@Injectable()
export class ParagraphTagsService {
  constructor(
    private readonly paragraphTagRepository: ParagraphTagAbstractRepository,
  ) {}

  create(createParagraphTagDto: CreateParagraphTagDto) {
    return this.paragraphTagRepository.create(createParagraphTagDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paragraphTagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: ParagraphTag['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: ParagraphTag['id'], updateParagraphTagDto: UpdateParagraphTagDto) {
    const paragraphTag = this.paragraphTagRepository.update(
      id,
      updateParagraphTagDto,
    );
    if (!paragraphTag) {
      throw NOT_FOUND('ParagraphTag', { id });
    }
    return paragraphTag;
  }

  remove(id: ParagraphTag['id']) {
    return this.paragraphTagRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.paragraphTagRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on paragraphTag repository.`,
        field,
      );
    }

    const paragraphTag = await this.paragraphTagRepository[repoFunction](value);
    if (!paragraphTag) {
      throw NOT_FOUND('ParagraphTag', { [field]: value });
    }
    return paragraphTag;
  }
}
