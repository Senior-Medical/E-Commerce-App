import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
// import { doubleCsrf } from 'csrf-csrf';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  app.use(helmet());

  const configService = app.get(ConfigService);

  const GLOBAL_PREFIX = configService.get<string>("GLOBAL_PREFIX")
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
  }));
  
  // const {
  //   invalidCsrfTokenError, // This is provided purely for convenience if you plan on creating your own middleware.
  //   generateToken, // Use this in your routes to generate and provide a CSRF hash, along with a token cookie and token.
  //   validateRequest, // Also a convenience if you plan on making your own middleware.
  //   doubleCsrfProtection, // This is the default CSRF protection middleware.
  // } = doubleCsrf(doubleCsrfOptions);
  // app.use(doubleCsrfProtection);

  const defaultVersion = configService.get<string>("DEFAULT_VERSION") || "1";
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: defaultVersion,
  });

  const PORT = configService.get<number>("PORT") || 3000;
  await app.listen(PORT, () => {
    const baseUrl = configService.get<string>("BASE_URL") || `http://localhost:${PORT}`;
    // console.log(`Server listen on link: ${baseUrl}/${GLOBAL_PREFIX}/v${defaultVersion}`);
    Logger.log(`Server listen on link: ${baseUrl}/${GLOBAL_PREFIX}/v${defaultVersion}`, 'Bootstrap');
  });
}
bootstrap();
