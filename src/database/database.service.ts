import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceTimestamp } from './entities/priceTimestamp.entity';
import { In, Repository } from 'typeorm';
import { AddPriceTimestampDTO } from './dtos/priceTimestamp.dto';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';


@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(PriceTimestamp)
        private readonly priceStampRepo: Repository<PriceTimestamp>
    ) { }

    getAll(): Promise<PriceTimestamp[]> {
        console.log('DB Service - Get all fired!');

        return this.priceStampRepo.find({});
    }

    getTargetStamps(ticker: CryptoTickers, datesToFind: Date[]): Promise<PriceTimestamp[]> {
        return this.priceStampRepo.find({
            where: {
                ticker: ticker,
                timestamp: In([...datesToFind]),
            }
        })
    }

    async addStamps(timeStampDTOs: AddPriceTimestampDTO | AddPriceTimestampDTO[]): Promise<PriceTimestamp[]> {
        console.log('DB Service - Add stamp fired!');

        const stamps: PriceTimestamp[] = Array.isArray(timeStampDTOs)
            ? await this.priceStampRepo.create(timeStampDTOs)
            : [await this.priceStampRepo.create(timeStampDTOs)];

        return this.priceStampRepo.save(stamps);
    }
}
