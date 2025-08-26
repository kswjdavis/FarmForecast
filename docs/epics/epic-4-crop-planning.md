# Epic 4: Crop Planning & Rotation Optimization (REVISED)

**Epic ID:** FARM-EPIC-004  
**Priority:** P0 - Critical Path  
**Duration:** Sprint 5-6 (2 weeks)  
**Dependencies:** Epics 1-3 COMPLETE with Quality Data  
**Value Delivered:** $25-40/acre through optimized rotation decisions

## ⚠️ CRITICAL VALUE DELIVERY REQUIREMENT

**THIS EPIC DELIVERS THE CORE OPTIMIZATION ENGINE - PHASE 1B VALUE PROPOSITION**

---

## User Stories

### 🔴 Story 4.0: Optimization Prerequisites Gate [BLOCKS ALL OPTIMIZATION]
**Points:** 5  
**Assignee:** ML Engineer  
**Type:** OPTIMIZATION GATE  
**Status:** ⛔ MUST PASS FOR VALUE DELIVERY

**Definition of Done:**
```yaml
verification_gates:
  - ml_models: TRAINED ✓
  - data_quality: >85% ✓
  - weather_forecast: AVAILABLE ✓
  - market_prices: CURRENT ✓
  - constraints_defined: COMPLETE ✓
  - validation_baseline: ESTABLISHED ✓
```

**Pre-Epic Validation:**
```python
async def verify_optimization_readiness():
    """Cannot optimize without ALL prerequisites"""
    
    # Check data foundation from Epic 3
    data_quality = await check_field_data_quality()
    if data_quality['average_score'] < 0.85:
        raise ValueError(f"""
        ❌ BLOCKED: Data quality {data_quality['average_score']:.0%} below 85% threshold
        
        MISSING DATA:
        {format_missing_data(data_quality['missing'])}
        
        BUSINESS IMPACT: Cannot deliver $25-40/acre value without quality data
        
        ACTION REQUIRED:
        1. Complete Epic 3 data collection
        2. Import minimum 2 years yield history
        3. Add soil test data (minimum 1 year)
        """)
    
    # Check ML model readiness
    models = await check_ml_models()
    required_models = ['yield_prediction', 'price_forecast', 'weather_impact']
    missing_models = [m for m in required_models if m not in models['trained']]
    
    if missing_models:
        raise ValueError(f"""
        ❌ BLOCKED: ML models not ready
        Missing: {missing_models}
        
        ACTION: Train models with historical data first
        """)
    
    # Verify optimization constraints defined
    constraints = await get_user_constraints()
    if not constraints['herbicide_restrictions'] or not constraints['equipment']:
        raise ValueError("""
        ❌ BLOCKED: Optimization constraints incomplete
        
        REQUIRED:
        - Herbicide application history (for carryover)
        - Equipment inventory (for feasibility)
        - Field boundaries (for spatial optimization)
        """)
    
    # Establish baseline for value measurement
    baseline = await calculate_historical_baseline()
    if not baseline['calculated']:
        await create_performance_baseline()
    
    return True

# Gate check runs before any optimization
await verify_optimization_readiness()
```

---

### Story 4.1: ML Model Training Pipeline
**Points:** 13  
**Assignee:** ML Engineer  
**Depends on:** Story 4.0, Epic 3 data  
**Gate:** Models must beat baseline by 15%

**Model Training with Validation:**
```python
class ModelTrainingPipeline:
    """Trains and validates all optimization models"""
    
    REQUIRED_MODELS = {
        'yield_prediction': {
            'min_mae': 8.0,  # bu/acre for wheat
            'baseline': 'county_average',
            'improvement_required': 0.15  # 15% better than baseline
        },
        'price_forecast': {
            'min_accuracy': 0.85,
            'baseline': 'futures_only',
            'improvement_required': 0.10
        },
        'weather_impact': {
            'min_r2': 0.70,
            'baseline': 'precipitation_only',
            'improvement_required': 0.20
        }
    }
    
    async def train_all_models(self) -> Dict:
        """Train with enforced performance gates"""
        
        results = {}
        all_passed = True
        
        for model_name, requirements in self.REQUIRED_MODELS.items():
            print(f"Training {model_name}...")
            
            # Get training data
            train_data = await self.prepare_training_data(model_name)
            
            if train_data['samples'] < self.MIN_SAMPLES[model_name]:
                results[model_name] = {
                    'trained': False,
                    'reason': f'Insufficient data: {train_data["samples"]} < {self.MIN_SAMPLES[model_name]}',
                    'value_impact': 10  # $/acre lost
                }
                all_passed = False
                continue
            
            # Train model with cross-validation
            model = await self.train_model(model_name, train_data)
            
            # Validate against requirements
            metrics = await self.validate_model(model, train_data['test'])
            
            # Compare to baseline
            baseline_metrics = await self.get_baseline_performance(model_name)
            improvement = (baseline_metrics['error'] - metrics['error']) / baseline_metrics['error']
            
            # ENFORCEMENT: Must beat baseline
            if improvement < requirements['improvement_required']:
                results[model_name] = {
                    'trained': True,
                    'deployed': False,
                    'reason': f'Improvement {improvement:.0%} < {requirements["improvement_required"]:.0%} required',
                    'metrics': metrics,
                    'value_impact': 5
                }
                all_passed = False
            else:
                # Deploy model
                await self.deploy_model(model_name, model)
                results[model_name] = {
                    'trained': True,
                    'deployed': True,
                    'improvement': improvement,
                    'metrics': metrics,
                    'value_enabled': improvement * 40  # $/acre
                }
        
        # Store training results in Neo4j
        await self.store_training_results(results)
        
        if not all_passed:
            raise ModelPerformanceError(
                "Some models failed performance requirements",
                results
            )
        
        return results
    
    async def train_yield_model(self, data: Dict) -> Model:
        """Physics-informed neural network for yield prediction"""
        
        # Stack ensemble with scientific constraints
        models = [
            # Mechanistic model (DSSAT simplified)
            MechanisticYieldModel(
                solar_radiation=data['solar'],
                precipitation=data['precip'],
                soil_moisture=data['moisture']
            ),
            
            # Statistical model (Mixed Effects)
            MixedEffectsModel(
                fixed_effects=['variety', 'planting_date', 'nitrogen'],
                random_effects=['field', 'year'],
                data=data
            ),
            
            # ML model (XGBoost)
            XGBoostRegressor(
                n_estimators=500,
                max_depth=6,
                learning_rate=0.01,
                colsample_bytree=0.8
            ),
            
            # Deep learning (LSTM for temporal)
            LSTMModel(
                sequence_length=120,  # Days of weather
                features=data['temporal_features'],
                hidden_size=128
            )
        ]
        
        # Super Learner ensemble
        ensemble = SuperLearner(
            models=models,
            metalearner=LinearRegression(),
            cv_folds=5
        )
        
        # Add physical constraints
        ensemble = PhysicsConstrainedWrapper(
            ensemble,
            constraints=[
                'yield >= 0',
                'yield <= variety_max_yield',
                'water_use_efficiency <= 15 kg/ha/mm'  # Agronomic limit
            ]
        )
        
        ensemble.fit(data['train'])
        
        return ensemble
```

---

### Story 4.2: Rotation Optimization Engine
**Points:** 21  
**Assignee:** Algorithm Engineer  
**Depends on:** Story 4.1  
**Gate:** Must respect ALL constraints

**Multi-Year Stochastic Optimization:**
```python
class RotationOptimizer:
    """Core optimization engine with constraint enforcement"""
    
    async def optimize_rotation(
        self,
        farm_id: str,
        planning_horizon: int = 3,
        objectives: List[str] = ['profit', 'risk', 'sustainability']
    ) -> OptimizationResult:
        """
        Two-stage stochastic optimization with robust constraints
        """
        
        # Load all constraints
        constraints = await self.load_constraints(farm_id)
        
        # ENFORCEMENT: Cannot optimize without constraints
        if not self.validate_constraints(constraints):
            raise ValueError("""
                ❌ Cannot optimize: Missing critical constraints
                Required: herbicide_history, equipment, field_boundaries
            """)
        
        # Generate weather scenarios (25 analog years)
        scenarios = await self.generate_weather_scenarios(farm_id)
        
        # Build optimization model
        model = self.build_stochastic_model(
            farm_id,
            planning_horizon,
            scenarios,
            constraints
        )
        
        # Solve with enforced constraints
        solution = await self.solve_with_validation(model)
        
        # Validate solution feasibility
        validation = await self.validate_solution(solution, constraints)
        
        if not validation['feasible']:
            raise OptimizationError(f"""
                Solution violates constraints:
                {format_violations(validation['violations'])}
                
                This should not happen - check constraint formulation
            """)
        
        # Calculate value vs baseline
        baseline = await self.get_baseline_rotation(farm_id)
        improvement = self.calculate_improvement(solution, baseline)
        
        return {
            'rotation': solution['rotation_plan'],
            'expected_profit': solution['objective_value'],
            'confidence_interval': solution['confidence_interval'],
            'improvement_vs_baseline': improvement,
            'value_per_acre': improvement['profit_gain'] / constraints['total_acres'],
            'constraints_satisfied': validation['satisfied_constraints'],
            'risk_metrics': solution['risk_metrics']
        }
    
    def build_stochastic_model(
        self,
        farm_id: str,
        horizon: int,
        scenarios: List[Dict],
        constraints: Dict
    ) -> ConcreteModel:
        """Pyomo stochastic optimization model"""
        
        model = ConcreteModel()
        
        # Sets
        model.FIELDS = Set(initialize=constraints['fields'])
        model.CROPS = Set(initialize=constraints['available_crops'])
        model.YEARS = RangeSet(1, horizon)
        model.SCENARIOS = RangeSet(1, len(scenarios))
        
        # Decision variables
        model.plant = Var(
            model.FIELDS, model.CROPS, model.YEARS,
            domain=Binary,
            doc="1 if crop planted in field in year"
        )
        
        model.fallow = Var(
            model.FIELDS, model.YEARS,
            domain=Binary,
            doc="1 if field is fallow"
        )
        
        # Stage 2 variables (scenario dependent)
        model.yield_realized = Var(
            model.FIELDS, model.CROPS, model.YEARS, model.SCENARIOS,
            domain=NonNegativeReals
        )
        
        model.revenue = Var(
            model.SCENARIOS,
            domain=Reals
        )
        
        # CONSTRAINT: Herbicide carryover
        def herbicide_rule(model, f, c, y):
            if y == 1:
                return Constraint.Skip
            
            # Check previous year herbicides
            prev_crops = [
                model.plant[f, prev_c, y-1] 
                for prev_c in model.CROPS
            ]
            
            # Get restriction matrix
            restrictions = constraints['herbicide_restrictions']
            
            for prev_c in model.CROPS:
                if restrictions.get((prev_c, c), {}).get('restricted', False):
                    precip_required = restrictions[(prev_c, c)]['precipitation']
                    precip_expected = scenarios[0]['precipitation_accumulation']
                    
                    if precip_expected < precip_required:
                        # Cannot plant this crop after that herbicide
                        return model.plant[f, c, y] == 0
            
            return Constraint.Skip
        
        model.herbicide_constraint = Constraint(
            model.FIELDS, model.CROPS, model.YEARS,
            rule=herbicide_rule
        )
        
        # CONSTRAINT: Equipment availability
        def equipment_rule(model, c):
            equipment_needed = constraints['crop_equipment'][c]
            equipment_available = constraints['available_equipment']
            
            if not any(e in equipment_available for e in equipment_needed):
                # Cannot plant crop without equipment
                return sum(
                    model.plant[f, c, y]
                    for f in model.FIELDS
                    for y in model.YEARS
                ) == 0
            
            return Constraint.Skip
        
        model.equipment_constraint = Constraint(
            model.CROPS,
            rule=equipment_rule
        )
        
        # CONSTRAINT: Only one crop per field per year
        def one_crop_rule(model, f, y):
            return sum(model.plant[f, c, y] for c in model.CROPS) + model.fallow[f, y] == 1
        
        model.one_crop_constraint = Constraint(
            model.FIELDS, model.YEARS,
            rule=one_crop_rule
        )
        
        # CONSTRAINT: Rotation diversity (agronomic)
        def rotation_diversity_rule(model, f, c):
            # No more than 2 consecutive years of same crop
            for y in range(1, horizon - 1):
                consecutive = (
                    model.plant[f, c, y] + 
                    model.plant[f, c, y+1] + 
                    model.plant[f, c, y+2]
                )
                if consecutive >= 3:
                    return Constraint.Skip
            return Constraint.Skip
        
        model.rotation_diversity = Constraint(
            model.FIELDS, model.CROPS,
            rule=rotation_diversity_rule
        )
        
        # Objective: Expected profit with risk penalty
        def objective_rule(model):
            expected_revenue = sum(
                (1.0 / len(scenarios)) * model.revenue[s]
                for s in model.SCENARIOS
            )
            
            # CVaR risk measure
            cvar = self.calculate_cvar(model, alpha=0.95)
            
            # Multi-objective with weights
            return (
                constraints['objectives']['profit_weight'] * expected_revenue -
                constraints['objectives']['risk_weight'] * cvar
            )
        
        model.objective = Objective(rule=objective_rule, sense=maximize)
        
        return model
```

---

### Story 4.3: Insurance Portfolio Optimizer
**Points:** 13  
**Assignee:** Financial Engineer  
**Depends on:** Story 4.2  
**Gate:** Must improve coverage efficiency by 20%

**Insurance Optimization with Premium Constraints:**
```python
class InsuranceOptimizer:
    """Optimizes insurance portfolio for rotation plan"""
    
    async def optimize_insurance(
        self,
        farm_id: str,
        rotation_plan: Dict,
        budget_constraint: float
    ) -> InsurancePortfolio:
        """
        Mixed-integer programming for insurance optimization
        """
        
        # Get available insurance products
        products = await self.get_insurance_products()
        
        # Calculate risk exposure from rotation
        risk_profile = await self.calculate_risk_profile(
            rotation_plan,
            include_weather=True,
            include_price=True,
            include_hail=True  # 18% probability in Hamilton County
        )
        
        # Build optimization model
        model = ConcreteModel()
        
        # Decision variables
        model.buy_rp = Var(
            products['RP']['levels'],
            domain=Binary,
            doc="RP coverage level selection"
        )
        
        model.buy_eco = Var(
            products['ECO']['bands'],
            domain=Binary,
            doc="ECO coverage selection"
        )
        
        model.buy_sco = Var(
            domain=Binary,
            doc="SCO coverage selection"
        )
        
        model.buy_hail = Var(
            products['hail']['amounts'],
            domain=Binary,
            doc="Hail coverage amount"
        )
        
        # CONSTRAINT: Budget
        def budget_rule(model):
            total_premium = (
                sum(products['RP']['premiums'][l] * model.buy_rp[l] 
                    for l in products['RP']['levels']) +
                sum(products['ECO']['premiums'][b] * model.buy_eco[b]
                    for b in products['ECO']['bands']) +
                products['SCO']['premium'] * model.buy_sco +
                sum(products['hail']['premiums'][a] * model.buy_hail[a]
                    for a in products['hail']['amounts'])
            )
            return total_premium <= budget_constraint
        
        model.budget_constraint = Constraint(rule=budget_rule)
        
        # CONSTRAINT: Coverage compatibility
        def compatibility_rule(model):
            # ECO requires RP
            eco_selected = sum(model.buy_eco[b] for b in products['ECO']['bands'])
            rp_selected = sum(model.buy_rp[l] for l in products['RP']['levels'])
            return eco_selected <= rp_selected
        
        model.compatibility_constraint = Constraint(rule=compatibility_rule)
        
        # CONSTRAINT: Only one level per product
        model.one_rp = Constraint(
            expr=sum(model.buy_rp[l] for l in products['RP']['levels']) <= 1
        )
        
        # Objective: Minimize uncovered risk
        def objective_rule(model):
            covered_risk = self.calculate_coverage(
                model,
                risk_profile,
                products
            )
            
            uncovered = risk_profile['total_risk'] - covered_risk
            
            # Penalty for gaps in coverage
            coverage_gaps = self.identify_coverage_gaps(model, risk_profile)
            
            return uncovered + 1000 * coverage_gaps
        
        model.objective = Objective(rule=objective_rule, sense=minimize)
        
        # Solve
        solver = SolverFactory('gurobi')
        results = solver.solve(model, tee=False)
        
        if results.solver.termination_condition != TerminationCondition.optimal:
            raise OptimizationError("Insurance optimization failed")
        
        # Extract solution
        portfolio = self.extract_portfolio(model, products)
        
        # Validate improvement
        baseline_efficiency = await self.get_baseline_efficiency(farm_id)
        improvement = (portfolio['efficiency'] - baseline_efficiency) / baseline_efficiency
        
        if improvement < 0.20:
            logger.warning(f"Insurance improvement {improvement:.0%} < 20% target")
        
        portfolio['improvement'] = improvement
        portfolio['value_protected_per_dollar'] = portfolio['coverage'] / portfolio['premium']
        
        return portfolio
```

---

### Story 4.4: Scenario Analysis Engine
**Points:** 8  
**Assignee:** Full Stack Developer  
**Depends on:** Stories 4.2, 4.3  
**Gate:** Must generate 25+ weather scenarios

**Interactive What-If Analysis:**
```typescript
// apps/web/components/scenario-explorer.tsx
export function ScenarioExplorer({ farmId }: Props) {
  const [baseRotation, setBaseRotation] = useState<Rotation>();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [results, setResults] = useState<ScenarioResults>();
  
  const generateScenarios = async () => {
    // ENFORCEMENT: Minimum scenarios for statistical validity
    const MIN_SCENARIOS = 25;
    
    const weatherScenarios = await api.generateWeatherScenarios({
      farmId,
      count: Math.max(MIN_SCENARIOS, 25),
      method: 'analog_years',
      source: 'weather_2020'
    });
    
    // Add price scenarios
    const priceScenarios = await api.generatePriceScenarios({
      crops: baseRotation.crops,
      method: 'monte_carlo',
      correlation_matrix: true
    });
    
    // Combine scenarios
    const combined = weatherScenarios.map((weather, i) => ({
      id: `scenario_${i}`,
      weather,
      prices: priceScenarios[i % priceScenarios.length],
      probability: 1.0 / weatherScenarios.length
    }));
    
    setScenarios(combined);
    
    // Run optimization for each scenario
    const results = await api.evaluateScenarios({
      farmId,
      rotation: baseRotation,
      scenarios: combined
    });
    
    setResults(results);
  };
  
  const modifyScenario = (scenarioId: string, changes: Partial<Scenario>) => {
    // Allow user to modify scenarios
    const updated = scenarios.map(s => 
      s.id === scenarioId ? { ...s, ...changes } : s
    );
    setScenarios(updated);
    
    // Re-evaluate with modified scenario
    evaluateModified(updated);
  };
  
  return (
    <div className="scenario-explorer">
      {/* Scenario Controls */}
      <div className="controls">
        <h3>What-If Analysis</h3>
        
        <div className="scenario-adjustments">
          <label>Rainfall Adjustment</label>
          <Slider
            min={-50}
            max={50}
            value={0}
            onChange={(pct) => adjustAllScenarios('rainfall', pct)}
          />
          
          <label>Price Volatility</label>
          <Slider
            min={0}
            max={200}
            value={100}
            onChange={(pct) => adjustAllScenarios('price_volatility', pct)}
          />
          
          <label>Hail Probability (baseline: 18%)</label>
          <Slider
            min={0}
            max={50}
            value={18}
            onChange={(pct) => adjustAllScenarios('hail_probability', pct)}
          />
        </div>
      </div>
      
      {/* Results Visualization */}
      <div className="results">
        {results && (
          <>
            <div className="summary-stats">
              <Card>
                <h4>Expected Outcome</h4>
                <Value>${results.expected_profit.toLocaleString()}</Value>
                <Subtitle>${results.profit_per_acre}/acre</Subtitle>
              </Card>
              
              <Card>
                <h4>Downside Risk (5% CVaR)</h4>
                <Value className="risk">
                  ${results.cvar_5pct.toLocaleString()}
                </Value>
                <Subtitle>Worst-case scenarios</Subtitle>
              </Card>
              
              <Card>
                <h4>Upside Potential (95th percentile)</h4>
                <Value className="upside">
                  ${results.p95.toLocaleString()}
                </Value>
                <Subtitle>Best-case scenarios</Subtitle>
              </Card>
            </div>
            
            {/* Distribution Chart */}
            <ScenarioDistribution
              scenarios={scenarios}
              results={results}
              highlightOutliers={true}
            />
            
            {/* Sensitivity Analysis */}
            <SensitivityTornado
              factors={results.sensitivity_factors}
              impact={results.profit_impact}
            />
          </>
        )}
      </div>
      
      {/* Constraint Warnings */}
      {results?.constraint_violations && (
        <Alert severity="warning">
          <AlertTitle>Constraints at Risk</AlertTitle>
          {results.constraint_violations.map(v => (
            <div key={v.constraint}>
              {v.constraint}: {v.scenarios_affected} scenarios ({v.percentage}%)
            </div>
          ))}
        </Alert>
      )}
    </div>
  );
}
```

---

### Story 4.5: Decision Export & Documentation
**Points:** 5  
**Assignee:** Backend Developer  
**Depends on:** Stories 4.2-4.4  
**Gate:** Must generate audit trail

**Decision Documentation System:**
```python
class DecisionDocumentor:
    """Creates audit trail and explanations for all decisions"""
    
    async def document_optimization_decision(
        self,
        farm_id: str,
        optimization_result: Dict,
        user_id: str
    ) -> DecisionRecord:
        """
        Create immutable record for future analysis
        """
        
        # Generate comprehensive documentation
        documentation = {
            'timestamp': datetime.utcnow(),
            'farm_id': farm_id,
            'user_id': user_id,
            'decision_type': 'rotation_optimization',
            
            # Inputs
            'inputs': {
                'constraints': await self.get_active_constraints(farm_id),
                'objectives': optimization_result['objectives'],
                'planning_horizon': optimization_result['horizon'],
                'data_quality_score': await self.get_data_quality(farm_id)
            },
            
            # Outputs
            'outputs': {
                'rotation_plan': optimization_result['rotation'],
                'expected_profit': optimization_result['expected_profit'],
                'confidence_interval': optimization_result['confidence_interval'],
                'value_per_acre': optimization_result['value_per_acre']
            },
            
            # Explanations
            'explanations': {
                'key_drivers': await self.explain_key_drivers(optimization_result),
                'constraint_impacts': await self.explain_constraints(optimization_result),
                'risk_factors': await self.explain_risks(optimization_result),
                'vs_baseline': await self.compare_to_baseline(farm_id, optimization_result)
            },
            
            # Assumptions
            'assumptions': {
                'weather_scenarios': optimization_result['scenarios_used'],
                'price_forecasts': optimization_result['price_assumptions'],
                'yield_models': optimization_result['model_versions']
            },
            
            # Traceability
            'traceability': {
                'model_versions': await self.get_model_versions(),
                'data_sources': await self.get_data_sources(farm_id),
                'git_commit': os.environ.get('GIT_COMMIT', 'development')
            }
        }
        
        # Store immutably in Neo4j
        result = await neo4j.run("""
            CREATE (d:Decision {
                id: $decision_id,
                timestamp: datetime($timestamp),
                type: $type,
                immutable: true
            })
            SET d += $documentation
            
            WITH d
            MATCH (f:Farm {id: $farm_id})
            CREATE (f)-[:MADE_DECISION]->(d)
            
            // Link to rotation plan
            CREATE (rp:RotationPlan {
                id: $plan_id,
                crops: $crops,
                years: $years
            })
            CREATE (d)-[:RESULTED_IN]->(rp)
            
            // Create event for event sourcing
            CREATE (e:Event {
                id: $event_id,
                type: 'optimization_decision',
                timestamp: datetime($timestamp),
                aggregate_id: $farm_id,
                data: $documentation
            })
            
            RETURN d.id as decision_id
        """, {
            'decision_id': str(uuid.uuid4()),
            'plan_id': str(uuid.uuid4()),
            'event_id': str(uuid.uuid4()),
            'farm_id': farm_id,
            'timestamp': documentation['timestamp'].isoformat(),
            'type': documentation['decision_type'],
            'documentation': json.dumps(documentation),
            'crops': optimization_result['rotation'],
            'years': optimization_result['horizon']
        })
        
        # Generate PDF report
        pdf_path = await self.generate_pdf_report(documentation)
        
        # Send to user
        await self.email_decision_record(user_id, documentation, pdf_path)
        
        return {
            'decision_id': result['decision_id'],
            'documented': True,
            'pdf_path': pdf_path,
            'can_replay': True,  # For counterfactual analysis
            'immutable': True
        }
    
    async def explain_key_drivers(self, result: Dict) -> List[Dict]:
        """SHAP-based explanation of decision drivers"""
        
        explanations = []
        
        # Get SHAP values from model
        shap_values = await self.get_shap_explanations(result['model_id'])
        
        # Top 5 drivers
        top_drivers = sorted(
            shap_values.items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:5]
        
        for feature, impact in top_drivers:
            explanations.append({
                'factor': feature,
                'impact': f"${abs(impact):.2f}/acre",
                'direction': 'positive' if impact > 0 else 'negative',
                'explanation': self.FEATURE_EXPLANATIONS.get(
                    feature,
                    f"{feature} significantly affects profitability"
                )
            })
        
        return explanations
```

---

## Epic Acceptance Criteria with Optimization Gates

```typescript
// epic-4-acceptance.test.ts
describe('Epic 4: Crop Planning Acceptance', () => {
  it('MUST have trained ML models beating baseline', async () => {
    const models = await mlService.getModelPerformance();
    
    for (const model of ['yield', 'price', 'weather']) {
      const performance = models[model];
      expect(performance.improvement_vs_baseline).toBeGreaterThan(0.15);
    }
  });
  
  it('MUST respect ALL constraints in optimization', async () => {
    const result = await optimizer.optimize(testFarm);
    const validation = await validator.checkConstraints(result);
    
    expect(validation.herbicide_restrictions).toBe('satisfied');
    expect(validation.equipment_constraints).toBe('satisfied');
    expect(validation.rotation_diversity).toBe('satisfied');
  });
  
  it('MUST generate minimum 25 scenarios', async () => {
    const scenarios = await scenarioEngine.generate(testFarm);
    expect(scenarios.length).toBeGreaterThanOrEqual(25);
    expect(scenarios[0]).toHaveProperty('weather');
    expect(scenarios[0]).toHaveProperty('prices');
  });
  
  it('MUST deliver $25-40/acre value', async () => {
    const optimization = await optimizer.optimize(testFarm);
    const baseline = await getBaselinePerformance(testFarm);
    const improvement = optimization.profit - baseline.profit;
    const perAcre = improvement / testFarm.acres;
    
    expect(perAcre).toBeGreaterThanOrEqual(25);
    expect(perAcre).toBeLessThanOrEqual(40);
  });
  
  it('MUST create immutable decision records', async () => {
    const decision = await optimizer.optimize(testFarm);
    const record = await documentor.document(decision);
    
    expect(record.immutable).toBe(true);
    expect(record.can_replay).toBe(true);
    expect(record.pdf_path).toBeTruthy();
  });
});
```

---

## Enforcement Mechanisms

### 1. Model Performance Gates
```python
@enforce_model_quality(min_improvement=0.15)
async def deploy_model(model_name: str, model: Model):
    # Cannot deploy without beating baseline
    pass
```

### 2. Constraint Validation
```python
def validate_optimization_solution(solution: Dict, constraints: Dict):
    violations = []
    
    # Check every constraint
    for constraint_type in ['herbicide', 'equipment', 'rotation']:
        if not check_constraint(solution, constraints[constraint_type]):
            violations.append(constraint_type)
    
    if violations:
        raise ConstraintViolationError(
            f"Solution violates: {violations}"
        )
```

### 3. Scenario Requirements
```javascript
if (scenarios.length < 25) {
  throw new Error('Statistical validity requires 25+ scenarios');
}
```

---

## Why This Architecture Works

1. **ML Performance Gates** - Models must prove value before deployment
2. **Constraint Enforcement** - Optimization respects real-world limitations
3. **Scenario Robustness** - Decisions tested against uncertainty
4. **Decision Traceability** - Full audit trail for learning
5. **Value Measurement** - Clear $/acre metrics for ROI

This epic delivers the core value proposition with rigorous validation and enforcement.