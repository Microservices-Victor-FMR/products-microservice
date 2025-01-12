import { Module } from '@nestjs/common';
import { envSchema } from 'env.config';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: { abortEarly: true },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
