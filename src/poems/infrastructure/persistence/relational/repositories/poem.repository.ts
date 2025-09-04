import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Poem } from '@src/poems/domain/poem';
import { PoemAbstractRepository } from '@src/poems/infrastructure/persistence/poem.abstract.repository';
import { PoemMapper } from '@src/poems/infrastructure/persistence/relational/mappers/poem.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemEntity } from '@src/poems/infrastructure/persistence/relational/entities/poem.entity';

@Injectable()
export class PoemRelationalRepository implements PoemAbstractRepository {
  constructor(
    @InjectRepository(PoemEntity)
    private readonly poemRepository: Repository<PoemEntity>,
  ) {}

  async create(data: Poem): Promise<Poem> {
    const persistenceModel = PoemMapper.toPersistence(data);
    const newEntity = await this.poemRepository.save(
      this.poemRepository.create(persistenceModel),
    );
    return PoemMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Poem[]> {
    const entities = await this.poemRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PoemMapper.toDomain(entity));
  }

  async findById(id: Poem['id']): Promise<NullableType<Poem>> {
    const entity = await this.poemRepository.findOne({
      where: { id },
    });

    return entity ? PoemMapper.toDomain(entity) : null;
  }

  async update(id: Poem['id'], payload: Partial<Poem>): Promise<Poem | null> {
    const entity = await this.poemRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.poemRepository.save(
      this.poemRepository.create(
        PoemMapper.toPersistence({
          ...PoemMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PoemMapper.toDomain(updatedEntity);
  }

  async remove(id: Poem['id']): Promise<void> {
    await this.poemRepository.delete(id);
  }
}
