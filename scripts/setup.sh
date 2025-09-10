#!/bin/bash

set -e  # exit on error
set -o pipefail

echo "🚀 Starting project setup..."

# ---------------------------
# Step 1: Copy .env file
# ---------------------------
if [ ! -f ".env" ]; then
  echo "📄 Creating .env file from env-example-relational..."
  cp env-example-relational .env
else
  echo "ℹ️ .env file already exists. Skipping..."
fi

# ---------------------------
# Step 2: Install dependencies
# ---------------------------
echo "📦 Installing dependencies..."
npm install

# ---------------------------
# Step 3: Run migrations
# ---------------------------
echo "🗄️ Running migrations..."
npm run migration:run

# ---------------------------
# Step 4: Run seeders
# ---------------------------
echo "🗄️ Running seeders..."
npm run seed:run:relational

# ---------------------------
# Step 5: Rename project
# ---------------------------
read -p "👉 Enter new project name (kebab-case): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Project name cannot be empty!"
  exit 1
fi

echo "🔄 Renaming project to: $PROJECT_NAME"
npm run project:rename -- "$PROJECT_NAME"

# ---------------------------
# Step 6: Check entities-generator.json
# ---------------------------
while [ ! -s .hygen-entities-generator/entities-generator.json ]; do
  echo "❌ .hygen-entities-generator/entities-generator.json not found or is empty!"
  read -p "👉 Do you want to try again after creating/filling it? (yes/no): " ANSWER

  if [[ "$ANSWER" == "no" ]]; then
    echo "❌ Setup terminated. Please add and fill .hygen-entities-generator/entities-generator.json and rerun."
    exit 1
  fi

  if [[ "$ANSWER" != "yes" ]]; then
    echo "⚠️ Please answer 'yes' or 'no'."
  fi
done

echo "✅ entities-generator.json found and not empty!"


# ---------------------------
# Step 7: Generate entities
# ---------------------------
echo "⚡ Generating entities from schema..."
npm run generate:entities


# ---------------------------
# Step 8: Start project
# ---------------------------
echo "🚀 Creating Build..."
npm run build

# ---------------------------
# Step 9: Start project
# ---------------------------
echo "🚀 Starting project..."
npm run start

echo "🎉 Setup completed successfully!"
