# FarmCalc Wireframes - Epic 1: Foundation & Graph Infrastructure

## 1. Dashboard - Network Command Center
```
┌──────────────────────────────────────────────────────────────┐
│ FarmCalc  [≡]                     ⚙️ Settings  👤 John Smith  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome back, John!     Last sync: 2 hours ago             │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │            FARM NETWORK GRAPH                   │         │
│  │                                                 │         │
│  │         🌾 Field A ←→ 🌾 Field B               │ Search: │
│  │              ↓            ↓                     │ [____] │
│  │         🌾 Field C    🌾 Field D               │         │
│  │              ↓                                  │ Filter: │
│  │         🌾 Field E ←→ 🌾 Field F               │ ○ All   │
│  │                                                 │ ● Wheat │
│  │     [Zoom +/-] [Reset] [2D/3D]                 │ ○ Corn  │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Quick Actions:                    Key Metrics:              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ + Add Field  │ │ View Alerts  │ │ Total: 2,500 │        │
│  │              │ │     (3)      │ │    acres     │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│  Recent Activity:                                            │
│  • Field B: Herbicide warning - Atrazine restriction        │
│  • Field D: Soil test results uploaded                      │
│  • Weather update: 0.3" rain recorded yesterday             │
└──────────────────────────────────────────────────────────────┘
```

## 2. Field Definition Interface
```
┌──────────────────────────────────────────────────────────────┐
│ ← Back     Define Field Boundaries                    [Save] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Field Name: [North Quarter_______]                         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │              MAP CANVAS                         │ Tools:  │
│  │                                                 │         │
│  │     🗺️ Satellite View                          │ [Draw]  │
│  │                                                 │ [Edit]  │
│  │     Click to draw field boundary               │ [Clear] │
│  │     • Click points to create polygon           │         │
│  │     • Double-click to complete                 │ Import: │
│  │                                                 │ [Upload │
│  │     Drawn Area: 156.3 acres                   │  Shape- │
│  │                                                 │  file]  │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Field Properties:                                          │
│  Soil Type: [Sandy Loam____▼]                               │
│  Current Crop: [Winter Wheat▼]                              │
│  Planted Date: [10/15/2024___]                              │
│                                                              │
│  Adjacent Fields (auto-detected):                           │
│  ☑ Field A (East) - 312 ft boundary                        │
│  ☑ Field C (South) - 628 ft boundary                       │
│                                                              │
│  [Cancel]                                    [Save & Add Another] │
└──────────────────────────────────────────────────────────────┘
```

## 3. Authentication & Onboarding Flow
```
┌──────────────────────────────────────────────────────────────┐
│                     Welcome to FarmCalc                      │
│              Graph-Driven Agricultural Intelligence           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1 of 3: Create Your Account                           │
│                                                              │
│  Email: [___________________________]                        │
│  Password: [________________________]                        │
│  Confirm: [_________________________]                        │
│                                                              │
│  Farm Operation Name: [_____________________]                │
│  County: [Hamilton County, KS______▼]                        │
│                                                              │
│  □ I agree to Terms of Service                              │
│  □ I understand recommendations are advisory only           │
│                                                              │
│  [Back]                                    [Continue →]      │
│                                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━              │
│                                                              │
│  Already have an account? [Sign In]                         │
└──────────────────────────────────────────────────────────────┘
```

## 4. Farm Profile Setup
```
┌──────────────────────────────────────────────────────────────┐
│                     Farm Profile Setup                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 2 of 3: Tell Us About Your Operation                  │
│                                                              │
│  Total Acres: [2,500_______]                                │
│  □ Owned: [1,800___] acres                                  │
│  □ Rented: [700____] acres                                  │
│                                                              │
│  Primary Crops (select all that apply):                     │
│  ☑ Winter Wheat    ☑ Corn    ☑ Grain Sorghum              │
│  □ Soybeans        □ Canola   □ Cover Crops                │
│                                                              │
│  Years of Historical Data Available:                        │
│  ○ < 3 years   ● 3-5 years   ○ 5-10 years   ○ 10+ years  │
│                                                              │
│  Equipment Row Spacing:                                     │
│  Planter: [30 inches___▼]                                   │
│  Combine: [30 inches___▼]                                   │
│                                                              │
│  Weather Station Distance:                                  │
│  ● < 10 miles   ○ 10-20 miles   ○ 20-30 miles            │
│                                                              │
│  [← Back]                                   [Continue →]     │
└──────────────────────────────────────────────────────────────┘
```

## 5. Interactive Graph Navigation Pattern
```
┌──────────────────────────────────────────────────────────────┐
│                  Graph Interaction Controls                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Node Selection:                                            │
│  • Click: Select node & show details                        │
│  • Shift+Click: Multi-select nodes                          │
│  • Double-click: Focus view on node                         │
│                                                              │
│  Navigation:                                                │
│  • Drag background: Pan view                                │
│  • Scroll: Zoom in/out                                      │
│  • Right-click: Context menu                                │
│                                                              │
│  Visual Encoding:                                           │
│  ┌────────────────────────────────────┐                     │
│  │ Node Colors:                       │                     │
│  │ 🟢 Healthy/Normal                  │                     │
│  │ 🟡 Warning/Attention Needed        │                     │
│  │ 🔴 Critical/Action Required        │                     │
│  │                                    │                     │
│  │ Edge Thickness:                    │                     │
│  │ ━━━ Strong relationship            │                     │
│  │ --- Moderate relationship          │                     │
│  │ ··· Weak relationship              │                     │
│  └────────────────────────────────────┘                     │
│                                                              │
│  Quick Filters:                                             │
│  [All] [Current Season] [Problems] [Opportunities]          │
└──────────────────────────────────────────────────────────────┘
```

## 6. Mobile-First Field View (PWA)
```
┌─────────────────┐
│ ≡  Field C  ⚙️  │
├─────────────────┤
│                 │
│   🌾            │
│  Field C        │
│  156 acres      │
│                 │
│ Status: ✓ Good  │
│                 │
├─────────────────┤
│ Adjacent Fields │
│                 │
│ → Field A (E)   │
│ → Field B (N)   │
│                 │
├─────────────────┤
│ Quick Actions   │
│                 │
│ [+ Add Note]    │
│ [📷 Photo]      │
│ [📍 Update]     │
│                 │
├─────────────────┤
│ Recent Activity │
│                 │
│ • Herbicide     │
│   applied 5d    │
│ • Moisture: 18% │
│                 │
└─────────────────┘
```

## Interaction Patterns

### Graph Node Hover State
```
┌─────────────────────────┐
│ Field B - North Quarter │
│ 312 acres               │
│ Current: Winter Wheat   │
│ Planted: Oct 15, 2024   │
│                         │
│ Alerts: 1 Warning       │
│ [View Details →]        │
└─────────────────────────┘
```

### Progressive Disclosure Pattern
1. **Level 1**: Basic graph with field nodes
2. **Level 2**: Add relationships (adjacency, influence)
3. **Level 3**: Show temporal data (rotation history)
4. **Level 4**: Display predictions & uncertainties

### Error States
```
┌──────────────────────────┐
│ ⚠️ Connection Issue      │
│                          │
│ Unable to fetch weather  │
│ data. Last update: 3h    │
│                          │
│ [Retry] [Work Offline]   │
└──────────────────────────┘
```

## Design Principles Applied

1. **Graph-First Navigation**: Primary interface is the interactive graph
2. **Progressive Complexity**: Start simple, reveal depth as needed
3. **Mobile-Responsive**: Core functions work on 320px width
4. **Uncertainty Visible**: Always show confidence/data quality
5. **Farmer-Friendly Language**: Avoid technical jargon
6. **Quick Actions**: Most common tasks always accessible
7. **Offline Capability**: PWA with smart caching