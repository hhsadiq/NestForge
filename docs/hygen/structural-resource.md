# Structural Resource generator

---

## For Generating Structural Resource

Use the command below to generate a structural resource.

```bash
npm run generate:structural-resource -- ResourceName
```

Example:

```bash
npm run generate:structural-resource -- Category
```

## Using a JSON schema file

The json object will have only two fields ( "name", "fields").

"fields" will always be an empty array.

e.g

{
"name": "Promotion",
"fields": []
}

Once you've built the correct JSON, **save the file to this path relative to the project root**:

```text
.hygen-entities-generator/<entity-name-kebab-case>.json
```

Example:

```text
.hygen-entities-generator/user-profile.json
```

**Sample file:**

- `.hygen-sample-files/sample-resource-entity-generator.json`

---

Now run:

```bash
DATA_FILE=.hygen-entities-generator/&lt;entity-name-kebab-case&gt;.json npm run generate:structural-resource
```

---

Previous: [Enum generator](enum.md)

Next: [Resource generator](resource-entity.md)
