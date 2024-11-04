import { IsString, Length } from "class-validator";
import { LoginDto } from "./login.dto";

export class ResetPasswordDto extends LoginDto{
  @IsString()
  @Length(6, 6)
  code: string
}