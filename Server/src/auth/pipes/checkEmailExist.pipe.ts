import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
  UnauthorizedException
} from "@nestjs/common";
import { UsersService } from '../../users/users.service';

/**
 * Validates if the email exists in the database and checks if the user is verified.
 */
@Injectable()
export class CheckEmailExistPipe implements PipeTransform{
  constructor(private readonly usersService: UsersService) { }
  
  /**
   * Checks if the email is associated with an existing, verified user.
   * Throws `NotFoundException` if the user does not exist.
   * Throws `UnauthorizedException` if the user is not verified.
   * 
   * @param param0 - object containing the email
   * @param metadata - metadata about the value being processed
   * @returns - object containing the email and user document
   */
  async transform({email}: {email:string}, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOneByCondition({ email });
    if (!user) throw new NotFoundException("User not found.");
    if (!user.verified) throw new UnauthorizedException("User not verified.");
    
    return { email, user };
  }

}