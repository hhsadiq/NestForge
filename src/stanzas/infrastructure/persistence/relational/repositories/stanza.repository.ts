import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Stanza } from '@src/stanzas/domain/stanza';
import { StanzaAbstractRepository } from '@src/stanzas/infrastructure/persistence/stanza.abstract.repository';
import { StanzaMapper } from '@src/stanzas/infrastructure/persistence/relational/mappers/stanza.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { StanzaEntity } from '@src/stanzas/infrastructure/persistence/relational/entities/stanza.entity';

@Injectable()
export class StanzaRelationalRepository implements StanzaAbstractRepository {
  constructor(
    @InjectRepository(StanzaEntity)
    private readonly stanzaRepository: Repository<StanzaEntity>,
  ) {}

  async create(data: Stanza): Promise<Stanza> {
    const persistenceModel = StanzaMapper.toPersistence(data);
    const newEntity = await this.stanzaRepository.save(
      this.stanzaRepository.create(persistenceModel),
    );
    return StanzaMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Stanza[]> {
    const entities = await this.stanzaRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => StanzaMapper.toDomain(entity));
  }

  async findById(id: Stanza['id']): Promise<NullableType<Stanza>> {
    const entity = await this.stanzaRepository.findOne({
      where: { id },
    });

    return entity ? StanzaMapper.toDomain(entity) : null;
  }

  async update(
    id: Stanza['id'],
    payload: Partial<Stanza>,
  ): Promise<Stanza | null> {
    const entity = await this.stanzaRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.stanzaRepository.save(
      this.stanzaRepository.create(
        StanzaMapper.toPersistence({
          ...StanzaMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StanzaMapper.toDomain(updatedEntity);
  }

  async remove(id: Stanza['id']): Promise<void> {
    await this.stanzaRepository.delete(id);
  }
}
