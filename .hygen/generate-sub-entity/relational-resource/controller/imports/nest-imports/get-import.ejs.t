---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@Get"
---
<% if (functionalities.includes('findAll') || functionalities.includes('findAllWithSearch') || functionalities.includes('findOne')) { %>
import { Get } from '@nestjs/common';
<% } %>