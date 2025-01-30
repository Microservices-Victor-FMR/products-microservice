import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: config.get<string>('NATS_URL'),
          },
        }),inject: [ConfigService],
      },
    ]),
  ],
  exports: [ ClientsModule.registerAsync([
    {
      name: 'NATS_SERVICE',
      useFactory: (config: ConfigService) => ({
        transport: Transport.NATS,
        options: {
          servers: config.get<string>('NATS_URL'),
        },
      }),inject: [ConfigService],
    },
  ]),],
})
export class NatsModule {}

