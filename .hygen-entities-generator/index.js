// index.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const pluralize = require('pluralize');
const readline = require('readline');

const execAsync = util.promisify(exec);
const processingFilePath = path.join(__dirname, 'process-entity.json');
const inputFilePath = path.join(__dirname, 'entities-generator.json');

// Skipped logs
const skipped = { entities: [], subEntities: [], relations: [], enums: [] };

// Convert PascalCase -> kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Path rules
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

// Run hygen command with temp JSON
async function runHygen(command, payload, type, name) {
  fs.writeFileSync(processingFilePath, JSON.stringify(payload, null, 2));
  console.log(`\n🚀 [${type}] Starting: ${name}`);
  try {
    await execAsync(command);
    console.log(`🎉 [${type}] Done: ${name}`);
  } catch (err) {
    console.error(`❌ [${type}] Failed: ${name}`);
    throw err;
  }
}

// Collect entities, sub-entities, relations, enums
function collectDefinitions(jsonData) {
  const entities = [];
  const subEntities = [];
  const relations = [];
  const enums = [];

  for (const item of jsonData) {
    if (!item.parent && !item.relationType && !item.enumName) {
      entities.push(item);
    }
    if (item.parent) {
      subEntities.push(item);
    }
    if (item.relations && Array.isArray(item.relations)) {
      relations.push(...item.relations);
    }
    if (item.enums && Array.isArray(item.enums)) {
      enums.push(...item.enums);
    }
    if (item.enumName) {
      enums.push(item);
    }
    if (item.relationType) {
      relations.push(item);
    }
  }

  return { entities, subEntities, relations, enums };
}

// ✅ Interactive check if entities-generator.json exists and not empty
async function ensureEntitiesFile() {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function checkFile() {
      if (fs.existsSync(inputFilePath) && fs.statSync(inputFilePath).size > 0) {
        console.log('✅ entities-generator.json found and not empty!');
        rl.close();
        resolve();
      } else {
        console.error('❌ entities-generator.json not found or is empty!');
        rl.question(
          '👉 Do you want to try again after creating/filling it? (yes/no): ',
          (answer) => {
            if (answer.toLowerCase() === 'no') {
              console.error(
                '❌ Setup terminated. Please add and fill entities-generator.json and rerun.',
              );
              rl.close();
              process.exit(1);
            } else if (answer.toLowerCase() === 'yes') {
              checkFile();
            } else {
              console.log("⚠️ Please answer 'yes' or 'no'.");
              checkFile();
            }
          },
        );
      }
    }

    checkFile();
  });
}

(async () => {
  try {
    const filePath = path.join(__dirname, 'entities-generator.json');
    await ensureEntitiesFile();

    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    console.log(
      '📦 Collecting entities, sub-entities, relations, and enums...',
    );
    const { entities, subEntities, relations, enums } =
      collectDefinitions(jsonData);

    // 1️⃣ Entities
    if (entities.length > 0) {
      console.log('\n======================');
      console.log('📂 Generating Entities');
      console.log('======================');
    }
    for (const entity of entities) {
      const entityPath = pathRules.entity({ moduleName: entity.name });
      if (fs.existsSync(entityPath)) {
        skipped.entities.push(`${entity.name} (already exists)`);
        continue;
      }
      await runHygen(
        `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:resource`,
        entity,
        'Entity',
        entity.name,
      );
    }

    // 2️⃣ Sub-Entities
    if (subEntities.length > 0) {
      console.log('\n==========================');
      console.log('📂 Generating Sub-Entities');
      console.log('==========================');
    }
    for (const subEntity of subEntities) {
      const parentPath = pathRules.entity({ moduleName: subEntity.parent });
      if (!fs.existsSync(parentPath)) {
        skipped.subEntities.push(
          `${subEntity.name} → parent ${subEntity.parent} not found`,
        );
        continue;
      }

      const subPath = pathRules['sub-entity']({
        moduleName: subEntity.name,
        parentModule: subEntity.parent,
      });
      if (fs.existsSync(subPath)) {
        skipped.subEntities.push(
          `${subEntity.parent} → ${subEntity.name} (already exists)`,
        );
        continue;
      }

      await runHygen(
        `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:sub-entity`,
        subEntity,
        'Sub-Entity',
        `${subEntity.name} child of ${subEntity.parent}`,
      );
    }

    // 3️⃣ Relations
    if (relations.length > 0) {
      console.log('\n======================');
      console.log('📂 Generating Relations');
      console.log('======================');
    }
    for (const relation of relations) {
      const {
        sourceEntityName,
        sourceEntityParent,
        relationEntityName,
        relationEntityParent,
      } = relation;

      const sourcePath = sourceEntityParent
        ? pathRules['sub-entity']({
            moduleName: sourceEntityName,
            parentModule: sourceEntityParent,
          })
        : pathRules.entity({ moduleName: sourceEntityName });

      if (!fs.existsSync(sourcePath)) {
        skipped.relations.push(
          `${sourceEntityName} → ${relationEntityName} (sourceEntity ${sourceEntityName} not found)`,
        );
        continue;
      }

      const relationPath = relationEntityParent
        ? pathRules['sub-entity']({
            moduleName: relationEntityName,
            parentModule: relationEntityParent,
          })
        : pathRules.entity({ moduleName: relationEntityName });

      if (!fs.existsSync(relationPath)) {
        skipped.relations.push(
          `${sourceEntityName} → ${relationEntityName} (relationEntity ${relationEntityName} not found)`,
        );
        continue;
      }

      await runHygen(
        `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:relationship`,
        relation,
        'Relation',
        `${sourceEntityName} → ${relationEntityName}`,
      );
    }

    // 4️⃣ Enums
    if (enums.length > 0) {
      console.log('\n==================');
      console.log('📂 Generating Enums');
      console.log('==================');
    }
    for (const enumDef of enums) {
      const { enumName, entityName, entityParent } = enumDef;

      const parentPath = entityParent
        ? pathRules['sub-entity']({
            moduleName: entityName,
            parentModule: entityParent,
          })
        : pathRules.entity({ moduleName: entityName });

      if (!fs.existsSync(parentPath)) {
        skipped.enums.push(
          `${enumName} (parent module ${entityParent || entityName} not found)`,
        );
        continue;
      }

      const enumPath = pathRules.enum({
        moduleName: entityParent || entityName,
        enumName,
      });
      if (fs.existsSync(enumPath)) {
        skipped.enums.push(`${enumName} (already exists)`);
        continue;
      }

      await runHygen(
        `npx cross-env DATA_FILE=.hygen-entities-generator/process-entity.json npm run generate:enum`,
        enumDef,
        'Enum',
        `${enumName} of ${entityParent || entityName}`,
      );
    }

    // Cleanup temp file
    if (fs.existsSync(processingFilePath)) {
      fs.unlinkSync(processingFilePath);
    }

    console.log(
      '\n✅ Generation process completed (see skipped summary below if any).',
    );

    // Print skipped logs
    if (
      skipped.entities.length ||
      skipped.subEntities.length ||
      skipped.relations.length ||
      skipped.enums.length
    ) {
      console.log('\n⚠️ Skipped Summary:');
      if (skipped.entities.length) {
        console.log('\n⚠️ Skipped Entities:');
        skipped.entities.forEach((e) => console.log(` - ${e}`));
      }
      if (skipped.subEntities.length) {
        console.log('\n⚠️ Skipped Sub-Entities:');
        skipped.subEntities.forEach((e) => console.log(` - ${e}`));
      }
      if (skipped.relations.length) {
        console.log('\n⚠️ Skipped Relations:');
        skipped.relations.forEach((e) => console.log(` - ${e}`));
      }
      if (skipped.enums.length) {
        console.log('\n⚠️ Skipped Enums:');
        skipped.enums.forEach((e) => console.log(` - ${e}`));
      }
    }
  } catch (err) {
    console.error('❌ Error during generation:', err.message);
  }

  // Lint
  try {
    console.log('\n🔍 Running lint check (with auto-fix)...\n');
    const { stdout, stderr } = await execAsync(`npm run lint`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Linting completed without critical errors.');
  } catch (lintErr) {
    console.error('⚠️ Linting finished with errors:\n');
    console.error(lintErr.stdout || lintErr.message);
    console.log('\nYou may need to fix some issues manually.');
  }
})();
