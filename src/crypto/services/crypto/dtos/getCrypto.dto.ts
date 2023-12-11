import { SuccessAPIMessage } from '../types/apiMessages';
import { Equals, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RequestParamsDTO } from './requestParams.dto';

class GetCryptoData {
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

export class GetCryptoDTO implements SuccessAPIMessage {
    @IsNotEmpty()
    @IsString()
    @Equals('success')
    status: 'success';

    @IsObject()
    @ValidateNested()
    @Type(() => RequestParamsDTO)
    meta: RequestParamsDTO;

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => GetCryptoData)
    data: GetCryptoData[];
}