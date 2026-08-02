// Set required environment variables before any tests or app code run.
// This prevents env.config.js Zod validation from throwing errors during test initialization.

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-testing';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_ISSUER = 'flowforge-ai-test';
