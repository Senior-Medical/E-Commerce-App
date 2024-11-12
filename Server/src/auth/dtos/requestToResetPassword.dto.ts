import { IsEmail } from "class-validator";

export class RequestToResetPasswordDto{
  @IsEmail()
  readonly email: string;
}