import { IsEmail } from "class-validator";
import { Document } from "mongoose";
import { User } from "src/users/entities/users.entity";

/**
 * DTO for requesting password reset via email.
 */
export class RequestToResetPasswordDto{
  @IsEmail()
  readonly email: string;

  user: Document & User;
}