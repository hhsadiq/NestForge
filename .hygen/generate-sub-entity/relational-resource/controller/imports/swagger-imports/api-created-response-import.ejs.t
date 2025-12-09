---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@ApiCreatedResponse"
---
<% if (functionalities.includes('create')) { %>
import { ApiCreatedResponse } from '@nestjs/swagger';
<% } %>