// index.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const pluralize = require('pluralize');

const execAsync = util.promisify(exec);
const skippedEntities = [];
const relations = [];
const allEnums = [];

// Convert PascalCase -> kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Build entity file path
const pathRules = {
  entity: ({ moduleName }) => {
    const folder = pluralize(toKebabCase(moduleName));
    return path.join('src', folder, 'domain', `${toKebabCase(moduleName)}.ts`);
  },

  'sub-entity': ({ moduleName, parentModule }) => {
    if (!parentModule) throw new Error('Sub-entity requires a parentModule.');
    const parentFolder = pluralize(toKebabCase(parentModule));
    return path.join(
      'src',
      parentFolder,
      'domain',
      `${toKebabCase(moduleName)}.ts`,
    );
  },

  enum: ({ enumName, moduleName }) => {
    if (!enumName) throw new Error('Enum requires enumName.');
    const transformedEnumName = toKebabCase(enumName);

    const folder = pluralize(toKebabCase(moduleName));
    return path.join('src', folder, 'enums', `${transformedEnumName}.enum.ts`);
  },
};

(async () => {
  try {
    const filePath = path.join(__dirname, 'entities-generator.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    const processingFilePath = path.join(__dirname, 'process-entity.json');

    console.log('Generating modules using Hygen...');

    // 1️⃣ Parent modules
    for (const entity of jsonData) {
      if (entity.parent) continue;

      // Collect enums from this entity (even if entity is skipped)
      if (entity.enums) {
        console.log(
          `Found ${entity.enums.length} enums in entity ${entity.name}`,
        );
        allEnums.push(
          ...entity.enums.map((enumDef) => ({
            ...enumDef,
            moduleName: enumDef.entityParent
              ? enumDef.entityParent
              : enumDef.entityName,
          })),
        );
      }
      // Collect relations from this entity (even if entity is skipped)
      if (entity.relations) {
        relations.push(...entity.relations);
      }

      const entityPath = pathRules.entity({ moduleName: entity.name });
      console.log('entityPath: ', entityPath);
      if (fs.existsSync(entityPath)) {
        skippedEntities.push(entity.name);
        console.log(`⏭️  Skipping ${entity.name}, already exists`);
        continue;
      }

      fs.writeFileSync(processingFilePath, JSON.stringify(entity));
      const command = `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:resource`;
      console.log(`🚀 Executing: ${command}`);
      await execAsync(command);
    }

    // 2️⃣ Sub-modules
    for (const entity of jsonData) {
      if (!entity.parent) continue;
      // Collect enums from this entity (even if entity is skipped)
      if (entity.enums) {
        console.log(
          `Found ${entity.enums.length} enums in entity ${entity.name}`,
        );
        allEnums.push(
          ...entity.enums.map((enumDef) => ({
            ...enumDef,
            moduleName: enumDef.entityParent
              ? enumDef.entityParent
              : enumDef.entityName,
          })),
        );
      }
      // Collect relations from this entity (even if entity is skipped)
      if (entity.relations) {
        relations.push(...entity.relations);
      }

      const entityPath = pathRules['sub-entity']({
        moduleName: entity.name,
        parentModule: entity.parent,
      });

      if (fs.existsSync(entityPath)) {
        skippedEntities.push(`${entity.parent} -> ${entity.name}`);
        console.log(
          `⏭️  Skipping ${entity.parent} -> ${entity.name} already exists`,
        );
        continue;
      }

      fs.writeFileSync(processingFilePath, JSON.stringify(entity));
      const command = `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:sub-entity`;
      console.log(`🚀 Executing: ${command}`);
      await execAsync(command);
    }

    // Collect relation objects defined at the main (top-level)
    for (const relation of jsonData) {
      if (relation.relationType) {
        relations.push(...relation);
      }
    }

    // Collect enums objects defined at the main (top-level)
    for (const entity of jsonData) {
      if (!entity.enumName) continue;
      // Collect enums from the file
      console.log(`Found ${entity.enumName} enum`);
      allEnums.push({
        ...entity,
        moduleName: entity.entityParent
          ? entity.entityParent
          : entity.entityName,
      });
    }

    for (const relation of relations) {
      fs.writeFileSync(processingFilePath, JSON.stringify(relation));
      const command = `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:relationship`;
      console.log(`🚀 Executing: ${command}`);
      await execAsync(command);
    }

    // 4️⃣ Enums
    console.log('\n🔧 Generating enums...');
    console.log('All enums found:', allEnums.length);

    for (const enumDef of allEnums) {
      const { enumName, moduleName } = enumDef;
      const enumFilePath = pathRules.enum({
        moduleName,
        enumName,
      });
      if (fs.existsSync(enumFilePath)) {
        console.log(`⏭️  Skipping ${enumName}, already exists`);
        continue;
      }

      fs.writeFileSync(processingFilePath, JSON.stringify(enumDef));
      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:enum`;
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
