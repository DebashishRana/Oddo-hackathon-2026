# Dectra Transactional Email Verification

Production-grade Node.js service for OTP email verification, async delivery, security logging, and future migration from Resend to Postal or another provider.

## Architecture

- Express API exposes `/auth/send-otp`, `/auth/resend-otp`, and `/auth/verify-otp`.
- Redis stores hashed OTP records, resend cooldowns, failed attempts, email rate-limit counters, and BullMQ jobs.
- BullMQ persists `dectra.mail` jobs with exponential retry and moves exhausted jobs to `dectra.mail.dlq`.
- The worker decrypts the OTP from the queue payload, renders `VerifyEmail.tsx` through React Email, and sends via the configured provider.
- Winston writes structured JSON logs to `server/src/logs/combined.log` and security/audit events to `server/src/logs/security.log`.

## Security Properties

- OTP expiry: 5 minutes.
- Resend cooldown: 60 seconds.
- Max verification attempts per OTP: 5.
- OTP hash stored with bcrypt in Redis.
- OTP is encrypted before being placed in BullMQ so it is not stored plaintext.
- Generic response messages avoid leaking account existence or OTP validity details.
- IP and email rate limits are enforced.
- Helmet, CORS, JSON body limits, input sanitization, and structured audit logs are enabled.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start Redis:

```bash
docker compose -f docker-compose.email.yml up redis
```

3. Create `server/.env` from `server/.env.example` and set:

```bash
RESEND_API_KEY=re_...
MAIL_FROM="Dectra Trust <verify@yourdomain.com>"
JWT_SECRET=use-a-long-random-secret
REDIS_URL=redis://localhost:6379
```

4. Create `.env.local` from `.env.example` and confirm:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

5. Run the API and worker in separate terminals:

```bash
npm run server:dev
npm run server:worker
```

6. Health check:

```bash
curl http://localhost:4000/health
```

## Docker

```bash
docker compose -f docker-compose.email.yml up --build
```

The compose file starts Redis, the API, and one worker. Scale workers with:

```bash
docker compose -f docker-compose.email.yml up --scale mail-worker=3
```

## API

All responses use:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "string",
  "error": {
    "code": "STRING"
  }
}
```

### POST `/auth/send-otp`

Request:

```json
{
  "email": "founder@company.com"
}
```

Response:

```json
{
  "success": true,
  "message": "If the request is valid, a verification code will be sent."
}
```

### POST `/auth/resend-otp`

Request:

```json
{
  "email": "founder@company.com"
}
```

Response is intentionally the same as send OTP unless cooldown/rate limits are reached.

### POST `/auth/verify-otp`

Request:

```json
{
  "email": "founder@company.com",
  "otp": "123456"
}
```

Success:

```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "token": "jwt",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```

## Frontend Flow

- Signup uses the backend OTP service to issue the first code.
- The verification page reads the `email`, `source`, and `delivery` query parameters to decide whether to auto-send a fresh code.
- Verify requests update the app database through the Next.js layer after the backend validates the OTP.
- Resend respects the backend cooldown and the frontend applies a visible cooldown timer.

## Redis Keys

- `otp:{emailHash}`: bcrypt OTP hash and metadata, expires in 5 minutes.
- `otp_attempts:{emailHash}`: failed attempt counter, expires with OTP lifecycle.
- `otp_cooldown:{emailHash}`: resend cooldown marker, expires in 60 seconds.
- `ratelimit:email:{action}:{emailHash}`: email abuse protection counters.
- BullMQ keys are namespaced by queue names `dectra.mail` and `dectra.mail.dlq`.

## Provider Migration

Email providers implement `EmailProvider` in `server/src/types/email.ts`.

Current:

- `server/src/providers/email/resend.provider.ts`

Future:

- Add `postal.provider.ts`, `sendgrid.provider.ts`, or `ses.provider.ts`.
- Extend `createEmailProvider`.
- Set `EMAIL_PROVIDER=postal` or the target provider.

## Production Deployment Notes

- Use managed Redis with persistence, TLS, authentication, and eviction policy set to `noeviction`.
- Run API and worker as separate deployments; scale workers horizontally.
- Use a long random `JWT_SECRET` and rotate through a key-management strategy before launch.
- Send logs to a SIEM or log pipeline. Preserve `requestId`, `email_hash`, `ip`, and `audit_type`.
- Put the API behind a reverse proxy or load balancer with WAF rules and bot protection.
- Use verified Resend domains with SPF, DKIM, and DMARC. For Postal migration, configure DKIM, SPF, bounce handling, suppression lists, and reputation monitoring before traffic cutover.
- Add PostgreSQL audit persistence for long-term reporting. The `server/src/config/postgres.ts` file is intentionally ready for that expansion.
- Add metrics for queue depth, job latency, send failures, verification conversion, and rate-limit events.
