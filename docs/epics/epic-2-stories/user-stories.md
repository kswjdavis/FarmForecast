# User Stories

## 🔴 Story 2.0: Weather API Integration [PHASE 1A CRITICAL]
**Points:** 8  
**Assignee:** Backend Developer  
**Type:** VALUE DELIVERY REQUIREMENT  
**Blocks:** Phase 1a value proposition

**Why This Is Here:**
```yaml
business_requirement: 
  - Herbicide carryover checking REQUIRES precipitation data
  - $10-15/acre value DEPENDS on weather integration
  - Cannot deliver Phase 1a without weather data
  
verification_gate:
  - weather_2020_api: CONNECTED ✓
  - mesonet_api: CONNECTED ✓
  - historical_data: ACCESSIBLE ✓
```

**Pre-Story Gate Check:**
```javascript
// This MUST pass before story can begin
async function verifyWeatherAPIs() {
  const gates = {
    weather2020: await testWeather2020Connection(),
    mesonet: await testMesonetConnection()
  };
  
  if (!gates.weather2020 || !gates.mesonet) {
    throw new Error(`
      ❌ BLOCKED: Weather APIs not configured
      ACTION REQUIRED: 
      1. Ensure Story 1.0.C completed (API contracts)
      2. Verify credentials in vault
      3. Run: npm run verify:weather
      
      BUSINESS IMPACT: Cannot deliver $10-15/acre value without weather data
    `);
  }
}

await verifyWeatherAPIs();
```

**Implementation:**
```python
# apps/api/services/weather_service.py
from typing import Dict, List, Optional
import httpx
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.cache import redis_client

class WeatherService:
    """Critical service for Phase 1a value delivery"""
    
    def __init__(self):
        # Verify credentials on initialization
        if not settings.WEATHER_2020_API_KEY:
            raise ValueError("BLOCKED: Weather 20/20 API key missing")
        if not settings.MESONET_API_TOKEN:
            raise ValueError("BLOCKED: Mesonet API token missing")
            
        self.weather2020_client = httpx.AsyncClient(
            base_url="https://api.weather2020.com/v1",
            headers={"X-API-Key": settings.WEATHER_2020_API_KEY}
        )
        
        self.mesonet_client = httpx.AsyncClient(
            base_url="https://mesonet.k-state.edu/rest/",
            headers={"Authorization": f"Bearer {settings.MESONET_API_TOKEN}"}
        )
    
    async def get_precipitation_history(
        self, 
        field_id: str,
        days_back: int = 120
    ) -> Dict:
        """
        Critical for herbicide carryover calculations
        Required for $10-15/acre value proposition
        """
        # Check cache first
        cache_key = f"precip:{field_id}:{days_back}"
        cached = await redis_client.get(cache_key)
        if cached:
            return cached
            
        # Get field location from Neo4j
        field = await self.get_field_location(field_id)
        
        # Fetch from both sources for redundancy
        mesonet_data = await self._fetch_mesonet_precipitation(
            field.latitude, 
            field.longitude,
            days_back
        )
        
        weather2020_data = await self._fetch_weather2020_precipitation(
            field.latitude,
            field.longitude, 
            days_back
        )
        
        # Combine and validate
        result = self._merge_weather_sources(mesonet_data, weather2020_data)
        
        # Cache for 1 hour
        await redis_client.setex(cache_key, 3600, result)
        
        return result
    
    async def check_herbicide_restrictions(
        self,
        field_id: str,
        herbicide: str,
        application_date: datetime
    ) -> Dict:
        """
        CORE PHASE 1A FEATURE
        Prevents carryover disasters = $10-15/acre value
        """
        # Get precipitation since application
        precip = await self.get_precipitation_history(
            field_id,
            days_back=(datetime.now() - application_date).days
        )
        
        # Load herbicide restrictions from database
        restrictions = await self.get_herbicide_restrictions(herbicide)
        
        # Calculate if restrictions are met
        total_precip = sum(p['amount'] for p in precip['daily'])
        
        return {
            'herbicide': herbicide,
            'required_precipitation': restrictions['min_precipitation_inches'],
            'actual_precipitation': total_precip,
            'restriction_met': total_precip >= restrictions['min_precipitation_inches'],
            'safe_to_plant': total_precip >= restrictions['min_precipitation_inches'],
            'value_protected_per_acre': 10 if total_precip < restrictions['min_precipitation_inches'] else 0,
            'recommendation': 'SAFE TO PLANT' if total_precip >= restrictions['min_precipitation_inches'] 
                           else f'WARNING: Need {restrictions["min_precipitation_inches"] - total_precip:.1f}" more precipitation'
        }
```

**GraphQL Integration:**
```typescript
// apps/web/graphql/weather.graphql
query GetFieldWeatherData($fieldId: ID!, $daysBack: Int!) {
  field(id: $fieldId) {
    id
    name
    weatherData(daysBack: $daysBack) {
      precipitation {
        total
        daily {
          date
          amount
          confidence
        }
      }
      herbicideRestrictions {
        safe
        restrictions {
          herbicide
          daysRemaining
          precipitationNeeded
          valueAtRisk  # $10-15/acre
        }
      }
    }
  }
}
```

---

## Story 2.1: User Registration with Farm Setup
**Points:** 8  
**Assignee:** Backend Developer  
**Depends on:** Epic 1 Complete, Story 2.0 Started  

**Updated Implementation (includes weather station assignment):**
```python
@router.post("/register")
async def register_user(registration: UserRegistration):
    # Previous registration code...
    
    # NEW: Assign nearest weather stations
    weather_stations = await weather_service.find_nearest_stations(
        latitude=registration.farm_latitude,
        longitude=registration.farm_longitude,
        radius_miles=50
    )
    
    # Store in Neo4j with farm
    await neo4j.run("""
        MATCH (f:Farm {id: $farm_id})
        MERGE (ws:WeatherStation {id: $station_id})
        CREATE (f)-[:USES_WEATHER_FROM {
            distance_miles: $distance,
            primary: $is_primary
        }]->(ws)
    """, {
        'farm_id': farm.id,
        'station_id': weather_stations[0]['id'],
        'distance': weather_stations[0]['distance'],
        'is_primary': True
    })
```

---

## Story 2.2: Dashboard with Weather Alerts
**Points:** 5  
**Assignee:** Full Stack Developer  
**Depends on:** Story 2.0 Complete  

**Weather-Enabled Dashboard:**
```typescript
// apps/web/components/dashboard/weather-alerts.tsx
export function WeatherAlerts({ farmId }: { farmId: string }) {
  const { data, loading } = useQuery(GET_WEATHER_ALERTS, {
    variables: { farmId },
    pollInterval: 300000 // Refresh every 5 minutes
  });
  
  if (loading) return <Skeleton />;
  
  // Critical Phase 1a alerts
  const herbicideAlerts = data?.alerts?.filter(a => a.type === 'HERBICIDE_RESTRICTION');
  
  return (
    <AlertCard priority="critical">
      <h3>⚠️ Herbicide Carryover Alerts</h3>
      {herbicideAlerts?.map(alert => (
        <Alert key={alert.id} severity="warning">
          <AlertTitle>
            Field {alert.fieldName}: {alert.herbicide} Restriction Active
          </AlertTitle>
          <AlertDescription>
            Need {alert.precipitationNeeded}" more rain before planting {alert.crop}.
            Value at risk: ${alert.valueAtRisk}/acre
          </AlertDescription>
        </Alert>
      ))}
      
      {!herbicideAlerts?.length && (
        <Alert severity="success">
          All fields clear for planting - saving $10-15/acre in prevented mistakes
        </Alert>
      )}
    </AlertCard>
  );
}
```

---

## Story 2.3: Login with Weather Data Prefetch
**Points:** 5  
**Assignee:** Full Stack Developer  
**Depends on:** Story 2.0  

**Enhanced Login Flow:**
```typescript
async function onLoginSuccess(user: User) {
  // Previous login code...
  
  // NEW: Prefetch critical weather data for performance
  await Promise.all([
    prefetchWeatherData(user.farmId),
    prefetchHerbicideRestrictions(user.farmId),
    cacheAnalogYears(user.county)
  ]);
  
  // This ensures dashboard loads instantly with weather data
  router.push('/dashboard');
}
```

---

## Story 2.4: Offline Weather Cache
**Points:** 8  
**Assignee:** Mobile Developer  
**Depends on:** Story 2.0  

**Critical for Field Operations:**
```typescript
// apps/mobile/services/offline-weather.ts
class OfflineWeatherService {
  async syncWeatherData(farmId: string) {
    // Download last 120 days of weather (herbicide requirement)
    const weatherData = await api.getWeatherHistory(farmId, 120);
    
    // Store in SQLite for offline access
    await db.weatherCache.bulkInsert(weatherData);
    
    // Calculate and cache herbicide restrictions
    const restrictions = await this.calculateRestrictions(weatherData);
    await db.restrictionCache.insert(restrictions);
    
    console.log(`✅ Offline weather sync complete - Phase 1a value available offline`);
  }
}
```

---

## Story 2.5: Weather API Monitoring & Fallback
**Points:** 5  
**Assignee:** DevOps Engineer  
**Depends on:** Story 2.0  

**Service Reliability for Business Value:**
```yaml
# infrastructure/monitoring/weather-apis.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: weather-api-monitor
spec:
  endpoints:
    - interval: 60s
      path: /health/weather
      
  alerts:
    - name: WeatherAPIDown
      expr: up{job="weather-api"} == 0
      for: 5m
      annotations:
        summary: "Weather API unreachable - $10-15/acre value at risk"
        impact: "Herbicide carryover checking disabled"
        action: "Switch to fallback weather source"
```

**Fallback Implementation:**
```python
async def get_weather_with_fallback(field_id: str) -> Dict:
    """Never let weather API failure block value delivery"""
    
    try:
        # Primary: Real-time Mesonet
        return await mesonet_client.get_data(field_id)
    except Exception as e:
        logger.warning(f"Mesonet failed: {e}")
        
        try:
            # Fallback 1: Weather 20/20
            return await weather2020_client.get_data(field_id)
        except Exception as e2:
            logger.warning(f"Weather 20/20 failed: {e2}")
            
            # Fallback 2: Cached data with warning
            cached = await redis_client.get(f"weather:backup:{field_id}")
            if cached:
                cached['warning'] = 'Using cached data - may be up to 24 hours old'
                return cached
                
            # Fallback 3: County averages
            return await get_county_average_weather(field_id)
```

---
