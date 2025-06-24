import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Clap } from '@src/claps/domain/clap';
import { CreateClapDto } from '@src/claps/dto/create-clap.dto';
import { ClapAbstractRepository } from '@src/claps/infrastructure/persistence/clap.abstract.repository';
import { ClapEntity } from '@src/claps/infrastructure/persistence/relational/entities/clap.entity';
import { ClapMapper } from '@src/claps/infrastructure/persistence/relational/mappers/clap.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class ClapRelationalRepository implements ClapAbstractRepository {
  constructor(
    @InjectRepository(ClapEntity)
    private readonly clapRepository: Repository<ClapEntity>,
  ) {}

  async create(data: CreateClapDto): Promise<Clap> {
    const persistenceModel = ClapMapper.createClapDtoToPersistence(data);
    const { user_id, article_id } = persistenceModel;
    const newEntity = await this.clapRepository.save(
      this.clapRepository.create({
        user_id,
        article_id,
      }),
    );
    return ClapMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Clap[]> {
    const entities = await this.clapRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ClapMapper.toDomain(entity));
  }

  async findById(id: Clap['id']): Promise<NullableType<Clap>> {
    const entity = await this.clapRepository.findOne({
      where: { id },
    });

    return entity ? ClapMapper.toDomain(entity) : null;
  }

  async update(id: Clap['id'], payload: Partial<Clap>): Promise<Clap | null> {
    const entity = await this.clapRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.clapRepository.save(
      this.clapRepository.create(
        ClapMapper.toPersistence({
          ...ClapMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ClapMapper.toDomain(updatedEntity);
  }

  async remove(id: Clap['id']): Promise<void> {
    await this.clapRepository.delete(id);
  }

  async findByCreateClapDto(
    createClapDto: CreateClapDto,
  ): Promise<Clap | null> {
    const persistenceModel =
      ClapMapper.createClapDtoToPersistence(createClapDto);
    const { user_id, article_id } = persistenceModel;
    const clapEntity: ClapEntity | null = await this.clapRepository.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    return clapEntity ? ClapMapper.toDomain(clapEntity) : null;
  }

  async getCountByArticleId(article_id: string): Promise<number> {
    return await this.clapRepository.count({ where: { article_id } });
  }
}
