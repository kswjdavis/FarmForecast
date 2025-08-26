# Enforcement Mechanisms

## 1. Package.json Scripts
```json
{
  "scripts": {
    "predev": "npm run verify:credentials",
    "dev": "npm run _dev",
    "pretest": "npm run verify:credentials",
    "test": "npm run _test",
    "prebuild": "npm run verify:credentials",
    "build": "npm run _build",
    "verify:credentials": "node scripts/verify-credentials.js",
    "setup:credentials": "node scripts/setup-credentials.js"
  }
}
```

## 2. Git Hooks
```bash
# .husky/pre-commit
#!/bin/sh
npm run verify:credentials || {
  echo "❌ Cannot commit without verified credentials"
  exit 1
}
```

## 3. CI/CD Gates
Every GitHub Action job starts with credential verification, preventing any builds or deployments without proper setup.

---
