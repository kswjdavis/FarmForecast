/**
 * Credential Loader Service
 * Loads credentials from .env (dev) or .env.vault (prod)
 * Supports both plain text and encrypted credentials
 */

import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';
import VaultManager from '../utils/vault-manager.js';

export interface CredentialConfig {
  environment: 'development' | 'staging' | 'production' | 'test';
  useVault: boolean;
  vaultPath?: string;
  envPath?: string;
  required: string[];
}

export class CredentialLoader {
  private credentials: Record<string, string> = {};
  private isLoaded = false;

  /**
   * Loads credentials based on environment
   */
  async loadCredentials(config?: Partial<CredentialConfig>): Promise<void> {
    const environment = config?.environment || this.detectEnvironment();
    const useVault = config?.useVault ?? environment !== 'development';

    console.log(`🔐 Loading credentials for ${environment} environment...`);

    try {
      if (useVault) {
        await this.loadFromVault(environment);
      } else {
        await this.loadFromEnv();
      }

      this.validateRequired(config?.required);
      this.isLoaded = true;

      console.log('✅ Credentials loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load credentials:', error);
      throw error;
    }
  }

  /**
   * Loads credentials from .env file
   */
  private async loadFromEnv(): Promise<void> {
    const envPath = '.env';

    if (!existsSync(envPath)) {
      throw new Error('.env file not found. Run: cp .env.example .env');
    }

    // Load .env file
    const result = dotenvConfig({ path: envPath });

    if (result.error) {
      throw result.error;
    }

    this.credentials = { ...process.env } as Record<string, string>;
    console.log('📄 Loaded credentials from .env file');
  }

  /**
   * Loads credentials from encrypted vault
   */
  private async loadFromVault(environment: string): Promise<void> {
    const envMap = {
      development: 'local',
      staging: 'staging',
      production: 'production',
      test: 'local',
    };

    const vaultEnv = envMap[environment as keyof typeof envMap] || 'local';

    try {
      // Decrypt vault to memory
      const decrypted = await VaultManager.decryptCredentials(vaultEnv);

      // Set environment variables
      Object.entries(decrypted).forEach(([key, value]) => {
        process.env[key] = value;
      });

      this.credentials = decrypted;
      console.log('🔓 Loaded credentials from encrypted vault');
    } catch (error) {
      // Fallback to .env if vault fails in development
      if (environment === 'development' && existsSync('.env')) {
        console.warn('⚠️  Vault not found, falling back to .env file');
        await this.loadFromEnv();
      } else {
        throw error;
      }
    }
  }

  /**
   * Detects current environment
   */
  private detectEnvironment(): 'development' | 'staging' | 'production' | 'test' {
    const env = process.env.NODE_ENV || 'development';

    if (['development', 'staging', 'production', 'test'].includes(env)) {
      return env as 'development' | 'staging' | 'production' | 'test';
    }

    return 'development';
  }

  /**
   * Validates required credentials are present
   */
  private validateRequired(required?: string[]): void {
    const defaultRequired = [
      'NEO4J_URI',
      'NEO4J_PASSWORD',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'VISUALCROSSING_API_KEY',
      'NOAA_API_TOKEN',
    ];

    const toCheck = required || defaultRequired;
    const missing = toCheck.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required credentials: ${missing.join(', ')}`);
    }
  }

  /**
   * Gets a credential value
   */
  get(key: string): string | undefined {
    if (!this.isLoaded) {
      throw new Error('Credentials not loaded. Call loadCredentials() first');
    }
    return process.env[key];
  }

  /**
   * Gets a required credential value (throws if missing)
   */
  getRequired(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(`Required credential ${key} not found`);
    }
    return value;
  }

  /**
   * Gets multiple credentials
   */
  getMultiple(keys: string[]): Record<string, string | undefined> {
    const result: Record<string, string | undefined> = {};
    keys.forEach((key) => {
      result[key] = this.get(key);
    });
    return result;
  }

  /**
   * Checks if credentials are loaded
   */
  isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Masks sensitive values in strings (for logging)
   */
  maskSensitiveData(text: string): string {
    const sensitiveKeys = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'PRIVATE', 'CREDENTIAL'];

    let masked = text;

    Object.entries(process.env).forEach(([key, value]) => {
      if (value && sensitiveKeys.some((sensitive) => key.includes(sensitive))) {
        // Keep first 4 chars, mask the rest
        const maskValue =
          value.length > 4
            ? value.substring(0, 4) + '*'.repeat(Math.min(value.length - 4, 20))
            : '*'.repeat(value.length);

        masked = masked.replace(new RegExp(value, 'g'), maskValue);
      }
    });

    return masked;
  }

  /**
   * Clears loaded credentials from memory
   */
  clear(): void {
    // Clear sensitive env vars
    Object.keys(this.credentials).forEach((key) => {
      if (
        key.includes('PASSWORD') ||
        key.includes('SECRET') ||
        key.includes('KEY') ||
        key.includes('TOKEN')
      ) {
        delete process.env[key];
      }
    });

    this.credentials = {};
    this.isLoaded = false;
    console.log('🧹 Credentials cleared from memory');
  }
}

// Export singleton instance
export default new CredentialLoader();
