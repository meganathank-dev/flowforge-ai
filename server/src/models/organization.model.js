import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Organization model.
 *
 * Represents a tenant in the multi-tenant architecture.
 */
const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    domain: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for looking up organizations by domain (optional but useful)
organizationSchema.index({ domain: 1 }, { unique: true, partialFilterExpression: { domain: { $type: "string" } } });

const Organization = model('Organization', organizationSchema);

export default Organization;
