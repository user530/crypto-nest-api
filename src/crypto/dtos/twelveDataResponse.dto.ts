import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';

class TwelveDataPriceStampDTO {
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

class TwelveDataMetaDTO {

    @IsNotEmpty()
    @IsEnum(CryptoTickers)
    symbol: CryptoTickers;

    @IsNotEmpty()
    @IsEnum(TimeIntervals)
    interval: TimeIntervals;

    @IsNotEmpty()
    @IsString()
    currency_base: string;

    @IsNotEmpty()
    @IsString()
    currency_quote: string;

    @IsNotEmpty()
    @IsString()
    exchange: string;

    @IsNotEmpty()
    @IsString()
    type: string;
}

export class TwelveDataResponseDTO {
    @IsObject()
    @Type(() => TwelveDataMetaDTO)
    meta: TwelveDataMetaDTO;

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => TwelveDataPriceStampDTO)
    values: TwelveDataPriceStampDTO[];
}