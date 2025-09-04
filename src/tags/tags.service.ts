import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagAbstractRepository } from './infrastructure/persistence/tag.abstract.repository';
import { Tag } from './domain/tag';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagAbstractRepository) {}

  create(createTagDto: CreateTagDto) {
    return this.tagRepository.create(createTagDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.tagRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Tag['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Tag['id'], updateTagDto: UpdateTagDto) {
    const tag = this.tagRepository.update(id, updateTagDto);
    if (!tag) {
      throw NOT_FOUND('Tag', { id });
    }
    return tag;
  }

  remove(id: Tag['id']) {
    return this.tagRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.tagRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on tag repository.`,
        field,
      );
    }

    const tag = await this.tagRepository[repoFunction](value);
    if (!tag) {
      throw NOT_FOUND('Tag', { [field]: value });
    }
    return tag;
  }
}
