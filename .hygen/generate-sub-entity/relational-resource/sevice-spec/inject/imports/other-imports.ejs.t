---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts` : null %>"
before: import
---
<% if (functionalities.includes('update') || functionalities.includes('create') || functionalities.includes('findOne') || functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import {
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