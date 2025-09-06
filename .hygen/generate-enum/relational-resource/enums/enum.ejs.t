---
to: "src/<%= moduleName %>/enums/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.enum.ts"
---

export enum <%= h.inflection.classify(name) %>Enum {
<% if (Array.isArray(values)) { -%>
<% values.forEach((value, index) => { -%>
  <%= value %> = '<%= value %>'<%= index < values.length - 1 ? ',' : '' %>
<% }); -%>
<% } else { -%>
  // No values defined
<% } -%>
}
