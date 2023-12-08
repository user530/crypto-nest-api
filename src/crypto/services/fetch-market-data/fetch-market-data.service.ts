import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchMarketDataService {
    async fetchData() {
        console.log('FETCH DATA FIRED!');
        return 1;
    }
}
