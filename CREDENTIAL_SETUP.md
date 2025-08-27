# FarmForecast Credential Setup Guide

**Version:** 2.0  
**Last Updated:** 2025-08-27  
**Status:** Story 1.1 Implementation Complete

## Quick Start

For new developers, run the automated setup:
```bash
bash scripts/onboard-developer.sh
```

For existing environments, migrate to encrypted vault:
```bash
node scripts/migrate-to-vault.js
```

For manual setup:
```bash
cp .env.example .env
# Edit .env with your credentials
npm run verify:all
```

## Story 1.0 Status: ✅ COMPLETE

All external service credentials have been configured:
- ✅ Neo4j Aura Database: `c2de91f6.databases.neo4j.io`
- ✅ AWS Account: Configured with IAM user
- ✅ Visual Crossing Weather API: 1000 requests/day
- ✅ NOAA Climate Data: Free government access
- ✅ GitHub Repository: kswjdavis/FarmForecast

## Credential Management Architecture

### Three-Layer Security Model

1. **Local Development**: Plain `.env` file (git-ignored)
2. **Encrypted Vault**: AES-256 encrypted `.env.vault` files
3. **AWS Secrets Manager**: Production credential storage

### Directory Structure
```
.credentials/
├── local/
│   ├── .env.vault       # Encrypted credentials
│   └── DOTENV_KEY       # Decryption key (NEVER commit)
├── staging/
│   ├── .env.vault
│   └── DOTENV_KEY
├── production/
│   ├── .env.vault
│   └── DOTENV_KEY
└── backups/             # Timestamped backups
```

## Required Services Setup

### 1. Neo4j Aura (Graph Database)

**Sign up at:** https://neo4j.com/cloud/aura/

1. Create a free or professional instance
2. Choose "Blank Database"
3. Save the connection details:
   - Connection URI (looks like: `neo4j+s://xxxxxxxx.databases.neo4j.io`)
   - Username (usually `neo4j`)
   - Generated password

**Add to .env:**
```bash
NEO4J_URI=neo4j+s://c2de91f6.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=[secure-password]
NEO4J_DATABASE=neo4j
```

### 2. AWS Account

**Sign up at:** https://aws.amazon.com/

1. Create IAM user with programmatic access
2. Attach policies:
   - AmazonS3FullAccess (for data storage)
   - AmazonEC2ContainerRegistryFullAccess (for Docker)
   - SecretsManagerReadWrite (for credential storage)
3. Create access keys

**Add to .env:**
```bash
AWS_ACCESS_KEY_ID=AKIA42XTUYNZTLF7WDPQ
AWS_SECRET_ACCESS_KEY=[secure-key]
AWS_REGION=us-west-2
```

### 3. Weather APIs

#### Visual Crossing (Primary)
**Sign up at:** https://www.visualcrossing.com/weather-api

- **Purpose**: Historical data, current conditions, and forecasts
- **Free Tier**: 1000 requests per day
- **Documentation**: https://www.visualcrossing.com/resources/documentation/

**Add to .env:**
```bash
VISUALCROSSING_API_KEY=[your-visual-crossing-key]
VISUALCROSSING_API_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services
```

#### NOAA Climate Data (Required)
**Sign up at:** https://www.ncdc.noaa.gov/cdo-web/token

- **Purpose**: Historical US climate data
- **Cost**: Free (government data)
- **Documentation**: https://www.ncdc.noaa.gov/cdo-web/webservices/v2

**Add to .env:**
```bash
NOAA_API_TOKEN=[your-noaa-token]
NOAA_API_URL=https://www.ncdc.noaa.gov/cdo-web/api/v2
NOAA_EMAIL=[your-email]
```

## Setup Instructions

### Automated Setup (Recommended)

```bash
# For new developers
bash scripts/onboard-developer.sh

# For existing .env migration
node scripts/migrate-to-vault.js
```

### Manual Setup

#### Step 1: Copy Environment Template
```bash
cp .env.example .env
```

#### Step 2: Fill in your credentials
Edit `.env` with your actual credentials from the services above.

#### Step 3: Install dependencies
```bash
npm install
```

#### Step 4: Encrypt Credentials (Production)

```bash
# Create encrypted vault
npx @dotenvx/dotenvx encrypt -f .env -o .credentials/local/.env.vault

# Generate and save decryption key
echo "dotenv://:key_$(openssl rand -base64 32)@dotenvx.com/vault/.env.vault?environment=$(date +%s)" > .credentials/local/DOTENV_KEY
```

#### Step 5: Store in AWS Secrets Manager

```bash
# Store all credentials in AWS
node -e "require('./src/services/aws-secrets.js').default.storeAllCredentials()"
```

#### Step 6: Verify Credentials

```bash
npm run verify:all
```

## CI/CD Configuration

### GitHub Actions Secrets

Required secrets in GitHub repository settings:
```
NEO4J_URI
NEO4J_USERNAME  
NEO4J_PASSWORD
NEO4J_DATABASE
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
VISUALCROSSING_API_KEY
VISUALCROSSING_API_URL
NOAA_API_TOKEN
NOAA_API_URL
GH_TOKEN
DOTENV_KEY
```

### Pre-commit Hooks

Automatically installed to prevent credential leaks:
```bash
# Installed via husky
.husky/pre-commit
```

## Verification Commands

Multiple verification methods available:
```bash
# Verify all services
npm run verify:all

# Verify specific service
npm run verify:neo4j
npm run verify:aws
npm run verify:weather

# Generate verification report
npm run verify:report
```

The enhanced verification includes:
- Neo4j connection with retry logic
- AWS STS identity verification
- Visual Crossing API connectivity test
- NOAA API token validation
- Connection pool testing
- Exponential backoff for retries
- Detailed JSON report generation

## Security Best Practices

### DO's
- ✅ Use encrypted vaults for production
- ✅ Rotate credentials every 30-90 days
- ✅ Use AWS Secrets Manager for cloud deployments
- ✅ Keep DOTENV_KEY files in password manager
- ✅ Use different keys per environment
- ✅ Run pre-commit hooks

### DON'Ts
- ❌ Never commit .env files
- ❌ Never commit DOTENV_KEY files
- ❌ Never log credentials
- ❌ Never share credentials via email/Slack
- ❌ Never use production credentials locally

## Rotation Procedures

### Manual Rotation
```bash
# Rotate vault encryption key
node -e "require('./src/utils/vault-manager.js').default.rotateEncryptionKey('local')"
```

### AWS Secrets Manager Rotation
```bash
# Configure 30-day rotation
aws secretsmanager rotate-secret \
  --secret-id farmforecast/neo4j \
  --rotation-lambda-arn arn:aws:lambda:...
```

## Optional Services

### SendGrid (Email)
**Sign up at:** https://sendgrid.com/
- Free tier: 100 emails/day

### Twilio (SMS)
**Sign up at:** https://www.twilio.com/
- Trial account includes free credits

### Datadog (Monitoring)
**Sign up at:** https://www.datadoghq.com/
- 14-day free trial, then free tier available

### Sentry (Error Tracking)
**Sign up at:** https://sentry.io/
- Free tier: 5,000 events/month

## Troubleshooting

### Neo4j Connection Failed
- Check if your IP is whitelisted in Neo4j Console
- Verify the connection string includes `neo4j+s://` for secure connection
- Ensure password doesn't contain special characters that need escaping
- Check connection pool settings in DATABASE_POOL_MIN/MAX

### AWS Credentials Invalid
- Check if access keys are active in IAM console
- Verify the region matches your AWS setup
- Ensure IAM user has required permissions
- Test with AWS CLI: `aws sts get-caller-identity`

### Weather API Issues

**Visual Crossing:**
- Check API key in dashboard: https://www.visualcrossing.com/account
- Verify you haven't exceeded 1000 requests/day limit
- Test endpoint: `/timeline/test/today?key=YOUR_KEY&unitGroup=us`

**NOAA:**
- Token must be included in header: `token: YOUR_TOKEN`
- Check token status at: https://www.ncdc.noaa.gov/cdo-web/token
- Rate limit: 5 requests/second, 10,000 requests/day

### Vault Decryption Failed
- Check DOTENV_KEY file exists in `.credentials/[env]/`
- Verify key format: `dotenv://:key_...@dotenvx.com/vault/...`
- Try decrypting manually: `npx @dotenvx/dotenvx decrypt -f .credentials/local/.env.vault`

## For AI Agents

When AI agents work on stories, they will:
1. Automatically load credentials from vault or `.env`
2. Verify connections before starting work using retry logic
3. Report any credential issues immediately
4. Mask sensitive data in logs
5. Run pre-commit hooks to prevent credential exposure

The verification script ensures all services are accessible before development begins, preventing blocked stories due to missing credentials.

## Migration from Story 1.0

Since Story 1.0 credentials are already in `.env`:
1. Run migration script: `node scripts/migrate-to-vault.js`
2. This creates encrypted vaults for all environments
3. Original `.env` remains for backward compatibility
4. Production deployments use vault or AWS Secrets Manager

## Support

If you need help setting up any service:
1. Check the service's documentation (linked above)
2. Review error messages from `npm run verify:all`
3. Check the verification report: `credential-verification-report.json`
4. Contact the project lead with specific error messages
5. Review CI/CD logs in GitHub Actions for deployment issues