---
to: "<%= isAddTestCase ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts` : null %>"
---
import { Test, TestingModule } from '@nestjs/testing';
<% if (functionalities.includes('update') || functionalities.includes('create') || functionalities.includes('findOne') || functionalities.includes('findAll')) { %>
import {
  <% if (functionalities.includes('findAll')) { %> 
  paginationOptions,
  <% } %>
  <% if (functionalities.includes('update') || functionalities.includes('findOne')) { %>
  mock<%= name %>,
  <% } %>
  <% if (functionalities.includes('create')) { %>
  mockCreate<%= name %>Dto,
  <% } %>
  <% if (functionalities.includes('update')) { %>
  mockUpdate<%= name %>Dto,
  <% } %>
} from './__mock__/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.mock';
<% } %>
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= name %>AbstractRepository } from './infrastructure/persistence/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.abstract.repository';

describe('<%= h.inflection.transform(name, ['pluralize']) %>Service', () => {
  let service: <%= h.inflection.transform(name, ['pluralize']) %>Service;
  let <%= h.inflection.camelize(name, true) %>Repository: <%= name %>AbstractRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <%= h.inflection.transform(name, ['pluralize']) %>Service,
        {
          provide: <%= name %>AbstractRepository,
          useValue: {
            <% if (functionalities.includes('create')) { %>
            create: jest.fn(),
            <% } %>
            <% if (functionalities.includes('findAll')) { %>
            findAllWithPagination: jest.fn(),
            <% } %>
            <% if (functionalities.includes('findOne')) { %>
            findById: jest.fn(),
            <% } %>
            <% if (functionalities.includes('update')) { %>
            update: jest.fn(),
            <% } %>
            <% if (functionalities.includes('delete')) { %>
            remove: jest.fn(),
            <% } %>
          },
        },
      ],
    }).compile();

    service = module.get<<%= h.inflection.transform(name, ['pluralize']) %>Service>(<%= h.inflection.transform(name, ['pluralize']) %>Service);
    <%= h.inflection.camelize(name, true) %>Repository = module.get<<%= name %>AbstractRepository>(<%= name %>AbstractRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  <% if (functionalities.includes('create')) { %>
  it('should create a <%= name.toLowerCase() %>', async () => {
    await service.create(mockCreate<%= name %>Dto);
    expect(<%= h.inflection.camelize(name, true) %>Repository.create).toHaveBeenCalledWith(mockCreate<%= name %>Dto);
  });
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  it('should find all <%= h.inflection.pluralize(name.toLowerCase()) %> with pagination', async () => {
    await service.findAllWithPagination({ paginationOptions });
    expect(<%= h.inflection.camelize(name, true) %>Repository.findAllWithPagination).toHaveBeenCalledWith({
      paginationOptions,
    });
  });
  <% } %>

  <% if (functionalities.includes('findOne')) { %>
  it('should return a <%= name.toLowerCase() %> when found by id', async () => {
    const id = mock<%= name %>.id;
    jest.spyOn(<%= h.inflection.camelize(name, true) %>Repository, 'findById').mockResolvedValue(mock<%= name %>);
    const result = await service.findOne(id);

    expect(<%= h.inflection.camelize(name, true) %>Repository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mock<%= name %>);
  });
  <% } %>

  <% if (functionalities.includes('update')) { %>
  it('should update a <%= name.toLowerCase() %> by ID', async () => {
    const id = mock<%= name %>.id;
    jest.spyOn(<%= h.inflection.camelize(name, true) %>Repository, 'update').mockResolvedValue(mock<%= name %>);
    await service.update(id, mockUpdate<%= name %>Dto);
    expect(<%= h.inflection.camelize(name, true) %>Repository.update).toHaveBeenCalledWith(id, mockUpdate<%= name %>Dto);
  });
  <% } %>

  <% if (functionalities.includes('delete')) { %>
  it('should remove a <%= name.toLowerCase() %> by ID', async () => {
    const id = 'testId';
    await service.remove(id);
    expect(<%= h.inflection.camelize(name, true) %>Repository.remove).toHaveBeenCalledWith(id);
  });
  <% } %>
});
