import { Controller, Get, Req, Res } from "@nestjs/common";
import { CsrfService } from './csrf.service';
import { Request, Response } from "express";
import { ConfigService } from '@nestjs/config';
import { Public } from "src/auth/decorators/public.decorator";

@Controller("csrf")
@Public()
export class CsrfController {
  constructor(
    private readonly csrfService: CsrfService,
    private readonly configService: ConfigService
  ) { }
  
  @Get("token")
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = this.csrfService.generateToken(req, res);
    const headerName = this.configService.get("CSRF_HEADER") || '__Host-psifi.x-csrf-token';

    res.cookie(headerName, token, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === 'production',
      sameSite: 'strict'
    });

    return res.json({
      csrfToken: token
    })
  }
}