# Acceptance Criteria with Weather Gates

```typescript
describe('Epic 2 Acceptance', () => {
  it('MUST have weather APIs integrated', async () => {
    const weather = await testWeatherIntegration();
    expect(weather.mesonet).toBe('connected');
    expect(weather.weather2020).toBe('connected');
    expect(weather.historicalData).toBe('available');
  });
  
  it('MUST calculate herbicide restrictions', async () => {
    const restriction = await calculateRestriction('field-1', 'Atrazine');
    expect(restriction).toHaveProperty('safe_to_plant');
    expect(restriction).toHaveProperty('value_protected_per_acre');
  });
  
  it('MUST deliver Phase 1a value', async () => {
    const value = await calculatePhase1aValue();
    expect(value.perAcre).toBeGreaterThanOrEqual(10);
    expect(value.perAcre).toBeLessThanOrEqual(15);
  });
});
```

---
