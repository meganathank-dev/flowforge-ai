import mongoose from 'mongoose';
import { SECURITY_EVENT_VALUES } from '../constants/auth.constants.js';

const { Schema, model } = mongoose;

/**
 * Fields that must NEVER be persisted in security event metadata.
 * Used by the sanitization logic in the security event service.
 */
export const FORBIDDEN_METADATA_FIELDS = Object.freeze([
  'password',
  'passwordHash',
  'otp',
  'otpHash',
  'token',
  'accessToken',
  'refreshToken',
  'jwt',
  'sessionToken',
  'sessionSecret',
  'apiKey',
  'apiSecret',
  'secret',
  'dbPassword',
  'databasePassword',
  'connectionString',
  'mongodbUri',
  'authorization',
  'cookie',
  'creditCard',
  'ssn',
]);

/**
 * Security event model.
 *
 * Records security-relevant events for audit and monitoring.
 * Metadata is sanitized before persistence to prevent
 * accidental storage of sensitive information.
 */
const securityEventSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: SECURITY_EVENT_VALUES,
        message: '{VALUE} is not a valid security event type',
      },
      index: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    /**
     * Additional context about the event.
     * Must be sanitized — no secrets, passwords, tokens, or hashes.
     */
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  },
);

/**
 * Compound indexes for common query patterns.
 */
securityEventSchema.index({ user: 1, eventType: 1 });
securityEventSchema.index({ eventType: 1, timestamp: -1 });

const SecurityEvent = model('SecurityEvent', securityEventSchema);

export default SecurityEvent;
