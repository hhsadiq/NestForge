---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@Query"
---
<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch')) { %>
import { Query } from '@nestjs/common';
<% } %>