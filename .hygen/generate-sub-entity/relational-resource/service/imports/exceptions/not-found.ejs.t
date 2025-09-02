---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
before: "@src/common/exceptions;"
skip_if: NOT_FOUND
---
<% if (functionalities.includes('update') || functionalities.includes('findOne')) { %>
NOT_FOUND,
<% } %>
