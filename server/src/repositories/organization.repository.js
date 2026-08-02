import Organization from '../models/organization.model.js';

/**
 * Create a new organization.
 *
 * @param {object} data
 * @param {string} data.name
 * @param {string} [data.domain]
 * @param {object} [data.settings]
 * @returns {Promise<object>}
 */
export const createOrganization = async (data) => {
  return Organization.create(data);
};

/**
 * Find an organization by its ID.
 *
 * @param {string} id - Organization ObjectId
 * @returns {Promise<object|null>}
 */
export const findById = async (id) => {
  return Organization.findById(id).exec();
};

/**
 * Find an organization by its domain.
 *
 * @param {string} domain
 * @returns {Promise<object|null>}
 */
export const findByDomain = async (domain) => {
  return Organization.findOne({ domain: domain.toLowerCase().trim() }).exec();
};
