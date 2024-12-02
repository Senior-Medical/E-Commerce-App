// csrf/csrf.service.ts
import { Injectable } from '@nestjs/common';
import { DoubleCsrfConfigOptions, DoubleCsrfUtilities, doubleCsrf } from 'csrf-csrf';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  private csrf: DoubleCsrfUtilities;
  constructor(private configService: ConfigService) {
    const CSRF_SECRET = this.configService.get<string>('CSRF_SECRET');
    const CSRF_COOKIE_NAME = this.configService.get<string>('CSRF_COOKIE_NAME') || '__Host-psifi.x-csrf-token';
    const CSRF_HEADER_NAME = this.configService.get<string>('CSRF_HEADER_NAME') || 'x-csrf-token';

    const doubleCsrfOptions: DoubleCsrfConfigOptions = {
      getSecret: () => CSRF_SECRET,
      cookieName: CSRF_COOKIE_NAME,
    };
    this.csrf = doubleCsrf(doubleCsrfOptions);
  }

  generateToken(req: Request, res: Response) {
    return this.csrf.generateToken(req, res);
  }

  doubleCsrfProtection() {
    return this.csrf.doubleCsrfProtection;
  }
}
