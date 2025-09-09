# Property generator

---

This generator allows adding a property to an existing relational entity.

## Usage

```bash
npm run add:property
```

Follow the interactive prompts to select the module and entity, then provide the property details.

## Inputs

- Entity and parent module selection
- Property name (snake_case)
- Property type (common SQL types)
- Optionality / nullability

## Output

- Adds the column to the relational entity file
- Updates DTOs and mappers as needed where supported

---

Previous: [Relationship generator](relationship.md)

Next: [Raw queries generator](raw-query.md)
