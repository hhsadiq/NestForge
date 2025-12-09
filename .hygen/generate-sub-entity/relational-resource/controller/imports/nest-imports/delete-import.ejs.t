---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@Delete"
---
<% if (functionalities.includes('delete')) { %>
import { Delete } from '@nestjs/common';
<% } %>