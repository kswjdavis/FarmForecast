/**
 * AWS Secrets Manager Integration
 * Manages credential storage and retrieval in AWS Secrets Manager
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  PutSecretValueCommand,
  DescribeSecretCommand,
  ListSecretsCommand,
  RotateSecretCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-secrets-manager';

export interface SecretConfig {
  region?: string;
  versionId?: string;
  versionStage?: string;
}

export interface SecretRotationConfig {
  automaticRotation: boolean;
  rotationIntervalDays: number;
  lambdaArn?: string;
}

export class AWSSecretsManager {
  private client: SecretsManagerClient;
  private region: string;
  private secretPrefix = 'farmforecast';

  constructor(region: string = 'us-west-2') {
    this.region = region;
    this.client = new SecretsManagerClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Stores credentials in AWS Secrets Manager
   */
  async storeSecret(
    secretName: string,
    secretValue: Record<string, any>,
    description?: string
  ): Promise<string> {
    const fullSecretName = `${this.secretPrefix}/${secretName}`;
    const secretString = JSON.stringify(secretValue);

    try {
      // Try to update existing secret first
      const updateCommand = new PutSecretValueCommand({
        SecretId: fullSecretName,
        SecretString: secretString,
      });

      const updateResult = await this.client.send(updateCommand);
      console.log(`✅ Updated secret: ${fullSecretName}`);
      return updateResult.VersionId || '';
    } catch (error: any) {
      if (error instanceof ResourceNotFoundException) {
        // Secret doesn't exist, create it
        const createCommand = new CreateSecretCommand({
          Name: fullSecretName,
          Description: description || `FarmForecast ${secretName} credentials`,
          SecretString: secretString,
          Tags: [
            { Key: 'Application', Value: 'FarmForecast' },
            { Key: 'Environment', Value: process.env.NODE_ENV || 'development' },
            { Key: 'ManagedBy', Value: 'farmforecast-credential-manager' },
          ],
        });

        const createResult = await this.client.send(createCommand);
        console.log(`✅ Created new secret: ${fullSecretName}`);
        return createResult.VersionId || '';
      }

      throw error;
    }
  }

  /**
   * Retrieves a secret from AWS Secrets Manager
   */
  async getSecret(secretName: string, config?: SecretConfig): Promise<Record<string, any>> {
    const fullSecretName = `${this.secretPrefix}/${secretName}`;

    try {
      const command = new GetSecretValueCommand({
        SecretId: fullSecretName,
        VersionId: config?.versionId,
        VersionStage: config?.versionStage,
      });

      const response = await this.client.send(command);

      if (response.SecretString) {
        return JSON.parse(response.SecretString);
      } else if (response.SecretBinary) {
        // Handle binary secrets
        const decoder = new TextDecoder();
        const decodedBinarySecret = decoder.decode(response.SecretBinary);
        return JSON.parse(decodedBinarySecret);
      }

      throw new Error('Secret value is empty');
    } catch (error: any) {
      if (error instanceof ResourceNotFoundException) {
        console.error(`❌ Secret not found: ${fullSecretName}`);
      }
      throw error;
    }
  }

  /**
   * Lists all secrets with the application prefix
   */
  async listSecrets(): Promise<string[]> {
    const command = new ListSecretsCommand({
      MaxResults: 100,
      Filters: [
        {
          Key: 'name',
          Values: [`${this.secretPrefix}/`],
        },
      ],
    });

    const response = await this.client.send(command);
    const secrets = response.SecretList || [];

    return secrets
      .map((secret) => secret.Name || '')
      .filter((name) => name.startsWith(`${this.secretPrefix}/`))
      .map((name) => name.replace(`${this.secretPrefix}/`, ''));
  }

  /**
   * Configures automatic rotation for a secret
   */
  async configureRotation(secretName: string, config: SecretRotationConfig): Promise<void> {
    const fullSecretName = `${this.secretPrefix}/${secretName}`;

    if (!config.lambdaArn) {
      throw new Error('Lambda ARN required for automatic rotation');
    }

    const command = new RotateSecretCommand({
      SecretId: fullSecretName,
      RotationLambdaARN: config.lambdaArn,
      RotationRules: {
        AutomaticallyAfterDays: config.rotationIntervalDays,
      },
    });

    await this.client.send(command);
    console.log(`✅ Configured rotation for ${fullSecretName}`);
  }

  /**
   * Stores all FarmForecast credentials in AWS Secrets Manager
   */
  async storeAllCredentials(): Promise<void> {
    const secrets = {
      neo4j: {
        uri: process.env.NEO4J_URI,
        username: process.env.NEO4J_USERNAME || 'neo4j',
        password: process.env.NEO4J_PASSWORD,
        database: process.env.NEO4J_DATABASE || 'neo4j',
      },
      weather: {
        visualcrossing: {
          apiKey: process.env.VISUALCROSSING_API_KEY,
          apiUrl: process.env.VISUALCROSSING_API_URL,
        },
        noaa: {
          apiToken: process.env.NOAA_API_TOKEN,
          apiUrl: process.env.NOAA_API_URL,
          email: process.env.NOAA_EMAIL,
        },
      },
      aws: {
        s3Buckets: {
          data: process.env.AWS_S3_BUCKET_DATA,
          backups: process.env.AWS_S3_BUCKET_BACKUPS,
          media: process.env.AWS_S3_BUCKET_MEDIA,
        },
        region: process.env.AWS_REGION,
      },
      github: {
        token: process.env.GITHUB_TOKEN,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
      },
      application: {
        sessionSecret: process.env.SESSION_SECRET,
        jwtSecret: process.env.JWT_SECRET,
        domain: process.env.DOMAIN_NAME,
      },
    };

    console.log('🔐 Storing credentials in AWS Secrets Manager...');

    for (const [name, value] of Object.entries(secrets)) {
      await this.storeSecret(name, value, `FarmForecast ${name} credentials`);
    }

    console.log('✅ All credentials stored successfully');
  }

  /**
   * Loads all credentials from AWS Secrets Manager to environment
   */
  async loadAllCredentials(): Promise<void> {
    console.log('🔓 Loading credentials from AWS Secrets Manager...');

    try {
      // Load Neo4j credentials
      const neo4j = await this.getSecret('neo4j');
      process.env.NEO4J_URI = neo4j.uri;
      process.env.NEO4J_USERNAME = neo4j.username;
      process.env.NEO4J_PASSWORD = neo4j.password;
      process.env.NEO4J_DATABASE = neo4j.database;

      // Load weather API credentials
      const weather = await this.getSecret('weather');
      process.env.VISUALCROSSING_API_KEY = weather.visualcrossing.apiKey;
      process.env.VISUALCROSSING_API_URL = weather.visualcrossing.apiUrl;
      process.env.NOAA_API_TOKEN = weather.noaa.apiToken;
      process.env.NOAA_API_URL = weather.noaa.apiUrl;
      process.env.NOAA_EMAIL = weather.noaa.email;

      // Load AWS config
      const aws = await this.getSecret('aws');
      process.env.AWS_S3_BUCKET_DATA = aws.s3Buckets.data;
      process.env.AWS_S3_BUCKET_BACKUPS = aws.s3Buckets.backups;
      process.env.AWS_S3_BUCKET_MEDIA = aws.s3Buckets.media;
      process.env.AWS_REGION = aws.region;

      // Load GitHub config
      const github = await this.getSecret('github');
      process.env.GITHUB_TOKEN = github.token;
      process.env.GITHUB_OWNER = github.owner;
      process.env.GITHUB_REPO = github.repo;

      // Load application secrets
      const app = await this.getSecret('application');
      process.env.SESSION_SECRET = app.sessionSecret;
      process.env.JWT_SECRET = app.jwtSecret;
      process.env.DOMAIN_NAME = app.domain;

      console.log('✅ All credentials loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load credentials from AWS:', error);
      throw error;
    }
  }

  /**
   * Validates IAM permissions for Secrets Manager
   */
  async validatePermissions(): Promise<boolean> {
    try {
      // Try to list secrets (requires secretsmanager:ListSecrets)
      await this.listSecrets();

      // Try to describe a test secret (requires secretsmanager:DescribeSecret)
      const testSecretName = `${this.secretPrefix}/test-permission`;
      try {
        const command = new DescribeSecretCommand({
          SecretId: testSecretName,
        });
        await this.client.send(command);
      } catch (error: any) {
        if (!(error instanceof ResourceNotFoundException)) {
          throw error;
        }
      }

      console.log('✅ AWS Secrets Manager permissions validated');
      return true;
    } catch (error) {
      console.error('❌ Insufficient AWS Secrets Manager permissions:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new AWSSecretsManager();
