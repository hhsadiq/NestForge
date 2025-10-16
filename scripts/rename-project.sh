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
KEBAB_NAME=$(echo "$NEW_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g')
PASCAL_NAME=$(echo "$NEW_NAME" | sed -E 's/(^|-)([a-zA-Z])/\U\2/g')

OLD_KEBAB=$(echo "$OLD_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g')
OLD_PASCAL=$(echo "$OLD_NAME" | sed -E 's/(^|-)([a-zA-Z])/\U\2/g')

echo "🔄 Replacing project references:"
echo "  $OLD_KEBAB -> $KEBAB_NAME (in JSON/YML)"
echo "  $OLD_PASCAL -> $PASCAL_NAME (in Markdown and env)"

# ✅ Cross-platform sed function
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS sed - use temp file approach to avoid backup files
  sed_replace() {
    local pattern="$1"
    shift
    for file in "$@"; do
      if [ -f "$file" ]; then
        sed "$pattern" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      fi
    done
  }
else
  # Linux/Windows sed
  sed_replace() {
    local pattern="$1"
    shift
    for file in "$@"; do
      if [ -f "$file" ]; then
        sed -i "$pattern" "$file"
      fi
    done
  }
fi

# ✅ Base dir = project root (one up from script's dir)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Replace in JSON files (kebab-case)
sed_replace "s/$OLD_KEBAB/$KEBAB_NAME/g" \
  "$PROJECT_ROOT/package.json" \
  "$PROJECT_ROOT/package-lock.json"

# Replace in Markdown files (PascalCase)
sed_replace "s/$OLD_PASCAL/$PASCAL_NAME/g" \
  "$PROJECT_ROOT/README.md" \
  "$PROJECT_ROOT/docs/readme.md"

# Replace in GitHub workflow (kebab-case only)
sed_replace "s/$OLD_KEBAB/$KEBAB_NAME/g" \
  "$PROJECT_ROOT/.github/workflows/develop.yml"

# ✅ Update APP_NAME in env-example-relational
ENV_FILE="$PROJECT_ROOT/env-example-relational"
if [ -f "$ENV_FILE" ]; then
  echo "🛠 Updating APP_NAME in env-example-relational..."
  sed_replace "s/^APP_NAME=.*/APP_NAME=\"$PASCAL_NAME\"/" "$ENV_FILE"
else
  echo "⚠️  env-example-relational file not found, skipping APP_NAME update."
fi

echo "✅ Project renamed to $NEW_NAME successfully!"
