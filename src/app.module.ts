import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from 'config/db.config';
// import { AppController } from './app.controller';
// import { DatabaseModule } from './database/database.module';
// import { DatabaseService } from './database/database.service';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    CryptoModule,
  ],
  // controllers: [AppController],
  // providers: [DatabaseService],
})
export class AppModule { }
