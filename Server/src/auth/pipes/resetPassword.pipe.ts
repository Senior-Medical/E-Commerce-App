import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { ResetPasswordDto } from "../dtos/resetPassword.dto";
import { UsersService } from "src/users/users.service";
import { CodePurpose, CodeType } from "src/users/enums/codePurpose.enum";
import { EncryptionService } from "src/common/services/encryption.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) { }

  async transform(body: ResetPasswordDto, metadata: ArgumentMetadata) {
    const user = (await this.usersService.find({ email: body.email }))[0];
    if (!user) throw new NotFoundException("Email not correct.");

    const encryptionService = new EncryptionService(this.configService);

    const code = (await this.usersService.findCode({
      $and: [
        { code: encryptionService.encrypt(body.code) },
        { value: body.email },
        { purpose: CodePurpose.RESET_PASSWORD },
        { type: CodeType.EMAIL },
      ]
    }))[0];

    if (!code || code.expireAt < new Date()) {
      if (code) code.deleteOne();
      throw new NotFoundException("Code has expired.");
    };

    body.codeData = code;
    body.user = user;
    
    return body;
  }
}