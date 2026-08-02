# FlowForge AI — Development Roadmap

## Overview

FlowForge AI is developed in distinct phases. Each phase builds on the previous one. No phase is started until the prior phase is completed and verified.

---

## Phase 0: Project Foundation ✅ (Current)

**Goal:** Build the technical infrastructure.

**Deliverables:**
- Monorepo setup with npm workspaces
- Express.js backend with security, logging, error handling
- React + Vite frontend with Tailwind CSS, Zustand, Axios
- Health check endpoint and foundation verification page
- Project documentation
- ESLint, Prettier, .gitignore

**Constraints:**
- No TypeScript
- No authentication
- No business features

---

## Phase 1A: Identity & Authentication Security Foundation ✅ (Current)

**Goal:** Build the security foundation for authentication.

**Deliverables:**
- Role constants (super_admin, organization_admin, project_manager, team_leader, employee)
- Account status constants (pending, active, locked, suspended, deactivated)
- Auth configuration constants (login attempts, lock duration, OTP config)
- Password utility (bcryptjs hashing, comparison, strength validation)
- OTP utility (cryptographically secure generation via node:crypto)
- User identity model (Mongoose) with security indexes
- Password reset foundation model with TTL index
- Session foundation model with TTL index
- Security event audit model
- Zod auth validation schemas
- User repository (database access isolation)
- Auth service (internal security logic)
- Security event service (audit logging with sanitized metadata)
- Native Node.js test suite (42 tests)

**Dependencies added:** bcryptjs

**Constraints:**
- No authentication routes, controllers, or endpoints
- No JWT or token implementation
- No frontend authentication UI
- No nodemailer or email sending

---

## Phase 1B: Authentication APIs ✅

**Goal:** Implement secure user authentication endpoints.

**Planned Features:**
- User registration
- Login with JWT (access + refresh tokens)
- Logout and session management
- Password reset via email OTP
- Protected route middleware

**Dependencies:** jsonwebtoken, nodemailer

---

## Phase 1C: Authentication Frontend & RBAC ✅ (Current)

**Goal:** Integrate the Phase 1B backend APIs with the React frontend and implement backend Role-Based Access Control (RBAC).

**Deliverables:**
- Backend RBAC middleware (`authorizeRoles`)
- Frontend Axios client with `withCredentials: true` and 401 silent token refresh interceptor
- Zustand `useAuthStore` to manage safe user state (no JWTs stored on client)
- React Router hierarchy with `AuthLayout` and `ProtectedLayout`
- Premium Authentication UI (`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `UnauthorizedPage`)
- Zod schema alignment between client and server

**Dependencies added:** lucide-react, react-hook-form, @hookform/resolvers, clsx, tailwind-merge, zod (client)

---

## Phase 2: Core Business Modules

**Goal:** Build the primary management entities.

**Planned Features:**
- Organization setup
- Employee profiles and management
- Department and team structure
- Project creation and management
- Task creation, assignment, and tracking
- Status workflows

---

## Phase 3: Operations

**Goal:** Implement day-to-day operational tools.

**Planned Features:**
- Leave request and approval workflow
- Attendance tracking
- Performance review system
- Document management
- Notification system

---

## Phase 4: AI Intelligence

**Goal:** Integrate AI-powered analysis and recommendations.

**Planned Features:**
- Task assignment recommendations
- Employee workload analysis
- Delivery performance analysis
- Collaboration insights
- Task difficulty estimation
- Priority recommendations
- Management dashboards with AI insights

---

## Phase 5: Automation & Reporting

**Goal:** Automate workflows and generate reports.

**Planned Features:**
- Email automation
- Workflow triggers and automations
- Report generation (PDF, CSV)
- Audit logging and activity feeds
- Dashboard analytics

---

## Guiding Principles

1. **Each phase is self-contained** — complete and verify before moving on
2. **No premature implementation** — only build what's approved for the current phase
3. **Security at every phase** — never defer security practices
4. **JavaScript only** — this decision persists across all phases
5. **Clean architecture** — maintain separation of concerns at every layer
