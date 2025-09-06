---
to: "src/<%= moduleName %>/enums/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.enum.ts"
skip_if: "<%= h.exists('src/' + moduleName + '/enums/' + h.inflection.transform(name, ['underscore', 'dasherize']) + '.enum.ts') %>"
---

export enum <%= h.inflection.classify(name) %>Enum {
<% values.forEach((value, index) => { -%>
  <%= value %> = '<%= value %>'<%= index < values.length - 1 ? ',' : '' %>
<% }); -%>
}
