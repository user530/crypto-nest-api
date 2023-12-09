import { Equals, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ErrorAPIMessage } from '../types/apiMessages';

export class ErrorDTO implements ErrorAPIMessage {
    @IsNotEmpty()
    @IsString()
    @Equals('error')
    status: 'error';

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    errors: string[];
}