import { createTransport } from 'nodemailer';
import env from '../config/env.config.js';
import logger from '../utils/logger.js';

/**
 * Email service — SMTP email delivery abstraction.
 *
 * If SMTP is not configured (SMTP_HOST is empty), the service
 * degrades gracefully:
 * - In development: logs that an email would be sent (NEVER logs the OTP)
 * - In production: logs a warning
 * - Never crashes the server
 *
 * SECURITY: Never log OTP values, SMTP passwords, or credentials.
 */

/**
 * Create a nodemailer transporter if SMTP is configured.
 * Returns null if SMTP_HOST is not set.
 *
 * @returns {object|null} Nodemailer transporter or null
 */
const createMailTransporter = () => {
  if (!env.SMTP_HOST) {
    return null;
  }

  return createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

let transporter = null;

/**
 * Get or create the mail transporter singleton.
 *
 * @returns {object|null} Nodemailer transporter or null
 */
const getTransporter = () => {
  if (transporter === null && env.SMTP_HOST) {
    transporter = createMailTransporter();
  }
  return transporter;
};

/**
 * Send a password reset email containing the OTP.
 *
 * If SMTP is not configured, the email is not sent but the operation
 * does not fail — the server continues normally.
 *
 * SECURITY:
 * - Never log the OTP
 * - Never log SMTP credentials
 * - Never return the OTP in any response
 *
 * @param {string} email - Recipient email address
 * @param {string} otp - The plaintext OTP (sent to user, NEVER logged)
 * @returns {Promise<boolean>} True if the email was sent (or skipped gracefully)
 */
export const sendPasswordResetEmail = async (email, otp) => {
  const mailer = getTransporter();

  if (!mailer) {
    if (env.NODE_ENV === 'development') {
      logger.info(`[DEV] Password reset email would be sent to ${email}`);
    } else {
      logger.warn('SMTP not configured — password reset email not sent');
    }
    return true;
  }

  try {
    await mailer.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'FlowForge AI — Password Reset',
      text: [
        'You have requested a password reset for your FlowForge AI account.',
        '',
        `Your verification code is: ${otp}`,
        '',
        'This code will expire in 10 minutes.',
        'If you did not request this reset, please ignore this email.',
        '',
        '— FlowForge AI',
      ].join('\n'),
      html: [
        '<h2>Password Reset Request</h2>',
        '<p>You have requested a password reset for your FlowForge AI account.</p>',
        `<p>Your verification code is: <strong>${otp}</strong></p>`,
        '<p>This code will expire in 10 minutes.</p>',
        '<p>If you did not request this reset, please ignore this email.</p>',
        '<br><p>— FlowForge AI</p>',
      ].join('\n'),
    });

    logger.info(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    // Log the error but do not crash — email failure should not break the flow
    logger.error('Failed to send password reset email:', {
      error: error.message,
      recipient: email,
    });
    return false;
  }
};
