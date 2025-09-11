# Entities (Batch Generator)

This document explains how the batch generator at `.hygen-entities-generator/index.js` orchestrates multiple Hygen commands to generate resources, sub-entities, relationships, and enums from a single JSON file.

## What this script does

- **Consumes one JSON file** that can describe multiple entities, sub-entities, relationships, and/or enums — provided independently or in combination.
- **Generates parent resources**, optional **sub-entities**, **relationships**, and **enums** in the correct order.
- **Supports partial input** — you can provide only parent entities, only sub-entities, only relationships, only enums, or any combination of them.
- **Skips** generation for items that already exist (idempotent runs).
- **Cleans up** temporary files and optionally **runs lint** with `--fix` after generation.

## Input JSON shape (high level)

The script expects an array of JSON objects.  
Each object can define a **parent entity**, a **sub-entity**, a **relation**, or an **enum** at the top level.  
You can provide one type, multiple types, or mix them in the same array.

For entities and sub-entities, an object can have:

- `name`: PascalCase entity name, e.g. `User`
- `parent`: optional parent name if this is a sub-entity, otherwise `null`
- `isAddTestCase`, `functionalities`, `fields`: passed through to the underlying generators
- `associatedEnumName`: PascalCase enum name to associate with any of the field in the `fields` array
- `relations`: optional array describing relationships originating from this entity
- `enums`: optional array describing enums associated with this entity

**⚠️ Critical:** JSON objects must be inside an array, even for a single item.

For relationships, each relation entry includes:

- `sourceEntityName`, `sourceEntityParent`
- `fieldName`, `relationType` (e.g. `ManyToOne`, `OneToMany`, `OneToOne`, `ManyToMany`)
- `relationEntityName`, `relationEntityParent`
- `sourceColumnName` (FK column when applicable)
- `relationFieldName` (required for specific cases like `OneToMany`)

For enums, each enum entry includes:

- `entityName`: PascalCase entity name
- `entityParent`: optional parent name if this is a sub-entity enum, otherwise `null`
- `enumName`: PascalCase enum name
- `enumValues`: array of string values in UPPER_CASE

See the sample files for examples:

- `.hygen-sample-files/sample-entities-generator.json` - Full example with all entities, sub-entities, relationships, and enums
- `.hygen-sample-files/sample-resource-entity-generator.json` - Single resource entity example
- `.hygen-sample-files/sample-sub-entity-generator.json` - Sub-entity example
- `.hygen-sample-files/sample-relationship-generator.json` - Relationship example
- `.hygen-sample-files/sample-enum-generator.json` - Enum example

## Flexible Input Capabilities

One of the key strengths of this batch generator is its ability to handle **partial or mixed input sets**.  
You are not limited to always providing a "full set" of entities — the script can generate **only what you supply**, whether that is:

- **Only parent entities**  
  Provide an array with just top-level resource entities, and the script will generate them while skipping sub-entities, relationships, or enums.

- **Only sub-entities**  
   Provide an array with sub-entities (with their `parent` defined), and the script will generate them without requiring parent, relationship, or enum definitions in the same file.

- **Only relationships**  
  Provide an array that contains only `relations` objects, and the script will generate those relationships between already-existing entities.  
  This is particularly useful if you want to **add new relationships across multiple entities in a single run** without regenerating the entities themselves.

- **Only enums**  
  Provide an array that contains only enum objects, and the script will generate those enums independently.  
  This is useful for creating standalone enums or adding enums to existing entities.

- **Combinations**  
   You can freely mix parent entities, sub-entities, relationships, and enums in the same input file.  
   The generator will:
  1. Create any parent entities.
  2. Create sub-entities under their respective parents.
  3. Process all provided relationships.
  4. Generate all provided enums.

### Why this matters

This flexibility means you can:

- Incrementally evolve your schema over time.
- Safely run the generator with only the parts you want to add or update.
- Avoid touching existing code while introducing new relationships or enums.
- Create standalone enums that can be reused across multiple entities.

In short: **the generator works whether you give it a full schema or just the pieces you need to add.**

## Execution flow

The generator processes input in the correct order, regardless of whether you provide only parents, only sub-entities, only relationships, only enums, or any mix of them.

1. **Parent resources (no `parent`):**
   - For each top-level entity (no `parent`), the script checks if the domain file already exists.
   - If not present, it writes a transient `process-entity.json` and runs: - `generate:resource` with `DATA_FILE=.hygen-entities-generator/process-entity.json`.
   - It collects any `relations` and `enums` from the entity for later.

2. **Sub-entities (with `parent`):**
   - For each entity with a `parent`, the script checks for existence.
   - If not present, it writes `process-entity.json` and runs: - `generate:sub-entity` with `DATA_FILE=.hygen-entities-generator/process-entity.json`.
   - It collects any `relations` and `enums` from the sub-entity for later.

3. **Relationships (collected from entities, sub-entities, and top-level):**
   - The script gathers all `relations`:
     - from parent entities
     - from sub-entities
     - from the top-level of the JSON array (if relationships are provided independently)
   - For each relation, it writes `process-entity.json` and runs:
     - `generate:relationship` with `DATA_FILE=.hygen-entities-generator/process-entity.json`.

4. **Enums (collected from entities, sub-entities, and top-level):**

- The script gathers all `enums`:
  - from parent entities
  - from sub-entities
  - from the top-level of the JSON array (if enums are provided independently)
- For each enum, it writes `process-entity.json` and runs:
  - `generate:enum` with `DATA_FILE=.hygen-entities-generator/process-entity.json`.

5. **Cleanup & linting:**

- Removes the transient `process-entity.json` if it exists.
- Runs `npm run lint -- --fix` to auto-fix formatting and lint issues where possible.

## Commands referenced

- `generate:resource` — see [Resource generator](resource-entity.md).
- `generate:sub-entity` — see [Sub-entity generator](sub-entity.md).
- `generate:relationship` — see [Relationship generator](relationship.md).
- `generate:enum` — see [Enum generator](enum.md).

These documents describe the inputs each generator accepts (via JSON or interactive prompts) and what files they create.

## How the script decides what to skip

The script derives an expected domain file path from the entity `name` (PascalCase → kebab/plural as needed) and optional `parent`. If the file already exists, it logs a skip and moves on. This keeps repeated runs safe and fast.

## How to run

From the project root:

```bash
npm run generate:entities
```

---

Previous: [Hygen Index](index.md)

Next: [Enum generator](enum.md)
