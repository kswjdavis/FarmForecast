# Section 3: MVP Implementation Plan

## Phase 1a - True MVP (Weeks 1-8)

**Simplified Scope - Only 10 Essential Requirements:**

1. **FR-MVP-1:** Neo4j graph database for farms, fields, and crops
2. **FR-MVP-2:** Track herbicide applications with plant-back restrictions
3. **FR-MVP-3:** Basic field management (add, edit, view fields)
4. **FR-MVP-4:** Simple crop rotation planning with constraint checking
5. **FR-MVP-5:** Manual weather data entry (Kansas Mesonet integration later)
6. **FR-MVP-6:** Basic yield tracking and history
7. **FR-MVP-7:** User authentication and farm isolation
8. **FR-MVP-8:** Field adjacency relationships in graph
9. **FR-MVP-9:** Simple dashboard showing fields and current crops
10. **FR-MVP-10:** Export data as CSV for record keeping

## Epic Structure

### Epic 1: Foundation (Week 1)
**Goal:** Get development environment running

**Story 1.1:** Repository and Local Setup
- Initialize Git repository with README
- Create monorepo structure (apps/web, apps/api)
- Docker Compose for Neo4j and PostgreSQL
- Basic "Hello World" endpoints

**Story 1.2:** Deploy to AWS
- Single Lambda function for API
- Neo4j Aura DB free tier instance
- Vercel for frontend hosting
- GitHub Actions for basic CI

### Epic 2: Authentication (Week 2)
**Goal:** Users can register and login

**Story 2.1:** User Registration
- Email/password registration
- Create farm entity in Neo4j
- JWT token generation
- Basic PostgreSQL user table

**Story 2.2:** Login and Sessions
- Login endpoint with JWT
- Protected routes in frontend
- Logout functionality
- Password reset (can be basic email)

### Epic 3: Field Management (Weeks 3-4)
**Goal:** Farmers can manage their fields

**Story 3.1:** Create and Edit Fields
- Add field to farm in Neo4j
- Field boundaries (simple polygon)
- Soil type and basic properties
- Field list view

**Story 3.2:** Field Relationships
- Mark adjacent fields
- Visual graph of field layout
- Simple 2D visualization

### Epic 4: Crop Planning (Weeks 5-6)
**Goal:** Basic rotation planning with constraints

**Story 4.1:** Herbicide Tracking
- Add herbicide application to field
- Store plant-back restrictions
- Check restrictions before planting

**Story 4.2:** Planting Interface
- Select crop for field
- Validate against herbicide restrictions
- Save planting decision
- Show warnings for violations

### Epic 5: Dashboard & Export (Weeks 7-8)
**Goal:** View data and export records

**Story 5.1:** Farm Dashboard
- Overview of all fields
- Current crop status
- Simple metrics (total acres, crops planted)

**Story 5.2:** Data Export
- Export field list as CSV
- Export planting history
- Export herbicide applications
- Basic reporting

## Deployment & Testing

**CI/CD Pipeline (Minimal):**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npm run deploy
```

**Database Migrations (Simple):**
```bash
# migrations/001_init.cypher
CREATE CONSTRAINT farm_id ON (f:Farm) ASSERT f.id IS UNIQUE;
CREATE CONSTRAINT field_id ON (fd:Field) ASSERT fd.id IS UNIQUE;
```

**Local Development:**
```bash
# Quick start
git clone <repo>
npm install
docker-compose up -d
npm run dev
# Visit http://localhost:3000
```

## Success Metrics

- 5 pilot farms onboarded
- 100+ fields tracked
- Zero herbicide carryover violations
- $10-15/acre value demonstrated
- <2 second page load times
- 1 hour training gets farmer productive

## What We're NOT Building in Phase 1a

- Complex ML models
- Real-time weather integration  
- Advanced optimization algorithms
- Mobile app
- Satellite imagery
- Automated recommendations
- Multi-tenant organizations
- Advanced visualizations
- Payment processing
- Email notifications beyond password reset

## Critical Implementation Priorities

**Week 1:** Get something deployed and accessible
**Week 2:** Users can create accounts
**Week 3-4:** Core field management working
**Week 5-6:** Herbicide restrictions preventing mistakes
**Week 7:** Polish and testing with real farmers
**Week 8:** Bug fixes and documentation
- Feature Store setup (FR52)
- Spatial Cross-Validation (NFR5)

**Phase 2 - Advanced Analytics (Months 3-6):**
- Causal inference pipeline (FR7, FR36-39)
- Active Learning system (FR32)
- Spatio-temporal GP (FR5)
- MLOps infrastructure (NFR17-20)

**Phase 3 - Full Intelligence (Months 6-12):**
- Multi-objective optimization (FR30)
- Federated learning (NFR20)
- Complete uncertainty quantification (NFR21-24)
- Advanced interpretability suite (NFR33-36)

## Expected Value Proposition (Evidence-Based):
- **Rotation optimization:** $15-25/acre through improved crop sequencing
- **Input optimization:** $10-15/acre through precision nitrogen and seeding rates
- **Insurance optimization:** $8-12/acre through better coverage selection
- **Risk reduction:** $10-15/acre through timely alerts and preventive actions
- **Carbon credits:** $15-25/acre where eligible (30-40% of fields)
- **Time savings:** 25% reduction in planning time (valued at $5-8/acre)
- **Total realistic value:** $40-60/acre average, $80-100/acre best case
- **Confidence level:** 70% probability of achieving base case returns
