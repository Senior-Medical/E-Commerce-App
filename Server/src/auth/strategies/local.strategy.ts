import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from '../auth.service';

/**
 * Local Strategy for Passport.
 * 
 * Validates user login credentials (email and password).
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  /**
   * Verifies the user's email and password.
   * Throws `NotFoundException` if the user is not found.
   * 
   * @param email user's email
   * @param password user's password
   * @returns user document if the user is found
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }
}