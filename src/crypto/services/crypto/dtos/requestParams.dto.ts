import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { CryptoTickers } from 'src/shared/enums/tickers.enum';

export class RequestParamsDTO {
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
}