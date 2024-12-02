import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { UsersService } from 'src/users/users.service';

/**
 * Validates if a provided user ID exists in the database.
 */
@Injectable()
export class UserIdValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) { }
  
  async transform(userId: string, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }
}