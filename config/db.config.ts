import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PriceTimestamp } from 'src/database/entities/priceTimestamp.entity';

export const dbConfig = registerAs('database', (): TypeOrmModuleOptions => {
    return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: process.env.DB_SYNC === 'true',
        entities: [
            PriceTimestamp
        ]
    };
});
