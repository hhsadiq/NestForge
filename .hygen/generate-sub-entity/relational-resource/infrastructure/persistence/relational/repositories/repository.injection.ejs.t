---
inject: true
to: src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/repositories/<%= h.inflection.transform(parent, ['underscore', 'dasherize']) %>.repository.ts
after: constructor
---

@InjectRepository(<%= name %>Entity)
private readonly <%= h.inflection.camelize(name, true) %>Repository: Repository<<%= name %>Entity>,