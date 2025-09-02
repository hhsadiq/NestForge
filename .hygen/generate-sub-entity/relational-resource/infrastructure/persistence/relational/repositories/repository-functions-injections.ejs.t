---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
after: '{}'
---


  <% if (functionalities.includes('create')) { %>
  async create<%= name %>(data: <%= name %>): Promise<<%= name %>> {
    const persistenceModel = <%= name %>Mapper.toPersistence(data);
    const newEntity = await this.<%= h.inflection.camelize(name, true) %>Repository.save(
      this.<%= h.inflection.camelize(name, true) %>Repository.create(persistenceModel),
    );
    return <%= name %>Mapper.toDomain(newEntity);
  }
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  async findAll<%= name %>WithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<<%= name %>[]> {
    const entities = await this.<%= h.inflection.camelize(name, true) %>Repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => <%= name %>Mapper.toDomain(entity));
  }
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  async find<%= name %>ById(id: <%= name %>['id']): Promise<NullableType<<%= name %>>> {
    const entity = await this.<%= h.inflection.camelize(name, true) %>Repository.findOne({
      where: { id },
    });

    return entity ? <%= name %>Mapper.toDomain(entity) : null;
  }
  <% } %>

  <% if (functionalities.includes('update')) { %>
  async update<%= name %>(
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
  async remove<%= name %>(id: <%= name %>['id']): Promise<void> {
    await this.<%= h.inflection.camelize(name, true) %>Repository.delete(id);
  }
  <% } %>

