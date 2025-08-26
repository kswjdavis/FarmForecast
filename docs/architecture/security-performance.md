# Security & Performance

## Security Requirements
- **CSP Headers:** Strict content security policy
- **Input Validation:** Pydantic + Zod schemas
- **Rate Limiting:** 100 req/min per IP
- **Token Management:** 15-min access, 7-day refresh

## Performance Targets
- **Bundle Size:** <200KB initial JS
- **Response Time:** p95 <500ms
- **Database:** Connection pooling, query caching
- **CDN:** CloudFront with 1-year cache for static assets
