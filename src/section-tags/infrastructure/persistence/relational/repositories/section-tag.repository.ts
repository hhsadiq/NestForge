import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { SectionTag } from '@src/section-tags/domain/section-tag';
import { SectionTagAbstractRepository } from '@src/section-tags/infrastructure/persistence/section-tag.abstract.repository';
import { SectionTagMapper } from '@src/section-tags/infrastructure/persistence/relational/mappers/section-tag.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { SectionTagEntity } from '@src/section-tags/infrastructure/persistence/relational/entities/section-tag.entity';

@Injectable()
export class SectionTagRelationalRepository
  implements SectionTagAbstractRepository
{
  constructor(
    @InjectRepository(SectionTagEntity)
    private readonly sectionTagRepository: Repository<SectionTagEntity>,
  ) {}

  async create(data: SectionTag): Promise<SectionTag> {
    const persistenceModel = SectionTagMapper.toPersistence(data);
    const newEntity = await this.sectionTagRepository.save(
      this.sectionTagRepository.create(persistenceModel),
    );
    return SectionTagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SectionTag[]> {
    const entities = await this.sectionTagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SectionTagMapper.toDomain(entity));
  }

  async findById(id: SectionTag['id']): Promise<NullableType<SectionTag>> {
    const entity = await this.sectionTagRepository.findOne({
      where: { id },
    });

    return entity ? SectionTagMapper.toDomain(entity) : null;
  }

  async update(
    id: SectionTag['id'],
    payload: Partial<SectionTag>,
  ): Promise<SectionTag | null> {
    const entity = await this.sectionTagRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.sectionTagRepository.save(
      this.sectionTagRepository.create(
        SectionTagMapper.toPersistence({
          ...SectionTagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SectionTagMapper.toDomain(updatedEntity);
  }

  async remove(id: SectionTag['id']): Promise<void> {
    await this.sectionTagRepository.delete(id);
  }
}
