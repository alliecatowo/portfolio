// Comprehensive setup script for Directus
// This script will:
// 1. Create collections
// 2. Set up permissions for admin role
// 3. Set up permissions for public role
// 4. Seed collections with sample data

// Import required modules
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the scripts to run in order
const scripts = [
  'create-collections.js',
  'fix-admin-permissions.js',
  'fix-public-permissions.js',
  'seed-collections.js'
];

// Check for required environment variables
const requiredEnvVars = ['DIRECTUS_ADMIN_EMAIL', 'DIRECTUS_ADMIN_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease set these variables before running this script:');
  console.error('Example:');
  console.error('  DIRECTUS_ADMIN_EMAIL="admin@example.com" DIRECTUS_ADMIN_PASSWORD="your_password" node setup-directus.js');
  process.exit(1);
}

// Function to check if script file exists
function checkScriptExists(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Script not found: ${scriptName}`);
    return false;
  }
  return true;
}

// Function to run a script
async function runScript(scriptName) {
  console.log(`\n🚀 Running ${scriptName}...`);
  
  try {
    // Check if script exists
    if (!checkScriptExists(scriptName)) {
      return false;
    }
    
    // Run the script
    execSync(`node ${scriptName}`, {
      stdio: 'inherit',
      env: process.env
    });
    
    console.log(`✅ Successfully completed ${scriptName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error running ${scriptName}:`, error.message);
    return false;
  }
}

// Main function to run all scripts in sequence
async function setupDirectus() {
  console.log('🔧 Starting Directus setup...\n');
  
  // Run each script in sequence
  for (const script of scripts) {
    const success = await runScript(script);
    
    // If a script fails, stop the process
    if (!success) {
      console.error(`\n❌ Setup process failed at ${script}`);
      process.exit(1);
    }
  }
  
  console.log('\n✅ Directus setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Visit your Directus admin panel to verify the setup');
  console.log('2. Check your frontend to ensure it can connect to the API');
}

// Run the setup process
setupDirectus().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 