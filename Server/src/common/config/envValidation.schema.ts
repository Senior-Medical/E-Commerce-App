import * as Joi from 'joi';

/**
 * envVariablesValidationSchema
 * 
 * A Joi schema used to validate environment variables, ensuring required configuration values are provided and meet certain constraints. 
 * It covers various categories such as server settings, JWT configuration, encryption keys, file upload settings, Twilio & SendGrid credentials, throttling limits, and CSRF protection.
 * 
 * - Server: Defines basic configurations like server port, database URI, and global prefix.
 * - JWT: Validates JWT secrets and expiration times for access and refresh tokens.
 * - Encryption: Ensures the presence and proper length of encryption-related settings.
 * - Multer: Configures file upload size limits and upload folder paths.
 * - Twilio: Requires Twilio account SID, authentication token, and phone number in E.164 format.
 * - SendGrid: Ensures API key and sender email are correctly set.
 * - Throttler: Validates rate limiting settings.
 * - CSRF: Ensures the CSRF secret is properly configured for protection against cross-site request forgery.
 */
export const envVariablesValidationSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string().default("development").required(),
  PORT: Joi.number().default(3000).required(),
  GLOBAL_PREFIX: Joi.string().default('api').required(),
  DB_URI: Joi.string().uri().required(),
  EXPIRE_TIME_FOR_CODES: Joi.number().integer().positive().required(),
  BASE_URL: Joi.string().uri().required(),
  DEFAULT_VERSION: Joi.string().default('1').required(),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().regex(/^\d+[smhd]$/).required(), // e.g., "10m", "1h", "7d"
  JWT_REFRESH_EXPIRATION: Joi.string().regex(/^\d+[smhd]$/).required(), // e.g., "10m", "1h", "7d"
  // Encryption
  BCRYPT_GENERATION_SALT_NUMBER: Joi.number().integer().min(1).required(),
  ENCRYPTION_KEY: Joi.string().length(32).required(),
  ENCRYPTION_IV: Joi.string().length(16).required(),
  ENCRYPTION_ALGORITHM: Joi.string().default('aes-256-cbc').required(),

  // Multer
  MULTER_MAX_FILE_SIZE: Joi.number().integer().positive().required(),
  MULTER_UPLOADS_FOLDER: Joi.string().default('uploads').required(),

  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(), // E.164 format

  // SendGrid
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().email().required(),

  // Throttler
  THROTTLE_TTL: Joi.number().integer().positive().default(60).required(),
  THROTTLE_LIMIT: Joi.number().integer().positive().default(10).required(),
  
  // CSRF
  CSRF_SECRET: Joi.string().min(32).required(),
  CSRF_HEADER: Joi.string().min(32).required(),
});
