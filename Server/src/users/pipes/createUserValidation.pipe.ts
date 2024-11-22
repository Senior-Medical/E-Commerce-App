import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUsersDto } from '../dtos/createUser.dto';
import { UsersService } from '../users.service';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) { }
  
  async transform(body: CreateUsersDto, metadata: ArgumentMetadata) {
    let { email, phone, username } = body;
    const user = (await this.usersService.find({
      $or: [
        { email },
        { phone },
        { username },
      ]
    }))[0];
    if (user) throw new HttpException('Email, phone or username are already exist.', HttpStatus.CONFLICT);
    else return body;
  }
}
