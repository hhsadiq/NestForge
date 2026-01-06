---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
prepend: true
skip_if: "NOT_FOUND"
---
<% if (functionalities.includes('update') || functionalities.includes('findOne')) { %>
import { NOT_FOUND } from '@src/common/exceptions';
<% } %>
