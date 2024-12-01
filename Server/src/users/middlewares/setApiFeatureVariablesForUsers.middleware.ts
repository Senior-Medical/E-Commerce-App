import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class SetApiFeatureVariableForUsers {
  constructor(private readonly usersService: UsersService) {}

  use(req: any, res: any, next: () => void) {
    req.apiFeature = {
      model: this.usersService.getModel(),
      searchArray: this.usersService.getSearchKeys()
    }
    next();
  }
}
