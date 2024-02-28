import { Injectable } from '@nestjs/common';
import { RequestParamsDTO } from '../../dtos';
import { TimeIntervals } from 'src/shared/enums/intervals.enum';
import { IntervalToTime } from 'src/shared/intervalsToTime.map';

@Injectable()
export class TimeLogicService {
    generateTimestampArray(requestParamsDTO: RequestParamsDTO): Date[] {
        const { start_date: startDate, end_date: endDate, interval } = requestParamsDTO;

        let firstStamp: Date = undefined, dateIterator: (date: Date) => Date = undefined;

        if (interval === TimeIntervals['1 month']) {
            firstStamp = this.closestMonthStart(startDate);
            dateIterator = this.nextMonthStart;
        }
        else if (interval === TimeIntervals['1 week']) {
            firstStamp = this.closestWeekStart(startDate);
            dateIterator = (date: Date) => new Date(date.getTime() + this.getIntervalTime(interval));
        }
        else {
            const intervalTime = this.getIntervalTime(interval);
            firstStamp = this.closestIntervalStart(startDate, intervalTime);
            dateIterator = (date: Date) => new Date(date.getTime() + intervalTime);
        }

        return this.generateStampsArray(firstStamp, endDate, dateIterator);
    };

    isCompleteInterval(stampDate: Date, stampInterval: TimeIntervals, queryDate: Date): boolean {
        return (stampDate.getTime() + this.getIntervalTime(stampInterval)) <= queryDate.getTime()
    }

    private getIntervalTime(timeInterval: TimeIntervals): number {
        return IntervalToTime[timeInterval];
    };

    private generateStampsArray(fromDate: Date, toDate: Date, nextDate: (date: Date) => Date) {
        const stampsArray: Date[] = [];

        for (
            let iteratorDate = fromDate;
            iteratorDate <= toDate;
            iteratorDate = nextDate(iteratorDate)
        ) {
            stampsArray.push(iteratorDate);
        }

        return stampsArray;
    };

    private closestIntervalStart(fromDate: Date, intervalTime: number): Date {
        return new Date(
            Math.ceil(
                fromDate.getTime() / intervalTime
            ) * intervalTime
        )
    };

    private closestWeekStart(fromDate: Date): Date {
        return new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate() + (8 - fromDate.getDay()) % 7,     // Closest monday
            fromDate.getTimezoneOffset() / -60      // Adjust for the timezone
        )
    };

    private nextMonthStart(fromDate: Date): Date {
        return new Date(
            fromDate.getFullYear(),
            fromDate.getMonth() + 1,
            1,
            fromDate.getTimezoneOffset() / -60
        )
    };

    private closestMonthStart(fromDate: Date): Date {
        return fromDate.getTime() === new Date(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            1,
            fromDate.getTimezoneOffset() / -60
        ).getTime()
            ? fromDate
            : this.nextMonthStart(fromDate);
    };
}
