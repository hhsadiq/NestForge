const promptFn = require('./prompt');

module.exports = {
  prompt: async ({ prompter, args }) => {  // Note the destructured parameters
    const result = await promptFn(args, prompter);  // Pass prompter explicitly
    console.log('[DEBUG] Prompt result:', result);
    return result;
  },
};