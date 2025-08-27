#!/usr/bin/env node

/**
 * Credential Verification Script
 * Validates all external service connections before development
 */

import { config } from 'dotenv';
import neo4j from 'neo4j-driver';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { promises as fs } from 'fs';

config();

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
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`),
};

// Track verification results
const results = {
  required: {},
  optional: {},
  warnings: [],
};

// Retry logic with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        log.warning(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// 1. Check Neo4j Connection
async function verifyNeo4j() {
  log.header('Neo4j Database Connection');

  if (!process.env.NEO4J_URI || !process.env.NEO4J_PASSWORD) {
    log.error('NEO4J_URI or NEO4J_PASSWORD not set');
    results.required.neo4j = false;
    return false;
  }

  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME || 'neo4j', process.env.NEO4J_PASSWORD)
  );

  try {
    await retryWithBackoff(
      async () => {
        await driver.verifyConnectivity();
        const session = driver.session();
        await session.run('RETURN 1 as test');
        await session.close();
      },
      3,
      2000
    );

    log.success(`Connected to Neo4j at ${process.env.NEO4J_URI}`);
    log.info(`Database: ${process.env.NEO4J_DATABASE || 'neo4j'}`);
    results.required.neo4j = true;
    return true;
  } catch (error) {
    log.error(`Neo4j connection failed: ${error.message}`);
    results.required.neo4j = false;
    return false;
  } finally {
    await driver.close();
  }
}

// 2. Check AWS Credentials
async function verifyAWS() {
  log.header('AWS Credentials');

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    log.error('AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not set');
    results.required.aws = false;
    return false;
  }

  const client = new STSClient({
    region: process.env.AWS_REGION || 'us-west-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const response = await retryWithBackoff(
      async () => {
        const command = new GetCallerIdentityCommand({});
        return await client.send(command);
      },
      3,
      1500
    );

    log.success(`AWS Account verified: ${response.Account}`);
    log.info(`User ARN: ${response.Arn}`);
    log.info(`Region: ${process.env.AWS_REGION || 'us-west-2'}`);

    if (process.env.AWS_ACCOUNT_ID && response.Account !== process.env.AWS_ACCOUNT_ID) {
      log.warning(
        `Account ID mismatch! Expected: ${process.env.AWS_ACCOUNT_ID}, Got: ${response.Account}`
      );
      results.warnings.push('AWS account ID mismatch');
    }

    results.required.aws = true;
    return true;
  } catch (error) {
    log.error(`AWS verification failed: ${error.message}`);
    results.required.aws = false;
    return false;
  }
}

// 3. Check Weather APIs
async function verifyWeatherAPIs() {
  log.header('Weather API Services');

  const weatherServices = [
    {
      name: 'Visual Crossing',
      required: true,
      envKey: 'VISUALCROSSING_API_KEY',
      urlKey: 'VISUALCROSSING_API_URL',
      testEndpoint: '/timeline/test/today',
      testUrl:
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Kansas City/today',
    },
    {
      name: 'NOAA',
      required: true,
      envKey: 'NOAA_API_TOKEN',
      urlKey: 'NOAA_API_URL',
      testEndpoint: '/stations',
      testUrl: 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?limit=1',
    },
    {
      name: 'OpenWeather',
      required: false,
      envKey: 'OPENWEATHER_API_KEY',
      urlKey: 'OPENWEATHER_API_URL',
      testEndpoint: null,
    },
    {
      name: 'Kansas Mesonet',
      required: false,
      envKey: 'MESONET_API_KEY',
      urlKey: 'MESONET_API_URL',
      testEndpoint: '/stations',
    },
  ];

  let allRequiredPass = true;

  for (const service of weatherServices) {
    if (!process.env[service.envKey]) {
      if (service.required) {
        log.error(`${service.name}: API key not set (${service.envKey})`);
        results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
        allRequiredPass = false;
      } else {
        log.warning(`${service.name}: API key not set (optional)`);
        results.optional[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
      }
      continue;
    }

    // Test actual API connectivity for required services
    if (service.name === 'Visual Crossing') {
      try {
        const testUrl = `${service.testUrl}?key=${process.env[service.envKey]}&unitGroup=us&include=current`;
        const response = await fetch(testUrl);

        if (response.ok) {
          log.success(`${service.name}: API key verified (1000 requests/day free tier)`);
          results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = true;
        } else {
          log.error(`${service.name}: API returned ${response.status}`);
          results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
          allRequiredPass = false;
        }
      } catch (error) {
        log.error(`${service.name}: Connection failed - ${error.message}`);
        results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
        allRequiredPass = false;
      }
    } else if (service.name === 'NOAA') {
      try {
        const response = await fetch(service.testUrl, {
          headers: { token: process.env[service.envKey] },
        });

        if (response.ok) {
          log.success(`${service.name}: API token verified (free government data)`);
          results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = true;
        } else {
          log.error(`${service.name}: API returned ${response.status}`);
          results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
          allRequiredPass = false;
        }
      } catch (error) {
        log.error(`${service.name}: Connection failed - ${error.message}`);
        results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = false;
        allRequiredPass = false;
      }
    } else {
      // Optional services - just check key exists
      if (service.required) {
        log.success(`${service.name}: API key configured`);
        results.required[service.name.toLowerCase().replace(/\s+/g, '_')] = true;
      } else {
        log.success(`${service.name}: API key configured (optional)`);
        results.optional[service.name.toLowerCase().replace(/\s+/g, '_')] = true;
      }
    }
  }

  return allRequiredPass;
}

// 4. Check Optional Services
async function verifyOptionalServices() {
  log.header('Optional Services');

  const optionalServices = [
    { name: 'SendGrid', envKey: 'SENDGRID_API_KEY' },
    { name: 'Twilio', envKey: 'TWILIO_ACCOUNT_SID' },
    { name: 'Stripe', envKey: 'STRIPE_SECRET_KEY' },
    { name: 'Datadog', envKey: 'DATADOG_API_KEY' },
    { name: 'Sentry', envKey: 'SENTRY_DSN' },
    { name: 'GitHub', envKey: 'GITHUB_TOKEN' },
    { name: 'Redis', envKey: 'REDIS_URL' },
  ];

  for (const service of optionalServices) {
    if (process.env[service.envKey]) {
      log.success(`${service.name}: Configured`);
      results.optional[service.name.toLowerCase()] = true;
    } else {
      log.info(`${service.name}: Not configured (optional)`);
      results.optional[service.name.toLowerCase()] = false;
    }
  }
}

// 5. Create .env file if it doesn't exist
async function ensureEnvFile() {
  try {
    await fs.access('.env');
    log.info('Using existing .env file');
  } catch {
    log.warning('.env file not found, creating from .env.example');
    try {
      const template = await fs.readFile('.env.example', 'utf8');
      await fs.writeFile('.env', template);
      log.success('.env file created - Please fill in your credentials');
      return false;
    } catch (error) {
      log.error(`Failed to create .env file: ${error.message}`);
      return false;
    }
  }
  return true;
}

// 6. Generate verification report
async function generateReport() {
  log.header('Verification Summary');

  const requiredServices = Object.keys(results.required);
  const requiredPassed = requiredServices.filter((s) => results.required[s]);
  const requiredFailed = requiredServices.filter((s) => !results.required[s]);

  const optionalServices = Object.keys(results.optional);
  const optionalConfigured = optionalServices.filter((s) => results.optional[s]);

  console.log('\n📊 Required Services:');
  requiredPassed.forEach((s) => log.success(s));
  requiredFailed.forEach((s) => log.error(s));

  console.log('\n📊 Optional Services:');
  optionalConfigured.forEach((s) => log.info(`${s} (configured)`));

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach((w) => log.warning(w));
  }

  const allRequiredPass = requiredFailed.length === 0;

  console.log('\n' + '='.repeat(50));
  if (allRequiredPass) {
    log.success('✅ All required services verified successfully!');
    log.info('You can now run: npm run dev');
  } else {
    log.error('❌ Some required services failed verification');
    log.info('Please check your .env file and service configurations');
  }

  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    required: results.required,
    optional: results.optional,
    warnings: results.warnings,
    passed: allRequiredPass,
  };

  await fs.writeFile('credential-verification-report.json', JSON.stringify(report, null, 2));
  log.info('Report saved to: credential-verification-report.json');

  return allRequiredPass;
}

// Main execution
async function main() {
  console.log('🔒 FarmForecast Credential Verification');
  console.log('='.repeat(50));

  // Check for .env file
  const envExists = await ensureEnvFile();
  if (!envExists) {
    process.exit(1);
  }

  // Run verifications
  await verifyNeo4j();
  await verifyAWS();
  await verifyWeatherAPIs();
  await verifyOptionalServices();

  // Generate report
  const passed = await generateReport();

  process.exit(passed ? 0 : 1);
}

// Run if executed directly
main().catch((error) => {
  console.error('Verification script failed:', error);
  process.exit(1);
});

export { verifyNeo4j, verifyAWS, verifyWeatherAPIs };
