import { Module } from '@nestjs/common';
import { MarketDataService } from './services/market-data/market-data.service';
import { CryptoController } from './crypto.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { CryptoService } from './services/crypto/crypto.service';
import { TimeLogicService } from './services/time-logic/time-logic.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { fetchConfig } from 'config/fetch.config';

@Module({
  imports: [ConfigModule.forFeature(fetchConfig), DatabaseModule],
  providers: [ConfigService, DatabaseService, MarketDataService, CryptoService, TimeLogicService],
  controllers: [CryptoController]
})
export class CryptoModule { }
