---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: Controller,
skip_if: "@Get"
---
<% if (functionalities.includes('findAll') || functionalities.includes('findOne')) { %>
Get,
<% } %>