# Deployment Architecture

**Frontend:** AWS CloudFront + S3  
**Backend:** AWS Lambda + API Gateway  
**CI/CD:** GitHub Actions with automated testing and deployment

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|------------|--------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:4000 | Local development |
| Staging | https://staging.farmcalc.app | https://api-staging.farmcalc.app | Pre-production testing |
| Production | https://farmcalc.app | https://api.farmcalc.app | Live environment |
