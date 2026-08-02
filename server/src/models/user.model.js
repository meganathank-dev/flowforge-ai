import mongoose from 'mongoose';
import { ROLE_VALUES, DEFAULT_ROLE } from '../constants/roles.js';
import {
  ACCOUNT_STATUS_VALUES,
  DEFAULT_ACCOUNT_STATUS,
} from '../constants/account-status.js';

const { Schema, model } = mongoose;

/**
 * User identity and security model.
 *
 * This model focuses on authentication and identity fields.
 * Business/employee profile fields belong in separate models
 * to be created in future phases.
 */
const userSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
      default: null,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'EmployeeProfile',
      index: true,
      default: null,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never returned in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ROLE_VALUES,
        message: '{VALUE} is not a valid role',
      },
      default: DEFAULT_ROLE,
      index: true,
    },

    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUS_VALUES,
        message: '{VALUE} is not a valid account status',
      },
      default: DEFAULT_ACCOUNT_STATUS,
      index: true,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // Never expose password hash in JSON serialization
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

/**
 * Compound index for common query patterns.
 */
userSchema.index({ email: 1, accountStatus: 1 });
userSchema.index({ employeeId: 1, accountStatus: 1 });

const User = model('User', userSchema);

export default User;
