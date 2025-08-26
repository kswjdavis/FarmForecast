# Section 7: Epic Details

## Epic Implementation Reference

The detailed epic definitions with user stories, acceptance criteria, and implementation requirements are maintained in the epics directory to follow BMad method's single source of truth principle.

### Phase 1a Epics (Weeks 1-8)

1. **[Epic 1: Foundation & Infrastructure](../epics/epic-1-foundation.md)**
   - Sprint 1-2 (2 weeks)
   - **⚠️ CRITICAL:** Story 1.0 (External Service Prerequisites) MUST be completed first
   - Establishes Neo4j Aura DB, AWS infrastructure, credential management

2. **[Epic 2: Authentication & Weather Integration](../epics/epic-2-authentication.md)**  
   - Sprint 2-3 (2 weeks)
   - Includes weather API integration (critical for Phase 1a value delivery)
   - Enables herbicide carryover checking ($10-15/acre value)

3. **[Epic 3: Field Management](../epics/epic-3-field-management.md)**
   - Sprint 4-5 (2 weeks)
   - Core field CRUD operations and boundary management
   - Field relationships and adjacency tracking

4. **[Epic 4: Crop Planning](../epics/epic-4-crop-planning.md)**
   - Sprint 6-7 (2 weeks)  
   - Rotation planning with herbicide restriction checking
   - Safety-critical constraint validation

### Phase 1b Epics (Weeks 9-16)

5. **[Epic 5: Network Intelligence](../epics/epic-5-network-intelligence.md)**
   - Sprint 8-10 (3 weeks)
   - Farmer similarity networks and collaborative insights
   - Strip trial framework

6. **[Epic 6: Advanced Visualization](../epics/epic-6-visualization.md)**
   - Sprint 11-12 (2 weeks)
   - Interactive graph exploration
   - Temporal animations and influence flows

## Critical Implementation Notes

1. **Story 1.0 is BLOCKING** - No development can begin until external services are configured
2. **Weather integration in Epic 2** - Required for Phase 1a value proposition
3. **Each epic has detailed stories** - See individual epic files and their story folders
4. **Gate checks are mandatory** - Verification scripts must pass before proceeding

## Story Details

For detailed user stories, acceptance criteria, and implementation specifications, refer to:
- `/docs/epics/epic-{n}-stories/` folders
- Each epic file contains links to its story details
- Stories include verification gates and dependency checks

---

*Note: This section provides references per BMad method. Actual epic and story details are maintained in their authoritative locations to prevent duplication and ensure single source of truth.*