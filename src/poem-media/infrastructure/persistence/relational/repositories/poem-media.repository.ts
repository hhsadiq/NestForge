import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { PoemMedia } from '@src/poem-media/domain/poem-media';
import { PoemMediaAbstractRepository } from '@src/poem-media/infrastructure/persistence/poem-media.abstract.repository';
import { PoemMediaMapper } from '@src/poem-media/infrastructure/persistence/relational/mappers/poem-media.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemMediaEntity } from '@src/poem-media/infrastructure/persistence/relational/entities/poem-media.entity';

@Injectable()
export class PoemMediaRelationalRepository
  implements PoemMediaAbstractRepository
{
  constructor(
    @InjectRepository(PoemMediaEntity)
    private readonly poemMediaRepository: Repository<PoemMediaEntity>,
  ) {}

  async create(data: PoemMedia): Promise<PoemMedia> {
    const persistenceModel = PoemMediaMapper.toPersistence(data);
    const newEntity = await this.poemMediaRepository.save(
      this.poemMediaRepository.create(persistenceModel),
    );
    return PoemMediaMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemMedia[]> {
    const entities = await this.poemMediaRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PoemMediaMapper.toDomain(entity));
  }

  async findById(id: PoemMedia['id']): Promise<NullableType<PoemMedia>> {
    const entity = await this.poemMediaRepository.findOne({
      where: { id },
    });

    return entity ? PoemMediaMapper.toDomain(entity) : null;
  }

  async update(
    id: PoemMedia['id'],
    payload: Partial<PoemMedia>,
  ): Promise<PoemMedia | null> {
    const entity = await this.poemMediaRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.poemMediaRepository.save(
      this.poemMediaRepository.create(
        PoemMediaMapper.toPersistence({
          ...PoemMediaMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PoemMediaMapper.toDomain(updatedEntity);
  }

  async remove(id: PoemMedia['id']): Promise<void> {
    await this.poemMediaRepository.delete(id);
  }
}
