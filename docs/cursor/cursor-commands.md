# Cursor Commands

---

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Available Commands](#available-commands)
  - [scripts-index](#scripts-index)
  - [lint-fix](#lint-fix)
  - [add-documentation](#add-documentation)

---

## Overview

This document describes the `.cursor/commands` folder, which contains curated commands to streamline common tasks inside Cursor. Each command is a guided checklist or index that follows our Documentation Standards and workspace rules.

## Available Commands

### scripts-index

- Purpose: Show a categorized index of all `package.json` scripts with descriptions, docs, prerequisites, expected outputs, and run the chosen script on request.
- File: `.cursor/commands/scripts-index.md`
- Usage:
  1. The command first displays all sections (full index)
  2. You tell which script to run (and args)
  3. It runs via bash and reports results

### lint-fix

- Purpose: Identify and fix lint issues (autofix) and verify via lint/build.
- File: `.cursor/commands/lint-fix.md`
- Usage:
  - Run lint with autofix and follow-up lint/build checks as instructed in the command.

### add-documentation

- Purpose: Add new or update existing documentation following standards.
- File: `.cursor/commands/add-documentation.md`
- Usage:
  - Follow the steps and checklist; reference [Documentation Standards](../documentation-standards.md).

---

Previous: [Cursor](index.md)

Next: [Hygen](../hygen/index.md)


