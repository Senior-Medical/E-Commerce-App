import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from "@nestjs/common";
import { Role } from "src/auth/enums/roles.enum";
import { Types } from "mongoose";

/**
 * Base class for permission guards.
 * - Ensures the entity exists.
 * - Validates that customers can only access their own entities.
 */
@Injectable()
export abstract class PermissionBaseGuard implements CanActivate{
  
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const id = request.params[`${this.getEntityKeyInRequest()}Id`];
    if (!Types.ObjectId.isValid(id)) throw new NotAcceptableException("Invalid Mongo Id");

    const entity = await this.findEntity(id);
    if (!entity) throw new NotFoundException("Document not found");

    const user = request.user;
    if (user.role === Role.customer && user._id.toString() !== this.getEntityOwnerId(entity)) return false;

    request[this.getEntityKeyInRequest()] = entity;
    return true;
  }

  abstract findEntity(id: string): Promise<any>;
  abstract getEntityOwnerId(entity: any): string;
  abstract getEntityKeyInRequest(): string;
}