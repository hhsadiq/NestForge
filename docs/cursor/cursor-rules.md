# Cursor Rules

---

## Overview

This page explains the purpose of `Cursor Rules` for this project. Use it as a single place to capture and evolve the rules that guide how Cursor should operate (architecture constraints, generation workflows, naming, and any process conventions).

What to add here in the future:
- High-level rules that Cursor must follow (brief and actionable)
- Pointers to detailed docs elsewhere (architecture, Hygen, setup, etc.)
- Any project-specific conventions that affect Cursor usage

Keep this document concise; link out to details instead of duplicating them.

## Current Rules (brief)

- Follow `docs/` as the single source of truth.
- Enforce hexagonal boundaries: services ↔ domain; repositories ↔ persistence; use mappers for conversions.
- Type safety first: no `any` in public APIs; explicit types.
- Naming: DTOs/domain/controllers use camelCase; persistence (entities) use snake_case; map between them.
- Hygen: prefer JSON-driven runs with `DATA_FILE`; generate entities via `.hygen-entities-generator/entities-generator.json`.
- Custom schema: SQL at `.hygen/generate-migration/sql-script.sql`.
- Command execution from chat: use bash `bash -lc "source ~/.bashrc && npm run <script> -- <args>"`.
- Long/compound commands: first show options (e.g., scripts-index), then execute on user confirmation.
- After code level changes specially Hygen generation: run lint and build.
- Also added developer checklist and review process sections

---

Previous: [Documentation Standards](../documentation-standards.md)

Next: [Cursor Commands](cursor-commands.md)