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

No schemas are implemented in Phase 0. Future schemas will follow these conventions:

### Conventions

- Models use PascalCase: `User`, `Project`, `Task`
- Files use kebab-case: `user.model.js`, `project.model.js`
- All documents include `timestamps: true` (auto `createdAt`, `updatedAt`)
- Soft delete pattern: `isDeleted: Boolean` + `deletedAt: Date`
- References use `mongoose.Schema.Types.ObjectId`

### Planned Models (Future Phases)

- `User` — Employee and manager accounts
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

## Indexing Strategy

Indexes will be defined as models are created. General principles:

- Index fields used in queries and filters
- Compound indexes for common query patterns
- Unique indexes for fields like email, employee ID
- TTL indexes for expiring data (e.g., OTP tokens)
