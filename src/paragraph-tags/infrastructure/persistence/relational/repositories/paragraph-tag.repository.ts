import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { ParagraphTag } from '@src/paragraph-tags/domain/paragraph-tag';
import { ParagraphTagAbstractRepository } from '@src/paragraph-tags/infrastructure/persistence/paragraph-tag.abstract.repository';
import { ParagraphTagMapper } from '@src/paragraph-tags/infrastructure/persistence/relational/mappers/paragraph-tag.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ParagraphTagEntity } from '@src/paragraph-tags/infrastructure/persistence/relational/entities/paragraph-tag.entity';

@Injectable()
export class ParagraphTagRelationalRepository
  implements ParagraphTagAbstractRepository
{
  constructor(
    @InjectRepository(ParagraphTagEntity)
    private readonly paragraphTagRepository: Repository<ParagraphTagEntity>,
  ) {}

  async create(data: ParagraphTag): Promise<ParagraphTag> {
    const persistenceModel = ParagraphTagMapper.toPersistence(data);
    const newEntity = await this.paragraphTagRepository.save(
      this.paragraphTagRepository.create(persistenceModel),
    );
    return ParagraphTagMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ParagraphTag[]> {
    const entities = await this.paragraphTagRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ParagraphTagMapper.toDomain(entity));
  }

  async findById(id: ParagraphTag['id']): Promise<NullableType<ParagraphTag>> {
    const entity = await this.paragraphTagRepository.findOne({
      where: { id },
    });

    return entity ? ParagraphTagMapper.toDomain(entity) : null;
  }

  async update(
    id: ParagraphTag['id'],
    payload: Partial<ParagraphTag>,
  ): Promise<ParagraphTag | null> {
    const entity = await this.paragraphTagRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.paragraphTagRepository.save(
      this.paragraphTagRepository.create(
        ParagraphTagMapper.toPersistence({
          ...ParagraphTagMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ParagraphTagMapper.toDomain(updatedEntity);
  }

  async remove(id: ParagraphTag['id']): Promise<void> {
    await this.paragraphTagRepository.delete(id);
  }
}
