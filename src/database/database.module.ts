import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { PriceTimestamp } from './entities/priceTimestamp.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
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
