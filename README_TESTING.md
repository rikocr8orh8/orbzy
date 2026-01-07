# Quick Testing Guide

## Run Tests

```bash
# Unit tests (watch mode)
npm test

# Unit tests (CI - one run)
npm run test:ci

# E2E tests (all browsers)
npm run test:e2e

# E2E tests (with UI)
npm run test:e2e:ui

# Lint code
npm run lint

# Run everything
npm run test:all
```

## What's Tested

✅ User signup/login  
✅ Email verification  
✅ Task creation  
✅ Provider booking  
✅ 24hr escalation logic  

## Browsers Tested

✅ Chrome  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile (Chrome & Safari)  

## Manual Testing

See [TESTING.md](TESTING.md) for complete checklist.

Quick smoke test:
1. Sign up → verify email → login
2. Create task (select category)
3. Book provider (matching category appears first)
4. Verify booking confirmation

## CI/CD

GitHub Actions runs automatically on push:
- Lint → Unit Tests → E2E Tests → Build → Deploy

## Files

- `jest.config.js` - Jest config
- `playwright.config.ts` - Playwright config  
- `.eslintrc.json` - ESLint rules
- `src/__tests__/` - Unit tests
- `tests/e2e/` - E2E tests
- `.github/workflows/ci.yml` - CI/CD pipeline

See [TEST_SUMMARY.md](TEST_SUMMARY.md) for full details.
