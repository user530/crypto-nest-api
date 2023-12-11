import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from 'config/db.config';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    CryptoModule,
  ],
})
export class AppModule { }
