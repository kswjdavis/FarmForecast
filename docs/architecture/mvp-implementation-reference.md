# MVP Implementation Reference

The PRD Section 3 contains the complete MVP implementation plan including:
- 5 Epics with 10 user stories
- Simplified 10-requirement scope for Phase 1a
- Basic CI/CD pipeline configuration
- Database migration approach
- Local development setup instructions

## Quick Start for Developers

```bash
# Clone and setup
git clone https://github.com/americanagrionics/farmcalc
cd farmcalc
npm install
docker-compose up -d

# Run development servers
npm run dev

# Deploy to staging
git push origin main  # Auto-deploys via GitHub Actions
```

## Database Setup

Neo4j Aura DB:
- Use free tier for MVP (50K nodes, 175K relationships)
- Connection via Bolt protocol
- Migrations in `/migrations/neo4j/`

PostgreSQL:
- Docker locally, RDS in production
- Minimal schema for users and audit
- Migrations via simple SQL scripts

## Deployment Architecture (Simplified for MVP)

- **Frontend:** Vercel (automatic from GitHub)
- **API:** Single AWS Lambda function
- **Database:** Neo4j Aura DB (managed)
- **Auth:** Simple JWT (upgrade to Cognito later)
- **CI/CD:** GitHub Actions (test and deploy on push to main)

- **Jamstack Architecture:** Static generation with Next.js, serverless APIs via Lambda - *Rationale:* Optimal performance with <50ms TTFB
- **Graph-First Data Modeling:** All relationships modeled in Neo4j, SQL only for transactions - *Rationale:* Native graph operations 100x faster than SQL joins
- **Event-Driven Architecture:** Kafka streams for real-time weather and field updates - *Rationale:* Decouples data ingestion from processing
- **Backend for Frontend (BFF):** GraphQL layer aggregates multiple services - *Rationale:* Single API surface for frontend
- **Repository Pattern:** Abstract Neo4j and PostgreSQL access - *Rationale:* Testability and future flexibility
- **Component-Based UI:** Atomic design with React + TypeScript - *Rationale:* Reusability and type safety
- **CQRS Pattern:** Separate read models from write models - *Rationale:* Optimize for different access patterns
- **Microservices with Bounded Contexts:** Separate ML, Core API, Stream services - *Rationale:* Independent scaling
