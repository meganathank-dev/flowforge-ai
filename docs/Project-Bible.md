# FlowForge AI — Project Bible

## Vision

FlowForge AI is an AI-assisted project management platform built for software development organizations. It aims to go beyond traditional project management tools by integrating AI capabilities that help managers make faster, more informed decisions.

## Core Principles

### 1. JavaScript Only

This project uses **JavaScript exclusively**. No TypeScript is used anywhere in the codebase — no `.ts` files, no `.tsx` files, no `tsconfig.json`, no TypeScript dependencies.

**Rationale:** This decision ensures consistency, reduces build complexity, and eliminates type-related tooling overhead during the foundation and early development phases.

### 2. MERN Stack

- **MongoDB** — Document database
- **Express.js** — Backend framework
- **React** — Frontend library
- **Node.js** — Runtime environment

### 3. Monorepo Architecture

The project uses **npm workspaces** to manage a monorepo containing:

- `client/` — React frontend (Vite)
- `server/` — Express.js backend

No additional monorepo frameworks (Turborepo, Nx, Lerna) are used. npm workspaces provide sufficient workspace management.

### 4. Phased Development

Features are implemented in distinct phases:

- **Phase 0** — Technical foundation (current)
- **Phase 1+** — Business features (authentication, CRUD, AI, etc.)

No business features are implemented until their designated phase.

### 5. Security First

Even in the foundation phase, security best practices are followed:

- Helmet for HTTP security headers
- CORS configuration
- Request body size limits
- Rate limiting
- Environment variable validation
- No hard-coded secrets
- Sensitive field filtering in logs

### 6. Clean Architecture

- Controllers are thin — they delegate to services
- Business logic is separated from routes
- Database access is separated from business logic
- Meaningful naming conventions
- No unnecessary abstractions

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Language | JavaScript | Simplicity, consistency |
| Frontend | React + Vite | Fast dev server, modern tooling |
| Styling | Tailwind CSS v4 | Utility-first, rapid UI development |
| State | Zustand | Lightweight, simple API |
| HTTP Client | Axios | Interceptors, error handling |
| Backend | Express.js | Mature, flexible |
| Database | MongoDB + Mongoose | Document model fits project data |
| Validation | Zod | Runtime validation, schema-first |
| Logging | Winston | Structured logging, multiple transports |
| Monorepo | npm workspaces | Simple, no extra tooling |

## Phase 1A: Identity & Authentication Security Foundation

Phase 1A establishes the **security foundation** required before authentication APIs can be implemented.

> **Phase 1A does NOT implement authentication APIs.** Phase 1B will implement the actual login, registration, logout, JWT, and token endpoints.

### What Phase 1A Includes

| Component | Purpose |
|-----------|---------|
| Role constants | Five-tier RBAC: super_admin, organization_admin, project_manager, team_leader, employee |
| Account status constants | Lifecycle states: pending, active, locked, suspended, deactivated |
| Auth constants | Login attempt limits, lock duration, OTP config, bcrypt work factor |
| Password utility | bcryptjs hashing, comparison, strength validation |
| OTP utility | Cryptographically secure (node:crypto) numeric OTP generation |
| User model | Identity/security Mongoose schema with indexes |
| Password reset model | Foundation model with OTP hash and TTL index |
| Session model | Foundation model for future session management |
| Security event model | Audit logging model for security events |
| Auth validators | Zod schemas for future auth operations |
| User repository | Database access layer for user operations |
| Auth service | Internal security logic (password verification, lock management) |
| Security event service | Reusable service for recording security events |

### Password Hashing Architecture

- Uses **bcryptjs** with a work factor of 12
- Plaintext passwords are **never stored or logged**
- Password hash is excluded from default Mongoose queries (`select: false`)
- Password hash is stripped from JSON serialization (`toJSON` transform)

### Repository/Service Separation

- **Repository layer** encapsulates all Mongoose queries
- **Service layer** contains business logic without HTTP concerns
- **Controllers** (Phase 1B) will be thin — delegating to services
