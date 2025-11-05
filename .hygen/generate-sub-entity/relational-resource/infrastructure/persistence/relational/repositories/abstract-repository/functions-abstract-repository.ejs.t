---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository.ts
after: "export abstract class"
---

  <% if (functionalities.includes('create')) { %>
  abstract create<%= name %>(
    data: Omit<<%= name %>, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<<%= name %>>;
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  abstract findAll<%= name %>WithPagination({
    paginationOptions,
    filters,
  }: {
    paginationOptions: IPaginationOptions;
    filters: <%= name %>Filters;
  }): Promise<<%= name %>[]>;
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  abstract find<%= name %>ById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>>;
  <% } %>

  <% if (functionalities.includes('update')) { %>
  abstract update<%= name %>(
    id: <%= name %>['id'],
    payload: DeepPartial<<%= name %>>,
  ): Promise<<%= name %> | null>;
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  abstract remove<%= name %>(id: <%= name %>['id']): Promise<void>;
  <% } %>
