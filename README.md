# aws-serverless-deploy

This repository contains a minimal URL shortener implemented as AWS Lambda functions using the Serverless Framework, with automated testing via GitHub Actions.

Features
- POST /shorten — create a short id for a URL
- GET /{id} — redirect to original URL

Files added
- `serverless.yml` — Serverless service definition (DynamoDB table + functions)
- `src/handler.js` — Lambda handlers
- `src/storage.js` — storage adapter (DynamoDB in prod, in-memory for tests)
- `tests/handler.test.js` — Jest tests
- `.github/workflows/ci.yml` — CI to run tests
- `.github/workflows/deploy.yml` — deploy to AWS on push to main (requires repo secrets)

Quick start (local development)

1. Install dependencies:

```bash
npm ci
```

2. Run tests:

```bash
npm test
```

3. Run locally with serverless-offline:

```bash
npx serverless offline
```

Deployment

Create the following repository secrets for GitHub Actions: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`. Push to `main` to trigger the deploy workflow.

Notes
- The storage adapter uses an in-memory Map while `NODE_ENV=test` or if `TABLE_NAME` env var is not set. In production, Serverless will create a DynamoDB table and the function will use it.
