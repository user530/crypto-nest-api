import { Controller, Get, Query } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { PriceTimestamp } from './database/entities/priceTimestamp.entity';
import { AddPriceTimestampDTO } from './database/dtos/priceTimestamp.dto';
import { CryptoTickers } from './shared/enums/tickers.enum';

@Controller()
export class AppController {
  constructor(private readonly dbService: DatabaseService) { }

  @Get()
  async getHello(): Promise<PriceTimestamp[]> {
    return await this.dbService.getAll();
  }

  @Get('/populate')
  async addRandom(): Promise<PriceTimestamp[]> {
    const someStamps: AddPriceTimestampDTO[] = [
      {
        "datetime": "2023-12-07 16:00:00",
        "open": "43670.82000",
        "high": "43742.17000",
        "low": "43489.69000",
        "close": "43611.19000"
      },
      {
        "datetime": "2023-12-07 15:00:00",
        "open": "43485.58000",
        "high": "43930.74000",
        "low": "43444.87000",
        "close": "43670.80000"
      },
      {
        "datetime": "2023-12-07 14:00:00",
        "open": "43302.89000",
        "high": "43532.84000",
        "low": "43250.01000",
        "close": "43485.57000"
      },
      {
        "datetime": "2023-12-07 13:00:00",
        "open": "43412.92000",
        "high": "43513.38000",
        "low": "43193.66000",
        "close": "43302.89000"
      },
      {
        "datetime": "2023-12-07 12:00:00",
        "open": "43191.14000",
        "high": "43416.33000",
        "low": "42957.67000",
        "close": "43412.89000"
      },
      {
        "datetime": "2023-12-07 11:00:00",
        "open": "43137.44000",
        "high": "43393.31000",
        "low": "43112.09000",
        "close": "43189.94000"
      },
      {
        "datetime": "2023-12-07 10:00:00",
        "open": "43362.99000",
        "high": "43443.00000",
        "low": "43065.95000",
        "close": "43139.95000"
      },
      {
        "datetime": "2023-12-07 09:00:00",
        "open": "43592.99000",
        "high": "43642.75000",
        "low": "42846.53000",
        "close": "43362.98000"
      },
      {
        "datetime": "2023-12-07 08:00:00",
        "open": "43891.03000",
        "high": "43913.33000",
        "low": "43549.21000",
        "close": "43593.00000"
      },
      {
        "datetime": "2023-12-07 07:00:00",
        "open": "43870.74000",
        "high": "43954.93000",
        "low": "43865.38000",
        "close": "43889.68000"
      },
      {
        "datetime": "2023-12-07 06:00:00",
        "open": "44012.13000",
        "high": "44033.49000",
        "low": "43840.78000",
        "close": "43867.84000"
      },
      {
        "datetime": "2023-12-07 05:00:00",
        "open": "43968.72000",
        "high": "44048.92000",
        "low": "43926.32000",
        "close": "44012.80000"
      },
      {
        "datetime": "2023-12-07 04:00:00",
        "open": "43936.13000",
        "high": "44057.23000",
        "low": "43885.49000",
        "close": "43965.71000"
      },
      {
        "datetime": "2023-12-07 03:00:00",
        "open": "43982.82000",
        "high": "44003.22000",
        "low": "43914.47000",
        "close": "43936.13000"
      },
      {
        "datetime": "2023-12-07 02:00:00",
        "open": "43934.99000",
        "high": "43996.70000",
        "low": "43908.30000",
        "close": "43982.79000"
      },
      {
        "datetime": "2023-12-07 01:00:00",
        "open": "43829.23000",
        "high": "43959.07000",
        "low": "43826.26000",
        "close": "43934.99000"
      },
      {
        "datetime": "2023-12-07 00:00:00",
        "open": "43766.41000",
        "high": "43914.30000",
        "low": "43710.64000",
        "close": "43825.35000"
      },
      {
        "datetime": "2023-12-06 23:00:00",
        "open": "43777.00000",
        "high": "43816.72000",
        "low": "43601.58000",
        "close": "43764.05000"
      },
      {
        "datetime": "2023-12-06 22:00:00",
        "open": "43821.69000",
        "high": "43957.13000",
        "low": "43631.75000",
        "close": "43777.12000"
      },
      {
        "datetime": "2023-12-06 21:00:00",
        "open": "43751.90000",
        "high": "43872.22000",
        "low": "43607.31000",
        "close": "43828.30000"
      },
      {
        "datetime": "2023-12-06 20:00:00",
        "open": "43987.81000",
        "high": "44143.72000",
        "low": "43753.99000",
        "close": "43755.28000"
      },
      {
        "datetime": "2023-12-06 19:00:00",
        "open": "43940.03000",
        "high": "44124.00000",
        "low": "43906.88000",
        "close": "43983.17000"
      }
    ].map(({ datetime, open, high, low, close }) => (
      {
        ticker: CryptoTickers['BTC/USD'],
        timestamp: new Date(datetime),
        openPrice: parseFloat(open),
        closePrice: parseFloat(close),
        highPrice: parseFloat(high),
        lowPrice: parseFloat(low)
      }));

    return await this.dbService.addStamps(someStamps);
  }

  @Get('/range')
  async ranged(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string
  ): Promise<PriceTimestamp[]> {
    if (!startDate || !endDate) {
      console.log('NO RANGE PROVIDED!');
      return []
    }

    return await this.dbService.getFromRange({ startDate: new Date(startDate), endDate: new Date(endDate) })
  }
}
