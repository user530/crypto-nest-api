import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CryptoService } from './services/crypto/crypto.service';
import { FetchMarketDataService } from './services/fetch-market-data/fetch-market-data.service';

@Controller('api/v1')
export class CryptoController {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly dbService: DatabaseService,
        private readonly fetchDataService: FetchMarketDataService,
    ) { }

    @Get('crypto')
    async getCryptoData() {

        //  CryptoService - Validate params
        //      If not valid -> throw error

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

        this.cryptoService.processRequest();
        this.fetchDataService.fetchData();
        return await this.dbService.getAll();
    }
}
