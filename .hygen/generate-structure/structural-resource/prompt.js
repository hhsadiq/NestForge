const fs = require('fs');
const path = require('path');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  // If data file is provided and exists
  if (
    dataFilePath &&
    fs.existsSync(path.resolve(process.cwd(), dataFilePath))
  ) {
    try {
      const raw = fs.readFileSync(
        path.resolve(process.cwd(), dataFilePath),
        'utf8',
      );
      const parsed = JSON.parse(raw);

      // Process functionalities to handle findAllWithSearch preference

      const result = {
        isAddTestCase: false,
        functionalities: [],
        name: parsed.name,
        enums: [],
        fields: [],
      };

      console.log('\n📦 Using entity definition from file:', dataFilePath);
      return result;
    } catch (err) {
      console.error(`❌ Error processing JSON file: ${err}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log(
    'ℹ️  No valid entity definition file found, switching to interactive mode...',
  );
  try {
    // Process functionalities from interactive prompts as well
    return {
      isAddTestCase: false,
      functionalities: [],
      enums: [],
      fields: [],
    };
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};
