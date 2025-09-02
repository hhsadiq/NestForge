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
    console.log('parsed type=================>', typeof parsed);

    if (parsed && typeof parsed !== 'object') {
      console.error('❌ JSON must be an object of relation');
      process.exit(1);
    }

    // Collect all relations from all entities
    const result = {
      sourceEntityName: parsed.sourceEntityName,
      sourceEntityParent: parsed.sourceEntityParent || null,
      fieldName: parsed.fieldName,
      relationType: parsed.relationType,
      relationEntityParent: parsed.relationEntityParent || null,
      relationEntityName: parsed.relationEntityName,
      sourceColumnName: parsed.sourceColumnName,
      relationFieldName: parsed.relationFieldName || null,
    };

    console.log(
      '\n📦 Using entity relation definition from file:',
      dataFilePath,
    );

    console.log('result=============>', result);
    // Return all relations (Hygen will run for each relation in array)
    return result;
  } catch (err) {
    console.error(`❌ Error parsing JSON: ${err.message}`);
    process.exit(1);
  }
};
