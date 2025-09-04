import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { PoemForm } from '@src/poem-forms/domain/poem-form';
import { PoemFormAbstractRepository } from '@src/poem-forms/infrastructure/persistence/poem-form.abstract.repository';
import { PoemFormMapper } from '@src/poem-forms/infrastructure/persistence/relational/mappers/poem-form.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemFormEntity } from '@src/poem-forms/infrastructure/persistence/relational/entities/poem-form.entity';

@Injectable()
export class PoemFormRelationalRepository
  implements PoemFormAbstractRepository
{
  constructor(
    @InjectRepository(PoemFormEntity)
    private readonly poemFormRepository: Repository<PoemFormEntity>,
  ) {}

  async create(data: PoemForm): Promise<PoemForm> {
    const persistenceModel = PoemFormMapper.toPersistence(data);
    const newEntity = await this.poemFormRepository.save(
      this.poemFormRepository.create(persistenceModel),
    );
    return PoemFormMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemForm[]> {
    const entities = await this.poemFormRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PoemFormMapper.toDomain(entity));
  }

  async findById(id: PoemForm['id']): Promise<NullableType<PoemForm>> {
    const entity = await this.poemFormRepository.findOne({
      where: { id },
    });

    return entity ? PoemFormMapper.toDomain(entity) : null;
  }

  async update(
    id: PoemForm['id'],
    payload: Partial<PoemForm>,
  ): Promise<PoemForm | null> {
    const entity = await this.poemFormRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.poemFormRepository.save(
      this.poemFormRepository.create(
        PoemFormMapper.toPersistence({
          ...PoemFormMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PoemFormMapper.toDomain(updatedEntity);
  }

  async remove(id: PoemForm['id']): Promise<void> {
    await this.poemFormRepository.delete(id);
  }
}
