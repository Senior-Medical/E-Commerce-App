import { IsString, IsNotEmpty, IsEmail, Matches, IsOptional } from "class-validator";

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,16}$/, {
    message: "Username can contain letters, numbers, and underscores only, and must be between 3 and 16 characters long."
  })
  readonly username?: string;
  
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be in a valid international format, e.g., +12345678901."
  })
  @IsOptional()
  readonly phone?: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
  readonly password: string;
  
  @IsString()
  readonly bio?: string;
  
  @IsString()
  readonly company?: string;
}