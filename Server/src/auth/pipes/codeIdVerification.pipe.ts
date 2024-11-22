import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { UsersService } from '../../users/users.service';

@Injectable()
export class CodeIdVerificationPipe implements PipeTransform{
  constructor(private readonly usersService: UsersService) { }
  
  async transform(codeId: string, metadata: ArgumentMetadata) {
    const code = await this.usersService.findCode(codeId);
    if (!code || code.expireAt < new Date()) {
      if (code) code.deleteOne();
      throw new NotFoundException("Code has expired.")
    };
    return code;
  }

}