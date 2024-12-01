import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { EncryptionService } from "src/encryption/encryption.service";
import { CodePurpose, CodeType } from "src/users/enums/code.enum";
import { UsersService } from "src/users/users.service";
import { ResetPasswordDto } from "../dtos/resetPassword.dto";
import { CodesService } from "src/users/services/codes.service";

/**
 * Validates the user's reset password code and checks if it's expired.
 */
@Injectable()
export class ResetPasswordPipe implements PipeTransform {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly codesService: CodesService
  ) { }

  /**
   * - Checks if the user's email is valid.
   * - Verifies if the reset code is correct and has not expired.
   * - Throws `NotFoundException` if email or code is invalid.
   * - Returns the `ResetPasswordDto` object if all checks pass.
   * 
   * @param body - body of the request
   * @param metadata - metadata of the request
   * @returns `ResetPasswordDto` object
   */
  async transform(body: ResetPasswordDto, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOneByCondition({ email: body.email });
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