---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
before: import
skip_if: "@src/common/exceptions"
---

<% if (functionalities.includes('update') || functionalities.includes('findOne')) { %>
import { } from '@src/common/exceptions';
<% } %>
