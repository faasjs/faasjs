# Test Matrix

Use this checklist when improving existing unit tests.

## Minimum coverage matrix

1. Happy path
   - Valid input returns expected `statusCode` and `data`.
2. Input validation
   - Invalid or missing params return stable validation error output.
3. Business error
   - Domain failure path returns expected message/code.
4. Plugin side effects
   - Verify cookie/session/database side effects when relevant.
5. Transport details
   - Assert key headers/content behavior only when business-critical.

## Shared-first refactor checklist

- Remove duplicated mocks into `shared/mocks.ts`.
- Remove duplicated `beforeEach/afterEach` into `shared/lifecycle.ts`.
- Remove duplicated `JSONhandler` setup into `shared/call.ts`.
- Keep each test focused on one behavior.

## Run strategy

Run incrementally for quick feedback, then full verification:

```bash
# target file or pattern first
mise exec -- npm run test -- path/to/file.test.ts

# full unit suite
mise exec -- npm run test

# ci mode with coverage
mise exec -- npm run ci
```
