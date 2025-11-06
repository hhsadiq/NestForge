---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.abstract.repository.ts
---
<% if (functionalities.includes('update')) { %>
import { DeepPartial } from '../../../utils/types/deep-partial.type';
<% } %>
<% if (functionalities.includes('findOne')) { %>
import { NullableType } from '@src/utils/types/nullable.type';
<% } %>
<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { IPaginationOptions } from '../../../utils/types/pagination-options';
<% } %>
<% if (functionalities.includes('findAllWithSearch')) { %>
import { <%= name %>Filters } from '../../../<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/types/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.types';
<% } %>
<% if (functionalities.includes('update') || functionalities.includes('create') || functionalities.includes('findOne') || functionalities.includes('findAll') || functionalities.includes('findAllWithSearch') || functionalities.includes('delete')) { %>
import { <%= name %> } from '../../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% } %>
export abstract class <%= name %>AbstractRepository {
  <% if (functionalities.includes('create')) { %>
  abstract create(
    data: Omit<<%= name %>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<<%= name %>>;
  <% } %>

  <% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
  abstract findAllWithPagination({
    paginationOptions,
    <% if (functionalities.includes('findAllWithSearch')) { %> filters, <% } %>
  }: {
    paginationOptions: IPaginationOptions;
    <% if (functionalities.includes('findAllWithSearch')) { %> filters: <%= name %>Filters; <% } %>
  }): Promise<<%= name %>[]>;
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  abstract findById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>>;
  <% } %>

  <% if (functionalities.includes('update')) { %>
  abstract update(
    id: <%= name %>['id'],
    payload: DeepPartial<<%= name %>>,
  ): Promise<<%= name %> | null>;
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  abstract remove(id: <%= name %>['id']): Promise<void>;
  <% } %>
}
