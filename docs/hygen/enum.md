# Enum generator

---

## For relational database (PostgreSQL + TypeORM)

Use the command below to generate a enum interactively (no JSON schema required):

```bash
npm run generate:enum
```

This command will trigger a terminal prompt with the following options:

1. **Enum Name**: Give your enum name
   Press Enter key to move to next step.

2. **Entity Name**: Give the entity name
   Press Enter key to move to next step.

3. **Parent Entity Name**: Give the parent entity name or press enter to skip if there's no parent
   Press Enter key to move to next step.

4. **Enum Values**: Give enum values comma separated
   Press Enter key to move to enum generation

---

## Using a JSON schema file (Cursor AI prompt template)

If you want to define your enum in advance using a structured schema, you can use **Cursor AI** to help generate the schema JSON.

You can then use this schema to generate the enum without any interactive prompts.

### Batch Generator Support

Enums can also be generated as part of the **batch generator** (see [Entities (Batch)](entities.md)) alongside resources, sub-entities, and relationships. The batch generator supports:

- **Top-level enums**: Define enums independently in the JSON array
- **Entity-level enums**: Define enums within entity or sub-entity objects
- **Field association**: Link enums to specific fields using `associatedEnumName`

### Field Association Feature

When defining fields in resources or sub-entities, you can associate an enum with a specific field by adding the `associatedEnumName` property:

```json
{
  "name": "teamLevel",
  "type": "int",
  "optional": false,
  "example": 1,
  "dto": true,
  "associatedEnumName": "TeamLevel"
}
```

This will automatically:

- Link the enum type in domain files
- Apply the enum type in entity files
- Include the enum type in DTO files
- Generate proper TypeScript enum imports

### 👇 Prompt Template (for Cursor AI)

Copy and paste the following into Cursor. Replace the placeholder with your enum description:

<details>
<summary>Click to expand the prompt</summary>

````text
You are helping generate a JSON schema file for a codegen CLI that uses Hygen templates. Follow the instructions precisely and do not add extra explanations or UI formatting. Output a JSON file only in the structure described below.

---

### INPUT

I will provide the following:

- Enum name
- Enum values
- Entity name
- Entity parent // can be null

Ensure the entity name is converted to PascalCase (capitalize the first letter of each word, no underscores or spaces). For example, tempuser becomes TempUser, product_order becomes ProductOrder.

Then save the file at the given location and remind me of the correct CLI command to run.

---

### OUTPUT FORMAT

{
    "entityName": "User",
    "entityParent": null,
    "enumName": "UserRole",
    "enumValues": ["ADMIN", "USER"]
}

> Notes:
>
> - `entityName`: PascalCase (e.g. `User`, `ProductOrder`)
> - `entityParent`: PascalCase or null
> - `enumName`: PascalCase enum name
> - `enumValues`: Array of string values in UPPER_CASE

---

### FILE OUTPUT

Once you've built the correct JSON, **save the file to this path relative to the project root**:

```text
.hygen-entities-generator/<entity-name-kebab-case>.json
```

Example:

```text
.hygen-entities-generator/user-profile.json
```

**Sample files:**

- `.hygen-sample-files/sample-enum-generator.json` - Single enum example
- `.hygen-sample-files/sample-entities-generator.json` - Multiple enums within full schema

---

### FINAL INSTRUCTION

Once the file is saved, tell me:

✅ Enum file generated successfully.

Now run:
DATA_FILE=.hygen-entities-generator/&lt;entity-name-kebab-case&gt;.json npm run generate:enum

---

### NOW GO AHEAD

Here is my input:

[Paste your enum description here]

````

</details>

---

### ✅ After generating the file

Once the JSON file is created (e.g. `.hygen-entities-generator/user-profile.json`), run:

```bash
DATA_FILE=.hygen-entities-generator/user-profile.json npm run generate:enum
```

This will generate the enum without further prompts.

---

Previous: [Version generator](version.md)

Next: [FAQ](faq.md)
