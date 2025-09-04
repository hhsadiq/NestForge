import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Meter } from '@src/meters/domain/meter';
import { MeterAbstractRepository } from '@src/meters/infrastructure/persistence/meter.abstract.repository';
import { MeterMapper } from '@src/meters/infrastructure/persistence/relational/mappers/meter.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { MeterEntity } from '@src/meters/infrastructure/persistence/relational/entities/meter.entity';

@Injectable()
export class MeterRelationalRepository implements MeterAbstractRepository {
  constructor(
    @InjectRepository(MeterEntity)
    private readonly meterRepository: Repository<MeterEntity>,
  ) {}

  async create(data: Meter): Promise<Meter> {
    const persistenceModel = MeterMapper.toPersistence(data);
    const newEntity = await this.meterRepository.save(
      this.meterRepository.create(persistenceModel),
    );
    return MeterMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Meter[]> {
    const entities = await this.meterRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MeterMapper.toDomain(entity));
  }

  async findById(id: Meter['id']): Promise<NullableType<Meter>> {
    const entity = await this.meterRepository.findOne({
      where: { id },
    });

    return entity ? MeterMapper.toDomain(entity) : null;
  }

  async update(
    id: Meter['id'],
    payload: Partial<Meter>,
  ): Promise<Meter | null> {
    const entity = await this.meterRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.meterRepository.save(
      this.meterRepository.create(
        MeterMapper.toPersistence({
          ...MeterMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MeterMapper.toDomain(updatedEntity);
  }

  async remove(id: Meter['id']): Promise<void> {
    await this.meterRepository.delete(id);
  }
}
