# FarmForecast Credential Setup Guide

## Quick Start

1. Copy the template: `cp .env.example .env`
2. Fill in your credentials (see below)
3. Run verification: `npm run verify:all`

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
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-generated-password
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
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your-secret-key-here
AWS_REGION=us-west-2
AWS_ACCOUNT_ID=123456789012
```

### 3. Weather APIs

#### Weather 20/20 (Primary Historical Data)
**Contact:** https://weather2020.com/api-access/

This is a commercial service for agricultural weather data.
- Request API access for agricultural use
- Mention you need historical weather data for crop modeling

**Add to .env:**
```bash
WEATHER2020_API_KEY=your-api-key
WEATHER2020_API_URL=https://api.weather2020.com/v1
WEATHER2020_ACCOUNT_ID=your-account-id
```

#### Kansas Mesonet (Real-time Kansas Data)
**Sign up at:** https://mesonet.k-state.edu/about/register/

- Free for educational/research use
- Provides real-time Kansas weather station data

**Add to .env:**
```bash
MESONET_API_KEY=your-api-key
MESONET_API_URL=https://mesonet.k-state.edu/api/v2
MESONET_STATION_IDS=Manhattan,Colby,Garden City
```

#### OpenWeather API (Backup/Global)
**Sign up at:** https://openweathermap.org/api

- Free tier available (1,000 calls/day)
- Good for forecast and current weather

**Add to .env:**
```bash
OPENWEATHER_API_KEY=your-api-key
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

#### NOAA API (Free Government Data)
**Sign up at:** https://www.ncdc.noaa.gov/cdo-web/token

- Completely free
- US government weather data
- Rate limited but reliable

**Add to .env:**
```bash
NOAA_API_TOKEN=your-token
NOAA_API_URL=https://www.ncdc.noaa.gov/cdo-web/api/v2
```

## Optional Services

### SendGrid (Email)
**Sign up at:** https://sendgrid.com/

Free tier: 100 emails/day

### Twilio (SMS)
**Sign up at:** https://www.twilio.com/

Trial account includes free credits

### Datadog (Monitoring)
**Sign up at:** https://www.datadoghq.com/

14-day free trial, then free tier available

### Sentry (Error Tracking)
**Sign up at:** https://sentry.io/

Free tier: 5,000 events/month

## Verification Commands

```bash
# Check all credentials
npm run verify:all

# Check specific services
npm run verify:neo4j
npm run verify:aws
npm run verify:weather

# Generate verification report
npm run verify:report
```

## Security Notes

1. **NEVER commit .env to git** - It's in .gitignore by default
2. **Use strong passwords** - Especially for database and AWS
3. **Rotate credentials regularly** - Every 90 days minimum
4. **Use separate credentials for each environment** - Dev/Staging/Prod

## Troubleshooting

### Neo4j Connection Failed
- Check if your IP is whitelisted in Neo4j Console
- Verify the connection string includes `neo4j+s://` for secure connection
- Ensure password doesn't contain special characters that need escaping

### AWS Credentials Invalid
- Check if access keys are active in IAM console
- Verify the region matches your AWS setup
- Ensure IAM user has required permissions

### Weather API Issues
- Most weather APIs require account verification (check email)
- Some have IP restrictions - check dashboard
- Rate limits may apply - check your plan

## For AI Agents

When AI agents work on stories, they will:
1. Automatically read credentials from `.env`
2. Verify connections before starting work
3. Report any credential issues immediately

The verification script ensures all services are accessible before development begins, preventing blocked stories due to missing credentials.

## Support

If you need help setting up any service:
1. Check the service's documentation (linked above)
2. Review error messages from `npm run verify:all`
3. Contact the project lead with specific error messages