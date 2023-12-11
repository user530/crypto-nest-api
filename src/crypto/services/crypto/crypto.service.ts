import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO, RequestParamsDTO } from './dtos';
import { ParsedQs } from 'qs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { IntervalToTime } from 'src/shared/intervalsToTime.map';
import { DatabaseService } from 'src/database/database.service';
import { FetchMarketDataService } from '../fetch-market-data/fetch-market-data.service';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';

interface ICryptoService {
    processRequest(query: Request['query']): Promise<GetCryptoDTO | ErrorDTO>
}

@Injectable()
export class CryptoService implements ICryptoService {

    constructor(
        private readonly dbService: DatabaseService,
        private readonly fetchService: FetchMarketDataService,
    ) { }

    async processRequest(query: ParsedQs): Promise<GetCryptoDTO | ErrorDTO> {
        console.log('Crypto Service - Process request fired!');
        try {

            const queryDTO = await this.validateQuery(query);
            console.log(queryDTO);

            const timestamps = this.generateTimestampArray(queryDTO);

            console.log(timestamps);

            // Not final
            const priceTimestamps = await this.dbService
                .getTargetStamps(
                    CryptoTickers['BTC/USD'],
                    queryDTO.interval,
                    timestamps);

            if (priceTimestamps.length !== timestamps.length)
                console.log('MISSING SOME DATA! NEED TO FETCH!');
            else
                console.log('ALL DATA FOUND!');

            // Placeholder
            const data: GetCryptoDTO['data'] = priceTimestamps.map(priceStamp => (
                {
                    datetime: priceStamp.timestamp,
                    open: priceStamp.openPrice,
                    high: priceStamp.highPrice,
                    low: priceStamp.lowPrice,
                    close: priceStamp.closePrice,
                }))

            const meta = this.generateMetadata(queryDTO, data.length);

            return {
                status: 'success',
                meta,
                data
            };
        } catch (error) {
            return { status: 'error', errors: [error.message] };
        }

        //  CryptoService - Transform [query params] into [processed params]
        //  CryptoService - From [processed params] get the [number of expected stamps]

        //  CryptoService - From [processed params] return an [array of requested stamps]

        //  DB Service - From [array of requested stamps] return an [array of PriceStamps]

        //  CryptoService - Check if [array of PriceStamps] is the same length as [number of expected stamps]

        //  CryptoService - if not equal -> handle lack of data

        // Lack of data handler:
        //      prepare query params based on API interface
        //      Fetch Service - Fetch data
        //      DB service - Add Missing PriceStamps
        //      Return fetched data

        // this.cryptoService.processRequest();
        // this.fetchDataService.fetchData();
        // await this.dbService.getAll();


    }

    async addRandom() {
        const BTCHourStamps = [].map(({ datetime, open, high, low, close }) => (
            {
                ticker: CryptoTickers['BTC/USD'],
                interval: TimeIntervals['1 hour'],
                timestamp: new Date(datetime),
                openPrice: parseFloat(open),
                closePrice: parseFloat(close),
                highPrice: parseFloat(high),
                lowPrice: parseFloat(low)
            }));

        const BTCMinStamps = [].map(({ datetime, open, high, low, close }) => (
            {
                ticker: CryptoTickers['BTC/USD'],
                interval: TimeIntervals['1 min'],
                timestamp: new Date(datetime),
                openPrice: parseFloat(open),
                closePrice: parseFloat(close),
                highPrice: parseFloat(high),
                lowPrice: parseFloat(low)
            }))

        const ETHStamps = [].map(({ datetime, open, high, low, close }) => (
            {
                ticker: CryptoTickers['ETH/USD'],
                interval: TimeIntervals['1 hour'],
                timestamp: new Date(datetime),
                openPrice: parseFloat(open),
                closePrice: parseFloat(close),
                highPrice: parseFloat(high),
                lowPrice: parseFloat(low)
            }));

        return await this.dbService.addStamps([...BTCHourStamps, ...ETHStamps, ...BTCMinStamps]);
    }

    private async validateQuery(query: ParsedQs): Promise<RequestParamsDTO> {
        console.log('Crypto Service - Validate Query Fired!');

        const queryDTO = plainToClass(RequestParamsDTO, query, { enableImplicitConversion: true });

        const validationErrors = await validate(queryDTO);

        if (validationErrors.length !== 0) {
            console.log(validationErrors)
            const errStr = validationErrors
                .map(
                    err => Object
                        .values(err.constraints)
                        .join(', '))
                .join('; ');
            throw new Error(errStr);
        }

        return queryDTO;
    };

    private generateTimestampArray(requestParamsDTO: RequestParamsDTO): Date[] {
        const { start_date: startDate, end_date: endDate, interval } = requestParamsDTO;

        let firstStamp: Date = undefined, dateIterator: (date: Date) => Date = undefined;

        if (interval === TimeIntervals['1 month']) {
            firstStamp = this.closestMonthStart(startDate);
            dateIterator = this.nextMonthStart;
        }
        else if (interval === TimeIntervals['1 week']) {
            firstStamp = this.closestWeekStart(endDate);
            dateIterator = (date: Date) => new Date(date.getTime() + this.getIntervalTime(interval));
        }
        else {
            const intervalTime = this.getIntervalTime(interval);
            firstStamp = this.closestIntervalStart(startDate, intervalTime);
            dateIterator = (date: Date) => new Date(date.getTime() + intervalTime);
        }

        return this.generateStampsArray(firstStamp, endDate, dateIterator);
    };

    private getIntervalTime(timeInterval: TimeIntervals): number {
        return IntervalToTime[timeInterval];
    };

    private generateStampsArray(fromDate: Date, toDate: Date, nextDate: (date: Date) => Date) {
        const stampsArray: Date[] = [];

        for (
            let iteratorDate = fromDate;
            iteratorDate <= toDate;
            iteratorDate = nextDate(iteratorDate)
        ) {
            stampsArray.push(iteratorDate);
        }

        return stampsArray;
    };

    private closestIntervalStart(fromDate: Date, intervalTime: number): Date {
        return new Date(
            Math.ceil(
                fromDate.getTime() / intervalTime
            ) * intervalTime
        )
    };

    private closestWeekStart(fromDate: Date): Date {
        return new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate() + (8 - fromDate.getDay()) % 7,     // Closest monday
            fromDate.getTimezoneOffset() / -60      // Adjust for the timezone
        )
    };

    private nextMonthStart(fromDate: Date): Date {
        return new Date(
            fromDate.getFullYear(),
            fromDate.getMonth() + 1,
            1,
            fromDate.getTimezoneOffset() / -60
        )
    };

    private closestMonthStart(fromDate: Date): Date {
        return fromDate.getTime() === new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            1,
            fromDate.getTimezoneOffset() / -60
        ).getTime()
            ? fromDate
            : this.nextMonthStart(fromDate);
    };

    private generateMetadata(requestParamsDTO: RequestParamsDTO, data_size: number): GetCryptoDTO['meta'] {
        const { start_date, end_date, interval, symbol } = requestParamsDTO;

        return {
            start_date,
            end_date,
            interval,
            symbol,
            data_size,
        }
    };
}