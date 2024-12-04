import {
  ArgumentMetadata,
  ConflictException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUsersDto } from '../dtos/createUser.dto';

/**
 * Validates user data to ensure uniqueness for email, phone, or username.
 */
@Injectable()
export class UserValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) { }
  
  async transform(body: CreateUsersDto, metadata: ArgumentMetadata) {
    console.log(body)
    let { email, phone, username } = body;
    const filters = []
    const objFilter = {};

    if (email) filters.push({ email });
    if (phone) filters.push({ phone });
    if (username) filters.push({ username });
    
    if (filters.length !== 0) {
      const user = await this.usersService.findOneByCondition(objFilter);
      if (user) throw new ConflictException('Email, phone or username are already exist.');
    }
    return body;
  }
}
