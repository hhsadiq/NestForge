import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Section } from '@src/sections/domain/section';
import { SectionAbstractRepository } from '@src/sections/infrastructure/persistence/section.abstract.repository';
import { SectionMapper } from '@src/sections/infrastructure/persistence/relational/mappers/section.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { SectionEntity } from '@src/sections/infrastructure/persistence/relational/entities/section.entity';

@Injectable()
export class SectionRelationalRepository implements SectionAbstractRepository {
  constructor(
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
  ) {}

  async create(data: Section): Promise<Section> {
    const persistenceModel = SectionMapper.toPersistence(data);
    const newEntity = await this.sectionRepository.save(
      this.sectionRepository.create(persistenceModel),
    );
    return SectionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Section[]> {
    const entities = await this.sectionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => SectionMapper.toDomain(entity));
  }

  async findById(id: Section['id']): Promise<NullableType<Section>> {
    const entity = await this.sectionRepository.findOne({
      where: { id },
    });

    return entity ? SectionMapper.toDomain(entity) : null;
  }

  async update(
    id: Section['id'],
    payload: Partial<Section>,
  ): Promise<Section | null> {
    const entity = await this.sectionRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.sectionRepository.save(
      this.sectionRepository.create(
        SectionMapper.toPersistence({
          ...SectionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SectionMapper.toDomain(updatedEntity);
  }

  async remove(id: Section['id']): Promise<void> {
    await this.sectionRepository.delete(id);
  }
}
