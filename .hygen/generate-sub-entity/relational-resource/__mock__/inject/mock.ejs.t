---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/__mock__/${h.inflection.transform(parent, ['underscore', 'dasherize'])}.mock.ts` : null %>"
after: ".mock.ts"
---
<% if (functionalities.includes('create')) { %>
import { Create<%= name %>Dto } from '@src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
<% if (functionalities.includes('update')) { %>
import { Update<%= name %>Dto } from '@src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
<% } %>
import { <%= name %> } from '@src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
<% if (enums?.length) { %>
<% enums.forEach(enumDef => { %>
import { <%= enumDef.enumName %>Enum } from '../enums/<%= h.inflection.dasherize(h.inflection.underscore(enumDef.enumName)) %>.enum';
<% }) %>
<% } %>
<% if (functionalities.includes('create')) { %>
export const mockCreate<%= name %>Dto: Create<%= name %>Dto = {
    <% fields.forEach(field => { %>
        <%= h.inflection.camelize(field.name, true) %>: <%- h.getValue(field) %>,
    <% }) %>

};
<% } %>
<% if (functionalities.includes('update')) { %>
export const mockUpdate<%= name %>Dto: Update<%= name %>Dto = {
    <% fields.forEach(field => { %>
        <%= h.inflection.camelize(field.name, true) %>: <%- h.getValue(field) %>,
    <% }) %>
};
<% } %>
export const mock<%= name %>: <%= name %> = {
    id: 123,
    <% fields.forEach(field => { %>
        <%= h.inflection.camelize(field.name, true) %>: <%- h.getValue(field) %>,
    <% }) %>
    createdAt: new Date('<%= new Date().toISOString() %>'),
    updatedAt: new Date('<%= new Date().toISOString() %>'),
    // provide necessary fields here @mock-obj
};