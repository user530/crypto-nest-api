import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
    processRequest() {
        console.log('PROCESS REQUEST FIRED!');
        return 1;
    }
}
