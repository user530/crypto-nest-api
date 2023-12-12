import { SuccessAPIMessage } from '../types/apiMessages';
import { Equals, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';

export class GetCryptoData {
    @IsNotEmpty()
    @IsDate()
    datetime: Date;

    @IsNotEmpty()
    @IsNumber()
    open: number;

    @IsNotEmpty()
    @IsNumber()
    high: number;

    @IsNotEmpty()
    @IsNumber()
    low: number;

    @IsNotEmpty()
    @IsNumber()
    close: number;
}

class GetCryptoMeta {
    @IsNotEmpty()
    @IsEnum(CryptoTickers)
    symbol: CryptoTickers;

    @IsNotEmpty()
    @IsEnum(TimeIntervals)
    interval: TimeIntervals;

    @IsNotEmpty()
    @IsDate()
    start_date: Date;

    @IsNotEmpty()
    @IsDate()
    end_date: Date;

    @IsNotEmpty()
    @IsNumber()
    data_size: number;
}

export class GetCryptoDTO implements SuccessAPIMessage {
    @IsNotEmpty()
    @IsString()
    @Equals('success')
    status: 'success';

    @IsObject()
    @ValidateNested()
    @Type(() => GetCryptoMeta)
    meta: GetCryptoMeta;

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => GetCryptoData)
    data: GetCryptoData[];
}