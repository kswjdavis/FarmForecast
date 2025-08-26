# High Level Architecture

## Technical Summary

FarmCalc employs a graph-centric serverless architecture with Neo4j Aura DB as the primary database, React/Next.js for the frontend, and FastAPI for backend services. The platform integrates frontend and backend through GraphQL federation and real-time WebSocket connections for graph updates. Infrastructure leverages AWS Lambda for compute, S3 for storage, Kafka for event streaming, and CloudFront for global content delivery. This architecture directly supports the PRD's goal of modeling agriculture as an interconnected system, enabling network effects and collaborative intelligence through graph algorithms while maintaining <100ms query response times for 3-hop traversals.

## Platform and Infrastructure Choice

**Platform:** AWS Full Stack  
**Key Services:** Lambda, API Gateway, S3, CloudFront, SageMaker, MSK (Kafka), Secrets Manager  
**Deployment Regions:** us-west-2 (primary), us-central-1 (DR)

## Repository Structure

**Structure:** Monorepo using Turborepo  
**Monorepo Tool:** Turborepo (optimal for Next.js + FastAPI)  
**Package Organization:** Apps (web, api, ml-service), Packages (shared, ui, graph-sdk), Infrastructure (CDK)

## High Level Architecture Diagram

```mermaid
graph TB
    subgraph "User Layer"
        WEB[Web Browser]
        PWA[Progressive Web App]
    end
    
    subgraph "CDN & Edge"
        CF[CloudFront CDN]
        EF[Edge Functions]
    end
    
    subgraph "Frontend - Vercel/AWS"
        NEXT[Next.js App<br/>React + TypeScript]
        WS[WebSocket Client]
    end
    
    subgraph "API Gateway"
        APIG[AWS API Gateway]
        GQL[GraphQL Federation]
    end
    
    subgraph "Backend Services - Lambda"
        FAST[FastAPI Service<br/>Core Business Logic]
        ML[ML Service<br/>PyTorch + GNNs]
        STREAM[Stream Processor<br/>Kafka Consumer]
    end
    
    subgraph "Data Layer"
        NEO4J[Neo4j Aura DB<br/>Graph Database]
        PG[PostgreSQL<br/>User & Transactions]
        TS[TimescaleDB<br/>Time Series]
        REDIS[Redis<br/>Cache & Sessions]
    end
    
    subgraph "External Services"
        MESO[Kansas Mesonet API]
        W20[Weather 20/20<br/>Manual Entry]
        KAFKA[AWS MSK<br/>Event Streaming]
    end

    WEB --> CF
    CF --> NEXT
    NEXT --> APIG
    APIG --> GQL
    GQL --> FAST
    FAST --> NEO4J
    MESO --> KAFKA
    KAFKA --> STREAM
    STREAM --> NEO4J
```

## Architectural Patterns
