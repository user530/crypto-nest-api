import { Injectable } from '@nestjs/common';
import { RequestParamsDTO } from 'src/crypto/dtos';

@Injectable()
export class FetchMarketDataService {
    async fetchData(requestParamsDTO: RequestParamsDTO) {
        console.log('FETCH DATA FIRED!');
        console.log(requestParamsDTO);

        const requestStr = Object.entries(requestParamsDTO).reduce((acc, [param, val]) => acc += `&${param}=${val}`, '');
        const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?';
        const API_KEY = '';
        const fetchURI = BASE_URL + API_KEY + requestStr;
        console.log(fetchURI)

        const res = await fetch(fetchURI);
        const data = await res.json();

        console.log(data);

        return data;
    }
}
