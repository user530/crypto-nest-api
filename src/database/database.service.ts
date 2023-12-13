import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceTimestamp } from './entities/priceTimestamp.entity';
import { In, Repository } from 'typeorm';
import { AddPriceTimestampDTO } from './dtos/priceTimestamp.dto';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';


@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(PriceTimestamp)
        private readonly priceStampRepo: Repository<PriceTimestamp>
    ) { }

    getAll(): Promise<PriceTimestamp[]> {
        return this.priceStampRepo.find({});
    }

    getTargetStamps(ticker: CryptoTickers, interval: TimeIntervals, stampsToFind: Date[]): Promise<PriceTimestamp[]> {
        return this.priceStampRepo.find({
            where: {
                ticker,
                interval,
                timestamp: In([...stampsToFind]),
            }
        })
    }

    async addStamps(timeStampDTOs: AddPriceTimestampDTO | AddPriceTimestampDTO[]): Promise<PriceTimestamp[]> {
        const stamps: PriceTimestamp[] = Array.isArray(timeStampDTOs)
            ? await this.priceStampRepo.create(timeStampDTOs)
            : [await this.priceStampRepo.create(timeStampDTOs)];

        return this.priceStampRepo.save(stamps);
    }
}
