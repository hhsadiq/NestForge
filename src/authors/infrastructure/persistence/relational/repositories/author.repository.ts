import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { Author } from '@src/authors/domain/author';
import { AuthorAbstractRepository } from '@src/authors/infrastructure/persistence/author.abstract.repository';
import { AuthorMapper } from '@src/authors/infrastructure/persistence/relational/mappers/author.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { AuthorEntity } from '@src/authors/infrastructure/persistence/relational/entities/author.entity';

@Injectable()
export class AuthorRelationalRepository implements AuthorAbstractRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(data: Author): Promise<Author> {
    const persistenceModel = AuthorMapper.toPersistence(data);
    const newEntity = await this.authorRepository.save(
      this.authorRepository.create(persistenceModel),
    );
    return AuthorMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Author[]> {
    const entities = await this.authorRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AuthorMapper.toDomain(entity));
  }

  async findById(id: Author['id']): Promise<NullableType<Author>> {
    const entity = await this.authorRepository.findOne({
      where: { id },
    });

    return entity ? AuthorMapper.toDomain(entity) : null;
  }

  async update(
    id: Author['id'],
    payload: Partial<Author>,
  ): Promise<Author | null> {
    const entity = await this.authorRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.authorRepository.save(
      this.authorRepository.create(
        AuthorMapper.toPersistence({
          ...AuthorMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AuthorMapper.toDomain(updatedEntity);
  }

  async remove(id: Author['id']): Promise<void> {
    await this.authorRepository.delete(id);
  }
}
