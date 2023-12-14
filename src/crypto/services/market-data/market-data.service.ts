import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { FetchAPIConfig } from 'config/fetch.config';
import { GetCryptoData, RequestParamsDTO } from 'src/crypto/dtos';
import { TwelveDataResponseDTO } from 'src/crypto/dtos/twelveDataResponse.dto';
import { TwelveDataAPI } from 'src/crypto/types/twelveDataAPI';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';

interface IMarketDataService<Output> {
    getMarketData(requestParamsDTO: RequestParamsDTO): Promise<Output>;
    marketDataToEntity<Entity>(marketData: Output, transformer: (marketData: Output) => Entity[]): Entity[];
    entitiesToMarketData<Entity>(entities: Entity[], transformer: (entities: Entity[]) => Output): Output;
}

interface MarketData {
    ticker: CryptoTickers,
    interval: TimeIntervals,
    data: GetCryptoData[],
}

@Injectable()
export class MarketDataService implements IMarketDataService<MarketData> {

    constructor(private readonly configService: ConfigService) { }

    async getMarketData(requestParamsDTO: RequestParamsDTO): Promise<MarketData> {
        try {
            const apiData = await this.fetchMarketData(requestParamsDTO);

            if ((apiData as any).status === 'error')
                throw new Error((apiData as any).message);

            const stamps = await this.makePriceStamps(apiData);

            return { ticker: requestParamsDTO.symbol, interval: requestParamsDTO.interval, data: stamps };
        } catch (error) {
            throw error;
        }
    }

    marketDataToEntity<Entity>(marketData: MarketData, transformer: (marketData: MarketData) => Entity[]): Entity[] {
        return transformer(marketData);
    }

    entitiesToMarketData<Entity>(entities: Entity[], transformer: (entities: Entity[]) => MarketData): MarketData {
        return transformer(entities);
    }

    private async fetchMarketData(requestParamsDTO: RequestParamsDTO): Promise<TwelveDataAPI> {
        const fetchConfig: FetchAPIConfig = this.configService.get<FetchAPIConfig>('fetchAPI');
        const fetchURL: string = fetchConfig.API_BASE + fetchConfig.API_ENDPOINT + fetchConfig.API_KEY;
        const fetchParams: string = Object.entries(requestParamsDTO).reduce((acc, [param, val]) => acc += `&${param}=${val instanceof Date ? val.toISOString() : val}`, '');

        const res = await fetch(fetchURL + fetchParams);
        const data = await res.json();

        return data;
    }

    private async makePriceStamps(marketData: TwelveDataAPI): Promise<GetCryptoData[]> {
        // BEFORE WE TRANSFORM - UPDATE TIMESTAMP STRING TO ACCOUNT FOR THE TIMEZONE CONVERSION
        marketData = { ...marketData, values: marketData.values.map((stamp) => ({ ...stamp, datetime: `${stamp.datetime}Z` })) }

        // Transform and Validate API output
        const marketDataDTO = plainToClass(TwelveDataResponseDTO, marketData, { enableImplicitConversion: true });

        const errs = await validate(marketDataDTO);

        // Guard clause
        if (errs.length !== 0) {
            throw new Error('Failed to convert market data into the stamps!');
        }

        // Transform DTO values into required output
        const priceStamps: GetCryptoData[] = marketDataDTO
            .values
            .map(({ datetime, open, high, low, close }) => ({
                datetime,
                open, high, low, close
            }));

        return priceStamps;
    }
}
