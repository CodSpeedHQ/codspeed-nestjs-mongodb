import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: globalThis.__MONGO_URI__ ?? process.env.MONGO_URL,
      }),
    }),
    CatsModule,
  ],
})
export class AppModule {}
