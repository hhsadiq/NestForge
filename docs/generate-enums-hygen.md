.

# Enum generator

---

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
.hygen-eum-generator/<entity-name-kebab-case>.json
````

Example:

```text
.hygen-enum-generator/user-profile.json
```

---

### FINAL INSTRUCTION

Once the file is saved, tell me:

✅ Enums file generated successfully.

Now run:
DATA_FILE=.hygen-entities-generator/&lt;entity-name-kebab-case&gt;.json npm run generate:enum

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
DATA_FILE=.hygen-entities-generator/user-profile.json npm run generate:enum
````

This will generate the full resource without further prompts.

---