# Relationship generator

---

## For relational database (PostgreSQL + TypeORM)

Use the command below to generate a relationship (no arguments required):

```bash
npm run generate:relationship
```

Interactive prompts will ask for the following details:

1. Source Entity Name: entity where the relation is added (required)
2. Source Entity Parent: parent module of the source entity (optional)
3. Related Entity Name: target entity to relate to (required)
4. Related Entity Parent: parent module of the related entity (optional)
5. Relation Type: one of `ManyToOne`, `OneToMany`, `OneToOne` (required)
6. Related Entity Field Name: only required for `OneToMany`
7. Field Name on Source: the property name to add on the source entity (required)
8. Source Column Name: foreign key column on source (required for all except `OneToMany`)

---

## Using a JSON schema file (Cursor AI prompt template)

If you want to define your relationship in advance using a structured schema, you can use **Cursor AI** to help generate the schema JSON. You can then use this schema to generate the relationship without any interactive prompts.

**⚠️ Important:** This command can take only one JSON object at a time.

Save the JSON at the following path relative to the project root:

```text
.hygen-entities-generator/<relation-name-kebab-case>.json
```

**Sample file:**

- `.hygen-sample-files/sample-relationship-generator.json`

Example structure:

```json
{
  "sourceEntityName": "User",
  "sourceEntityParent": null,
  "fieldName": "role",
  "relationType": "ManyToOne",
  "relationEntityParent": null,
  "relationEntityName": "Role",
  "sourceColumnName": "role_id",
  "relationFieldName": null
}
```

Then run:

```bash
DATA_FILE=.hygen-entities-generator/<relation-name-kebab-case>.json npm run generate:relationship
```

### 👇 Prompt Template (for Cursor AI)

Copy and paste the following into Cursor. Replace the placeholders with your relation details (source/target, type, field/column names):

<details>
<summary>Click to expand the prompt</summary>

```text
You are helping generate a JSON relation file for a codegen CLI that uses Hygen templates. Follow the instructions precisely and do not add extra explanations or UI formatting. Output a JSON file only in the structure described below.

---

### INPUT

I will provide one of the following:
- A raw SQL description of the relationship (FK and sides)
- A natural language description of the relationship

You will create a JSON object matching the exact structure below.

---

### OUTPUT FORMAT

{
  "sourceEntityName": "User",
  "sourceEntityParent": null,
  "fieldName": "role",
  "relationType": "ManyToOne | OneToMany | OneToOne | ManyToMany",
  "relationEntityParent": null,
  "relationEntityName": "Role",
  "sourceColumnName": "role_id",
  "relationFieldName": null
}

> Notes:
> - `sourceEntityName`/`relationEntityName`: PascalCase
> - `sourceEntityParent`/`relationEntityParent`: PascalCase or null
> - `fieldName`: camelCase property to add on source
> - `sourceColumnName`: snake_case FK column (omit for OneToMany)
> - `relationFieldName`: required only for OneToMany (the field on related side)

---

### FILE OUTPUT

Once you've built the correct JSON, **save the file to this path relative to the project root**:

.hygen-entities-generator/<relation-name-kebab-case>.json

Example:
.hygen-entities-generator/user-role.json

Samples for reference are available under `.hygen-sample-files/`, e.g. `sample-relationship-generator.json`.

---

### FINAL INSTRUCTION

Once the file is saved, tell me:

✅ Relation file generated successfully.

Now run:
DATA_FILE=.hygen-entities-generator/<relation-name-kebab-case>.json npm run generate:relationship

---

### NOW GO AHEAD

Here is my input:

[Paste your relationship description here]
```

</details>

---

### ✅ After generating the file

Once the JSON file is created (e.g. `.hygen-entities-generator/user-role.json`), run:

```bash
DATA_FILE=.hygen-entities-generator/user-role.json npm run generate:relationship
```

This will generate the relationship without further prompts.

---

Previous: [Sub-entity generator](sub-entity.md)

Next: [Property generator](property.md)
