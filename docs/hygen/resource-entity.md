# Resource generator

---

## For relational database (PostgreSQL + TypeORM)

Use the command below to generate a resource interactively (no JSON schema required):

```bash
npm run generate:resource -- ResourceName
```

Example:

```bash
npm run generate:resource -- Category
```

This command will trigger a terminal prompt with the following options:

1. **Functionality Selection**: You can choose which functionalities (CRUD operations) you want to generate for the resource. The available functionalities are:
   - Create
   - Find All
   - Find One
   - Update
   - Delete

   Use the arrow keys to navigate and the spacebar to select multiple options. Press Enter key to move to next step.

2. **Add Test Case**: You will be prompted with a confirmation question:
   - "Do you want to add test cases and mock data?"

   If you choose "Yes", test case structure and mock data for the resource will also be generated along with the selected functionalities.

---

## Using a JSON schema file (Cursor AI prompt template)

If you want to define your entity in advance using a structured schema, you can use **Cursor AI** to help generate the schema JSON.

You can then use this schema to generate the full resource without any interactive prompts.

**⚠️ Important:** This command can take only one JSON object at a time.

### 👇 Prompt Template (for Cursor AI)

Copy and paste the following into Cursor. Replace the placeholder with your SQL `CREATE TABLE` statement or a natural language description of your entity:

<details>
<summary>Click to expand the prompt</summary>

````text
You are helping generate a JSON schema file for a codegen CLI that uses Hygen templates. Follow the instructions precisely and do not add extra explanations or UI formatting. Output a JSON file only in the structure described below.

---

### INPUT

I will provide one of the following:
- A raw SQL `CREATE TABLE` statement
- A natural language description of a data entity and its fields

You will extract the schema and create a JSON object matching the exact structure below. Skip the fields id, created_at, and updated_at as they will be added automatically.

Ensure the entity name is converted to PascalCase (capitalize the first letter of each word, no underscores or spaces). For example, tempuser becomes TempUser, product_order becomes ProductOrder.

Then save the file at the given location and remind me of the correct CLI command to run.

---

### OUTPUT FORMAT

{
  "name": "EntityName",
  "isAddTestCase": true,
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
> - `name`: PascalCase (e.g. `User`, `ProductOrder`)
> - `fields[].name`: snake_case
> - `type`: must be one of the allowed values
> - `optional`: true if nullable or optional
> - `example`: valid example for the field
> - `dto`: true if it should be included in DTOs

---

### FILE OUTPUT

Once you've built the correct JSON, **save the file to this path relative to the project root**:

```text
.hygen-entities-generator/<entity-name-kebab-case>.json
````

Example:

```text
.hygen-entities-generator/user-profile.json
```

**Sample file:**

- `.hygen-sample-files/sample-resource-entity-generator.json`

---

### FINAL INSTRUCTION

Once the file is saved, tell me:

✅ Schema file generated successfully.

Now run:
DATA_FILE=.hygen-entities-generator/&lt;entity-name-kebab-case&gt;.json npm run generate:resource

---

### NOW GO AHEAD

Here is my input:

[Paste your SQL CREATE TABLE statement or natural language description here]

````

</details>

---

### ✅ After generating the file

Once the JSON file is created (e.g. `.hygen-entities-generator/user-profile.json`), run:

```bash
DATA_FILE=.hygen-entities-generator/user-profile.json npm run generate:resource
````

This will generate the full resource without further prompts.

---

Previous: [Enum generator](enum.md)

Next: [Sub-entity generator](sub-entity.md)
