#!/bin/bash

NEW_NAME="$1"
OLD_NAME="$2"

if [ -z "$NEW_NAME" ]; then
  echo "input must be in kebab-case (e.g., my-cool-project)"
  echo "Usage: $0 <new-project-name> <old-project-name>"
  echo "Example: $0 my-cool-project my-old-project"
  exit 1
fi

# ✅ Validate project name format (single word or kebab-case only)
if ! [[ "$NEW_NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Error: Project name must be in kebab-case (e.g., my-cool-project)"
  exit 1
fi

# If no old name provided, fallback to NestForge
if [ -z "$OLD_NAME" ]; then
  OLD_NAME="NestForge"
fi

# Derive lowercase/kebab from names
KEBAB_NAME=$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]' | sed -r 's/[^a-z0-9]+/-/g')
PASCAL_NAME=$(echo "$NEW_NAME" | sed -r 's/(^|-)([a-zA-Z])/\U\2/g')

OLD_KEBAB=$(echo "$OLD_NAME" | tr '[:upper:]' '[:lower:]' | sed -r 's/[^a-z0-9]+/-/g')
OLD_PASCAL=$(echo "$OLD_NAME" | sed -r 's/(^|-)([a-zA-Z])/\U\2/g')

echo "Replacing:"
echo "  $OLD_KEBAB -> $KEBAB_NAME (in JSON/YML)"
echo "  $OLD_PASCAL -> $PASCAL_NAME (in Markdown)"

# ✅ Base dir = project root (one up from script’s dir)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Replace in JSON files (kebab-case)
sed -i.mybak "s/$OLD_KEBAB/$KEBAB_NAME/g" \
  "$PROJECT_ROOT/package.json" \
  "$PROJECT_ROOT/package-lock.json"

# Replace in Markdown files (PascalCase)
sed -i.mybak "s/$OLD_PASCAL/$PASCAL_NAME/g" \
  "$PROJECT_ROOT/README.md" \
  "$PROJECT_ROOT/docs/readme.md"

# Replace in GitHub workflow (kebab-case only)
sed -i.mybak "s/$OLD_KEBAB/$KEBAB_NAME/g" \
  "$PROJECT_ROOT/.github/workflows/develop.yml"

# Cleanup backups
rm -f "$PROJECT_ROOT"/*.mybak "$PROJECT_ROOT/docs"/*.mybak "$PROJECT_ROOT/.github/workflows"/*.mybak

echo "Project renamed to $NEW_NAME successfully!"
