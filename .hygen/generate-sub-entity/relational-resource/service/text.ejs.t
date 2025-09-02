---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
after: "{}"
---

<% if (functionalities.includes('create') || functionalities.includes('update')  || functionalities.includes('findAll') || functionalities.includes('findOne') || functionalities.includes('delete')) { %>
// Service Functions for <%= name %>
<% } %>

<% if (functionalities.includes('create')) { %>
create<%= name %>(create<%= name %>Dto: Create<%= name %>Dto) {
return this.<%= h.inflection.camelize(parent, true) %>Repository.create<%= name %>(create<%= name %>Dto);
}
<% } %>

<% if (functionalities.includes('findAll')) { %>
findAll<%= name %>WithPagination({
paginationOptions,
}: {
paginationOptions: IPaginationOptions;
}) {
return this.<%= h.inflection.camelize(parent, true) %>Repository.findAll<%= name %>WithPagination({
    paginationOptions: {
    page: paginationOptions.page,
    limit: paginationOptions.limit,
    },
});
}
<% } %>

<% if (functionalities.includes('findOne')) { %>
async findOne<%= name %>(id: <%= name %>['id']) {
const <%= name %>Entity = await this.<%= h.inflection.camelize(parent, true) %>Repository.find<%= name %>ById(id);
if(!<%= name %>Entity) {
    throw NOT_FOUND('<%= name %>', { id }); 
}
return <%= name %>Entity;
}
<% } %>

<% if (functionalities.includes('update')) { %>
update<%= name %>(id: <%= name %>['id'], update<%= name %>Dto: Update<%= name %>Dto) {
const <%= h.inflection.camelize(name, true) %> = this.<%= h.inflection.camelize(parent, true) %>Repository.update<%= name %>(id, update<%= name %>Dto);
if (!<%= h.inflection.camelize(name, true) %>) {
    throw NOT_FOUND('<%= name %>', { id });
}
return <%= h.inflection.camelize(name, true) %>;
}
<% } %>

<% if (functionalities.includes('delete')) { %>
remove<%= name %>(id: <%= name %>['id']) {
return this.<%= h.inflection.camelize(parent, true) %>Repository.remove<%= name %>(id);
}
<% } %>
