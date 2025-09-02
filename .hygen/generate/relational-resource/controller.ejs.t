---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  <% if (functionalities.includes('findAll') || functionalities.includes('findOne')) { %>
  Get,
  <% } %>
  <% if (functionalities.includes('create')) { %>
  Post,
  <% } %>
  <% if (functionalities.includes('update') || functionalities.includes('create')) { %>
  Body,
  <% } %>
  <% if (functionalities.includes('update')) { %>
  Patch,
  <% } %>
  <% if (functionalities.includes('findOne') || functionalities.includes('update') || functionalities.includes('delete')) { %>
  Param,
  <% } %>
  <% if (functionalities.includes('delete')) { %>
  Delete,
  <% } %>
  UseGuards,
  <% if (functionalities.includes('findAll')) { %>
  Query,
  <% } %>
} from '@nestjs/common';
import {
  ApiBearerAuth,
  <% if (functionalities.includes('create')) { %>
  ApiCreatedResponse,
  <% } %>
  <% if (functionalities.includes('findAll') || functionalities.includes('update')) { %>
  ApiOkResponse,
  <% } %>
  <% if (functionalities.includes('findOne') || functionalities.includes('update') || functionalities.includes('delete')) { %>
  ApiParam,
  <% } %>
  ApiTags,
} from '@nestjs/swagger';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
<% if (functionalities.includes('create')) { %>
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
<% if (functionalities.includes('update')) { %>
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
<% if (functionalities.includes('create') || functionalities.includes('update') || functionalities.includes('findAll')) { %>
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% } %>
import { AuthGuard } from '@nestjs/passport';
<% if (functionalities.includes('findAll')) { %>
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto } from './dto/find-all-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.dto';
<% } %>

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'dasherize', 'underscore', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service: <%= h.inflection.transform(name, ['pluralize']) %>Service) {}

  <% if (functionalities.includes('create')) { %>
  @Post()
  @ApiCreatedResponse({
    type: <%= name %>,
  })
  create(@Body() create<%= name %>Dto: Create<%= name %>Dto) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.create(create<%= name %>Dto);
  }
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(<%= name %>),
  })
  async findAll(
    @Query() query: FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto,
  ): Promise<InfinityPaginationResponseDto<<%= name %>>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findOne(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findOne(id);
  }
  <% } %>

  <% if (functionalities.includes('update')) { %>
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  update(
    @Param('id') id: number,
    @Body() update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.update(id, update<%= name %>Dto);
  }
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.remove(id);
  }
  <% } %>
}
