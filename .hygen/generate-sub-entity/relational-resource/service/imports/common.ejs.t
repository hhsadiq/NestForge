---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
after: import
---

<% if (functionalities.includes('create')) { %>
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
<% if (functionalities.includes('update')) { %>
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
<% if (functionalities.includes('findOne') || functionalities.includes('update') || functionalities.includes('delete')) { %>
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% } %>