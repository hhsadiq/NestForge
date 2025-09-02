import { Injectable } from '@nestjs/common';

import { NullableType } from '@src/utils/types/nullable.type';

import { Tag } from './domain/tag';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagAbstractRepository } from './infrastructure/persistence/tag.abstract.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagAbstractRepository) {}

  createMany(createTagDto: CreateTagDto[]) {
    return this.tagRepository.createMany(createTagDto);
  }

  toCreateTagDtos(tagNames: string[]): CreateTagDto[] {
    return tagNames.map((tagName) => ({ name: tagName }) as CreateTagDto);
  }

  async findAll() {
    const tags = await this.tagRepository.findAll();

    return tags?.map((tag) => tag.name) || [];
  }

  async findByNames(names: Tag['name'][]): Promise<NullableType<Tag[]>> {
    return await this.tagRepository.findByNames(names);
  }
}
