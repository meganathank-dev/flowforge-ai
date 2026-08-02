# FlowForge AI — Requirements

## Phase 0: Foundation (Current)

### Scope

Build the technical infrastructure required before any business features can be implemented.

### Foundation Requirements

#### Backend
- [x] Express.js server with ES modules
- [x] Environment variable validation (Zod)
- [x] MongoDB connection with Mongoose
- [x] Graceful shutdown support
- [x] Winston logging with sensitive field filtering
- [x] Consistent API response structure
- [x] Error class hierarchy
- [x] Centralized error handling middleware
- [x] Helmet security headers
- [x] CORS configuration
- [x] Request body size limits
- [x] Rate limiting
- [x] Cookie parser
- [x] Zod request validation middleware
- [x] API versioning (`/api/v1`)
- [x] Health check endpoint

#### Frontend
- [x] React + Vite setup
- [x] Tailwind CSS v4 with custom theme
- [x] React Router
- [x] Axios API client with interceptor architecture
- [x] Zustand state management
- [x] Foundation verification page
- [x] Health check connectivity display

#### Infrastructure
- [x] npm workspaces monorepo
- [x] ESLint for both client and server
- [x] Prettier configuration
- [x] Comprehensive .gitignore
- [x] Environment example files
- [x] Project documentation

### Constraints
- No TypeScript
- No authentication
- No business modules
- No real credentials in source

---

## Phase 1A: Identity & Authentication Security Foundation (Current)

### Scope

Build the security foundation required before authentication APIs can be implemented.

> **Phase 1A does NOT implement authentication APIs.** Those are in Phase 1B.

### Security Foundation Requirements

#### Constants
- [x] User role definitions (5 roles)
- [x] Account status definitions (5 states)
- [x] Auth configuration constants (attempts, lock duration, OTP config)

#### Utilities
- [x] Password hashing with bcryptjs (hash, compare, strength validation)
- [x] Cryptographically secure OTP generation (node:crypto)

#### Models
- [x] User identity model with security fields and indexes
- [x] Password reset foundation model with TTL index
- [x] Session foundation model with TTL index
- [x] Security event audit model

#### Validators
- [x] Zod schemas for login, password change, password reset, registration

#### Repository/Service Layer
- [x] User repository (database access isolation)
- [x] Auth service (internal security logic)
- [x] Security event service (audit logging with metadata sanitization)

#### Tests
- [x] Password hashing and comparison tests
- [x] OTP generation and format validation tests
- [x] Password strength validation tests
- [x] Auth validator schema tests

### Constraints
# FlowForge AI — Requirements

## Phase 0: Foundation (Current)

### Scope

Build the technical infrastructure required before any business features can be implemented.

### Foundation Requirements

#### Backend
- [x] Express.js server with ES modules
- [x] Environment variable validation (Zod)
- [x] MongoDB connection with Mongoose
- [x] Graceful shutdown support
- [x] Winston logging with sensitive field filtering
- [x] Consistent API response structure
- [x] Error class hierarchy
- [x] Centralized error handling middleware
- [x] Helmet security headers
- [x] CORS configuration
- [x] Request body size limits
- [x] Rate limiting
- [x] Cookie parser
- [x] Zod request validation middleware
- [x] API versioning (`/api/v1`)
- [x] Health check endpoint

#### Frontend
- [x] React + Vite setup
- [x] Tailwind CSS v4 with custom theme
- [x] React Router
- [x] Axios API client with interceptor architecture
- [x] Zustand state management
- [x] Foundation verification page
- [x] Health check connectivity display

#### Infrastructure
- [x] npm workspaces monorepo
- [x] ESLint for both client and server
- [x] Prettier configuration
- [x] Comprehensive .gitignore
- [x] Environment example files
- [x] Project documentation

### Constraints
- No TypeScript
- No authentication
- No business modules
- No real credentials in source

---

## Phase 1A: Identity & Authentication Security Foundation (Current)

### Scope

Build the security foundation required before authentication APIs can be implemented.

> **Phase 1A does NOT implement authentication APIs.** Those are in Phase 1B.

### Security Foundation Requirements

#### Constants
- [x] User role definitions (5 roles)
- [x] Account status definitions (5 states)
- [x] Auth configuration constants (attempts, lock duration, OTP config)

#### Utilities
- [x] Password hashing with bcryptjs (hash, compare, strength validation)
- [x] Cryptographically secure OTP generation (node:crypto)

#### Models
- [x] User identity model with security fields and indexes
- [x] Password reset foundation model with TTL index
- [x] Session foundation model with TTL index
- [x] Security event audit model

#### Validators
- [x] Zod schemas for login, password change, password reset, registration

#### Repository/Service Layer
- [x] User repository (database access isolation)
- [x] Auth service (internal security logic)
- [x] Security event service (audit logging with metadata sanitization)

#### Tests
- [x] Password hashing and comparison tests
- [x] OTP generation and format validation tests
- [x] Password strength validation tests
- [x] Auth validator schema tests

### Constraints
- No authentication routes or controllers
- No JWT or token implementation
- No login/registration/logout endpoints
- No frontend authentication UI
- bcryptjs is the only new dependency

## Phase 1B: Authentication APIs (Completed)

### Scope
Implement secure user authentication endpoints.

### Requirements
- [x] User registration with ID generation
- [x] Login with JWT (access + refresh tokens)
- [x] Logout and session management
- [x] Password reset via email OTP
- [x] Protected route middleware
- [x] Security event logging for auth actions

---

## Phase 1C: Authentication Frontend & RBAC (Completed)

### Scope
Integrate Phase 1B backend APIs with React frontend and implement backend Role-Based Access Control (RBAC).

### Requirements
- [x] Backend RBAC middleware (`authorizeRoles`)
- [x] Frontend Axios client with `withCredentials: true` and 401 silent token refresh
- [x] Zustand `useAuthStore` to manage safe user state (no JWTs on client)
- [x] React Router hierarchy with `AuthLayout` and `ProtectedLayout`
- [x] Premium Authentication UI (Login, Register, Forgot/Reset Password, Unauthorized)
- [x] Zod schema alignment between client and server

---

## Phase 2A: Multi-Tenancy & Employee Profiles (Current)

### Scope
Establish multi-tenant architecture and core employee profiles.

### Requirements
#### Backend
- [x] Organization model and API (Tenant root)
- [x] Employee Profile model (Linked to User)
- [x] Tenant isolation middleware (`req.tenantId`)
- [x] Super Admin global bypass for tenant scoping
- [x] Backend integration tests for IDOR and Tenant Isolation

#### Frontend
- [x] Dashboard layout with Sidebar and Header (Lucide Icons)
- [x] Frontend Employee Directory and Profile Pages
- [x] Frontend Organization Settings Page
- [x] Zustand stores for Organization and Employees
- [x] Zod schemas for Organization and Employee creation

---

## Phase 2B: Departments & Teams
- Build department and team structure.

## Phase 2C: Projects & Tasks
- Create projects, task assignment, and tracking.

## Phase 3: Operations
- Leave management
- Attendance management
- Performance management
- Document management

## Phase 4: Intelligence
- AI-powered task assignment recommendations
- Workload analysis
- Performance analytics
- Collaboration analysis
- Management insights

## Phase 5: Automation
- Email automation
- Notification system
- Workflow automation
- Report generation
