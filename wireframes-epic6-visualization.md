# FarmCalc Wireframes - Epic 6: Advanced Visualization & UX

## 1. Interactive Graph Explorer with Temporal Scrubbing
```
┌──────────────────────────────────────────────────────────────────────┐
│ FarmCalc Graph Explorer                          [Export] [Share] 🔍 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  View Mode: [Graph] [Timeline] [Split Screen] [Comparison]          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │                  3D FORCE-DIRECTED GRAPH              │ Layers:  │
│  │                                                       │          │
│  │     🌾 ←→ 🌾 ←→ 🌾      Legend:                     │ ☑ Fields │
│  │      ↓     ↓     ↓        🌾 Wheat                   │ ☑ Crops  │
│  │     🌽 ←→ 🌽 ←→ 🌽       🌽 Corn                    │ ☑ Weather│
│  │      ↓     ↓     ↓        🌿 Sorghum                 │ ☐ Disease│
│  │     🌿 ←→ 🌿 ←→ 🌿       ━━ Strong influence        │ ☑ Yields │
│  │                           -- Medium influence         │          │
│  │   Influence Flow ●●●●→    ·· Weak influence         │ Filters: │
│  │                                                       │          │
│  │  [⟲ Rotate] [↕ Tilt] [± Zoom] [⊞ Center]           │ > 100ac  │
│  └──────────────────────────────────────────────────────┘ Wheat    │
│                                                            2020-2025│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━             │
│  2020 ──────────●────────── 2025  [▶ Play] Speed: 1x              │
│         Oct 2023 (Planting)                                        │
│                                                                     │
│  Node Details:                    Relationships:                   │
│  ┌─────────────────┐             ┌─────────────────┐             │
│  │ Field B          │             │ Adjacent to: 3  │             │
│  │ 312 acres        │             │ Influences: 5   │             │
│  │ Wheat → Corn     │             │ Influenced by: 2│             │
│  │ Yield: 52 bu/ac  │             │ Disease risk: Low│             │
│  └─────────────────┘             └─────────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. What-If Scenario Laboratory
```
┌──────────────────────────────────────────────────────────────────────┐
│ Scenario Explorer - Parallel Universe Analysis              [Help] ? │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Base Scenario                    Alternative Scenario              │
│  ┌─────────────────────┐         ┌─────────────────────┐          │
│  │    Current Plan     │   VS    │   What If...        │          │
│  │                     │         │                     │          │
│  │  🌾 🌾 🌾           │         │  🌽 🌽 🌽          │ Modify:  │
│  │  🌾 🌾 🌾           │         │  🌽 🌽 🌽          │          │
│  │  🌾 🌾 🌾           │         │  🌾 🌿 🌾          │ [Crops]  │
│  │                     │         │                     │ [Weather]│
│  │ Profit: $285/ac     │         │ Profit: $310/ac    │ [Inputs] │
│  │ Risk: Medium        │         │ Risk: High         │ [Timing] │
│  └─────────────────────┘         └─────────────────────┘          │
│                                                           Clone &   │
│  Comparison Metrics:                                     Modify:   │
│  ┌──────────────────────────────────────────────────┐            │
│  │                  Δ +$25/acre profit              │  [+ New]   │
│  │ ████████████░░░ Risk increased 15%              │  [Fork]    │
│  │ ████████████████ Herbicide compatible           │  [Save]    │
│  │ ██████░░░░░░░░░ Water use +20%                  │  [Reset]   │
│  └──────────────────────────────────────────────────┘            │
│                                                                    │
│  Assumptions Changed:                                             │
│  • Wheat → Corn rotation in Field B                              │
│  • Applied 20 lbs less Nitrogen                                  │
│  • Moved planting date 1 week earlier                            │
│                                                                    │
│  [Run Simulation]  [Share Scenario]  [Export Report]              │
└──────────────────────────────────────────────────────────────────────┘
```

## 3. Influence Flow Visualization
```
┌──────────────────────────────────────────────────────────────────────┐
│ Influence Propagation Map                         ⚙️ Settings       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Viewing: Disease Spread Risk from Field A                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │                                                       │ Timeline:│
│  │    Field A                                           │          │
│  │      🔴 ●●●●●●●→ Field B                            │ Day 0    │
│  │         ●●●●→ Field C                               │ ↓        │
│  │           ●→ Field D                                │ Day 7    │
│  │                ↓                                    │ (current)│
│  │            Field B                                   │ ↓        │
│  │              🟡 ●●●→ Field E                        │ Day 14   │
│  │                ●→ Field F                           │ (projected)│
│  │                                                      │          │
│  │   ● = Active spread particles                       │ Controls:│
│  │   Speed & thickness = transmission probability      │ [Pause]  │
│  │                                                      │ [Reset]  │
│  └──────────────────────────────────────────────────────┘ Speed: 2x│
│                                                                      │
│  Risk Assessment:                  Mitigation Options:              │
│  ┌──────────────────┐             ┌──────────────────┐            │
│  │ High Risk: 2 fields│             │ □ Spray Field B  │            │
│  │ Med Risk: 3 fields │             │ □ Buffer zones   │            │
│  │ Low Risk: 8 fields │             │ □ Early harvest  │            │
│  │ Total area: 890 ac │             │ Est. cost: $4,500│            │
│  └──────────────────┘             └──────────────────┘            │
└──────────────────────────────────────────────────────────────────────┘
```

## 4. Causal Path Explainer
```
┌──────────────────────────────────────────────────────────────────────┐
│ Why This Recommendation? - Causal Analysis                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Recommendation: Plant Winter Wheat in Field C                      │
│  Confidence: 87% (High)                                            │
│                                                                      │
│  Causal Chain Visualization:                                       │
│  ┌──────────────────────────────────────────────────────┐          │
│  │                                                       │          │
│  │  [Previous Corn] ──85%──→ [High N Residual]         │ Evidence: │
│  │                              ↓                       │          │
│  │                            75%                       │ "Similar │
│  │                              ↓                       │ farms    │
│  │  [Low Disease] ←──────→ [Wheat Success]            │ with this│
│  │       ↑                      ↓                      │ rotation │
│  │      62%                    88%                     │ averaged │
│  │       ↑                      ↓                      │ 58 bu/ac"│
│  │  [Dry Winter] ──────→ [Higher Yield]               │          │
│  │                                                      │ Source:  │
│  │  Alternative paths considered: 3                    │ K-State  │
│  │  This path selected due to: Highest probability     │ Study    │
│  └──────────────────────────────────────────────────────┘ 2019-2023│
│                                                                      │
│  Contributing Factors (SHAP values):                               │
│  Previous crop (Corn):        ████████████░░░ +12%                │
│  Soil nitrogen (45 ppm):      ████████░░░░░░░ +8%                 │
│  Disease pressure (Low):       ██████░░░░░░░░░ +6%                │
│  Expected precipitation:        ████░░░░░░░░░░░ +4%                │
│                                                                      │
│  [See Alternative Explanations]  [Export Full Report]               │
└──────────────────────────────────────────────────────────────────────┘
```

## 5. Natural Language Query Interface
```
┌──────────────────────────────────────────────────────────────────────┐
│ Ask Your Farm Network                                    🎤 Voice   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  💬 "Which fields had wheat rust last year?"                       │
│                                                                      │
│  Searching graph... Found 3 matches                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────┐          │
│  │         Visual Result                                │ Examples:│
│  │                                                       │          │
│  │     🔴 Field B    🔴 Field E    🔴 Field G          │ "Show    │
│  │      May 2024      Jun 2024      May 2024           │ fields   │
│  │      Severe        Moderate      Moderate           │ next to  │
│  │                                                       │ Field A" │
│  │     [View on Graph]  [Show Timeline]                │          │
│  └──────────────────────────────────────────────────────┘ "What    │
│                                                            rotations│
│  Query translated to:                                     worked   │
│  MATCH (f:Field)-[r:HAD_DISEASE]->(d:Disease)           best?"   │
│  WHERE d.type = 'wheat_rust'                                       │
│    AND r.year = 2024                                     "Compare │
│  RETURN f, r, d                                          my yields│
│                                                           to       │
│  Follow-up questions:                                    similar  │
│  • "What treatments were applied?"                       farms"   │
│  • "Show spread pattern over time"                                │
│  • "Which fields are at risk this year?"                          │
│                                                                     │
│  [New Question]  [Save Query]  [Share Results]                     │
└──────────────────────────────────────────────────────────────────────┘
```

## 6. Mobile Graph Viewer (Simplified for Field Use)
```
┌─────────────────┐
│ ≡  Graph View   │
├─────────────────┤
│                 │
│   Current:      │
│   Field C       │
│                 │
│  🌾──🌾──🌾     │
│   ↓   ↓   ↓     │
│  🌾──🌾──🌾     │
│                 │
│  [Zoom to Fit]  │
│                 │
├─────────────────┤
│ Neighbors:      │
│                 │
│ • Field B ←     │
│   312ft away    │
│   Same crop ✓   │
│                 │
│ • Field D →     │
│   628ft away    │
│   Different ⚠️   │
│                 │
├─────────────────┤
│ Quick Actions:  │
│                 │
│ [What-If Mode]  │
│ [Time Machine]  │
│ [Ask Question]  │
│                 │
└─────────────────┘
```

## 7. Uncertainty Visualization Pattern
```
┌──────────────────────────────────────────────────────────────────────┐
│ Yield Prediction with Confidence Intervals                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Field B - Winter Wheat Yield Forecast                             │
│                                                                      │
│  80 ┤                                                              │
│     │                           ░░░░░░░░░                          │
│  70 ┤                      ░░░░░█████████░░░░░                    │
│     │                  ░░░░███████████████████░░░░                │
│  60 ┤              ░░░░█████████ 58 bu █████████░░░░              │
│ Y   │          ░░░░███████████████████████████████░░░░           │
│ i 50┤      ░░░░█████████████████████████████████████░░░░        │
│ e   │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       │
│ l 40┤                                                            │
│ d   │   90% Confidence     Mean Prediction     10% Confidence    │
│     │   ░░░░░░░░░░░░       ████████████       ░░░░░░░░░░░░     │
│  30 └────────────────────────────────────────────────────────    │
│      Oct   Nov   Dec   Jan   Feb   Mar   Apr   May   Jun         │
│                                                                    │
│  Confidence decreases with time →                                │
│  Current factors: Soil moisture ✓  Disease risk ✓  Weather ?     │
│                                                                    │
│  [Adjust Assumptions]  [Compare Scenarios]  [Export]              │
└──────────────────────────────────────────────────────────────────────┘
```

## Advanced Interaction Patterns

### 1. Temporal Scrubbing Interaction
- **Drag timeline**: Animate graph changes through seasons
- **Click specific date**: Jump to that point in time
- **Play button**: Auto-advance through time
- **Speed control**: 0.5x to 5x playback speed

### 2. Graph Cloning for What-If
```
User Action → System Response
1. Select nodes → Highlight selection
2. Click "Clone" → Create parallel graph
3. Modify clone → Show live differences
4. Compare → Side-by-side metrics
```

### 3. Progressive Data Loading
```
Distance from focus node:
- 1 hop: Full detail (100% data)
- 2 hops: Summary (50% data)
- 3 hops: Basic info (25% data)
- 4+ hops: On-demand loading
```

### 4. Touch Gestures (Mobile)
- **Pinch**: Zoom graph
- **Two-finger drag**: Pan view
- **Long press**: Node details
- **Swipe up**: Quick actions menu
- **Swipe down**: Refresh data

### 5. Uncertainty Communication
```
Visual Indicators:
━━━━━ High confidence (>80%)
━ ━ ━ Medium confidence (50-80%)
· · · Low confidence (<50%)

Fuzzy edges for uncertain relationships
Gradient fills for probability ranges
```

## Responsive Breakpoints

### Desktop (1920px+)
- Full 3D graph with all features
- Side panels for details
- Multi-window comparison

### Tablet (768px - 1919px)
- 2D graph with touch optimization
- Collapsible panels
- Simplified controls

### Mobile (320px - 767px)
- Card-based navigation
- Essential graph views only
- Voice input priority
- Offline-first design

## Performance Targets

- Graph render: <100ms for 1000 nodes
- Interaction response: <16ms (60fps)
- Data update: <1s for full refresh
- Offline cache: 7 days of data
- PWA load: <3s on 3G network