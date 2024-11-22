import { IsEmail } from "class-validator";
import { Document } from "mongoose";

export class RequestToResetPasswordDto{
  @IsEmail()
  readonly email: string;

  user: Document;
}