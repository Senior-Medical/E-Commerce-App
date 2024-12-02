import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsOptional
} from "class-validator";

/**
 * Defines the structure and validation rules for creating a new user.
 */
export class CreateUsersDto {
  /**
   * The name of the user.
   * - Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  
  /**
   * The username of the user (optional).
   * - Can only contain letters, numbers, and underscores.
   * - Must be between 3 and 16 characters long.
   */
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,16}$/, {
    message: "Username can contain letters, numbers, and underscores only, and must be between 3 and 16 characters long."
  })
  readonly username?: string;
  
  /**
   * The phone number of the user (optional).
   * - Must be in a valid international format, e.g., +12345678901.
   */
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be in a valid international format, e.g., +12345678901."
  })
  @IsOptional()
  readonly phone?: string;

  /**
   * The email address of the user.
   * - Must be a valid email format.
   */
  @IsEmail()
  readonly email: string;

  /**
   * The password for the user account.
   * - Must be at least 8 characters long.
   * - Must include at least one uppercase letter, one lowercase letter, one number, and one special character.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
  readonly password: string;

  /**
   * A short biography of the user (optional).
   */
  @IsString()
  readonly bio?: string;

  /**
   * The company name associated with the user (optional).
   */
  @IsString()
  readonly company?: string;
}