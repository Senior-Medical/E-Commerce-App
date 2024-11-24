import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserIdValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) { }
  async transform(userId: any, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }
}