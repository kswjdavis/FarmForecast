# Section 6: Epic Development Standards

## UNIVERSAL ACCEPTANCE CRITERIA FOR ALL STORIES

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

## EPIC-SPECIFIC ENFORCEMENT

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

## DEVELOPER AFFIRMATION

Each developer must acknowledge before starting work:

"I understand that:
- No mock data without written authorization
- No fallbacks without explicit user consent  
- No workarounds without documented approval
- Real APIs and data sources must be used
- Violations will result in PR rejection
- These standards protect farmer trust and safety"

Signed: _________________ Date: _________________
