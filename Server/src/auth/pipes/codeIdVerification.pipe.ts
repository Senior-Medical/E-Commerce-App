import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { UsersService } from '../../users/users.service';
import { CodesService } from '../../users/services/codes.service';

@Injectable()
export class CodeIdVerificationPipe implements PipeTransform{
  constructor(
    private readonly codesService: CodesService
  ) { }
  
  async transform(codeId: string, metadata: ArgumentMetadata) {
    const code = await this.codesService.findCode({_id: codeId});
    if (!code || code.expireAt < new Date()) {
      if (code) code.deleteOne();
      throw new NotFoundException("Code has expired.")
    };
    return code;
  }

}