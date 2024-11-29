import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { EncryptionService } from "src/encryption/encryption.service";
import { CodePurpose, CodeType } from "src/users/enums/code.enum";
import { UsersService } from "src/users/users.service";
import { ResetPasswordDto } from "../dtos/resetPassword.dto";
import { CodesService } from "src/users/services/codes.service";

@Injectable()
export class ResetPasswordPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly codesService: CodesService
  ) { }

  async transform(body: ResetPasswordDto, metadata: ArgumentMetadata) {
    const user = (await this.usersService.find({ email: body.email }))[0];
    if (!user) throw new NotFoundException("Email not correct.");

    const code = await this.codesService.findCode({
      $and: [
        { code: this.encryptionService.encrypt(body.code) },
        { value: body.email },
        { purpose: CodePurpose.RESET_PASSWORD },
        { type: CodeType.EMAIL },
      ]
    });

    if (!code || code.expireAt < new Date()) {
      if (code) code.deleteOne();
      throw new NotFoundException("Code has expired.");
    };

    body.codeData = code;
    body.user = user;
    
    return body;
  }
}