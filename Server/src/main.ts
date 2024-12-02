import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CustomLoggerService } from './logger/logger.service';
import { CsrfService } from './csrf/csrf.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>("GLOBAL_PREFIX")
  const defaultVersion = configService.get<string>("DEFAULT_VERSION") || "1";
  const port = configService.get<number>("PORT") || 3000;


  app.useLogger(app.get(CustomLoggerService));
  app.use(helmet());
  app.use(cookieParser(configService.get<string>('CSRF_SECRET')));
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: defaultVersion,
  });

  // const csrfService = app.get(CsrfService);
  // app.use(csrfService.doubleCsrfProtection());

  await app.listen(port, () => {
    const baseUrl = configService.get<string>("BASE_URL") || `http://localhost:${port}`;
    Logger.log(`Server listen on link: ${baseUrl}/${globalPrefix}/v${defaultVersion}`, 'Bootstrap');
  });
}
bootstrap();
