---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts` : null %>"
after: childCasesHere
---
<% if (functionalities.includes('create')) { %>
  it('should create a <%= name.toLowerCase() %>', async () => {
    await service.create<%= name %>(mockCreate<%= name %>Dto);
    expect(<%= h.inflection.camelize(parent, true) %>Repository.create<%= name %>).toHaveBeenCalledWith(mockCreate<%= name %>Dto);
  });
  <% } %>

  <% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
  it('should find all <%= h.inflection.pluralize(name.toLowerCase()) %> with pagination', async () => {
    await service.findAll<%= name %>WithPagination({ paginationOptions, <% if (functionalities.includes('findAllWithSearch')) { %>filters: {},<% } %> });
    expect(<%= h.inflection.camelize(parent, true) %>Repository.findAll<%= name %>WithPagination).toHaveBeenCalledWith({
      paginationOptions,
      <% if (functionalities.includes('findAllWithSearch')) { %>filters: {},<% } %>
    });
  });
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  it('should return a <%= name.toLowerCase() %> when found by id', async () => {
    const id = mock<%= name %>.id;
    jest.spyOn(<%= h.inflection.camelize(parent, true) %>Repository, 'find<%= name %>ById').mockResolvedValue(mock<%= name %>);
    const result = await service.findOne<%= name %>(id);

    expect(<%= h.inflection.camelize(parent, true) %>Repository.find<%= name %>ById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mock<%= name %>);
  });
  <% } %>

  <% if (functionalities.includes('update')) { %>
  it('should update a <%= name.toLowerCase() %> by ID', async () => {
    const id = mock<%= name %>.id;
    jest.spyOn(<%= h.inflection.camelize(parent, true) %>Repository, 'update<%= name %>').mockResolvedValue(mock<%= name %>);
    await service.update<%= name %>(id, mockUpdate<%= name %>Dto);
    expect(<%= h.inflection.camelize(parent, true) %>Repository.update<%= name %>).toHaveBeenCalledWith(id, mockUpdate<%= name %>Dto);
  });
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  it('should remove a <%= name.toLowerCase() %> by ID', async () => {
    const id = 1;
    await service.remove<%= name %>(id);
    expect(<%= h.inflection.camelize(parent, true) %>Repository.remove<%= name %>).toHaveBeenCalledWith(id);
  });
  <% } %>