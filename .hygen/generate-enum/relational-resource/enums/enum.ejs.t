---
to: "src/<%= h.inflection.transform(moduleName, ['pluralize', 'underscore', 'dasherize']) %>/enums/<%= h.inflection.transform(enumName, ['underscore', 'dasherize']) %>.enum.ts"
---


export enum <%= h.inflection.classify(enumName) %>Enum {
<% if (Array.isArray(enumValues)) { -%>
<% enumValues.forEach((value, index) => { -%>
  <%= value %> = '<%= value %>'<%= index < enumValues.length - 1 ? ',' : '' %>
<% }); -%>
<% } else { -%>
  // No values defined
<% } -%>
}
