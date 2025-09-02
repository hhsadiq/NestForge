// index.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Resolve path to sample.json (same directory)
const filePath = path.join(__dirname, 'sample.json');

(async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    console.log('Generating modules using Hygen...');

    for (const entity of jsonData) {
      if (entity.parent) continue;
      fs.writeFileSync('process-entity.json', JSON.stringify(entity));

      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:resource`;
      console.log(`Executing: ${command}`);
      await execAsync(command);
    }

    for (const entity of jsonData) {
      if (!entity.parent) continue;
      fs.writeFileSync('process-entity.json', JSON.stringify(entity));

      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:sub-entity`;
      console.log(`Executing: ${command}`);
      await execAsync(command);
    }

    const relations = [];
    for (const data of jsonData) {
      relations.push(...data.relations);
    }

    for (const relation of relations) {
      fs.writeFileSync('process-entity.json', JSON.stringify(relation));
      const command = `npx cross-env DATA_FILE=.hygen-entity-schema/process-entity.json npm run generate:relationship`;
      console.log(`Executing: ${command}`);
      await execAsync(command);
    }

    // ✅ Cleanup temporary file
    if (fs.existsSync('process-entity.json')) {
      fs.unlinkSync('process-entity.json');
    }

    console.log('✅ All modules generated successfully.');
  } catch (err) {
    console.error('❌ Error during generation:', err.message);
  }

  // Run lint and handle gracefully
  try {
    console.log('\n🔍 Running lint check (with auto-fix)...\n');
    const { stdout, stderr } = await execAsync(`npm run lint -- --fix`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Linting completed without critical errors.');
  } catch (lintErr) {
    console.error('⚠️ Linting finished with errors:\n');
    console.error(lintErr.stdout || lintErr.message);
    console.log('\nYou may need to fix some issues manually.');
  }
})();
