import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guards the routes using the local strategy for authentication (email & password).
 * 
 * Inherits from `AuthGuard('local')` to handle local authentication logic.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}