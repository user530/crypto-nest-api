import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from 'config/db.config';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule { }
