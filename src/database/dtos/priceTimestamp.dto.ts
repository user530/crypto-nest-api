import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class PriceTimestampDTO {
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