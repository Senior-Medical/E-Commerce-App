import { IsEmail } from "class-validator";
import { Document } from "mongoose";

/**
 * DTO for requesting password reset via email.
 */
export class RequestToResetPasswordDto{
  @IsEmail()
  readonly email: string;

  user: Document;
}