import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Session foundation model.
 *
 * Stores hashed session/token identifiers for future session management.
 * Raw tokens or secrets are NEVER stored.
 *
 * IMPORTANT: This is a foundation model only.
 *            JWT, session APIs, and authentication middleware
 *            are NOT implemented in Phase 1A.
 *            They will be implemented in Phase 1B.
 */
const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
    },

    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: { expires: 0 }, // TTL index: auto-cleanup of expired sessions
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    /**
     * Safe, non-sensitive metadata about the session.
     * Examples: device type, browser family, login method.
     * NEVER store tokens, passwords, or secrets here.
     */
    metadata: {
      ipAddress: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
      deviceType: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

/**
 * Compound index for finding active sessions for a user.
 */
sessionSchema.index({ user: 1, revokedAt: 1 });

const Session = model('Session', sessionSchema);

export default Session;
