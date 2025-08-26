# Critical Implementation Standards

## No Unauthorized Fallbacks
- ALL development must use real APIs and actual data sources
- Mock data only with explicit written approval
- No automatic fallbacks without user consent
- Real data requirements enforced at all levels

## Coding Standards
- **Type Sharing:** Always use packages/shared for types
- **API Calls:** Never direct HTTP - use service layer
- **Environment Variables:** Access through config objects only
- **Graph Queries:** Parameterized statements only
- **Herbicide Validation:** Always check plant-back restrictions
