# Dectra Verification Integration Guide

## Overview

This guide documents the complete integration between:
1. **Dectra-Main**: Document upload and QR generation application
2. **Dectra Scanner**: QR code reader with desktop GUI (Python + PyQt5)
3. **Dectra Admin Dashboard**: Real-time verification logs viewer (Next.js 15)

## Architecture

```
┌──────────────────┐
│  Dectra-Main     │  (FastAPI + React)
│  Upload/QR Gen   │──────┐
└──────────────────┘      │
                          │ QR contains metadata
                          ▼
┌──────────────────┐    ┌─────────────┐
│ Dectra Scanner   │───▶│  Azure      │
│  QR Reader       │    │  Blob       │
└──────────────────┘    └─────────────┘
       │
       │ Verification event
       ▼
┌──────────────────────────────┐
│ Admin Dashboard              │
│ /api/verification-ingest     │
│ /api/logs (polling)          │
└──────────────────────────────┘
```

## Components

### 1. Verification-Ingest Endpoint

**File**: `src/app/api/verification-ingest/route.ts`

**Purpose**: Receives verification events from the scanner and stores them in the database.

**Authentication**: Bearer token based on `SCANNER_TOKEN` environment variable

**POST Request**:
```json
{
  "document_type": "Aadhaar",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "confidence": 0.92,
  "image_url": "https://blob.core.windows.net/doc.jpg",
  "document_id": "DOC-12345",
  "scanner_version": "2.3.0"
}
```

**Status Logic**:
- `confidence >= 0.85`: Verified (Risk: Low)
- `0.6 <= confidence < 0.85`: Pending (Risk: Medium)
- `confidence < 0.6`: Flagged (Risk: High)

**POST Response** (201 Created):
```json
{
  "event_id": 123,
  "status": "verified",
  "confidence": 0.92,
  "risk_score": "Low",
  "created_at": "2025-05-02T10:30:45.123Z"
}
```

**DELETE Request**: Remove event by ID
```json
{
  "event_id": 123
}
```

### 2. Logs Endpoint

**File**: `src/app/api/logs/route.ts`

**Purpose**: Retrieves verification events with filtering and statistics

**GET Query Parameters**:
- `limit`: Max results (default: 100, max: 500)
- `offset`: Pagination offset
- `status`: Filter by status (verified|flagged|pending)
- `document_type`: Filter by document type
- `sort`: Order by received_at (latest|oldest)

**Response**:
```json
{
  "logs": [
    {
      "id": 123,
      "metadata": {
        "document_type": "Aadhaar",
        "status": "verified",
        "confidence": 0.92,
        "user_name": "John Doe",
        "user_email": "john@example.com",
        "risk_score": "Low"
      },
      "received_at": "2025-05-02T10:30:45.123Z"
    }
  ],
  "stats": {
    "total": 150,
    "verified": 120,
    "flagged": 15,
    "pending": 15
  },
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 150
  }
}
```

### 3. LogsPageClient Component

**File**: `src/components/dashboard/logs/LogsPageClient.tsx`

**Purpose**: Real-time logs UI with polling

**Features**:
- 5-second polling interval for automatic updates
- Status-based filtering (All, Verified, Flagged, Pending)
- Expandable log entries with detailed information
- Stats cards showing verification metrics
- Color-coded status indicators

**Key Implementation**:
```typescript
useEffect(() => {
  // Initial fetch
  setLoading(true);
  fetchLogs().finally(() => setLoading(false));

  // Set up polling interval (5 seconds)
  const pollInterval = setInterval(() => {
    fetchLogs();
  }, 5000);

  return () => clearInterval(pollInterval);
}, []);
```

## Environment Configuration

### Admin Dashboard (.env.local)

```env
# Database
DATABASE_URL=postgresql://...

# Scanner Authentication
SCANNER_TOKEN=sk_scanner_dectra_2025_prod_veriquick_secure_token_v1_a7f8e9d2c3b4a5f6e7d8c9b0a1f2e3d4

# Other existing configs
AUTH_SECRET=...
NEXTAUTH_SECRET=...
RESEND_API_KEY=...
```

### Scanner (.env)

```env
# Admin Dashboard URL
DECTRA_ADMIN_URL=http://localhost:3000

# Scanner Authentication Token (must match admin dashboard)
SCANNER_TOKEN=sk_scanner_dectra_2025_prod_veriquick_secure_token_v1_a7f8e9d2c3b4a5f6e7d8c9b0a1f2e3d4

# Azure Blob Storage (optional)
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_STORAGE_CONTAINER=veriquick

# Application Settings
SCANNER_VERSION=2.3.0
SCANNER_COOLDOWN_SECONDS=3
```

## Scanner Integration

### Scanner Module Updates

**File**: `scanner/scanner.py`

**New Function**: `send_verification_event_async()`

```python
def send_verification_event_async(
    doc_files: list,
    user_name: str = "Unknown",
    user_email: str = "",
    confidence: float = 0.85,
    scanner_version: str = "2.3.0",
    callback=None
) -> None:
    """
    Non-blocking POST of verification event to admin dashboard.
    """
```

**Updated Call Site** (in `process_qr_code()`):

```python
# Extract document metadata
user_name = "Scanner User"
user_email = ""
confidence = 0.9  # Default high confidence

# Send to admin dashboard
send_verification_event_async(
    files,
    user_name=user_name,
    user_email=user_email,
    confidence=confidence,
    scanner_version="2.3.0",
    callback=lambda ok, resp: print(f"Event sent: {ok}")
)
```

## Data Flow

1. **QR Generation** (Dectra-Main)
   - User uploads document via DigiLocker/Camera
   - System validates document (PAN checksum, Aadhaar QR)
   - Document stored in Azure Blob Storage
   - QR code generated with SAS URL (30-60s expiry)

2. **QR Scanning** (Dectra Scanner)
   - Scanner desktop app reads QR code
   - SAS URL decoded to access document image
   - Optional: Document image re-uploaded to Azure Blob
   - Verification event created with metadata

3. **Verification Posting** (Dectra Scanner → Admin Dashboard)
   - POST to `/api/verification-ingest` with Bearer token
   - Payload: document_type, user_name, confidence, image_url
   - Response: event_id, status, risk_score

4. **Real-time Display** (Admin Dashboard)
   - LogsPageClient polls `/api/logs` every 5 seconds
   - Updates displayed stats and log entries
   - User can filter by status or document type
   - Click to expand entry for detailed information

## Testing

### PowerShell Test Script

Run the test suite to verify the integration:

```powershell
# Execute the test script
.\test-verification-integration.ps1
```

This will:
1. ✅ Send valid verification event (verified status)
2. ✅ Send flagged event (low confidence)
3. ✅ Send pending event (medium confidence)
4. ✅ Test error handling (missing fields)
5. ✅ Test authentication (invalid token)
6. ✅ Retrieve logs and display stats

### Manual Testing

```bash
# Test with curl
curl -X POST http://localhost:3000/api/verification-ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_scanner_dectra_2025_prod_veriquick_secure_token_v1_a7f8e9d2c3b4a5f6e7d8c9b0a1f2e3d4" \
  -d '{
    "document_type": "Aadhaar",
    "user_name": "Test User",
    "confidence": 0.9,
    "image_url": "https://example.blob.core.windows.net/doc.jpg"
  }'
```

## Database Schema

### verification_events Table

```sql
CREATE TABLE verification_events (
  id SERIAL PRIMARY KEY,
  document_type VARCHAR(50),
  metadata JSONB,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_status ON verification_events USING GIN((metadata->'status'));
CREATE INDEX idx_verification_type ON verification_events USING GIN((metadata->'document_type'));
CREATE INDEX idx_verification_received ON verification_events(received_at DESC);
```

### metadata JSONB Structure

```json
{
  "status": "verified|flagged|pending",
  "document_type": "Aadhaar|PAN|Passport|...",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "confidence": 0.92,
  "risk_score": "Low|Medium|High",
  "image_url": "https://...",
  "document_id": "DOC-12345",
  "scanner_version": "2.3.0",
  "source": "scanner-desktop",
  "cleaned_up": false
}
```

## Deployment Checklist

### Before Production

- [ ] Set unique SCANNER_TOKEN (not the default)
- [ ] Configure DECTRA_ADMIN_URL to production domain
- [ ] Verify database connection string for Neon PostgreSQL
- [ ] Test end-to-end flow with real scanner
- [ ] Set appropriate polling interval (currently 5 seconds)
- [ ] Configure error alerts/monitoring
- [ ] Add request rate limiting to /api/verification-ingest
- [ ] Enable HTTPS for all endpoints
- [ ] Set up proper logging and error tracking
- [ ] Test backup/recovery procedures

### Future Enhancements

1. **Redis Caching** (Phase 2)
   - Replace polling with Redis Pub/Sub
   - Real-time WebSocket updates via Socket.io
   - Reduced database load

2. **ML Integration**
   - Confidence scoring from ML model
   - Automatic document validation
   - Fraud detection patterns

3. **Queue System**
   - Bull/Redis queues for processing
   - Retry logic with exponential backoff
   - Dead-letter queue for failed events

4. **Analytics**
   - Verification success rates by document type
   - Processing time metrics
   - Scanner device tracking

## Troubleshooting

### Scanner Cannot Connect to Dashboard

1. Check DECTRA_ADMIN_URL is accessible
2. Verify SCANNER_TOKEN matches between admin and scanner
3. Check network connectivity
4. Review browser console for CORS errors
5. Verify Authorization header format: `Bearer <token>`

### Events Not Appearing in Dashboard

1. Check verification-ingest endpoint logs
2. Verify event was inserted in database: `SELECT * FROM verification_events ORDER BY id DESC LIMIT 5;`
3. Ensure polling interval is active (check Network tab in DevTools)
4. Verify filter doesn't exclude the event status

### Database Connection Issues

1. Check DATABASE_URL is correct
2. Verify Neon PostgreSQL is running
3. Test connection with: `psql $DATABASE_URL`
4. Check connection pool limits

## References

- Next.js 15: https://nextjs.org/docs
- PyQt5: https://www.riverbankcomputing.com/static/Docs/PyQt5/
- Neon PostgreSQL: https://neon.tech/docs
- Azure Blob Storage: https://learn.microsoft.com/en-us/azure/storage/blobs/
