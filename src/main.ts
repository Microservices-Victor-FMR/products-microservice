import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main');

  const appContext = await NestFactory.create(AppModule);
  const configService = appContext.get(ConfigService);
  const port = configService.get<number>('PORT');
  const nastsUrl = configService.get<string>('NATS_URL')
  appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [nastsUrl],
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform:true
      //disableErrorMessages: true,
    }),
  );
  await app.listen();
  logger.log(`Microservice is listening on port ${port}`)
  logger.log(`PRODUCTS MICROSERVICE is running on Port: ${port}`);
}
bootstrap();
