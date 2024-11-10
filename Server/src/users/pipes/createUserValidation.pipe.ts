import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUsersDto } from '../dtos/createUser.dto';
import { UsersService } from '../users.service';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) { }
  
  async transform(body: CreateUsersDto, metadata: ArgumentMetadata) {
    let { email, phone, username } = body;
    const user = await this.usersService.findOne({
      $or: [
        { email },
        { phone },
        { username },
      ]
    });
    if (user) throw new HttpException('User already exist.', HttpStatus.CONFLICT);
    else return body;
  }
}
