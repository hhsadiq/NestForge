# Sub-entity (child) generator

---

## For relational database (PostgreSQL + TypeORM)

Use the command below to generate a sub-entity interactively (no JSON schema required):

```bash
npm run generate:sub-entity
```

Prompts:

1. Parent: name of the parent entity (required)
2. Name: name of the sub-entity (required)

The generator will scaffold the sub-entity across domain, DTOs, service/controller, and persistence (entities, repositories, mappers) following the project’s hexagonal structure.

---

## Using a JSON schema file (Cursor AI prompt template)

If you want to define your sub-entity in advance using a structured schema, you can use **Cursor AI** to help generate the schema JSON. You can then use this schema to generate the full sub-entity without any interactive prompts.

Save the JSON at the following path relative to the project root:

```text
.hygen-entities-generator/<sub-entity-name-kebab-case>.json
```

**Sample files:**

- `.hygen-sample-files/sample-sub-entity-generator.json` - Single sub-entity example
- `.hygen-sample-files/sample-entities-generator.json` - Multiple sub-entities within full schema

Example structure:

```json
{
  "parent": "ParentEntityName",
  "name": "ChildEntityName",
  "functionalities": ["create", "findAll", "findOne", "update", "delete"],
  "fields": [
    {
      "name": "field_name",
      "type": "int | float | double | decimal | boolean | varchar | text | uuid | timestamp | date | json | custom",
      "optional": true,
      "customType": "CustomTypeName (optional if type is 'custom')",
      "example": "example_value",
      "dto": true
    }
  ]
}
```

### 👇 Prompt Template (for Cursor AI)

Copy and paste the following into Cursor. Replace the placeholders with your SQL `CREATE TABLE` statement (and parent entity) or a natural language description of your sub-entity and its fields:

<details>
<summary>Click to expand the prompt</summary>

```text
You are helping generate a JSON schema file for a codegen CLI that uses Hygen templates. Follow the instructions precisely and do not add extra explanations or UI formatting. Output a JSON file only in the structure described below.

---

### INPUT

I will provide one of the following:
- A raw SQL `CREATE TABLE` statement for a child entity and its parent name
- A natural language description of the child entity, its parent, and its fields

You will extract the schema and create a JSON object matching the exact structure below. Skip the fields id, created_at, and updated_at as they will be added automatically.

Ensure both `parent` and `name` are PascalCase (capitalize each word, no underscores/spaces). For example, tempuser becomes TempUser, product_order becomes ProductOrder.

Then save the file at the given location and remind me of the correct CLI command to run.

---

### OUTPUT FORMAT

{
  "parent": "ParentEntityName",
  "name": "ChildEntityName",
  "functionalities": ["create", "findAll", "findOne", "update", "delete"],
  "fields": [
    {
      "name": "field_name",
      "type": "int | float | double | decimal | boolean | varchar | text | uuid | timestamp | date | json | custom",
      "optional": true,
      "customType": "CustomTypeName (optional if type is 'custom')",
      "example": "example_value",
      "dto": true
    }
  ]
}

> Notes:
> - `parent`: PascalCase (e.g. `User`)
> - `name`: PascalCase (e.g. `Address`)
> - `fields[].name`: snake_case
> - `type`: must be one of the allowed values
> - `optional`: true if nullable or optional
> - `example`: valid example for the field
> - `dto`: true if it should be included in DTOs

---

### FILE OUTPUT

Once you've built the correct JSON, **save the file to this path relative to the project root**:

.hygen-entities-generator/<sub-entity-name-kebab-case>.json

Example:
.hygen-entities-generator/user-address.json

Samples for reference are available under `.hygen-sample-files/`, e.g. `sample-sub-entity-generator.json`.

---

### FINAL INSTRUCTION

Once the file is saved, tell me:

✅ Schema file generated successfully.

Now run:
DATA_FILE=.hygen-entities-generator/<sub-entity-name-kebab-case>.json npm run generate:sub-entity

---

### NOW GO AHEAD

Here is my input:

[Paste your SQL CREATE TABLE statement or natural language description here]
```

</details>

---

### ✅ After generating the file

Once the JSON file is created (e.g. `.hygen-entities-generator/user-address.json`), run:

```bash
DATA_FILE=.hygen-entities-generator/user-address.json npm run generate:sub-entity
```

This will generate the full sub-entity without further prompts.

---

Previous: [Resource generator](resource-entity.md)

Next: [Relationship generator](relationship.md)
