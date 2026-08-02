# FlowForge AI — Architecture

## Overview

FlowForge AI uses a MERN (MongoDB, Express.js, React, Node.js) architecture organized as a monorepo using npm workspaces.

## Monorepo Structure

```
FlowForge-AI/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/ui/  # Reusable UI components
│   │   ├── config/         # App configuration
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layout wrappers
│   │   ├── lib/            # Third-party integrations
│   │   ├── pages/          # Route-level components
│   │   ├── services/       # API service functions
│   │   ├── stores/         # Zustand state stores
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # Root component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles & Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Environment & database config
│   │   ├── constants/      # Shared constants
│   │   ├── controllers/    # Route handlers (thin)
│   │   ├── errors/         # Custom error classes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Database access layer
│   │   ├── routes/v1/      # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Helper utilities
│   │   ├── validators/     # Zod validation schemas
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── logs/               # Application logs
│   ├── nodemon.json
│   └── package.json
│
├── docs/                   # Documentation
├── .gitignore
├── .prettierrc
├── .prettierignore
├── README.md
└── package.json            # Root (workspaces)
```

## Backend Architecture

### Request Pipeline

```
Client Request
    │
    ▼
┌──────────┐
│  Helmet   │  Security headers
├──────────┤
│  CORS     │  Cross-origin control
├──────────┤
│  Parser   │  JSON body (16kb limit)
├──────────┤
│  Morgan   │  HTTP request logging
├──────────┤
│Rate Limit │  Request throttling
├──────────┤
│  Router   │  /api/v1/*
├──────────┤
│ Validate  │  Zod schema validation
├──────────┤
│Controller │  Thin handler → service
├──────────┤
│ Service   │  Business logic
├──────────┤
│Repository │  Database access
├──────────┤
│ Response  │  Consistent JSON format
└──────────┘
```

### Error Handling Flow

```
Error occurs
    │
    ▼
Error Middleware
    │
    ├── AppError (custom)      → status + message
    ├── Mongoose Validation    → 422 + field errors
    ├── Mongoose CastError     → 400 + bad value
    ├── Mongoose Duplicate Key → 409 + field name
    ├── Zod Error              → 422 + field errors
    └── Unknown Error          → 500 (safe in production)
```

### Layered Architecture

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Route** | URL mapping, middleware chain | `routes/v1/health.route.js` |
| **Controller** | Parse request, call service, send response | `controllers/health.controller.js` |
| **Service** | Business logic, orchestration | `services/*.js` (future) |
| **Repository** | Database queries | `repositories/*.js` (future) |
| **Model** | Data schema definition | `models/*.js` (future) |

## Frontend Architecture

### State Management

- **Zustand** stores for global application state
- Each domain feature gets its own store (e.g., `health.store.js`)
- Custom hooks wrap stores for component use

### API Layer

```
Component → Hook → Store → Service → API Client → Backend
```

- **API Client** (`api.client.js`): Axios instance with interceptors
- **Services** (`*.service.js`): Domain-specific API calls
- **Stores** (`*.store.js`): Zustand state + async actions
- **Hooks** (`use*.js`): React hooks for component consumption

### Routing

- React Router v7 with layout routes
- `RootLayout` wraps all pages via `<Outlet />`
- Future: nested layouts for authenticated vs. public routes

## API Versioning

All API endpoints are versioned under `/api/v1`. Future breaking changes will use `/api/v2`, etc.

## Phase 1A: Security Foundation Architecture

Phase 1A adds the security foundation layer without creating HTTP routes. The following components were added:

### New Server Directories (Phase 1A)

```
server/src/
├── constants/
│   ├── index.js                    # Phase 0 — shared constants
│   ├── roles.js                    # Phase 1A — user role definitions
│   ├── account-status.js           # Phase 1A — account lifecycle states
│   └── auth.constants.js           # Phase 1A — auth/security config
├── models/
│   ├── user.model.js               # Phase 1A — user identity model
│   ├── password-reset.model.js     # Phase 1A — password reset foundation
│   ├── session.model.js            # Phase 1A — session foundation
│   └── security-event.model.js     # Phase 1A — security audit log
├── validators/
│   └── auth.validator.js           # Phase 1A — Zod auth schemas
├── repositories/
│   └── user.repository.js          # Phase 1A — user database access
├── services/
│   ├── auth.service.js             # Phase 1A — auth security logic
│   └── security-event.service.js   # Phase 1A — security event service
├── utils/
│   ├── logger.js                   # Phase 0 — Winston logger
│   ├── response.js                 # Phase 0 — response helpers
│   ├── password.util.js            # Phase 1A — bcryptjs password utility
│   └── otp.util.js                 # Phase 1A — OTP generation utility
└── tests/
    └── auth.test.js                # Phase 1A — auth foundation tests
```

### Security Data Flow (Phase 1A Foundation)

```
[Future Phase 1B Controller]
        │
        ▼
   Auth Service          ←──── Password Utility (bcryptjs)
        │                 ←──── Account Status Constants
        ▼
# FlowForge AI — Architecture

## Overview

FlowForge AI uses a MERN (MongoDB, Express.js, React, Node.js) architecture organized as a monorepo using npm workspaces.

## Monorepo Structure

```
FlowForge-AI/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/ui/  # Reusable UI components
│   │   ├── config/         # App configuration
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layout wrappers
│   │   ├── lib/            # Third-party integrations
│   │   ├── pages/          # Route-level components
│   │   ├── services/       # API service functions
│   │   ├── stores/         # Zustand state stores
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # Root component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles & Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Environment & database config
│   │   ├── constants/      # Shared constants
│   │   ├── controllers/    # Route handlers (thin)
│   │   ├── errors/         # Custom error classes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Database access layer
│   │   ├── routes/v1/      # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Helper utilities
│   │   ├── validators/     # Zod validation schemas
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── logs/               # Application logs
│   ├── nodemon.json
│   └── package.json
│
├── docs/                   # Documentation
├── .gitignore
├── .prettierrc
├── .prettierignore
├── README.md
└── package.json            # Root (workspaces)
```

## Backend Architecture

### Request Pipeline

```
Client Request
    │
    ▼
┌──────────┐
│  Helmet   │  Security headers
├──────────┤
│  CORS     │  Cross-origin control
├──────────┤
│  Parser   │  JSON body (16kb limit)
├──────────┤
│  Morgan   │  HTTP request logging
├──────────┤
│Rate Limit │  Request throttling
├──────────┤
│  Router   │  /api/v1/*
├──────────┤
│ Validate  │  Zod schema validation
├──────────┤
│Controller │  Thin handler → service
├──────────┤
│ Service   │  Business logic
├──────────┤
│Repository │  Database access
├──────────┤
│ Response  │  Consistent JSON format
└──────────┘
```

### Error Handling Flow

```
Error occurs
    │
    ▼
Error Middleware
    │
    ├── AppError (custom)      → status + message
    ├── Mongoose Validation    → 422 + field errors
    ├── Mongoose CastError     → 400 + bad value
    ├── Mongoose Duplicate Key → 409 + field name
    ├── Zod Error              → 422 + field errors
    └── Unknown Error          → 500 (safe in production)
```

### Layered Architecture

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Route** | URL mapping, middleware chain | `routes/v1/health.route.js` |
| **Controller** | Parse request, call service, send response | `controllers/health.controller.js` |
| **Service** | Business logic, orchestration | `services/*.js` (future) |
| **Repository** | Database queries | `repositories/*.js` (future) |
| **Model** | Data schema definition | `models/*.js` (future) |

## Frontend Architecture

### State Management

- **Zustand** stores for global application state
- Each domain feature gets its own store (e.g., `health.store.js`)
- Custom hooks wrap stores for component use

### API Layer

```
Component → Hook → Store → Service → API Client → Backend
```

- **API Client** (`api.client.js`): Axios instance with interceptors
- **Services** (`*.service.js`): Domain-specific API calls
- **Stores** (`*.store.js`): Zustand state + async actions
- **Hooks** (`use*.js`): React hooks for component consumption

### Routing

- React Router v7 with layout routes
- `RootLayout` wraps all pages via `<Outlet />`
- Future: nested layouts for authenticated vs. public routes

## API Versioning

All API endpoints are versioned under `/api/v1`. Future breaking changes will use `/api/v2`, etc.

## Phase 1A: Security Foundation Architecture

Phase 1A adds the security foundation layer without creating HTTP routes. The following components were added:

### New Server Directories (Phase 1A)

```
server/src/
├── constants/
│   ├── index.js                    # Phase 0 — shared constants
│   ├── roles.js                    # Phase 1A — user role definitions
│   ├── account-status.js           # Phase 1A — account lifecycle states
│   └── auth.constants.js           # Phase 1A — auth/security config
├── models/
│   ├── user.model.js               # Phase 1A — user identity model
│   ├── password-reset.model.js     # Phase 1A — password reset foundation
│   ├── session.model.js            # Phase 1A — session foundation
│   └── security-event.model.js     # Phase 1A — security audit log
├── validators/
│   └── auth.validator.js           # Phase 1A — Zod auth schemas
├── repositories/
│   └── user.repository.js          # Phase 1A — user database access
├── services/
│   ├── auth.service.js             # Phase 1A — auth security logic
│   └── security-event.service.js   # Phase 1A — security event service
├── utils/
│   ├── logger.js                   # Phase 0 — Winston logger
│   ├── response.js                 # Phase 0 — response helpers
│   ├── password.util.js            # Phase 1A — bcryptjs password utility
│   └── otp.util.js                 # Phase 1A — OTP generation utility
└── tests/
    └── auth.test.js                # Phase 1A — auth foundation tests
```

### Security Data Flow (Phase 1A Foundation)

```
[Future Phase 1B Controller]
        │
        ▼
   Auth Service          ←──── Password Utility (bcryptjs)
        │                 ←──── Account Status Constants
        ▼
  User Repository         ←──── User Model (Mongoose)
        │
        ▼
  Security Event Service  ←──── Security Event Model
```

### Security Architecture

The application implements a defense-in-depth security strategy.

### Authentication (Phase 1B)

Authentication uses a dual-token cookie-based architecture designed to maximize security while maintaining stateless API principles.

#### Token Strategy
- **Access Tokens**: Short-lived JSON Web Tokens (JWT) containing minimal claims (`sub`, `role`).
- **Refresh Tokens**: Long-lived, cryptographically secure random hexadecimal strings (80 characters).

#### Cookie Security & CSRF Protection
Tokens are never returned in JSON response bodies to prevent XSS exfiltration. They are stored exclusively in cookies:
- `accessToken` cookie: `httpOnly: true`, `SameSite: Strict`, Path: `/`, Max-Age: 15m.
- `refreshToken` cookie: `httpOnly: true`, `SameSite: Strict`, Path: `/api/v1/auth`, Max-Age: 7 days.

Because `SameSite: Strict` is enforced and CORS is configured strictly with `credentials: true`, cross-site request forgery (CSRF) is mitigated without requiring a separate token exchange mechanism.

#### Session Management & Refresh Rotation
Refresh tokens represent active sessions in the database.
- **Storage**: Only the SHA-256 hash of the refresh token is stored in MongoDB, mitigating the impact of database compromise.
- **Atomic Rotation**: Upon a successful refresh, the session is atomically rotated (new token, new hash) using MongoDB's `findOneAndUpdate` with a `revokedAt: null` guard.
- **Token Reuse Detection**: If a client attempts to refresh using a token whose session is already marked revoked (indicating potential token theft or race condition), the system detects the reuse, logs a high-severity security event (`TOKEN_REUSE_DETECTED`), and immediately revokes ALL active sessions for that user.

#### Password Reset Flow
The forgotten password flow uses Email OTPs instead of magic links.
- OTPs are cryptographically generated (6 digits).
- Only the bcrypt hash of the OTP is stored in the database.
- OTP verification has a strict maximum attempt limit to prevent brute force.
- The reset request is anti-enumerative (always returns success regardless of email existence).

### Authorization (Future Phase)

### Model Architecture

| Model | Purpose | Key Features |
|-------|---------|-------------|
| User | Identity & security | passwordHash (select: false), role, accountStatus, lock management |
| PasswordReset | Password reset OTP | TTL index on expiresAt, hashed OTP only |
| Session | Future session tokens | TTL auto-cleanup, hashed tokens only |
| SecurityEvent | Audit trail | Sanitized metadata, timestamp index |

> **Note:** Phase 1A models are foundations. No routes or APIs use them yet. Phase 1B will wire controllers and routes.
