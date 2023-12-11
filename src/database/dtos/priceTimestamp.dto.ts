import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';

export class AddPriceTimestampDTO {

    @IsNotEmpty()
    @IsEnum(CryptoTickers)
    ticker: CryptoTickers;

    @IsNotEmpty()
    @IsEnum(TimeIntervals)
    interval: TimeIntervals;

    @IsNotEmpty()
    @IsDate()
    timestamp: Date;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    openPrice: number;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    highPrice: number;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    lowPrice: number;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    closePrice: number;
}