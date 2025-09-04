import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Tag } from '@src/tags/domain/tag';
import { TagAbstractRepository } from '@src/tags/infrastructure/persistence/tag.abstract.repository';
import { TagMapper } from '@src/tags/infrastructure/persistence/relational/mappers/tag.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { TagEntity } from '@src/tags/infrastructure/persistence/relational/entities/tag.entity';

@Injectable()
export class TagRelationalRepository implements TagAbstractRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(data: Tag): Promise<Tag> {
    const persistenceModel = TagMapper.toPersistence(data);
    const newEntity = await this.tagRepository.save(
      this.tagRepository.create(persistenceModel),
    );
    return TagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]> {
    const entities = await this.tagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => TagMapper.toDomain(entity));
  }

  async findById(id: Tag['id']): Promise<NullableType<Tag>> {
    const entity = await this.tagRepository.findOne({
      where: { id },
    });

    return entity ? TagMapper.toDomain(entity) : null;
  }

  async update(id: Tag['id'], payload: Partial<Tag>): Promise<Tag | null> {
    const entity = await this.tagRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.tagRepository.save(
      this.tagRepository.create(
        TagMapper.toPersistence({
          ...TagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TagMapper.toDomain(updatedEntity);
  }

  async remove(id: Tag['id']): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
