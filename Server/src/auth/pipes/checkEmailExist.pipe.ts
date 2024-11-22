import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { UsersService } from '../../users/users.service';

@Injectable()
export class CheckEmailExistPipe implements PipeTransform{
  constructor(private readonly usersService: UsersService) { }
  
  async transform({email}: {email:string}, metadata: ArgumentMetadata) {
    const user = (await this.usersService.find({ email }))[0];
    if (!user) throw new NotFoundException("User not found.");
    if (!user.verified) throw new UnauthorizedException("User not verified.");
    
    return {
      email,
      user
    };
  }

}