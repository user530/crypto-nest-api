import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO } from './dtos';
import { ParsedQs } from 'qs';

interface ICryptoService {
    processRequest(query: Request['query']): Promise<GetCryptoDTO | ErrorDTO>
}

@Injectable()
export class CryptoService implements ICryptoService {
    async processRequest(query: ParsedQs): Promise<GetCryptoDTO | ErrorDTO> {
        console.log('Process request fired!');
        console.log(query);

        return { status: 'error', errors: ['Err'] };
    }
}
