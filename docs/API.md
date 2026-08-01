# FlowForge AI — API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

## Versioning

All API routes are versioned. The current version is `v1`, accessible at `/api/v1`.

Future breaking changes will be introduced under `/api/v2`, etc.

## Response Format

### Successful Response

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Rate Limiting

API requests are rate-limited per IP address.

| Setting | Default |
|---------|---------|
| Window | 15 minutes (900,000 ms) |
| Max Requests | 100 per window |

When the limit is exceeded, a `429 Too Many Requests` response is returned.

## Endpoints

### Health Check

#### `GET /api/v1/health`

Check server and database status.

**Response:**

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "uptime": 42,
    "timestamp": "2025-01-01T00:00:00.000Z",
    "database": "connected"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always `"ok"` if server is running |
| `uptime` | number | Server uptime in seconds |
| `timestamp` | string | Current ISO 8601 timestamp |
| `database` | string | MongoDB connection state: `connected`, `disconnected`, `connecting`, `disconnecting` |

**Status Codes:**
- `200` — Server is healthy

---

## Future Endpoints

The following endpoint groups are planned for future phases. They are **not yet implemented**.

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/users`
- `GET /api/v1/projects`
- `GET /api/v1/tasks`
- And more...
