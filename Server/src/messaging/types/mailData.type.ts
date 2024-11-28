/**
 * - Type definition for the data required to send an email.
 * - Includes recipient, message content, and subject.
 */
export type MailData = {
  to: string,
  message: string,
  subject: string
};