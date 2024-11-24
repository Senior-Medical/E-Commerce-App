import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Incorrect old password."
  })
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
  readonly newPassword: string;
}