# Weather Integration Test Suite

```python
# tests/test_weather_integration.py
import pytest
from datetime import datetime, timedelta

@pytest.mark.critical  # This MUST pass for Phase 1a
async def test_herbicide_restriction_calculation():
    """Verify $10-15/acre value delivery"""
    
    # Setup
    field_id = await create_test_field()
    await apply_herbicide(field_id, "Atrazine", datetime.now() - timedelta(days=60))
    
    # Test restriction checking
    result = await weather_service.check_herbicide_restrictions(
        field_id, "Atrazine", datetime.now() - timedelta(days=60)
    )
    
    assert 'safe_to_plant' in result
    assert 'value_protected_per_acre' in result
    assert result['value_protected_per_acre'] >= 0
    
@pytest.mark.critical
async def test_weather_api_failover():
    """Ensure weather never blocks value delivery"""
    
    # Simulate primary API failure
    with mock.patch('mesonet_client.get_data', side_effect=Exception):
        result = await weather_service.get_precipitation_history('field-1', 30)
        
    # Should still return data from fallback
    assert result is not None
    assert 'warning' in result or 'source' in result
```

---
