# FAQ

---

## Can I mix relational and document persistence?

Yes. Generators are modular. Choose relational or document adapters per module.

## How do I re-run a generator safely?

Generators are idempotent where possible; they skip files that already exist. Review diffs after re-runs.

## Can I customize templates?

Yes. Edit files in `.hygen/*` to customize prompts and templates.

## Where do I put shared logic?

Use services and repository ports per module; create shared utilities under `src/utils` when appropriate.

---

Previous: [Version generator](version.md)

Next: [Working with database](../database.md)
