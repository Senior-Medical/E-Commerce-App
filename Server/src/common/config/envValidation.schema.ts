import * as Joi from 'joi';

export const envVariablesValidationSchema = Joi.object({
  // Server
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
});
