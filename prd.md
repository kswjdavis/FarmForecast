# FarmCalc Product Requirements Document (PRD)

## Section 1: Goals and Background Context

### Goals (Scientifically Validated & Phased)

**Phase 1a Goals (Weeks 1-8):**
- Prevent herbicide carryover disasters through constraint checking
- Enable basic field management with Neo4j graph structure  
- Deliver $10-15/acre value from prevented mistakes
- Establish foundation for 5 pilot farms

**Phase 1b Goals (Weeks 9-16):**
- Enable yield predictions with ±12 bu/acre MAE for wheat
- Optimize insurance portfolios for $8-12/acre savings
- Integrate real weather data with uncertainty
- Scale to 25 pilot farms

**Phase 2 Goals (Months 5-8):**
- Achieve full $40-60/acre value proposition
- Enable network effects with 50+ participating farms
- Deliver 45-55% recommendation adoption rate
- Provide causal inference with strip trial validation

**Long-term Vision:**
- Build comprehensive agricultural knowledge graph
- Enable 25% reduction in decision-making time
- Distinguish correlational from causal relationships
- Scale to 500+ farms across Western Kansas

### Background Context

FarmCalc addresses the critical challenge of profitable dryland farming in Hamilton County's 17-inch rainfall environment with 35% precipitation variability. Current decision-making results in $75,000-120,000 annual losses for average 3,000-acre operations due to suboptimal rotation choices, inadequate insurance coverage, and mistimed planting decisions. FarmCalc's unique graph-intelligence platform models agriculture as an interconnected system where field adjacency, rotation history, herbicide carryover, and regional patterns critically influence outcomes. By combining Neo4j's graph algorithms for pattern discovery with rigorous statistical validation and agronomic constraints, the platform identifies successful strategies from similar operations while respecting critical factors like plant-back restrictions, equipment compatibility, and weather uncertainty. The system provides transparent recommendations that outperform conventional methods by 20-30% in validated strip trials, with clear explanations of confidence levels and underlying assumptions.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-20 | v1.0 | Initial PRD creation based on Project Brief | John (PM) |
| 2025-08-20 | v2.0 | Redesigned with Neo4j graph-first architecture | John (PM) |
| 2025-08-20 | v2.1 | Critical revision for scientific accuracy and agronomic validity | John (PM) |
| 2025-08-21 | v3.0 | Added complete epic structure, user stories, and BMad compliance | John (PM) |

## Section 2: Requirements

### Functional Requirements

#### Core Optimization & Decision Intelligence
- **FR1:** The system shall optimize multi-year crop rotation using Distributional Robust Optimization with Wasserstein uncertainty sets to handle both parameter and model uncertainty
- **FR2:** The system shall implement Contextual Bandits with Thompson Sampling for sequential decision optimization, balancing exploration vs exploitation across seasons
- **FR3:** The system shall optimize insurance portfolios using mixed-integer programming with tail risk constraints beyond simple CVaR

#### Advanced Predictive Modeling
- **FR4:** The system shall predict crop yields using a Super Learner ensemble combining mechanistic models (DSSAT/APSIM), statistical models (hierarchical Bayesian mixed effects), machine learning (XGBoost, Random Forests), deep learning (LSTM, Transformer), and Gaussian Processes
- **FR5:** The system shall implement Spatio-Temporal Gaussian Processes with custom kernels (Matérn 5/2 for spatial, periodic for seasonal, RBF for weather) providing full uncertainty quantification
- **FR6:** The system shall use Survival Analysis (Cox Proportional Hazards) to model time-to-crop-failure enabling optimal replanting decisions
- **FR7:** The system shall apply Double/Debiased Machine Learning (DML) with instrumental variables for causal inference of yield drivers

#### Data Integration & Stream Processing
- **FR8:** The system shall integrate real-time Kansas Mesonet data with stream processing (<1 minute latency) for temperature, precipitation, ET, soil moisture, wind speed
- **FR9:** The system shall process Weather 20/20 Global analog years with variance reduction techniques (control variates, importance sampling, Quasi-Monte Carlo)
- **FR10:** The system shall implement event sourcing for all decisions creating immutable audit logs for counterfactual analysis
- **FR11:** The system shall integrate Sentinel-2 imagery with automated cloud masking and NDVI/EVI time series decomposition

#### Soil Physical & Biological Intelligence
- **FR12:** The system shall collect penetrometer readings with Spatial Durbin Models to account for field spillover effects
- **FR13:** The system shall track moisture profiles using Kalman filtering for data fusion across multiple sensor types
- **FR14:** The system shall predict soil organic matter trends using state-space models with process noise and observation error
- **FR15:** The system shall implement Geographically Weighted Regression for spatially-varying relationships between soil properties and yield

#### Nutrient & Chemical Optimization
- **FR16:** The system shall calculate nitrogen mineralization using temperature-moisture functions with Bayesian parameter estimation
- **FR17:** The system shall model micronutrient availability using chemical equilibrium models with pH-dependent speciation
- **FR18:** The system shall generate variable rate prescriptions using Multi-Task Learning to share information across fields
- **FR19:** The system shall track pesticide resistance risk using evolutionary game theory models

#### Disease & Pest Prediction
- **FR20:** The system shall predict disease pressure using epidemiological SIR models calibrated with weather infection periods
- **FR21:** The system shall implement insect phenology models with degree-day accumulation and diapause modeling
- **FR22:** The system shall use computer vision (YOLOv8) on field images for real-time pest/disease identification
- **FR23:** The system shall estimate weed seed banks using population dynamics models with age-structured matrices

#### Water Balance & Hydrology
- **FR24:** The system shall partition rainfall using Green-Ampt infiltration with Monte Carlo simulation for parameter uncertainty
- **FR25:** The system shall model deep percolation using Richards equation with pedotransfer functions
- **FR26:** The system shall calculate crop water stress using dual crop coefficient approach with stress functions
- **FR27:** The system shall optimize irrigation scheduling (where applicable) using stochastic dynamic programming

#### Carbon & Sustainability Modeling
- **FR28:** The system shall quantify carbon sequestration using RothC/Century models with uncertainty propagation
- **FR29:** The system shall calculate N2O emissions using DNDC model with site-specific calibration
- **FR30:** The system shall optimize for multiple objectives (profit, carbon, water quality) using Pareto frontier analysis
- **FR31:** The system shall track NRCS program compliance with automated documentation generation

#### Machine Learning Infrastructure
- **FR32:** The system shall implement Active Learning to identify fields/conditions where additional data collection provides maximum model improvement
- **FR33:** The system shall use Conformal Prediction for distribution-free uncertainty quantification with coverage guarantees
- **FR34:** The system shall apply Matrix Factorization for missing data imputation in sparse spatial datasets
- **FR35:** The system shall detect anomalies using Isolation Forests on multivariate sensor streams

#### Causal & Counterfactual Analysis
- **FR36:** The system shall build Structural Causal Models (SCMs) for intervention analysis ("what if we applied 20 lbs less N?")
- **FR37:** The system shall use G-computation for complex treatment effects with time-varying confounders
- **FR38:** The system shall implement Inverse Probability Weighting for observational causal inference
- **FR39:** The system shall generate Diverse Counterfactual Explanations (DiCE) for decision transparency

#### Advanced Optimization Techniques
- **FR40:** The system shall use Approximate Dynamic Programming with value function approximation for curse of dimensionality
- **FR41:** The system shall implement Stochastic Gradient Descent in expectation for large-scale stochastic optimization
- **FR42:** The system shall apply Benders Decomposition for two-stage stochastic programs
- **FR43:** The system shall use Column Generation for large-scale crop rotation optimization

#### Ensemble & Meta-Learning
- **FR44:** The system shall implement Bayesian Model Averaging with posterior probability weighting
- **FR45:** The system shall use Stacking with cross-validated predictions to avoid overfitting
- **FR46:** The system shall apply Multi-gate Mixture of Experts (MMoE) for multi-task crop prediction
- **FR47:** The system shall implement Meta-Learning (MAML) for quick adaptation to new fields/varieties

#### Uncertainty & Risk Quantification
- **FR48:** The system shall calculate Quantile Regression Forests for heteroskedastic prediction intervals
- **FR49:** The system shall implement Ensemble Bayesian Model Averaging (EBMA) for model uncertainty
- **FR50:** The system shall use Accumulated Local Effects (ALE) for model interpretation under correlation
- **FR51:** The system shall provide Partial Dependence with Individual Conditional Expectation curves

#### Feature Engineering & Management
- **FR52:** The system shall implement a Feature Store (Feast/Tecton) with point-in-time correct features
- **FR53:** The system shall calculate agronomic indices (SPI, SPEI, Palmer Drought) with proper standardization
- **FR54:** The system shall engineer interaction features using genetic algorithms for feature discovery
- **FR55:** The system shall track feature importance with permutation and SHAP values

#### Natural Language & Conversational AI
- **FR56:** The system shall use GPT-5 with Retrieval Augmented Generation (RAG) grounded in K-State research
- **FR57:** The system shall implement semantic search over historical recommendations and outcomes
- **FR58:** The system shall generate natural language explanations of complex model outputs
- **FR59:** The system shall support voice input for in-field data collection

#### Graph Intelligence & Knowledge Network
- **FR60:** The system shall model all agricultural entities and relationships as a Neo4j knowledge graph with farms, fields, crops, weather, treatments, and outcomes as nodes
- **FR61:** The system shall use graph algorithms (PageRank for influence, Louvain for community detection, Dijkstra for disease spread) for optimization and analysis
- **FR62:** The system shall provide interactive 3D graph visualizations for decision exploration and network effect understanding
- **FR63:** The system shall support what-if scenarios through graph cloning and modification with parallel universe exploration
- **FR64:** The system shall use Graph Neural Networks (GCN, GraphSAGE) operating directly on Neo4j for spatial-aware yield predictions
- **FR65:** The system shall discover hidden rotation patterns through temporal graph mining and pattern matching
- **FR66:** The system shall model influence propagation between adjacent fields for pest, disease, and practice adoption
- **FR67:** The system shall build causal graphs connecting treatments to outcomes with path-based explanation
- **FR68:** The system shall enable collaborative filtering through farmer similarity networks ("farmers like you succeeded with...")
- **FR69:** The system shall maintain a K-State research knowledge graph linking studies, findings, and field validations

#### Critical Agronomic Constraints & Validation
- **FR70:** The system shall track herbicide applications and enforce plant-back restrictions based on label requirements with carryover periods (e.g., Atrazine 12 months, FirstRate 18 months)
- **FR71:** The system shall monitor soil temperature at 2", 4", 6" depths for optimal planting window determination with crop-specific thresholds
- **FR72:** The system shall model volunteer crop pressure and associated management costs in rotation planning decisions
- **FR73:** The system shall respect crop insurance final planting dates and prevent plant dates as hard constraints in optimization
- **FR74:** The system shall account for equipment width compatibility (planter, sprayer, combine) in rotation transitions
- **FR75:** The system shall model wind erosion risk based on residue cover, field orientation, and soil type with WEPS integration
- **FR76:** The system shall track landlord lease restrictions on crop choices, tillage practices, and input levels
- **FR77:** The system shall optimize within custom harvester availability windows and elevator delivery capacity constraints
- **FR78:** The system shall validate yield monitor data by removing combine edge effects, flow transitions, and speed anomalies
- **FR79:** The system shall quantify and display prediction uncertainty with confidence intervals that widen with forecast horizon
- **FR80:** The system shall validate recommendations against on-farm strip trials before claiming causal relationships
- **FR81:** The system shall detect when model predictions extrapolate beyond training data distributions and flag with warnings
- **FR82:** The system shall track which recommendations were implemented vs ignored for continuous learning
- **FR83:** The system shall implement PRISM climate interpolation for weather stations >10 miles from fields
- **FR84:** The system shall maintain minimum data requirements (1000 fields, 10 years history) before enabling advanced predictions

### Non-Functional Requirements

#### Model Performance & Accuracy (Validated Targets)
- **NFR1:** The system shall achieve yield prediction Mean Absolute Error < 12 bu/acre for wheat, < 15 bu/acre for corn, < 10 bu/acre for sorghum
- **NFR2:** The system shall maintain disease prediction Precision > 0.6 at Recall = 0.7 for actionable alerts with economic loss weighting
- **NFR3:** The system shall converge to ε-optimal solutions within 30 seconds for 5,000 acres (typical operation size)
- **NFR4:** The system shall achieve Brier Score < 0.20 for probabilistic weather event predictions with confidence bands

#### Statistical Rigor & Validation
- **NFR5:** The system shall use Spatial Cross-Validation with 500m buffer zones to prevent data leakage
- **NFR6:** The system shall implement Forward-Chain CV for time series with expanding window validation
- **NFR7:** The system shall apply Group K-Fold for farms with multiple fields maintaining independence
- **NFR8:** The system shall track Population Stability Index (PSI) < 0.25 for feature drift monitoring

#### Computational Performance
- **NFR9:** The system shall complete feature computation in < 100ms for real-time decisions
- **NFR10:** The system shall support incremental model updates in < 2 hours without full retraining
- **NFR11:** The system shall process satellite imagery within 24 hours using parallel processing
- **NFR12:** The system shall handle 1000 concurrent optimization requests using auto-scaling

#### Data Quality & Integrity
- **NFR13:** The system shall implement Great Expectations for automated data validation pipelines
- **NFR14:** The system shall detect distribution shift using Kolmogorov-Smirnov tests (p < 0.05)
- **NFR15:** The system shall maintain data lineage tracking with Apache Atlas or DataHub
- **NFR16:** The system shall apply MICE imputation for missing data with uncertainty propagation

#### Machine Learning Operations
- **NFR17:** The system shall implement MLflow for experiment tracking with automatic metric logging
- **NFR18:** The system shall support A/B testing with multi-armed bandits for feature rollout
- **NFR19:** The system shall maintain model versioning with DVC (Data Version Control)
- **NFR20:** The system shall enable federated learning for privacy-preserving model improvement

#### Uncertainty Quantification
- **NFR21:** The system shall provide 90% prediction intervals with proper coverage validation
- **NFR22:** The system shall quantify epistemic vs aleatoric uncertainty separately
- **NFR23:** The system shall implement Bayesian posterior sampling for parameter uncertainty
- **NFR24:** The system shall calculate Value of Information for data collection decisions

#### Infrastructure & Scalability
- **NFR25:** The system shall use Kubernetes with horizontal pod autoscaling for load management
- **NFR26:** The system shall implement Redis streams for real-time sensor data ingestion
- **NFR27:** The system shall use Apache Kafka for event streaming with exactly-once semantics
- **NFR28:** The system shall maintain 99.5% uptime with blue-green deployments

#### Security & Compliance
- **NFR29:** The system shall implement differential privacy for aggregate statistics sharing
- **NFR30:** The system shall use homomorphic encryption for sensitive computation
- **NFR31:** The system shall maintain SOC 2 Type II compliance with annual audits
- **NFR32:** The system shall provide cryptographic proofs for recommendation integrity

#### Interpretability & Explainability
- **NFR33:** The system shall generate Anchor explanations with > 0.95 precision rules
- **NFR34:** The system shall provide counterfactual explanations within 2x feature range
- **NFR35:** The system shall calculate global feature importance with confidence intervals
- **NFR36:** The system shall support interactive what-if analysis with < 500ms response

#### Neo4j Aura DB Performance & Requirements
- **NFR37:** Aura DB queries shall complete 3-hop traversals in <100ms for subgraphs up to 10,000 nodes
- **NFR38:** Aura instance shall support 1M nodes and 10M relationships with <1s query response
- **NFR39:** Graph visualizations shall render at 60fps for networks up to 1,000 nodes using Aura data
- **NFR40:** Aura DB shall maintain ACID compliance for all graph transactions (guaranteed by platform)
- **NFR41:** GDS algorithms on Aura shall complete in <5s for PageRank/Louvain on 100K node subgraphs
- **NFR42:** Aura DB shall support concurrent graph modifications without blocking reads via MVCC
- **NFR42a:** Aura DB connection pool shall maintain 95% availability with automatic retry logic
- **NFR42b:** System shall handle Aura rate limits gracefully with exponential backoff
- **NFR42c:** Aura backup restoration shall complete within 4 hours for disaster recovery
- **NFR42d:** Monthly Aura costs shall not exceed $1500 through query optimization and caching

#### Scientific Validation & Uncertainty
- **NFR43:** The system shall quantify and display 90% prediction intervals for all yield predictions
- **NFR44:** The system shall validate recommendations against minimum 3 seasons of strip trial data before production deployment
- **NFR45:** The system shall maintain complete audit trail of recommendations given, adopted, and outcomes achieved
- **NFR46:** The system shall detect extrapolation beyond training data using Mahalanobis distance and display warnings
- **NFR47:** The system shall provide separate uncertainty estimates for aleatory (weather) and epistemic (model) uncertainty
- **NFR48:** The system shall achieve minimum 80% coverage of stated confidence intervals in validation
- **NFR49:** The system shall require minimum 500 field-years of local data before enabling region-specific models
- **NFR50:** The system shall validate causal claims through A/B testing or instrumental variable analysis only

## Section 3: MVP Implementation Plan

### Phase 1a - True MVP (Weeks 1-8)

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

### Epic Structure

#### Epic 1: Foundation (Week 1)
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

#### Epic 2: Authentication (Week 2)
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

#### Epic 3: Field Management (Weeks 3-4)
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

#### Epic 4: Crop Planning (Weeks 5-6)
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

#### Epic 5: Dashboard & Export (Weeks 7-8)
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

### Deployment & Testing

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

### Success Metrics

- 5 pilot farms onboarded
- 100+ fields tracked
- Zero herbicide carryover violations
- $10-15/acre value demonstrated
- <2 second page load times
- 1 hour training gets farmer productive

### What We're NOT Building in Phase 1a

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

### Critical Implementation Priorities

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

### Expected Value Proposition (Evidence-Based):
- **Rotation optimization:** $15-25/acre through improved crop sequencing
- **Input optimization:** $10-15/acre through precision nitrogen and seeding rates
- **Insurance optimization:** $8-12/acre through better coverage selection
- **Risk reduction:** $10-15/acre through timely alerts and preventive actions
- **Carbon credits:** $15-25/acre where eligible (30-40% of fields)
- **Time savings:** 25% reduction in planning time (valued at $5-8/acre)
- **Total realistic value:** $40-60/acre average, $80-100/acre best case
- **Confidence level:** 70% probability of achieving base case returns

## Section 2.5: Phased MVP Delivery Strategy

### Phase 1a: Foundation & Core Value (Weeks 1-8)
**Goal:** Establish platform with immediate value through constraint checking

**Includes:**
- Epic 1: Foundation & Graph Infrastructure
- Epic 2 (Partial): Herbicide carryover network, Equipment compatibility
- Basic rotation recommendations based on constraints
- Manual data entry with validation

**Delivers:**
- Prevents herbicide disasters (immediate value)
- Basic field management
- Equipment compatibility checking
- $10-15/acre value from prevented mistakes

### Phase 1b: Intelligence Layer (Weeks 9-16)
**Goal:** Add predictive capabilities with proper uncertainty

**Includes:**
- Epic 2 (Complete): Full data integration
- Epic 3: Prediction engine with uncertainty
- Epic 4 (Partial): Basic optimization

**Delivers:**
- Yield predictions with confidence intervals
- Weather integration
- Insurance optimization
- Additional $15-25/acre value

### Phase 2: Network Effects (Months 5-8)
**Goal:** Enable collaborative learning and advanced features

**Includes:**
- Epic 4 (Complete): Full optimization
- Epic 5: Collaborative network
- Epic 6: Advanced visualization

**Delivers:**
- Network learning benefits
- Strip trial framework
- Full $40-60/acre value proposition

### Data Bootstrap Strategy

**Initial Data Acquisition (Pre-Launch):**
1. **Partner with K-State Extension**
   - Access to 20+ years variety trial data
   - Historical weather patterns
   - Validated rotation studies

2. **Pilot Farm Program (5 farms)**
   - Free first year for complete historical data
   - Weekly feedback sessions
   - Strip trial participation required
   - Provides initial 500+ fields

3. **Data Quality Incentives:**
   - $100 credit for 5+ years clean yield data
   - $50 credit for complete herbicide history
   - Free soil testing for participants

4. **Transfer Learning Approach:**
   - Start with Western Kansas aggregate models
   - Progressively refine with local data
   - Minimum 100 fields before farm-specific models

### Risk Mitigation Through Phasing

**Phase 1a Risks (LOW):**
- Herbicide checking is rule-based (no ML required)
- Equipment constraints are deterministic
- Immediate value from prevented mistakes

**Phase 1b Risks (MEDIUM):**
- Need 500+ fields for reliable predictions
- Weather API dependencies
- User acceptance of uncertainty

**Phase 2 Risks (MEDIUM-HIGH):**
- Requires critical mass of users
- Privacy concerns
- Network effect timing

## Section 2.5a: Explicit Scope Boundaries

### OUT OF SCOPE for Initial Phases

**Phase 1a-1b Will NOT Include:**
- Automated execution of any farming operations
- Livestock or grazing management
- Irrigation scheduling (dryland only)
- Direct equipment control or variable rate prescriptions
- Commodity marketing/trading execution
- Loan applications or financial services
- Mobile native applications (PWA only)
- Offline operation beyond basic caching

**Phase 2 Will NOT Include:**
- International expansion
- Crops beyond wheat, corn, sorghum, and approved alternatives
- Direct carbon credit trading (documentation only)
- Automated chemical purchasing
- Farm equipment marketplace
- Labor management
- Crop insurance sales (optimization only)

**Permanently Out of Scope:**
- GMO trait recommendations (regulatory complexity)
- Pesticide application without human verification
- Financial investment advice
- Land purchase/rental negotiations
- Direct government payment applications

### Simplifications for MVP

**Accepted Simplifications to Reduce Complexity:**
1. **Weather 20/20:** Manual entry only (no API initially)
2. **Soil Testing:** Manual entry or PDF parsing (no direct lab APIs initially)
3. **Market Prices:** Daily updates sufficient (not real-time)
4. **Graph Visualization:** 2D only initially (3D in Phase 2)
5. **Strip Trials:** Basic randomization (advanced designs in Phase 2)
6. **ML Models:** Start with Random Forest (GNNs in Phase 1b)
7. **Causal Inference:** Associations first, causality after validation

## Section 2.6: Pilot Farm & Partnership Strategy

### Pilot Farm Selection Criteria

**Target Pilot Farms (5 initial, 25 by end of Phase 1b):**
- 1,000-5,000 acre operations
- Mix of owned and rented ground
- Complete 5+ year historical records
- Willingness to share all data
- Commitment to strip trials
- Geographic distribution across Hamilton County

### Partnership Requirements

**K-State Research & Extension:**
- Formal data sharing agreement
- Access to variety trial database
- Strip trial validation support
- Co-publication rights on findings
- Extension agent training program

**Weather 20/20 Global:**
- Manual data entry protocol
- Training on analog year interpretation
- Potential future API development
- Accuracy validation framework

**Local Partners:**
- 2+ grain elevators for market data
- 1+ crop insurance agency for portfolio analysis
- Ward Labs/Servi-Tech for soil testing
- Custom harvesters for capacity windows

### Progressive Feature Enablement Based on Data

**Minimum Data Thresholds:**
| Feature | Fields Required | Years History | Other Requirements |
|---------|----------------|---------------|-------------------|
| Basic Constraints | 10 | 1 | Herbicide records |
| Simple Recommendations | 50 | 3 | Soil tests |
| ML Predictions | 500 | 5 | Weather station <30mi |
| Causal Inference | 1000 | 7 | Strip trials |
| Network Effects | 50 farms | 3 | Active sharing |

### Liability & Advisory Framework

**Phase 1a-1b: Advisory Only Mode**
- All recommendations marked "FOR INFORMATIONAL PURPOSES ONLY"
- Required disclaimer acceptance
- No automated execution
- Farmer must confirm all decisions
- Liability insurance in place

**Phase 2: Trusted Advisor Mode**
- After 1 season validation
- Requires strip trial verification
- Progressive trust building
- Optional automated alerts
- Enhanced liability coverage

## Section 2.7: Success Criteria & Validation

### Phase 1a Success Metrics (Week 8)
**Technical:**
- Neo4j operational with 5 farms, 50+ fields
- Herbicide carryover checker 100% accurate
- Equipment compatibility validated
- Weather data updating every 6 hours
- Zero critical bugs in production

**User:**
- 5 pilot farms fully onboarded
- 100% of users can enter field data without help
- Basic recommendations generated for all farms
- Positive feedback from 3+ farmers

**Business:**
- $10-15/acre value demonstrated
- Letter of intent from K-State Extension
- 2+ additional farms requesting access

### Phase 1b Success Metrics (Week 16)
**Technical:**
- 500+ fields with complete data
- Yield predictions within ±12 bu/acre MAE
- Insurance optimization operational
- ML models validated against historical data
- <30 second response for all operations

**User:**
- 25 pilot farms active
- 60% of recommendations reviewed weekly
- Strip trials initiated on 10+ farms
- NPS score >40

**Business:**
- $25-30/acre value demonstrated
- First paying customers committed
- Partnership agreements signed

### Phase 2 Success Metrics (Month 8)
**Technical:**
- 1000+ fields in system
- Network effects measurable
- Causal inference validated
- 99.5% uptime achieved

**User:**
- 50+ active farms
- 45% recommendation adoption
- 20+ completed strip trials
- NPS score >50

**Business:**
- $40-60/acre value validated
- 25+ paying customers
- Break-even on operations

### Timeline Reality Check

**Critical Path Dependencies:**
1. Neo4j setup must complete before any development (Week 1)
2. Herbicide rules must be encoded before recommendations (Week 3)
3. Weather integration required for predictions (Week 5)
4. Pilot farms needed for real data (Week 2 recruitment)
5. Full season required for strip trial validation (Month 12+)

**Risk Buffers Built In:**
- 2 week buffer between phases
- Start with rule-based before ML
- Manual processes before automation
- Advisory mode before prescriptive

## Section 3: User Interface Design Goals

### Overall UX Vision

The FarmCalc interface pioneers "Graph-Driven Agricultural Intelligence" where every farm decision is understood through its network of relationships. The design philosophy centers on "see the connections, understand the outcomes" - visualizing how fields influence each other, how rotations cascade through time, and how regional patterns affect individual farms. Users navigate through an interactive knowledge graph that mirrors how farming actually works - as an interconnected system, not isolated data points. The AI assistant explains recommendations by showing paths through the graph, making complex relationships intuitive.

### Key Interaction Paradigms

- **Graph-First Navigation:** Primary interaction through interactive network visualization showing fields, their relationships, and influence flows
- **AI-Guided Data Entry:** Every input field has contextual AI assistance that validates against the knowledge graph
- **Temporal Graph Scrubbing:** Timeline slider reveals how the farm network evolved and will evolve with different decisions
- **What-If Graph Cloning:** Parallel universe exploration by cloning subgraphs and modifying parameters
- **Influence Flow Visualization:** Animated particles showing how decisions propagate through the network
- **Conversational Graph Queries:** Natural language questions translated to Cypher queries with visual results

### Core Screens and Views

- **Network Command Center:** 3D force-directed graph of farm ecosystem with fields, crops, weather events as nodes
- **Rotation Pattern Explorer:** Temporal graph showing successful rotation sequences discovered from similar farms
- **Disease/Pest Spread Map:** Real-time network showing infection risks and transmission paths
- **Influence Network Dashboard:** Visualize how neighboring farms' practices affect your outcomes
- **Knowledge Graph Browser:** Explore K-State research connections to your specific conditions
- **Causal Path Analyzer:** Interactive diagram showing cause-effect chains from actions to outcomes
- **Community Detection View:** Identify clusters of similar fields for management zones
- **Graph-Enhanced Charts Suite:** Traditional charts augmented with relationship overlays
- **What-If Scenario Lab:** Side-by-side graph comparison of different decision paths

### Accessibility
**WCAG AA Compliance with Graph Accessibility** - Keyboard navigation through graph nodes, screen reader descriptions of relationships, high contrast mode preserving network structure

### Branding

Graph-centric aesthetic where relationships are the hero elements. Node colors represent entity types (fields: green, crops: gold, weather: blue, diseases: red). Edge thickness shows relationship strength. Smooth force-directed animations reinforce network dynamics. Clean backgrounds let the graph structure shine.

### Target Device and Platforms
**Web Responsive with Graph Optimization** - Desktop-first for complex graph exploration (1920x1080), tablet for field review with simplified graphs, progressive web app with offline graph caching

## Section 3.5: Data Quality & Minimum Viable Dataset

### Minimum Data Requirements for Reliable Predictions

**Per-Field Requirements:**
- 5+ years of yield history (cleaned and validated)
- 3+ soil samples with GPS coordinates
- Complete rotation history including cover crops
- Herbicide application records for carryover tracking
- Planting dates, populations, and varieties

**Regional Requirements:**
- 1,000+ fields within similar rainfall zone
- 10+ years of weather data from station <30 miles away
- 50+ K-State variety trials within 100 miles
- 20+ fields with strip trial validation data

**Data Quality Standards:**
- Yield monitor data cleaned for edge effects and anomalies
- Weather data gap-filled using PRISM interpolation
- Soil samples age <3 years for primary nutrients
- Herbicide records include product, rate, and date
- Missing data <20% for critical variables

**Progressive Feature Enablement:**
- Basic recommendations: 100 fields, 3 years data
- Advanced ML predictions: 500 fields, 5 years data
- Causal inference: 1000 fields, 7 years data, strip trials
- Network effects: 50+ participating farms in region

## Section 4: Technical Assumptions

### Repository Structure
**Monorepo with Graph-First Organization**

```
farmcalc/
├── frontend/          # React + D3.js/Force-Graph
├── backend/           # FastAPI + Neo4j Driver
├── graph-ml/          # GNN models, Neo4j GDS
├── optimization/      # Graph-based optimization
├── infrastructure/    # Neo4j cluster config
└── shared/           # Graph schemas, Cypher queries
```

### Service Architecture

**Graph-Centric Microservices with Neo4j Aura DB**

Primary Services:
- **Graph API Service** (FastAPI + Neo4j Aura): Primary interface for all graph operations via secure Bolt protocol
- **Graph ML Service** (PyTorch Geometric): GNN inference pulling data from Aura DB
- **Graph Analytics Service** (Neo4j GDS on Aura): PageRank, community detection, pathfinding (included in Aura Professional)
- **Traditional API Service** (FastAPI + PostgreSQL): User auth, transactions, non-graph data
- **Stream Processing** (Kafka → Neo4j Aura): Real-time relationship updates via Bolt driver
- **Query Cache Layer** (Redis): Cache expensive Cypher queries to reduce Aura API calls

### Data Architecture

**Neo4j Aura DB as Primary Database:**

**Aura DB Connection Configuration:**
```python
# Neo4j Aura connection details (stored in environment variables)
NEO4J_URI = "neo4j+s://<dbid>.databases.neo4j.io"  # Aura provides secure bolt protocol
NEO4J_USERNAME = "neo4j"  # Default username
NEO4J_PASSWORD = "<generated-password>"  # Strong password from Aura console
NEO4J_DATABASE = "neo4j"  # Default database name

# Connection pooling for optimal performance
MAX_CONNECTION_POOL_SIZE = 50
CONNECTION_ACQUISITION_TIMEOUT = 60
```

**Graph Data Model in Neo4j Aura:**

```cypher
// Core Node Types
(:Farm {id, name, location, size_acres})
(:Field {id, polygon, soil_type, current_moisture})
(:Crop {type, variety, water_needs})
(:Season {year, field_id, precipitation_total})
(:Treatment {type, date, amount, method})
(:WeatherEvent {date, type, severity})
(:Yield {bushels, quality, profit})
(:Research {study_id, findings, confidence})
(:Disease {type, severity, detected_date})

// Critical Relationships
(:Field)-[:ADJACENT_TO {distance}]->(:Field)
(:Field)-[:PLANTED {date, population}]->(:Crop)
(:Crop)-[:PRECEDED_BY {gap_months}]->(:Crop)
(:Field)-[:INFLUENCED_BY {strength}]->(:Field)
(:Disease)-[:SPREADS_TO {probability}]->(:Field)
(:Treatment)-[:CAUSES {effect_size}]->(:Outcome)
(:Research)-[:VALIDATES {confidence}]->(:Practice)
```

Supporting Databases:
- **PostgreSQL**: User management, financial transactions, audit logs
- **TimescaleDB**: High-frequency sensor streams
- **Redis**: Session management, graph query cache
- **S3**: Image storage, model artifacts

### Testing Requirements

**Full Testing Pyramid with Graph Validation**
- Unit tests including Cypher query validation
- Graph integrity tests (no orphan nodes, relationship consistency)
- Graph algorithm correctness tests
- GNN model performance tests

### Additional Technical Assumptions

**Graph-Specific Technology Stack:**

- **Neo4j Aura DB** (SELECTED PRIMARY DATABASE) - Fully managed cloud graph database
  - Professional tier for production (starting at $65/month)
  - Automatic backups, monitoring, and scaling
  - Multi-region deployment capability
  - Built-in high availability and disaster recovery
- **Neo4j Graph Data Science** library included with Aura Professional
- **PyTorch Geometric** for Graph Neural Networks
- **D3.js Force Graph** for frontend visualization
- **Cypher** as primary query language
- **GraphQL** federation across Neo4j Aura and PostgreSQL

**Neo4j Aura DB Configuration:**
- **Instance Size**: Starting with 8GB RAM, 2 vCPUs (scales automatically)
- **Region**: US-Central (closest to Kansas farms)
- **Backup**: Daily automated backups with 7-day retention
- **Monitoring**: Built-in metrics and query logging
- **Security**: TLS encryption, IP allowlisting, SSO integration ready

**Apple Silicon Optimization:**
- Neo4j Aura accessible via native ARM64 drivers
- Graph algorithms leverage Metal for parallel computation
- Core ML for GNN inference on Apple Neural Engine

**Deployment Architecture:**
1. **Primary**: Neo4j Aura DB (Production)
2. **Development**: Neo4j Aura Free tier for development/testing
3. **Integration**: Direct connection from FastAPI to Aura via official Python driver
4. **Caching**: Redis for frequently accessed graph queries

**Performance Targets:**
- 3-hop traversal: <100ms
- PageRank on 10K nodes: <2s
- GNN inference: <500ms
- Graph visualization: 60fps

## Section 4.4: Neo4j Aura DB Implementation Strategy

### Aura DB Setup and Configuration

**Initial Setup Requirements:**
1. **Account Creation**: Neo4j Aura account with billing configured
2. **Instance Provisioning**: 
   - Start with AuraDB Professional (8GB RAM, 2 vCPUs)
   - Enable auto-scaling for peak loads
   - Configure US-Central region for lowest latency to Kansas
3. **Security Configuration**:
   - Generate strong authentication credentials
   - Configure IP allowlist for backend services
   - Enable audit logging for compliance
   - Set up read-only users for analytics

**Data Migration Strategy:**
1. **Phase 1a**: Create initial graph schema
2. **Phase 1b**: Import pilot farm data via CSV uploads
3. **Phase 2**: Stream real-time updates via Bolt protocol
4. **Phase 3**: Implement CDC (Change Data Capture) for sync

**Aura DB Cost Optimization:**
- Development: Free tier (50K nodes, 175K relationships)
- Staging: AuraDB Free or Professional ($65/month)
- Production: AuraDB Professional with auto-scaling
- Estimated monthly cost: $500-1500 based on graph size

**Connection Management:**
```javascript
// Backend connection using Neo4j JavaScript driver
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 60000,
    encrypted: 'ENCRYPTION_ON',
    trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
  }
);
```

**Backup and Disaster Recovery:**
- Automated daily backups (included with Aura)
- 7-day retention for point-in-time recovery
- Cross-region backup replication available
- Export critical subgraphs weekly to S3

**Performance Monitoring:**
- Use Aura's built-in monitoring dashboard
- Set up alerts for slow queries (>1s)
- Monitor connection pool utilization
- Track graph size growth rate

**Query Optimization for Aura:**
```cypher
// Use indexes for frequently accessed properties
CREATE INDEX field_id_index FOR (f:Field) ON (f.id);
CREATE INDEX farm_name_index FOR (f:Farm) ON (f.name);
CREATE INDEX crop_type_index FOR (c:Crop) ON (c.type);

// Use relationship indexes for common traversals
CREATE INDEX rel_planted_date FOR ()-[r:PLANTED]-() ON (r.date);
CREATE INDEX rel_adjacent_distance FOR ()-[r:ADJACENT_TO]-() ON (r.distance);
```

**Scaling Strategy:**
- Start: 50 farms, 500 fields, 10K relationships
- 6 months: 200 farms, 2K fields, 100K relationships
- 1 year: 500 farms, 5K fields, 500K relationships
- Auto-scale triggers at 80% memory utilization

## Section 4.5: Critical Development Standards

### NO UNAUTHORIZED FALLBACKS OR WORKAROUNDS

**Strict Development Requirements:**

1. **No Mock Data Without Authorization**
   - ALL development must use real APIs and actual data sources
   - Mock data only with explicit written approval and justification
   - Any mock data must be clearly labeled: "MOCK_DATA_AUTHORIZED_BY_[NAME]_[DATE]"
   - Production code must NEVER contain mock data

2. **No Fallback Mechanisms Without Approval**
   - If an API fails, the system must fail gracefully with clear error messages
   - No automatic fallbacks to cached, estimated, or interpolated data without user consent
   - Each fallback must be explicitly approved and documented with business justification
   - User must be notified when any fallback is active

3. **No Shortcuts or Workarounds**
   - No bypassing of validation rules "just for testing"
   - No hardcoded values to "make it work for now"
   - No simplified algorithms without documenting impact on accuracy
   - Every deviation from requirements needs written approval

4. **Real Data Requirements**
   - Kansas Mesonet: Use actual API, not historical downloads
   - Weather 20/20: Real manual entry, not generated data
   - Soil tests: Actual lab results, not typical values
   - Yield data: Real harvest monitor files, not estimates
   - Market prices: Live feeds, not static values

5. **Authorization Protocol**
   - All deviations must be approved in writing by Product Owner
   - Document includes: reason, impact, timeline to fix, risk assessment
   - Temporary workarounds must have expiration dates
   - Technical debt from workarounds tracked in backlog

6. **Development Environment Standards**
   - Dev/staging must use same data sources as production
   - No "development mode" that bypasses critical validations
   - Test with real edge cases from actual farm data
   - Performance testing with production-scale data volumes

7. **Continuous Integration Rules**
   - Build fails if mock data detected in production code paths
   - Automated tests must use real API responses (cached for speed)
   - No merging to main branch with active workarounds
   - Code review must verify no unauthorized fallbacks

8. **User Consent for Any Degradation**
   - If data quality drops, user must explicitly accept to continue
   - Clear messaging: "Weather station offline - continue with 3-day old data?"
   - No automatic decisions on behalf of user
   - Audit log of all degraded operation modes

## Section 5: Critical Risks & Mitigation

### Technical Risks

**Weather Uncertainty (HIGH)**
- Risk: 35% precipitation variability makes predictions inherently uncertain
- Mitigation: Always show confidence intervals, use ensemble forecasts, emphasize risk management over point predictions

**Data Sparsity (HIGH)**
- Risk: Many fields lack sufficient historical data for ML
- Mitigation: Use hierarchical models to borrow strength across fields, require minimum data thresholds, transfer learning from similar regions

**Herbicide Carryover Liability (HIGH)**
- Risk: Incorrect rotation recommendation could cause crop failure
- Mitigation: Conservative plant-back restrictions, require user confirmation of herbicide history, disclaimer on all recommendations

### Agronomic Risks

**Strip Trial Validation (MEDIUM)**
- Risk: Recommendations may not validate in real field conditions
- Mitigation: Partner with K-State Extension for trials, start with low-risk recommendations, track outcomes rigorously

**Equipment Constraints (MEDIUM)**
- Risk: Optimal rotation may not match farmer's equipment
- Mitigation: Capture equipment inventory upfront, include as hard constraints in optimization

### Market Risks

**Adoption Resistance (HIGH)**
- Risk: Farmers skeptical of "black box" recommendations
- Mitigation: Full explainability, show comparable farms' success, start with advisory not prescriptive mode

**Competitor Response (MEDIUM)**
- Risk: Climate FieldView or Granular could add similar features
- Mitigation: Focus on dryland-specific expertise, deeper K-State integration, local relationships

## Section 6: Epic Development Standards

### UNIVERSAL ACCEPTANCE CRITERIA FOR ALL STORIES

**Every story in every epic MUST include these criteria:**

1. **REAL DATA ONLY**
   - ✅ Story uses actual API connections (Kansas Mesonet, Weather 20/20, etc.)
   - ✅ Test data comes from real historical records, not generated
   - ✅ Any mock data explicitly authorized with expiration date
   - ❌ No placeholder values without PO approval

2. **NO UNAUTHORIZED FALLBACKS**
   - ✅ System fails gracefully with clear error when data unavailable
   - ✅ User explicitly consents to any degraded operation
   - ✅ All fallbacks documented with business justification
   - ❌ No automatic workarounds or "smart" defaults

3. **VALIDATION ENFORCEMENT**
   - ✅ All agricultural constraints enforced (herbicide, equipment, etc.)
   - ✅ Data quality checks cannot be bypassed
   - ✅ Uncertainty quantification mandatory, not optional
   - ❌ No "skip validation" flags in code

4. **AUDIT REQUIREMENTS**
   - ✅ Every recommendation logged with full context
   - ✅ Data source providence tracked for all values
   - ✅ User consent recorded for any degraded operation
   - ✅ No anonymous or untracked system decisions

5. **DEFINITION OF DONE ADDITIONS**
   - ✅ Code review confirms no unauthorized workarounds
   - ✅ Integration tests use real API responses
   - ✅ Documentation includes all approved deviations
   - ✅ No TODO comments that bypass requirements

### EPIC-SPECIFIC ENFORCEMENT

**Epic 1 - Foundation:**
- Neo4j must connect to actual database, no in-memory substitutes
- Weather API must be live Kansas Mesonet, not cached files
- Authentication must use real JWT, not simplified tokens

**Epic 2 - Data Integration:**
- K-State research must be actual publications, not summaries
- Soil tests must be real lab results with chain of custody
- Historical data must be actual farm records, not typical values

**Epic 3 - Prediction Engine:**
- Models trained on actual farm data only
- No synthetic data augmentation without approval
- Uncertainty from actual variance, not assumed distributions

**Epic 4 - Optimization:**
- Constraints from actual regulations and labels
- Prices from live market feeds, not averages
- Equipment specs from actual farmer inventory

**Epic 5 - Network Intelligence:**
- Real farmer participation, no simulated networks
- Actual strip trial data, not theoretical results
- Privacy controls enforced, not bypassed for testing

**Epic 6 - Visualization:**
- Charts show actual uncertainty, not hidden
- Real performance metrics, not optimistic projections
- Actual user feedback, not assumed preferences

### DEVELOPER AFFIRMATION

Each developer must acknowledge before starting work:

"I understand that:
- No mock data without written authorization
- No fallbacks without explicit user consent  
- No workarounds without documented approval
- Real APIs and data sources must be used
- Violations will result in PR rejection
- These standards protect farmer trust and safety"

Signed: _________________ Date: _________________

## Section 6.5: Neo4j Aura DB Integration Examples

### EXAMPLE: Epic 1 Story - Neo4j Aura DB Setup and Connection

**Story:** As a developer, I need to establish secure connection to Neo4j Aura DB so that the application can store and query the agricultural knowledge graph.

**Acceptance Criteria:**

1. ✅ **Neo4j Aura Professional instance provisioned**
   - Instance created in US-Central region (closest to Kansas)
   - 8GB RAM, 2 vCPUs initial configuration
   - Auto-scaling enabled with max 32GB RAM limit
   - GDS library enabled for graph algorithms

2. ✅ **Secure connection established from FastAPI backend**
   ```python
   from neo4j import GraphDatabase
   import os
   
   class AuraConnection:
       def __init__(self):
           self.uri = os.environ['NEO4J_URI']  # neo4j+s://xxxx.databases.neo4j.io
           self.user = os.environ['NEO4J_USERNAME']
           self.password = os.environ['NEO4J_PASSWORD']
           self.driver = GraphDatabase.driver(
               self.uri, 
               auth=(self.user, self.password),
               max_connection_pool_size=50
           )
   ```

3. ✅ **Connection health check endpoint**
   - GET /api/health/neo4j returns Aura connection status
   - Includes node count, relationship count, response time
   - Alerts if connection pool < 20% available

4. ✅ **Initial graph schema created**
   ```cypher
   // Run these constraints on Aura after connection
   CREATE CONSTRAINT farm_id IF NOT EXISTS FOR (f:Farm) REQUIRE f.id IS UNIQUE;
   CREATE CONSTRAINT field_id IF NOT EXISTS FOR (f:Field) REQUIRE f.id IS UNIQUE;
   CREATE INDEX field_location IF NOT EXISTS FOR (f:Field) ON (f.location);
   ```

5. ❌ **PROHIBITED:**
   - Using Neo4j Desktop or local instance for production
   - Hardcoding connection credentials in code
   - Bypassing Aura's built-in security features
   - Using community edition features not in Aura

## Section 6: Epic List

### Overview
The FarmCalc MVP will be delivered through 6 sequential epics over 8 months, progressing from foundational infrastructure to advanced network intelligence. Each epic delivers tangible value while building toward the complete platform vision.

### Epic Summary
- **Epic 1: Foundation & Graph Infrastructure** - Establish Neo4j Aura DB platform with basic farm management
- **Epic 2: Data Integration & Critical Constraints** - Enable real data capture with herbicide carryover protection  
- **Epic 3: Basic Prediction Engine** - Enable yield predictions with proper uncertainty quantification
- **Epic 4: Rotation Optimization Engine** - Optimize multi-year rotations considering all constraints
- **Epic 5: Network Intelligence & Collaboration** - Enable learning from farmer network and collaborative intelligence
- **Epic 6: Advanced Visualization & User Experience** - Make complex graph relationships intuitive and actionable

## Section 7: Epic Details

### Epic 1: Foundation & Graph Infrastructure
**Goal:** Establish core platform with Neo4j Aura DB and basic farm management capabilities. This epic creates the technical foundation while delivering immediate value through field management and authentication.

**Timeline:** Weeks 1-4 (Phase 1a)
**Value Delivered:** Platform ready for data, basic field tracking operational

#### Story 1.1: Neo4j Aura DB Setup
As a developer, I need to provision and configure Neo4j Aura DB so that we can store the agricultural knowledge graph.

**Acceptance Criteria:**
1. Neo4j Aura Professional instance provisioned in US-Central region
2. Connection established from FastAPI backend with connection pooling
3. Health endpoint returns connection status and basic metrics
4. Environment variables properly configured for secure access
5. Query performance validated (<100ms for basic operations)

**SDK Context:** neo4j==5.24.0, fastapi==0.112.0

#### Story 1.2: Core Graph Schema Creation
As a developer, I need to create the fundamental graph schema so that we can model farms, fields, and crops.

**Acceptance Criteria:**
1. Farm, Field, Crop, Season, Treatment nodes created with required properties
2. ADJACENT_TO, PLANTED, PRECEDED_BY relationships defined
3. Constraints and indexes created for performance
4. Schema validation tests passing
5. Documentation of graph model complete

**SDK Context:** neo4j==5.24.0

#### Story 1.3: User Authentication System
As a farmer, I need to securely log in so that I can access my farm data.

**Acceptance Criteria:**
1. JWT-based authentication implemented
2. Password reset flow functional
3. Session management with refresh tokens
4. User profile stored in PostgreSQL
5. Role-based access control framework in place

**SDK Context:** pyjwt==2.9.0, passlib[bcrypt]==1.7.4, psycopg[binary]==3.2.1

#### Story 1.4: Farm Profile Creation
As a farmer, I need to create my farm profile so that the system knows my operation.

**Acceptance Criteria:**
1. Farm entity created in Neo4j with name, location, size
2. Form validation for required fields
3. Geographic coordinates captured and validated
4. Farm linked to authenticated user
5. Success confirmation displayed

**SDK Context:** neo4j==5.24.0, react-hook-form@7.52.2, zod@3.23.8

#### Story 1.5: Field Boundary Definition
As a farmer, I need to define my field boundaries so that spatial relationships can be established.

**Acceptance Criteria:**
1. Interactive map for drawing field polygons
2. Acreage automatically calculated from boundaries
3. ADJACENT_TO relationships auto-created for neighboring fields
4. Field polygons stored as WKT in Neo4j
5. Minimum 3 fields can be created and edited

**SDK Context:** leaflet@1.9.4, react-leaflet@4.2.1, @turf/turf@7.0.0

#### Story 1.6: Basic Navigation UI
As a farmer, I need to navigate between different sections so that I can manage my operation.

**Acceptance Criteria:**
1. Dashboard, fields list, and settings pages accessible
2. Responsive design works on desktop and tablet
3. Navigation menu clearly indicates current location
4. Loading states for async operations
5. Error handling with user-friendly messages

**SDK Context:** next@14.2.5, @mui/material@5.16.7, zustand@4.5.5

### Epic 2: Data Integration & Critical Constraints
**Goal:** Enable real data capture with herbicide carryover protection to prevent crop disasters. This epic delivers immediate value by preventing costly herbicide mistakes.

**Timeline:** Weeks 5-8 (Phase 1a completion)
**Value Delivered:** $10-15/acre from prevented herbicide disasters

#### Story 2.1: Herbicide Application History
As a farmer, I need to record herbicide applications so that carryover restrictions are tracked.

**Acceptance Criteria:**
1. Herbicide application form with product, rate, date fields
2. HerbicideApplication nodes created and linked to fields
3. Active ingredients automatically populated from product selection
4. Historical applications viewable by field
5. Bulk import from CSV supported

**SDK Context:** neo4j==5.24.0, pandas==2.2.2

#### Story 2.2: Plant-Back Restriction Engine
As a farmer, I need automatic plant-back warnings so that I don't violate herbicide labels.

**Acceptance Criteria:**
1. 50+ common herbicide restrictions encoded
2. Real-time validation when selecting crops
3. Clear warnings with restriction end dates displayed
4. Cypher queries efficiently check all field history
5. 100% accuracy on test scenarios

**SDK Context:** neo4j==5.24.0, pandas==2.2.2

#### Story 2.3: Rotation History Capture
As a farmer, I need to enter my 5-year rotation history so that patterns can be analyzed.

**Acceptance Criteria:**
1. Form for entering historical crops by field and year
2. PRECEDED_BY relationships created between sequential crops
3. Yield and planting/harvest dates captured
4. CSV upload for bulk historical data
5. Data validation for reasonable values

**SDK Context:** neo4j==5.24.0, react-csv@2.2.2

#### Story 2.4: Equipment Inventory Management
As a farmer, I need to specify my equipment so that recommendations match my capabilities.

**Acceptance Criteria:**
1. Equipment inventory form for planter, sprayer, combine
2. Row spacing and width specifications captured
3. Equipment stored in PostgreSQL
4. Compatibility rules integrated with recommendations
5. Equipment constraints shown in rotation options

**SDK Context:** psycopg[binary]==3.2.1, sqlalchemy==2.0.32

#### Story 2.5: Kansas Mesonet Weather Integration
As a farmer, I need current weather data so that decisions are based on actual conditions.

**Acceptance Criteria:**
1. Kansas Mesonet API polled every 6 hours
2. Temperature, precipitation, ET, soil moisture stored
3. WeatherEvent nodes created in Neo4j
4. Time-series data in TimescaleDB
5. Error handling for API failures with user notification

**SDK Context:** httpx==0.27.0, kafka-python==2.0.2, timescale-vector==0.0.4

#### Story 2.6: Manual Weather 20/20 Entry
As a farmer, I need to enter Weather 20/20 analog years so that long-range planning is possible.

**Acceptance Criteria:**
1. Form for manual analog year entry
2. Validation of reasonable weather values
3. Analog years linked to growing seasons
4. Visualization of analog year patterns
5. Integration with scenario planning

**SDK Context:** httpx==0.27.0, recharts@2.12.7

#### Story 2.7: Soil Test Data Import
As a farmer, I need to upload soil test results so that fertility is considered.

**Acceptance Criteria:**
1. PDF upload and parsing for Ward Labs format
2. Manual entry form for N, P, K, pH, OM values
3. SoilTest nodes created and linked to fields
4. Historical soil tests viewable
5. Validation of reasonable ranges

**SDK Context:** pypdf==4.3.1, pandas==2.2.2

### Epic 3: Basic Prediction Engine
**Goal:** Enable yield predictions with proper uncertainty quantification for informed decision-making.

**Timeline:** Weeks 9-12 (Phase 1b)
**Value Delivered:** Yield predictions ±12 bu/acre, insurance optimization worth $8-12/acre

#### Story 3.1: Historical Yield Data Import
As a farmer, I need to upload yield monitor data so that models can be trained.

**Acceptance Criteria:**
1. Shapefile upload and processing
2. Yield data cleaned for outliers and edge effects
3. Yield nodes created with bushels, moisture values
4. Spatial averaging by field
5. Validation of reasonable yield ranges

**SDK Context:** rasterio==1.3.10, geopandas==0.14.4

#### Story 3.2: Basic Yield Prediction Model
As a farmer, I need yield predictions for planning so that I can make informed decisions.

**Acceptance Criteria:**
1. Random Forest model trained on historical data
2. Features from weather, soil, rotation history
3. Predictions achieve <12 bu/acre MAE for wheat
4. Model versioning with MLflow
5. Predictions generated per field

**SDK Context:** scikit-learn==1.5.1, mlflow==2.15.1, feast==0.40.0

#### Story 3.3: Uncertainty Quantification
As a farmer, I need to see confidence intervals so that I understand prediction reliability.

**Acceptance Criteria:**
1. 90% prediction intervals calculated
2. Uncertainty increases with forecast horizon
3. Confidence bands displayed visually
4. Quantile regression implemented
5. Calibration validated on test data

**SDK Context:** scikit-learn==1.5.1, scipy==1.14.0

#### Story 3.4: Weather Scenario Analysis
As a farmer, I need to see yields under different weather scenarios so that I can plan for variability.

**Acceptance Criteria:**
1. 3 scenarios generated (wet/normal/dry)
2. Probability-weighted outcomes calculated
3. Scenario comparison visualization
4. Integration with analog years
5. Export scenario results

**SDK Context:** numpy==1.26.4, scipy==1.14.0

#### Story 3.5: Insurance Portfolio Analyzer
As a farmer, I need insurance recommendations so that I optimize coverage vs cost.

**Acceptance Criteria:**
1. RP/YP/ECO/SCO products analyzed
2. Optimal coverage levels calculated
3. Expected indemnities vs premiums shown
4. $8-12/acre savings identified
5. Monte Carlo simulation for outcomes

**SDK Context:** scipy==1.14.0, cvxpy==1.5.3

#### Story 3.6: Model Validation Framework
As a developer, I need to validate predictions so that accuracy is proven.

**Acceptance Criteria:**
1. Spatial cross-validation implemented
2. Backtesting on 5 years historical data
3. Performance metrics dashboard
4. Model drift detection
5. Automated retraining triggers

**SDK Context:** great-expectations==0.18.19, mlflow==2.15.1

### Epic 4: Rotation Optimization Engine
**Goal:** Optimize multi-year rotations considering all agronomic and economic constraints.

**Timeline:** Weeks 13-16 (Phase 1b completion)
**Value Delivered:** $15-25/acre through optimal crop sequencing

#### Story 4.1: Rotation Constraint Framework
As a farmer, I need rotation rules enforced so that agronomic best practices are followed.

**Acceptance Criteria:**
1. Disease cycle constraints encoded
2. Volunteer pressure rules implemented
3. Nutrient considerations included
4. Constraint violations clearly shown
5. Custom constraints can be added

**SDK Context:** neo4j==5.24.0, pandas==2.2.2

#### Story 4.2: Market Price Integration
As a farmer, I need current crop prices so that profitability drives recommendations.

**Acceptance Criteria:**
1. Daily price updates retrieved
2. Local basis captured
3. Futures curves stored
4. Price data cached in Redis
5. Historical prices for backtesting

**SDK Context:** redis==5.0.8, kafka-python==2.0.2

#### Story 4.3: Basic Rotation Optimizer
As a farmer, I need optimal rotation recommendations so that long-term profit is maximized.

**Acceptance Criteria:**
1. 3-year rotation optimization
2. All constraints respected
3. Solution in <30 seconds
4. Clear explanation of recommendations
5. Alternative rotations shown

**SDK Context:** scipy==1.14.0, cvxpy==1.5.3, ortools==9.10.0

#### Story 4.4: Equipment Compatibility Checker
As a farmer, I need rotations that work with my equipment so that transitions are feasible.

**Acceptance Criteria:**
1. Equipment constraints applied to rotations
2. Row spacing compatibility validated
3. Incompatible options filtered out
4. Equipment limitations clearly shown
5. Upgrade recommendations provided

**SDK Context:** neo4j==5.24.0

#### Story 4.5: Lease Restriction Handler
As a farmer, I need lease restrictions considered so that landlord requirements are met.

**Acceptance Criteria:**
1. Lease terms captured per field
2. Crop restrictions enforced
3. Conservation requirements included
4. Lease violations prevented
5. Landlord reports available

**SDK Context:** neo4j==5.24.0, fastapi==0.112.0

#### Story 4.6: What-If Scenario Explorer
As a farmer, I need to test different rotations so that I can evaluate options.

**Acceptance Criteria:**
1. Graph cloning for scenarios
2. Side-by-side comparison view
3. Financial projections for each
4. Risk metrics displayed
5. Scenario saving and sharing

**SDK Context:** neo4j==5.24.0, react-force-graph@1.43.0

#### Story 4.7: Custom Constraint Addition
As a farmer, I need to add farm-specific constraints so that unique situations are handled.

**Acceptance Criteria:**
1. Rule builder UI intuitive
2. Constraint validation logic
3. Integration with optimizer
4. Custom rules clearly marked
5. Rule impact analysis shown

**SDK Context:** react-hook-form@7.52.2, zod@3.23.8

### Epic 5: Network Intelligence & Collaboration
**Goal:** Enable learning from farmer network and collaborative intelligence for better decisions.

**Timeline:** Months 5-6 (Phase 2)
**Value Delivered:** Network effects, validated recommendations, community learning

#### Story 5.1: Farmer Similarity Network
As a farmer, I need to see similar operations so that I can learn from peers.

**Acceptance Criteria:**
1. Similarity metrics calculated
2. Anonymous matching implemented
3. "Farmers like you" feature working
4. Community detection via Louvain
5. Privacy controls enforced

**SDK Context:** neo4j==5.24.0, scikit-learn==1.5.1

#### Story 5.2: Strip Trial Framework
As a farmer, I need to run strip trials so that recommendations are validated.

**Acceptance Criteria:**
1. Trial design tool functional
2. Randomization implemented
3. Statistical power calculated
4. Data collection protocol clear
5. Results analysis automated

**SDK Context:** scipy==1.14.0, statsmodels==0.14.2

#### Story 5.3: Influence Propagation Model
As a farmer, I need to see how neighbors affect my fields so that spatial effects are considered.

**Acceptance Criteria:**
1. Disease spread paths modeled
2. Practice adoption patterns shown
3. Influence strength quantified
4. GNN model trained and validated
5. Visualization of influence flows

**SDK Context:** torch==2.4.0, torch-geometric==2.5.3

#### Story 5.4: Community Success Patterns
As a farmer, I need to see what works locally so that proven practices are adopted.

**Acceptance Criteria:**
1. Success patterns identified
2. Pattern mining from network
3. Anonymized insights shared
4. Confidence levels shown
5. Adoption tracking enabled

**SDK Context:** neo4j==5.24.0, pandas==2.2.2

#### Story 5.5: Privacy Controls
As a farmer, I need to control data sharing so that competitive information is protected.

**Acceptance Criteria:**
1. Granular sharing settings
2. Anonymization options
3. Data deletion rights
4. Audit log of access
5. Consent management

**SDK Context:** cryptography==43.0.0

#### Story 5.6: Collaborative Pest/Disease Alerts
As a farmer, I need regional pest alerts so that I can take preventive action.

**Acceptance Criteria:**
1. Real-time alert system
2. Image-based detection
3. Spread prediction model
4. Treatment coordination
5. Alert customization

**SDK Context:** kafka-python==2.0.2, ultralytics==8.2.0

#### Story 5.7: Network Performance Dashboard
As a farmer, I need to see network-wide metrics so that collective progress is visible.

**Acceptance Criteria:**
1. Aggregate yield metrics
2. Adoption rate tracking
3. Success stories shared
4. Anonymized leaderboards
5. GraphQL API for queries

**SDK Context:** strawberry-graphql[fastapi]==0.237.0

### Epic 6: Advanced Visualization & User Experience
**Goal:** Make complex graph relationships intuitive and actionable through advanced visualizations.

**Timeline:** Months 7-8 (Phase 2 completion)
**Value Delivered:** 25% reduction in decision-making time, improved user adoption

#### Story 6.1: Interactive Graph Explorer
As a farmer, I need to explore my farm graph so that I understand relationships.

**Acceptance Criteria:**
1. Force-directed graph layout
2. 1000 nodes at 60fps
3. Zoom/pan/filter controls
4. Node/edge details on hover
5. Graph search functionality

**SDK Context:** react-force-graph@1.43.0, d3@7.9.0

#### Story 6.2: Temporal Graph Animation
As a farmer, I need to see changes over time so that patterns become clear.

**Acceptance Criteria:**
1. Timeline scrubber control
2. Smooth animated transitions
3. Seasonal progression shown
4. Historical playback
5. Future projections animated

**SDK Context:** d3@7.9.0, framer-motion@11.3.0

#### Story 6.3: Influence Flow Visualization
As a farmer, I need to see influence paths so that cause-effect is understood.

**Acceptance Criteria:**
1. Animated particle flows
2. Path highlighting on selection
3. Influence strength indicators
4. Directional flow arrows
5. Impact quantification shown

**SDK Context:** react-force-graph@1.43.0, three@0.167.0

#### Story 6.4: Graph-Enhanced Reports
As a farmer, I need printable reports so that I can share with advisors.

**Acceptance Criteria:**
1. PDF generation with graphs
2. Recommendation summaries
3. Financial projections included
4. Export to Excel/CSV
5. Custom report templates

**SDK Context:** reportlab==4.2.2, react-pdf@7.7.3

#### Story 6.5: Mobile Graph Viewer
As a farmer, I can view field graphs on mobile so that I can check while in field.

**Acceptance Criteria:**
1. Simplified 2D graphs
2. Touch gesture navigation
3. Offline mode with caching
4. PWA installable
5. Field-specific views

**SDK Context:** next@14.2.5, workbox@7.1.0

#### Story 6.6: Natural Language Graph Query
As a farmer, I can ask questions naturally so that complex queries are simple.

**Acceptance Criteria:**
1. NLP to Cypher translation
2. Query history maintained
3. Visual result display
4. Example queries provided
5. Error handling for ambiguous queries

**SDK Context:** openai==1.40.0, langchain==0.2.0

#### Story 6.7: Causal Path Explainer
As a farmer, I need recommendation explanations so that I trust the system.

**Acceptance Criteria:**
1. Causal chains visualized
2. Confidence levels shown
3. Alternative paths displayed
4. SHAP values calculated
5. Plain language explanations

**SDK Context:** shap==0.45.0, react-flow@11.11.4

#### Story 6.8: Performance Optimization
As a developer, I need fast graph rendering so that UX is smooth.

**Acceptance Criteria:**
1. 60fps for 1000 nodes achieved
2. Virtual scrolling implemented
3. Level-of-detail rendering
4. Lazy loading of data
5. Performance monitoring dashboard

**SDK Context:** web-vitals@4.2.2, @tanstack/react-virtual@3.8.4

## Section 7: Example Story with No-Fallback Standards

### EXAMPLE: Story 1.6 Weather Integration (Showing Strict Standards)

**Acceptance Criteria WITH No-Fallback Requirements:**

1. ✅ **Kansas Mesonet API integration polls ACTUAL LIVE API every 6 hours**
   - Must use real endpoint: https://mesonet.k-state.edu/api/
   - No cached responses unless explicitly authorized
   - If API fails: Show clear error "Weather data temporarily unavailable"
   - NO automatic fallback to old data without user consent

2. ✅ **Weather data creates WeatherEvent nodes from REAL DATA only**
   - Each node must have data_source: "LIVE_MESONET" or "USER_MANUAL_ENTRY"
   - No interpolation between stations without user approval
   - Missing values marked as NULL, not estimated

3. ✅ **Manual Weather 20/20 entry requires ACTUAL analog year data**
   - User must enter real Weather 20/20 report data
   - No pre-populated "typical" values
   - Validation against realistic ranges with explanations

4. ❌ **PROHIBITED WITHOUT AUTHORIZATION:**
   - Using historical weather files as "good enough"
   - Interpolating missing hours/days automatically
   - Defaulting to climatological averages
   - Creating synthetic weather scenarios for testing

5. ✅ **Required Error Handling:**
   ```python
   try:
       weather_data = fetch_live_mesonet_api()
   except APIException as e:
       # NO FALLBACK - Ask user what to do
       user_choice = prompt_user(
           "Weather API unavailable. Options:\n"
           "1. Wait and retry\n" 
           "2. Enter manual observations\n"
           "3. Continue with last known data (3 hours old)\n"
       )
       # User must explicitly choose - no automatic decision
   ```

6. ✅ **Audit Trail Requirements:**
   - Log: API call timestamp, success/failure, data quality score
   - If degraded: Log user consent with timestamp
   - Track: How many recommendations used degraded data

This example shows how EVERY story must handle real data requirements!

## Section 8: PM Checklist Results

### Executive Summary
- **Overall PRD Completeness:** 95% (All major sections complete)
- **MVP Scope Appropriateness:** Right-sized after refinement
- **Readiness for Architecture Phase:** Ready
- **Epic Structure:** Complete with 6 epics and 48 stories

### Category Analysis

| Category | Status | Notes |
|----------|--------|-------|
| Problem Definition & Context | PASS (95%) | Clear goals and background from brief |
| MVP Scope Definition | PASS (90%) | Phased approach well-defined |
| User Experience Requirements | PASS (85%) | Graph-first vision established |
| Functional Requirements | PASS (90%) | Comprehensive but focused |
| Non-Functional Requirements | PASS (95%) | Detailed performance targets |
| Epic & Story Structure | PASS (100%) | Complete with acceptance criteria |
| Technical Guidance | PASS (95%) | Neo4j strategy clear, SDKs defined |
| Cross-Functional Requirements | PASS (90%) | Partnerships and data strategy defined |
| Clarity & Communication | PASS (90%) | Technical but understandable |

### Key Strengths
- Exceptional domain knowledge evident
- Clear Neo4j graph-first architecture
- Phased delivery with progressive value
- SDK references integrated for development
- Strong scientific foundation with K-State partnership

### Recommendations Implemented
- Epic structure added with 48 user stories
- SDK context added to each story
- Acceptance criteria defined for all stories
- Phased approach clarified (1a, 1b, Phase 2)
- Success metrics and baselines established

## Section 9: Next Steps

### UX Expert Prompt
To initiate UX design, use the following prompt:

```
/BMad:agents:ux-expert

Review the FarmCalc PRD focusing on Section 3 (UI Design Goals) and Section 6 (Epic Structure). 

Priority: Design the graph-first user experience that makes complex agricultural relationships intuitive. Start with wireframes for Epic 1 (Foundation) and Epic 6 (Visualization) stories.

Key challenges to address:
1. Interactive graph visualization of farms/fields
2. Temporal changes (rotation history/future)
3. What-if scenario exploration
4. Mobile-responsive design for field use
5. Uncertainty visualization in predictions
```

### Architect Prompt
To initiate technical architecture, use the following prompt:

```
/BMad:agents:architect

Review the FarmCalc PRD, Epic Structure (Section 6), and SDK Reference document.

Priority: Design the technical architecture for a Neo4j Aura DB-first platform with FastAPI backend and React frontend. Focus on Phase 1a implementation (Epics 1-2).

Key technical decisions needed:
1. Neo4j Aura DB configuration and schema design
2. Microservice vs monolith for initial MVP
3. Real-time data pipeline (Mesonet → Kafka → TimescaleDB → Neo4j)
4. ML model deployment strategy
5. Performance optimization for graph queries
```

### Development Team Kickoff
Once architecture is complete:
1. Review Epic 1 stories with development team
2. Set up Neo4j Aura DB instance
3. Configure development environment per SDK reference
4. Begin Sprint 1 with Stories 1.1-1.3
5. Establish CI/CD pipeline early

### Stakeholder Communication
1. Share PRD v3.0 with pilot farmers for feedback
2. Finalize K-State partnership agreement
3. Begin pilot farm recruitment (target: 5 farms)
4. Set up weekly progress reviews
5. Establish success metrics tracking

---

*End of Product Requirements Document v3.0*