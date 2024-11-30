// csrf/csrf.service.ts
import { Injectable } from '@nestjs/common';
import { DoubleCsrfConfigOptions, DoubleCsrfUtilities, doubleCsrf } from 'csrf-csrf';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CsrfService {
  private csrf: DoubleCsrfUtilities;
  constructor(private configService: ConfigService) {
    const doubleCsrfOptions: DoubleCsrfConfigOptions = {
      getSecret: () => this.configService.get<string>('CSRF_SECRET'),
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
