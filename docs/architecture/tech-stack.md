# Tech Stack

## Core Technologies

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Runtime | Node.js | 20.x LTS | JavaScript runtime | Required for Next.js 14, native ESM support |
| Frontend Language | TypeScript | 5.5.4 | Type-safe frontend development | Prevents runtime errors in complex graph interactions |
| UI Library | React | 18.3.1 | Component-based UI | Required by Next.js, concurrent features |
| Frontend Framework | Next.js | 14.2.5 | React framework with SSR/SSG | Optimal SEO, API routes, App Router |
| UI Component Library | Material-UI (MUI) | 5.16.7 | Comprehensive component set | Accessible components, theming |
| State Management | Zustand | 4.5.5 | Lightweight state management | Simple API, TypeScript-first |
| GraphQL Client | Apollo Client | 3.10.8 | GraphQL client with caching | Optimistic UI, subscriptions, caching |
| Backend Language | Python | 3.12.4 | Backend services and ML | Best ML ecosystem, Neo4j maturity |
| Backend Framework | FastAPI | 0.112.0 | High-performance API framework | Async support, automatic docs |
| API Style | GraphQL | 16.9.0 | Flexible data fetching | Efficient graph queries, subscriptions |
| Database | Neo4j Aura DB | 5.x | Primary graph database | Purpose-built for relationships |
| Cache | Redis | 7.2.5 | Session and query cache | Sub-ms latency, PubSub |
| File Storage | AWS S3 | - | Object storage | Infinite scale, lifecycle policies |
| Authentication | AWS Cognito | - | Managed auth service | MFA support, social logins |
| Build Tool | Turborepo | 2.0.9 | Monorepo orchestration | Incremental builds, remote caching |
| Component Dev | Vite | 5.3.5 | Component library bundler only | Fast HMR for UI package development |
| IaC Tool | AWS CDK | 2.150.0 | Infrastructure as Code | Type-safe, CloudFormation output |
| CI/CD | GitHub Actions | - | Continuous Integration | Native GitHub integration |
| Monitoring | DataDog | - | APM and logging | Distributed tracing, metrics |
| Logging | AWS CloudWatch | - | Centralized logging | Native AWS integration |
| CSS Framework | Tailwind CSS | 3.4.7 | Utility-first CSS | Consistent spacing, tree-shaking |

## Backend Dependencies

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Graph Driver | neo4j-driver | 5.24.0 | Neo4j Python driver | Async support, connection pooling |
| PostgreSQL Driver | asyncpg | 0.29.0 | Async PostgreSQL driver | High performance async queries |
| ML Framework | scikit-learn | 1.5.1 | Traditional ML models | Random forests, preprocessing |
| Deep Learning | PyTorch | 2.4.0 | Neural networks & GNNs | Graph neural networks support |
| ML Lifecycle | MLflow | 2.15.1 | Model versioning & tracking | Experiment tracking, model registry |
| Data Processing | pandas | 2.2.2 | Data manipulation | Time series, CSV processing |
| HTTP Client | httpx | 0.27.0 | Async HTTP client | External API integration |
| Validation | Pydantic | 2.8.2 | Data validation | FastAPI integration, type safety |

## Testing Frameworks

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Testing | Vitest | 2.0.5 | Component testing | Fast, ESM native, Jest compatible |
| React Testing | Testing Library | 16.0.0 | React component testing | User-centric testing approach |
| Backend Testing | pytest | 8.3.2 | Python testing framework | Fixtures, async support |
| E2E Testing | Playwright | 1.45.3 | Cross-browser testing | Reliable selectors, visual regression |
| API Testing | Supertest | 7.0.0 | API endpoint testing | HTTP assertions, async support |
