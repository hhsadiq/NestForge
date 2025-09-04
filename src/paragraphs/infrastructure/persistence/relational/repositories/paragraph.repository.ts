import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Paragraph } from '@src/paragraphs/domain/paragraph';
import { ParagraphAbstractRepository } from '@src/paragraphs/infrastructure/persistence/paragraph.abstract.repository';
import { ParagraphMapper } from '@src/paragraphs/infrastructure/persistence/relational/mappers/paragraph.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ParagraphEntity } from '@src/paragraphs/infrastructure/persistence/relational/entities/paragraph.entity';

@Injectable()
export class ParagraphRelationalRepository
  implements ParagraphAbstractRepository
{
  constructor(
    @InjectRepository(ParagraphEntity)
    private readonly paragraphRepository: Repository<ParagraphEntity>,
  ) {}

  async create(data: Paragraph): Promise<Paragraph> {
    const persistenceModel = ParagraphMapper.toPersistence(data);
    const newEntity = await this.paragraphRepository.save(
      this.paragraphRepository.create(persistenceModel),
    );
    return ParagraphMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Paragraph[]> {
    const entities = await this.paragraphRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ParagraphMapper.toDomain(entity));
  }

  async findById(id: Paragraph['id']): Promise<NullableType<Paragraph>> {
    const entity = await this.paragraphRepository.findOne({
      where: { id },
    });

    return entity ? ParagraphMapper.toDomain(entity) : null;
  }

  async update(
    id: Paragraph['id'],
    payload: Partial<Paragraph>,
  ): Promise<Paragraph | null> {
    const entity = await this.paragraphRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.paragraphRepository.save(
      this.paragraphRepository.create(
        ParagraphMapper.toPersistence({
          ...ParagraphMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ParagraphMapper.toDomain(updatedEntity);
  }

  async remove(id: Paragraph['id']): Promise<void> {
    await this.paragraphRepository.delete(id);
  }
}
