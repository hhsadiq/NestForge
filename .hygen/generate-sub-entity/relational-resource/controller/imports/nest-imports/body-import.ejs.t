---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@Body"
---
<% if (functionalities.includes('update') || functionalities.includes('create')) { %>
import { Body } from '@nestjs/common';
<% } %>