# Source Tree Structure

## Current Project State
**Phase**: Pre-Implementation Documentation & Planning
**Type**: Greenfield Project with Comprehensive Documentation

## ACTUAL Current Structure

### Root Directory: `/FarmForecast`
```
FarmForecast/
├── .bmad-core/                    # BMad Framework (ACTIVE)
│   ├── agents/                    # Agent personas
│   ├── agent-teams/               # Team configurations
│   ├── checklists/                # QA & validation checklists
│   ├── data/                      # Reference data
│   ├── tasks/                     # Executable task workflows
│   ├── templates/                 # Document templates
│   ├── utils/                     # Utility files
│   ├── workflows/                 # Development workflows
│   ├── core-config.yaml           # Core BMad configuration
│   ├── enhanced-ide-development-workflow.md
│   ├── install-manifest.yaml
│   ├── user-guide.md
│   └── working-in-the-brownfield.md
│
├── docs/                          # ACTIVE Documentation
│   ├── architecture/              # Technical Architecture Docs
│   │   ├── api-specification.md
│   │   ├── critical-implementation-standards.md  # ⚠️ CRITICAL FOR DEV
│   │   ├── data-models.md
│   │   ├── database-schema.md
│   │   ├── deployment-architecture.md
│   │   ├── high-level-architecture.md
│   │   ├── index.md
│   │   ├── introduction.md
│   │   ├── monitoring-observability.md
│   │   ├── mvp-implementation-reference.md
│   │   ├── next-steps.md
│   │   ├── security-performance.md
│   │   ├── source-tree.md        # THIS FILE
│   │   ├── tech-stack.md         # ⚠️ CRITICAL FOR DEV
│   │   └── testing-strategy.md
│   │
│   ├── archive/                   # Historical versions
│   │   └── 2025-08-26-pre-cleanup/
│   │
│   ├── cicd/                      # CI/CD Configuration
│   │   └── pipeline-configuration.md
│   │
│   ├── database/                  # Database Documentation
│   │   └── schema-design.md
│   │
│   ├── epics/                     # Epic Definitions (6 total)
│   │   ├── epic-1-foundation.md
│   │   ├── epic-1-stories/
│   │   ├── epic-2-authentication.md
│   │   ├── epic-2-stories/
│   │   ├── epic-3-field-management.md
│   │   ├── epic-4-crop-planning.md
│   │   ├── epic-5-network-intelligence.md
│   │   └── epic-6-visualization.md
│   │
│   ├── patterns/                  # Design Patterns
│   │   └── error-handling-validation.md
│   │
│   ├── prd/                       # Product Requirements (Sharded)
│   │   ├── index.md
│   │   ├── section-1-goals-and-background-context.md
│   │   ├── section-2-requirements.md
│   │   ├── section-25-phased-mvp-delivery-strategy.md
│   │   ├── section-25a-explicit-scope-boundaries.md
│   │   ├── section-26-pilot-farm-partnership-strategy.md
│   │   ├── section-27-success-criteria-validation.md
│   │   ├── section-3-mvp-implementation-plan.md
│   │   ├── section-31-user-interface-design-goals.md
│   │   ├── section-35-data-quality-minimum-viable-dataset.md
│   │   ├── section-4-technical-assumptions.md
│   │   ├── section-44-neo4j-aura-db-implementation-strategy.md
│   │   ├── section-45-critical-development-standards.md
│   │   ├── section-5-critical-risks-mitigation.md
│   │   ├── section-6-epic-development-standards.md
│   │   ├── section-61-epic-list.md
│   │   ├── section-65-neo4j-aura-db-integration-examples.md
│   │   ├── section-7-epic-details.md
│   │   ├── section-71-example-story-with-no-fallback-standards.md
│   │   ├── section-8-pm-checklist-results.md
│   │   └── section-9-next-steps.md
│   │
│   ├── qa/                        # Quality Assurance
│   │   ├── assessments/
│   │   │   ├── epic-1-test-design.md
│   │   │   └── epic-2-test-design.md
│   │   ├── gates/
│   │   │   ├── 1.0-prerequisites-gate.yml
│   │   │   └── 3.0-data-quality-gate.yml
│   │   ├── plans/
│   │   │   ├── master-test-plan.md
│   │   │   └── test-strategy.md
│   │   ├── reports/
│   │   │   └── epic-1-test-results-template.md
│   │   └── index.md
│   │
│   ├── stories/                   # User Stories (Active)
│   │   └── 1.1.story.md
│   │
│   ├── architecture.md            # Architecture overview
│   ├── frontend-architecture.md
│   └── stakeholder-communication-plan.md
│
├── scripts/                       # Utility Scripts
│   └── verify-credentials.js     # Node.js credential verification
│
├── web-bundles/                   # Bundled Agent Configs
│   ├── agents/                    # Text-based agent files
│   ├── expansion-packs/           # Additional team configs
│   └── teams/                     # Team definitions
│
├── .claude/                       # Claude-specific config
├── .git/                          # Git repository
├── .DS_Store                      # macOS metadata
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Environment template (149 lines)
├── .gitignore                     # Git ignore rules
├── brief.md                       # Project brief
├── claude.md                      # Claude AI instructions
├── CREDENTIAL_SETUP.md            # Setup guide
├── mobile-ux-patterns.md          # Mobile UX documentation
├── prd.md                         # Main PRD document
├── sdk-reference.md               # SDK documentation
├── what-if-interaction-patterns.md # Interaction patterns
├── wireframes-epic1-foundation.md # Epic 1 wireframes
└── wireframes-epic6-visualization.md # Epic 6 wireframes
```

## Critical Files for Development

### devLoadAlwaysFiles Configuration
**Current Configuration** (NEEDS UPDATE):
```yaml
devLoadAlwaysFiles:
  - docs/architecture/coding-standards.md  # ❌ DOES NOT EXIST
  - docs/architecture/tech-stack.md        # ✅ EXISTS
  - docs/architecture/source-tree.md       # ❌ DOES NOT EXIST (until now)
```

**Should Be**:
```yaml
devLoadAlwaysFiles:
  - docs/architecture/critical-implementation-standards.md  # ✅ EXISTS
  - docs/architecture/tech-stack.md                        # ✅ EXISTS  
  - docs/architecture/source-tree.md                        # ✅ NOW EXISTS
```

## Planned Implementation Structure

### Future Source Code Structure (Not Yet Created)
```
src/                               # Application source
├── api/                           # Backend services
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── frontend/                      # Frontend application
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── shared/                        # Shared code
│   ├── types/
│   └── constants/
└── infrastructure/                # IaC
    ├── terraform/
    └── docker/

packages/                          # Monorepo structure
├── api/
├── frontend/
├── shared/
└── config/

node_modules/                      # NPM dependencies (git-ignored)
dist/                              # Build output (git-ignored)
build/                             # Build artifacts (git-ignored)
coverage/                          # Test coverage (git-ignored)
logs/                              # Application logs (git-ignored)
```

## Environment Configuration

### Current .env.example Structure
- **Neo4j Aura DB** configuration
- **AWS** services (S3, IAM)
- **Weather APIs** (4 services)
- **Application** settings (ports, security)
- **Monitoring** (Datadog, Sentry)
- **Integrations** (SendGrid, Twilio, Stripe)
- **Development** tools (GitHub, Docker)
- **Feature flags** (5 flags)
- **Cache** (Redis)
- **Test data** (farm coordinates)

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Documentation | kebab-case.md | critical-implementation-standards.md |
| User Stories | {epic}.{story}.story.md | 1.1.story.md |
| Epic Stories | epic-{n}-{name}.md | epic-1-foundation.md |
| PRD Sections | section-{n}-{topic}.md | section-2-requirements.md |
| Test Files | *.test.{js\|ts} | auth.test.js |
| Components | PascalCase.{jsx\|tsx} | FarmDashboard.tsx |
| Services | {name}.service.{js\|ts} | weather.service.js |
| Types | *.types.ts | farm.types.ts |

## Directory Ownership

| Directory | Purpose | Primary Owner | Status |
|-----------|---------|---------------|--------|
| `/docs/architecture` | Technical specs | Architect | ACTIVE |
| `/docs/epics` | Epic definitions | Product Owner | ACTIVE |
| `/docs/prd` | Requirements | Product Manager | ACTIVE |
| `/docs/qa` | Quality assurance | QA Lead | ACTIVE |
| `/docs/stories` | User stories | Dev Team | ACTIVE |
| `/.bmad-core` | BMad framework | System | ACTIVE |
| `/scripts` | Automation | DevOps | ACTIVE |
| `/src` | Source code | Dev Team | NOT CREATED |
| `/packages` | Monorepo packages | Dev Team | NOT CREATED |

## Project Status Summary

✅ **Complete**:
- Documentation structure
- BMad framework integration
- PRD and Epic definitions
- Architecture specifications
- Environment configuration
- Credential verification script

⏳ **Pending**:
- Application source code
- Package structure
- Build configuration
- CI/CD pipeline implementation
- Testing infrastructure

## Notes for Developers

1. **CRITICAL**: Always load and follow `critical-implementation-standards.md`
2. **NO FALLBACK POLICY**: Never use mock data without explicit approval
3. **Documentation First**: All features must have stories before implementation
4. **BMad Compliance**: Follow BMad workflow for all development tasks
5. **Type Safety**: Use shared types from future `/packages/shared`
6. **Environment**: Use `.env.example` as template for local `.env`

---
*Last Updated*: 2025-08-27
*Status*: Pre-Implementation Phase
*Next Step*: Initialize Node.js project structure when development begins