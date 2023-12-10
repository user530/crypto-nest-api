import { TimeIntervals } from './enums/intervals.enum';

export const IntervalToTime: Record<TimeIntervals, number> = {
    "1min": 1000 * 60,
    "5min": 1000 * 60 * 5,
    "15min": 1000 * 60 * 15,
    "30min": 1000 * 60 * 30,
    "45min": 1000 * 60 * 45,
    "1h": 1000 * 60 * 60,
    "2h": 1000 * 60 * 60 * 2,
    "4h": 1000 * 60 * 60 * 4,
    "1day": 1000 * 60 * 60 * 24,
    "1week": 1000 * 60 * 60 * 24 * 7,
    "1month": 1000 * 60 * 60 * 24 * 7 * 30, // INCORRECT BUT NOT REALLY USED
}