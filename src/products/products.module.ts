import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { ErrorHandlerService } from 'src/common/errors/error-handler-service';
import { NatsModule } from 'src/transports/nats.module';
@Module({
  imports:[NatsModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService,ErrorHandlerService],
})
export class ProductsModule {}
