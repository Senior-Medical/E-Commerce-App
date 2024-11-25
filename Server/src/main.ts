import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './common/services/customLogger.service';
// import { DoubleCsrfConfigOptions, doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const customLogger = app.get(CustomLogger);
  customLogger.clearLogFile();
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>("GLOBAL_PREFIX")
  const defaultVersion = configService.get<string>("DEFAULT_VERSION") || "1";
  const port = configService.get<number>("PORT") || 3000;


  app.useLogger(app.get(CustomLogger));
  app.use(helmet());
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: defaultVersion,
  });

  // const doubleCsrfOptions: DoubleCsrfConfigOptions = {
  //   getSecret: () => configService.get<string>("CSRF_SECRET"),
  // };
  // const {
  //   invalidCsrfTokenError, // This is provided purely for convenience if you plan on creating your own middleware.
  //   generateToken, // Use this in your routes to generate and provide a CSRF hash, along with a token cookie and token.
  //   validateRequest, // Also a convenience if you plan on making your own middleware.
  //   doubleCsrfProtection, // This is the default CSRF protection middleware.
  // } = doubleCsrf(doubleCsrfOptions);
  // app.use(doubleCsrfProtection);



  await app.listen(port, () => {
    const baseUrl = configService.get<string>("BASE_URL") || `http://localhost:${port}`;
    Logger.log(`Server listen on link: ${baseUrl}/${globalPrefix}/v${defaultVersion}`, 'Bootstrap');
  });
}
bootstrap();
