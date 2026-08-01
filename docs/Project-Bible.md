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
