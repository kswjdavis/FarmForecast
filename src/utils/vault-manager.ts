/**
 * Vault Manager - Handles encryption/decryption of credentials
 * Uses dotenvx for AES-256 encryption
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import crypto from 'crypto';

export class VaultManager {
  private readonly keyLength = 32;

  /**
   * Encrypts .env file to .env.vault using dotenvx
   */
  async encryptCredentials(environment: string = 'local'): Promise<void> {
    const envPath = '.env';
    const vaultPath = `.credentials/${environment}/.env.vault`;

    if (!existsSync(envPath)) {
      throw new Error(`Environment file ${envPath} not found`);
    }

    try {
      // Use dotenvx to encrypt
      execSync(`npx @dotenvx/dotenvx encrypt -f ${envPath} -o ${vaultPath}`, {
        stdio: 'pipe',
      });

      console.log(`✅ Credentials encrypted to ${vaultPath}`);
    } catch (error) {
      console.error('❌ Failed to encrypt credentials:', error);
      throw error;
    }
  }

  /**
   * Decrypts .env.vault to memory (not to file for security)
   */
  async decryptCredentials(environment: string = 'local'): Promise<Record<string, string>> {
    const vaultPath = `.credentials/${environment}/.env.vault`;
    const keyPath = `.credentials/${environment}/DOTENV_KEY`;

    if (!existsSync(vaultPath)) {
      throw new Error(`Vault file ${vaultPath} not found`);
    }

    if (!existsSync(keyPath)) {
      throw new Error(`Decryption key ${keyPath} not found`);
    }

    try {
      const dotenvKey = readFileSync(keyPath, 'utf-8').trim();

      // Set the key temporarily for decryption
      process.env.DOTENV_KEY = dotenvKey;

      // Decrypt to stdout and parse
      const decrypted = execSync(`npx @dotenvx/dotenvx decrypt -f ${vaultPath}`, {
        encoding: 'utf-8',
      });

      // Parse the decrypted content
      const credentials: Record<string, string> = {};
      decrypted.split('\n').forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          credentials[match[1]] = match[2];
        }
      });

      // Clean up the key from memory
      delete process.env.DOTENV_KEY;

      return credentials;
    } catch (error) {
      console.error('❌ Failed to decrypt credentials:', error);
      throw error;
    }
  }

  /**
   * Generates a new encryption key for vault rotation
   */
  generateEncryptionKey(): string {
    const key = crypto.randomBytes(this.keyLength).toString('base64');
    return `dotenv://:key_${key}@dotenvx.com/vault/.env.vault?environment=${Date.now()}`;
  }

  /**
   * Rotates the encryption key for a vault
   */
  async rotateEncryptionKey(environment: string = 'local'): Promise<void> {
    const vaultPath = `.credentials/${environment}/.env.vault`;
    const keyPath = `.credentials/${environment}/DOTENV_KEY`;
    const backupPath = `.credentials/${environment}/.env.vault.backup`;

    try {
      // Backup current vault
      if (existsSync(vaultPath)) {
        const vaultContent = readFileSync(vaultPath);
        writeFileSync(backupPath, vaultContent);
      }

      // Decrypt current credentials
      const credentials = await this.decryptCredentials(environment);

      // Create temporary .env file
      const tempEnvPath = `.credentials/${environment}/.env.temp`;
      const envContent = Object.entries(credentials)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      writeFileSync(tempEnvPath, envContent);

      // Generate new key
      const newKey = this.generateEncryptionKey();
      writeFileSync(keyPath, newKey);

      // Re-encrypt with new key
      execSync(`npx @dotenvx/dotenvx encrypt -f ${tempEnvPath} -o ${vaultPath}`, {
        stdio: 'pipe',
      });

      // Clean up temp file
      execSync(`rm ${tempEnvPath}`);

      console.log(`✅ Encryption key rotated for ${environment} environment`);
    } catch (error) {
      console.error('❌ Failed to rotate encryption key:', error);

      // Restore from backup if rotation failed
      const backupPath = `.credentials/${environment}/.env.vault.backup`;
      if (existsSync(backupPath)) {
        const backupContent = readFileSync(backupPath);
        writeFileSync(vaultPath, backupContent);
        console.log('📥 Restored vault from backup');
      }

      throw error;
    }
  }

  /**
   * Validates that a vault can be decrypted
   */
  async validateVault(environment: string = 'local'): Promise<boolean> {
    try {
      const credentials = await this.decryptCredentials(environment);

      // Check for required credentials
      const required = [
        'NEO4J_URI',
        'NEO4J_PASSWORD',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'VISUALCROSSING_API_KEY',
        'NOAA_API_TOKEN',
      ];

      const missing = required.filter((key) => !credentials[key]);

      if (missing.length > 0) {
        console.error(`❌ Missing required credentials: ${missing.join(', ')}`);
        return false;
      }

      console.log(`✅ Vault validated for ${environment} environment`);
      return true;
    } catch (error) {
      console.error(`❌ Vault validation failed for ${environment}:`, error);
      return false;
    }
  }

  /**
   * Creates a secure backup of credentials
   */
  async backupCredentials(environment: string = 'local'): Promise<void> {
    const vaultPath = `.credentials/${environment}/.env.vault`;
    const keyPath = `.credentials/${environment}/DOTENV_KEY`;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `.credentials/backups/${timestamp}`;

    try {
      // Create backup directory
      execSync(`mkdir -p ${backupDir}`);

      // Copy vault and key
      if (existsSync(vaultPath)) {
        execSync(`cp ${vaultPath} ${backupDir}/.env.vault`);
      }
      if (existsSync(keyPath)) {
        execSync(`cp ${keyPath} ${backupDir}/DOTENV_KEY`);
      }

      // Create backup metadata
      const metadata = {
        timestamp,
        environment,
        createdBy: process.env.USER || 'unknown',
        vaultExists: existsSync(vaultPath),
        keyExists: existsSync(keyPath),
      };

      writeFileSync(`${backupDir}/metadata.json`, JSON.stringify(metadata, null, 2));

      console.log(`✅ Credentials backed up to ${backupDir}`);
    } catch (error) {
      console.error('❌ Failed to backup credentials:', error);
      throw error;
    }
  }
}

export default new VaultManager();
