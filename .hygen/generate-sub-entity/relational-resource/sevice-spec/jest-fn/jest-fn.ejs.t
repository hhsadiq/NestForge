---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}.service.spec.ts` : null %>"
after: "useValue: {"
---
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