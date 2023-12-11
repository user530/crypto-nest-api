import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorDTO, GetCryptoDTO, RequestParamsDTO } from './dtos';
import { ParsedQs } from 'qs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { IntervalToTime } from 'src/shared/intervalsToTime.map';

interface ICryptoService {
    processRequest(query: Request['query']): Promise<GetCryptoDTO | ErrorDTO>
}

@Injectable()
export class CryptoService implements ICryptoService {
    async processRequest(query: ParsedQs): Promise<GetCryptoDTO | ErrorDTO> {
        console.log('Crypto Service - Process request fired!');
        try {

            const queryDTO = await this.validateQuery(query);
            console.log(queryDTO);

            const timestampArr = this.generateTimestampArray(queryDTO);

            console.log(timestampArr);


            return { status: 'error', errors: ['Err'] };
        } catch (error) {
            return { status: 'error', errors: [error.message] };
        }

        //  CryptoService - Transform [query params] into [processed params]
        //  CryptoService - From [processed params] get the [number of expected stamps]

        //  CryptoService - From [processed params] return an [array of requested stamps]

        //  DB Service - From [array of requested stamps] return an [array of PriceStamps]

        //  CryptoService - Check if [array of PriceStamps] is the same length as [number of expected stamps]

        //  CryptoService - if not equal -> handle lack of data

        // Lack of data handler:
        //      prepare query params based on API interface
        //      Fetch Service - Fetch data
        //      DB service - Add Missing PriceStamps
        //      Return fetched data

        // this.cryptoService.processRequest();
        // this.fetchDataService.fetchData();
        // await this.dbService.getAll();


    }

    async validateQuery(query: ParsedQs): Promise<RequestParamsDTO> {
        console.log('Crypto Service - Validate Query Fired!');

        const queryDTO = plainToClass(RequestParamsDTO, query, { enableImplicitConversion: true });

        const validationErrors = await validate(queryDTO);

        if (validationErrors.length !== 0) {
            console.log(validationErrors)
            const errStr = validationErrors
                .map(
                    err => Object
                        .values(err.constraints)
                        .join(', '))
                .join('; ');
            throw new Error(errStr);
        }

        return queryDTO;
    };

    getIntervalTime(timeInterval: TimeIntervals): number {
        return IntervalToTime[timeInterval];
    }

    generateTimestampArray(requestParamsDTO: RequestParamsDTO): Date[] {
        const { start_date, end_date, interval } = requestParamsDTO;
        const timestampArr = [];

        // If 


        // Handle "Variable interval"
        if (interval === TimeIntervals['1 month']) {
            // If start is the first date of the month - first stamp or first day of the next month
            const firstStampDate = start_date.getUTCDate() === 1
                ? new Date(start_date.getUTCFullYear(),
                    start_date.getUTCMonth(),
                    1,
                    start_date.getTimezoneOffset() / -60)   // We need to add timezone offset to prevent infinite loop
                : new Date(start_date.getUTCFullYear(),
                    start_date.getUTCMonth() + 1,
                    1,
                    start_date.getTimezoneOffset() / -60);

            for (let iteratorDate = firstStampDate;
                (iteratorDate.getUTCFullYear() <= end_date.getUTCFullYear()) &&
                (iteratorDate.getUTCMonth() <= end_date.getUTCMonth());
                iteratorDate = new Date(iteratorDate.getUTCFullYear(),
                    iteratorDate.getUTCMonth() + 1,
                    1,
                    iteratorDate.getTimezoneOffset() / -60)) {
                timestampArr.push(iteratorDate);
            }

            return timestampArr;
        }
        else {
            const intervalTime = this.getIntervalTime(interval);
            const firstStampDate = new Date(Math.ceil(start_date.getTime() / intervalTime) * intervalTime);

            console.log(`IntervalTime - ${intervalTime}`);
            console.log(`FirstStampDate:`, firstStampDate);

            for (
                let iteratorTime = firstStampDate.getTime();
                iteratorTime <= end_date.getTime();
                iteratorTime += intervalTime
            ) {
                timestampArr.push(new Date(iteratorTime))
            }
        }
        return timestampArr;
    }

    generateTimedStamps(startDate: Date, endDate: Date, intervalTime: number): Date[] {
        const result: Date[] = [];
        const firstDate = new Date(
            Math.ceil(startDate.getTime() / intervalTime) * intervalTime
        )

        for (
            let iteratorTime = firstDate.getTime();
            iteratorTime <= endDate.getTime();
            iteratorTime += intervalTime
        ) {
            result.push(new Date(iteratorTime));
        }

        return result;
    }

    generateWeeklyStamps(startDate: Date, endDate: Date): Date[] {
        const result: Date[] = [];
        const firstDate = new Date(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getDate() + (8 - startDate.getUTCDay()) % 7,  // The date of the closest monday
            startDate.getTimezoneOffset() / -60,    // Adjust for the timezone
        );

        for (
            let iteratorTime = firstDate.getTime();
            iteratorTime < endDate.getTime();
            iteratorTime += 1000 * 60 * 60 * 24 * 7     // 7 day worth of time
        ) {
            result.push(new Date(iteratorTime));
        }

        return result;
    }

    generateMonthStamps(startDate: Date, endDate: Date): Date[] {
        const result: Date[] = [];
        const firstDate = startDate.getDate() === 1
            ? new Date(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                1,
                startDate.getTimezoneOffset() / -60
            )
            : new Date(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth() + 1,
                1,
                startDate.getTimezoneOffset() / -60
            );

        for (
            let iteratorDate = firstDate;
            iteratorDate <= endDate;
            iteratorDate = new Date(
                iteratorDate.getUTCFullYear(),
                iteratorDate.getUTCMonth() + 1,
                1,
                iteratorDate.getTimezoneOffset() / -60
            )
        ) {
            result.push(iteratorDate);
        }

        return result;
    }
}