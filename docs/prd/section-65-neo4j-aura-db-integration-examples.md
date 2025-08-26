# Section 6.5: Neo4j Aura DB Integration Examples

## EXAMPLE: Epic 1 Story - Neo4j Aura DB Setup and Connection

**Story:** As a developer, I need to establish secure connection to Neo4j Aura DB so that the application can store and query the agricultural knowledge graph.

**Acceptance Criteria:**

1. ✅ **Neo4j Aura Professional instance provisioned**
   - Instance created in US-Central region (closest to Kansas)
   - 8GB RAM, 2 vCPUs initial configuration
   - Auto-scaling enabled with max 32GB RAM limit
   - GDS library enabled for graph algorithms

2. ✅ **Secure connection established from FastAPI backend**
   ```python
   from neo4j import GraphDatabase
   import os
   
   class AuraConnection:
       def __init__(self):
           self.uri = os.environ['NEO4J_URI']  # neo4j+s://xxxx.databases.neo4j.io
           self.user = os.environ['NEO4J_USERNAME']
           self.password = os.environ['NEO4J_PASSWORD']
           self.driver = GraphDatabase.driver(
               self.uri, 
               auth=(self.user, self.password),
               max_connection_pool_size=50
           )
   ```

3. ✅ **Connection health check endpoint**
   - GET /api/health/neo4j returns Aura connection status
   - Includes node count, relationship count, response time
   - Alerts if connection pool < 20% available

4. ✅ **Initial graph schema created**
   ```cypher
   // Run these constraints on Aura after connection
   CREATE CONSTRAINT farm_id IF NOT EXISTS FOR (f:Farm) REQUIRE f.id IS UNIQUE;
   CREATE CONSTRAINT field_id IF NOT EXISTS FOR (f:Field) REQUIRE f.id IS UNIQUE;
   CREATE INDEX field_location IF NOT EXISTS FOR (f:Field) ON (f.location);
   ```

5. ❌ **PROHIBITED:**
   - Using Neo4j Desktop or local instance for production
   - Hardcoding connection credentials in code
   - Bypassing Aura's built-in security features
   - Using community edition features not in Aura
