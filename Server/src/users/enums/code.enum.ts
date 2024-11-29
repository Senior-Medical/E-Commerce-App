/**
 * Enum representing different purposes for verification codes.
 */
export enum CodePurpose {
  VERIFY_EMAIL = "Verify Email",
  UPDATE_EMAIL = "Update Email",
  VERIFY_PHONE = "Verify Phone",
  UPDATE_PHONE = "Update Phone",
  RESET_PASSWORD = "Reset Password"
}

/**
 * Enum specifying the type of value associated with the code.
 */
export enum CodeType {
  EMAIL = "email",
  PHONE = "phone"
}