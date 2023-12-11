import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO, RequestParamsDTO } from '../../dtos';
import { ParsedQs } from 'qs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { DatabaseService } from 'src/database/database.service';
import { FetchMarketDataService } from '../fetch-market-data/fetch-market-data.service';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';
import { TimeLogicService } from '../time-logic/time-logic.service';

interface ICryptoService {
    processRequest(query: Request['query']): Promise<GetCryptoDTO | ErrorDTO>
}

@Injectable()
export class CryptoService implements ICryptoService {

    constructor(
        private readonly dbService: DatabaseService,
        private readonly fetchService: FetchMarketDataService,
        private readonly timeLogicService: TimeLogicService,
    ) { }

    async processRequest(query: ParsedQs): Promise<GetCryptoDTO | ErrorDTO> {
        console.log('Crypto Service - Process request fired!');
        try {

            const queryDTO = await this.validateQuery(query);
            console.log(queryDTO);

            const timestamps = this.timeLogicService.generateTimestampArray(queryDTO);

            console.log(timestamps);

            // Not final
            const priceTimestamps = await this.dbService
                .getTargetStamps(
                    CryptoTickers['BTC/USD'],
                    queryDTO.interval,
                    timestamps);

            if (priceTimestamps.length !== timestamps.length) {
                console.log('MISSING SOME DATA! NEED TO FETCH!');
                // FILTER OUT MISSING PRICE STAMPS
                // FETCH SERVICE - FETCH
                // DB SERVICE - ADD DATA FOR MISSING PRICE STAMPS 
            }
            else {
                console.log('ALL DATA FOUND!');
                // FINAL STAMPS = priceTimestamps;
            }

            // Placeholder - TRANSFORM FINAL PRICE STAMPS INTO THE DTO FORMAT
            const data: GetCryptoDTO['data'] = priceTimestamps.map(priceStamp => (
                {
                    datetime: priceStamp.timestamp,
                    open: priceStamp.openPrice,
                    high: priceStamp.highPrice,
                    low: priceStamp.lowPrice,
                    close: priceStamp.closePrice,
                }))

            // ADD META DATA
            const meta = this.generateMetadata(queryDTO, data.length);

            return {
                status: 'success',
                meta,
                data
            };
        } catch (error) {
            return { status: 'error', errors: [error.message] };
        }
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