# FarmCalc Database Schema Design & Migration Strategy

## Overview

FarmCalc uses a polyglot persistence approach with Neo4j as the primary graph database for agricultural relationships, PostgreSQL for transactional data, TimescaleDB for time-series data, and Redis for caching.

## Neo4j Graph Schema

### Node Types

```cypher
// Core Agricultural Entities
(:Farm {
  id: String!,           // UUID
  name: String!,
  owner_id: String!,     // PostgreSQL User ID
  total_acres: Float!,
  county: String!,
  state: String!,
  created_at: DateTime!,
  coordinates: Point!    // Spatial data
})

(:Field {
  id: String!,           // UUID
  farm_id: String!,
  name: String!,
  acres: Float!,
  soil_type: String!,
  organic_matter: Float,
  ph: Float,
  boundary: [Point]!,    // Polygon boundary
  elevation: Float,
  slope: Float,
  aspect: String
})

(:Crop {
  id: String!,
  type: String!,         // wheat, corn, sorghum, fallow
  variety: String,
  maturity_days: Integer,
  plant_date: Date!,
  harvest_date: Date,
  yield_actual: Float,
  yield_predicted: Float
})

(:Season {
  id: String!,
  year: Integer!,
  type: String!          // growing, planting, harvest
  start_date: Date!,
  end_date: Date!
})

(:Treatment {
  id: String!,
  type: String!,         // herbicide, fertilizer, pesticide
  product: String!,
  rate: Float!,
  unit: String!,
  date: Date!,
  cost: Float!,
  restrictions: [String] // Plant-back restrictions
})

(:WeatherEvent {
  id: String!,
  type: String!,         // rain, hail, drought, freeze
  date: Date!,
  severity: Float!,
  impact_radius: Float!,
  center: Point!
})

(:Farmer {
  id: String!,
  user_id: String!,      // Links to PostgreSQL
  experience_years: Integer,
  primary_crops: [String],
  equipment: [String]
})
```

### Relationships

```cypher
// Ownership and Management
(:Farmer)-[:OPERATES]->(:Farm)
(:Farm)-[:OWNS]->(:Field)
(:Farm)-[:PARTICIPATED_IN]->(:Season)

// Crop Production
(:Field)-[:PLANTED_WITH {
  plant_date: Date!,
  seed_rate: Float!,
  row_spacing: Float!
}]->(:Crop)

(:Crop)-[:GROWN_IN]->(:Season)
(:Crop)-[:YIELDED {
  bushels: Float!,
  moisture: Float!,
  test_weight: Float!
}]->(:Harvest)

// Treatments and Inputs
(:Field)-[:RECEIVED {
  date: Date!,
  amount: Float!,
  cost: Float!
}]->(:Treatment)

(:Treatment)-[:RESTRICTS {
  months: Integer!,
  crops: [String]!
}]->(:Crop)

// Spatial Relationships
(:Field)-[:ADJACENT_TO {
  boundary_length: Float!,
  direction: String!
}]->(:Field)

(:Field)-[:WITHIN_RADIUS {
  distance: Float!,
  unit: String!
}]->(:WeatherEvent)

// Knowledge Network
(:Farmer)-[:SIMILAR_TO {
  similarity_score: Float!,
  common_practices: [String]
}]->(:Farmer)

(:Crop)-[:ROTATED_AFTER {
  yield_impact: Float!,
  disease_pressure: Float!
}]->(:Crop)
```

## PostgreSQL Schema

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  cognito_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  metadata JSONB
);

-- Subscriptions and Billing
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_type VARCHAR(50) NOT NULL, -- 'basic', 'pro', 'enterprise'
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  features JSONB
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys for External Services
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service VARCHAR(50) NOT NULL, -- 'weather2020', 'sentinel'
  encrypted_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_policy ON users
  USING (id = current_setting('app.current_user_id')::UUID);

CREATE POLICY subscriptions_policy ON subscriptions
  USING (user_id = current_setting('app.current_user_id')::UUID);
```

## TimescaleDB Schema

```sql
-- Weather time series
CREATE TABLE weather_observations (
  time TIMESTAMPTZ NOT NULL,
  field_id UUID NOT NULL,
  temperature DECIMAL(5,2),
  precipitation DECIMAL(5,2),
  humidity DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  solar_radiation DECIMAL(7,2),
  et DECIMAL(5,2),
  source VARCHAR(50) -- 'mesonet', 'weather2020', 'interpolated'
);

SELECT create_hypertable('weather_observations', 'time');
CREATE INDEX idx_weather_field_time ON weather_observations (field_id, time DESC);

-- Soil moisture monitoring
CREATE TABLE soil_moisture (
  time TIMESTAMPTZ NOT NULL,
  field_id UUID NOT NULL,
  depth_cm INTEGER NOT NULL,
  moisture_percent DECIMAL(5,2),
  temperature DECIMAL(5,2),
  sensor_id VARCHAR(100)
);

SELECT create_hypertable('soil_moisture', 'time');

-- Continuous aggregates for performance
CREATE MATERIALIZED VIEW daily_weather_summary
WITH (timescaledb.continuous) AS
SELECT 
  time_bucket('1 day', time) AS day,
  field_id,
  AVG(temperature) as avg_temp,
  SUM(precipitation) as total_precip,
  AVG(humidity) as avg_humidity,
  MAX(wind_speed) as max_wind,
  SUM(et) as total_et
FROM weather_observations
GROUP BY day, field_id;

SELECT add_continuous_aggregate_policy('daily_weather_summary',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
```

## Migration Strategy

### Version Control

```yaml
# migrations/config.yml
databases:
  neo4j:
    versioning_tool: liquibase-neo4j
    migration_path: migrations/neo4j
    
  postgresql:
    versioning_tool: flyway
    migration_path: migrations/postgresql
    
  timescaledb:
    versioning_tool: flyway
    migration_path: migrations/timescaledb
```

### Neo4j Migrations

```cypher
-- migrations/neo4j/001_initial_schema.cypher
-- Changeset: 001
-- Author: system
-- Date: 2025-08-21

// Create constraints
CREATE CONSTRAINT farm_id IF NOT EXISTS ON (f:Farm) ASSERT f.id IS UNIQUE;
CREATE CONSTRAINT field_id IF NOT EXISTS ON (f:Field) ASSERT f.id IS UNIQUE;

// Create indexes
CREATE INDEX farm_owner IF NOT EXISTS FOR (f:Farm) ON (f.owner_id);
CREATE INDEX field_farm IF NOT EXISTS FOR (f:Field) ON (f.farm_id);

-- migrations/neo4j/002_add_treatments.cypher
-- Changeset: 002
-- Author: system
-- Date: 2025-08-22

CREATE CONSTRAINT treatment_id IF NOT EXISTS ON (t:Treatment) ASSERT t.id IS UNIQUE;
```

### PostgreSQL Migrations

```sql
-- migrations/postgresql/V001__initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- migrations/postgresql/V002__add_audit_log.sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Rollback Procedures

```bash
#!/bin/bash
# scripts/rollback.sh

echo "Starting database rollback..."

# Neo4j rollback
echo "Rolling back Neo4j to version $1..."
docker run --rm \
  -v $(pwd)/migrations/neo4j:/liquibase/changelog \
  liquibase/liquibase-neo4j \
  --url="bolt://localhost:7687" \
  --username=neo4j \
  --password=$NEO4J_PASSWORD \
  rollback --tag=$1

# PostgreSQL rollback
echo "Rolling back PostgreSQL to version $1..."
flyway -url=jdbc:postgresql://localhost:5432/farmcalc \
  -user=postgres \
  -password=$POSTGRES_PASSWORD \
  -locations=filesystem:./migrations/postgresql \
  undo -target=$1

echo "Rollback complete"
```

### Data Seeding

```python
# scripts/seed_data.py
import asyncio
from neo4j import AsyncGraphDatabase
import asyncpg

async def seed_neo4j():
    """Seed Neo4j with sample data"""
    driver = AsyncGraphDatabase.driver(
        "bolt://localhost:7687",
        auth=("neo4j", "password")
    )
    
    async with driver.session() as session:
        # Create sample farm
        await session.run("""
            CREATE (farm:Farm {
                id: randomUUID(),
                name: 'Demo Farm',
                total_acres: 3000,
                county: 'Hamilton',
                state: 'KS'
            })
        """)
        
        # Create fields with adjacency
        await session.run("""
            MATCH (farm:Farm {name: 'Demo Farm'})
            CREATE (f1:Field {
                id: randomUUID(),
                name: 'North 40',
                acres: 40,
                soil_type: 'Sandy Loam'
            })<-[:OWNS]-(farm)
            CREATE (f2:Field {
                id: randomUUID(),
                name: 'South 40',
                acres: 40,
                soil_type: 'Clay Loam'
            })<-[:OWNS]-(farm)
            CREATE (f1)-[:ADJACENT_TO]->(f2)
        """)

async def seed_postgresql():
    """Seed PostgreSQL with sample data"""
    conn = await asyncpg.connect(
        'postgresql://postgres:password@localhost/farmcalc'
    )
    
    await conn.execute("""
        INSERT INTO users (email, cognito_id)
        VALUES ('demo@farmcalc.com', 'cognito-demo-id')
    """)
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_neo4j())
    asyncio.run(seed_postgresql())
```

## Backup Strategy

```yaml
# backup/config.yml
backup:
  schedule: "0 2 * * *"  # 2 AM daily
  retention_days: 30
  
  neo4j:
    method: aura_backup_api
    destination: s3://farmcalc-backups/neo4j/
    
  postgresql:
    method: pg_dump
    destination: s3://farmcalc-backups/postgresql/
    compression: gzip
    
  monitoring:
    alert_on_failure: true
    slack_webhook: ${SLACK_WEBHOOK_URL}
```

## Performance Optimization

### Neo4j Indexes

```cypher
// Composite indexes for common queries
CREATE INDEX field_farm_season IF NOT EXISTS 
FOR (f:Field) ON (f.farm_id, f.season_id);

CREATE INDEX crop_type_year IF NOT EXISTS 
FOR (c:Crop) ON (c.type, c.year);

// Full-text search
CALL db.index.fulltext.createNodeIndex(
  "fieldSearch",
  ["Field"],
  ["name", "notes"]
);
```

### PostgreSQL Optimization

```sql
-- Partial indexes for common queries
CREATE INDEX idx_active_users ON users(email) 
WHERE status = 'active';

-- BRIN indexes for time-series
CREATE INDEX idx_audit_created_brin ON audit_log 
USING BRIN(created_at);
```