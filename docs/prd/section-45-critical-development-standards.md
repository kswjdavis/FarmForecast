# Section 4.5: Critical Development Standards

## NO UNAUTHORIZED FALLBACKS OR WORKAROUNDS

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
