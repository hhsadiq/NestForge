# 📌 Prompt: Generate JSON Schemas from SQL (Hygen Codegen)

**Goal:** Convert SQL `CREATE TABLE` statements into a single, **valid JSON array** (one object per table) suitable for Hygen codegen. Also support the batch-generator style _combination JSON object_ where entities and sub-entities may contain `relations` and `enums` inline.

---

## 1) Input

- SQL file containing one or more `CREATE TABLE` statements.
- Optional line comments immediately **above** a table:

  ```sql
  -- name: CustomEntity
  -- parent: ParentName    # use `-` for null
  CREATE TABLE ...
  ```

- If no comment: `name` = table name → _PascalCase_; `parent` = `null`.
- The output JSON must be a single array of objects. Each object may represent an entity or sub-entity (with optional `relations` and `enums`)

> **Note**: Please do not include these entities in the generated JSON even if they are part of your SQL schema as they are already created in the base project and are in working condition: `user`, `user_device`, `role`, `status`, `file`, `session`, `biometric_challenge`.

---

## 2) Combined JSON object (preferred shape)

Each array element for an entity **must** include these keys (order matters for entity objects):

1. `name` (PascalCase)
2. `parent` (ParentName or `null`)
3. `isAddTestCase` (boolean)
4. `functionalities` (array)
5. `fields` (array)
6. `relations` (array)
7. `enums` (array)

This supports the batch generator's combined input: entities and sub-entities may include `relations` and `enums` inline, and the generator will collect them later.

---

## 3) Field object (exact shape)

```json
{
  "name": "snake_case_column",
  "type": "int|float|double|decimal|boolean|varchar|text|uuid|timestamp|date|json|custom",
  "customType": "",
  "optional": true,
  "example": <type-matching-value>,
  "dto": true,
  "associatedEnumName": <EnumName>,
}
```

- Exclude columns: `id`, `created_at`, `updated_at`.
- `customType` = `""` unless `type` is `custom`.
- `optional` reflects nullability; `dto` = `true`.
- `associatedEnumName` is optional, add in case you want to associate enum to a field.

---

## 4) Relations — full rules & exact object shape

- `relations` be provided inline inside an entity object as an array.
- Always include one relation object **per FOREIGN KEY**.
- `relationType`:
  - `OneToOne` , `ManyToOne` , `OneToMany` Should be decided based on the defined constraints in the respective table query.
  - Whenever you define a `OneToMany` relation on an entity, also add the reciprocal `ManyToOne` relation to the referenced entity's relations array (i.e., the entity on the `many` side) so both sides of the relationship are represented.
- Ensure the column used to define the foreign key constraint in SQL (used to build a relation object) is also included in the fields array as an int type field.

Exact relation object shape:

```json
{
  "sourceEntityName": "PascalCaseSourceEntity",
  "sourceEntityParent": "ParentName or null",
  "fieldName": "camelCaseRelationFieldInSource",
  "relationType": "OneToOne | ManyToOne",
  "relationEntityParent": "ParentName or null",
  "relationEntityName": "PascalCaseTargetEntity",
  "sourceColumnName": "exact_fk_column_name",
  "relationFieldName": null
}
```

1. Source Entity Name: entity where the relation is added (required)
2. Source Entity Parent: parent module of the source entity (optional)
3. Related Entity Name: target entity to relate to (required)
4. Related Entity Parent: parent module of the related entity (optional)
5. Relation Type: one of `ManyToOne`, `OneToMany`, `OneToOne` (required)
6. Related Entity Field Name: only required for `OneToMany`
7. Field Name on Source: the property name to add on the source entity (required)
8. Source Column Name: foreign key column on source (required for all except `OneToMany`)

---

## 5) Enums — full rules & exact object shape

- Enums can be provided **inline** inside an entity object under `enums` array.
- Enum names must be **PascalCase**; values must be UPPER_CASE strings.
- The generator expects `enumValues` as an array of strings.

Exact enum object shape (inline or standalone):

```json
{
  "entityName": "PascalCaseEntityName",
  "entityParent": "ParentName or null",
  "enumName": "PascalCaseEnumName",
  "enumValues": ["VALUE_ONE", "VALUE_TWO"]
}
```

- When inline, `entityName` should match the parent entity's `name`.

---

## 6) SQL → JSON type mapping (lowercase SQL matching)

- `int`, `smallint`, `bigint` → `int` (example: `123`)
- `float` → `float` (`12.34`)
- `double`, `double precision` → `double` (`12345.6789`)
- `decimal`, `numeric` → `decimal` (`"199.99"`)
- `boolean`, `bool` → `boolean` (`true`)
- `varchar`, `char`, `character varying` → `varchar` (`"example_string"`)
- `text` → `text` (`"longer example text"`)
- `uuid` → `uuid` (`"550e8400-e29b-41d4-a716-446655440000"`)
- `timestamp`, `timestamptz` → `timestamp` (`"2025-01-15T13:45:30Z"`)
- `date` → `date` (`"2025-01-15"`)
- `json`, `jsonb` → `json` (`{"key":"value"}`)
- anything else → `custom` (set `customType` to exact SQL type lowercased)

---

## 7) Combined-object processing order (informational)

When the batch generator consumes a combined JSON file it follows this order (this prompt should ensure the JSON contains inline `relations` and `enums` where appropriate):

1. Create parent resources (entities without `parent`).
2. Create sub-entities (entities with `parent`).
3. Process all `relations` collected from entities and sub-entities.
4. Generate all `enums` collected from entities and sub-entities.

> Note: You do not need to provide execution commands — just ensure the combined JSON objects include `relations` and `enums` arrays as described.

---

## 8) Quick rules & validation

- `Unique Names`: No duplicate entity or field names.
- `optional` must reflect column nullability.
- `example` must strictly match the declared `type`.
- `fields`, `relations`, and `enums` keys must always exist on entity objects (use `[]` when empty).
- Output must be a **single JSON array only** (no extra text), valid JSON (no comments, no trailing commas).
- Validate the `entity`, `sub-entity`, `relation`, `enum` object keys as each explained above.
- Final generated entities must match input schema.

---

Previous: [Architecture](../architecture.md)

Next: [Entities (Batch) generator](entities.md)
