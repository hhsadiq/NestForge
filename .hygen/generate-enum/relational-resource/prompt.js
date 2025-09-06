const fs = require('fs');
const path = require('path');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  if (!dataFilePath) {
    console.error('❌ No data file provided. Use --dataFile=path/to/file.json');
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), dataFilePath);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Data file not found: ${absPath}`);
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(absPath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.error('❌ JSON must be an array of entities');
      process.exit(1);
    }

    // Extract only entity-level enums
    const allEnums = [];
    
    for (const entity of parsed) {
      if (entity.enums && Array.isArray(entity.enums)) {
        for (const enumDef of entity.enums) {
          allEnums.push({
            name: enumDef.name,
            values: enumDef.values,
            entityName: entity.name,
            entityParent: entity.parent,
            moduleName: entity.parent ? 
              h.inflection.transform(entity.parent, ['pluralize', 'underscore', 'dasherize']) : 
              h.inflection.transform(entity.name, ['pluralize', 'underscore', 'dasherize'])
          });
        }
      }
    }

    console.log(`\n📦 Found ${allEnums.length} enums to generate:`);
    allEnums.forEach(e => console.log(` - ${e.name} (in ${e.moduleName} module)`));

    return allEnums;
  } catch (err) {
    console.error(`❌ Error parsing JSON: ${err.message}`);
    process.exit(1);
  }
};
