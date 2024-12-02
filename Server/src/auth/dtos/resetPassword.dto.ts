import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches
} from "class-validator";
import { UserDocument } from "src/users/entities/users.entity";
import { VerificationCodesDocument } from "src/users/entities/verificationCodes.entity";

/**
 * DTO for resetting password with validation for email, password, and reset code.
 */
export class ResetPasswordDto{
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
  readonly password: string;

  @IsString()
  @Length(6, 6)
  readonly code: string;

  codeData: VerificationCodesDocument;
  user: UserDocument;
}