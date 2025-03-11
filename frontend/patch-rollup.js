#!/usr/bin/env node

/**
 * This script patches rollup to avoid the native module error on Vercel
 */

const fs = require('fs');
const path = require('path');

// Function to find the rollup native.js file in node_modules
function findRollupNative() {
  const basePath = path.resolve(process.cwd(), 'node_modules', 'rollup', 'dist');
  const nativePath = path.join(basePath, 'native.js');
  
  if (fs.existsSync(nativePath)) {
    return nativePath;
  }
  
  return null;
}

// Patch the native.js file to bypass the platform-specific module
function patchRollupNative(filePath) {
  console.log(`Patching rollup native module at ${filePath}`);
  
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a patched version that always returns null/empty for native bindings
    const patchedContent = content.replace(
      /try\s*{\s*bindings\s*=\s*require\([^)]+\);?\s*}\s*catch\s*\([^)]+\)\s*{[^}]*}/gs,
      'try { bindings = null; } catch (e) { bindings = null; }'
    );
    
    // Write the patched content back
    fs.writeFileSync(filePath, patchedContent);
    console.log('Successfully patched rollup native.js');
    return true;
  } catch (error) {
    console.error('Error patching rollup:', error);
    return false;
  }
}

// Create a dummy rollup native module
function createDummyNativeModule() {
  const dummyContent = `
// This is a dummy replacement for the native rollup module
// It avoids the platform-specific module error
module.exports = {
  // Return empty/null values for all native functions
  loadNative: function() { return null; },
  getDefaultNativeFunctions: function() { return {}; }
};
`;

  try {
    // Check if @rollup directory exists in node_modules
    const rollupDir = path.resolve(process.cwd(), 'node_modules', '@rollup');
    if (!fs.existsSync(rollupDir)) {
      fs.mkdirSync(rollupDir, { recursive: true });
    }

    // Create the dummy module for linux-x64-gnu
    const targetDir = path.resolve(rollupDir, 'rollup-linux-x64-gnu');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write the dummy index.js
    fs.writeFileSync(path.join(targetDir, 'index.js'), dummyContent);
    
    // Create a dummy package.json
    const packageJson = {
      name: '@rollup/rollup-linux-x64-gnu',
      version: '4.9.1',
      description: 'Dummy module to bypass rollup native dependency',
      main: 'index.js'
    };
    
    fs.writeFileSync(
      path.join(targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    console.log('Created dummy @rollup/rollup-linux-x64-gnu module');
    return true;
  } catch (error) {
    console.error('Error creating dummy module:', error);
    return false;
  }
}

// Main function
function main() {
  console.log('Patching rollup to avoid native module errors...');
  
  // First try to find and patch the rollup native.js file
  const nativePath = findRollupNative();
  if (nativePath) {
    patchRollupNative(nativePath);
  } else {
    console.log('Could not find rollup/dist/native.js');
  }
  
  // Create the dummy native module as a fallback
  createDummyNativeModule();
  
  console.log('Rollup patching completed');
}

// Run the script
main(); 