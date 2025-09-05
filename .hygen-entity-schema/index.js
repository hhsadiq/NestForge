// index.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const pluralize = require('pluralize');

const execAsync = util.promisify(exec);
const skippedEntities = [];
const relations = [];

// Convert PascalCase -> kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Build entity file path
function getEntityFilePath(name, parent) {
  const entityName = toKebabCase(name);
  if (!parent) {
    const folder = pluralize(entityName);
    return path.join('src', folder, 'domain', `${entityName}.ts`);
  } else {
    const parentFolder = pluralize(toKebabCase(parent));
    return path.join('src', parentFolder, 'domain', `${entityName}.ts`);
  }
}

(async () => {
  try {
    const filePath = path.join(__dirname, 'sample.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const processingFilePath = path.join(__dirname, 'process-entity.json');

    console.log('Generating modules using Hygen...');

    // 1️⃣ Parent modules
    for (const entity of jsonData) {
      if (entity.parent) continue;
      const entityPath = getEntityFilePath(entity.name, entity.parent);
      console.log('entityPath: ', entityPath);
      if (fs.existsSync(entityPath)) {
        skippedEntities.push(entity.name);
        console.log(`⏭️  Skipping ${entity.name}, already exists`);
        continue;
      }

      fs.writeFileSync(processingFilePath, JSON.stringify(entity));
      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:resource`;
      console.log(`🚀 Executing: ${command}`);
      relations.push(...entity.relations);
      await execAsync(command);
    }

    // 2️⃣ Sub-modules
    for (const entity of jsonData) {
      if (!entity.parent) continue;

      const entityPath = getEntityFilePath(entity.name, entity.parent);
      if (fs.existsSync(entityPath)) {
        skippedEntities.push(`${entity.parent} -> ${entity.name}`);
        console.log(
          `⏭️  Skipping ${entity.parent} -> ${entity.name} already exists`,
        );
        continue;
      }

      fs.writeFileSync(processingFilePath, JSON.stringify(entity));
      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:sub-entity`;
      console.log(`🚀 Executing: ${command}`);
      await execAsync(command);
      relations.push(...entity.relations);
    }

    for (const relation of relations) {
      fs.writeFileSync(processingFilePath, JSON.stringify(relation));
      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:relationship`;
      console.log(`🚀 Executing: ${command}`);
      await execAsync(command);
    }

    // Cleanup
    if (fs.existsSync(processingFilePath)) {
      fs.unlinkSync(processingFilePath);
    }

    console.log('✅ All modules generated successfully.');

    // 4️⃣ Show skipped entities
    if (skippedEntities.length > 0) {
      console.log('\n⚠️  Skipped entities (already existed):');
      skippedEntities.forEach((e) => console.log(` - ${e}`));
    }
  } catch (err) {
    console.error('❌ Error during generation:', err.message);
  }

  // Lint
  try {
    console.log('\n🔍 Running lint check (with auto-fix)...\n');
    const { stdout, stderr } = await execAsync(`npm run lint --fix`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Linting completed without critical errors.');
  } catch (lintErr) {
    console.error('⚠️ Linting finished with errors:\n');
    console.error(lintErr.stdout || lintErr.message);
    console.log('\nYou may need to fix some issues manually.');
  }
})();
