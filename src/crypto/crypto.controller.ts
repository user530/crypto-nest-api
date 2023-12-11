import { Controller, Get, Req } from '@nestjs/common';
import { CryptoService } from './services/crypto/crypto.service';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO } from './services/crypto/dtos';


interface ICryptoController {
    getCryptoData(req: Request): Promise<GetCryptoDTO | ErrorDTO>
}

@Controller('api/v1')
export class CryptoController implements ICryptoController {
    constructor(
        private readonly cryptoService: CryptoService,
    ) { }

    @Get('crypto')
    async getCryptoData(
        @Req() req: Request
    ) {
        const { query } = req;

        const result = await this.cryptoService.processRequest(query);

        return result;
    }
}
