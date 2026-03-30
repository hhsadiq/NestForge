#!/usr/bin/env node
/**
 * inject-context.mjs — PreToolUse hook orchestrator
 *
 * Wired in .claude/settings.json to run before every Edit and Write tool call.
 * Runs two middlewares in sequence:
 *   1. structureCheck — blocks new files in wrong directories
 *   2. codeContext   — injects all matching leaf docs before the edit
 *
 * Exit codes:
 *   0 = proceed (with optional additionalContext)
 *   2 = BLOCKED (stderr message sent to agent, tool call cancelled)
 */

import { buildContext, runPipeline } from './hooks/base.mjs';
import { structureCheck } from './hooks/inject-structure-context.mjs';
import { codeContext } from './hooks/inject-code-context.mjs';

const PIPELINE = [
  structureCheck(), // runs first — block bad paths before any context is injected
  codeContext(),    // runs second — inject all matching domain + layer docs
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  let ctx;
  try {
    ctx = buildContext(input);
  } catch {
    // Malformed input — let the tool proceed without injection
    process.exit(0);
  }
  runPipeline(ctx, PIPELINE);
});
