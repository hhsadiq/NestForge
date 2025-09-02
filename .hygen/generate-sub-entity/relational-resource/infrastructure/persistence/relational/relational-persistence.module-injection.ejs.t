---
sh: |
 sed -i 's/TypeOrmModule\.forFeature\s*(\s*\[/TypeOrmModule.forFeature([<%= name %>Entity, /' "<%= cwd %>/src/<%= h.inflection.transform(parent, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/relational-persistence.module.ts"
---