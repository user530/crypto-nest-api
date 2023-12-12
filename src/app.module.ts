import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from 'config/db.config';
import { CryptoModule } from './crypto/crypto.module';
import { fetchConfig } from 'config/fetch.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, fetchConfig],
    }),
    CryptoModule,
  ],
})
export class AppModule { }
