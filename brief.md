# Project Brief: FarmCalc Hamilton County Dryland Decision Intelligence Platform

## Executive Summary

**FarmCalc** is a cloud-based agricultural decision intelligence platform that revolutionizes dryland farming in Hamilton County, Kansas by optimizing multi-year rotation planning, insurance portfolios, and operational decisions through advanced mathematical modeling and real-time data integration. The system addresses the critical challenge of farming profitably in a 17-inch rainfall environment with 35% precipitation variability, where traditional annual planning approaches fail to capture the complex interactions between soil moisture carryover, rotation effects, and weather uncertainty. By serving 1,000-10,000 acre dryland operations evaluating winter wheat, grain sorghum (milo), corn, alternative crops, and cover crop vs fallow strategies, FarmCalc targets an immediate market of 500 farms managing 1.5M acres. The platform's key value proposition centers on delivering $25-40/acre profit improvements through scientifically-validated, water-optimized decision making that integrates Weather 20/20 Global's 6-12 month outlooks with Kansas State research, prioritizing decision quality and agronomic accuracy over speed.

## Problem Statement

Hamilton County farmers operate in one of the most challenging agricultural environments in the United States, with average annual precipitation of just 17 inches and a coefficient of variation exceeding 35%. This extreme variability means the difference between crop failure and exceptional yields can hinge on as little as 2-3 inches of stored soil moisture. Current decision-making tools fail to address the unique challenges of dryland farming, treating it as simply "irrigated farming without irrigation" rather than recognizing water as the primary constraint requiring fundamentally different optimization approaches.

The financial impact of suboptimal decisions in this environment is severe. Analysis of historical data shows that poor rotation choices, inadequate insurance coverage, and mistimed planting decisions cost the average 3,000-acre operation $75,000-120,000 annually. Critical decisions like choosing between traditional fallow periods versus cover crops for soil health, evaluating alternative crops (sunflowers, canola, triticale, sesame), or optimizing milo populations and configurations can mean the difference between profit and loss. The cover crop versus fallow decision alone represents a complex trade-off: cover crops can improve soil health, reduce erosion, and provide grazing value, but may deplete moisture reserves needed for the next cash crop. With hail probability at 18% and wheat failure rates at 15%, farmers face compound risks that simple spreadsheets and rules of thumb cannot adequately model. The integration challenge is equally problematic - farmers must manually synthesize Kansas Mesonet daily updates, Weather 20/20 Global seasonal outlooks, fluctuating commodity prices, complex insurance products (RP, ECO, SCO, hail), evolving K-State research recommendations, and emerging data on cover crop water usage versus fallow moisture accumulation.

Existing solutions fundamentally misunderstand dryland farming economics. Enterprise platforms like Climate FieldView and Granular were designed for corn belt operations with 40+ inches of rainfall and irrigation backup. University tools provide valuable research but exist in silos - a nitrogen calculator here, a variety trial database there - with no integration or multi-year planning capability. Local consultants offer experience but lack the computational tools to optimize across thousands of scenarios involving multiple crop alternatives and rotation strategies. Most critically, no existing tool properly models the cornerstone of successful dryland farming: the multi-year accumulation and depletion of soil moisture that determines whether next year's wheat crop thrives or fails, and whether alternative crops or cover crops are viable options in any given year.

The urgency for solving this problem has intensified with climate volatility, tightening margins, increasing complexity of risk management products, and new opportunities in alternative crops and soil health programs. The traditional knowledge transfer from generation to generation is breaking down as historical patterns become less reliable and new crops enter the rotation possibilities. Young farmers entering the industry need quantitative decision support to evaluate these expanding options, while established operations need validation for increasingly complex rotation decisions that balance profitability, soil health, and risk management. With input costs rising, commodity prices volatile, and carbon/sustainability programs emerging, the difference between optimal and suboptimal crop selection and rotation decisions has never been greater.

## Proposed Solution

FarmCalc addresses the dryland farming challenge through a comprehensive decision intelligence platform that treats water as the primary optimization constraint across all farming decisions. The core innovation lies in combining advanced mathematical optimization techniques - including two-stage stochastic programming, Markov decision processes with water memory states, and distributionally robust optimization - with cutting-edge machine learning models that are rigorously validated against K-State research data. This dual approach enables farmers to benefit from the latest AI advances while maintaining scientific credibility, keeping the platform ahead of traditional academic tools while ensuring every recommendation is grounded in proven agronomic principles.

The system's architecture centers on three integrated optimization engines powered by hybrid ML-optimization approaches. First, the Multi-Year Rotation Optimizer combines dynamic programming with deep reinforcement learning agents trained on 30 years of yield data, evaluating millions of rotation scenarios including traditional crops (wheat, milo, corn), alternative crops (sunflowers, canola, triticale), and cover crop versus fallow strategies. The ML models identify complex nonlinear patterns in moisture-yield relationships that traditional models miss, while K-State validation ensures these patterns are agronomically sound. Second, the Insurance Portfolio Optimizer employs ensemble methods combining gradient boosting with mixed-integer programming to find optimal coverage strategies, learning from historical claim patterns while respecting actuarial constraints. Third, the In-Season Decision Engine uses transformer-based architectures to process multi-modal data streams - Kansas Mesonet stations, Sentinel-2 imagery, weather forecasts - generating recommendations that outperform rule-based systems by 15-20% in backtesting while remaining fully explainable through SHAP analysis.

What sets FarmCalc apart is its unique position at the intersection of agricultural AI innovation and rigorous scientific validation. The platform employs advanced techniques like physics-informed neural networks that embed conservation laws (water balance, energy balance) directly into the ML architecture, ensuring predictions respect fundamental agronomic principles. Ensemble Kalman filtering fuses multiple data sources for soil moisture estimation with uncertainty quantification. Graph neural networks model spatial dependencies between fields, capturing how management decisions on one field affect neighboring areas. Yet every model output is continuously validated against K-State variety trials, long-term rotation studies, and on-farm strip trial results. The system explicitly models phenomena through both ML pattern recognition and mechanistic understanding: the 28% moisture recharge efficiency during fallow periods (validated through lysimeter studies), yield penalties from continuous cropping (learned from 20-year rotation trials), cover crop water dynamics (combining remote sensing with soil probe networks), and stripper header residue effects (quantified through paired field comparisons).

The solution maintains technological leadership through a continuous innovation pipeline while building trust through transparent validation. Every ML model includes interpretability layers showing which factors drive each recommendation, with side-by-side comparisons to traditional methods and K-State guidelines. The platform runs parallel experiments comparing novel neural architecture predictions with established agronomic models, only deploying new approaches after demonstrating superior performance across multiple seasons. A deep GPT-5 integration serves as an intelligent agricultural advisor, translating complex model outputs into plain language explanations, answering "what-if" questions in natural conversation, and helping farmers understand not just what the system recommends but why - explaining interactions between weather patterns, soil conditions, and crop responses in terms that connect to their on-ground experience. The AI assistant can walk through scenarios like "What happens if we get 2 inches in April versus May?" or "Why is the model suggesting canola this year when we've never grown it?" providing contextual education alongside recommendations. Additional advanced capabilities like automated hypothesis generation for testing new rotation strategies and predictive alerts for emerging pest/disease risks position FarmCalc years ahead of conventional tools. This creates a unique value proposition: farmers get access to technology more advanced than what universities are developing, but with the confidence that comes from rigorous academic validation and the ease of use that comes from conversational AI guidance.

## Target Users

### Primary User Segment: Progressive Technology Adopters

These are forward-thinking farmers managing 2,000-10,000 acres of dryland operations who already use some precision agriculture tools and are comfortable with data-driven decision making. Typically aged 35-50, they have college education (often in agriculture or business) and actively seek competitive advantages through technology adoption. They currently struggle with integrating multiple data sources, validating new practices before full implementation, and optimizing complex multi-year decisions. Their primary goals are maximizing risk-adjusted returns, staying ahead of neighbors in adopting profitable practices, and building resilient operations that can weather extreme years. They value detailed explanations of recommendations and want to understand the "why" behind decisions. The GPT-5 integration particularly appeals to this segment as they can explore scenarios and deepen their understanding through natural conversation.

### Secondary User Segment: Risk-Conscious Established Operations

These are multi-generational farming operations managing 1,000-5,000 acres, typically led by farmers aged 45-65 who prioritize stability and proven practices. While not early technology adopters, they recognize the increasing complexity of modern farming and need help navigating new insurance products, alternative crops, and sustainability programs. They currently rely on trusted advisors, extension services, and peer networks for decisions but struggle with the pace of change in markets, climate patterns, and available options. Their goals center on preserving farm equity, reducing downside risk in volatile years, and gradually modernizing operations without abandoning proven practices. The K-State validation and side-by-side comparison features are critical for this segment, as is the ability to see how recommendations performed on similar operations before implementing them.

## Goals & Success Metrics

### Business Objectives
- **Market Penetration**: Achieve 25 pilot farms in Year 1, 100 paying customers in Year 2, capturing 10% of Hamilton County market (50 farms) by Year 3
- **Revenue Growth**: Generate $250K ARR by end of Year 1, $1.5M ARR by Year 2, with average contract value of $15,000/farm/year
- **Geographic Expansion**: Establish presence in 3 adjacent counties by Year 2, expand to Eastern Colorado and Oklahoma Panhandle by Year 3
- **Technology Leadership**: Maintain 18-month advantage over academic tools through continuous ML model improvements and GPT integration enhancements
- **Partnership Development**: Secure partnerships with 5 insurance agencies, 3 grain elevators, and 2 equipment dealers by Year 2

### User Success Metrics
- **Profit Improvement**: Deliver verified $25-40/acre profit increase across pilot farms within first full season
- **Decision Accuracy**: Achieve <8 bu/acre yield prediction RMSE and 85% accuracy on optimal rotation recommendations
- **Risk Reduction**: Reduce coefficient of variation in farm profits by 15-20% through optimized insurance and rotation strategies
- **Adoption Rate**: Achieve 70% implementation rate of system recommendations among active users
- **User Engagement**: Maintain weekly active usage during critical decision periods (planting, insurance, harvest marketing)

### Key Performance Indicators (KPIs)
- **Model Performance**: ML models outperform traditional methods by 15-20% in cross-validation testing
- **Platform Reliability**: 99.5% uptime during critical decision windows (March-April, September-October)
- **Optimization Quality**: Solution gap <2% from theoretical optimum in computational benchmarks
- **User Satisfaction**: Net Promoter Score >50, with >4.5/5 average rating
- **Data Freshness**: Kansas Mesonet data updated within 6 hours, Weather 20/20 outlooks integrated within 24 hours
- **Support Response**: <2 hour response time during planting/harvest, <24 hours off-season
- **Validation Accuracy**: Strip trial results within 10% of predicted outcomes for 80% of trials
- **AI Assistant Effectiveness**: 85% of user questions answered without human support escalation

## MVP Scope

### Core Features (Must Have)

- **Multi-Year Rotation Optimizer:** Dynamic programming engine evaluating wheat-sorghum-fallow, wheat-sorghum-corn, and alternative crop rotations with full moisture carryover modeling. Includes cover crop vs fallow analysis with water usage trade-offs and soil health impacts quantified.

- **Weather Integration & Scenario Engine:** Real-time Kansas Mesonet data ingestion (temperature, precipitation, ET, soil moisture) combined with Weather 20/20 Global analog year processing to generate 25 probabilistic scenarios for stochastic optimization.

- **Insurance Portfolio Optimizer:** Mixed-integer optimization for RP (70-85% coverage levels), ECO (86-95% bands), SCO integration, and hail coverage optimization considering Hamilton County's 18% annual probability and typical damage patterns.

- **Yield Prediction Models:** Physics-informed neural networks calibrated to K-State Tribune and Garden City trials, with separate models for wheat, sorghum, corn, and emerging alternative crops (sunflowers, canola, triticale).

- **Carbon Credit & Sustainability Optimizer:** Integrated tracking and optimization for carbon sequestration programs including cover crop adoption, no-till practices, and nitrogen management. Automated documentation for CIBO, Indigo Ag, and Nori marketplace requirements with revenue projections of $15-40/acre from carbon programs integrated into rotation decisions. Tracks additionality requirements and baseline establishment for program eligibility.

- **GPT-5 Agricultural Assistant:** Natural language interface for scenario exploration, recommendation explanations, and "what-if" analysis. Includes context-aware responses about local conditions, historical patterns, agronomic principles, and carbon market opportunities.

- **Decision Dashboard:** Web-based interface showing current field conditions, optimization results with confidence intervals, side-by-side comparisons with traditional practices, carbon credit accumulation projections, and strip trial validation metrics.

- **Data Input Systems:** Harvest Profit API integration for pulling historical field records, input costs, and yield data. Manual soil test entry form with fields for N, P, K, pH, organic matter, CEC, and micronutrients. Optional API integration with commercial labs (Ward Labs, Servi-Tech, K-State Soil Testing Lab) for automatic import. Bulk upload capability for historical data via CSV/Excel templates.

### Out of Scope for MVP

- Mobile native applications (web-responsive only)
- Real-time commodity trading integration
- Automated equipment control/variable rate prescriptions
- Livestock integration and grazing management
- Custom report builder beyond standard templates
- Multi-tenant/enterprise farm management features
- Offline mode operation
- Direct carbon credit marketplace transactions (documentation only)

### MVP Success Criteria

The MVP will be considered successful when it demonstrates measurable value on 25 pilot farms through a complete growing season, achieving: (1) Verified profit improvement of at least $25/acre through optimized decisions including carbon revenue, (2) Successful integration of all core data sources (Mesonet, Weather 20/20, K-State research, carbon program requirements), (3) User adoption with >70% of recommendations implemented, (4) Strip trial validation showing model predictions within 15% of actual outcomes, (5) At least 10 farms enrolled in carbon programs with projected revenue of $20+/acre, and (6) Positive user feedback with specific testimonials about decision improvements and ease of understanding through the GPT-5 assistant.

## Post-MVP Vision

### Phase 2 Features

Building on MVP success, Phase 2 (Months 7-12) will expand the platform's intelligence and automation capabilities. Real-time commodity market integration will enable dynamic marketing recommendations, alerting farmers to optimal selling windows based on basis patterns and futures curves. Variable rate prescription generation will translate optimization outputs into equipment-ready files for precision planting and fertilizer application. Advanced carbon credit features will move beyond documentation to include direct marketplace integration, automated verification through satellite monitoring, and portfolio optimization across multiple carbon programs. The GPT-5 assistant will gain multimodal capabilities, analyzing uploaded field photos for disease/pest identification and providing visual explanations of complex recommendations through generated infographics. Livestock integration will optimize grazing rotations on cover crops and wheat pasture, calculating stocking rates based on forage availability and market conditions.

### Long-term Vision

Over the 1-2 year horizon, FarmCalc will evolve into a comprehensive agricultural intelligence platform that anticipates farmer needs before they arise. Autonomous monitoring agents will continuously scan weather patterns, market conditions, and field sensors to proactively alert users to emerging opportunities or threats. The platform will expand geographically across the Great Plains dryland region, with ML models automatically adapting to local conditions through transfer learning. Integration with John Deere Operations Center, Climate FieldView, and other farm management systems will create a unified data ecosystem. Advanced features will include supply chain optimization (connecting directly with grain elevators and input suppliers), collaborative farming networks (enabling neighbors to coordinate equipment use and bulk purchasing), and generative AI capabilities that draft grant applications, create custom research reports, and even generate testimony for crop insurance claims. The platform will pioneer "digital twin" farming where every field has a continuously updated simulation model that tests thousands of scenarios in parallel.

### Expansion Opportunities

The FarmCalc platform architecture creates multiple expansion pathways beyond the initial dryland farming focus. International markets with similar water-limited agriculture (Australia's wheat belt, Argentina's western provinces, Spain's dryland regions) represent $500M+ in addressable market. Crop-specific versions optimized for high-value specialty crops (pulse crops, hemp, specialty grains for craft brewing) can command premium pricing. The underlying optimization engine can be adapted for irrigated agriculture with water rights trading and aquifer depletion modeling. A consulting services layer would provide custom analysis for large corporate farms, agricultural lenders evaluating loan applications, and insurance companies setting rates. The data and insights generated by the platform create opportunities for an agricultural intelligence marketplace where anonymized, aggregated data informs commodity traders, equipment manufacturers, and policy makers. University partnerships could create an academic tier providing researchers with advanced modeling tools and access to on-farm validation data, accelerating agricultural innovation.

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web application (Chrome, Firefox, Safari, Edge) optimized for desktop and tablet displays with responsive design for 1024px+ screens. Cloud-based computation with no offline requirements given model complexity.
- **Browser/OS Support:** Modern browsers (2 years back), Windows 10+, macOS 11+. Desktop-focused interface for complex decision making.
- **Performance Requirements:** Optimization results in <30 seconds for 10,000 acres using cloud compute (AWS c5.4xlarge), real-time updates every 6 hours for weather data, sub-second response for GPT-5 queries using streaming responses.

### Technology Preferences

- **Frontend:** React 18+ with TypeScript for type safety, Material-UI for consistent design system, D3.js and Recharts for interactive visualizations, MapboxGL for geospatial field mapping, React Query for efficient data fetching and caching
- **Backend:** Python FastAPI for high-performance async API, Celery for distributed task processing, Redis for caching and real-time updates
- **Mathematical Optimization Engines:** Google OR-Tools 9.7+ as primary solver (free, handles MILP/CP/VRP with SCIP and CP-SAT backends), CVXPY 1.4+ for convex optimization and disciplined convex programming verification, SciPy.optimize for nonlinear problems and curve fitting, optional commercial solver interfaces (Gurobi, CPLEX) for enterprise deployments requiring certified optimality gaps
- **Machine Learning Stack:** PyTorch for deep learning models (physics-informed neural networks, transformers), Scikit-learn 1.3+ for classical ML (random forests, gradient boosting), StatsModels 0.14+ for time series and econometric analysis, NumPy 1.26+/Pandas 2.1+ for numerical computing, GeoPandas/Rasterio for geospatial crop field analysis
- **Database:** PostgreSQL 15+ with TimescaleDB extension for time-series weather data, PostGIS 3.3+ for geospatial field boundaries, MongoDB for unstructured satellite imagery metadata, S3-compatible object storage for ML model artifacts
- **Hosting/Infrastructure:** AWS or GCP cloud deployment, Kubernetes for container orchestration, auto-scaling compute for optimization workloads (c5.4xlarge baseline), CDN for static assets, GPU instances (T4/V100) for ML inference

### Architecture Considerations

- **Repository Structure:** Monorepo with clear separation: /frontend (React app), /backend (Python API), /ml-models (training and serving), /optimization (OR-Tools solvers), /infrastructure (IaC with Terraform)
- **Service Architecture:** Microservices for core functions: optimization-service, ml-inference-service, data-ingestion-service, notification-service. Event-driven architecture using message queues for asynchronous processing. GraphQL federation for unified API across services.
- **Integration Requirements:** REST APIs for Kansas Mesonet (hourly pulls), Harvest Profit API for field records/input costs, Weather 20/20 manual entry interface, OAuth2 for carbon marketplace authentication, Soil test data entry (manual + lab API integration for Ward Labs/Servi-Tech/K-State), AgGateway ADAPT framework for equipment compatibility
- **Security/Compliance:** SOC 2 Type II compliance for enterprise customers, end-to-end encryption for sensitive farm data, role-based access control with field-level permissions, GDPR-compliant data handling for international expansion, regular penetration testing and security audits

## Constraints & Assumptions

### Constraints

- **Budget:** $2M total investment for 8-week development plus first year operations
- **Timeline:** 8 weeks to MVP, pilot deployment for 2025 growing season
- **Resources:** 5-person development team with optimization, ML, and agricultural domain expertise
- **Technical:** Limited to cloud deployment due to computational requirements (no mobile/offline)
- **Geographic:** Initial focus on Hamilton County and adjacent dryland areas only

### Key Assumptions

- Weather 20/20 Global data will be manually entered weekly by users
- K-State research data provides sufficient calibration for yield models
- OR-Tools can achieve <30 second optimization without commercial solvers
- Farmers will adopt recommendations at 70%+ rate with proper validation
- 28% fallow moisture storage efficiency holds across soil types
- Stripper header adoption feasible for 50% of wheat acres
- Carbon credit programs will maintain $15-40/acre opportunity

## Risks & Open Questions

### Key Risks

- **Weather Data Quality:** Kansas Mesonet station coverage gaps may require interpolation
- **Model Accuracy:** Extreme weather events outside historical training data
- **Adoption Resistance:** Conservative farmers may need 2+ seasons of proof
- **Integration Complexity:** Manual Weather 20/20 entry may reduce usage
- **Computational Performance:** Complex scenarios may exceed 30-second target

### Open Questions

- How to handle fields with mixed soil types for PAW calculations?
- Should we integrate with John Deere Operations Center in Phase 2?
- What's the optimal frequency for Weather 20/20 Global updates?
- How to validate carbon credit additionality claims?
- Should we include livestock grazing on wheat/cover crops?

### Areas Needing Further Research

- Cover crop water use coefficients specific to Hamilton County
- Optimal skip-row configurations for different rainfall scenarios
- Insurance basis risk for ECO products in extreme years
- Market demand for alternative crops (canola, sunflowers)
- Integration with local elevator contracting systems

## Appendices

### A. K-State Data Sources Priority List

**Tier 1 - Immediate Integration:**
- Kansas Mesonet: ET, soil temp, GDD, freeze monitoring, consecutive dry days
- Kansas Crop Performance Tests (KCPT): Wheat and sorghum variety trials
- MF-2586: Soil test interpretations and fertilizer recommendations
- AgManager.info: Basis tool and historical patterns

**Tier 2 - Phase 2 Integration:**
- Long-term rotation studies from Garden City SWREC and Tribune NWREC
- EP-130: Wheat fungicide efficacy tables
- KFMA enterprise benchmarks for validation
- KDA/K-State custom rates survey

**Tier 3 - Future Enhancement:**
- Kansas DASC geoportal for imagery
- Chemical Weed Control Guide
- OpenET field-scale ET validation

### B. Hamilton County Specific Parameters

**Environmental Constants:**
- Average precipitation: 17.6 inches/year
- Coefficient of variation: 35%
- Fallow efficiency: 28% moisture storage
- Hail probability: 18% annual
- Freeze-free period: 150-180 days

**Crop-Specific Thresholds:**
- Wheat: 7 inches minimum water, 5.5 bu/inch WUE
- Sorghum: 6 inches minimum, 9.5 bu/inch WUE
- Corn: 12 inches minimum, 8.0 bu/inch WUE
- Optimal sorghum population: 25,000 plants/acre

### C. Key Stakeholders

- **Development Team:** 5 specialists (lead, optimization, data, ML, frontend)
- **Advisory Board:** K-State Extension, Weather 20/20, local farmers
- **Pilot Farmers:** 3-5 Hamilton County operations, 1,000-5,000 acres each
- **Data Partners:** Kansas Mesonet, AgManager, KFMA
- **Validation Partners:** K-State Research and Extension

## Next Steps

### Immediate Actions (Week 1)

1. Secure AWS/GCP cloud infrastructure and set up development environment
2. Obtain Kansas Mesonet API credentials and test connectivity
3. Create Weather 20/20 Global manual entry schema and UI mockup
4. Download K-State variety trial data for 2024-2025
5. Identify and contact 3-5 pilot farmers for participation

### Development Kickoff (Week 2)

1. Implement Kansas Mesonet data pipeline with daily pulls
2. Build OR-Tools optimization framework with SCIP backend
3. Create water balance model with PAW tracking
4. Design Weather 20/20 analog year scenario generator
5. Establish Git repository with BMad project structure

### Pilot Farm Preparation

1. Collect historical yield and management data from pilot farms
2. Map field boundaries and soil types
3. Establish strip trial protocols for validation
4. Set up data sharing agreements
5. Schedule training sessions for Weather 20/20 Global entry

### Success Criteria for Launch

- [ ] Kansas Mesonet integration operational with <1 hour lag
- [ ] Weather 20/20 manual entry tested and validated
- [ ] Optimization completes in <30 seconds for 5,000 acres
- [ ] 3-year backtest shows <8 bu/ac yield RMSE
- [ ] Web interface accessible and responsive
- [ ] Pilot farmers trained on system use
- [ ] Strip trial protocols approved by K-State Extension

---

**Document Status:** Complete
**Last Updated:** December 2024
**Next Review:** After Week 4 Development Milestone
**Distribution:** Development Team, Advisory Board, Pilot Farmers