import { z } from 'zod';

/**
 * Authentication validation schemas.
 *
 * These are Zod schemas for validating request data
 * for future authentication operations.
 *
 * IMPORTANT: These are validation schemas ONLY.
 *            No routes or controllers use these yet.
 *            Phase 1B will wire these into the auth routes.
 */

/**
 * Shared field schemas for reuse across auth validators.
 */
const emailField = z
  .string({ required_error: 'Email is required' })
  .email('Invalid email format')
  .trim()
  .toLowerCase()
  .max(255, 'Email must be at most 255 characters');

const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

const otpField = z
  .string({ required_error: 'OTP is required' })
  .regex(/^\d{6}$/, 'OTP must be a 6-digit numeric code');

const employeeIdField = z
  .string({ required_error: 'Employee ID is required' })
  .trim()
  .min(1, 'Employee ID is required')
  .max(50, 'Employee ID must be at most 50 characters');

/**
 * Login request validation schema.
 */
export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/**
 * Password change request validation schema.
 * Requires the current password and a new password.
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: passwordField,
    confirmNewPassword: z
      .string({ required_error: 'Password confirmation is required' })
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Password reset request validation schema.
 * Initiates a password reset by providing the email.
 */
export const passwordResetRequestSchema = z.object({
  email: emailField,
});

/**
 * Password reset OTP verification schema.
 * Verifies the OTP sent during password reset.
 */
export const passwordResetVerifySchema = z.object({
  email: emailField,
  otp: otpField,
});

/**
 * Password reset completion schema.
 * Sets the new password after OTP verification.
 */
export const passwordResetCompleteSchema = z
  .object({
    email: emailField,
    otp: otpField,
    newPassword: passwordField,
    confirmNewPassword: z
      .string({ required_error: 'Password confirmation is required' })
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

/**
 * Registration validation schema (for future use).
 */
export const registrationSchema = z.object({
  employeeId: employeeIdField,
  email: emailField,
  password: passwordField,
});
