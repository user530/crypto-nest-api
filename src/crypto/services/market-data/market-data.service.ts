import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { FetchAPIConfig } from 'config/fetch.config';
import { GetCryptoData, RequestParamsDTO } from 'src/crypto/dtos';
import { TwelveDataResponseDTO } from 'src/crypto/dtos/twelveDataResponse.dto';
import { TwelveDataAPI } from 'src/crypto/types/twelveDataAPI';

interface IMarketDataService<Output> {
    getMarketData(requestParamsDTO: RequestParamsDTO): Promise<Output>;
}

@Injectable()
export class MarketDataService implements IMarketDataService<GetCryptoData[]> {

    constructor(private readonly configService: ConfigService) { }

    async getMarketData(requestParamsDTO: RequestParamsDTO): Promise<GetCryptoData[]> {
        try {
            const apiData = await this.fetchMarketData(requestParamsDTO);
            const stamps = await this.makePriceStamps(apiData);
            return stamps;
        } catch (error) {
            throw error;
        }
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
        // Transform and Validate API output
        console.log(marketData);
        const marketDataDTO = plainToClass(TwelveDataResponseDTO, marketData, { enableImplicitConversion: true });

        const errs = await validate(marketDataDTO);


        // Guard clause
        if (errs.length !== 0) {
            throw new Error('Failed to convert market data into the stamps!');
        }

        // Transform DTO values into required output (fix implicit datetime conversion that adds timezone offset )
        const priceStamps: GetCryptoData[] = marketDataDTO
            .values
            .map(({ datetime, open, high, low, close }) => ({
                datetime: new Date(datetime.getTime() - datetime.getTimezoneOffset() * 1000 * 60),
                open, high, low, close
            }));

        return priceStamps;
    }
}
