---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: ApiBearerAuth,
skip_if: "@ApiParam"
---
<% if (functionalities.includes('findOne') || functionalities.includes('update') || functionalities.includes('delete')) { %>
ApiParam,
<% } %>