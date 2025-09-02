---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: Controller,
skip_if: "@Param"
---
<% if (functionalities.includes('findOne') || functionalities.includes('update') || functionalities.includes('delete')) { %>
Param,
<% } %>