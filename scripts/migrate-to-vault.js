#!/usr/bin/env node

/**
 * Migration script to convert .env to encrypted vault
 * Preserves existing credentials while adding security
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}\n`),
};

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function createBackup(envPath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = '.credentials/backups';
  const backupPath = path.join(backupDir, `env-backup-${timestamp}.env`);

  // Create backup directory
  await fs.mkdir(backupDir, { recursive: true });

  // Copy .env to backup
  const content = await fs.readFile(envPath, 'utf-8');
  await fs.writeFile(backupPath, content);

  log.success(`Backup created: ${backupPath}`);
  return backupPath;
}

async function generateDotenvKey() {
  const key = crypto.randomBytes(32).toString('base64');
  const timestamp = Date.now();
  return `dotenv://:key_${key}@dotenvx.com/vault/.env.vault?environment=${timestamp}`;
}

async function encryptToVault(envPath, environment = 'local') {
  const vaultDir = `.credentials/${environment}`;
  const vaultPath = path.join(vaultDir, '.env.vault');
  const keyPath = path.join(vaultDir, 'DOTENV_KEY');

  // Create vault directory
  await fs.mkdir(vaultDir, { recursive: true });

  // Generate encryption key
  const dotenvKey = await generateDotenvKey();
  await fs.writeFile(keyPath, dotenvKey);

  // Encrypt using dotenvx
  try {
    execSync(`npx @dotenvx/dotenvx encrypt -f ${envPath} -o ${vaultPath}`, { stdio: 'pipe' });

    log.success(`Vault created: ${vaultPath}`);
    log.success(`Key stored: ${keyPath}`);
    return { vaultPath, keyPath };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

async function validateVault(environment = 'local') {
  const vaultPath = `.credentials/${environment}/.env.vault`;
  const keyPath = `.credentials/${environment}/DOTENV_KEY`;

  if (!(await fileExists(vaultPath))) {
    throw new Error('Vault file not found');
  }

  if (!(await fileExists(keyPath))) {
    throw new Error('Decryption key not found');
  }

  // Try to decrypt (to stdout for validation)
  try {
    const key = await fs.readFile(keyPath, 'utf-8');
    process.env.DOTENV_KEY = key.trim();

    const output = execSync(`npx @dotenvx/dotenvx decrypt -f ${vaultPath}`, { encoding: 'utf-8' });

    // Check for required variables
    const required = [
      'NEO4J_URI',
      'NEO4J_PASSWORD',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'VISUALCROSSING_API_KEY',
      'NOAA_API_TOKEN',
    ];

    const missing = required.filter((key) => !output.includes(`${key}=`));

    if (missing.length > 0) {
      throw new Error(`Missing variables: ${missing.join(', ')}`);
    }

    delete process.env.DOTENV_KEY;
    log.success('Vault validated successfully');
    return true;
  } catch (error) {
    delete process.env.DOTENV_KEY;
    throw error;
  }
}

async function updateGitignore() {
  const gitignorePath = '.gitignore';
  let content = '';

  if (await fileExists(gitignorePath)) {
    content = await fs.readFile(gitignorePath, 'utf-8');
  }

  const additions = [
    '# Credential vault keys (NEVER commit these)',
    '.credentials/*/DOTENV_KEY',
    '.credentials/**/*DOTENV_KEY*',
    '',
    '# Credential backups',
    '.credentials/backups/',
    '',
    '# Temporary credential files',
    '*.env.temp',
    '*.env.decrypted',
  ];

  let updated = false;
  for (const line of additions) {
    if (!content.includes(line) && line !== '') {
      content += `\n${line}`;
      updated = true;
    }
  }

  if (updated) {
    await fs.writeFile(gitignorePath, content);
    log.success('Updated .gitignore');
  }
}

async function main() {
  console.log('=====================================');
  console.log('🔐 FarmForecast Vault Migration');
  console.log('=====================================\n');

  try {
    // Step 1: Check for .env file
    log.header('Step 1: Checking Environment File');

    const envPath = '.env';
    if (!(await fileExists(envPath))) {
      log.error('.env file not found');
      log.info('Please create .env file first: cp .env.example .env');
      process.exit(1);
    }
    log.success('.env file found');

    // Step 2: Create backup
    log.header('Step 2: Creating Backup');
    await createBackup(envPath);

    // Step 3: Encrypt to vault
    log.header('Step 3: Encrypting Credentials');

    const environments = ['local', 'staging', 'production'];
    const vaults = {};

    for (const env of environments) {
      log.info(`Creating vault for ${env} environment...`);
      const result = await encryptToVault(envPath, env);
      vaults[env] = result;
    }

    // Step 4: Validate vaults
    log.header('Step 4: Validating Vaults');

    for (const env of environments) {
      log.info(`Validating ${env} vault...`);
      await validateVault(env);
    }

    // Step 5: Update .gitignore
    log.header('Step 5: Updating Git Configuration');
    await updateGitignore();

    // Step 6: Generate report
    log.header('📋 Migration Summary');

    console.log('Vaults created:');
    for (const [env, paths] of Object.entries(vaults)) {
      console.log(`  ${env}:`);
      console.log(`    Vault: ${paths.vaultPath}`);
      console.log(`    Key:   ${paths.keyPath}`);
    }

    console.log('\n' + '='.repeat(50));
    log.warning('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('='.repeat(50) + '\n');

    console.log('1. The DOTENV_KEY files contain decryption keys');
    console.log('2. NEVER commit DOTENV_KEY files to Git');
    console.log('3. Store keys in a password manager or secure location');
    console.log('4. Different keys for each environment');
    console.log('5. Original .env file can be deleted after verification\n');

    log.success('✨ Migration completed successfully!\n');

    // Offer to remove original .env
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('Remove original .env file? (y/n): ', (answer) => {
      readline.close();

      if (answer.toLowerCase() === 'y') {
        fs.unlink(envPath)
          .then(() => log.success('.env file removed'))
          .catch((err) => log.error(`Failed to remove .env: ${err.message}`));
      } else {
        log.warning('Remember to remove .env file manually');
      }
    });
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
