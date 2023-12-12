import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO, RequestParamsDTO } from '../../dtos';
import { ParsedQs } from 'qs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { DatabaseService } from 'src/database/database.service';
import { MarketDataService } from '../market-data/market-data.service';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';
import { TimeLogicService } from '../time-logic/time-logic.service';
import { PriceTimestamp } from 'src/database/entities/priceTimestamp.entity';
import { AddPriceTimestampDTO } from 'src/database/dtos/priceTimestamp.dto';

interface ICryptoService {
    processRequest(query: Request['query']): Promise<GetCryptoDTO | ErrorDTO>
}

@Injectable()
export class CryptoService implements ICryptoService {

    constructor(
        private readonly dbService: DatabaseService,
        private readonly marketDataService: MarketDataService,
        private readonly timeLogicService: TimeLogicService,
    ) { }

    async processRequest(query: ParsedQs): Promise<GetCryptoDTO | ErrorDTO> {
        console.log('Crypto Service - Process request fired!');
        try {

            const queryDTO = await this.validateQuery(query);
            console.log(queryDTO);

            const timestamps = this.timeLogicService.generateTimestampArray(queryDTO);

            console.log(timestamps);

            const priceTimestamps = await this.dbService
                .getTargetStamps(
                    CryptoTickers['BTC/USD'],
                    queryDTO.interval,
                    timestamps);

            // Transform from DB type to DTO type!!! 
            const stampsFromDb = this.marketDataService.entitiesToMarketData<PriceTimestamp>(
                priceTimestamps,
                (entities: PriceTimestamp[]) => ({
                    ticker: entities.length > 0 ? entities[0].ticker : CryptoTickers['BTC/USD'],
                    interval: entities.length > 0 ? entities[0].interval : TimeIntervals['1 min'],
                    data: entities.map(({ timestamp, openPrice, highPrice, lowPrice, closePrice }) => (
                        { datetime: timestamp, open: openPrice, high: highPrice, low: lowPrice, close: closePrice }))
                })

            );

            // RESULT VARIABLE
            let resultData = stampsFromDb;

            if (stampsFromDb.data.length !== timestamps.length) {
                console.log('MISSING SOME DATA! NEED TO FETCH!');
                // FETCH DATA FROM API AND TRANSFORM TO STAMPS
                const stampsFromMarket = await this.marketDataService.getMarketData(queryDTO);

                resultData = stampsFromMarket;

                console.log(stampsFromDb);
                console.log(stampsFromMarket);

                // FILTER OUT MISSING PRICE STAMPS
                const existingTimestamps = stampsFromDb.data.map((stamp) => stamp.datetime.getTime());
                const filteredStamps = {
                    ...stampsFromMarket,
                    data: stampsFromMarket.data.filter((stamp) => !existingTimestamps.includes(stamp.datetime.getTime()))
                }


                // TRANSFORM INTO DB ENTITY
                const toInsert = this.marketDataService.marketDataToEntity<AddPriceTimestampDTO>(
                    filteredStamps,
                    ({ ticker, interval, data }) => (
                        data.map((stamp): AddPriceTimestampDTO => ({
                            ticker,
                            interval,
                            timestamp: stamp.datetime,
                            openPrice: stamp.open,
                            highPrice: stamp.high,
                            lowPrice: stamp.low,
                            closePrice: stamp.close,
                        }))
                    )
                )

                console.log(toInsert)
                // DB SERVICE - ADD DATA FOR MISSING PRICE STAMPS 
            }
            else {
                console.log('ALL DATA FOUND!');
                // FINAL STAMPS = priceTimestamps;
            }

            // ADD META DATA
            const meta = this.generateMetadata(queryDTO, resultData.data.length);

            return {
                status: 'success',
                meta,
                data: resultData.data
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