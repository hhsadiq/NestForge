import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateParagraphDto } from './dto/create-paragraph.dto';
import { UpdateParagraphDto } from './dto/update-paragraph.dto';
import { ParagraphAbstractRepository } from './infrastructure/persistence/paragraph.abstract.repository';
import { Paragraph } from './domain/paragraph';

@Injectable()
export class ParagraphsService {
  constructor(
    private readonly paragraphRepository: ParagraphAbstractRepository,
  ) {}

  create(createParagraphDto: CreateParagraphDto) {
    return this.paragraphRepository.create(createParagraphDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paragraphRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Paragraph['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Paragraph['id'], updateParagraphDto: UpdateParagraphDto) {
    const paragraph = this.paragraphRepository.update(id, updateParagraphDto);
    if (!paragraph) {
      throw NOT_FOUND('Paragraph', { id });
    }
    return paragraph;
  }

  remove(id: Paragraph['id']) {
    return this.paragraphRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.paragraphRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on paragraph repository.`,
        field,
      );
    }

    const paragraph = await this.paragraphRepository[repoFunction](value);
    if (!paragraph) {
      throw NOT_FOUND('Paragraph', { [field]: value });
    }
    return paragraph;
  }
}
