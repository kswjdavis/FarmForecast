# FarmCalc Official SDK Reference
*Last Updated: August 20, 2025*
*For AI Coding Agents - Include these in every story implementation*

## Python SDKs (Backend Services)

### 1. Neo4j Aura DB
```bash
pip install neo4j==5.24.0
```
**Documentation**: https://neo4j.com/docs/python-manual/current/
**GitHub**: https://github.com/neo4j/neo4j-python-driver

```python
from neo4j import AsyncGraphDatabase
driver = AsyncGraphDatabase.driver(uri, auth=(user, password))
```

### 2. FastAPI & Server
```bash
pip install "fastapi[standard]==0.112.0"  # Includes uvicorn
# OR separately:
pip install fastapi==0.112.0
pip install "uvicorn[standard]==0.30.6"
pip install pydantic==2.8.2
```
**Documentation**: https://fastapi.tiangolo.com/
**GitHub**: https://github.com/tiangolo/fastapi

```python
from fastapi import FastAPI
app = FastAPI()
```

### 3. PostgreSQL
```bash
pip install psycopg[binary]==3.2.1  # PostgreSQL 16 compatible
pip install asyncpg==0.29.0  # Async driver
pip install sqlalchemy==2.0.32
```
**Documentation**: https://www.psycopg.org/docs/
**GitHub**: https://github.com/psycopg/psycopg

```python
import psycopg
conn = psycopg.connect("postgresql://user:pass@localhost/db")
```

### 4. TimescaleDB
```bash
pip install psycopg[binary]==3.2.1  # Uses PostgreSQL driver
pip install timescale-vector==0.0.4  # For vector operations
```
**Documentation**: https://docs.timescale.com/
**GitHub**: https://github.com/timescale/timescaledb

### 5. Redis
```bash
pip install redis==5.0.8
pip install redis[hiredis]==5.0.8  # With C parser for performance
```
**Documentation**: https://redis-py.readthedocs.io/
**GitHub**: https://github.com/redis/redis-py

```python
import redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)
```

### 6. Apache Kafka
```bash
pip install kafka-python==2.0.2
pip install confluent-kafka==2.5.0  # Alternative with better performance
```
**Documentation**: https://kafka-python.readthedocs.io/
**GitHub**: https://github.com/dpkp/kafka-python

```python
from kafka import KafkaProducer
producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
```

### 7. AWS SDK (Boto3)
```bash
pip install boto3==1.35.0
pip install boto3[crt]==1.35.0  # With AWS Common Runtime
```
**Documentation**: https://boto3.amazonaws.com/v1/documentation/api/latest/
**GitHub**: https://github.com/boto/boto3

```python
import boto3
s3 = boto3.client('s3')
lambda_client = boto3.client('lambda')
```

### 8. Machine Learning Frameworks

#### PyTorch & PyTorch Geometric
```bash
pip install torch==2.4.0
pip install torch-geometric==2.5.3
# Optional extensions for better performance:
pip install pyg_lib torch_scatter torch_sparse -f https://data.pyg.org/whl/torch-2.4.0+cu121.html
```
**Documentation**: 
- PyTorch: https://pytorch.org/docs/stable/
- PyG: https://pytorch-geometric.readthedocs.io/
**GitHub**: https://github.com/pyg-team/pytorch_geometric

```python
import torch
import torch_geometric
from torch_geometric.nn import GCNConv
```

#### XGBoost
```bash
pip install xgboost==2.1.0
```
**Documentation**: https://xgboost.readthedocs.io/
**GitHub**: https://github.com/dmlc/xgboost

```python
import xgboost as xgb
```

#### Scikit-learn
```bash
pip install scikit-learn==1.5.1
```
**Documentation**: https://scikit-learn.org/stable/
**GitHub**: https://github.com/scikit-learn/scikit-learn

```python
from sklearn.ensemble import RandomForestRegressor
```

### 9. MLOps Tools

#### MLflow
```bash
pip install mlflow==2.15.1
```
**Documentation**: https://mlflow.org/docs/latest/
**GitHub**: https://github.com/mlflow/mlflow

```python
import mlflow
mlflow.start_run()
```

#### DVC
```bash
pip install dvc==3.53.2
pip install dvc[s3]==3.53.2  # With S3 support
```
**Documentation**: https://dvc.org/doc
**GitHub**: https://github.com/iterative/dvc

#### Feast Feature Store
```bash
pip install feast==0.40.0
pip install feast[aws]==0.40.0  # With AWS support
```
**Documentation**: https://docs.feast.dev/
**GitHub**: https://github.com/feast-dev/feast

### 10. Data Validation
```bash
pip install great-expectations==0.18.19
```
**Documentation**: https://docs.greatexpectations.io/
**GitHub**: https://github.com/great-expectations/great_expectations

```python
import great_expectations as gx
```

### 11. Agricultural APIs & Data Access

#### Kansas Mesonet (REST API - No SDK)
```bash
pip install httpx==0.27.0  # For async HTTP requests
pip install pandas==2.2.2  # For CSV processing
```
**API Base**: https://mesonet.k-state.edu/rest/
**Documentation**: https://mesonet.k-state.edu/rest/

```python
import httpx
async with httpx.AsyncClient() as client:
    response = await client.get('https://mesonet.k-state.edu/rest/stationnames/')
```

#### Weather2020 (Custom Integration)
```bash
pip install httpx==0.27.0
```
**API Documentation**: https://docs.weather2020.com/
**Note**: Requires API key

```python
headers = {'X-API-Key': 'your-api-key'}
response = httpx.get('https://api.weather2020.com/v2/forecast', headers=headers)
```

#### Sentinel-2/Agromonitoring
```bash
pip install httpx==0.27.0
pip install rasterio==1.3.10  # For GeoTIFF processing
pip install numpy==1.26.4
```
**Documentation**: https://agromonitoring.com/api
**Note**: Requires API key

### 12. Computer Vision
```bash
pip install ultralytics==8.2.0  # YOLOv8
pip install opencv-python==4.10.0.84
pip install pillow==10.4.0
```
**YOLOv8 Docs**: https://docs.ultralytics.com/
**OpenCV Docs**: https://docs.opencv.org/4.10.0/

```python
from ultralytics import YOLO
model = YOLO('yolov8n.pt')
```

### 13. Authentication & Security
```bash
pip install pyjwt==2.9.0
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4
pip install python-multipart==0.0.9  # For OAuth2 forms
pip install cryptography==43.0.0
```
**JWT Docs**: https://pyjwt.readthedocs.io/
**Passlib Docs**: https://passlib.readthedocs.io/

```python
import jwt
from passlib.context import CryptContext
```

### 14. GraphQL
```bash
pip install strawberry-graphql[fastapi]==0.237.0
pip install graphene==3.3.0  # Alternative
```
**Strawberry Docs**: https://strawberry.rocks/
**GitHub**: https://github.com/strawberry-graphql/strawberry

```python
import strawberry
from strawberry.fastapi import GraphQLRouter
```

### 15. Testing Frameworks
```bash
pip install pytest==8.3.2
pip install pytest-asyncio==0.23.8
pip install httpx==0.27.0  # For API testing
pip install factory-boy==3.3.1  # Test data generation
pip install faker==26.3.0  # Fake data
```
**Pytest Docs**: https://docs.pytest.org/
**GitHub**: https://github.com/pytest-dev/pytest

## JavaScript/TypeScript SDKs (Frontend)

### 1. React & Next.js
```bash
npm install react@18.3.1 react-dom@18.3.1
npm install next@14.2.5
npm install -D @types/react@18.3.3 @types/react-dom@18.3.0
```
**React Docs**: https://react.dev/
**Next.js Docs**: https://nextjs.org/docs

### 2. Neo4j JavaScript Driver
```bash
npm install neo4j-driver@5.24.0
```
**Documentation**: https://neo4j.com/docs/javascript-manual/current/
**GitHub**: https://github.com/neo4j/neo4j-javascript-driver

```javascript
import neo4j from 'neo4j-driver'
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
```

### 3. Graph Visualization
```bash
npm install react-force-graph@1.43.0
npm install d3@7.9.0
npm install @types/d3@7.4.3
```
**Force Graph Docs**: https://github.com/vasturiano/react-force-graph
**D3 Docs**: https://d3js.org/

```javascript
import ForceGraph3D from 'react-force-graph-3d'
```

### 4. GraphQL Client
```bash
npm install @apollo/client@3.11.4 graphql@16.9.0
npm install urql@4.1.0  # Alternative lightweight client
```
**Apollo Docs**: https://www.apollographql.com/docs/react/
**GitHub**: https://github.com/apollographql/apollo-client

```javascript
import { ApolloClient, InMemoryCache } from '@apollo/client'
```

### 5. Map & Geospatial
```bash
npm install leaflet@1.9.4 react-leaflet@4.2.1
npm install mapbox-gl@3.5.2 react-map-gl@7.1.7
npm install @turf/turf@7.0.0  # Geospatial analysis
```
**Leaflet Docs**: https://leafletjs.com/
**Mapbox Docs**: https://docs.mapbox.com/

### 6. State Management
```bash
npm install zustand@4.5.5  # Lightweight state management
npm install @reduxjs/toolkit@2.2.7  # Alternative with Redux
npm install jotai@2.9.1  # Atomic state management
```
**Zustand Docs**: https://github.com/pmndrs/zustand
**Redux Toolkit Docs**: https://redux-toolkit.js.org/

### 7. UI Components
```bash
npm install @mui/material@5.16.7 @emotion/react@11.13.0
npm install @radix-ui/themes@3.1.3  # Alternative
npm install tailwindcss@3.4.9  # Utility CSS
```
**MUI Docs**: https://mui.com/
**Radix Docs**: https://www.radix-ui.com/

### 8. Form Handling
```bash
npm install react-hook-form@7.52.2
npm install zod@3.23.8  # Schema validation
npm install yup@1.4.0  # Alternative validation
```
**React Hook Form Docs**: https://react-hook-form.com/
**Zod Docs**: https://zod.dev/

### 9. HTTP Client
```bash
npm install axios@1.7.4
npm install ky@1.5.0  # Modern alternative
npm install swr@2.2.5  # Data fetching with caching
```
**Axios Docs**: https://axios-http.com/
**SWR Docs**: https://swr.vercel.app/

### 10. Testing
```bash
npm install -D jest@29.7.0 @testing-library/react@16.0.0
npm install -D cypress@13.13.2  # E2E testing
npm install -D playwright@1.46.0  # Alternative E2E
```
**Jest Docs**: https://jestjs.io/
**Cypress Docs**: https://docs.cypress.io/

## Environment Setup

### Python Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Node.js Setup
```bash
node --version  # Ensure Node.js 20.x or 22.x
npm install
npm run dev
```

### Docker Development Environment
```dockerfile
# Python Service
FROM python:3.12.5-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Node.js Service
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

## Critical Version Compatibility Matrix

| Service | Python Version | Node Version | Notes |
|---------|---------------|--------------|-------|
| Neo4j Driver | 3.8+ | 18.x+ | Driver 5.x supports Neo4j 4.4+ |
| FastAPI | 3.8+ | N/A | Requires Pydantic 2.x |
| PyTorch | 3.9+ | N/A | CUDA 12.1 recommended |
| React | N/A | 18.x+ | React 18.3 stable |
| Next.js | N/A | 18.17+ | App Router default |

## Required Environment Variables
```bash
# Create .env file with these variables
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<password>
DATABASE_URL=postgresql://user:pass@localhost:5432/farmcalc
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1
MESONET_BASE_URL=https://mesonet.k-state.edu/rest/
WEATHER2020_API_KEY=<key>
AGRO_API_KEY=<key>
JWT_SECRET=<secret>
```

## Pre-Story Checklist for AI Agents

Before implementing any story, ensure:
1. [ ] All required SDKs from this list are installed
2. [ ] Environment variables are configured
3. [ ] Neo4j Aura connection is tested
4. [ ] API keys are valid and working
5. [ ] Python version is 3.12.x
6. [ ] Node.js version is 20.x or 22.x
7. [ ] Docker is installed for containerization
8. [ ] Git is configured for version control

## SDK Update Policy
- Check for updates monthly (last Friday)
- Security patches: Apply immediately
- Major versions: Test in staging first
- Document any version changes in CHANGELOG.md