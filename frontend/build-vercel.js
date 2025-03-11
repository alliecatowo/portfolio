#!/usr/bin/env node

/**
 * Custom build script for Vercel that bypasses rollup issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom Vercel build process...');

// Create a specialized .npmrc for Vercel builds
const npmrcContent = `
# Skip optional dependencies completely
omit=optional

# Prevent using platform-specific modules
ROLLUP_SKIP_NATIVES=true

# Use legacy peer deps resolution to avoid conflicts
legacy-peer-deps=true
strict-peer-dependencies=false

# Force using smaller dependencies
public-hoist-pattern[]=*rollup*
shamefully-hoist=true

# Prefer offline dependencies for faster installs
prefer-offline=true
`;

try {
  // Save the .npmrc file
  fs.writeFileSync('.npmrc', npmrcContent);
  console.log('Created specialized .npmrc file');

  // Clean the environment before building
  console.log('Cleaning existing build artifacts and dependencies...');
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules');
  }
  if (fs.existsSync('.nuxt')) {
    execSync('rm -rf .nuxt');
  }
  if (fs.existsSync('.output')) {
    execSync('rm -rf .output');
  }
  if (fs.existsSync('package-lock.json')) {
    execSync('rm -f package-lock.json');
  }

  // Add an overrides section to package.json if it doesn't exist
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.overrides = packageJson.overrides || {};
  packageJson.overrides.rollup = '3.23.0'; // Use an older, more compatible version
  packageJson.overrides.vite = '^4.0.0'; // Use Vite 4 which is more stable
  
  // Make sure we have necessary devDependencies
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies.rollup = '3.23.0';
  
  // Write back the modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with overrides');

  // Install dependencies with special flags
  console.log('Installing dependencies...');
  execSync('npm install --prefer-offline --no-optional --omit=optional', { stdio: 'inherit' });

  // Create a special nuxt.config.js that doesn't use rollup
  const originalNuxtConfig = path.join(process.cwd(), 'nuxt.config.ts');
  const backupNuxtConfig = path.join(process.cwd(), 'nuxt.config.ts.bak');
  
  // Backup the original nuxt config
  if (fs.existsSync(originalNuxtConfig)) {
    fs.copyFileSync(originalNuxtConfig, backupNuxtConfig);
    console.log('Backed up original nuxt.config.ts');
    
    // Read the original config
    let nuxtConfigContent = fs.readFileSync(originalNuxtConfig, 'utf8');
    
    // Add vite configuration to disable rollup optimizations
    if (!nuxtConfigContent.includes('vite: {')) {
      // Find the export default defineNuxtConfig
      const configStart = nuxtConfigContent.indexOf('export default defineNuxtConfig(');
      if (configStart !== -1) {
        // Find the opening brace of the config object
        const configObjStart = nuxtConfigContent.indexOf('{', configStart);
        if (configObjStart !== -1) {
          // Insert vite config right after the opening brace
          nuxtConfigContent = 
            nuxtConfigContent.slice(0, configObjStart + 1) + 
            `
  vite: {
    optimizeDeps: {
      exclude: ['rollup', '@rollup/plugin-node-resolve', '@rollup/plugin-commonjs'],
      include: []
    },
    build: {
      rollupOptions: {
        external: ['rollup']
      }
    }
  },` + 
            nuxtConfigContent.slice(configObjStart + 1);
          
          fs.writeFileSync(originalNuxtConfig, nuxtConfigContent);
          console.log('Updated nuxt.config.ts with vite optimizations');
        }
      }
    }
  }

  // Run the build with environment variables to skip native modules
  console.log('Running Nuxt build...');
  execSync('ROLLUP_SKIP_NATIVES=true NODE_OPTIONS=--no-warnings npx nuxt build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      ROLLUP_SKIP_NATIVES: 'true',
      NODE_OPTIONS: '--no-warnings'
    }
  });

  // Restore the original nuxt config
  if (fs.existsSync(backupNuxtConfig)) {
    fs.copyFileSync(backupNuxtConfig, originalNuxtConfig);
    fs.unlinkSync(backupNuxtConfig);
    console.log('Restored original nuxt.config.ts');
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error);
  process.exit(1);
} 