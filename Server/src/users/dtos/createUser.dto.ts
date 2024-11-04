import { IsString, IsNotEmpty, Length, IsEmail, Matches } from "class-validator";

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,16}$/, {
    message: "Username can contain letters, numbers, and underscores only, and must be between 3 and 16 characters long"
  })
  username?: string
  
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be in a valid international format, e.g., +12345678901"
  })
  phone?: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  })
  password: string
  
  // avatar?: File
  
  @IsString()
  bio?: string
  
  @IsString()
  company?: string
}