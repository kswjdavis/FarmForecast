# Epic 1: Project Foundation & Infrastructure Setup (REVISED)

**Epic ID:** FARM-EPIC-001  
**Priority:** P0 - Critical Path  
**Duration:** Sprint 1-2 (2 weeks)  
**Dependencies:** None  
**Value Delivered:** Development environment ready with all external services configured

## ⚠️ CRITICAL BLOCKING REQUIREMENT

**THIS EPIC CANNOT START WITHOUT COMPLETING STORY 1.0**

---

## User Stories

### 🔴 Story 1.0: External Service Prerequisites [USER ACTION REQUIRED]
**Points:** 0 (User task)  
**Assignee:** Product Owner / Project Sponsor  
**Type:** BLOCKING PREREQUISITE  
**Status:** ⛔ BLOCKS ALL OTHER STORIES

**Definition of Done:**
```yaml
verification_gates:
  - neo4j_connection: VERIFIED ✓
  - aws_account: ACTIVE ✓
  - weather_api: CONTRACTED ✓
  - credentials_stored: SECURE ✓
  - verification_script: PASSING ✓
```

**REQUIRED USER ACTIONS:**

#### A. Neo4j Aura Setup
```bash
# BLOCKER FOR: Story 1.3, 1.4, 1.5
ACTION: Create Neo4j Aura Professional account
URL: https://neo4j.com/cloud/aura/
DELIVERABLE: Connection string and credentials
VERIFICATION: npm run verify:neo4j
```

#### B. AWS Account Setup
```bash
# BLOCKER FOR: Story 1.5, 1.6, All deployments
ACTION: Create/configure AWS account with billing alerts
DELIVERABLE: IAM user with programmatic access
VERIFICATION: npm run verify:aws
```

#### C. Weather API Contracts
```bash
# BLOCKER FOR: Epic 2, Phase 1a value delivery
ACTION: Contract with Weather 20/20 and Kansas Mesonet
DELIVERABLE: API keys and rate limits documented
VERIFICATION: npm run verify:weather
```

#### D. GitHub & Domain Setup
```bash
# BLOCKER FOR: Story 1.1, 1.7
ACTION: Create GitHub org and register domain
DELIVERABLE: Repository access and DNS configuration
VERIFICATION: npm run verify:github
```

**AUTOMATED GATE CHECK:**
```typescript
// This code MUST pass before Story 1.1 can begin
async function verifyPrerequisites(): boolean {
  const checks = {
    neo4j: await testNeo4jConnection(),
    aws: await testAWSAccess(),
    weather: await testWeatherAPIs(),
    github: await testGitHubAccess()
  };
  
  if (Object.values(checks).includes(false)) {
    throw new Error('CANNOT PROCEED: Prerequisites not met');
  }
  return true;
}
```

---

### Story 1.1: Credential Management Infrastructure [MUST BE SECOND]
**Points:** 5  
**Assignee:** Security Engineer  
**Depends on:** Story 1.0 COMPLETE  
**Blocks:** ALL other stories

**Definition of Done:**
- Secure credential storage system implemented
- AWS Secrets Manager configured
- Local .env.vault system created
- Verification scripts functional
- CI/CD can access credentials securely

**Implementation:**
```bash
#!/bin/bash
# setup-credentials.sh - RUNS AUTOMATICALLY

# 1. Create credential structure
mkdir -p .credentials/{local,staging,production}

# 2. Initialize vault
npm run init:vault

# 3. Store user-provided credentials
read -p "Neo4j URI: " NEO4J_URI
read -p "Neo4j Password: " -s NEO4J_PASSWORD
read -p "AWS Access Key: " AWS_ACCESS_KEY_ID
read -p "AWS Secret Key: " -s AWS_SECRET_ACCESS_KEY

# 4. Encrypt and store
npm run vault:store

# 5. Verify all connections
npm run verify:all || exit 1

echo "✅ Credentials verified and stored securely"
```

**Verification Gate:**
```javascript
// gate-check.js - Runs before EVERY story
const requiredSecrets = [
  'NEO4J_URI',
  'NEO4J_PASSWORD',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY'
];

function checkCredentials() {
  const missing = requiredSecrets.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ BLOCKED: Missing credentials: ${missing.join(', ')}`);
    console.error('Run: npm run setup:credentials');
    process.exit(1);
  }
}

// This runs in EVERY npm script
checkCredentials();
```

---

### Story 1.2: Repository Initialization with Credential Guards
**Points:** 3  
**Assignee:** DevOps Engineer  
**Depends on:** Story 1.1 COMPLETE  

**Definition of Done:**
- Repository created with credential leak prevention
- Pre-commit hooks block credential commits
- .gitignore properly configured
- Credential scanner in CI/CD

**Automated Protections:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        
  - repo: local
    hooks:
      - id: verify-credentials
        name: Verify credential access
        entry: npm run verify:credentials
        language: system
        always_run: true
        fail_fast: true  # STOPS commit if credentials missing
```

---

### Story 1.3: Development Environment with Credential Injection
**Points:** 5  
**Assignee:** Full Stack Developer  
**Depends on:** Stories 1.0, 1.1, 1.2 COMPLETE  

**Definition of Done:**
- Docker Compose uses credential vault
- Environment variables auto-loaded
- Credential rotation supported
- Developer onboarding automated

**Docker Compose Integration:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  neo4j:
    image: neo4j:5.12-enterprise
    env_file:
      - .credentials/local/.env.neo4j  # Auto-generated from vault
    healthcheck:
      test: ["CMD", "npm", "run", "verify:neo4j"]
      interval: 30s
      retries: 3
      start_period: 40s
      
  api:
    build: ./apps/api
    environment:
      - CREDENTIAL_VAULT=/run/secrets/vault
    secrets:
      - vault
    depends_on:
      neo4j:
        condition: service_healthy
```

---

### Story 1.4: Neo4j Database Setup with Connection Verification
**Points:** 8  
**Assignee:** Backend Developer  
**Depends on:** Story 1.0.A (Neo4j account created)  
**Gate:** CANNOT START without verified Neo4j credentials

**Pre-Story Verification:**
```javascript
// Runs automatically before story tasks
async function preStoryCheck() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );
  
  try {
    await driver.verifyConnectivity();
    console.log('✅ Neo4j connection verified');
  } catch (error) {
    console.error('❌ BLOCKED: Neo4j connection failed');
    console.error('ACTION REQUIRED: Complete Story 1.0.A first');
    process.exit(1);
  } finally {
    await driver.close();
  }
}
```

---

### Story 1.5: CI/CD Pipeline with Credential Gates
**Points:** 8  
**Assignee:** DevOps Engineer  
**Depends on:** Stories 1.0, 1.1 COMPLETE  

**GitHub Actions Integration:**
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  verify-prerequisites:
    runs-on: ubuntu-latest
    steps:
      - name: Verify External Services
        run: |
          # This job FAILS if any service is unreachable
          npm run verify:all
        env:
          NEO4J_URI: ${{ secrets.NEO4J_URI }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          WEATHER_API_KEY: ${{ secrets.WEATHER_API_KEY }}
          
      - name: Gate Check
        if: failure()
        run: |
          echo "::error::External services not configured. Complete Story 1.0 first."
          exit 1
          
  build:
    needs: verify-prerequisites  # Cannot build without verification
    runs-on: ubuntu-latest
    # ... rest of build
```

---

### Story 1.6: AWS Infrastructure with Account Verification
**Points:** 13  
**Assignee:** Cloud Architect  
**Depends on:** Story 1.0.B (AWS account) COMPLETE  
**Gate:** AWS credentials must be verified

**Pre-Deployment Check:**
```typescript
// cdk-deploy.ts
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

async function verifyAWSAccount() {
  const client = new STSClient({ region: "us-west-2" });
  
  try {
    const command = new GetCallerIdentityCommand({});
    const response = await client.send(command);
    console.log(`✅ AWS Account verified: ${response.Account}`);
    
    // Verify it's the correct account
    if (response.Account !== process.env.EXPECTED_AWS_ACCOUNT) {
      throw new Error('Wrong AWS account!');
    }
  } catch (error) {
    console.error('❌ DEPLOYMENT BLOCKED: AWS account not configured');
    console.error('ACTION: Complete Story 1.0.B first');
    process.exit(1);
  }
}

// This runs BEFORE any CDK commands
verifyAWSAccount();
```

---

### Story 1.7: Developer Onboarding Automation
**Points:** 3  
**Assignee:** Technical Writer  
**Depends on:** Stories 1.0-1.6 COMPLETE  

**Automated Onboarding Script:**
```bash
#!/bin/bash
# onboard-developer.sh

echo "🚀 FarmCalc Developer Onboarding"
echo "================================"

# Step 1: Verify prerequisites
echo "Checking external service access..."
npm run verify:prerequisites || {
  echo "❌ Prerequisites not met. Contact project owner."
  echo "They must complete Story 1.0 first."
  exit 1
}

# Step 2: Setup local credentials
echo "Setting up secure credential access..."
npm run setup:developer-credentials

# Step 3: Verify everything works
echo "Running verification suite..."
npm run verify:all || {
  echo "❌ Verification failed. Check credentials."
  exit 1
}

echo "✅ Onboarding complete! You can now run: npm run dev"
```

---

## Epic Acceptance Criteria with Gates

```typescript
// epic-1-acceptance.test.ts
describe('Epic 1 Acceptance', () => {
  it('MUST have all external services configured', async () => {
    const services = await verifyAllExternalServices();
    expect(services.neo4j).toBe('connected');
    expect(services.aws).toBe('authenticated');
    expect(services.weather).toBe('api_key_valid');
  });
  
  it('MUST have secure credential management', async () => {
    const vault = await testCredentialVault();
    expect(vault.encrypted).toBe(true);
    expect(vault.accessible).toBe(true);
    expect(vault.git_ignored).toBe(true);
  });
  
  it('MUST prevent development without credentials', async () => {
    // Simulate missing credentials
    delete process.env.NEO4J_URI;
    
    // Verify development is blocked
    await expect(runDevelopmentServer()).rejects.toThrow(
      'BLOCKED: Missing required credentials'
    );
  });
});
```

---

## Enforcement Mechanisms

### 1. Package.json Scripts
```json
{
  "scripts": {
    "predev": "npm run verify:credentials",
    "dev": "npm run _dev",
    "pretest": "npm run verify:credentials",
    "test": "npm run _test",
    "prebuild": "npm run verify:credentials",
    "build": "npm run _build",
    "verify:credentials": "node scripts/verify-credentials.js",
    "setup:credentials": "node scripts/setup-credentials.js"
  }
}
```

### 2. Git Hooks
```bash
# .husky/pre-commit
#!/bin/sh
npm run verify:credentials || {
  echo "❌ Cannot commit without verified credentials"
  exit 1
}
```

### 3. CI/CD Gates
Every GitHub Action job starts with credential verification, preventing any builds or deployments without proper setup.

---

## Why This Works

1. **Story 1.0 is IMPOSSIBLE to skip** - All other stories have technical dependencies on it
2. **Automated verification** - Scripts verify connections before allowing work
3. **Git hooks prevent progress** - Can't even commit code without credentials
4. **CI/CD enforces compliance** - Builds fail without external services
5. **Developer experience** - Clear error messages guide to Story 1.0 completion

This structure makes external dependency configuration an integral part of the development flow, not an optional checklist.