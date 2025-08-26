# Section 9: Next Steps

## UX Expert Prompt
To initiate UX design, use the following prompt:

```
/BMad:agents:ux-expert

Review the FarmCalc PRD focusing on Section 3 (UI Design Goals) and Section 6 (Epic Structure). 

Priority: Design the graph-first user experience that makes complex agricultural relationships intuitive. Start with wireframes for Epic 1 (Foundation) and Epic 6 (Visualization) stories.

Key challenges to address:
1. Interactive graph visualization of farms/fields
2. Temporal changes (rotation history/future)
3. What-if scenario exploration
4. Mobile-responsive design for field use
5. Uncertainty visualization in predictions
```

## Architect Prompt
To initiate technical architecture, use the following prompt:

```
/BMad:agents:architect

Review the FarmCalc PRD, Epic Structure (Section 6), and SDK Reference document.

Priority: Design the technical architecture for a Neo4j Aura DB-first platform with FastAPI backend and React frontend. Focus on Phase 1a implementation (Epics 1-2).

Key technical decisions needed:
1. Neo4j Aura DB configuration and schema design
2. Microservice vs monolith for initial MVP
3. Real-time data pipeline (Mesonet → Kafka → TimescaleDB → Neo4j)
4. ML model deployment strategy
5. Performance optimization for graph queries
```

## Development Team Kickoff
Once architecture is complete:
1. Review Epic 1 stories with development team
2. Set up Neo4j Aura DB instance
3. Configure development environment per SDK reference
4. Begin Sprint 1 with Stories 1.1-1.3
5. Establish CI/CD pipeline early

## Stakeholder Communication
1. Share PRD v3.0 with pilot farmers for feedback
2. Finalize K-State partnership agreement
3. Begin pilot farm recruitment (target: 5 farms)
4. Set up weekly progress reviews
5. Establish success metrics tracking

---

*End of Product Requirements Document v3.0*