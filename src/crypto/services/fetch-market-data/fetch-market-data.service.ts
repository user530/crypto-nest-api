import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchAPIConfig } from 'config/fetch.config';
import { RequestParamsDTO } from 'src/crypto/dtos';

interface IFetchMarketDataService {
    fetchData(requestParamsDTO: RequestParamsDTO): Promise<any>;
}

@Injectable()
export class FetchMarketDataService implements IFetchMarketDataService {

    constructor(private readonly configService: ConfigService) { }

    async fetchData(requestParamsDTO: RequestParamsDTO) {
        const fetchConfig: FetchAPIConfig = this.configService.get<FetchAPIConfig>('fetchAPI');
        const fetchURL: string = fetchConfig.API_BASE + fetchConfig.API_ENDPOINT + fetchConfig.API_KEY;
        const fetchParams: string = Object.entries(requestParamsDTO).reduce((acc, [param, val]) => acc += `&${param}=${val instanceof Date ? val.toISOString() : val}`, '');

        const res = await fetch(fetchURL + fetchParams);
        const data = await res.json();

        return data;
    }
}
