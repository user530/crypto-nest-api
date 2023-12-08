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
    const BTCStamps: AddPriceTimestampDTO[] = [
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

    const ETHStamps: AddPriceTimestampDTO[] = [
      {
        "datetime": "2023-12-08 10:00:00",
        "open": "2345.60000",
        "high": "2357.82000",
        "low": "2345.38000",
        "close": "2355.97000"
      },
      {
        "datetime": "2023-12-08 09:00:00",
        "open": "2350.72000",
        "high": "2356.68000",
        "low": "2344.06000",
        "close": "2346.14000"
      },
      {
        "datetime": "2023-12-08 08:00:00",
        "open": "2352.97000",
        "high": "2358.40000",
        "low": "2349.23000",
        "close": "2350.57000"
      },
      {
        "datetime": "2023-12-08 07:00:00",
        "open": "2374.41000",
        "high": "2375.48000",
        "low": "2351.91000",
        "close": "2353.18000"
      },
      {
        "datetime": "2023-12-08 06:00:00",
        "open": "2376.42000",
        "high": "2381.22000",
        "low": "2369.30000",
        "close": "2374.34000"
      },
      {
        "datetime": "2023-12-08 05:00:00",
        "open": "2368.99000",
        "high": "2377.58000",
        "low": "2367.89000",
        "close": "2376.10000"
      },
      {
        "datetime": "2023-12-08 04:00:00",
        "open": "2375.16000",
        "high": "2391.78000",
        "low": "2368.18000",
        "close": "2369.23000"
      },
      {
        "datetime": "2023-12-08 03:00:00",
        "open": "2378.08000",
        "high": "2381.00000",
        "low": "2369.41000",
        "close": "2375.37000"
      },
      {
        "datetime": "2023-12-08 02:00:00",
        "open": "2361.49000",
        "high": "2388.27000",
        "low": "2361.49000",
        "close": "2377.53000"
      },
      {
        "datetime": "2023-12-08 01:00:00",
        "open": "2360.37000",
        "high": "2366.84000",
        "low": "2356.24000",
        "close": "2361.09000"
      },
      {
        "datetime": "2023-12-08 00:00:00",
        "open": "2355.55005",
        "high": "2363.98000",
        "low": "2352.25000",
        "close": "2360.21000"
      },
      {
        "datetime": "2023-12-07 23:00:00",
        "open": "2349.97998",
        "high": "2358.56000",
        "low": "2347.26000",
        "close": "2355.17993"
      },
      {
        "datetime": "2023-12-07 22:00:00",
        "open": "2368.76000",
        "high": "2377.77000",
        "low": "2349.78000",
        "close": "2350.00000"
      },
      {
        "datetime": "2023-12-07 21:00:00",
        "open": "2341.96000",
        "high": "2380.90000",
        "low": "2341.96000",
        "close": "2369.22000"
      },
      {
        "datetime": "2023-12-07 20:00:00",
        "open": "2335.35000",
        "high": "2346.99000",
        "low": "2335.10000",
        "close": "2342.18000"
      },
      {
        "datetime": "2023-12-07 19:00:00",
        "open": "2337.04000",
        "high": "2342.44000",
        "low": "2325.34000",
        "close": "2335.33000"
      },
      {
        "datetime": "2023-12-07 18:00:00",
        "open": "2335.40000",
        "high": "2355.98000",
        "low": "2332.25000",
        "close": "2338.22000"
      },
      {
        "datetime": "2023-12-07 17:00:00",
        "open": "2346.66000",
        "high": "2346.66000",
        "low": "2324.00000",
        "close": "2335.51000"
      },
      {
        "datetime": "2023-12-07 16:00:00",
        "open": "2320.16000",
        "high": "2350.00000",
        "low": "2315.79000",
        "close": "2346.58000"
      },
      {
        "datetime": "2023-12-07 15:00:00",
        "open": "2266.77002",
        "high": "2327.68000",
        "low": "2265.36000",
        "close": "2319.92000"
      },
      {
        "datetime": "2023-12-07 14:00:00",
        "open": "2248.30000",
        "high": "2270.00000",
        "low": "2246.98000",
        "close": "2266.77002"
      },
      {
        "datetime": "2023-12-07 13:00:00",
        "open": "2255.46000",
        "high": "2258.40000",
        "low": "2243.71000",
        "close": "2248.37000"
      }
    ].map(({ datetime, open, high, low, close }) => (
      {
        ticker: CryptoTickers['ETH/USD'],
        timestamp: new Date(datetime),
        openPrice: parseFloat(open),
        closePrice: parseFloat(close),
        highPrice: parseFloat(high),
        lowPrice: parseFloat(low)
      }));

    return await this.dbService.addStamps([...BTCStamps, ...ETHStamps]);
  }

  @Get('/range')
  async ranged(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
    @Query('symbol') symbol: string,
    @Query('interval') interval: string,
  ): Promise<PriceTimestamp[]> {
    // VALIDATE
    const vStart = startDate ? new Date(startDate) : new Date(new Date().toISOString().slice(0, 10));
    const vEnd = endDate ? new Date(endDate) : new Date(new Date(new Date().toISOString().slice(0, 10)).getTime() + 1000 * 60 * 60 * 24);
    const vSymbol = symbol ? symbol as CryptoTickers : CryptoTickers['BTC/USD'];
    const vInterval = interval ? parseInt(interval) : 1000 * 60 * 60;

    console.log(vStart, vEnd, vSymbol, vInterval);

    // CREATE DATE ARRAY
    const firstStampDate = new Date(Math.ceil(vStart.getTime() / vInterval) * vInterval);
    const lastStampDate = new Date(Math.floor(vEnd.getTime() / vInterval) * vInterval);

    console.log(firstStampDate, lastStampDate);

    // GET STAMPS FROM THE DB

    const stamps = [];
    let stampTime = firstStampDate.getTime();

    while (stampTime <= lastStampDate.getTime()) {
      stamps.push(new Date(stampTime));
      stampTime += vInterval;
    }

    const priceStamps = await this.dbService.getTargetStamps(vSymbol, stamps);

    // CHECK THE NEED FOR FETCH
    const stampsNumExpected = Math.floor((vEnd.getTime() - vStart.getTime()) / vInterval);

    console.log(`Expect ${stampsNumExpected} stamps`);

    if (priceStamps.length !== stampsNumExpected)
      console.log('Found less than expected, need to fetch!');  //FETCH IF NEEDED! ALSO ADD MISSING STAMPS TO THE DB

    return priceStamps;
  }
}
