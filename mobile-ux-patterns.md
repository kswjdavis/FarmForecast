# FarmCalc Mobile UX Patterns - Field-Ready Design

## Design Constraints for Agricultural Field Use

### Environmental Challenges
- **Bright sunlight**: High contrast required (WCAG AAA)
- **Gloved hands**: Large touch targets (min 48x48px)
- **Dusty/wet conditions**: Sealed UI, no small gaps
- **Vehicle operation**: One-handed use patterns
- **Poor connectivity**: Offline-first architecture
- **Battery conservation**: Dark mode, reduced animations

## Core Mobile Navigation Pattern

```
┌─────────────────┐
│ ≡  FarmCalc  ⋯  │  Status Bar (GPS, Sync, Battery)
├─────────────────┤
│                 │
│  Current Field  │  Primary Context Card
│  ┌─────────┐    │
│  │   Map   │    │  Visual First
│  │  View   │    │
│  └─────────┘    │
│                 │
│  Field C        │  Essential Info
│  156 acres      │  Large Typography
│  Winter Wheat   │
│                 │
├─────────────────┤
│ ◉ Graph  Map ○  │  Tab Navigation
├─────────────────┤
│                 │
│  Actions ▼      │  Collapsible Sections
│  ┌────┬────┐    │
│  │Add │View│    │  Thumb-Reachable
│  │Note│Data│    │  Action Grid
│  └────┴────┘    │
│                 │
└─────────────────┘
```

## Mobile-First Information Architecture

### 1. Bottom Navigation (Thumb-Optimized)
```
┌─────────────────┐
│                 │
│   Content       │
│     Area        │
│                 │
├─────────────────┤
│  🏠  📊  🗺️  ⚙️ │  Fixed Bottom Nav
│ Home Graph Map  │  Always Accessible
└─────────────────┘
```

### 2. Progressive Disclosure Cards
```
┌─────────────────┐
│ Field Summary ▼ │ Collapsed State
├─────────────────┤
│ 156 acres       │
│ Wheat planted   │
│ Oct 15, 2024    │
│                 │
│ [Expand ▼]      │
├─────────────────┤ Expanded State
│ + Soil: 18%     │
│ + pH: 6.8       │
│ + N: 45 ppm     │
│ + Alerts: 2     │
└─────────────────┘
```

## Offline-First Data Patterns

### Sync Status Indicators
```
┌─────────────────┐
│ ☁️ Last sync: 2h │ Cloud Sync
│ 📱 Cached: 100% │ Local Storage
│ ⚡ Quick Sync   │ Manual Trigger
└─────────────────┘
```

### Data Freshness Visualization
```
Fresh  Stale  Expired
 ✓      ⚠️      ❌
<1hr   1-24h   >24h
```

## High-Contrast Field Mode

### Day Mode (Bright Sun)
```
┌─────────────────┐
│█████████████████│ High Contrast
│█               █│ Black on White
│█  Field Data   █│ Minimal Color
│█               █│
│█ Moisture: 18% █│ Bold Typography
│█ Status: GOOD  █│ Sans-Serif Only
│█               █│
│█████████████████│
```

### Night Mode (Low Light)
```
┌─────────────────┐
│                 │ OLED Black
│  Field Data     │ Saves Battery
│                 │ Red Accents
│ Moisture: 18%   │ Preserves Night
│ Status: GOOD    │ Vision
│                 │
└─────────────────┘
```

## Touch-Optimized Graph Controls

### Gesture-Based Graph Navigation
```
┌─────────────────┐
│     Graph       │
│                 │
│  👆 Tap: Select │
│  👆👆 Double:   │
│      Focus      │
│  ✌️ Pinch: Zoom │
│  👆➡️ Swipe:     │
│      Pan        │
│  👆⏱ Hold:      │
│      Details    │
└─────────────────┘
```

### Simplified Graph View
```
┌─────────────────┐
│   Your Fields   │
│                 │
│   🌾 ← 156ac    │
│    ↓            │ Reduced Complexity
│   🌽 ← 203ac    │ Essential Info Only
│    ↓            │ Clear Relationships
│   🌿 ← 178ac    │
│                 │
│ [Full Graph →]  │
└─────────────────┘
```

## Quick Action Patterns

### Floating Action Button (FAB)
```
┌─────────────────┐
│                 │
│                 │
│           [+]   │ Primary Action
│                 │ Always Visible
└─────────────────┘

Expanded FAB Menu:
     [📷]
   [📝] [+] [📍]
     [🎤]
```

### Contextual Quick Actions
```
┌─────────────────┐
│ Swipe for Actions
│ ←─────────────→ │
│                 │
│ Delete    Edit  │
│   🗑️       ✏️   │
└─────────────────┘
```

## Voice Input Integration

### Voice Command UI
```
┌─────────────────┐
│                 │
│      🎤         │
│   Listening...  │
│                 │
│ "Add wheat to   │
│  Field C"       │
│                 │
│ [Cancel] [Done] │
└─────────────────┘
```

### Voice Shortcuts
- "Show Field C"
- "What's the moisture?"
- "Add note: Sprayed today"
- "Navigate to North Quarter"

## What-If Scenario Mobile Pattern

### Swipeable Scenario Cards
```
┌─────────────────┐
│ Current Plan    │
│ Profit: $285/ac │
│ Risk: Medium    │
│                 │
│ ← Swipe for →   │
│  alternatives   │
└─────────────────┘

After Swipe →

┌─────────────────┐
│ Alternative 1   │
│ Profit: $310/ac │
│ Risk: High      │
│                 │
│ [Compare] [Use] │
└─────────────────┘
```

### Scenario Comparison Overlay
```
┌─────────────────┐
│ Current vs Alt  │
├─────────────────┤
│ Profit:         │
│ ████████ +$25   │
│                 │
│ Risk:           │
│ ████░░░░ +15%   │
│                 │
│ Water:          │
│ ██████░░ +20%   │
│                 │
│ [Details] [Select]│
└─────────────────┘
```

## Error Handling & Feedback

### Inline Validation
```
┌─────────────────┐
│ Add Herbicide   │
│                 │
│ Product:        │
│ [Atrazine___]   │
│ ⚠️ Plant-back   │
│ restriction!    │
│                 │
│ [Learn More]    │
└─────────────────┘
```

### Network Error Handling
```
┌─────────────────┐
│   No Network    │
│       📵        │
│                 │
│ Working Offline │
│ Changes saved   │
│ locally         │
│                 │
│ [Retry] [OK]    │
└─────────────────┘
```

## Responsive Components

### Adaptive Layouts
```
Portrait (320px):        Landscape (568px):
┌───────────┐           ┌─────────┬─────────┐
│  Graph    │           │ Graph   │ Details │
│           │           │         │         │
│  Details  │           │         │         │
│           │           └─────────┴─────────┘
└───────────┘
```

### Progressive Enhancement
1. **Core**: Text-only, works everywhere
2. **Enhanced**: Basic graphs, touch gestures
3. **Full**: 3D graphs, AR overlays (future)

## Performance Optimizations

### Lazy Loading Pattern
```
┌─────────────────┐
│ Fields (3/15)   │
│                 │
│ • Field A ✓     │
│ • Field B ✓     │
│ • Field C ✓     │
│                 │
│ [Load More ↓]   │ Load on Demand
└─────────────────┘
```

### Image Optimization
```
Network Speed → Image Quality
5G/WiFi     → Full Resolution
4G LTE      → Medium (WebP)
3G/2G       → Low/Placeholder
Offline     → Cached Only
```

## Accessibility Features

### Large Touch Targets
```
Minimum: 48x48px
Preferred: 56x56px
Spacing: 8px minimum
```

### High Contrast Mode
```
┌─────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓               ▓│ AAA Contrast
│▓  FIELD C      ▓│ 21:1 Ratio
│▓  156 ACRES    ▓│
│▓               ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────────┘
```

### Screen Reader Support
- Semantic HTML5 elements
- ARIA labels for all actions
- Descriptive alt text
- Logical tab order

## PWA Features

### App-Like Experience
```
┌─────────────────┐
│ Install App?    │
│                 │
│ 📱 FarmCalc     │
│                 │
│ • Work offline  │
│ • Quick access  │
│ • Push alerts   │
│                 │
│ [Install] [Later]│
└─────────────────┘
```

### Service Worker Caching
- Static assets: Cache forever
- API responses: Cache 24 hours
- Images: Cache 7 days
- User data: Cache until sync

## Critical User Flows

### 1. Quick Field Check (3 taps)
Home → Field Select → View Data

### 2. Add Observation (4 taps)
Field → Add → Photo/Note → Save

### 3. Compare Scenarios (5 taps)
Field → What-If → Modify → Compare → Select

### 4. Emergency Alert Response (2 taps)
Notification → View Alert → Take Action