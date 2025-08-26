# Section 4: Technical Assumptions

## Repository Structure
**Monorepo with Graph-First Organization**

```
farmcalc/
├── frontend/          # React + D3.js/Force-Graph
├── backend/           # FastAPI + Neo4j Driver
├── graph-ml/          # GNN models, Neo4j GDS
├── optimization/      # Graph-based optimization
├── infrastructure/    # Neo4j cluster config
└── shared/           # Graph schemas, Cypher queries
```

## Service Architecture

**Graph-Centric Microservices with Neo4j Aura DB**

Primary Services:
- **Graph API Service** (FastAPI + Neo4j Aura): Primary interface for all graph operations via secure Bolt protocol
- **Graph ML Service** (PyTorch Geometric): GNN inference pulling data from Aura DB
- **Graph Analytics Service** (Neo4j GDS on Aura): PageRank, community detection, pathfinding (included in Aura Professional)
- **Traditional API Service** (FastAPI + PostgreSQL): User auth, transactions, non-graph data
- **Stream Processing** (Kafka → Neo4j Aura): Real-time relationship updates via Bolt driver
- **Query Cache Layer** (Redis): Cache expensive Cypher queries to reduce Aura API calls

## Data Architecture

**Neo4j Aura DB as Primary Database:**

**Aura DB Connection Configuration:**
```python
# Neo4j Aura connection details (stored in environment variables)
NEO4J_URI = "neo4j+s://<dbid>.databases.neo4j.io"  # Aura provides secure bolt protocol
NEO4J_USERNAME = "neo4j"  # Default username
NEO4J_PASSWORD = "<generated-password>"  # Strong password from Aura console
NEO4J_DATABASE = "neo4j"  # Default database name

# Connection pooling for optimal performance
MAX_CONNECTION_POOL_SIZE = 50
CONNECTION_ACQUISITION_TIMEOUT = 60
```

**Graph Data Model in Neo4j Aura:**

```cypher
// Core Node Types
(:Farm {id, name, location, size_acres})
(:Field {id, polygon, soil_type, current_moisture})
(:Crop {type, variety, water_needs})
(:Season {year, field_id, precipitation_total})
(:Treatment {type, date, amount, method})
(:WeatherEvent {date, type, severity})
(:Yield {bushels, quality, profit})
(:Research {study_id, findings, confidence})
(:Disease {type, severity, detected_date})

// Critical Relationships
(:Field)-[:ADJACENT_TO {distance}]->(:Field)
(:Field)-[:PLANTED {date, population}]->(:Crop)
(:Crop)-[:PRECEDED_BY {gap_months}]->(:Crop)
(:Field)-[:INFLUENCED_BY {strength}]->(:Field)
(:Disease)-[:SPREADS_TO {probability}]->(:Field)
(:Treatment)-[:CAUSES {effect_size}]->(:Outcome)
(:Research)-[:VALIDATES {confidence}]->(:Practice)
```

Supporting Databases:
- **PostgreSQL**: User management, financial transactions, audit logs
- **TimescaleDB**: High-frequency sensor streams
- **Redis**: Session management, graph query cache
- **S3**: Image storage, model artifacts

## Testing Requirements

**Full Testing Pyramid with Graph Validation**
- Unit tests including Cypher query validation
- Graph integrity tests (no orphan nodes, relationship consistency)
- Graph algorithm correctness tests
- GNN model performance tests

## Additional Technical Assumptions

**Graph-Specific Technology Stack:**

- **Neo4j Aura DB** (SELECTED PRIMARY DATABASE) - Fully managed cloud graph database
  - Professional tier for production (starting at $65/month)
  - Automatic backups, monitoring, and scaling
  - Multi-region deployment capability
  - Built-in high availability and disaster recovery
- **Neo4j Graph Data Science** library included with Aura Professional
- **PyTorch Geometric** for Graph Neural Networks
- **D3.js Force Graph** for frontend visualization
- **Cypher** as primary query language
- **GraphQL** federation across Neo4j Aura and PostgreSQL

**Neo4j Aura DB Configuration:**
- **Instance Size**: Starting with 8GB RAM, 2 vCPUs (scales automatically)
- **Region**: US-Central (closest to Kansas farms)
- **Backup**: Daily automated backups with 7-day retention
- **Monitoring**: Built-in metrics and query logging
- **Security**: TLS encryption, IP allowlisting, SSO integration ready

**Apple Silicon Optimization:**
- Neo4j Aura accessible via native ARM64 drivers
- Graph algorithms leverage Metal for parallel computation
- Core ML for GNN inference on Apple Neural Engine

**Deployment Architecture:**
1. **Primary**: Neo4j Aura DB (Production)
2. **Development**: Neo4j Aura Free tier for development/testing
3. **Integration**: Direct connection from FastAPI to Aura via official Python driver
4. **Caching**: Redis for frequently accessed graph queries

**Performance Targets:**
- 3-hop traversal: <100ms
- PageRank on 10K nodes: <2s
- GNN inference: <500ms
- Graph visualization: 60fps
