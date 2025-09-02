---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
after: Controller,
skip_if: "@Body"
---
<% if (functionalities.includes('update') || functionalities.includes('create')) { %>
Body,
<% } %>