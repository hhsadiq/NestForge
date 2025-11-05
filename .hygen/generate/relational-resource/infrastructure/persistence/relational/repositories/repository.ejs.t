---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.repository.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { <%= name %>Entity } from '../entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity';
<% if (functionalities.includes('findOne')) { %>
import { NullableType } from '@src/utils/types/nullable.type';
<% } %>
<% if (functionalities.includes('update') || functionalities.includes('create') || functionalities.includes('findOne') || functionalities.includes('findAll') || functionalities.includes('delete')) { %>
import { <%= name %> } from '../../../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% } %>
import { <%= name %>AbstractRepository } from '../../<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.abstract.repository';
<% if (functionalities.includes('create') || functionalities.includes('findAll') || functionalities.includes('findOne') || functionalities.includes('update')) { %>
import { <%= name %>Mapper } from '../mappers/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mapper';
<% } %>
<% if (functionalities.includes('findAll')) { %>
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { <%= name %>Filters } from '../../../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/types/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.types';
<% } %>
@Injectable()
export class <%= name %>RelationalRepository implements <%= name %>AbstractRepository {
  constructor(
    @InjectRepository(<%= name %>Entity)
    private readonly <%= h.inflection.camelize(name, true) %>Repository: Repository<<%= name %>Entity>,
  ) {}

  <% if (functionalities.includes('create')) { %>
  async create(data: <%= name %>): Promise<<%= name %>> {
    const persistenceModel = <%= name %>Mapper.toPersistence(data);
    const newEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(persistenceModel),
    );
    return <%= name %>Mapper.toDomain(newEntity);
  }
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  async findAllWithPagination({
    paginationOptions,
    filters,
  }: {
    paginationOptions: IPaginationOptions;
    filters: <%= name %>Filters;
  }): Promise<<%= name %>[]> {
    // you can add filters here based on the filters object
    if (Object.keys(filters).length > 0) {
    }

    const entities = await this.<%= h.inflection.camelize(name, true) %>Repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => <%= name %>Mapper.toDomain(entity));
  }
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  async findById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    return entity ? <%= name %>Mapper.toDomain(entity) : null;
  }
  <% } %>

  <% if (functionalities.includes('update')) { %>
  async update(
    id: <%= name %>['id'],
    payload: Partial<<%= name %>>,
  ): Promise<<%= name %> | null> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(
        <%= name %>Mapper.toPersistence({
          ...<%= name %>Mapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return <%= name %>Mapper.toDomain(updatedEntity);
  }
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  async remove(id: <%= name %>['id']): Promise<void> {
    await this.<%= h.inflection.camelize(name, true) %>Repository.delete(id);
  }
  <% } %>
}
