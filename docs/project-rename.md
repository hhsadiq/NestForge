# Project Rename

---

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Usage](#usage)
  - [Parameters](#parameters)
  - [Examples](#examples)
- [What it does](#what-it-does)
- [File modifications](#file-modifications)
- [Examples](#examples-1)
  - [Renaming to "my-awesome-app"](#renaming-to-my-awesome-app)
  - [Renaming from custom name](#renaming-from-custom-name)

---

## Overview

The project rename script allows you to rename your NestJS project from the default "NestForge" to any custom name. This script automatically updates project references in key files while maintaining proper naming conventions.

## Usage

```bash
npm run project:rename -- <new-project-name> [old-project-name]
```

### Parameters

- `<new-project-name>`: The new project name in kebab-case format (required)
- `[old-project-name]`: The current project name (optional, defaults to "NestForge")

### Examples

```bash
# Rename from NestForge to my-awesome-app
npm run project:rename -- my-awesome-app

# Rename from old-project to new-project
npm run project:rename -- new-project old-project
```

## What it does

The script performs the following operations:

1. **Validates input**: Ensures the new project name follows kebab-case format
2. **Converts naming conventions**:
   - kebab-case for JSON files (e.g., `my-awesome-app`)
   - PascalCase for Markdown files (e.g., `MyAwesomeApp`)
3. **Updates files**: Modifies package.json, package-lock.json, README.md, and docs/readme.md
4. **Cleans up**: Removes temporary backup files

## File modifications

The script updates references in these files:

- `package.json` - Project name and references
- `package-lock.json` - Package references
- `README.md` - Project title and references
- `docs/readme.md` - Documentation title and references

## Examples

### Renaming to "my-awesome-app"

```bash
npm run project:rename -- my-awesome-app
```

This will:

- Convert "my-awesome-app" to "MyAwesomeApp" for Markdown files
- Update all project references in package files
- Update documentation titles

### Renaming from custom name

```bash
npm run project:rename -- new-project-name old-project-name
```

This allows you to rename from any existing project name to a new one.

---

Previous: [Docker](docker.md)

Next: [Setup Script](setup-script.md)
