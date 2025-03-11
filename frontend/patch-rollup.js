#!/usr/bin/env node

/**
 * This script patches the rollup package to avoid issues with native dependencies
 * on Digital Ocean App Platform.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Patching rollup for Digital Ocean deployment...');

// Try to find rollup in node_modules
const possiblePaths = [
  path.resolve(__dirname, 'node_modules/rollup/dist/native.js'),
  path.resolve(__dirname, 'node_modules/rollup/dist/es/native.js'),
  path.resolve(__dirname, 'node_modules/@rollup/rollup/dist/native.js')
];

let nativePath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    nativePath = p;
    break;
  }
}

if (!nativePath) {
  console.log('Could not find rollup native.js file. Creating dummy module instead.');
  
  // Create a dummy module for rollup-linux-x64-gnu
  const rollupDir = path.resolve(__dirname, 'node_modules/@rollup');
  if (!fs.existsSync(rollupDir)) {
    fs.mkdirSync(rollupDir, { recursive: true });
  }
  
  const targetDir = path.resolve(rollupDir, 'rollup-linux-x64-gnu');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Create a dummy index.js
  const dummyContent = `
// Dummy module to avoid native dependency issues
module.exports = {};
`;
  
  fs.writeFileSync(path.join(targetDir, 'index.js'), dummyContent);
  
  // Create a package.json
  const packageJson = {
    name: '@rollup/rollup-linux-x64-gnu',
    version: '1.0.0',
    main: 'index.js'
  };
  
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('Created dummy @rollup/rollup-linux-x64-gnu module');
} else {
  console.log(`Found rollup native.js at: ${nativePath}`);
  
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
}

console.log('Rollup patching completed successfully!'); 