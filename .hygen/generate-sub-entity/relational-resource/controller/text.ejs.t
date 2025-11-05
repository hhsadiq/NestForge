---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: "{}"
---
<% if (functionalities.includes('create') || functionalities.includes('update')  || functionalities.includes('findAll') || functionalities.includes('findOne') || functionalities.includes('delete')) { %>
// Endpoints for <%= name %>
<% } %>

<% if (functionalities.includes('create')) { %>
  @Post('<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>')
  @ApiCreatedResponse({
    type: <%= name %>,
  })
  create<%= name %>(@Body() create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(parent), true) %>Service.create<%= name %>(create<%= name %>Dto);
  }
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  @Get('<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>')
  @ApiOkResponse({
    type: InfinityPaginationResponse(<%= name %>),
  })
  async findAll<%= name %>(
    @Query() query: FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto,
  ): Promise<InfinityPaginationResponseDto<<%= name %>>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    // TODO: Add filters based on the query i.e. query?.name
    const filters : <%= name %>Filters = {
      
    };

    return infinityPagination(
      await this.<%= h.inflection.camelize(h.inflection.pluralize(parent), true) %>Service.findAll<%= name %>WithPagination({
        paginationOptions: {
          page,
          limit,
        },
        filters,
      }),
      { page, limit },
    );
  }
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  @Get('<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findOne<%= name %>(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(parent), true) %>Service.findOne<%= name %>(id);
  }
  <% } %>

  <% if (functionalities.includes('update')) { %>
  @Patch('<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  update<%= name %>(
    @Param('id') id: number,
    @Body() update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(parent), true) %>Service.update<%= name %>(id, update<%= name %>Dto);
  }
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  @Delete('<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove<%= name %>(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(parent), true) %>Service.remove<%= name %>(id);
  }
  <% } %>