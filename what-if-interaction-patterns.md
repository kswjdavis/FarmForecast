# FarmCalc What-If Scenario Interaction Patterns

## Core Concept: Graph Cloning for Parallel Universe Exploration

### Design Philosophy
FarmCalc's what-if scenarios leverage Neo4j's graph structure to create parallel universes where farmers can safely explore different decisions without affecting their base plan. Each scenario is a complete graph clone that maintains all relationships and constraints.

## 1. Scenario Creation Flow

### Starting a What-If Analysis
```
┌──────────────────────────────────────────────────────────────────────┐
│ Create New Scenario                                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Base Scenario: [Current 2025 Plan ▼]                              │
│                                                                      │
│  Scenario Name: [___________________________]                        │
│  Example: "Early wheat planting" or "Drought contingency"          │
│                                                                      │
│  What do you want to explore? (Select all that apply)              │
│  ☑ Different crop rotations                                        │
│  ☐ Modified planting dates                                         │
│  ☑ Alternative input levels (N, seed rate)                         │
│  ☐ Weather scenarios (wet/normal/dry)                              │
│  ☐ Market price variations                                         │
│                                                                      │
│  Fields to Include:                                                │
│  ○ All fields (2,500 acres)                                        │
│  ● Selected fields only                                            │
│     ☑ Field A  ☑ Field B  ☑ Field C  ☐ Field D                   │
│                                                                      │
│  [Cancel]                           [Create Scenario →]             │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. Side-by-Side Comparison Interface

### Visual Comparison Pattern
```
┌──────────────────────────────────────────────────────────────────────┐
│ Scenario Comparison                                    [Export PDF]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Current Plan          vs          Early Wheat Scenario             │
│  ─────────────────────────────────────────────────────             │
│                                                                      │
│  Graph View:                                                        │
│  ┌────────────────┐              ┌────────────────┐               │
│  │    🌾 🌾 🌾    │              │    🌾 🌾 🌾    │  Differences: │
│  │    🌽 🌽 🌽    │    ≠         │    🌾 🌾 🌾    │  • 3 fields  │
│  │    🌿 🌿 🌿    │              │    🌽 🌽 🌽    │    changed   │
│  └────────────────┘              └────────────────┘  • Net: +$45k│
│                                                                     │
│  Key Metrics:                                                      │
│  ┌─────────────────────────┬─────────────────────────┐           │
│  │ Expected Profit         │ Expected Profit         │           │
│  │ $285/acre              │ $310/acre (+$25)       │           │
│  │                        │                        │           │
│  │ Risk Score             │ Risk Score             │           │
│  │ ████████░░ 72%        │ ██████████ 85% (+13%)  │           │
│  │                        │                        │           │
│  │ Herbicide Conflicts    │ Herbicide Conflicts    │           │
│  │ ✓ None                │ ⚠️ 1 Warning           │           │
│  └─────────────────────────┴─────────────────────────┘           │
│                                                                    │
│  [Modify Scenario]  [Create Another]  [Select This Plan]          │
└──────────────────────────────────────────────────────────────────────┘
```

## 3. Interactive Modification Controls

### Drag-and-Drop Crop Rotation
```
┌──────────────────────────────────────────────────────────────────────┐
│ Modify Rotation - Drag Crops to Fields                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Available Crops:                    Field Timeline:                │
│  ┌──────────┐                       2024   2025   2026   2027      │
│  │ 🌾 Wheat │                                                      │
│  │ 🌽 Corn  │     Field A:    🌽 → [Drop] → [ ] → [ ]            │
│  │ 🌿 Sorghum│                      ↑                              │
│  │ 🌱 Fallow │     Field B:    🌾 → 🌾 → [ ] → [ ]               │
│  └──────────┘                                                      │
│                   Field C:    🌿 → [ ] → [ ] → [ ]               │
│  Drag crops →                                                      │
│  to timeline                                                       │
│                                                                     │
│  ⚠️ Constraint Warnings:                                           │
│  • Wheat after wheat in Field B may increase disease risk         │
│  • Consider rotation diversity for Field A                        │
│                                                                     │
│  [Reset]  [Optimize Automatically]  [Apply Changes]               │
└──────────────────────────────────────────────────────────────────────┘
```

## 4. Slider-Based Parameter Adjustment

### Input Level Modification
```
┌──────────────────────────────────────────────────────────────────────┐
│ Adjust Input Parameters                                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Nitrogen Application (lbs/acre):                                   │
│  Current: 60                                                        │
│  0 ────────●──────── 120                                           │
│            60                     Impact: +$12/acre profit          │
│                                          -5% protein               │
│                                                                     │
│  Seeding Rate (seeds/acre):                                        │
│  Current: 75,000                                                   │
│  50k ──────────●──── 100k                                         │
│               75k                 Impact: Optimal for moisture      │
│                                                                     │
│  Planting Date:                                                    │
│  Oct 1 ────●──────── Nov 1                                        │
│         Oct 15        Impact: 3 bu/acre yield increase             │
│                              Higher frost risk                     │
│                                                                     │
│  [Reset All]  [See Detailed Impact]  [Apply to Scenario]          │
└──────────────────────────────────────────────────────────────────────┐
```

## 5. Weather Scenario Selection

### Climate Pattern Explorer
```
┌──────────────────────────────────────────────────────────────────────┐
│ Weather Scenario Selection                                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Base Weather: [2020 Analog Year (Normal) ▼]                       │
│                                                                      │
│  Alternative Scenarios:                                             │
│  ┌────────────┬────────────┬────────────┐                         │
│  │   Dry      │   Normal   │    Wet     │                         │
│  │  (2012)    │   (2020)   │   (2019)   │                         │
│  │            │            │            │                         │
│  │ Rain: 14"  │ Rain: 17"  │ Rain: 22"  │                         │
│  │            │  SELECTED  │            │                         │
│  │ Yield: -15%│ Yield: Base│ Yield: +8% │                         │
│  │            │            │            │                         │
│  │ Risk: High │ Risk: Med  │ Risk: Med  │                         │
│  └────────────┴────────────┴────────────┘                         │
│                                                                     │
│  Probability-Weighted Analysis:                                    │
│  Dry (25%) + Normal (50%) + Wet (25%) = Expected: $287/acre       │
│                                                                     │
│  [Run All Scenarios]  [Custom Weather]  [Apply]                    │
└──────────────────────────────────────────────────────────────────────┘
```

## 6. Constraint Violation Handling

### Real-Time Validation Feedback
```
┌──────────────────────────────────────────────────────────────────────┐
│ ⚠️ Constraint Violations Detected                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Herbicide Carryover Risk                        [View Details] │
│     Field B: Atrazine → Wheat                                      │
│     Violation: 8 months remaining on restriction                   │
│     Options: • Wait until Nov 2025                                 │
│              • Choose different crop                               │
│              • Use different field                                 │
│                                                                     │
│  2. Equipment Incompatibility                       [View Details] │
│     Field D: 30" rows → 15" wheat drill                           │
│     Issue: Row spacing mismatch                                   │
│     Options: • Use different equipment                            │
│              • Plant different crop                               │
│                                                                     │
│  [Ignore Warnings]  [Auto-Fix]  [Manual Adjustment]               │
└──────────────────────────────────────────────────────────────────────┘
```

## 7. Scenario Branching

### Decision Tree Exploration
```
┌──────────────────────────────────────────────────────────────────────┐
│ Scenario Decision Tree                                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Base Plan                                                          │
│      │                                                              │
│      ├── Scenario A: Early Wheat                                   │
│      │        │                                                     │
│      │        ├── A1: + Extra Nitrogen    [$305/ac]               │
│      │        └── A2: + Reduced Density   [$298/ac]               │
│      │                                                              │
│      └── Scenario B: Corn Focus                                    │
│               │                                                      │
│               ├── B1: All Corn            [$320/ac] ⚠️ High Risk   │
│               └── B2: Corn/Sorghum Mix    [$312/ac] ✓ Balanced    │
│                                                                      │
│  [Expand All]  [Compare Selected]  [Export Tree]                   │
└──────────────────────────────────────────────────────────────────────┘
```

## 8. Automated Optimization Suggestions

### AI-Powered Recommendations
```
┌──────────────────────────────────────────────────────────────────────┐
│ 🤖 Optimization Suggestions                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Based on your goals, I found 3 improvements:                      │
│                                                                      │
│  1. Swap Field C and E rotations                   [Apply]         │
│     • Reduces disease pressure                                     │
│     • Improves profit by $8/acre                                   │
│     • Graph shows: C→E influence reduced                           │
│                                                                      │
│  2. Delay Field B planting by 1 week              [Apply]         │
│     • Avoids frost risk (85% → 45%)                               │
│     • Minimal yield impact (-1 bu/ac)                             │
│                                                                      │
│  3. Increase N on Fields A,D,F                    [Apply]         │
│     • Soil tests show deficiency                                   │
│     • Expected ROI: 3.2:1                                          │
│                                                                      │
│  [Apply All]  [See Reasoning]  [Suggest More]                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 9. Scenario Performance Tracking

### Monte Carlo Simulation Results
```
┌──────────────────────────────────────────────────────────────────────┐
│ Scenario Performance Analysis (1000 simulations)                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Profit Distribution:                                               │
│                                                                      │
│         Current Plan          Early Wheat Scenario                  │
│    400 ┤                                                           │
│        │     ████                    ████                          │
│    300 ┤   ████████                ████████                        │
│ $/ac   │ ████████████            ████████████                      │
│    200 ┤███████████████        ██████████████████                  │
│        │                                                            │
│    100 └────────────────────────────────────────                   │
│         150  250  350           150  250  350                       │
│                                                                      │
│  Metrics:           Current    Scenario    Difference              │
│  Mean Profit:       $285       $310        +$25                    │
│  95% CI:           $220-350   $235-385    wider range             │
│  P(Loss):          8%         12%         +4% risk                │
│  Best Case:        $380       $425        +$45                    │
│  Worst Case:       $145       $120        -$25                    │
│                                                                      │
│  [Run More Simulations]  [Change Assumptions]  [Export]            │
└──────────────────────────────────────────────────────────────────────┘
```

## 10. Scenario Save & Share

### Collaboration Features
```
┌──────────────────────────────────────────────────────────────────────┐
│ Save & Share Scenario                                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Scenario: "Early Wheat with High N"                               │
│  Created: Jan 15, 2025 by John Smith                               │
│  Status: ⚠️ Under Review                                            │
│                                                                      │
│  Share With:                                                        │
│  ☑ Farm Partner (Jane Smith)                                       │
│  ☑ Agronomist (Dr. Johnson)                                        │
│  ☐ Banker (First National)                                         │
│  ☐ Insurance Agent                                                 │
│                                                                      │
│  Include:                                                           │
│  ☑ Full scenario details                                           │
│  ☑ Comparison metrics                                              │
│  ☐ Detailed financials                                             │
│  ☑ Risk analysis                                                   │
│                                                                      │
│  Add Note:                                                          │
│  [Considering this for 2025 season. Please review_]                │
│  [the nitrogen rates and frost risk assessment.   ]                │
│                                                                      │
│  [Cancel]  [Save Draft]  [Share Now]                               │
└──────────────────────────────────────────────────────────────────────┘
```

## Key Interaction Principles

### 1. Non-Destructive Editing
- All scenarios are clones - base plan never modified
- Easy rollback to any previous state
- Version history for all scenarios

### 2. Real-Time Feedback
- Instant constraint validation
- Live profit/risk calculations
- Dynamic graph updates

### 3. Guided Exploration
- AI suggestions based on goals
- Constraint warnings before violations
- Best practice recommendations

### 4. Comparison-First Design
- Always show current vs. scenario
- Highlight differences clearly
- Quantify all changes

### 5. Collaborative Planning
- Share scenarios with advisors
- Comment and annotate
- Track decision history