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

### Global Rate Limit

| Setting | Default |
|---------|---------|
| Window | 15 minutes (900,000 ms) |
| Max Requests | 100 per window |

### Authentication Rate Limits

| Endpoint Category | Max Requests | Window |
|-------------------|-------------|--------|
| Login, Refresh, Forgot-Password, Verify-OTP, Reset-Password | 10 | 15 minutes |
| Registration | 20 | 15 minutes |

When the limit is exceeded, a `429 Too Many Requests` response is returned.

## Authentication

Phase 1B uses **cookie-based authentication**:

- **Access tokens** are delivered via `httpOnly` cookies (never in JSON response body)
- **Refresh tokens** are delivered via `httpOnly` cookies (never in JSON response body)
- Cookies use `SameSite=Strict` and `Secure` (in production) for CSRF protection
- The frontend Axios client must use `withCredentials: true`

### Cookie Details

| Cookie | Path | maxAge | httpOnly | Secure | SameSite |
|--------|------|--------|----------|--------|----------|
| `accessToken` | `/` | 15 minutes | Yes | Yes (prod) | Strict |
| `refreshToken` | `/api/v1/auth` | 7 days (configurable) | Yes (prod) | Yes | Strict |

---

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

### Authentication

All authentication endpoints are mounted under `/api/v1/auth`.

---

#### `POST /api/v1/auth/register`

Register a new user account. Users are set to `active` status immediately.

**Rate Limit:** 20 requests / 15 minutes

**Request Body:**

```json
{
  "employeeId": "EMP001",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Validation:**
- `employeeId` — required, 1–50 characters
- `email` — required, valid email, normalized to lowercase
- `password` — required, 8–128 characters
- `confirmPassword` — required, must match `password`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "665a...",
    "employeeId": "EMP001",
    "email": "user@example.com",
    "role": "employee",
    "accountStatus": "active",
    "lastLoginAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

> Note: No cookies are set on registration. The user must log in separately.

**Error Responses:**
- `409` — Duplicate email or employee ID
- `400` — Password does not meet strength requirements
- `422` — Validation failed
- `429` — Rate limit exceeded

---

#### `POST /api/v1/auth/login`

Authenticate and create a session.

**Rate Limit:** 10 requests / 15 minutes

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

Sets `accessToken` and `refreshToken` cookies.

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "665a...",
      "employeeId": "EMP001",
      "email": "user@example.com",
      "role": "employee",
      "accountStatus": "active",
      "lastLoginAt": "2025-01-01T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

> **Security:** Access token and refresh token are NEVER returned in the JSON body. They are only set as HTTP-only cookies.

**Error Responses:**
- `401` — Invalid email or password / Account is locked / Account is suspended
- `422` — Validation failed
- `429` — Rate limit exceeded

---

#### `POST /api/v1/auth/logout`

Log out and revoke the current session.

**Requires Authentication:** Yes (access token cookie or Bearer header)

**Request Body:** None

**Success Response (200):**

Clears `accessToken` and `refreshToken` cookies.

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

#### `POST /api/v1/auth/refresh`

Refresh the authentication session. Rotates the refresh token.

**Rate Limit:** 10 requests / 15 minutes

**Request Body:** None (refresh token is read from cookie)

**Success Response (200):**

Sets new `accessToken` and `refreshToken` cookies.

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": null
}
```

**Error Responses:**
- `401` — Invalid/expired/revoked refresh token, or token reuse detected

**Token Reuse Detection:**

If a previously rotated/revoked refresh token is reused:
1. All sessions for the user are revoked
2. `TOKEN_REUSE_DETECTED` security event is logged
3. `401` response is returned

---

#### `GET /api/v1/auth/me`

Get the current authenticated user's profile.

**Requires Authentication:** Yes

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "665a...",
    "employeeId": "EMP001",
    "email": "user@example.com",
    "role": "employee",
    "accountStatus": "active",
    "lastLoginAt": "2025-01-01T00:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` — Not authenticated

---

#### `POST /api/v1/auth/change-password`

Change the authenticated user's password. Revokes all sessions.

**Requires Authentication:** Yes

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmNewPassword": "NewPassword456!"
}
```

**Validation:**
- `newPassword` must differ from `currentPassword`
- `confirmNewPassword` must match `newPassword`

**Success Response (200):**

Clears authentication cookies. User must log in again.

```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again.",
  "data": null
}
```

**Error Responses:**
- `401` — Current password is incorrect
- `400` — New password does not meet strength requirements
- `422` — Validation failed

---

#### `POST /api/v1/auth/forgot-password`

Request a password reset. Sends OTP via email.

**Rate Limit:** 10 requests / 15 minutes

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

Always returns a generic message regardless of whether the email exists (anti-enumeration):

```json
{
  "success": true,
  "message": "If the account exists, password reset instructions have been sent",
  "data": null
}
```

> The OTP is NEVER returned in the API response. It is sent only via email.

---

#### `POST /api/v1/auth/verify-reset-otp`

Verify the password reset OTP.

**Rate Limit:** 10 requests / 15 minutes

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Verification code is valid",
  "data": null
}
```

**Error Responses:**
- `400` — Invalid/expired OTP, maximum attempts exceeded

---

#### `POST /api/v1/auth/reset-password`

Reset password after OTP verification.

**Rate Limit:** 10 requests / 15 minutes

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass789!",
  "confirmNewPassword": "NewSecurePass789!"
}
```

**Success Response (200):**

Clears cookies. All sessions are revoked. User must log in with the new password.

```json
{
  "success": true,
  "message": "Password has been reset successfully. Please log in with your new password.",
  "data": null
}
```

**Error Responses:**
- `400` — Invalid/expired OTP, maximum attempts exceeded, password strength failure
- `422` — Validation failed

---

## Future Endpoints (Phase 2+)

- `GET /api/v1/users`
- `GET /api/v1/projects`
- `GET /api/v1/tasks`
- And more...
