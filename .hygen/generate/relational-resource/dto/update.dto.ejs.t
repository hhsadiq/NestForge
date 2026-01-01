---
to: "<%= functionalities.includes('update') ? `src/${h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize'])}/dto/update-${h.inflection.transform(name, ['underscore', 'dasherize'])}.dto.ts` : null %>"
---

import { PartialType } from '@nestjs/swagger';
<% if (!functionalities.includes('create')) { %>
import { OmitType } from '@nestjs/swagger';
<% }  %>
<% if (functionalities.includes('create')) { %>
import { Create<%= name %>Dto } from './create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

export class Update<%= name %>Dto extends PartialType(Create<%= name %>Dto) {}
<% } else { %>
import { <%= name %> } from '../domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';

export class Update<%= name %>Dto extends PartialType(OmitType(<%= name %>, ['id', 'createdAt', 'updatedAt'])) {}
<% } %>
