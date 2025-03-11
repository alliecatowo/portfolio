#!/usr/bin/env node

/**
 * This script patches the rollup package to avoid issues with native dependencies
 * on Digital Ocean App Platform.
 */

const fs = require('fs');
const path = require('path');

// Path to the rollup native.js file
const nativePath = path.resolve(__dirname, 'node_modules/rollup/dist/native.js');

console.log('Patching rollup native.js file...');

if (!fs.existsSync(nativePath)) {
  console.error('Could not find rollup native.js file at:', nativePath);
  process.exit(1);
}

// Read the file
let content = fs.readFileSync(nativePath, 'utf8');

// Replace the native module loading with a fallback to the JS implementation
const patchedContent = content.replace(
  /try\s*{[^}]*requireWithFriendlyError[^}]*}\s*catch\s*\([^)]*\)\s*{/,
  'try { throw new Error("Skip native"); } catch (e) {'
);

// Write the patched file
fs.writeFileSync(nativePath, patchedContent);

console.log('Successfully patched rollup to avoid native dependencies!'); 