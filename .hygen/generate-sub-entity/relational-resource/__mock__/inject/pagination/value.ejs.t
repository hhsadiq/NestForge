---
inject: true
to: "<%= isAddTestCase ? `src/${h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize'])}/__mock__/${h.inflection.transform(parent, ['underscore', 'dasherize'])}.mock.ts` : null %>"
after: .mock.ts
skip_if: "export const paginationOptions"

---
<% if (functionalities.includes('findAll')) { %>
export const paginationOptions: IPaginationOptions = {
    page: 1,
    limit: 10,
};
<% } %>