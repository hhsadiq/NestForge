---
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
inject: true
prepend: true,
skip_if: "@Post"
---
<% if (functionalities.includes('create')) { %>
import { Post } from '@nestjs/common';
<% } %>