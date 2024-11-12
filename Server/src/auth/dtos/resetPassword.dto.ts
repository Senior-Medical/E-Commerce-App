import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

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
}