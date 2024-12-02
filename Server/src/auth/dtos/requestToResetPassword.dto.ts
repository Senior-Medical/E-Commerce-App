import { IsEmail } from "class-validator";
import { UserDocument } from "src/users/entities/users.entity";

/**
 * DTO for requesting password reset via email.
 */
export class RequestToResetPasswordDto{
  @IsEmail()
  readonly email: string;

  user: UserDocument;
}