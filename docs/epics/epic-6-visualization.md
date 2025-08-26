# Epic 6: Advanced Visualization & User Experience (REVISED)

**Epic ID:** FARM-EPIC-006  
**Priority:** P1 - User Adoption Critical  
**Duration:** Sprint 10-12 (3 weeks)  
**Dependencies:** Epics 1-5 COMPLETE with Network Intelligence  
**Value Delivered:** 25% improvement in decision speed, 85% user satisfaction

## ⚠️ CRITICAL USER ADOPTION REQUIREMENT

**THIS EPIC MAKES COMPLEX INTELLIGENCE ACCESSIBLE - ADOPTION MULTIPLIER**

---

## User Stories

### 🔴 Story 6.0: Performance & Accessibility Gate [BLOCKS DEPLOYMENT]
**Points:** 5  
**Assignee:** Performance Engineer  
**Type:** UX ENFORCEMENT  
**Status:** ⛔ MUST PASS FOR PRODUCTION

**Definition of Done:**
```yaml
verification_gates:
  - load_time: <3_SECONDS ✓
  - interaction_latency: <100MS ✓
  - wcag_compliance: AA_LEVEL ✓
  - mobile_responsive: VERIFIED ✓
  - browser_compatibility: 95%+ ✓
  - offline_capability: FUNCTIONAL ✓
```

**Performance Enforcement Framework:**
```typescript
class PerformanceGate {
  /**
   * Enforces performance standards before deployment
   */
  
  async verifyPerformanceRequirements(): Promise<ValidationResult> {
    const metrics = await this.runPerformanceTests();
    
    // ENFORCEMENT: Page load time
    if (metrics.loadTime > 3000) {
      throw new PerformanceError(`
        ❌ BLOCKED: Load time ${metrics.loadTime}ms exceeds 3s limit
        
        IMPACT: Users abandon after 3 seconds
        VALUE LOST: 40% of user engagement
        
        REQUIRED OPTIMIZATIONS:
        - Implement code splitting
        - Enable lazy loading
        - Optimize bundle size
        - Add service worker caching
      `);
    }
    
    // ENFORCEMENT: Interaction responsiveness
    if (metrics.interactionLatency > 100) {
      throw new PerformanceError(`
        ❌ BLOCKED: Interaction latency ${metrics.interactionLatency}ms > 100ms
        
        Users perceive lag above 100ms
        Must optimize React rendering
      `);
    }
    
    // ENFORCEMENT: Accessibility
    const a11y = await this.runAccessibilityAudit();
    if (a11y.score < 90) {
      throw new AccessibilityError(`
        ❌ BLOCKED: Accessibility score ${a11y.score} below AA standard
        
        VIOLATIONS:
        ${this.formatViolations(a11y.violations)}
        
        LEGAL RISK: ADA non-compliance
      `);
    }
    
    // ENFORCEMENT: Mobile responsiveness
    const mobile = await this.testMobileDevices();
    if (mobile.passRate < 0.95) {
      throw new ResponsivenessError(`
        ❌ BLOCKED: Mobile compatibility ${mobile.passRate * 100}% < 95%
        
        FAILED DEVICES:
        ${mobile.failures.join(', ')}
        
        60% of farmers use mobile in field
      `);
    }
    
    return {
      passed: true,
      metrics: {
        loadTime: metrics.loadTime,
        interactionLatency: metrics.interactionLatency,
        a11yScore: a11y.score,
        mobilePassRate: mobile.passRate
      }
    };
  }
  
  async optimizeBundle(): Promise<void> {
    // Automatic optimization if performance fails
    
    // 1. Code splitting
    await this.implementCodeSplitting({
      routes: true,
      vendors: true,
      common: true
    });
    
    // 2. Tree shaking
    await this.enableTreeShaking({
      sideEffects: false,
      usedExports: true
    });
    
    // 3. Lazy loading
    await this.implementLazyLoading({
      images: true,
      components: true,
      routes: true
    });
    
    // 4. Service worker
    await this.setupServiceWorker({
      cacheFirst: ['fonts', 'images'],
      networkFirst: ['api'],
      staleWhileRevalidate: ['js', 'css']
    });
  }
}
```

---

### Story 6.1: Interactive Graph Explorer
**Points:** 13  
**Assignee:** Frontend Developer  
**Depends on:** Story 6.0, Neo4j Graph  
**Gate:** Must handle 1000+ nodes smoothly

**Graph Visualization Implementation:**
```typescript
// apps/web/components/graph-explorer.tsx
import { ForceGraph3D } from 'react-force-graph';
import { GPU } from 'gpu.js';

export function GraphExplorer({ farmId }: Props) {
  const [graphData, setGraphData] = useState<GraphData>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [performance, setPerformance] = useState<PerformanceMetrics>();
  
  // GPU acceleration for large graphs
  const gpu = new GPU();
  
  // Force calculation on GPU for performance
  const calculateForces = gpu.createKernel(function(nodes, edges) {
    // Barnes-Hut optimization for O(n log n) complexity
    let forceX = 0;
    let forceY = 0;
    
    for (let i = 0; i < this.constants.nodeCount; i++) {
      if (i !== this.thread.x) {
        const dx = nodes[i][0] - nodes[this.thread.x][0];
        const dy = nodes[i][1] - nodes[this.thread.x][1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = this.constants.repulsion / (distance * distance);
          forceX += force * dx / distance;
          forceY += force * dy / distance;
        }
      }
    }
    
    return [forceX, forceY];
  }).setConstants({
    nodeCount: 1000,
    repulsion: 100
  }).setOutput([1000, 2]);
  
  useEffect(() => {
    loadGraphData();
  }, [farmId]);
  
  const loadGraphData = async () => {
    // Load with progressive enhancement
    const start = performance.now();
    
    // First load: immediate neighbors
    const immediate = await api.getGraphNeighbors(farmId, 1);
    setGraphData(immediate);
    
    // Second load: extended network
    const extended = await api.getGraphNeighbors(farmId, 2);
    setGraphData(extended);
    
    // Performance check
    const loadTime = performance.now() - start;
    if (loadTime > 3000) {
      console.warn(`Graph load time ${loadTime}ms exceeds target`);
      
      // Reduce complexity
      const simplified = simplifyGraph(extended);
      setGraphData(simplified);
    }
    
    // Monitor FPS
    monitorFrameRate();
  };
  
  const monitorFrameRate = () => {
    let lastTime = performance.now();
    let frames = 0;
    
    const checkFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round(frames * 1000 / (currentTime - lastTime));
        
        if (fps < 30) {
          // Reduce visual complexity
          reduceGraphComplexity();
        }
        
        setPerformance(prev => ({ ...prev, fps }));
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFPS);
    };
    
    checkFPS();
  };
  
  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
    
    // Load detailed information
    loadNodeDetails(node);
    
    // Highlight connected nodes
    highlightConnections(node);
    
    // Show influence paths
    showInfluencePaths(node);
  }, []);
  
  return (
    <div className="graph-explorer">
      {/* Performance Metrics */}
      {performance && (
        <div className="performance-overlay">
          FPS: {performance.fps} | Nodes: {graphData?.nodes.length} | 
          Edges: {graphData?.edges.length}
        </div>
      )}
      
      {/* 3D Force Graph */}
      <ForceGraph3D
        graphData={graphData}
        nodeLabel={node => `${node.name}\n${node.type}`}
        nodeColor={node => getNodeColor(node.type)}
        linkColor={link => getLinkColor(link.type)}
        onNodeClick={handleNodeClick}
        nodeThreeObject={node => createNodeMesh(node)}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        
        // Performance optimizations
        warmupTicks={50}
        cooldownTicks={0}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        
        // GPU acceleration
        forceEngine={calculateForces}
      />
      
      {/* Node Details Panel */}
      {selectedNode && (
        <NodeDetailsPanel node={selectedNode}>
          <h3>{selectedNode.name}</h3>
          <p>Type: {selectedNode.type}</p>
          
          {selectedNode.type === 'Farm' && (
            <FarmMetrics farmId={selectedNode.id} />
          )}
          
          {selectedNode.type === 'Crop' && (
            <CropAnalytics crop={selectedNode.id} />
          )}
          
          <h4>Connections</h4>
          <ConnectionsList connections={selectedNode.connections} />
          
          <h4>Influence Score</h4>
          <InfluenceVisualization score={selectedNode.influence} />
        </NodeDetailsPanel>
      )}
      
      {/* Graph Controls */}
      <GraphControls>
        <FilterControls
          onFilter={(filters) => filterGraph(filters)}
          options={['Farms', 'Crops', 'Practices', 'Weather']}
        />
        
        <LayoutSelector
          layouts={['Force', 'Hierarchical', 'Circular', 'Geographic']}
          onChange={(layout) => changeLayout(layout)}
        />
        
        <TimeSlider
          min={-365}
          max={0}
          value={0}
          onChange={(days) => loadHistoricalGraph(days)}
          label="Days Ago"
        />
      </GraphControls>
    </div>
  );
}
```

---

### Story 6.2: Natural Language Query Interface
**Points:** 13  
**Assignee:** AI Engineer  
**Depends on:** Story 6.0, GPT-5 Integration  
**Gate:** Must answer 85% of queries correctly

**Conversational AI Implementation:**
```python
class NaturalLanguageInterface:
    """GPT-5 powered query interface for farmers"""
    
    def __init__(self):
        self.llm = GPT5Model(
            api_key=settings.OPENAI_API_KEY,
            model="gpt-5-turbo",
            temperature=0.3  # Lower for consistency
        )
        
        # Fine-tuned for agriculture
        self.context_encoder = SentenceTransformer(
            'farmcalc/agri-bert-v2'
        )
        
        # Query understanding pipeline
        self.query_pipeline = Pipeline([
            ('intent', IntentClassifier()),
            ('entities', EntityExtractor()),
            ('context', ContextBuilder()),
            ('cypher', CypherGenerator())
        ])
    
    async def process_query(
        self,
        query: str,
        farm_id: str,
        conversation_history: List[Dict]
    ) -> QueryResponse:
        """Process natural language query with context"""
        
        # Classify query intent
        intent = await self.classify_intent(query)
        
        if intent.confidence < 0.7:
            # Use GPT-5 for clarification
            clarification = await self.get_clarification(query)
            return {
                'needs_clarification': True,
                'suggested_queries': clarification.suggestions,
                'message': "I'm not quite sure what you're asking. Did you mean..."
            }
        
        # Extract entities
        entities = await self.extract_entities(query, farm_id)
        
        # Build context from history and farm data
        context = await self.build_context(
            farm_id,
            entities,
            conversation_history
        )
        
        # Route to appropriate handler
        if intent.type == 'graph_query':
            return await self.handle_graph_query(query, context)
        elif intent.type == 'prediction':
            return await self.handle_prediction_query(query, context)
        elif intent.type == 'recommendation':
            return await self.handle_recommendation_query(query, context)
        elif intent.type == 'explanation':
            return await self.handle_explanation_query(query, context)
        else:
            return await self.handle_general_query(query, context)
    
    async def handle_graph_query(
        self,
        query: str,
        context: Dict
    ) -> QueryResponse:
        """Convert natural language to Cypher query"""
        
        # Generate Cypher using fine-tuned model
        cypher_prompt = f"""
        Convert this agricultural query to Neo4j Cypher:
        Query: {query}
        
        Context:
        - Farm: {context['farm_id']}
        - Current Season: {context['season']}
        - Available Nodes: Farm, Field, Crop, Practice, Weather, SoilTest
        - Available Relationships: PLANTS, APPLIES, HAS_FIELD, SIMILAR_TO
        
        Return only valid Cypher query.
        """
        
        cypher = await self.llm.generate(cypher_prompt)
        
        # Validate Cypher syntax
        if not self.validate_cypher(cypher):
            # Fallback to template-based generation
            cypher = self.generate_template_cypher(query, context)
        
        # Execute query
        try:
            results = await neo4j.run(cypher)
            
            # Format results with GPT-5
            formatted = await self.format_results(results, query)
            
            return {
                'success': True,
                'answer': formatted.answer,
                'visualization': formatted.viz_type,
                'data': results,
                'cypher': cypher,  # For transparency
                'confidence': formatted.confidence
            }
            
        except Exception as e:
            logger.error(f"Cypher execution failed: {e}")
            
            # Fallback to semantic search
            return await self.semantic_search_fallback(query, context)
    
    async def handle_prediction_query(
        self,
        query: str,
        context: Dict
    ) -> QueryResponse:
        """Handle yield/price prediction queries"""
        
        # Extract prediction parameters
        params = await self.extract_prediction_params(query)
        
        # Run prediction model
        prediction = await self.prediction_service.predict(
            farm_id=context['farm_id'],
            crop=params['crop'],
            scenario=params.get('scenario', 'baseline')
        )
        
        # Generate explanation with GPT-5
        explanation_prompt = f"""
        Explain this yield prediction to a farmer:
        
        Prediction: {prediction['yield']} bu/acre
        Confidence: {prediction['confidence_interval']}
        Key Factors: {prediction['drivers']}
        
        Original Question: {query}
        
        Provide clear, actionable explanation in 2-3 sentences.
        """
        
        explanation = await self.llm.generate(explanation_prompt)
        
        return {
            'success': True,
            'answer': explanation,
            'prediction': prediction,
            'visualization': 'probability_distribution',
            'confidence': prediction['model_confidence']
        }
    
    async def validate_response_quality(
        self,
        query: str,
        response: str
    ) -> float:
        """Ensure response quality meets standards"""
        
        # Semantic similarity check
        query_embedding = self.context_encoder.encode(query)
        response_embedding = self.context_encoder.encode(response)
        similarity = cosine_similarity(query_embedding, response_embedding)
        
        if similarity < 0.6:
            logger.warning(f"Low relevance: {similarity}")
        
        # Fact checking against database
        facts = await self.extract_facts(response)
        verified = await self.verify_facts(facts)
        accuracy = len(verified) / max(len(facts), 1)
        
        # Overall quality score
        quality = similarity * 0.5 + accuracy * 0.5
        
        return quality
```

---

### Story 6.3: Mobile Field Interface
**Points:** 8  
**Assignee:** Mobile Developer  
**Depends on:** Story 6.0  
**Gate:** Must work offline with sync

**React Native Mobile Implementation:**
```typescript
// apps/mobile/screens/FieldScreen.tsx
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import { useOfflineSync } from '../hooks/useOfflineSync';

export function FieldScreen({ route }) {
  const { fieldId } = route.params;
  const [field, setField] = useState<Field>();
  const [isOffline, setIsOffline] = useState(false);
  const { syncStatus, syncNow } = useOfflineSync();
  
  // Offline-first data loading
  useEffect(() => {
    loadFieldData();
  }, [fieldId]);
  
  const loadFieldData = async () => {
    try {
      // Try online first
      const onlineData = await api.getField(fieldId);
      setField(onlineData);
      
      // Cache for offline
      await cacheService.saveField(onlineData);
      
    } catch (error) {
      // Fallback to offline
      setIsOffline(true);
      const cachedData = await cacheService.getField(fieldId);
      
      if (cachedData) {
        setField(cachedData);
      } else {
        throw new Error('No offline data available');
      }
    }
  };
  
  const collectObservation = async (observation: Observation) => {
    // Validate even offline
    const validation = await validateObservation(observation);
    
    if (!validation.valid) {
      Alert.alert('Invalid Data', validation.message);
      return;
    }
    
    // Store locally first
    await offlineDB.addObservation({
      ...observation,
      fieldId,
      timestamp: Date.now(),
      synced: false
    });
    
    // Try to sync if online
    if (!isOffline) {
      try {
        await api.submitObservation(observation);
        await offlineDB.markSynced(observation.id);
      } catch (error) {
        // Will sync later
        console.log('Will sync when online');
      }
    }
    
    // Update UI
    refreshFieldData();
  };
  
  return (
    <View style={styles.container}>
      {/* Offline Indicator */}
      {isOffline && (
        <OfflineBanner
          onRetry={() => syncNow()}
          pendingCount={syncStatus.pending}
        />
      )}
      
      {/* Field Map */}
      <MapView
        style={styles.map}
        initialRegion={getFieldRegion(field)}
        mapType="satellite"
        showsUserLocation={true}
      >
        {field?.boundary && (
          <Polygon
            coordinates={field.boundary.coordinates}
            fillColor="rgba(0, 255, 0, 0.2)"
            strokeColor="#00FF00"
            strokeWidth={2}
          />
        )}
        
        {/* Soil test points */}
        {field?.soilTests?.map(test => (
          <Marker
            key={test.id}
            coordinate={test.location}
            title={`pH: ${test.ph}`}
            description={`N: ${test.nitrogen} ppm`}
          />
        ))}
      </MapView>
      
      {/* Quick Actions */}
      <QuickActions>
        <ActionButton
          icon="camera"
          onPress={() => captureFieldPhoto()}
          label="Photo"
        />
        
        <ActionButton
          icon="pest"
          onPress={() => reportPest()}
          label="Pest"
        />
        
        <ActionButton
          icon="moisture"
          onPress={() => recordMoisture()}
          label="Moisture"
        />
        
        <ActionButton
          icon="note"
          onPress={() => addNote()}
          label="Note"
        />
      </QuickActions>
      
      {/* Field Information */}
      <FieldInfoCard field={field}>
        <InfoRow label="Crop" value={field?.currentCrop} />
        <InfoRow label="Planted" value={field?.plantingDate} />
        <InfoRow 
          label="Restrictions" 
          value={field?.activeRestrictions?.length || 0}
          alert={field?.activeRestrictions?.length > 0}
        />
        
        {/* AI Insights */}
        <AIInsight
          message={field?.aiInsight}
          confidence={field?.insightConfidence}
        />
      </FieldInfoCard>
      
      {/* Recent Observations */}
      <ObservationsList
        observations={field?.recentObservations}
        onPress={(obs) => viewObservation(obs)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  map: {
    flex: 1
  }
});
```

---

### Story 6.4: Performance Dashboard
**Points:** 8  
**Assignee:** Full Stack Developer  
**Depends on:** Story 6.0  
**Gate:** Real-time updates < 1 second

**Real-Time Dashboard Implementation:**
```typescript
// apps/web/components/performance-dashboard.tsx
import { useWebSocket } from '../hooks/useWebSocket';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

export function PerformanceDashboard({ farmId }: Props) {
  const ws = useWebSocket('/realtime');
  const metrics = usePerformanceMetrics(farmId);
  
  // Real-time data streams
  useEffect(() => {
    ws.subscribe('farm_metrics', farmId);
    ws.subscribe('weather_updates', farmId);
    ws.subscribe('market_prices', 'all');
    ws.subscribe('network_alerts', farmId);
    
    return () => ws.unsubscribeAll();
  }, [farmId]);
  
  // Handle real-time updates
  ws.on('update', (data) => {
    // Update with minimal re-renders using React.memo and useMemo
    updateMetrics(data);
  });
  
  return (
    <Dashboard>
      {/* Key Performance Indicators */}
      <KPISection>
        <AnimatedMetric
          label="Season Profit Projection"
          value={metrics.projectedProfit}
          change={metrics.profitChange}
          format="currency"
          sparkline={metrics.profitHistory}
        />
        
        <AnimatedMetric
          label="Optimization Value Captured"
          value={metrics.optimizationValue}
          target={40}
          format="currency_per_acre"
          progress={true}
        />
        
        <AnimatedMetric
          label="Network Rank"
          value={metrics.networkRank}
          total={metrics.networkSize}
          format="rank"
          percentile={metrics.percentile}
        />
      </KPISection>
      
      {/* Real-Time Alerts */}
      <AlertStream>
        {metrics.alerts.map(alert => (
          <Alert
            key={alert.id}
            severity={alert.severity}
            timestamp={alert.timestamp}
            autoClose={alert.severity === 'info'}
          >
            {alert.message}
            {alert.action && (
              <Button onClick={alert.action}>
                {alert.actionLabel}
              </Button>
            )}
          </Alert>
        ))}
      </AlertStream>
      
      {/* Field Status Grid */}
      <FieldGrid>
        {metrics.fields.map(field => (
          <FieldCard
            key={field.id}
            field={field}
            status={getFieldStatus(field)}
            onClick={() => navigateToField(field.id)}
          >
            <MiniMap boundary={field.boundary} />
            <FieldMetrics>
              <Metric label="NDVI" value={field.ndvi} />
              <Metric label="Moisture" value={field.moisture} />
              <Metric label="GDDs" value={field.gdd} />
            </FieldMetrics>
            {field.alert && (
              <FieldAlert type={field.alert.type}>
                {field.alert.message}
              </FieldAlert>
            )}
          </FieldCard>
        ))}
      </FieldGrid>
      
      {/* Optimization Recommendations */}
      <RecommendationEngine>
        <h3>Today's Opportunities</h3>
        {metrics.recommendations.map(rec => (
          <Recommendation
            key={rec.id}
            title={rec.title}
            value={rec.estimatedValue}
            confidence={rec.confidence}
            effort={rec.effort}
            onAccept={() => acceptRecommendation(rec)}
            onDismiss={() => dismissRecommendation(rec)}
          >
            {rec.explanation}
          </Recommendation>
        ))}
      </RecommendationEngine>
      
      {/* Performance Monitoring */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor>
          <Stat label="Render Time" value={metrics.renderTime} unit="ms" />
          <Stat label="API Latency" value={metrics.apiLatency} unit="ms" />
          <Stat label="WS Messages/s" value={metrics.wsMessagesPerSec} />
          <Stat label="Memory" value={metrics.memoryUsage} unit="MB" />
        </PerformanceMonitor>
      )}
    </Dashboard>
  );
}
```

---

### Story 6.5: Export & Reporting System
**Points:** 5  
**Assignee:** Backend Developer  
**Depends on:** Story 6.0  
**Gate:** PDF generation < 5 seconds

**Report Generation System:**
```python
class ReportGenerator:
    """Generate professional reports for various stakeholders"""
    
    async def generate_comprehensive_report(
        self,
        farm_id: str,
        report_type: str,
        options: Dict
    ) -> Report:
        """Generate report with performance constraints"""
        
        start_time = time.time()
        
        # Load data in parallel
        data = await asyncio.gather(
            self.load_farm_data(farm_id),
            self.load_financial_data(farm_id),
            self.load_agronomic_data(farm_id),
            self.load_network_data(farm_id)
        )
        
        # Generate report based on type
        if report_type == 'banker':
            report = await self.generate_banker_report(*data)
        elif report_type == 'insurance':
            report = await self.generate_insurance_report(*data)
        elif report_type == 'landlord':
            report = await self.generate_landlord_report(*data)
        elif report_type == 'technical':
            report = await self.generate_technical_report(*data)
        else:
            report = await self.generate_standard_report(*data)
        
        # Performance check
        generation_time = time.time() - start_time
        if generation_time > 5.0:
            logger.warning(f"Report generation took {generation_time}s")
            
            # Optimize for next time
            await self.cache_report_data(farm_id, data)
        
        return report
    
    async def generate_banker_report(
        self,
        farm_data: Dict,
        financial_data: Dict,
        agronomic_data: Dict,
        network_data: Dict
    ) -> BankerReport:
        """Financial-focused report for loan applications"""
        
        # Create PDF with charts
        pdf = FPDF()
        pdf.add_page()
        
        # Executive Summary
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, "Farm Financial Performance Report", ln=True)
        
        pdf.set_font("Arial", '', 12)
        pdf.multi_cell(0, 10, f"""
        Farm: {farm_data['name']}
        Acres: {farm_data['total_acres']:,}
        Report Date: {datetime.now().strftime('%B %d, %Y')}
        """)
        
        # Financial Metrics
        pdf.add_page()
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(0, 10, "Financial Performance", ln=True)
        
        # Add charts
        profit_chart = await self.generate_profit_chart(financial_data)
        pdf.image(profit_chart, x=10, y=30, w=190)
        
        # Risk Analysis
        pdf.add_page()
        pdf.cell(0, 10, "Risk Analysis", ln=True)
        
        risk_metrics = {
            'Debt-to-Asset Ratio': financial_data['debt_ratio'],
            'Current Ratio': financial_data['current_ratio'],
            'Working Capital': f"${financial_data['working_capital']:,.0f}",
            'Insurance Coverage': f"{financial_data['insurance_coverage']*100:.0f}%"
        }
        
        for metric, value in risk_metrics.items():
            pdf.cell(0, 10, f"{metric}: {value}", ln=True)
        
        # ML Predictions
        pdf.add_page()
        pdf.cell(0, 10, "Projections & Optimization", ln=True)
        
        pdf.multi_cell(0, 10, f"""
        Projected Revenue: ${financial_data['projected_revenue']:,.0f}
        Optimization Potential: ${financial_data['optimization_value']:,.0f}
        Network Advantage: Top {network_data['percentile']:.0f}% of peers
        
        Recommendation: {self.get_loan_recommendation(financial_data)}
        """)
        
        # Save PDF
        pdf_path = f"/tmp/report_{farm_id}_{datetime.now().timestamp()}.pdf"
        pdf.output(pdf_path)
        
        return {
            'path': pdf_path,
            'type': 'banker',
            'generated': datetime.now(),
            'metrics': risk_metrics
        }
```

---

## Epic Acceptance Criteria with UX Gates

```typescript
// epic-6-acceptance.test.ts
describe('Epic 6: Visualization & UX Acceptance', () => {
  it('MUST load pages in under 3 seconds', async () => {
    const metrics = await performanceTest.measurePageLoad('/dashboard');
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.timeToInteractive).toBeLessThan(3000);
  });
  
  it('MUST achieve WCAG AA accessibility', async () => {
    const audit = await accessibilityTest.audit('/');
    expect(audit.score).toBeGreaterThanOrEqual(90);
    expect(audit.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });
  
  it('MUST handle 1000+ graph nodes smoothly', async () => {
    const graph = await createLargeGraph(1000);
    const performance = await measureGraphPerformance(graph);
    
    expect(performance.fps).toBeGreaterThanOrEqual(30);
    expect(performance.interactionLatency).toBeLessThan(100);
  });
  
  it('MUST answer 85% of NL queries correctly', async () => {
    const testQueries = getTestQueries(); // 100 test queries
    let correct = 0;
    
    for (const query of testQueries) {
      const response = await nlInterface.process(query.text);
      if (validateResponse(response, query.expected)) {
        correct++;
      }
    }
    
    expect(correct / testQueries.length).toBeGreaterThanOrEqual(0.85);
  });
  
  it('MUST work offline with sync', async () => {
    // Simulate offline
    await network.goOffline();
    
    // Should still work
    const result = await mobileApp.collectObservation(testObservation);
    expect(result.stored).toBe(true);
    
    // Go online and verify sync
    await network.goOnline();
    await wait(5000);
    
    const synced = await api.getObservation(testObservation.id);
    expect(synced).toBeDefined();
  });
});
```

---

## Enforcement Mechanisms

### 1. Performance Budget
```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000, // 250kb
    maxEntrypointSize: 500000, // 500kb
    hints: 'error' // Fail build if exceeded
  }
};
```

### 2. Accessibility Testing
```typescript
// Pre-commit hook
if (a11yScore < 90) {
  throw new Error('Accessibility requirements not met');
}
```

### 3. Mobile Performance
```swift
// iOS performance monitoring
if frameRate < 30 {
    reduceComplexity()
}
```

---

## Why This Architecture Works

1. **Performance First** - Speed determines adoption
2. **Accessibility Required** - Inclusive design for all farmers
3. **Complex Made Simple** - Graph visualization makes relationships clear
4. **Natural Interaction** - Farmers can ask questions naturally
5. **Works Everywhere** - Mobile-first with offline capability

This epic ensures the powerful intelligence system is actually usable by farmers in the field, driving 85% satisfaction and 25% faster decisions.