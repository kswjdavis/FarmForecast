# Database Schema

## Neo4j Aura DB (Primary)

```cypher
// Core constraints
CREATE CONSTRAINT farm_id IF NOT EXISTS FOR (f:Farm) REQUIRE f.id IS UNIQUE;
CREATE CONSTRAINT field_id IF NOT EXISTS FOR (f:Field) REQUIRE f.id IS UNIQUE;

// Core relationships
(:Farm)-[:HAS_FIELD]->(:Field)
(:Field)-[:ADJACENT_TO {distance: Float}]->(:Field)
(:Field)-[:PLANTED {date: Date, population: Integer}]->(:Crop)
(:Treatment)-[:RESTRICTS {months: Integer}]->(:Crop)
```

## PostgreSQL (User Management)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cognito_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
