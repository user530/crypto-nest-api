import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { PriceTimestamp } from './database/entities/priceTimestamp.entity';

@Controller()
export class AppController {
  constructor(private readonly dbService: DatabaseService) { }

  @Get()
  async getHello(): Promise<PriceTimestamp[]> {
    return await this.dbService.getAll();
  }
}
