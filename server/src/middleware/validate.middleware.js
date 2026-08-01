import { ValidationError } from '../errors/app.error.js';

/**
 * Create a Zod validation middleware.
 *
 * Validates request body, params, and/or query against the provided Zod schema(s).
 *
 * @param {object} schemas
 * @param {import('zod').ZodSchema} [schemas.body] - Schema for request body
 * @param {import('zod').ZodSchema} [schemas.params] - Schema for route params
 * @param {import('zod').ZodSchema} [schemas.query] - Schema for query string
 * @returns {import('express').RequestHandler}
 */
export const validate = (schemas) => {
  return (req, _res, next) => {
    const errors = [];

    for (const [source, schema] of Object.entries(schemas)) {
      if (!schema) continue;

      const result = schema.safeParse(req[source]);

      if (!result.success) {
        const fieldErrors = result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          source,
        }));
        errors.push(...fieldErrors);
      } else {
        // Replace with parsed/coerced values
        req[source] = result.data;
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  };
};
