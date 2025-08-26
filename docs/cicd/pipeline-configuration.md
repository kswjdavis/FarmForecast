# FarmCalc CI/CD Pipeline Configuration

## Overview

FarmCalc uses GitHub Actions for continuous integration and AWS CDK for infrastructure deployment. The pipeline ensures code quality, automated testing, security scanning, and zero-downtime deployments.

## Pipeline Architecture

```mermaid
graph LR
    A[Developer Push] --> B[GitHub Actions]
    B --> C{Branch?}
    C -->|PR| D[CI Pipeline]
    C -->|main| E[CD Pipeline]
    D --> F[Tests]
    D --> G[Linting]
    D --> H[Security Scan]
    E --> I[Build]
    E --> J[Deploy Staging]
    J --> K[E2E Tests]
    K --> L[Deploy Production]
    L --> M[Smoke Tests]
    M --> N[Monitoring]
```

## GitHub Actions Workflows

### Main CI/CD Pipeline

```yaml
# .github/workflows/main.yml
name: Main CI/CD Pipeline

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  PYTHON_VERSION: '3.11'
  PNPM_VERSION: '8'
  AWS_REGION: 'us-west-2'

jobs:
  # ============= QUALITY CHECKS =============
  quality:
    name: Code Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.pnpm-store
            **/node_modules
          key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run Prettier check
        run: pnpm format:check

      - name: Type checking
        run: pnpm type-check

  # ============= TESTING =============
  test-frontend:
    name: Frontend Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup environment
        uses: ./.github/actions/setup-frontend
        
      - name: Run unit tests
        run: pnpm --filter=web test:unit
        
      - name: Run integration tests
        run: pnpm --filter=web test:integration
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/web/coverage/lcov.info
          flags: frontend

  test-backend:
    name: Backend Tests
    runs-on: ubuntu-latest
    needs: quality
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      neo4j:
        image: neo4j:5.12
        env:
          NEO4J_AUTH: neo4j/testpass
        ports:
          - 7687:7687
          
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          
      - name: Cache pip packages
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
          
      - name: Install dependencies
        run: |
          cd apps/api
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
          
      - name: Run tests with coverage
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost/farmcalc
          NEO4J_URI: bolt://localhost:7687
          NEO4J_PASSWORD: testpass
        run: |
          cd apps/api
          pytest --cov=. --cov-report=xml --cov-report=html
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./apps/api/coverage.xml
          flags: backend

  # ============= SECURITY =============
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
          
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
          
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'FarmCalc'
          path: '.'
          format: 'HTML'

  # ============= BUILD =============
  build:
    name: Build Applications
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend, security]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup build environment
        uses: ./.github/actions/setup-build
        
      - name: Build frontend
        run: |
          pnpm --filter=web build
          
      - name: Build API Docker image
        run: |
          docker build -t farmcalc-api:${{ github.sha }} ./apps/api
          
      - name: Build ML service Docker image
        run: |
          docker build -t farmcalc-ml:${{ github.sha }} ./apps/ml-service
          
      - name: Push to ECR
        env:
          AWS_REGION: ${{ env.AWS_REGION }}
        run: |
          aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag farmcalc-api:${{ github.sha }} $ECR_REGISTRY/farmcalc-api:${{ github.sha }}
          docker push $ECR_REGISTRY/farmcalc-api:${{ github.sha }}

  # ============= DEPLOY STAGING =============
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.farmcalc.com
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
          
      - name: Deploy infrastructure
        run: |
          cd infrastructure/cdk
          npm install
          npx cdk deploy --all --require-approval never \
            --context environment=staging \
            --context imageTag=${{ github.sha }}
            
      - name: Run database migrations
        run: |
          cd scripts
          ./run-migrations.sh staging
          
      - name: Deploy frontend to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npx vercel --prod --token=$VERCEL_TOKEN
          
      - name: Run smoke tests
        run: |
          cd tests/e2e
          npm run test:smoke -- --env=staging

  # ============= E2E TESTS =============
  e2e-tests:
    name: E2E Tests on Staging
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Playwright
        run: |
          cd tests/e2e
          npm install
          npx playwright install --with-deps
          
      - name: Run E2E tests
        env:
          BASE_URL: https://staging.farmcalc.com
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
        run: |
          cd tests/e2e
          npm run test:e2e
          
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: tests/e2e/playwright-report/

  # ============= DEPLOY PRODUCTION =============
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: e2e-tests
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://farmcalc.com
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.PROD_AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.PROD_AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
          
      - name: Blue-Green Deployment
        run: |
          cd infrastructure/cdk
          npm install
          
          # Deploy to green environment
          npx cdk deploy FarmCalcStack-Green --require-approval never \
            --context environment=production \
            --context imageTag=${{ github.sha }}
          
          # Run health checks
          ./scripts/health-check.sh green
          
          # Switch traffic to green
          aws elbv2 modify-listener \
            --listener-arn ${{ secrets.PROD_ALB_LISTENER_ARN }} \
            --default-actions Type=forward,TargetGroupArn=${{ secrets.GREEN_TG_ARN }}
          
          # Monitor for 10 minutes
          sleep 600
          
          # If successful, update blue environment later
          
      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
            
      - name: Send deployment notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment ${{ job.status }} for commit ${{ github.sha }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Database Migration Workflow

```yaml
# .github/workflows/migrations.yml
name: Database Migrations

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        default: 'staging'
        type: choice
        options:
          - development
          - staging
          - production
      direction:
        description: 'Migration direction'
        required: true
        default: 'up'
        type: choice
        options:
          - up
          - down

jobs:
  migrate:
    name: Run Migrations
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Neo4j migrations
        run: |
          docker run --rm \
            -v $(pwd)/migrations/neo4j:/liquibase/changelog \
            liquibase/liquibase-neo4j \
            --url="${{ secrets.NEO4J_URL }}" \
            --username=neo4j \
            --password="${{ secrets.NEO4J_PASSWORD }}" \
            ${{ github.event.inputs.direction }}
            
      - name: Run PostgreSQL migrations
        run: |
          flyway -url="${{ secrets.DATABASE_URL }}" \
            -user="${{ secrets.DB_USER }}" \
            -password="${{ secrets.DB_PASSWORD }}" \
            -locations=filesystem:./migrations/postgresql \
            ${{ github.event.inputs.direction }}
```

### Rollback Workflow

```yaml
# .github/workflows/rollback.yml
name: Emergency Rollback

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    name: Rollback Deployment
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - name: Rollback infrastructure
        run: |
          # Switch traffic back to blue environment
          aws elbv2 modify-listener \
            --listener-arn ${{ secrets.ALB_LISTENER_ARN }} \
            --default-actions Type=forward,TargetGroupArn=${{ secrets.BLUE_TG_ARN }}
            
      - name: Rollback database
        run: |
          ./scripts/rollback.sh ${{ github.event.inputs.version }}
          
      - name: Alert team
        uses: 8398a7/action-slack@v3
        with:
          status: 'warning'
          text: 'ROLLBACK: ${{ github.event.inputs.environment }} rolled back to ${{ github.event.inputs.version }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Infrastructure as Code (CDK)

```typescript
// infrastructure/cdk/lib/farmcalc-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class FarmCalcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // API Lambda function
    const apiFunction = new lambda.DockerImageFunction(this, 'ApiFunction', {
      code: lambda.DockerImageCode.fromEcr(repository, {
        tag: props.imageTag
      }),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NEO4J_URI: process.env.NEO4J_URI!,
        DATABASE_URL: process.env.DATABASE_URL!,
      }
    });

    // API Gateway
    const api = new apigateway.HttpApi(this, 'FarmCalcApi', {
      defaultIntegration: new apigateway.HttpLambdaIntegration(
        'ApiIntegration',
        apiFunction
      ),
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(api.url),
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url!,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: distribution.distributionDomainName,
      description: 'CloudFront URL',
    });
  }
}
```

## Monitoring and Alerts

```yaml
# .github/workflows/monitoring.yml
name: Deployment Monitoring

on:
  workflow_run:
    workflows: ["Main CI/CD Pipeline"]
    types: [completed]

jobs:
  monitor:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    steps:
      - name: Check application health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://farmcalc.com/health)
          if [ $response != "200" ]; then
            echo "Health check failed with status $response"
            exit 1
          fi
          
      - name: Check error rates
        run: |
          aws cloudwatch get-metric-statistics \
            --namespace AWS/Lambda \
            --metric-name Errors \
            --dimensions Name=FunctionName,Value=farmcalc-api \
            --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
            --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
            --period 300 \
            --statistics Sum
            
      - name: Performance check
        run: |
          # Check p95 latency
          aws cloudwatch get-metric-statistics \
            --namespace AWS/Lambda \
            --metric-name Duration \
            --dimensions Name=FunctionName,Value=farmcalc-api \
            --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
            --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
            --period 300 \
            --statistics Average,Maximum \
            --extended-statistics p95
```

## Local Development Setup

```bash
#!/bin/bash
# scripts/setup-local.sh

echo "Setting up local development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed."; exit 1; }

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Set up Python virtual environment
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cd ../..

# Start local services
docker-compose up -d

# Wait for services
echo "Waiting for services to start..."
sleep 10

# Run migrations
./scripts/run-migrations.sh local

# Seed data
python scripts/seed_data.py

echo "Local environment ready!"
echo "Run 'pnpm dev' to start the development servers"
```

## Deployment Checklist

- [ ] All tests passing
- [ ] Security scan clean
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team notified