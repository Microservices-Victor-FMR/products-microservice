import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions ,Transport} from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
const port = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,{
      transport: Transport.TCP,
      options:{port:port}
    });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //disableErrorMessages: true,
    }),
  );
  await app.listen();
  logger.log(`Products Microservices running on Port: ${process.env.PORT}`);
}
bootstrap();
