/**
 * Script to handle installing the correct dependencies for the Vercel build environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Skip if not on Linux (which Vercel uses)
const isLinux = process.platform === 'linux';

console.log(`Running on platform: ${process.platform}`);
console.log(`Node version: ${process.version}`);

// Create a special .npmrc for the Vercel environment
const vercelNpmrc = `
# Disable native modules in rollup
ROLLUP_SKIP_NATIVES=true
# Dependency settings
node-linker=hoisted
public-hoist-pattern[]=*rollup*
legacy-peer-deps=true
shamefully-hoist=true
strict-peer-dependencies=false
# Skip optional dependencies
omit=optional
`;

try {
  // Only do this on Vercel (which uses Linux)
  if (isLinux || process.env.VERCEL) {
    console.log('Creating special .npmrc for Vercel environment...');
    fs.writeFileSync(path.join(process.cwd(), '.npmrc'), vercelNpmrc);
    
    console.log('Installing with special environment variables...');
    const env = { 
      ...process.env, 
      ROLLUP_SKIP_NATIVES: 'true',
      NODE_OPTIONS: '--no-warnings'
    };
    
    execSync('npm cache clean --force', { stdio: 'inherit', env });
    console.log('Cache cleaned');
    
    // Force a specific version of rollup that works
    execSync('npm uninstall rollup', { stdio: 'inherit', env });
    console.log('Removed existing rollup (if any)');
    
    execSync('npm install --save-dev rollup@3.29.4 --no-optional', { stdio: 'inherit', env });
    console.log('Installed specific rollup version');
    
    try {
      console.log('Attempting to require nuxt...');
      require('nuxt');
      console.log('Successfully required nuxt');
    } catch (e) {
      console.warn('Could not require nuxt, continuing anyway:', e);
    }
  } else {
    console.log('Not running on Vercel, skipping special setup');
  }
} catch (error) {
  console.error('Error during dependency installation:', error);
  // Continue even if there's an error
} 