# FlowForge AI — Database

## Overview

FlowForge AI uses **MongoDB** as its primary database, accessed through **Mongoose** ODM.

## Connection

### Configuration

Database connection is managed in `server/src/config/db.config.js`.

The connection URI is provided via the `MONGODB_URI` environment variable:

```
MONGODB_URI=mongodb://localhost:27017/flowforge-ai
```

### Connection Lifecycle

1. **Startup**: `connectDB(uri)` is called during server initialization
2. **Monitoring**: Connection events (error, disconnected) are logged
3. **Shutdown**: `gracefulShutdown()` cleanly closes the connection on `SIGINT`/`SIGTERM`

### Connection States

| State | Code | Description |
|-------|------|-------------|
| Disconnected | 0 | No active connection |
| Connected | 1 | Successfully connected |
| Connecting | 2 | Connection in progress |
| Disconnecting | 3 | Closing connection |

The health check endpoint (`GET /api/v1/health`) exposes the current connection state.

## Schema Design

### Conventions

- Models use PascalCase: `User`, `Project`, `Task`
- Files use kebab-case: `user.model.js`, `project.model.js`
- All documents include `timestamps: true` (auto `createdAt`, `updatedAt`)
- Soft delete pattern: `isDeleted: Boolean` + `deletedAt: Date`
- References use `mongoose.Schema.Types.ObjectId`

## Phase 1A Models (Implemented)

### User Model (`user.model.js`)

Identity and security model for authentication.

| Field | Type | Notes |
|-------|------|-------|
| `employeeId` | String | Required, unique, uppercase, indexed |
| `email` | String | Required, unique, lowercase, indexed |
| `passwordHash` | String | Required, `select: false` — never in default queries |
| `role` | String | Enum (ROLE_VALUES), default: `employee` |
| `accountStatus` | String | Enum (ACCOUNT_STATUS_VALUES), default: `pending` |
| `failedLoginAttempts` | Number | Default: 0, min: 0 |
| `lockedUntil` | Date | Null when not locked |
| `lastLoginAt` | Date | Updated on successful login |
| `passwordChangedAt` | Date | Updated when password changes |

**Indexes:** `email` (unique), `employeeId` (unique), `accountStatus`, `role`, compound `{email, accountStatus}`, compound `{employeeId, accountStatus}`

**Security:** `passwordHash` is excluded from default queries via `select: false` and stripped from `toJSON`/`toObject` transforms.

### Password Reset Model (`password-reset.model.js`)

Foundation model for password reset operations. **Not yet used by any API.**

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Required, indexed |
| `otpHash` | String | Required — stores bcrypt hash, never raw OTP |
| `expiresAt` | Date | Required, TTL index (auto-delete on expiry) |
| `attempts` | Number | Default: 0, max: OTP_MAX_ATTEMPTS |
| `used` | Boolean | Default: false |

**Indexes:** TTL on `expiresAt`, compound `{user, used}`

### Session Model (`session.model.js`)

Foundation model for future session/token management. **Not yet used by any API.**

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Required, indexed |
| `tokenHash` | String | Required — stores hash, never raw token |
| `expiresAt` | Date | Required, TTL index |
| `revokedAt` | Date | Null while active |
| `metadata.ipAddress` | String | Client IP |
| `metadata.userAgent` | String | Client user agent |
| `metadata.deviceType` | String | Device classification |

**Indexes:** TTL on `expiresAt`, compound `{user, revokedAt}`

### Security Event Model (`security-event.model.js`)

Audit trail for security-related events.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Optional (nullable for unknown-user events) |
| `eventType` | String | Enum: login_success, login_failed, account_locked, password_changed, password_reset_requested, password_reset_completed |
| `ipAddress` | String | Client IP |
| `userAgent` | String | Client user agent |
| `metadata` | Mixed | Sanitized — no secrets ever persisted |
| `timestamp` | Date | Auto-set via `timestamps.createdAt` |

**Indexes:** `user`, `eventType`, compound `{user, eventType}`, compound `{eventType, timestamp}`

## Indexing Strategy

Indexes will be defined as models are created. General principles:

- Index fields used in queries and filters
- Compound indexes for common query patterns
- Unique indexes for fields like email, employee ID
- TTL indexes for expiring data (e.g., OTP tokens, sessions)

### Planned Models (Future Phases)

- `Organization` — Company/team structure
- `Department` — Organizational departments
- `Team` — Working groups
- `Project` — Project records
- `Task` — Individual work items
- `Leave` — Leave requests
- `Attendance` — Attendance records
- `Notification` — System notifications
- `Document` — File metadata
- `AuditLog` — Activity tracking
