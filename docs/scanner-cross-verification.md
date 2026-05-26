# Scanner Cross-Verification Pipeline

## Runtime Requirements

- `DATABASE_URL`: PostgreSQL connection string for `verification_events`.
- `SCANNER_TOKEN`: bearer token trusted scanner clients must send.
- `SCANNER_SIGNING_SECRET`: HMAC secret used for production scanner request signing.
- `REDIS_URL`: optional locally, required for production queue-backed cross-verification.
- `CROSS_VERIFICATION_WORKER_CONCURRENCY`: optional worker concurrency, defaults to `5`.

## Scanner Request Signing

Scanner clients POST raw JSON to `/api/verification-ingest` with:

- `Authorization: Bearer <SCANNER_TOKEN>`
- `x-dectra-timestamp: <ISO timestamp>`
- `x-dectra-nonce: <unique request nonce>`
- `x-dectra-signature: <hex hmac>`

The signature is:

```text
HMAC_SHA256(SCANNER_SIGNING_SECRET, `${timestamp}.${nonce}.${rawBody}`)
```

Production rejects missing signatures, stale timestamps, and replayed timestamp/nonce pairs.

## Payload Shape

```json
{
  "event_id": "scanner-event-001",
  "document_type": "PAN",
  "document_id": "ABCDE1234F",
  "user_name": "Applicant Name",
  "confidence": 0.91,
  "image_url": "https://storage.example/document.jpg",
  "source_app": "dectra-scanner",
  "scanner_version": "1.0.0",
  "timestamp": "2026-05-24T10:00:00.000Z"
}
```

## Worker

When `REDIS_URL` is present, start the queue worker separately:

```bash
npm run verification:worker
```

Without `REDIS_URL`, local development uses an inline async fallback so the dashboard still updates after scans.

## Admin Dashboard

The dashboard reads `/api/admin/verifications` every 10 seconds and supports filters for status, document type, source, and risk. Admin detail views only expose masked identifiers, provider source, reason codes, action status, and the tamper-evident audit chain.
