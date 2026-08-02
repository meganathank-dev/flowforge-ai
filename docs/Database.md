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

## Phase 1 Models

### User Model (`user.model.js`)

Identity and security model for authentication.

| Field | Type | Notes |
|-------|------|-------|
| `employeeId` | String | Required, unique, uppercase, indexed |
| `email` | String | Required, unique, lowercase, indexed |
| `passwordHash` | String | Required, `select: false` — never in default queries |
| `role` | String | Enum (ROLE_VALUES), default: `employee` |
| `accountStatus` | String | Enum (ACCOUNT_STATUS_VALUES), default: `active` |
| `failedLoginAttempts` | Number | Default: 0, min: 0 |
| `lockedUntil` | Date | Null when not locked |
| `lastLoginAt` | Date | Updated on successful login |
| `passwordChangedAt` | Date | Updated when password changes |

**Indexes:** `email` (unique), `employeeId` (unique), `accountStatus`, `role`, compound `{email, accountStatus}`, compound `{employeeId, accountStatus}`

**Security:** `passwordHash` is excluded from default queries via `select: false` and stripped from `toJSON`/`toObject` transforms.

### Password Reset Model (`password-reset.model.js`)

Stores active password reset OTPs.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Required, indexed |
| `otpHash` | String | Required — stores bcrypt hash, never raw OTP |
| `expiresAt` | Date | Required, TTL index (auto-delete on expiry) |
| `attempts` | Number | Default: 0, tracking failed verifications |
| `used` | Boolean | Default: false, set to true after successful reset |

**Indexes:** TTL on `expiresAt`, compound `{user, used}`

**Security Note:** Only the bcrypt hash of the OTP is stored. The `used` field ensures the OTP cannot be used more than once. Failed attempts are incremented to prevent brute force.

### Session Model (`session.model.js`)

Stores active refresh token sessions.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Required, indexed |
| `tokenHash` | String | Required, unique, SHA-256 hash of the refresh token |
| `expiresAt` | Date | Required, TTL index (auto-delete on expiry) |
| `revokedAt` | Date | Null while active, set during logout/password change/rotation race |
| `metadata.ipAddress` | String | Client IP |
| `metadata.userAgent` | String | Client user agent |
| `metadata.deviceType` | String | Device classification |

**Indexes:** TTL on `expiresAt`, compound `{user, revokedAt}`

**Security Note:** Only the SHA-256 hash of the refresh token is stored. The `revokedAt` field allows for token reuse detection without physically deleting the session until `expiresAt` triggers the TTL cleanup.

### Security Event Model (`security-event.model.js`)

Audit trail for security-related events.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Optional (nullable for unknown-user events) |
| `eventType` | String | Enum: login_success, login_failed, account_locked, password_changed, password_reset_requested, password_reset_completed, registration, logout, token_reuse_detected, session_revoked, otp_verification_failed, otp_verified |
| `ipAddress` | String | Client IP |
| `userAgent` | String | Client user agent |
| `metadata` | Mixed | Sanitized — no secrets ever persisted |
| `timestamp` | Date | Auto-set via `timestamps.createdAt` |

**Indexes:** `user`, `eventType`, compound `{user, eventType}`, compound `{eventType, timestamp}`

## Phase 2A Models

### Organization Model (`organization.model.js`)

Root entity for multi-tenant architecture.

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required, trimmed, indexed |
| `domain` | String | Optional, lowercase |
| `settings` | Object | Tenant specific configuration |
| `settings.allowDomainUsers` | Boolean | Default: false |

**Indexes:** `name`

### Employee Profile Model (`employee-profile.model.js`)

Stores personal and organizational data for a user.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId (ref: User) | Required, unique |
| `organizationId` | ObjectId (ref: Organization) | Required for tenant isolation, indexed |
| `firstName` | String | Required |
| `lastName` | String | Required |
| `title` | String | Job title |
| `department` | ObjectId (ref: Department) | Ref (Phase 2B) |
| `manager` | ObjectId (ref: User) | Ref to manager |
| `joinDate` | Date | Default: Date.now |
| `skills` | [String] | Array of skills |

**Indexes:** `organizationId`, `user`, compound `{organizationId, user}`

## Indexing Strategy

Indexes will be defined as models are created. General principles:

- Index fields used in queries and filters
- Compound indexes for common query patterns
- Unique indexes for fields like email, employee ID
- TTL indexes for expiring data (e.g., OTP tokens, sessions)
- **Tenant Isolation**: Queries within a tenant must ALWAYS include `organizationId` in their criteria, thus `organizationId` should be the first field in compound indexes covering tenant-specific queries.

### Planned Models (Future Phases)

- `Department` — Organizational departments
- `Team` — Working groups
- `Project` — Project records
- `Task` — Individual work items
- `Leave` — Leave requests
- `Attendance` — Attendance records
- `Notification` — System notifications
- `Document` — File metadata
- `AuditLog` — Activity tracking
