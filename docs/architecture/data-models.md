# Data Models

## Farm
**Purpose:** Represents a farming operation with multiple fields

**TypeScript Interface:**
```typescript
interface Farm {
  id: string;
  name: string;
  ownerId: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  totalAcres: number;
  createdAt: Date;
  preferences: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    primaryCrops: string[];
    equipmentInventory: string[];
  };
}
```

## Field
**Purpose:** Individual field with boundaries and rotation history

**TypeScript Interface:**
```typescript
interface Field {
  id: string;
  farmId: string;
  name: string;
  boundary: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  acres: number;
  soilType: string;
  currentCrop?: string;
  currentMoisture?: number;
  lastUpdated: Date;
}
```

## Additional Core Models
- **Crop:** Varieties with agronomic properties
- **Season:** Links fields to crops for specific years
- **Treatment:** Agricultural inputs (herbicides, fertilizers)
- **WeatherEvent:** Weather observations affecting operations
