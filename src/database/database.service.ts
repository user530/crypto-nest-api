import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceTimestamp } from './entities/priceTimestamp.entity';
import { Between, Repository } from 'typeorm';
import { PriceTimestampDTO } from './dtos/priceTimestamp.dto';


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

    getFromRange({ startDate, endDate }: { startDate: Date, endDate: Date }): Promise<PriceTimestamp[]> {
        if (startDate > endDate) {
            throw new Error('Incorrect date range!');
        }

        return this.priceStampRepo.find({
            where: {
                timestamp: Between(startDate, endDate)
            }
        })
    }

    async addStamps(timeStampDTOs: PriceTimestampDTO | PriceTimestampDTO[]): Promise<PriceTimestamp[]> {
        console.log('DB Service - Add stamp fired!');

        const stamps: PriceTimestamp[] = Array.isArray(timeStampDTOs)
            ? await this.priceStampRepo.create(timeStampDTOs)
            : [await this.priceStampRepo.create(timeStampDTOs)];

        return this.priceStampRepo.save(stamps);
    }
}
