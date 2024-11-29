import { IsNotEmpty, IsString, Matches } from "class-validator";
/**
 * Defines the structure and validation rules for updating a user's password.
 */
export class UpdatePasswordDto {
  /**
   * The current password of the user.
   * - Must match the required password format.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Incorrect old password."
  })
  readonly oldPassword: string;

  /**
   * The new password for the user account.
   * - Must be at least 8 characters long.
   * - Must include at least one uppercase letter, one lowercase letter, one number, and one special character.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
  readonly newPassword: string;
}