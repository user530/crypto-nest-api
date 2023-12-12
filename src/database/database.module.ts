import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { PriceTimestamp } from './entities/priceTimestamp.entity';
import { dbConfig } from 'config/db.config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(dbConfig)],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>('database'),
        }),
        TypeOrmModule.forFeature(
            [PriceTimestamp],
        )
    ],
    providers: [DatabaseService],
    exports: [
        TypeOrmModule
    ],
})
export class DatabaseModule { }
