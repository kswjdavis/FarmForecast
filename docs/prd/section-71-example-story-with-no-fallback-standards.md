# Section 7.1: Example Story with No-Fallback Standards

## EXAMPLE: Story 1.6 Weather Integration (Showing Strict Standards)

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
