import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { CodesService } from '../services/codes.service';

/**
 * Validates if the code ID exists and if the code has expired.
 */
@Injectable()
export class CodeIdVerificationPipe implements PipeTransform{
  constructor(
    private readonly codesService: CodesService
  ) { }

  /**
   * - Verifies if the code ID exists and if the code has expired.
   * - Throws `NotFoundException` if the code ID doesn't exist or the code has expired.
   * 
   * @param codeId - Code ID
   * @param metadata - Argument metadata
   * @returns code document if all checks pass
   */
  async transform(codeId: string, metadata: ArgumentMetadata) {
    const code = await this.codesService.findCode({_id: codeId});
    if (!code || code.expireAt < new Date()) {
      if (code) code.deleteOne();
      throw new NotFoundException("Code has expired.")
    };
    return code;
  }

}