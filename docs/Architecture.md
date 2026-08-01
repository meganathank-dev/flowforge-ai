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
