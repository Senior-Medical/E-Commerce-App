/**
 * - Type definition for the data required to send an SMS.
 * - Includes recipient phone number and message content.
 */
export type SmsData = {
  to: string,
  message: string
};