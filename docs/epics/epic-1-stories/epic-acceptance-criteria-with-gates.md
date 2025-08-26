# Epic Acceptance Criteria with Gates

```typescript
// epic-1-acceptance.test.ts
describe('Epic 1 Acceptance', () => {
  it('MUST have all external services configured', async () => {
    const services = await verifyAllExternalServices();
    expect(services.neo4j).toBe('connected');
    expect(services.aws).toBe('authenticated');
    expect(services.weather).toBe('api_key_valid');
  });
  
  it('MUST have secure credential management', async () => {
    const vault = await testCredentialVault();
    expect(vault.encrypted).toBe(true);
    expect(vault.accessible).toBe(true);
    expect(vault.git_ignored).toBe(true);
  });
  
  it('MUST prevent development without credentials', async () => {
    // Simulate missing credentials
    delete process.env.NEO4J_URI;
    
    // Verify development is blocked
    await expect(runDevelopmentServer()).rejects.toThrow(
      'BLOCKED: Missing required credentials'
    );
  });
});
```

---
