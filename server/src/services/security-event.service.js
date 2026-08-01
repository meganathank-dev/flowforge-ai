import SecurityEvent, {
  FORBIDDEN_METADATA_FIELDS,
} from '../models/security-event.model.js';
import logger from '../utils/logger.js';

/**
 * Security event service.
 *
 * Provides a reusable interface for creating security event records.
 * All metadata is sanitized before persistence to prevent
 * accidental storage of sensitive information.
 */

/**
 * Sanitize metadata by removing forbidden fields.
 *
 * Recursively removes any field whose key (case-insensitive)
 * matches a known sensitive field name.
 *
 * @param {*} data - The metadata to sanitize
 * @returns {*} Sanitized copy of the metadata
 */
export const sanitizeMetadata = (data) => {
  if (data === null || data === undefined) return {};
  if (typeof data !== 'object') return {};
  if (Array.isArray(data)) return data.map(sanitizeMetadata);

  const lowerForbidden = FORBIDDEN_METADATA_FIELDS.map((f) => f.toLowerCase());
  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    if (lowerForbidden.includes(key.toLowerCase())) {
      continue; // Skip forbidden fields entirely
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeMetadata(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(sanitizeMetadata);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Create a security event record.
 *
 * @param {object} params
 * @param {string} [params.userId] - The user's ObjectId (optional for events like failed login by unknown user)
 * @param {string} params.eventType - The type of security event
 * @param {string} [params.ipAddress] - The client's IP address
 * @param {string} [params.userAgent] - The client's user agent string
 * @param {object} [params.metadata] - Additional context (will be sanitized)
 * @returns {Promise<object>} The created security event document
 */
export const createSecurityEvent = async ({
  userId = null,
  eventType,
  ipAddress = null,
  userAgent = null,
  metadata = {},
}) => {
  try {
    const sanitizedMetadata = sanitizeMetadata(metadata);

    const event = await SecurityEvent.create({
      user: userId,
      eventType,
      ipAddress,
      userAgent,
      metadata: sanitizedMetadata,
    });

    return event;
  } catch (error) {
    // Log but don't throw — security event logging should not
    // break the primary operation flow.
    logger.error('Failed to create security event:', {
      eventType,
      error: error.message,
    });

    return null;
  }
};

/**
 * Query security events for a specific user.
 *
 * @param {string} userId - The user's ObjectId
 * @param {object} [options]
 * @param {string} [options.eventType] - Filter by event type
 * @param {number} [options.limit=50] - Maximum number of events to return
 * @returns {Promise<Array>} Array of security event documents
 */
export const getSecurityEventsByUser = async (
  userId,
  { eventType = null, limit = 50 } = {},
) => {
  const filter = { user: userId };

  if (eventType) {
    filter.eventType = eventType;
  }

  return SecurityEvent.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};
