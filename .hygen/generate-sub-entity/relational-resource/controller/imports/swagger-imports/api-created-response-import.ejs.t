---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: ApiBearerAuth,
skip_if: "@ApiCreatedResponse"
---
<% if (functionalities.includes('create')) { %>
ApiCreatedResponse,
<% } %>