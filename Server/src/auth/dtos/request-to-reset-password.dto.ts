import { IsEmail } from "class-validator";

export class RequestToResetPasswordDto{
  @IsEmail()
  email: string
}