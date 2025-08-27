/**
 * Unit tests for credential management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CredentialLoader } from '../services/credential-loader';
import VaultManager from '../utils/vault-manager';
import * as fs from 'fs';
import * as child_process from 'child_process';

// Mock modules
vi.mock('fs');
vi.mock('child_process');

describe('CredentialLoader', () => {
  let credentialLoader: CredentialLoader;

  beforeEach(() => {
    credentialLoader = new CredentialLoader();
    // Clear environment
    vi.clearAllMocks();
    process.env = {};
  });

  afterEach(() => {
    credentialLoader.clear();
  });

  describe('loadCredentials', () => {
    it('should load credentials from .env in development', async () => {
      process.env.NODE_ENV = 'development';

      // Mock .env file exists
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      // Mock environment variables
      const mockEnv = {
        NEO4J_URI: 'neo4j+s://test.neo4j.io',
        NEO4J_PASSWORD: 'test-password',
        AWS_ACCESS_KEY_ID: 'AKIA-TEST',
        AWS_SECRET_ACCESS_KEY: 'secret-test',
        VISUALCROSSING_API_KEY: 'vc-test-key',
        NOAA_API_TOKEN: 'noaa-test-token',
      };

      // Set mock env vars
      Object.assign(process.env, mockEnv);

      await credentialLoader.loadCredentials();

      expect(credentialLoader.isReady()).toBe(true);
      expect(credentialLoader.get('NEO4J_URI')).toBe('neo4j+s://test.neo4j.io');
    });

    it('should throw error if required credentials are missing', async () => {
      // Create a new instance to avoid state issues
      const { CredentialLoader } = await import('../services/credential-loader');
      const loader = new CredentialLoader();

      process.env.NODE_ENV = 'test';

      // Mock the vault decryption to return incomplete credentials
      vi.spyOn(VaultManager, 'decryptCredentials').mockResolvedValue({
        NEO4J_URI: 'neo4j+s://test.neo4j.io',
        // NEO4J_PASSWORD is missing - this should cause failure
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
        VISUALCROSSING_API_KEY: 'test',
        NOAA_API_TOKEN: 'test',
      });

      // Force using vault (not .env)
      await expect(loader.loadCredentials({ useVault: true })).rejects.toThrow(
        /Missing required credentials/
      );
    });

    it('should load from vault in production', async () => {
      process.env.NODE_ENV = 'production';

      // Mock vault decryption
      const mockDecrypted = {
        NEO4J_URI: 'neo4j+s://prod.neo4j.io',
        NEO4J_PASSWORD: 'prod-password',
        AWS_ACCESS_KEY_ID: 'AKIA-PROD',
        AWS_SECRET_ACCESS_KEY: 'secret-prod',
        VISUALCROSSING_API_KEY: 'vc-prod-key',
        NOAA_API_TOKEN: 'noaa-prod-token',
      };

      vi.spyOn(VaultManager, 'decryptCredentials').mockResolvedValue(mockDecrypted);

      await credentialLoader.loadCredentials({ environment: 'production' });

      expect(credentialLoader.get('NEO4J_URI')).toBe('neo4j+s://prod.neo4j.io');
      expect(process.env.NEO4J_PASSWORD).toBe('prod-password');
    });
  });

  describe('getRequired', () => {
    it('should return value if credential exists', async () => {
      process.env.TEST_KEY = 'test-value';
      process.env.NODE_ENV = 'development';
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      // Set all required env vars
      Object.assign(process.env, {
        NEO4J_URI: 'test',
        NEO4J_PASSWORD: 'test',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
        VISUALCROSSING_API_KEY: 'test',
        NOAA_API_TOKEN: 'test',
        TEST_KEY: 'test-value',
      });

      await credentialLoader.loadCredentials();

      const value = credentialLoader.getRequired('TEST_KEY');
      expect(value).toBe('test-value');
    });

    it('should throw error if credential is missing', async () => {
      process.env.NODE_ENV = 'development';
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      // Set required env vars
      Object.assign(process.env, {
        NEO4J_URI: 'test',
        NEO4J_PASSWORD: 'test',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
        VISUALCROSSING_API_KEY: 'test',
        NOAA_API_TOKEN: 'test',
      });

      await credentialLoader.loadCredentials();

      expect(() => credentialLoader.getRequired('MISSING_KEY')).toThrow(
        /Required credential MISSING_KEY not found/
      );
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask sensitive values in text', async () => {
      process.env.NODE_ENV = 'development';
      process.env.SECRET_KEY = 'super-secret-value';
      process.env.API_TOKEN = 'token123456789';

      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      Object.assign(process.env, {
        NEO4J_URI: 'test',
        NEO4J_PASSWORD: 'test',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
        VISUALCROSSING_API_KEY: 'test',
        NOAA_API_TOKEN: 'test',
      });

      await credentialLoader.loadCredentials();

      const text = 'The secret is super-secret-value and token is token123456789';
      const masked = credentialLoader.maskSensitiveData(text);

      // Check that values are masked (first 4 chars + asterisks)
      expect(masked).toContain('supe');
      expect(masked).toContain('toke');
      expect(masked).toContain('*');
      expect(masked).not.toContain('super-secret-value');
      expect(masked).not.toContain('token123456789');
      // Verify the actual format matches implementation
      expect(masked).toMatch(/supe\*+/);
      expect(masked).toMatch(/toke\*+/);
    });
  });
});

describe('VaultManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateEncryptionKey', () => {
    it('should generate a valid encryption key', () => {
      const key = VaultManager.generateEncryptionKey();

      expect(key).toMatch(
        /^dotenv:\/\/:key_.*@dotenvx\.com\/vault\/\.env\.vault\?environment=\d+$/
      );
    });
  });

  describe('encryptCredentials', () => {
    it('should encrypt .env file to vault', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(child_process, 'execSync').mockReturnValue(Buffer.from(''));

      await VaultManager.encryptCredentials('local');

      expect(child_process.execSync).toHaveBeenCalledWith(
        expect.stringContaining('npx @dotenvx/dotenvx encrypt'),
        expect.any(Object)
      );
    });

    it('should throw error if .env file does not exist', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);

      await expect(VaultManager.encryptCredentials()).rejects.toThrow(
        /Environment file .* not found/
      );
    });
  });

  describe('validateVault', () => {
    it('should validate vault with all required credentials', async () => {
      const mockCredentials = {
        NEO4J_URI: 'neo4j+s://test.neo4j.io',
        NEO4J_PASSWORD: 'password',
        AWS_ACCESS_KEY_ID: 'AKIA-TEST',
        AWS_SECRET_ACCESS_KEY: 'secret',
        VISUALCROSSING_API_KEY: 'vc-key',
        NOAA_API_TOKEN: 'noaa-token',
      };

      vi.spyOn(VaultManager, 'decryptCredentials').mockResolvedValue(mockCredentials);

      const isValid = await VaultManager.validateVault('local');

      expect(isValid).toBe(true);
    });

    it('should return false if required credentials are missing', async () => {
      const mockCredentials = {
        NEO4J_URI: 'neo4j+s://test.neo4j.io',
        // Missing NEO4J_PASSWORD
        AWS_ACCESS_KEY_ID: 'AKIA-TEST',
        AWS_SECRET_ACCESS_KEY: 'secret',
      };

      vi.spyOn(VaultManager, 'decryptCredentials').mockResolvedValue(mockCredentials);

      const isValid = await VaultManager.validateVault('local');

      expect(isValid).toBe(false);
    });
  });

  describe('backupCredentials', () => {
    it('should create backup of vault and key', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(child_process, 'execSync').mockImplementation(() => Buffer.from(''));
      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      await VaultManager.backupCredentials('local');

      // Check that mkdir was called with a backup directory path
      expect(child_process.execSync).toHaveBeenCalledWith(
        expect.stringMatching(/mkdir -p .*backups/)
      );

      // Check that cp commands were called
      const calls = (child_process.execSync as any).mock.calls;
      const cpCalls = calls.filter((call: any[]) => call[0].includes('cp'));
      expect(cpCalls.length).toBeGreaterThan(0);
    });
  });
});
