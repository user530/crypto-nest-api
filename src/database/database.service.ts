import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceTimestamp } from './entities/priceTimestamp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(PriceTimestamp)
        private readonly priceStampRepo: Repository<PriceTimestamp>
    ) { }

    async getAll(): Promise<PriceTimestamp[]> {
        const allStamps = await this.priceStampRepo.find({});

        return allStamps;
    }
}
