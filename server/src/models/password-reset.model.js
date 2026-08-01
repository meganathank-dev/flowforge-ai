import mongoose from 'mongoose';
import { OTP_MAX_ATTEMPTS } from '../constants/auth.constants.js';

const { Schema, model } = mongoose;

/**
 * Password reset foundation model.
 *
 * Stores hashed OTP values for password reset operations.
 * The raw OTP is NEVER stored — only the bcrypt hash.
 *
 * IMPORTANT: This is a foundation model only.
 *            Password reset routes/APIs are NOT implemented in Phase 1A.
 *            They will be implemented in Phase 1B.
 */
const passwordResetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    otpHash: {
      type: String,
      required: [true, 'OTP hash is required'],
    },

    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: { expires: 0 }, // TTL index: document removed when expiresAt is reached
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: OTP_MAX_ATTEMPTS,
    },

    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Compound index for looking up active (unused, unexpired) reset requests.
 */
passwordResetSchema.index({ user: 1, used: 1 });

const PasswordReset = model('PasswordReset', passwordResetSchema);

export default PasswordReset;
