# Epic 3: Field Management & Data Foundation (REVISED)

**Epic ID:** FARM-EPIC-003  
**Priority:** P0 - Critical Path  
**Duration:** Sprint 3-4 (2 weeks)  
**Dependencies:** Epic 1 & 2 COMPLETE with Weather Integration  
**Value Delivered:** Field-specific intelligence enabling $15-20/acre optimization

## ⚠️ CRITICAL DATA FOUNDATION REQUIREMENT

**THIS EPIC ESTABLISHES THE SPATIAL & HISTORICAL DATA FOUNDATION FOR ALL ML MODELS**

---

## User Stories

### 🔴 Story 3.0: Data Quality Gates [BLOCKS ALL ML FEATURES]
**Points:** 8  
**Assignee:** Data Engineer  
**Type:** QUALITY ENFORCEMENT  
**Status:** ⛔ MUST PASS BEFORE ANY PREDICTION

**Definition of Done:**
```yaml
verification_gates:
  - field_boundaries: VALIDATED ✓
  - soil_tests: MINIMUM_3_YEARS ✓
  - yield_history: MINIMUM_2_YEARS ✓
  - rotation_history: COMPLETE ✓
  - data_quality_score: >80% ✓
```

**Pre-Epic Gate Check:**
```python
async def verify_data_foundation():
    """No ML predictions without quality data"""
    
    gates = {
        'weather_api': await verify_weather_integration(),  # From Epic 2
        'neo4j_connected': await verify_graph_database(),   # From Epic 1
        'minimum_fields': await count_user_fields() >= 1,
        'soil_data_exists': await check_soil_test_availability()
    }
    
    if not all(gates.values()):
        raise ValueError("""
        ❌ BLOCKED: Data foundation incomplete
        
        REQUIRED ACTIONS:
        1. Complete Epic 1 (Neo4j setup)
        2. Complete Epic 2 (Weather integration)
        3. Have at least one field defined
        4. Upload historical data
        
        BUSINESS IMPACT: Cannot deliver $15-20/acre value without data foundation
        """)
    
    return True

# This runs BEFORE any story in Epic 3
await verify_data_foundation()
```

**Data Quality Scoring Engine:**
```python
class DataQualityGate:
    """Enforces minimum data requirements for reliable predictions"""
    
    MINIMUM_REQUIREMENTS = {
        'yield_history': {'years': 2, 'weight': 0.3},
        'soil_tests': {'years': 3, 'weight': 0.25},
        'weather_data': {'days': 365, 'weight': 0.2},
        'field_boundaries': {'precision_meters': 5, 'weight': 0.15},
        'rotation_history': {'years': 3, 'weight': 0.1}
    }
    
    async def calculate_quality_score(self, field_id: str) -> Dict:
        """Returns quality score and blocks predictions if too low"""
        
        scores = {}
        total_score = 0
        
        # Check each data dimension
        for dimension, requirements in self.MINIMUM_REQUIREMENTS.items():
            dimension_score = await self._evaluate_dimension(
                field_id, dimension, requirements
            )
            scores[dimension] = dimension_score
            total_score += dimension_score * requirements['weight']
        
        # ENFORCEMENT: Block ML features if quality too low
        if total_score < 0.8:
            return {
                'score': total_score,
                'passed': False,
                'ml_enabled': False,
                'message': f'Need {0.8 - total_score:.0%} more data quality',
                'missing': [d for d, s in scores.items() if s < 0.7],
                'value_at_risk': 15  # $/acre that can't be captured
            }
        
        return {
            'score': total_score,
            'passed': True,
            'ml_enabled': True,
            'confidence_multiplier': total_score  # Affects prediction confidence
        }
```

---

### Story 3.1: Field Boundary Definition with Precision Validation
**Points:** 8  
**Assignee:** Full Stack Developer  
**Depends on:** Story 3.0, Neo4j from Epic 1  
**Gate:** Boundaries must be <5m precision for ML accuracy

**Implementation with Enforcement:**
```typescript
// apps/web/components/field-boundary-editor.tsx
export function FieldBoundaryEditor({ fieldId }: Props) {
  const [boundary, setBoundary] = useState<GeoJSON>();
  const [validation, setValidation] = useState<ValidationResult>();
  
  const validateBoundary = async (geojson: GeoJSON) => {
    // ENFORCEMENT: Check precision
    const precision = calculatePrecision(geojson);
    
    if (precision > 5) {
      setValidation({
        valid: false,
        message: `Boundary precision ${precision}m exceeds 5m requirement`,
        impact: 'ML predictions disabled until boundary refined',
        valueAtRisk: 15  // $/acre
      });
      return false;
    }
    
    // Check for overlaps with other fields
    const overlaps = await checkFieldOverlaps(geojson);
    if (overlaps.length > 0) {
      setValidation({
        valid: false,
        message: 'Boundary overlaps with existing fields',
        conflicts: overlaps
      });
      return false;
    }
    
    // Validate against county parcel data
    const parcelMatch = await validateAgainstParcels(geojson);
    if (parcelMatch < 0.9) {
      setValidation({
        warning: true,
        message: 'Boundary differs from county records',
        suggestion: 'Verify field boundaries are correct'
      });
    }
    
    return true;
  };
  
  const saveBoundary = async () => {
    if (!await validateBoundary(boundary)) {
      throw new Error('Cannot save invalid boundary');
    }
    
    // Store in Neo4j with spatial indexing
    await neo4j.run(`
      MATCH (f:Field {id: $fieldId})
      SET f.boundary = $boundary,
          f.acres = $acres,
          f.precision_meters = $precision,
          f.ml_ready = $precision <= 5
      CREATE (f)-[:HAS_BOUNDARY {
        created: datetime(),
        source: $source
      }]->(b:Boundary {
        geojson: $boundary,
        srid: 4326
      })
    `, {
      fieldId,
      boundary: JSON.stringify(boundary),
      acres: calculateAcres(boundary),
      precision: calculatePrecision(boundary),
      source: 'user_drawn'
    });
  };
}
```

---

### Story 3.2: Soil Test Data Integration with Historical Tracking
**Points:** 13  
**Assignee:** Backend Developer  
**Depends on:** Story 3.0  
**Gate:** Minimum 1 soil test required, 3 years for full ML accuracy

**Multi-Source Integration:**
```python
class SoilDataService:
    """Integrates soil tests from multiple sources with validation"""
    
    SUPPORTED_LABS = {
        'ward': WardLabsParser,
        'servitech': ServiTechParser,
        'kstate': KStateSoilLabParser,
        'manual': ManualEntryValidator
    }
    
    async def import_soil_test(
        self, 
        field_id: str,
        source: str,
        data: Union[Dict, bytes]
    ) -> Dict:
        """Import with validation and ML readiness check"""
        
        # Parse based on source
        parser = self.SUPPORTED_LABS[source]()
        parsed_data = await parser.parse(data)
        
        # Validate required fields for ML
        ml_requirements = {
            'nitrogen': ('ppm', lambda x: 0 <= x <= 200),
            'phosphorus': ('ppm', lambda x: 0 <= x <= 150),
            'potassium': ('ppm', lambda x: 0 <= x <= 800),
            'ph': (None, lambda x: 4.5 <= x <= 9.5),
            'organic_matter': ('percent', lambda x: 0 <= x <= 10),
            'cec': ('meq/100g', lambda x: 5 <= x <= 50)
        }
        
        ml_ready = True
        missing_for_ml = []
        
        for nutrient, (unit, validator) in ml_requirements.items():
            if nutrient not in parsed_data:
                ml_ready = False
                missing_for_ml.append(nutrient)
            elif not validator(parsed_data[nutrient]['value']):
                raise ValueError(f"Invalid {nutrient} value: {parsed_data[nutrient]}")
        
        # Store in Neo4j with temporal tracking
        result = await neo4j.run("""
            MATCH (f:Field {id: $field_id})
            CREATE (st:SoilTest {
                id: $test_id,
                date: date($test_date),
                lab: $lab,
                ml_ready: $ml_ready
            })
            SET st += $nutrients
            CREATE (f)-[:HAS_SOIL_TEST {
                imported: datetime(),
                source: $source
            }]->(st)
            
            // Update field ML readiness
            WITH f, st
            MATCH (f)-[:HAS_SOIL_TEST]->(all_tests:SoilTest)
            WITH f, collect(all_tests) as tests
            SET f.soil_test_years = size([t IN tests WHERE t.date > date() - duration('P3Y')]),
                f.ml_soil_ready = f.soil_test_years >= 3
            
            RETURN f.ml_soil_ready as ml_ready, f.soil_test_years as years
        """, {
            'field_id': field_id,
            'test_id': str(uuid.uuid4()),
            'test_date': parsed_data['date'],
            'lab': source,
            'nutrients': parsed_data['nutrients'],
            'ml_ready': ml_ready,
            'source': source
        })
        
        return {
            'imported': True,
            'ml_ready': ml_ready and result['ml_ready'],
            'years_of_data': result['years'],
            'missing_for_ml': missing_for_ml,
            'value_impact': 0 if ml_ready else 5  # $/acre lost without soil data
        }
```

---

### Story 3.3: Yield History Import with Validation
**Points:** 8  
**Assignee:** Backend Developer  
**Depends on:** Story 3.0  
**Gate:** Minimum 2 years history for predictions

**Yield Data Validation Engine:**
```python
class YieldHistoryService:
    """Enforces yield data quality for ML training"""
    
    async def import_yield_history(
        self,
        field_id: str,
        yield_data: List[Dict]
    ) -> Dict:
        """Import with outlier detection and validation"""
        
        # Group by crop type
        by_crop = defaultdict(list)
        for record in yield_data:
            by_crop[record['crop']].append(record)
        
        # Validate each crop's yield history
        validation_results = {}
        for crop, records in by_crop.items():
            # Get expected ranges from K-State data
            expected_range = await self.get_kstate_yield_range(
                crop, 
                'Hamilton County'
            )
            
            # Detect outliers
            yields = [r['yield'] for r in records]
            outliers = self.detect_outliers(yields, expected_range)
            
            # Calculate data quality
            quality_score = 1.0 - (len(outliers) / len(yields))
            
            validation_results[crop] = {
                'records': len(records),
                'outliers': outliers,
                'quality': quality_score,
                'ml_ready': len(records) >= 2 and quality_score > 0.7
            }
        
        # Store validated data in Neo4j
        for crop, result in validation_results.items():
            if result['ml_ready']:
                await self._store_yield_history(
                    field_id, 
                    crop, 
                    by_crop[crop],
                    result
                )
        
        # Calculate overall ML readiness
        ml_ready_crops = [c for c, r in validation_results.items() 
                         if r['ml_ready']]
        
        return {
            'imported': len(yield_data),
            'ml_ready_crops': ml_ready_crops,
            'ml_enabled': len(ml_ready_crops) > 0,
            'confidence_impact': min([r['quality'] for r in validation_results.values()]),
            'value_enabled': len(ml_ready_crops) * 5  # $/acre per crop
        }
    
    def detect_outliers(self, yields: List[float], expected_range: Dict) -> List:
        """Statistical outlier detection with agronomic bounds"""
        
        # Method 1: Agronomic bounds
        agronomic_outliers = [
            y for y in yields 
            if y < expected_range['min'] * 0.5 or y > expected_range['max'] * 1.5
        ]
        
        # Method 2: Statistical (Modified Z-Score)
        if len(yields) > 3:
            median = np.median(yields)
            mad = np.median(np.abs(yields - median))
            modified_z_scores = 0.6745 * (yields - median) / mad
            statistical_outliers = [
                y for y, z in zip(yields, modified_z_scores) 
                if np.abs(z) > 3.5
            ]
        else:
            statistical_outliers = []
        
        # Combine both methods
        return list(set(agronomic_outliers + statistical_outliers))
```

---

### Story 3.4: Rotation History Capture with Plant-Back Validation
**Points:** 13  
**Assignee:** Full Stack Developer  
**Depends on:** Story 3.0, Weather from Epic 2  
**Gate:** Must track herbicide applications for carryover

**Rotation & Herbicide Tracking:**
```typescript
// apps/api/services/rotation-service.ts
export class RotationService {
  /**
   * CRITICAL: Herbicide carryover is PRIMARY value driver
   * Must track ALL applications for plant-back restrictions
   */
  
  async recordRotation(
    fieldId: string,
    rotation: RotationRecord
  ): Promise<RotationValidation> {
    // ENFORCEMENT: Validate against herbicide restrictions
    if (rotation.herbicides && rotation.herbicides.length > 0) {
      for (const herbicide of rotation.herbicides) {
        // Check if application is valid
        const restrictions = await this.getHerbicideRestrictions(
          herbicide.product
        );
        
        // Calculate accumulated precipitation since application
        const weather = await weatherService.getPrecipitationSince(
          fieldId,
          herbicide.applicationDate
        );
        
        // Store restriction status
        await neo4j.run(`
          MATCH (f:Field {id: $fieldId})
          CREATE (h:HerbicideApplication {
            id: $appId,
            product: $product,
            rate: $rate,
            date: date($date),
            ai: $activeIngredient
          })
          CREATE (f)-[:APPLIED_HERBICIDE {
            crop_year: $year,
            precipitation_since: $precip,
            restriction_active: $precip < $required_precip
          }]->(h)
          
          // Create restriction node for tracking
          CREATE (r:PlantBackRestriction {
            herbicide: $product,
            required_precipitation: $required_precip,
            days_restriction: $days,
            crops_affected: $affected_crops
          })
          CREATE (h)-[:HAS_RESTRICTION]->(r)
        `, {
          fieldId,
          appId: uuid(),
          product: herbicide.product,
          rate: herbicide.rate,
          date: herbicide.applicationDate,
          activeIngredient: restrictions.ai,
          year: rotation.year,
          precip: weather.total,
          required_precip: restrictions.precipitationRequired,
          days: restrictions.dayRestriction,
          affected_crops: restrictions.affectedCrops
        });
        
        // ALERT if restriction prevents planned crop
        if (rotation.plannedNextCrop && 
            restrictions.affectedCrops.includes(rotation.plannedNextCrop)) {
          const canPlant = weather.total >= restrictions.precipitationRequired ||
                          daysSince(herbicide.applicationDate) >= restrictions.dayRestriction;
          
          if (!canPlant) {
            return {
              valid: false,
              error: `RESTRICTION: ${herbicide.product} prevents ${rotation.plannedNextCrop}`,
              precipitationNeeded: restrictions.precipitationRequired - weather.total,
              daysRemaining: restrictions.dayRestriction - daysSince(herbicide.applicationDate),
              valueAtRisk: 15  // $/acre
            };
          }
        }
      }
    }
    
    // Store rotation record
    await this.storeRotationRecord(fieldId, rotation);
    
    // Update field's rotation complexity score (affects ML confidence)
    await this.updateRotationComplexity(fieldId);
    
    return {
      valid: true,
      stored: true,
      restrictionsActive: await this.getActiveRestrictions(fieldId),
      mlDataYears: await this.getRotationHistoryYears(fieldId)
    };
  }
}
```

---

### Story 3.5: Equipment Inventory with Compatibility Matrix
**Points:** 5  
**Assignee:** Backend Developer  
**Depends on:** Story 3.0  
**Gate:** Equipment constraints affect rotation optimization

**Equipment Constraint System:**
```python
class EquipmentService:
    """Tracks equipment to enforce rotation feasibility"""
    
    async def add_equipment(
        self,
        farm_id: str,
        equipment: Dict
    ) -> Dict:
        """Add equipment with crop compatibility matrix"""
        
        # Validate equipment type and capabilities
        capabilities = self.EQUIPMENT_CAPABILITIES.get(
            equipment['type'],
            {}
        )
        
        # Determine crop compatibility
        compatible_crops = []
        incompatible_crops = []
        
        for crop in self.SUPPORTED_CROPS:
            requirements = self.CROP_REQUIREMENTS[crop]
            
            # Check if equipment meets crop needs
            if equipment['type'] in requirements['required_equipment']:
                if self._check_specifications(equipment, requirements):
                    compatible_crops.append(crop)
                else:
                    incompatible_crops.append({
                        'crop': crop,
                        'reason': self._get_incompatibility_reason(equipment, requirements)
                    })
        
        # Store in Neo4j with relationships
        result = await neo4j.run("""
            MATCH (f:Farm {id: $farm_id})
            CREATE (e:Equipment {
                id: $eq_id,
                type: $type,
                make: $make,
                model: $model,
                width_feet: $width,
                year: $year
            })
            CREATE (f)-[:OWNS_EQUIPMENT {
                acquired: date($acquired),
                status: $status
            }]->(e)
            
            // Create crop compatibility relationships
            WITH e
            UNWIND $compatible_crops as crop
            MATCH (c:Crop {name: crop})
            CREATE (e)-[:CAN_PLANT]->(c)
            
            RETURN e.id as equipment_id
        """, {
            'farm_id': farm_id,
            'eq_id': str(uuid.uuid4()),
            **equipment,
            'compatible_crops': compatible_crops
        })
        
        # Update rotation constraints
        await self._update_rotation_constraints(farm_id, incompatible_crops)
        
        return {
            'stored': True,
            'equipment_id': result['equipment_id'],
            'compatible_crops': compatible_crops,
            'constraints_added': incompatible_crops,
            'rotation_impact': len(incompatible_crops) > 0
        }
    
    async def check_rotation_feasibility(
        self,
        farm_id: str,
        rotation_plan: List[str]
    ) -> Dict:
        """Verify equipment can handle proposed rotation"""
        
        # Get farm equipment
        equipment = await self.get_farm_equipment(farm_id)
        
        feasibility = {}
        for crop in rotation_plan:
            can_plant = any(
                crop in eq['compatible_crops'] 
                for eq in equipment
            )
            
            if not can_plant:
                feasibility[crop] = {
                    'feasible': False,
                    'reason': 'No compatible equipment',
                    'equipment_needed': self.CROP_REQUIREMENTS[crop]['required_equipment'],
                    'estimated_cost': self.EQUIPMENT_COSTS[
                        self.CROP_REQUIREMENTS[crop]['required_equipment'][0]
                    ]
                }
            else:
                feasibility[crop] = {'feasible': True}
        
        return feasibility
```

---

### Story 3.6: Mobile Field Data Collection
**Points:** 8  
**Assignee:** Mobile Developer  
**Depends on:** Stories 3.1-3.5  
**Gate:** Offline capability required for field use

**Offline-First Mobile Implementation:**
```typescript
// apps/mobile/services/offline-field-service.ts
export class OfflineFieldService {
  private db: SQLite.Database;
  private syncQueue: SyncQueue;
  
  async initializeOfflineData(farmId: string) {
    // Pre-download critical data
    const criticalData = await Promise.all([
      api.getFields(farmId),
      api.getActiveRestrictions(farmId),
      api.getEquipment(farmId),
      api.getWeatherHistory(farmId, 120),  // For herbicide calculations
      api.getSoilTests(farmId)
    ]);
    
    // Store in SQLite for offline access
    await this.db.transaction(async (tx) => {
      // Store fields with boundaries
      for (const field of criticalData[0]) {
        await tx.executeSql(
          'INSERT OR REPLACE INTO fields (id, name, boundary, acres) VALUES (?, ?, ?, ?)',
          [field.id, field.name, JSON.stringify(field.boundary), field.acres]
        );
      }
      
      // Store active restrictions for offline checking
      for (const restriction of criticalData[1]) {
        await tx.executeSql(
          'INSERT OR REPLACE INTO restrictions (field_id, herbicide, precip_needed, days_remaining, value_at_risk) VALUES (?, ?, ?, ?, ?)',
          [restriction.fieldId, restriction.herbicide, restriction.precipNeeded, restriction.daysRemaining, restriction.valueAtRisk]
        );
      }
    });
    
    console.log('✅ Offline data synchronized');
  }
  
  async collectFieldData(fieldId: string, data: FieldObservation) {
    // Validate even when offline
    const validation = await this.validateOffline(fieldId, data);
    
    if (!validation.valid) {
      throw new Error(`Invalid data: ${validation.reason}`);
    }
    
    // Store locally first
    await this.db.executeSql(
      'INSERT INTO observations (field_id, type, data, timestamp, synced) VALUES (?, ?, ?, ?, 0)',
      [fieldId, data.type, JSON.stringify(data), Date.now()]
    );
    
    // Queue for sync when online
    await this.syncQueue.add({
      type: 'field_observation',
      fieldId,
      data,
      priority: data.type === 'pest_pressure' ? 'high' : 'normal'
    });
    
    // Attempt immediate sync if online
    if (await this.isOnline()) {
      await this.syncQueue.process();
    }
    
    return {
      stored: true,
      offline: !await this.isOnline(),
      willSyncWhen: 'online'
    };
  }
}
```

---

## Epic Acceptance Criteria with Data Gates

```typescript
// epic-3-acceptance.test.ts
describe('Epic 3: Field Management Acceptance', () => {
  it('MUST enforce data quality gates', async () => {
    const field = await createTestField();
    const quality = await dataQualityGate.calculate(field.id);
    
    // Cannot enable ML without quality data
    if (quality.score < 0.8) {
      expect(quality.ml_enabled).toBe(false);
    }
  });
  
  it('MUST track herbicide restrictions', async () => {
    const restriction = await rotationService.checkRestrictions(fieldId);
    expect(restriction).toHaveProperty('active');
    expect(restriction).toHaveProperty('precipitationNeeded');
    expect(restriction).toHaveProperty('valueAtRisk');
  });
  
  it('MUST validate equipment constraints', async () => {
    const feasibility = await equipmentService.checkRotation(
      farmId, 
      ['wheat', 'sorghum', 'sunflower']
    );
    
    for (const crop of Object.keys(feasibility)) {
      expect(feasibility[crop]).toHaveProperty('feasible');
    }
  });
  
  it('MUST calculate ML readiness', async () => {
    const readiness = await mlService.checkFieldReadiness(fieldId);
    
    expect(readiness.soil_years).toBeGreaterThanOrEqual(1);
    expect(readiness.yield_years).toBeGreaterThanOrEqual(2);
    expect(readiness.boundary_precision).toBeLessThanOrEqual(5);
    
    if (readiness.score < 0.8) {
      expect(readiness.predictions_enabled).toBe(false);
    }
  });
});
```

---

## Enforcement Mechanisms

### 1. Pre-Story Validation
```javascript
// Runs before EVERY story task
async function validateDataFoundation() {
  const requirements = {
    epic1: await checkNeo4jConnection(),
    epic2: await checkWeatherIntegration(),
    dataExists: await checkMinimumData()
  };
  
  if (!Object.values(requirements).every(r => r)) {
    throw new Error('Cannot proceed: Foundation incomplete');
  }
}
```

### 2. ML Feature Gates
```python
# Decorator that enforces data quality
def requires_data_quality(min_score=0.8):
    def decorator(func):
        async def wrapper(field_id, *args, **kwargs):
            quality = await check_data_quality(field_id)
            if quality['score'] < min_score:
                raise DataQualityError(
                    f"Data quality {quality['score']:.0%} below {min_score:.0%} threshold"
                )
            return await func(field_id, *args, **kwargs)
        return wrapper
    return decorator

@requires_data_quality(0.8)
async def predict_yield(field_id: str, crop: str) -> YieldPrediction:
    # This function CANNOT run without quality data
    pass
```

### 3. Value Tracking
Every data quality issue is tied to lost $/acre value, making the business impact clear and measurable.

---

## Why This Architecture Works

1. **Data Quality Gates** - ML predictions physically cannot run without quality data
2. **Herbicide Tracking** - Core to Phase 1a value proposition ($10-15/acre)
3. **Equipment Constraints** - Ensures recommendations are actually implementable
4. **Offline Capability** - Critical for field data collection where connectivity is poor
5. **Progressive Enhancement** - More data enables better predictions and higher value

This epic establishes the data foundation that enables all future ML capabilities while maintaining strict quality standards.