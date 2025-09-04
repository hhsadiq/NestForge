import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { PoemTag } from '@src/poem-tags/domain/poem-tag';
import { PoemTagAbstractRepository } from '@src/poem-tags/infrastructure/persistence/poem-tag.abstract.repository';
import { PoemTagMapper } from '@src/poem-tags/infrastructure/persistence/relational/mappers/poem-tag.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemTagEntity } from '@src/poem-tags/infrastructure/persistence/relational/entities/poem-tag.entity';

@Injectable()
export class PoemTagRelationalRepository implements PoemTagAbstractRepository {
  constructor(
    @InjectRepository(PoemTagEntity)
    private readonly poemTagRepository: Repository<PoemTagEntity>,
  ) {}

  async create(data: PoemTag): Promise<PoemTag> {
    const persistenceModel = PoemTagMapper.toPersistence(data);
    const newEntity = await this.poemTagRepository.save(
      this.poemTagRepository.create(persistenceModel),
    );
    return PoemTagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemTag[]> {
    const entities = await this.poemTagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PoemTagMapper.toDomain(entity));
  }

  async findById(id: PoemTag['id']): Promise<NullableType<PoemTag>> {
    const entity = await this.poemTagRepository.findOne({
      where: { id },
    });

    return entity ? PoemTagMapper.toDomain(entity) : null;
  }

  async update(
    id: PoemTag['id'],
    payload: Partial<PoemTag>,
  ): Promise<PoemTag | null> {
    const entity = await this.poemTagRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.poemTagRepository.save(
      this.poemTagRepository.create(
        PoemTagMapper.toPersistence({
          ...PoemTagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PoemTagMapper.toDomain(updatedEntity);
  }

  async remove(id: PoemTag['id']): Promise<void> {
    await this.poemTagRepository.delete(id);
  }
}
