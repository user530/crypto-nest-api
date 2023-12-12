import { Module } from '@nestjs/common';
import { FetchMarketDataService } from './services/fetch-market-data/fetch-market-data.service';
import { CryptoController } from './crypto.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { CryptoService } from './services/crypto/crypto.service';
import { TimeLogicService } from './services/time-logic/time-logic.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { fetchConfig } from 'config/fetch.config';

@Module({
  imports: [ConfigModule.forFeature(fetchConfig), DatabaseModule],
  providers: [ConfigService, DatabaseService, FetchMarketDataService, CryptoService, TimeLogicService],
  controllers: [CryptoController]
})
export class CryptoModule { }
