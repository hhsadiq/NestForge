---
to: "<%= isAddTestCase && !h.exists(`src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts`) ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts` : null %>"
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
} from './__mock__/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.mock';
<% } %>
import { <%= h.inflection.transform(parent, ['pluralize']) %>Service } from './<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= parent %>AbstractRepository } from './infrastructure/persistence/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.abstract.repository';

describe('<%= h.inflection.transform(name, ['pluralize']) %>Service', () => {
  let service: <%= h.inflection.transform(parent, ['pluralize']) %>Service;
  let <%= h.inflection.camelize(parent, true) %>Repository: <%= parent %>AbstractRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <%= h.inflection.transform(parent, ['pluralize']) %>Service,
        {
          provide: <%= parent %>AbstractRepository,
          useValue: {
            <% if (functionalities.includes('create')) { %>
            create<%= name %>: jest.fn(),
            <% } %>
            <% if (functionalities.includes('findAll')) { %>
            findAll<%= name %>WithPagination: jest.fn(),
            <% } %>
            <% if (functionalities.includes('findOne')) { %>
            find<%= name %>ById: jest.fn(),
            <% } %>
            <% if (functionalities.includes('update')) { %>
            update<%= name %>: jest.fn(),
            <% } %>
            <% if (functionalities.includes('delete')) { %>
            remove<%= name %>: jest.fn(),
            <% } %>
          },
        },
      ],
    }).compile();

    service = module.get<<%= h.inflection.transform(parent, ['pluralize']) %>Service>(<%= h.inflection.transform(parent, ['pluralize']) %>Service);
    <%= h.inflection.camelize(parent, true) %>Repository = module.get<<%= parent %>AbstractRepository>(<%= parent %>AbstractRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  <% if (functionalities.includes('create')) { %>
  it('should create a <%= name.toLowerCase() %>', async () => {
    await service.create<%= name %>(mockCreate<%= name %>Dto);
    expect(<%= h.inflection.camelize(parent, true) %>Repository.create<%= name %>).toHaveBeenCalledWith(mockCreate<%= name %>Dto);
  });
  <% } %>

  <% if (functionalities.includes('findAll')) { %>
  it('should find all <%= h.inflection.pluralize(name.toLowerCase()) %> with pagination', async () => {
    await service.findAll<%= name %>WithPagination({ paginationOptions });
    expect(<%= h.inflection.camelize(parent, true) %>Repository.findAll<%= name %>WithPagination).toHaveBeenCalledWith({
      paginationOptions,
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
  // @childCasesHere
});
