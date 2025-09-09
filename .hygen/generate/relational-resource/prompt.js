const fs = require('fs');
const path = require('path');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  // If data file is provided and exists
  if (dataFilePath && fs.existsSync(path.resolve(process.cwd(), dataFilePath))) {
    try {
      const raw = fs.readFileSync(path.resolve(process.cwd(), dataFilePath), 'utf8');
      const parsed = JSON.parse(raw);

      const result = {
        isAddTestCase: parsed.isAddTestCase ?? true,
        functionalities: parsed.functionalities ?? ['create', 'findAll', 'findOne', 'update', 'delete'],
        name: parsed.name,
        fields: Array.isArray(parsed.fields)
          ? parsed.fields.map(field => ({
              name: field.name,
              type: field.type,
              optional: field.optional,
              customType: field.customType,
              example: field.example,
              includeInDTO: field.dto,
              associatedEnumName: field.associatedEnumName
            }))
          : []
      };

      console.log('\n📦 Using entity definition from file:', dataFilePath);
      return result;
    } catch (err) {
      console.error(`❌ Error processing JSON file: ${err}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log('ℹ️  No valid entity definition file found, switching to interactive mode...');
  try {
    return await prompter.prompt([
      {
        type: 'confirm',
        name: 'isAddTestCase',
        message: 'Do you want to add test cases and mock data?',
        initial: true,
      },
      {
        type: 'multiselect',
        name: 'functionalities',
        message: 'Select the functionalities you want to include:',
        choices: [
          { name: 'create', value: 'create' },
          { name: 'findAll', value: 'findAll' },
          { name: 'findOne', value: 'findOne' },
          { name: 'update', value: 'update' },
          { name: 'delete', value: 'delete' },
        ],
      },
    ]);
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};