# Section 3.5: Data Quality & Minimum Viable Dataset

## Minimum Data Requirements for Reliable Predictions

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
